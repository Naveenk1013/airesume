import React, { useState } from 'react';
import { useCanvas } from './CanvasContext';
import {
    ChevronRight,
    ChevronLeft,
    Eye,
    EyeOff,
    GripVertical,
    User,
    Briefcase,
    GraduationCap,
    Wrench,
    Globe,
    Award,
    Settings2
} from 'lucide-react';

const SECTION_ICONS: Record<string, React.ElementType> = {
    summary: User,
    experience: Briefcase,
    education: GraduationCap,
    skills: Wrench,
    languages: Globe,
    certifications: Award,
};

const SECTION_LABELS: Record<string, string> = {
    summary: 'Summary',
    experience: 'Experience',
    education: 'Education',
    skills: 'Skills',
    languages: 'Languages',
    certifications: 'Certifications',
};

export function StylePanel() {
    const { settings, toggleSection, reorderSections, updateSettings } = useCanvas();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [draggedSection, setDraggedSection] = useState<string | null>(null);

    const handleDragStart = (section: string) => {
        setDraggedSection(section);
    };

    const handleDragOver = (e: React.DragEvent, targetSection: string) => {
        e.preventDefault();
        if (draggedSection && draggedSection !== targetSection) {
            const newOrder = [...settings.sectionOrder];
            const draggedIndex = newOrder.indexOf(draggedSection);
            const targetIndex = newOrder.indexOf(targetSection);

            newOrder.splice(draggedIndex, 1);
            newOrder.splice(targetIndex, 0, draggedSection);

            reorderSections(newOrder);
        }
    };

    const handleDragEnd = () => {
        setDraggedSection(null);
    };

    if (isCollapsed) {
        return (
            <button
                onClick={() => setIsCollapsed(false)}
                className="fixed right-0 top-1/2 -translate-y-1/2 bg-white shadow-xl rounded-l-2xl p-3 z-50 hover:bg-purple-50 transition-all border border-r-0 border-gray-200"
                title="Open Style Panel"
            >
                <ChevronLeft size={20} className="text-purple-600" />
            </button>
        );
    }

    return (
        <div className="w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-5 sticky top-6 max-h-[calc(100vh-100px)] overflow-y-auto ring-1 ring-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Settings2 size={18} className="text-purple-600" />
                    <h3 className="font-black text-gray-900">Canvas Settings</h3>
                </div>
                <button
                    onClick={() => setIsCollapsed(true)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-all"
                    title="Collapse Panel"
                >
                    <ChevronRight size={16} className="text-gray-400" />
                </button>
            </div>

            {/* Section Visibility */}
            <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Show / Hide Sections</h4>
                <div className="space-y-2">
                    {settings.sectionOrder.map((section) => {
                        const Icon = SECTION_ICONS[section] || User;
                        const isVisible = settings.visibleSections[section as keyof typeof settings.visibleSections];

                        return (
                            <div
                                key={section}
                                draggable
                                onDragStart={() => handleDragStart(section)}
                                onDragOver={(e) => handleDragOver(e, section)}
                                onDragEnd={handleDragEnd}
                                className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-move ${draggedSection === section
                                    ? 'bg-purple-100 border-2 border-purple-300'
                                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                                    }`}
                            >
                                <GripVertical size={14} className="text-gray-300 flex-shrink-0" />
                                <Icon size={16} className={isVisible ? 'text-purple-600' : 'text-gray-300'} />
                                <span className={`flex-1 text-sm font-medium ${isVisible ? 'text-gray-800' : 'text-gray-400'}`}>
                                    {SECTION_LABELS[section]}
                                </span>
                                <button
                                    onClick={() => toggleSection(section as keyof typeof settings.visibleSections)}
                                    className={`p-1.5 rounded-lg transition-all ${isVisible ? 'text-purple-600 hover:bg-purple-100' : 'text-gray-300 hover:bg-gray-200'}`}
                                    title={isVisible ? 'Hide Section' : 'Show Section'}
                                >
                                    {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                                </button>
                            </div>
                        );
                    })}
                </div>
                <p className="text-xs text-gray-400 mt-3 text-center">Drag to reorder sections</p>
            </div>

            {/* Font Size Slider */}
            <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Base Font Size</h4>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">10px</span>
                    <input
                        type="range"
                        min={10}
                        max={18}
                        value={settings.baseFontSize}
                        onChange={(e) => updateSettings({ baseFontSize: parseInt(e.target.value) })}
                        className="flex-1 accent-purple-600"
                    />
                    <span className="text-xs text-gray-500">18px</span>
                </div>
                <div className="text-center mt-1">
                    <span className="text-sm font-bold text-purple-600">{settings.baseFontSize}px</span>
                </div>
            </div>

            {/* Preview Info */}
            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-2">Current Theme</h4>
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-lg border-2 border-white shadow-sm" style={{ backgroundColor: settings.backgroundColor }}></div>
                    <div className="w-6 h-6 rounded-lg border-2 border-white shadow-sm" style={{ backgroundColor: settings.accentColor }}></div>
                    <span className="text-sm font-medium text-gray-600">{settings.fontFamily}</span>
                </div>
                <p className="text-xs text-gray-500 capitalize">Spacing: {settings.spacing}</p>
            </div>
        </div>
    );
}
