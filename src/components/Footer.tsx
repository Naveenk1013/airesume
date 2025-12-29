import { Heart } from 'lucide-react';

export function Footer() {
    return (
        <footer className="py-12 mt-20 border-t border-gray-200/50">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2 text-gray-500 font-medium italic">
                        <span>Built with</span>
                        <Heart size={16} className="text-red-400 fill-current" />
                        <span>by</span>
                        <a
                            href="https://naveen-kr1.netlify.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-900 font-bold hover:text-purple-600 transition-colors"
                        >
                            Naveen Kumar
                        </a>
                    </div>

                    <div className="text-sm text-gray-400 font-medium">
                        © {new Date().getFullYear()} All rights reserved.
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-gray-500">Powered by</span>
                        <a
                            href="https://Lancealot.in/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-black text-gray-900 shadow-sm hover:shadow-md hover:border-purple-200 transition-all uppercase tracking-wider"
                        >
                            Lancealot.in
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
