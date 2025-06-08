import Header from '../Components/General/Header'
import Footer from '../Components/General/Footer'
import { usePageTitle } from '../Hooks/usePageTitle'

function Terms() {
    usePageTitle('Terms')

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Header />
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <h1 className="text-4xl font-bold mb-8">
                    <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        Terms of Service
                    </span>
                </h1>
                
                <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 text-lg mb-6">
                        Last updated: {new Date().getFullYear()}
                    </p>
                    
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-white">About SafasChat</h2>
                        <p className="text-gray-300 mb-4">
                            SafasChat is a free, open-source hobby project that provides access to AI models 
                            through OpenRouter. By using this service, you agree to these terms.
                        </p>
                    </section>
                    
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-white">Use of Service</h2>
                        <p className="text-gray-300 mb-4">
                            SafasChat is provided "as is" without any warranties. This is a hobby project, 
                            so there may be bugs, downtime, or other issues. Use it at your own discretion.
                        </p>
                        <p className="text-gray-300 mb-4">
                            Please use the service responsibly and don't try to break it or use it for 
                            anything harmful or illegal.
                        </p>
                    </section>
                    
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-white">AI Model Usage</h2>
                        <p className="text-gray-300 mb-4">
                            The AI models are provided by OpenRouter and their respective creators. 
                            Your use of these models is subject to their terms and policies as well.
                        </p>
                        <p className="text-gray-300 mb-4">
                            Don't use the AI models to generate harmful, illegal, or inappropriate content.
                        </p>
                    </section>
                    
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-white">Limitation of Liability</h2>
                        <p className="text-gray-300 mb-4">
                            This is a free hobby project. I'm not liable for any issues, damages, or problems 
                            that might arise from using SafasChat. Use it at your own risk.
                        </p>
                    </section>
                    
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-white">Changes to Terms</h2>
                        <p className="text-gray-300 mb-4">
                            I might update these terms occasionally. If I do, I'll update the date at the top. 
                            Continued use of the service means you accept any changes.
                        </p>
                    </section>
                    
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-white">Contact</h2>
                        <p className="text-gray-300 mb-4">
                            Questions about these terms? Feel free to open an issue on the GitHub repository.
                        </p>
                    </section>
                </div>
            </div>
            
            <Footer />
        </div>
    )
}

export default Terms