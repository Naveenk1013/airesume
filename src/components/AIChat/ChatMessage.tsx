import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';


interface ChatMessageProps {
    message: {
        role: 'user' | 'assistant' | 'system';
        content: string;
    };
}

export function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.role === 'user';

    // Explicitly handle system messages to keep logic clean
    if (message.role === 'system') return null;

    return (
        <div className={`flex items-start gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
            <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
            >
                {isUser ? <User size={18} /> : <Bot size={18} />}
            </div>
            <div
                className={`max-w-[80%] p-4 rounded-xl shadow-sm ${isUser
                    ? 'bg-purple-600 text-white rounded-tr-none'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                    }`}
            >
                {isUser ? (
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                ) : (
                    <div className="prose prose-purple max-w-none prose-sm sm:prose-base prose-headings:font-semibold prose-a:text-purple-600 prose-p:leading-relaxed prose-li:marker:text-purple-600">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                // Custom styling for code blocks if needed in future
                                code({ node, className, children, ...props }) {
                                    return (
                                        <code className={`${className} bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5`} {...props}>
                                            {children}
                                        </code>
                                    )
                                }
                            }}
                        >
                            {message.content}
                        </ReactMarkdown>
                    </div>
                )}
            </div>
        </div>
    );
}
