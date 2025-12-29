import { FileText, BookOpen, MessageSquare, Zap } from 'lucide-react';

interface HeaderProps {
  onNavigate: (mode: 'landing' | 'builder' | 'instructions' | 'prompts' | 'injection') => void;
  currentMode: string;
}

export function Header({ onNavigate, currentMode }: HeaderProps) {
  return (
    <header className="sticky top-0 z-[100] bg-white/40 backdrop-blur-xl border-b border-gray-200/50 text-gray-900">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-3 group cursor-pointer"
            onClick={() => onNavigate('landing')}
          >
            <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/20">
              <FileText size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              LANCE <span className="text-purple-600 text-xs font-medium tracking-normal ml-1 border border-purple-200 px-1.5 py-0.5 rounded bg-purple-50">AI</span>
            </h1>
          </div>
          <nav className="flex-1 md:flex-none">
            <ul className="flex gap-4 md:gap-8 items-center justify-end">
              <li className="hidden sm:block">
                <button
                  onClick={() => onNavigate('instructions')}
                  className={`flex items-center gap-2 text-[10px] md:text-sm font-semibold transition-colors relative group/link ${currentMode === 'instructions' ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'}`}
                >
                  <BookOpen size={16} className="hidden md:block" />
                  Instruction
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-purple-500 transition-all ${currentMode === 'instructions' ? 'w-full' : 'w-0 group-hover/link:w-full'}`}></span>
                </button>
              </li>
              <li className="hidden sm:block">
                <button
                  onClick={() => onNavigate('prompts')}
                  className={`flex items-center gap-2 text-[10px] md:text-sm font-semibold transition-colors relative group/link ${currentMode === 'prompts' ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'}`}
                >
                  <MessageSquare size={16} className="hidden md:block" />
                  Prompts
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-purple-500 transition-all ${currentMode === 'prompts' ? 'w-full' : 'w-0 group-hover/link:w-full'}`}></span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('injection')}
                  className={`flex items-center gap-2 text-[10px] md:text-sm font-semibold transition-colors relative group/link ${currentMode === 'injection' ? 'text-amber-600' : 'text-gray-600 hover:text-purple-600'}`}
                >
                  <Zap size={16} className={`hidden md:block ${currentMode === 'injection' ? 'text-amber-500' : 'text-gray-400 group-hover/link:text-amber-500'}`} />
                  Injection
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-amber-500 transition-all ${currentMode === 'injection' ? 'w-full' : 'w-0 group-hover/link:w-full'}`}></span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('builder')}
                  className={`text-[10px] md:text-sm font-bold px-4 md:px-5 py-2 rounded-full transition-all shadow-md ${currentMode === 'builder'
                    ? 'bg-purple-600 text-white shadow-purple-200'
                    : 'bg-gray-900 text-white hover:bg-purple-600 shadow-gray-200'
                    }`}
                >
                  {currentMode === 'builder' ? 'Active' : 'Builder'}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}