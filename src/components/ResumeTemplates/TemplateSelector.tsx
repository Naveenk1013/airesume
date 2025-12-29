import React from 'react';
import { TEMPLATE_REGISTRY, type TemplateConfig } from './TemplateRegistry';
import { CheckCircle, Sparkles, Layout, Minimize2 } from 'lucide-react';

interface TemplateSelectorProps {
    selectedId: string;
    onSelect: (id: string) => void;
}

const categoryIcons = {
    professional: Layout,
    creative: Sparkles,
    minimal: Minimize2,
    custom: Sparkles,
};

const categoryColors = {
    professional: 'bg-blue-500',
    creative: 'bg-purple-500',
    minimal: 'bg-green-500',
    custom: 'bg-amber-500',
};

export function TemplateSelector({ selectedId, onSelect }: TemplateSelectorProps) {
    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white p-6 ring-1 ring-gray-200/50">
            <h2 className="text-xl font-black text-gray-900 mb-4 tracking-tight">Choose Template</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {TEMPLATE_REGISTRY.map((template) => {
                    const Icon = categoryIcons[template.category];
                    const isSelected = selectedId === template.id;

                    return (
                        <button
                            key={template.id}
                            onClick={() => onSelect(template.id)}
                            className={`relative p-4 rounded-2xl border-2 transition-all duration-300 text-left group ${isSelected
                                ? 'border-purple-500 bg-purple-50 shadow-lg shadow-purple-100'
                                : 'border-gray-100 bg-white hover:border-purple-200 hover:bg-purple-50/50'
                                }`}
                        >
                            {/* Selection Indicator */}
                            {isSelected && (
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                                    <CheckCircle size={14} className="text-white" />
                                </div>
                            )}

                            {/* Template Preview */}
                            <div className={`w-full aspect-[0.7] rounded-lg mb-3 overflow-hidden border ${isSelected ? 'border-purple-200' : 'border-gray-100'}`}>
                                <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                                    {template.id === 'classic' && (
                                        <div className="w-[80%] h-[85%] bg-white shadow-sm p-2 space-y-1">
                                            <div className="h-3 bg-gray-800 w-3/4 rounded-sm"></div>
                                            <div className="h-1 bg-gray-300 w-1/2 rounded-sm"></div>
                                            <div className="h-1 bg-gray-300 w-full rounded-sm"></div>
                                            <div className="grid grid-cols-3 gap-1 mt-2">
                                                <div className="h-1 bg-gray-200 rounded-sm"></div>
                                                <div className="h-1 bg-gray-200 rounded-sm"></div>
                                                <div className="h-1 bg-gray-200 rounded-sm"></div>
                                            </div>
                                        </div>
                                    )}
                                    {template.id === 'executive' && (
                                        <div className="w-[80%] h-[85%] bg-white shadow-sm p-2 space-y-1">
                                            <div className="h-3 bg-gray-800 w-1/2 mx-auto rounded-sm"></div>
                                            <div className="h-1 bg-gray-300 w-1/3 mx-auto rounded-sm"></div>
                                            <div className="h-px bg-gray-200 w-full mt-2"></div>
                                            <div className="space-y-1 mt-2">
                                                <div className="h-1 bg-gray-200 w-full rounded-sm"></div>
                                                <div className="h-1 bg-gray-200 w-3/4 rounded-sm"></div>
                                            </div>
                                        </div>
                                    )}
                                    {template.id === 'creative' && (
                                        <div className="w-[80%] h-[85%] flex shadow-sm">
                                            <div className="w-1/3 bg-slate-700 p-1 space-y-1">
                                                <div className="w-4 h-4 bg-slate-500 rounded-full mx-auto"></div>
                                                <div className="h-1 bg-slate-500 w-full rounded-sm"></div>
                                            </div>
                                            <div className="flex-1 bg-white p-1 space-y-1">
                                                <div className="h-2 bg-gray-800 w-3/4 rounded-sm"></div>
                                                <div className="h-1 bg-gray-300 w-full rounded-sm"></div>
                                            </div>
                                        </div>
                                    )}
                                    {template.id === 'corporate' && (
                                        <div className="w-[80%] h-[85%] flex flex-col shadow-sm">
                                            <div className="h-6 bg-slate-800 w-full flex items-center justify-center">
                                                <div className="h-2 bg-white w-1/2 rounded-sm"></div>
                                            </div>
                                            <div className="flex-1 flex">
                                                <div className="w-1/3 bg-slate-700 p-1">
                                                    <div className="h-1 bg-slate-500 w-full rounded-sm"></div>
                                                </div>
                                                <div className="flex-1 bg-white p-1">
                                                    <div className="h-1 bg-gray-300 w-full rounded-sm"></div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {template.id === 'minimal' && (
                                        <div className="w-[80%] h-[85%] flex shadow-sm">
                                            <div className="w-1/3 bg-slate-50 p-1 space-y-1">
                                                <div className="h-2 bg-gray-800 w-3/4 rounded-sm"></div>
                                                <div className="h-1 bg-blue-400 w-1/2 rounded-sm"></div>
                                            </div>
                                            <div className="flex-1 bg-white p-1 space-y-1 border-l border-gray-100">
                                                <div className="h-1 bg-gray-300 w-full rounded-sm"></div>
                                                <div className="h-1 bg-gray-200 w-3/4 rounded-sm"></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Template Info */}
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Icon size={12} className={`${isSelected ? 'text-purple-600' : 'text-gray-400'}`} />
                                    <span className={`text-xs font-bold uppercase tracking-wide ${isSelected ? 'text-purple-600' : 'text-gray-400'}`}>
                                        {template.category}
                                    </span>
                                </div>
                                <h3 className={`font-bold text-sm ${isSelected ? 'text-purple-900' : 'text-gray-800'}`}>
                                    {template.name}
                                </h3>
                                {template.atsOptimized && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                        <CheckCircle size={10} /> ATS
                                    </span>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
