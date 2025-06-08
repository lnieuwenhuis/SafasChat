import { Link, useLocation } from 'react-router-dom'

function DashboardHeader() {
    const location = useLocation()
    
    const isActive = (path: string) => {
        return location.pathname === path
    }
    
    const handleLogout = () => {
        // TODO: Implement logout functionality
        console.log('Logout clicked')
    }

    return (
        <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
                <img src="/favicon.png" alt="SafasChat Logo" className="w-8 h-8" />
                <span className="text-white text-xl font-bold">SafasChat</span>
            </Link>
            
            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
                <Link 
                    to="/" 
                    className={`transition-colors duration-200 ${
                        isActive('/') 
                            ? 'text-blue-400 font-medium' 
                            : 'text-gray-300 hover:text-white'
                    }`}
                >
                Home
                </Link>
                <Link 
                    to="/about" 
                    className={`transition-colors duration-200 ${
                        isActive('/about') 
                            ? 'text-blue-400 font-medium' 
                            : 'text-gray-300 hover:text-white'
                    }`}
                >
                About
                </Link>
                <Link 
                    to="/dashboard" 
                    className={`transition-colors duration-200 ${
                        isActive('/dashboard') 
                            ? 'text-blue-400 font-medium' 
                            : 'text-gray-300 hover:text-white'
                    }`}
                >
                Dashboard
                </Link>
                <Link 
                    to="/chats" 
                    className={`transition-colors duration-200 ${
                        isActive('/chats') 
                            ? 'text-blue-400 font-medium' 
                            : 'text-gray-300 hover:text-white'
                    }`}
                >
                Chats
                </Link>
            </nav>
            
            {/* User Actions */}
            <div className="flex items-center space-x-4">
                {/* Profile Button */}
                <Link 
                to="/profile" 
                className={`flex items-center space-x-2 transition-colors duration-200 ${
                    isActive('/profile') 
                        ? 'text-blue-400' 
                        : 'text-gray-300 hover:text-white'
                }`}
                >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">U</span>
                </div>
                <span className="hidden sm:block">Profile</span>
                </Link>
                
                {/* Logout Button */}
                <button 
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                Logout
                </button>
            </div>
            </div>
        </div>
        </header>
    )
}

export default DashboardHeader