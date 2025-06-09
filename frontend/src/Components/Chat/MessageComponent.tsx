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
            <div
                className={`max-w-[70%] px-4 py-3 rounded-lg ${
                    isUser ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white'
                }`}
            >
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
                                        className="bg-gray-800 px-1 py-0.5 rounded text-sm"
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
                                <blockquote className="border-l-4 border-gray-500 pl-4 italic mb-2">
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
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: '0.1s' }}
                            ></div>
                            <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: '0.2s' }}
                            ></div>
                        </div>
                        <span className="text-xs text-gray-400 ml-2">
                            AI is typing...
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
    );
}

export default MessageComponent;