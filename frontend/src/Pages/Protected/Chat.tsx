import { useState } from 'react'
import { usePageTitle } from '../../Hooks/usePageTitle'
import DashboardHeader from '../../Components/General/DashboardHeader'
import ChatSidebar from '../../Components/Chat/ChatSidebar'
import ChatWindow from '../../Components/Chat/ChatWindow'

interface Chat {
    id: string
    title: string
    lastMessage: string
    timestamp: string
    model: string
}

function Chat() {
    usePageTitle('Chat')
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
    
    // Mock data - replace with actual data fetching
    const [chats] = useState<Chat[]>([
        {
            id: '1',
            title: 'Getting Started with React',
            lastMessage: 'How do I create a new React component?',
            timestamp: '2 minutes ago',
            model: 'GPT-4'
        },
        {
            id: '2',
            title: 'TypeScript Questions',
            lastMessage: 'What are the benefits of using TypeScript?',
            timestamp: '1 hour ago',
            model: 'Claude'
        },
        {
            id: '3',
            title: 'CSS Styling Help',
            lastMessage: 'How can I center a div?',
            timestamp: '3 hours ago',
            model: 'GPT-3.5'
        }
    ])

    const selectedChat = chats.find(chat => chat.id === selectedChatId)

    const handleNewChat = () => {
        // TODO: Implement new chat creation
        console.log('Creating new chat...')
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <DashboardHeader />
            
            <div className="flex h-[calc(100vh-4rem)]">
                {/* Chat Sidebar */}
                <ChatSidebar 
                    chats={chats}
                    selectedChatId={selectedChatId}
                    onSelectChat={setSelectedChatId}
                    onNewChat={handleNewChat}
                />
                
                {/* Chat Window */}
                <ChatWindow 
                    selectedChat={selectedChat}
                    onNewChat={handleNewChat}
                />
            </div>
        </div>
    )
}

export default Chat