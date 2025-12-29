import { MessageSquare, Copy, Check } from 'lucide-react';
import { useState } from 'react';

const PROMPTS = [
    {
        title: "The Metrics Booster",
        description: "Use this when you have plain job descriptions and need to inject data points.",
        prompt: "I will provide my current job description. Rewrite it focusing on quantifiable achievements, using the STAR method, and incorporating dynamic action verbs."
    },
    {
        title: "Style Pivot (Modern/Tech)",
        description: "Transforms a traditional corporate resume into a high-impact tech industry version.",
        prompt: "Analyze my experience and translate it for a Top-Tier Tech company. Focus on scalability, cross-functional collaboration, and technical problem-solving."
    },
    {
        title: "Executive Presence",
        description: "elevates the vocabulary and tone for leadership roles.",
        prompt: "Rewrite my professional summary to convey strong executive presence, strategic leadership, and a track record of driving organizational change."
    },
    {
        title: "Skill Gap Analysis",
        description: "Ask LANCE to find what's missing compared to your target job.",
        prompt: "Here is my resume and a job description I'm targeting. Identify the skill gaps and suggest wording for my existing experience that bridges those gaps."
    }
];

export function PromptsLibrary() {
    const [copiedId, setCopiedId] = useState<number | null>(null);

    const handleCopy = (text: string, id: number) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12 animate-fadeIn pb-20">
            <div className="text-center space-y-4">
                <h2 className="text-5xl font-black text-gray-900 tracking-tight">Prompt Library</h2>
                <p className="text-xl text-gray-600 font-medium">Expert-crafted commands to unlock LANCE's full potential.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {PROMPTS.map((item, index) => (
                    <div key={index} className="group bg-white/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-xl shadow-gray-200/40 hover:shadow-purple-500/10 transition-all hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                                <MessageSquare size={24} />
                            </div>
                            <button
                                onClick={() => handleCopy(item.prompt, index)}
                                className="p-3 bg-gray-50 hover:bg-purple-50 text-gray-400 hover:text-purple-600 rounded-xl transition-all border border-transparent hover:border-purple-100"
                            >
                                {copiedId === index ? <Check size={20} /> : <Copy size={20} />}
                            </button>
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">{item.title}</h3>
                        <p className="text-gray-500 font-medium mb-6 leading-relaxed italic text-sm">{item.description}</p>
                        <div className="bg-gray-900/5 p-5 rounded-2xl border border-gray-100 font-mono text-xs text-gray-700 leading-relaxed">
                            "{item.prompt}"
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
