import Header from './Header'
import Footer from './Footer'
import { usePageTitle } from '../Hooks/usePageTitle'

function About() {
    usePageTitle('About')
    
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Header />
            
            {/* Hero Section */}
            <section className="py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                            About SafasChat
                        </span>
                    </h1>
                    <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                        A simple, free way to chat with different AI models in one place. Built as a hobby project to make AI more accessible.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 bg-gray-800">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Why I Built This</h2>
                            <p className="text-gray-300 text-lg mb-4">
                                I wanted a simple way to try different AI models without signing up for multiple services or paying subscription fees. So I built SafasChat as a hobby project.
                            </p>
                            <p className="text-gray-300 text-lg mb-4">
                                It uses OpenRouter's free tier models, which means you can chat with various AI models without any cost. Perfect for experimenting, learning, or just having fun with AI.
                            </p>
                            <p className="text-gray-300 text-lg">
                                SafasChat was originally developed as part of a contest held by T3Chat and Theo Browne. What started as a contest entry has become a fun side project that I hope others find useful too.
                            </p>
                        </div>
                        <div className="bg-gray-900 p-8 rounded-xl border border-gray-700">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-white font-bold text-2xl">🚀</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Always Free</h3>
                                <p className="text-gray-400">No plans to monetize this. It's just a hobby project that I want to keep free and simple.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">What I Care About</h2>
                        <p className="text-xl text-gray-300">The principles behind this project</p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🔓</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Open Source</h3>
                            <p className="text-gray-300">All the code is public on GitHub. Feel free to contribute, fork it, or learn from it.</p>
                        </div>
                        
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🔒</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Keep It Simple</h3>
                            <p className="text-gray-300">No user accounts, no data collection, no complicated setup. Just a simple interface to chat with AI.</p>
                        </div>
                        
                        <div className="text-center">
                            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🌍</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Free Access</h3>
                            <p className="text-gray-300">AI should be accessible to everyone, not just those who can afford premium subscriptions.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Community Section */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-6">Want to Help?</h2>
                    <p className="text-xl text-gray-300 mb-8">
                        This is just a hobby project, but if you find it useful and want to contribute, that would be awesome! Whether it's code, bug reports, or just feedback.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a 
                            href="https://github.com/lnieuwenhuis/SafasChat" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 border border-gray-600"
                        >
                            View on GitHub
                        </a>
                        <a 
                            href="https://github.com/lnieuwenhuis/SafasChat/issues" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                        >
                            Report Issues
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    )
}

export default About