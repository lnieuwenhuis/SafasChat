interface Chat {
    id: string
    title: string
    lastMessage: string
    timestamp: string
    model: string
}

interface ChatSidebarProps {
    chats: Chat[]
    selectedChatId: string | null
    onSelectChat: (chatId: string) => void
    onNewChat: () => void
}

function ChatSidebar({ chats, selectedChatId, onSelectChat, onNewChat }: ChatSidebarProps) {
    return (
        <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">Chats</h2>
                    <button
                        onClick={onNewChat}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors duration-200"
                        title="New Chat"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
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
                        <p>No chats yet</p>
                        <p className="text-sm mt-1">Start a new conversation!</p>
                    </div>
                ) : (
                    chats.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => onSelectChat(chat.id)}
                            className={`p-4 border-b border-gray-700 cursor-pointer transition-colors duration-200 hover:bg-gray-700 ${
                                selectedChatId === chat.id ? 'bg-gray-700 border-l-4 border-l-blue-500' : ''
                            }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-white font-medium truncate">{chat.title}</h3>
                                    <p className="text-gray-400 text-sm truncate mt-1">{chat.lastMessage}</p>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-xs text-gray-500">{chat.timestamp}</span>
                                        <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded">{chat.model}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default ChatSidebar