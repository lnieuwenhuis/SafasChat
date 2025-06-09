import { useState, useCallback, useEffect } from 'react'
import { db, type Chat, type Message } from '../lib/database'
import { StreamingService } from '../lib/streamingService'

export const useChat = () => {
    const [chats, setChats] = useState<Chat[]>([])
    const [currentChatId, setCurrentChatId] = useState<number | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [isStreaming, setIsStreaming] = useState(false)
    const [streamingService] = useState(() => new StreamingService())

    // Load chats from database
    const loadChats = useCallback(async () => {
        const allChats = await db.chats.orderBy('updatedAt').reverse().toArray()
        setChats(allChats)
    }, [])

    // Load messages for a specific chat
    const loadMessages = useCallback(async (chatId: number) => {
        const chatMessages = await db.messages
        .where('chatId')
        .equals(chatId)
        .sortBy('timestamp')

        setMessages(chatMessages)
    }, [])

    // Create new chat
    const createNewChat = useCallback(async (title: string = 'New Chat', model: string = 'openai/gpt-4o') => {
        const now = new Date()
        const chatId = await db.chats.add({
        title,
        model,
        createdAt: now,
        updatedAt: now
        })
        
        await loadChats()
        setCurrentChatId(chatId)
        setMessages([])
        return chatId
    }, [loadChats])

    // Generate title using Mistral API
    const generateTitle = useCallback(async (userMessage: string, apiKey: string): Promise<string> => {
        try {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'mistralai/mistral-7b-instruct:free',
                    messages: [
                        {
                            role: 'system',
                            content: 'Generate a short, descriptive title (max 6 words) for a conversation that starts with the following user message. Only return the title, nothing else.'
                        },
                        {
                            role: 'user',
                            content: userMessage
                        }
                    ],
                    max_tokens: 20,
                    temperature: 0.7
                })
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            const title = data.choices?.[0]?.message?.content?.trim()
            
            // Clean up the title and ensure it's reasonable
            if (title && title.length > 0 && title.length <= 50) {
                return title.replace(/["']/g, '').trim()
            }
            
            // Fallback to first few words of user message
            return userMessage.split(' ').slice(0, 4).join(' ') + (userMessage.split(' ').length > 4 ? '...' : '')
        } catch (error) {
            console.error('Error generating title:', error)
            // Fallback to first few words of user message
            return userMessage.split(' ').slice(0, 4).join(' ') + (userMessage.split(' ').length > 4 ? '...' : '')
        }
    }, [])

    // Send message with streaming
    const sendMessage = useCallback(async (content: string, apiKey: string, model: string) => {
        if (!currentChatId || isStreaming) return

        // Check if this is the first message in the chat
        const existingMessages = await db.messages
            .where('chatId')
            .equals(currentChatId)
            .count()
        
        const isFirstMessage = existingMessages === 0

        const userMessage: Message = {
            chatId: currentChatId,
            content,
            role: 'user',
            timestamp: new Date()
        }

        // Add user message to database and state
        const userMessageId = await db.messages.add(userMessage)
        const userMessageWithId = { ...userMessage, id: userMessageId }
        setMessages(prev => [...prev, userMessageWithId])

        // Generate title if this is the first message
        if (isFirstMessage) {
            try {
                const newTitle = await generateTitle(content, apiKey)
                await db.chats.update(currentChatId, { 
                    title: newTitle,
                    updatedAt: new Date()
                })
                await loadChats() // Refresh chats to show new title
            } catch (error) {
                console.error('Error updating title:', error)
            }
        }

        // Create assistant message placeholder
        const assistantMessage: Message = {
            chatId: currentChatId,
            content: '',
            role: 'assistant',
            timestamp: new Date(),
            isStreaming: true
        }

        const assistantMessageId = await db.messages.add(assistantMessage)
        const assistantMessageWithId = { ...assistantMessage, id: assistantMessageId }
        setMessages(prev => [...prev, assistantMessageWithId])

        setIsStreaming(true)

        // Get chat context
        const chatMessages = await db.messages
            .where('chatId')
            .equals(currentChatId)
            .sortBy('timestamp')

        const contextMessages = chatMessages
            .filter(msg => !msg.isStreaming)
            .map(msg => ({ role: msg.role, content: msg.content }))

        // Update the chat's model if it's different
        const currentChat = await db.chats.get(currentChatId)
        if (currentChat && currentChat.model !== model) {
            await db.chats.update(currentChatId, { model })
        }

        let accumulatedContent = ''

        streamingService.streamChat({
            model,
            messages: contextMessages,
            apiKey,
            onChunk: async (chunk: string) => {
                accumulatedContent += chunk
                
                // Update message in database and state
                await db.messages.update(assistantMessageId, { 
                    content: accumulatedContent 
                })
                
                setMessages(prev => prev.map(msg => 
                    msg.id === assistantMessageId 
                        ? { ...msg, content: accumulatedContent }
                        : msg
                ))
            },
            onComplete: async () => {
                // Mark streaming as complete
                await db.messages.update(assistantMessageId, { 
                    isStreaming: false 
                })
                
                setMessages(prev => prev.map(msg => 
                    msg.id === assistantMessageId 
                        ? { ...msg, isStreaming: false }
                        : msg
                ))
                
                // Update chat's last updated time
                await db.chats.update(currentChatId, { 
                    updatedAt: new Date() 
                })
                
                setIsStreaming(false)
                await loadChats()
            },
            onError: async (error: Error) => {
                console.error('Streaming error:', error)
                
                // Update message with error
                await db.messages.update(assistantMessageId, { 
                    content: 'Sorry, there was an error processing your request.',
                    isStreaming: false 
                })
                
                setMessages(prev => prev.map(msg => 
                    msg.id === assistantMessageId 
                        ? { ...msg, content: 'Sorry, there was an error processing your request.', isStreaming: false }
                        : msg
                ))
                
                setIsStreaming(false)
            }
        })
    }, [currentChatId, isStreaming, streamingService, loadChats, generateTitle])

    // Select chat
    const selectChat = useCallback(async (chatId: number) => {
        setCurrentChatId(chatId)
        await loadMessages(chatId)
    }, [loadMessages])

    // Delete chat
    const deleteChat = useCallback(async (chatId: number) => {
        await db.messages.where('chatId').equals(chatId).delete()
        await db.chats.delete(chatId)
        
        if (currentChatId === chatId) {
        setCurrentChatId(null)
        setMessages([])
        }
        
        await loadChats()
    }, [currentChatId, loadChats])

    // Stop streaming
    const stopStreaming = useCallback(() => {
        streamingService.abort()
        setIsStreaming(false)
    }, [streamingService])

    useEffect(() => {
        loadChats()
    }, [loadChats])

    return {
        chats,
        currentChatId,
        messages,
        isStreaming,
        createNewChat,
        selectChat,
        sendMessage,
        deleteChat,
        stopStreaming,
        loadChats
    }
}