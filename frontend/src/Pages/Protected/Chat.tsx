import { useState } from 'react'
import { usePageTitle } from '../../Hooks/usePageTitle'
import Header from '../../Components/General/Header'
import ChatSidebar from '../../Components/Chat/ChatSidebar'
import ChatWindow from '../../Components/Chat/ChatWindow'
import { useChat } from '../../Hooks/useChat'

function Chat() {
    usePageTitle('Chat')
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    
    const {
        chats,
        currentChatId,
        messages,
        isStreaming,
        createNewChat,
        selectChat,
        sendMessage,
        deleteChat,
        stopStreaming
    } = useChat()

    const selectedChat = chats.find(chat => chat.id === currentChatId)

    const handleNewChat = async () => {
        await createNewChat('New Chat', 'deepseek/deepseek-chat-v3-0324:free')
        setIsSidebarOpen(false) // Close sidebar on mobile after creating chat
    }

    const handleSelectChat = (chatId: number) => {
        selectChat(chatId)
        setIsSidebarOpen(false) // Close sidebar on mobile after selecting chat
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Header />
            
            <div className="flex h-[calc(100vh-4rem)] relative">
                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
                
                {/* Chat Sidebar */}
                <div className={`
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:translate-x-0 fixed md:relative z-50 md:z-auto
                    transition-transform duration-300 ease-in-out
                    w-80 md:w-80 h-full
                `}>
                    <ChatSidebar 
                        chats={chats}
                        selectedChatId={currentChatId}
                        onSelectChat={handleSelectChat}
                        onNewChat={handleNewChat}
                        onDeleteChat={deleteChat}
                        onCloseSidebar={() => setIsSidebarOpen(false)}
                    />
                </div>
                
                {/* Chat Window */}
                <div className="flex-1 flex flex-col">
                    {/* Mobile Header with Menu Button */}
                    <div className="md:hidden bg-slate-800 border-b border-gray-700 p-4 flex items-center justify-between">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="text-white p-2 hover:bg-gray-700 rounded-lg"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h1 className="text-lg font-semibold">
                            {selectedChat?.title || 'SafasChat'}
                        </h1>
                        <button
                            onClick={handleNewChat}
                            className="text-white p-2 hover:bg-gray-700 rounded-lg"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>
                    
                    <ChatWindow 
                        selectedChat={selectedChat}
                        messages={messages}
                        isStreaming={isStreaming}
                        onSendMessage={sendMessage}
                        onStopStreaming={stopStreaming}
                        onNewChat={handleNewChat}
                    />
                </div>
            </div>
        </div>
    )
}

export default Chat