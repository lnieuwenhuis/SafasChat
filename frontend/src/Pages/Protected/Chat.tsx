import { usePageTitle } from '../../Hooks/usePageTitle'
import Header from '../../Components/General/Header'
import ChatSidebar from '../../Components/Chat/ChatSidebar'
import ChatWindow from '../../Components/Chat/ChatWindow'
import { useChat } from '../../Hooks/useChat'

function Chat() {
    usePageTitle('Chat')
    
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
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Header />
            
            <div className="flex h-[calc(100vh-4rem)]">
                {/* Chat Sidebar */}
                <ChatSidebar 
                    chats={chats}
                    selectedChatId={currentChatId}
                    onSelectChat={selectChat}
                    onNewChat={handleNewChat}
                    onDeleteChat={deleteChat}
                />
                
                {/* Chat Window */}
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
    )
}

export default Chat