import React, { useState } from 'react'

interface Chat {
    id: string
    title: string
    lastMessage: string
    timestamp: string
    model: string
}

interface Message {
    id: string
    content: string
    sender: 'user' | 'assistant'
    timestamp: string
}

interface ChatWindowProps {
    selectedChat: Chat | undefined
    onNewChat: () => void
}

function ChatWindow({ selectedChat, onNewChat }: ChatWindowProps) {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            content: 'Hello! How can I help you today?',
            sender: 'assistant',
            timestamp: '10:30 AM'
        }
    ])

    const handleSendMessage = () => {
        if (!message.trim()) return
        
        const newMessage: Message = {
            id: Date.now().toString(),
            content: message,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
        
        setMessages(prev => [...prev, newMessage])
        setMessage('')
        
        // TODO: Send message to AI and get response
        setTimeout(() => {
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                content: 'I received your message: "' + newMessage.content + '". This is a placeholder response.',
                sender: 'assistant',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
            setMessages(prev => [...prev, aiResponse])
        }, 1000)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    if (!selectedChat) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-900">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">Welcome to SafasChat</h3>
                    <p className="text-gray-400 mb-4">Select a chat from the sidebar or start a new conversation</p>
                    <button
                        onClick={onNewChat}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                    >
                        Start New Chat
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col bg-gray-900">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-700 bg-gray-800">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-medium text-white">{selectedChat.title}</h2>
                        <p className="text-sm text-gray-400">Model: {selectedChat.model}</p>
                    </div>
                    <div className="flex space-x-2">
                        <button className="p-2 text-gray-400 hover:text-white transition-colors duration-200">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                msg.sender === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-700 text-white'
                            }`}
                        >
                            <p className="text-sm">{msg.content}</p>
                            <p className="text-xs mt-1 opacity-70">{msg.timestamp}</p>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Message Input */}
            <div className="p-4 border-t border-gray-700 bg-gray-800">
                <div className="flex space-x-2">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={1}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors duration-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChatWindow