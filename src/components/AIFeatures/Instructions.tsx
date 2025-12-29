import { HelpCircle, Terminal, Sparkles, CheckCircle2 } from 'lucide-react';

export function Instructions() {
    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn pb-20">
            <div className="text-center space-y-4">
                <h2 className="text-5xl font-black text-gray-900 tracking-tight">How it Works</h2>
                <p className="text-xl text-gray-600 font-medium">Master the art of AI-driven career building with LANCE.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[2rem] border border-white shadow-xl shadow-gray-200/50">
                    <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
                        <Sparkles size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Chat with LANCE</h3>
                    <p className="text-gray-600 leading-relaxed font-medium">
                        LANCE isn't just a form; he's a career strategist. Start by talking about your goals,
                        your toughest projects, and your unique skills. He will synthesize this into a
                        professional narrative.
                    </p>
                </div>

                <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[2rem] border border-white shadow-xl shadow-gray-200/50">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                        <Terminal size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Iterative Building</h3>
                    <p className="text-gray-600 leading-relaxed font-medium">
                        Don't worry about getting it right the first time. You can manually edit any section
                        later or ask LANCE to "make my summary more aggressive" or "emphasize my leadership roles."
                    </p>
                </div>
            </div>

            <div className="bg-gray-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[80px] -mr-32 -mt-32"></div>
                <h3 className="text-3xl font-bold mb-8 flex items-center gap-3 italic">
                    <HelpCircle className="text-purple-400" />
                    Pro Performance Tips
                </h3>
                <ul className="space-y-6">
                    <li className="flex gap-4">
                        <CheckCircle2 className="text-purple-400 shrink-0 mt-1" size={20} />
                        <div>
                            <p className="font-bold text-lg">Be Specific with Achievements</p>
                            <p className="text-gray-400">Instead of "Managed a team," say "Led a cross-functional team of 12 to deliver a $2M project 2 weeks ahead of schedule."</p>
                        </div>
                    </li>
                    <li className="flex gap-4">
                        <CheckCircle2 className="text-purple-400 shrink-0 mt-1" size={20} />
                        <div>
                            <p className="font-bold text-lg">Use the "Prompts" Library</p>
                            <p className="text-gray-400">Visit our Prompts section to find specialized commands that can trigger deeper AI analysis of your career history.</p>
                        </div>
                    </li>
                    <li className="flex gap-4">
                        <CheckCircle2 className="text-purple-400 shrink-0 mt-1" size={20} />
                        <div>
                            <p className="font-bold text-lg">ATS Optimization</p>
                            <p className="text-gray-600">LANCE automatically structures your resume to be ATS-friendly, but you can use "Injection Mode" for advanced ranking techniques.</p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
}
