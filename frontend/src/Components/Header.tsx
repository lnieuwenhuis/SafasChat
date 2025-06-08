import { Link } from 'react-router-dom'

function Header() {
    return (
        <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SC</span>
                </div>
                <span className="text-white text-xl font-bold">SafasChat</span>
            </Link>
            
            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
                <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-200">
                Home
                </Link>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-200">
                About
                </Link>
                <a href="#features" className="text-gray-300 hover:text-white transition-colors duration-200">
                Features
                </a>
                <a href="#models" className="text-gray-300 hover:text-white transition-colors duration-200">
                Models
                </a>
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