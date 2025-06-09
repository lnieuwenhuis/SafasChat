import MDEditor from '@uiw/react-md-editor'
import { type Message } from '../../lib/database'

interface MessageComponentProps {
    message: Message;
}

function MessageComponent({ message }: MessageComponentProps) {
    const isUser = message.role === 'user';
    const isStreaming = message.isStreaming;

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className="max-w-[70%] space-y-3">
                {/* Reasoning section - only for assistant messages */}
                {!isUser && message.reasoning && (
                    <div className="bg-slate-800/50 border border-purple-600/30 rounded-lg p-3 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                            <span className="text-xs font-medium text-orange-300 uppercase tracking-wide">
                                AI Reasoning Process
                            </span>
                        </div>
                        <div className="text-xs text-slate-400 leading-relaxed font-mono bg-slate-900/30 p-2 rounded border-l-2 border-purple-400/30">
                            {message.reasoning}
                        </div>
                    </div>
                )}
                
                {/* Main message content */}
                <div className={`rounded-lg backdrop-blur-sm ${
                    isUser 
                        ? 'bg-purple-600/90 border border-purple-500/50 text-white' 
                        : 'bg-slate-800/50 border border-purple-600/30 text-white'
                }`}>
                    {/* Header with indicator for assistant messages */}
                    {!isUser && (
                        <div className="flex items-center gap-2 px-4 pt-3 pb-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                            <span className="text-xs font-medium text-blue-300 uppercase tracking-wide">
                                AI Response
                            </span>
                        </div>
                    )}
                    
                    {/* Content area */}
                    <div className={`px-4 ${!isUser ? 'pb-3' : 'py-3'}`}>
                        <div className="prose prose-invert max-w-none">
                            <MDEditor.Markdown 
                                source={message.content} 
                                style={{ 
                                    backgroundColor: 'transparent',
                                    color: 'inherit'
                                }}
                                data-color-mode="dark"
                            />
                        </div>
                        
                        {/* Streaming indicator */}
                        {isStreaming && (
                            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-purple-600/20">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                </div>
                                <span className="text-xs text-purple-300">Generating...</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MessageComponent;
