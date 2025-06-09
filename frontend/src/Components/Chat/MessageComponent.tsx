import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { type Message } from '../../lib/database'
import type { Components } from 'react-markdown'

type CodeComponentProps = React.HTMLAttributes<HTMLElement> & {
    children?: React.ReactNode;
    inline?: boolean;
    className?: string;
};

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
                            <ReactMarkdown
                                components={{
                                    code: ({
                                        className,
                                        children,
                                        inline,
                                        ...props
                                    }: CodeComponentProps) => {
                                        const codeString = String(children ?? '').replace(
                                            /\n$/,
                                            ''
                                        );
                                        const match = /language-(\w+)/.exec(
                                            className || ''
                                        );
                                        const language = match ? match[1] : '';

                                        return !inline && language ? (
                                            <SyntaxHighlighter
                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any                                        
                                                style={dracula as any}
                                                language={language}
                                                PreTag="div"
                                                className="rounded-md"
                                                customStyle={{
                                                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                                    color: 'inherit',
                                                    padding: 0,
                                                }}
                                                {...props}
                                            >
                                                {codeString}
                                            </SyntaxHighlighter>
                                        ) : (
                                            <code
                                                className="bg-purple-800/50 px-1 py-0.5 rounded text-sm"
                                                {...props}
                                            >
                                                {children}
                                            </code>
                                        );
                                    },
                                    p: ({ children }) => (
                                        <p className="mb-2 last:mb-0">{children}</p>
                                    ),
                                    ul: ({ children }) => (
                                        <ul className="list-disc list-inside mb-2">
                                            {children}
                                        </ul>
                                    ),
                                    ol: ({ children }) => (
                                        <ol className="list-decimal list-inside mb-2">
                                            {children}
                                        </ol>
                                    ),
                                    li: ({ children }) => (
                                        <li className="mb-1">{children}</li>
                                    ),
                                    h1: ({ children }) => (
                                        <h1 className="text-xl font-bold mb-2">
                                            {children}
                                        </h1>
                                    ),
                                    h2: ({ children }) => (
                                        <h2 className="text-lg font-bold mb-2">
                                            {children}
                                        </h2>
                                    ),
                                    h3: ({ children }) => (
                                        <h3 className="text-md font-bold mb-2">
                                            {children}
                                        </h3>
                                    ),
                                    blockquote: ({ children }) => (
                                        <blockquote className="border-l-4 border-purple-400 pl-4 italic mb-2">
                                            {children}
                                        </blockquote>
                                    ),
                                } satisfies Components}
                            >
                                {message.content}
                            </ReactMarkdown>
                        </div>

                        {isStreaming && (
                            <div className="flex items-center mt-2">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                                    <div
                                        className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                                        style={{ animationDelay: '0.1s' }}
                                    ></div>
                                    <div
                                        className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                                        style={{ animationDelay: '0.2s' }}
                                    ></div>
                                </div>
                                <span className="text-xs text-purple-300 ml-2">
                                    Generating...
                                </span>
                            </div>
                        )}

                        <p className="text-xs mt-2 opacity-70">
                            {message.timestamp.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MessageComponent;