import { useState, useEffect, type FC } from 'react';
import { Link } from 'react-router-dom';
import { usePageTitle } from '../../Hooks/usePageTitle';

const messages = [
    "Oops! This page went on vacation 🏖️",
    "404: Page not found, but your sense of humor is intact! 😄",
    "This page is playing hide and seek... and winning! 🙈",
    "Error 404: Page not found. Try turning it off and on again? 🔄",
    "The page you're looking for is in another castle 🏰"
];

const NotFound: FC = () => {
    usePageTitle('404 - Page Not Found | SafasChat');
    const [catPosition, setCatPosition] = useState({ x: 50, y: 50 });
    const [clicks, setClicks] = useState(0);
    const [showSecret, setShowSecret] = useState(false);
    const [currentMessage, setCurrentMessage] = useState(0);

    const moveCat = () => {
        setCatPosition({
        x: Math.random() * 80 + 10,
        y: Math.random() * 60 + 20
        });
        setClicks(prev => prev + 1);
        
        if (clicks >= 9) {
        setShowSecret(true);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
        setCurrentMessage(prev => (prev + 1) % messages.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4 relative overflow-hidden">
        {/* Floating background elements - Made more prominent */}
        <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-4 -left-4 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-lg opacity-40 animate-blob"></div>
            <div className="absolute -top-4 -right-4 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-lg opacity-40 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-lg opacity-40 animate-blob animation-delay-4000"></div>
            {/* Additional smaller, more visible circles */}
            <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-cyan-400 rounded-full filter blur-md opacity-30 animate-blob animation-delay-1000"></div>
            <div className="absolute bottom-1/3 left-1/3 w-24 h-24 bg-yellow-400 rounded-full filter blur-sm opacity-35 animate-blob animation-delay-3000"></div>
        </div>

        <div className="text-center z-10 max-w-2xl mx-auto">
            {/* Main 404 Display */}
            <div className="relative mb-8">
            <h1 className="text-9xl font-bold text-white mb-4 select-none">
                4
                <span className="inline-block transform hover:rotate-12 transition-transform duration-300">0</span>
                4
            </h1>
            
            {/* Interactive Cat */}
            <div 
                className="absolute cursor-pointer transition-all duration-500 ease-in-out hover:scale-110"
                style={{ 
                left: `${catPosition.x}%`, 
                top: `${catPosition.y}%`,
                transform: 'translate(-50%, -50%)'
                }}
                onClick={moveCat}
                title="Click me! 🐱"
            >
                <span className="text-4xl animate-bounce">
                {clicks < 5 ? '🐱' : clicks < 10 ? '😸' : '😻'}
                </span>
            </div>
            </div>

            {/* Dynamic Message */}
            <div className="mb-8">
            <p className="text-xl text-gray-300 mb-4 transition-all duration-500 ease-in-out">
                {messages[currentMessage]}
            </p>
            
            {showSecret && (
                <div className="bg-gray-800 border border-gray-600 p-4 mb-4 rounded animate-pulse">
                <p className="text-blue-400 font-medium">
                    🎉 Congratulations! You found the secret! You clicked the cat {clicks} times! 🎉
                </p>
                </div>
            )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link 
                to="/" 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
                🏠 Take Me Home
            </Link>
            
            <button 
                onClick={() => window.history.back()}
                className="inline-block bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
                ⬅️ Go Back
            </button>
            </div>

            {/* Fun Stats */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-400">{clicks}</div>
                <div className="text-sm text-gray-400">Cat Clicks</div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-400">∞</div>
                <div className="text-sm text-gray-400">Possibilities</div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <div className="text-2xl font-bold text-pink-400">1</div>
                <div className="text-sm text-gray-400">Lost Page</div>
            </div>
            </div>

            {/* Footer Message */}
            <div className="mt-8 text-gray-400 text-sm">
            <p>Don't worry, even the best explorers get lost sometimes! 🗺️</p>
            </div>
        </div>

        <style dangerouslySetInnerHTML={{
            __html: `
            @keyframes blob {
                0% {
                transform: translate(0px, 0px) scale(1);
                }
                33% {
                transform: translate(30px, -50px) scale(1.1);
                }
                66% {
                transform: translate(-20px, 20px) scale(0.9);
                }
                100% {
                transform: translate(0px, 0px) scale(1);
                }
            }
            .animate-blob {
                animation: blob 7s infinite;
            }
            .animation-delay-1000 {
                animation-delay: 1s;
            }
            .animation-delay-2000 {
                animation-delay: 2s;
            }
            .animation-delay-3000 {
                animation-delay: 3s;
            }
            .animation-delay-4000 {
                animation-delay: 4s;
            }
            `
        }} />
        </div>
    );
};

export default NotFound;