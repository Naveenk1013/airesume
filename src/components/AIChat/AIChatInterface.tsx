import { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Bot } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { startInterview, sendMessage, extractResumeData } from '../../utils/aiService';
import type { ResumeData } from '../../types';

interface AIChatInterfaceProps {
    onComplete: (data: ResumeData) => void;
    onProgress?: (data: ResumeData) => void;
}

export interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: number;
}

export function AIChatInterface({ onComplete, onProgress }: AIChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isExtracting, setIsExtracting] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const isMounted = useRef(false);
    const hasInitialized = useRef(false);
    const lastProcessedMessageId = useRef<string | null>(null);

    // Track mounted state
    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    // Initialize interview on mount
    useEffect(() => {
        if (hasInitialized.current) return;

        const initInterview = async () => {
            hasInitialized.current = true;
            if (isMounted.current) setIsLoading(true);
            try {
                const initialMessage = await startInterview();
                if (isMounted.current) {
                    setMessages([{
                        id: '1',
                        role: 'assistant',
                        content: initialMessage,
                        timestamp: Date.now()
                    }]);
                }
            } catch (error) {
                if (isMounted.current) {
                    setMessages([{
                        id: 'error',
                        role: 'assistant',
                        content: `Sorry, I failed to start the interview. Error: ${(error as Error).message}`,
                        timestamp: Date.now()
                    }]);
                }
            } finally {
                if (isMounted.current) setIsLoading(false);
            }
        };
        initInterview();
    }, []);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Real-time extraction effect
    useEffect(() => {
        // Only run extraction if:
        // 1. We have messages
        // 2. The last message is from the assistant (meaning they just finished speaking)
        // 3. We have an onProgress handler
        if (messages.length < 2 || !onProgress) return;

        const lastMessage = messages[messages.length - 1];
        if (lastMessage.role !== 'assistant') return;

        // Prevent processing the same message multiple times
        if (lastMessage.id === lastProcessedMessageId.current) return;
        lastProcessedMessageId.current = lastMessage.id;

        const performBackgroundExtraction = async () => {
            // Don't show loading state for background extraction to avoid UI jitter
            try {
                const partialData = await extractResumeData(messages);
                if (isMounted.current && onProgress) {
                    onProgress(partialData);
                }
            } catch (error) {
                // Silently fail for background updates, we don't want to disrupt the chat
                console.warn('Background extraction failed:', error);
            }
        };

        const debounceTimer = setTimeout(performBackgroundExtraction, 1000);
        return () => clearTimeout(debounceTimer);
    }, [messages, onProgress]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await sendMessage(messages, input);
            if (isMounted.current) {
                setMessages(prev => [...prev, {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: response,
                    timestamp: Date.now()
                }]);
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            // Optional: Add error message to chat
        } finally {
            if (isMounted.current) setIsLoading(false);
        }
    };

    const handleFinish = async () => {
        setIsExtracting(true);
        try {
            const resumeData = await extractResumeData(messages);
            if (isMounted.current) {
                onComplete(resumeData);
            }
        } catch (error) {
            console.error('Failed to extract resume data:', error);
            alert(`Failed to build: ${(error as Error).message}`);
        } finally {
            if (isMounted.current) setIsExtracting(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] w-full bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200">
            {/* Header */}
            <div className="bg-white p-4 border-b flex justify-between items-center px-6">
                <div>
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        🤖 AI Mode
                    </h2>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={handleFinish}
                        disabled={isExtracting || messages.length < 3}
                        className="bg-green-600 text-white px-3 py-1.5 text-sm rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                    >
                        {isExtracting ? <Loader2 className="animate-spin" size={16} /> : null}
                        Finish & Edit
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map(msg => (
                    <ChatMessage key={msg.id} message={msg} />
                ))}
                {isLoading && (
                    <div className="flex items-center gap-2 text-gray-400 p-2">
                        <Bot size={18} />
                        <span className="text-sm animate-pulse">Thinking...</span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white p-4 border-t">
                <div className="flex gap-2">
                    <textarea
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder="Type your answer here..."
                        className="flex-1 border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 resize-none"
                        rows={1}
                        disabled={isLoading || isExtracting}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading || isExtracting}
                        className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                    </button>
                </div>
                <p className="text-xs text-center text-gray-400 mt-2">
                    Press Enter to send, Shift+Enter for new line
                </p>
            </div>
        </div>
    );
}
