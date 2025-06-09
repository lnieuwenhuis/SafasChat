import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useState, useRef, useEffect } from 'react'

function Header() {
    const location = useLocation()
    const { user, signOut } = useAuth()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    
    const isActive = (path: string) => {
        if (path === '/') {
            return location.pathname === '/'
        }
        return location.pathname.startsWith(path)
    }

    const handleLogout = async () => {
        await signOut()
        setIsDropdownOpen(false)
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <header className="bg-slate-900 border-b border-purple-800/30 sticky top-0 z-50">
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
                
                {/* Authenticated Navigation */}
                {user && (
                    <>
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
                    </>
                )}
            </nav>
            
            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
                {user ? (
                    // Authenticated User Actions - Dropdown Menu
                    <div className="relative" ref={dropdownRef}>
                        <button 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer"
                        >
                            <img 
                                src={user.image || '/default-avatar.png'} 
                                alt="Profile" 
                                className="w-8 h-8 rounded-full"
                                onError={(e) => {
                                    e.currentTarget.src = '/default-avatar.png'
                                }}
                            />
                            <span className="hidden sm:block">{user.name}</span>
                            <svg 
                                className={`w-4 h-4 transition-transform duration-200 ${
                                    isDropdownOpen ? 'rotate-180' : ''
                                }`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        
                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-lg border border-purple-700/30 py-1 z-50">
                                <Link 
                                    to="/profile" 
                                    className="flex items-center px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors duration-200"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Profile
                                </Link>
                                <Link 
                                    to="/settings" 
                                    className="flex items-center px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors duration-200"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Settings
                                </Link>
                                <hr className="border-gray-700 my-1" />
                                <button 
                                    onClick={handleLogout}
                                    className="flex items-center w-full px-4 py-2 text-red-400 hover:bg-slate-700 hover:text-red-300 transition-colors duration-200 cursor-pointer"
                                >
                                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    // Non-authenticated CTA
                    <Link 
                        to="/login" 
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 cursor-pointer"
                    >
                        Get Started
                    </Link>
                )}
            </div>
            </div>
        </div>
        </header>
    )
}

export default Header