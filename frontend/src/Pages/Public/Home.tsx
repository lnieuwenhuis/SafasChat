import { Link } from 'react-router-dom'
import Header from '../../Components/General/Header'
import Footer from '../../Components/General/Footer'
import { usePageTitle } from '../../Hooks/usePageTitle'

function Home() {
    usePageTitle('Home')
    
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Header />
            
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 lg:py-32">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        {/* Logo */}
                        <div className="flex justify-center mb-8">
                            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
                                <span className="text-3xl font-bold text-white">SC</span>
                            </div>
                        </div>
                        
                        <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                            <span className="text-white">SafasChat</span>
                        </h1>
                        
                        <p className="text-xl lg:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
                            A simple AI chat application powered by multiple models. 
                            <br className="hidden sm:block" />
                            Part of my hobby projects at <a href="https://safasfly.dev" className="text-blue-400 hover:text-blue-300 transition-colors">safasfly.dev</a> • Hosted at <span className="text-purple-400">ai.safasfly.dev</span>
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                            <Link 
                                to="/login" 
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 inline-block text-center"
                            >
                                Try It Out
                            </Link>
                            <a 
                                href="https://github.com/lnieuwenhuis/SafasChat" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="border border-gray-600 hover:border-gray-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:bg-gray-800 inline-block text-center"
                            >
                                View on GitHub
                            </a>
                        </div>
                    </div>
                </div>
                
                {/* Background decoration */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                    <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
                </div>
            </section>
            
            {/* What It Does Section */}
            <section className="py-20 bg-gray-800">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wide mb-2">WHAT IT DOES</h2>
                        <h3 className="text-4xl font-bold text-white">Basic chat functionality</h3>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <h4 className="text-xl font-semibold text-white mb-3">AI-powered messaging</h4>
                            <p className="text-gray-300">Chat with multiple AI models including DeepSeek, Mistral, and more using a simple interface.</p>
                        </div>
                        
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h4 className="text-xl font-semibold text-white mb-3">Google login</h4>
                            <p className="text-gray-300">Simple authentication with your Google account. No complex signups required.</p>
                        </div>
                        
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h4 className="text-xl font-semibold text-white mb-3">Mobile friendly</h4>
                            <p className="text-gray-300">Works on your phone and desktop. Responsive design for all devices.</p>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Footer Note */}
            <section className="py-12 text-center">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-gray-400">
                        Just a simple AI chat app I built to experiment with different models. Check out my{' '}
                        <a href="https://safasfly.dev" className="text-blue-400 hover:text-blue-300 transition-colors">other projects</a>.
                    </p>
                </div>
            </section>
            
            <Footer />
        </div>
    )
}

export default Home