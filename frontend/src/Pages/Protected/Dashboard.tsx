import { useState } from 'react'
import { usePageTitle } from '../../Hooks/usePageTitle'
import DashboardHeader from '../../Components/General/DashboardHeader'

function Dashboard() {
    usePageTitle('Dashboard')
    const [activeTab, setActiveTab] = useState('overview')

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Dashboard Header */}
            <DashboardHeader />
            
            {/* Navigation Tabs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-">
                <div className="border-b border-gray-700">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {[
                            { id: 'overview', name: 'Overview' },
                            { id: 'chats', name: 'Recent Chats' },
                            { id: 'analytics', name: 'Analytics' },
                            { id: 'settings', name: 'Settings' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`${
                                    activeTab === tab.id
                                        ? 'border-blue-500 text-blue-400'
                                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                                } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Stats Cards */}
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <h3 className="text-lg font-medium text-white mb-2">Total Chats</h3>
                            <p className="text-3xl font-bold text-blue-400">0</p>
                            <p className="text-sm text-gray-400 mt-2">No chats yet</p>
                        </div>
                        
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <h3 className="text-lg font-medium text-white mb-2">Messages Sent</h3>
                            <p className="text-3xl font-bold text-green-400">0</p>
                            <p className="text-sm text-gray-400 mt-2">Start chatting!</p>
                        </div>
                        
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <h3 className="text-lg font-medium text-white mb-2">Favorite Model</h3>
                            <p className="text-xl font-bold text-purple-400">None</p>
                            <p className="text-sm text-gray-400 mt-2">Try different models</p>
                        </div>
                    </div>
                )}

                {activeTab === 'chats' && (
                    <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center">
                        <h3 className="text-xl font-medium text-white mb-4">Recent Chats</h3>
                        <p className="text-gray-400">No recent chats found. Start a new conversation!</p>
                        <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200">
                            Start New Chat
                        </button>
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center">
                        <h3 className="text-xl font-medium text-white mb-4">Analytics</h3>
                        <p className="text-gray-400">Analytics and usage statistics will appear here.</p>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
                        <h3 className="text-xl font-medium text-white mb-6">Dashboard Settings</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Default Model
                                </label>
                                <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option>GPT-4</option>
                                    <option>GPT-3.5 Turbo</option>
                                    <option>Claude</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Theme
                                </label>
                                <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option>Dark</option>
                                    <option>Light</option>
                                    <option>Auto</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard