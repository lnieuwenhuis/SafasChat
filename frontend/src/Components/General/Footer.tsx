import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <img src="/favicon.png" alt="SafasChat Logo" className="w-8 h-8" />
                <span className="text-white text-xl font-bold">SafasChat</span>
            </div>
            <div className="flex space-x-6">
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200">Privacy</Link>
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors duration-200">Terms</Link>
                <a href="https://github.com/lnieuwenhuis/SafasChat" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">GitHub</a>
            </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2025 SafasChat. Open source and free forever.</p>
            </div>
        </div>
        </footer>
    );
};

export default Footer;