import Header from '../../Components/General/Header'
import Footer from '../../Components/General/Footer'
import { usePageTitle } from '../../Hooks/usePageTitle'

function Privacy() {
    usePageTitle('Privacy Policy')

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Header />
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <h1 className="text-4xl font-bold mb-8">
                    <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        Privacy Policy
                    </span>
                </h1>
                
                <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 text-lg mb-6">
                        Last updated: {new Date().getFullYear()}
                    </p>
                    
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-white">What We Collect</h2>
                        <p className="text-gray-300 mb-4">
                            SafasChat stores your conversations in a database so you can access your chat history 
                            across sessions. We don't collect personal information beyond what's necessary for the 
                            chat functionality.
                        </p>
                    </section>
                    
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-white">Data Storage</h2>
                        <p className="text-gray-300 mb-4">
                            Your chat conversations are stored in our database to provide persistence across sessions. 
                            This data is used solely for providing you with access to your chat history and is not 
                            analyzed, sold, or used for any other purposes.
                        </p>
                        <p className="text-gray-300 mb-4">
                            We don't use your conversations for training, analytics, marketing, or any other purpose 
                            beyond showing them back to you.
                        </p>
                    </section>
                    
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-white">Third-Party Services</h2>
                        <p className="text-gray-300 mb-4">
                            SafasChat uses OpenRouter to access AI models. Your messages are sent to OpenRouter 
                            according to their privacy policy. We recommend reviewing OpenRouter's privacy policy 
                            for more information about how they handle data.
                        </p>
                    </section>
                    
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-white">Data Security</h2>
                        <p className="text-gray-300 mb-4">
                            We take reasonable measures to protect your stored conversations, but as this is a 
                            hobby project, we can't guarantee enterprise-level security. Use your own judgment 
                            about what information you share.
                        </p>
                    </section>
                    
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-white">Data Deletion</h2>
                        <p className="text-gray-300 mb-4">
                            If you want your conversation history deleted, you can contact me through GitHub issues 
                            and I'll remove your data from the database.
                        </p>
                    </section>
                    
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-white">Cookies</h2>
                        <p className="text-gray-300 mb-4">
                            We may use cookies for basic functionality like keeping you logged in and remembering 
                            your preferences. We don't use cookies for tracking or analytics.
                        </p>
                    </section>
                    
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-white">Contact</h2>
                        <p className="text-gray-300 mb-4">
                            If you have questions about this privacy policy, you can contact me through 
                            GitHub issues on the SafasChat repository.
                        </p>
                    </section>
                </div>
            </div>
            
            <Footer />
        </div>
    )
}

export default Privacy