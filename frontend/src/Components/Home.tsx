import Header from './Header'
import Footer from './Footer'
import { usePageTitle } from '../Hooks/usePageTitle'

function Home() {
    usePageTitle('Home')
    
    return (
        <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        
        {/* Hero Section */}
        <section className="relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
                <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    SafasChat
                </span>
                <br />
                <span className="text-white">Simple AI Chat</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                A free, simple way to chat with different AI models in one place. 
                No signups, no subscriptions, just AI conversation.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105">
                    Try It Out
                </button>
                <a href="https://github.com/lnieuwenhuis/SafasChat" target="_blank" rel="noopener noreferrer" className="border border-gray-600 hover:border-gray-500 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:bg-gray-800 inline-block">
                    View on GitHub
                </a>
                </div>
            </div>
            </div>
            
            {/* Background decoration */}
            <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
            </div>
        </section>
        
        {/* Features Section */}
        <section id="features" className="py-24 bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">What Makes It Nice</h2>
                <p className="text-xl text-gray-300">Simple features for a simple tool</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-gray-900 p-8 rounded-xl border border-gray-700">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl">🆓</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Completely Free</h3>
                <p className="text-gray-300">Uses free AI models from OpenRouter. No hidden costs or premium features.</p>
                </div>
                
                <div className="bg-gray-900 p-8 rounded-xl border border-gray-700">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl">🔓</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Open Source</h3>
                <p className="text-gray-300">All code is public. Fork it, improve it, or just see how it works.</p>
                </div>
                
                <div className="bg-gray-900 p-8 rounded-xl border border-gray-700">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl">🤖</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Multiple Models</h3>
                <p className="text-gray-300">Try different AI models like Llama, Mistral, and others in one place.</p>
                </div>
            </div>
            </div>
        </section>
        
        {/* Models Section */}
        <section id="models" className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">Available AI Models</h2>
                <p className="text-xl text-gray-300">Free models you can chat with right now</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                { name: 'Llama 3.2 3B', company: 'Meta', color: 'from-purple-400 to-purple-600' },
                { name: 'Llama 3.1 8B', company: 'Meta', color: 'from-purple-500 to-purple-700' },
                { name: 'Qwen 2.5 7B', company: 'Alibaba', color: 'from-red-400 to-red-600' },
                { name: 'Mistral 7B', company: 'Mistral AI', color: 'from-orange-400 to-orange-600' },
                { name: 'Gemma 2 9B', company: 'Google', color: 'from-blue-400 to-blue-600' },
                { name: 'Phi-3 Mini', company: 'Microsoft', color: 'from-green-400 to-green-600' },
                { name: 'CodeLlama 7B', company: 'Meta', color: 'from-indigo-400 to-indigo-600' },
                { name: 'And More...', company: 'Various Providers', color: 'from-gray-400 to-gray-600' }
                ].map((model, index) => (
                <div key={index} className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors duration-200">
                    <div className={`w-12 h-12 bg-gradient-to-r ${model.color} rounded-lg flex items-center justify-center mb-4`}>
                    {model.name === 'And More...' ? (
                        <span className="text-white font-bold text-lg">+</span>
                    ) : (
                        <span className="text-white font-bold text-lg">{model.name.charAt(0)}</span>
                    )}
                    </div>
                    <h3 className="text-lg font-semibold mb-1">{model.name}</h3>
                    <p className="text-gray-400 text-sm">{model.company}</p>
                </div>
                ))}
            </div>
            </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-center">
            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-4">Give It a Try</h2>
            <p className="text-xl mb-8 opacity-90">
                It's free, simple, and might be useful for your next AI conversation.
            </p>
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200 transform hover:scale-105">
                Start Chatting
            </button>
            </div>
        </section>
        
        <Footer />
        </div>
    )
}

export default Home