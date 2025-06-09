import React, { useState, useEffect, useRef } from 'react'
import { type Chat, type Message } from '../../lib/database'
import MessageComponent from './MessageComponent'

interface ChatWindowProps {
    selectedChat: Chat | undefined
    messages: Message[]
    isStreaming: boolean
    onSendMessage: (content: string, apiKey: string, model: string) => Promise<void>
    onStopStreaming: () => void
    onNewChat: () => void
}

// Available free models with descriptions and characteristics
const FREE_MODELS = [
    { 
        id: 'deepseek/deepseek-chat-v3-0324:free', 
        name: 'DeepSeek V3',
        description: 'General-purpose conversational AI model',
        speed: 'Medium',
        quality: 'High',
        reasoning: false
    },
    {
        id: 'deepseek/deepseek-r1-0528:free',
        name: 'DeepSeek R1 (0528)',
        description: 'May 28th update to the original DeepSeek R1',
        speed: 'Medium',
        quality: 'Very High',
        reasoning: true
    },
    { 
        id: 'deepseek/deepseek-r1-distill-qwen-32b:free', 
        name: 'DeepSeek R1 Qwen 32B',
        description: 'Qwen distilled version of Deepseek R1',
        speed: 'Fast',
        quality: 'High',
        reasoning: true
    },
    { 
        id: 'deepseek/deepseek-r1-distill-llama-70b:free', 
        name: 'DeepSeek R1 Llama 70B',
        description: 'Llama distilled version of Deepseek R1',
        speed: 'Medium',
        quality: 'Very High',
        reasoning: true
    },
    { 
        id: 'mistralai/mistral-7b-instruct:free', 
        name: 'Mistral 7B',
        description: 'Very fast and responsive, ideal for quick interactions',
        speed: 'Very Fast',
        quality: 'Medium',
        reasoning: false
    },
]

// Custom Model Dropdown Component
function ModelDropdown({ selectedModel, onModelChange, disabled = false }: {
    selectedModel: string
    onModelChange: (modelId: string) => void
    disabled?: boolean
}) {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    
    const selectedModelData = FREE_MODELS.find(m => m.id === selectedModel) || FREE_MODELS[0]
    
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])
    
    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className="flex items-center justify-between w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-[280px]"
            >
                <div className="text-left">
                    <div className="text-sm font-medium">{selectedModelData.name}</div>
                    <div className="text-xs text-gray-400 flex items-center space-x-2">
                        <span>{selectedModelData.speed}</span>
                        <span>•</span>
                        <span>{selectedModelData.quality}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                        <span className={selectedModelData.reasoning ? '' : 'line-through opacity-50'}>
                            Reasoning
                        </span>
                    </div>
                </div>
                <svg className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                    {FREE_MODELS.map((model) => (
                        <div
                            key={model.id}
                            onClick={() => {
                                onModelChange(model.id)
                                setIsOpen(false)
                            }}
                            className={`p-4 py-2 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0 ${
                                model.id === selectedModel ? 'bg-gray-700' : ''
                            }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1 text-left">
                                    <h4 className="text-sm font-medium text-white mb-1">{model.name}</h4>
                                    <p className="text-xs text-gray-400">{model.description}</p>
                                </div>
                                <div className="flex flex-col items-end space-y-1 text-xs ml-3">
                                    <div className="flex items-center space-x-2">
                                        <span 
                                            className={`px-2 py-0.5 rounded cursor-help text-xs ${
                                                model.speed === 'Very Fast' ? 'bg-green-900 text-green-300' :
                                                model.speed === 'Fast' ? 'bg-blue-900 text-blue-300' :
                                                'bg-yellow-900 text-yellow-300'
                                            }`}
                                            title={`Speed: ${model.speed} - How quickly the model responds to queries`}
                                        >
                                            {model.speed}
                                        </span>
                                        <span 
                                            className={`px-2 py-0.5 rounded cursor-help text-xs ${
                                                model.quality === 'Very High' ? 'bg-pink-900 text-pink-300' :
                                                model.quality === 'High' ? 'bg-purple-900 text-purple-300' :
                                                model.quality === 'Medium-High' ? 'bg-indigo-900 text-indigo-300' :
                                                'bg-gray-600 text-gray-300'
                                            }`}
                                            title={`Quality: ${model.quality} - Overall response quality and accuracy`}
                                        >
                                            {model.quality}
                                        </span>
                                    </div>
                                    <span 
                                        className={`px-2 py-0.5 rounded cursor-help text-xs ${
                                            model.reasoning 
                                                ? 'bg-orange-900 text-orange-300' 
                                                : 'bg-gray-600 text-gray-400 line-through opacity-60'
                                        }`}
                                        title={model.reasoning 
                                            ? 'Reasoning: Yes - This model can perform step-by-step logical reasoning' 
                                            : 'Reasoning: No - This model does not have advanced reasoning capabilities'
                                        }
                                    >
                                        Reasoning
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

function ChatWindow({ selectedChat, messages, isStreaming, onSendMessage, onStopStreaming, onNewChat }: ChatWindowProps) {
    const [message, setMessage] = useState('')
    const [selectedModel, setSelectedModel] = useState(FREE_MODELS[0].id)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || ''
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSendMessage = async () => {
        if (!message.trim() || !apiKey.trim() || isStreaming) return
        
        const messageContent = message
        setMessage('')
        
        await onSendMessage(messageContent, apiKey, selectedModel)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const handleStopStreaming = () => {
        onStopStreaming()
    }

    if (!selectedChat) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-900">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <div className="text-white font-bold text-3xl tracking-wider">
                            SC
                        </div>
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">Welcome to SafasChat</h3>
                    <p className="text-gray-400 mb-6">Select a chat from the sidebar or start a new conversation with AI models</p>
                    
                    {/* Model Selection */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Select Model</label>
                        <ModelDropdown 
                            selectedModel={selectedModel}
                            onModelChange={setSelectedModel}
                            disabled={!apiKey}
                        />
                    </div>
                    
                    {!apiKey && (
                        <div className="mb-4 p-3 bg-red-900/20 border border-red-700 rounded-lg">
                            <p className="text-red-400 text-sm">API key not configured. Please set VITE_OPENROUTER_API_KEY in your .env file.</p>
                        </div>
                    )}
                    
                    <button
                        onClick={onNewChat}
                        disabled={!apiKey}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors duration-200"
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
            <div className="bg-gray-800 border-b border-gray-700 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-white">{selectedChat.title}</h2>
                        <p className="text-sm text-gray-400">Model: {selectedChat.model}</p>
                    </div>
                    
                    {/* Model Selection */}
                    <div className="flex items-center space-x-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1">Model</label>
                            <ModelDropdown 
                                selectedModel={selectedModel}
                                onModelChange={setSelectedModel}
                                disabled={!apiKey}
                            />
                        </div>
                        
                        {!apiKey && (
                            <div className="text-xs text-red-400">
                                API key not configured
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-400 mt-8">
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <MessageComponent key={msg.id} message={msg} />
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-gray-800 border-t border-gray-700 p-4">
                <div className="flex space-x-4">
                    <div className="flex-1">
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={apiKey ? "Type your message..." : "Please configure API key first"}
                            disabled={!apiKey || isStreaming}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                            rows={3}
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        {isStreaming ? (
                            <button
                                onClick={handleStopStreaming}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6v4H9z" />
                                </svg>
                            </button>
                        ) : (
                            <button
                                onClick={handleSendMessage}
                                disabled={!message.trim() || !apiKey || isStreaming}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatWindow