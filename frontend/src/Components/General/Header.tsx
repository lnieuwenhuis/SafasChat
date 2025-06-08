import { Link, useLocation } from 'react-router-dom'

function Header() {
    const location = useLocation()
    
    const isActive = (path: string) => {
        if (path === '/') {
            return location.pathname === '/'
        }
        return location.pathname.startsWith(path)
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
            </nav>
            
            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
                <Link 
                to="/dashboard" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                Get Started
                </Link>
            </div>
            </div>
        </div>
        </header>
    )
}

export default Header