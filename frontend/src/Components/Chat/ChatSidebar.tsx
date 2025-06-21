import { useState, useEffect } from 'react'
import { type Chat, db } from '../../lib/database'

interface ChatSidebarProps {
    chats: Chat[]
    selectedChatId: number | null
    onSelectChat: (chatId: number) => void
    onNewChat: () => void
    onDeleteChat?: (chatId: number) => void
    onCloseSidebar?: () => void
}

function ChatSidebar({ chats, selectedChatId, onSelectChat, onNewChat, onDeleteChat, onCloseSidebar }: ChatSidebarProps) {
    const [lastMessages, setLastMessages] = useState<Record<number, string>>({})

    // Load last messages for all chats
    useEffect(() => {
        const loadLastMessages = async () => {
            const messageMap: Record<number, string> = {}
            
            for (const chat of chats) {
                const lastMessage = await db.messages
                    .where('chatId')
                    .equals(chat.id!)
                    .reverse()
                    .first()
                
                if (lastMessage) {
                    // Truncate long messages
                    const content = lastMessage.content.length > 50 
                        ? lastMessage.content.substring(0, 50) + '...'
                        : lastMessage.content
                    messageMap[chat.id!] = content
                } else {
                    messageMap[chat.id!] = 'Click to start chatting...'
                }
            }
            
            setLastMessages(messageMap)
        }

        if (chats.length > 0) {
            loadLastMessages()
        }
    }, [chats])

    // Helper function to get last message for a chat
    const getLastMessage = (chat: Chat) => {
        return lastMessages[chat.id!] || 'Click to start chatting...'
    }

    const getTimestamp = (chat: Chat) => {
        const now = new Date()
        const updated = new Date(chat.updatedAt)
        const diffMs = now.getTime() - updated.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        
        if (diffMins < 1) return 'Just now'
        if (diffMins < 60) return `${diffMins}m ago`
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
        return `${Math.floor(diffMins / 1440)}d ago`
    }

    return (
        <div className="w-full h-full bg-slate-800 border-r border-purple-700/30 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">Chats</h2>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={onNewChat}
                            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors duration-200"
                            title="New Chat"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                        {/* Close button for mobile */}
                        <button
                            onClick={onCloseSidebar}
                            className="md:hidden text-gray-400 hover:text-white p-2 rounded-lg transition-colors duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
                
                {/* Search */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search chats..."
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <svg className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>
            
            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
                {chats.length === 0 ? (
                    <div className="p-4 text-center text-gray-400">
                        <p className="text-sm mt-1">Start a new conversation!</p>
                    </div>
                ) : (
                    chats.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => onSelectChat(chat.id!)}
                            className={`
                                p-4 border-b border-gray-700 cursor-pointer transition-colors duration-200
                                hover:bg-slate-700
                                ${selectedChatId === chat.id ? 'bg-slate-700 border-l-4 border-l-blue-500' : ''}
                            `}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-white font-medium truncate">
                                        {chat.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                                        {getLastMessage(chat)}
                                    </p>
                                    <p className="text-gray-500 text-xs mt-1">
                                        {getTimestamp(chat)}
                                    </p>
                                </div>
                                {onDeleteChat && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onDeleteChat(chat.id!)
                                        }}
                                        className="text-gray-400 hover:text-red-400 p-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                        title="Delete Chat"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default ChatSidebar