import { useState, useCallback, useEffect } from 'react'
import { db, type Chat, type Message } from '../lib/database'
import { StreamingService } from '../lib/streamingService'
import { useAuth } from '../contexts/AuthContext'

export const useChat = () => {
    const [chats, setChats] = useState<Chat[]>([])
    const [currentChatId, setCurrentChatId] = useState<number | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [isStreaming, setIsStreaming] = useState(false)
    const [streamingService] = useState(() => new StreamingService())
    const {user} = useAuth()

    const getBackendUrl = () => {
        return import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
    }

    // Load chats from database
    const loadChats = useCallback(async () => {
        if (!user) return
        
        try {
            // First, load existing local chats and filter by current user
            const allLocalChats = await db.chats.orderBy('updatedAt').reverse().toArray()
            
            // Filter out chats that don't belong to the current user
            const userLocalChats = allLocalChats.filter(chat => chat.userId === user.id)
            
            // Delete chats that don't belong to the current user
            const otherUserChats = allLocalChats.filter(chat => chat.userId !== user.id)
            for (const chat of otherUserChats) {
                if (chat.id) {
                    // Delete the chat and its associated messages
                    await db.messages.where('chatId').equals(chat.id).delete()
                    await db.chats.delete(chat.id)
                }
            }
            
            // Fetch chats from backend
            const response = await fetch(`${getBackendUrl()}/api/chats?userId=${user.id}`, {
                credentials: 'include'
            })
            
            if (response.ok) {
                const backendChats = await response.json()
                
                // Create a map of existing local chats by ID for efficient lookup
                const localChatMap = new Map(userLocalChats.map(chat => [chat.id, chat]))
                
                // Consolidate: update existing chats and add new ones from backend
                for (const backendChat of backendChats) {
                    const chatData = {
                        id: backendChat.id,
                        title: backendChat.title,
                        model: backendChat.model,
                        userId: backendChat.userId,
                        createdAt: new Date(backendChat.createdAt),
                        updatedAt: new Date(backendChat.updatedAt)
                    }
                    
                    if (localChatMap.has(backendChat.id)) {
                        // Update existing chat if backend version is newer
                        const localChat = localChatMap.get(backendChat.id)

                        if (!localChat) continue
                        if (new Date(backendChat.updatedAt) > localChat.updatedAt) {
                            await db.chats.update(backendChat.id, chatData)
                        }
                    } else {
                        // Add new chat from backend
                        await db.chats.add(chatData)
                    }
                }
                
                // Update local state with consolidated data
                const allChats = await db.chats.orderBy('updatedAt').reverse().toArray()
                setChats(allChats)
            } else {
                // Fallback to filtered local data if backend is unavailable
                setChats(userLocalChats)
            }
        } catch (error) {
            // Fallback to filtered local data
            const allChats = await db.chats.orderBy('updatedAt').reverse().toArray()
            const userChats = allChats.filter(chat => chat.userId === user.id)
            setChats(userChats)
            console.error('Error fetching chats:', error)
        }
    }, [user])

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
        if (!user) return
        
        const now = new Date()
        const chatId = await db.chats.add({
        title,
        model,
        userId: user.id,
        createdAt: now,
        updatedAt: now
        })
        
        await loadChats()
        setCurrentChatId(chatId)
        setMessages([])
        return chatId
    }, [loadChats, user])

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

    // Sync local data to backend
    const syncToBackend = useCallback(async (chatId: number) => {
        if (!user) return
        
        try {
            // Get chat data
            const chat = await db.chats.get(chatId)
            if (!chat) return
            
            // Get all messages for this chat
            const messages = await db.messages
                .where('chatId')
                .equals(chatId)
                .toArray()
            
            // Sync to backend
            const response = await fetch(`${getBackendUrl()}/api/sync`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    chat: {
                        id: chat.id,
                        title: chat.title,
                        model: chat.model,
                        userId: chat.userId,
                        createdAt: chat.createdAt,
                        updatedAt: chat.updatedAt
                    },
                    messages: messages.map(msg => ({
                        id: msg.id,
                        chatId: msg.chatId,
                        content: msg.content,
                        role: msg.role,
                        isStreaming: msg.isStreaming || false,
                        reasoning: msg.reasoning || '',
                        timestamp: msg.timestamp,
                        createdAt: msg.timestamp // Use timestamp as createdAt
                    }))
                })
            })
            
            if (!response.ok) {
                console.error('Failed to sync to backend:', response.statusText)
            }
        } catch (error) {
            console.error('Error syncing to backend:', error)
        }
    }, [user])

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
            isStreaming: true,
            reasoning: '' // Initialize reasoning field
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
        let accumulatedReasoning = ''
    
        // Check if the model supports reasoning
        const modelSupportsReasoning = model.includes('o1') || model.includes('reasoning')
    
        streamingService.streamChat({
            model,
            messages: contextMessages,
            apiKey,
            reasoning: modelSupportsReasoning,
            onChunk: async (chunk: string) => {
                accumulatedContent += chunk
                
                // Update message content in database and state
                await db.messages.update(assistantMessageId, { 
                    content: accumulatedContent 
                })
                
                setMessages(prev => prev.map(msg => 
                    msg.id === assistantMessageId 
                        ? { ...msg, content: accumulatedContent }
                        : msg
                ))
            },
            onReasoning: async (reasoning: string) => {
                accumulatedReasoning += reasoning
                
                // Update reasoning in database and state
                await db.messages.update(assistantMessageId, { 
                    reasoning: accumulatedReasoning 
                })
                
                setMessages(prev => prev.map(msg => 
                    msg.id === assistantMessageId 
                        ? { ...msg, reasoning: accumulatedReasoning }
                        : msg
                ))
            },
            onComplete: async () => {
                // Mark streaming as complete and save final content and reasoning
                await db.messages.update(assistantMessageId, { 
                    content: accumulatedContent,
                    reasoning: accumulatedReasoning,
                    isStreaming: false 
                })
                
                setMessages(prev => prev.map(msg => 
                    msg.id === assistantMessageId 
                        ? { ...msg, content: accumulatedContent, reasoning: accumulatedReasoning, isStreaming: false }
                        : msg
                ))
                
                // Update chat's last updated time
                await db.chats.update(currentChatId, { 
                    updatedAt: new Date() 
                })
                
                setIsStreaming(false)
                
                // Sync to backend after streaming is complete
                await syncToBackend(currentChatId)
                
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
    }, [currentChatId, isStreaming, streamingService, loadChats, generateTitle, syncToBackend])

    // Select chat
    const selectChat = useCallback(async (chatId: number) => {
        setCurrentChatId(chatId)
        await loadMessages(chatId)
    }, [loadMessages])

    // Delete chat
    const deleteChat = useCallback(async (chatId: number) => {
        try {
            // First, delete from backend
            const response = await fetch(`${getBackendUrl()}/api/chats/${chatId}`, {
                method: 'DELETE',
                credentials: 'include'
            })
            
            if (!response.ok) {
                console.error('Failed to delete chat from backend:', response.statusText)
                // You might want to show an error message to the user here
                return
            }
            
            // If backend deletion successful, delete locally
            await db.messages.where('chatId').equals(chatId).delete()
            await db.chats.delete(chatId)
            
            if (currentChatId === chatId) {
                setCurrentChatId(null)
                setMessages([])
            }
            
            await loadChats()
        } catch (error) {
            console.error('Error deleting chat:', error)
            // You might want to show an error message to the user here
        }
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
        syncToBackend 
    }
}