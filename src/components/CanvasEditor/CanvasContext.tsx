import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CanvasSettings {
    // Global styling
    backgroundColor: string;
    accentColor: string;
    fontFamily: string;
    baseFontSize: number;
    spacing: 'compact' | 'normal' | 'spacious';
    zoom: number;

    // Section visibility
    visibleSections: {
        summary: boolean;
        experience: boolean;
        education: boolean;
        skills: boolean;
        languages: boolean;
        certifications: boolean;
    };

    // Section order
    sectionOrder: string[];
}

const DEFAULT_SETTINGS: CanvasSettings = {
    backgroundColor: '#FFFFFF',
    accentColor: '#6B21A8', // Purple
    fontFamily: 'Inter',
    baseFontSize: 14,
    spacing: 'normal',
    zoom: 100,
    visibleSections: {
        summary: true,
        experience: true,
        education: true,
        skills: true,
        languages: true,
        certifications: true,
    },
    sectionOrder: ['summary', 'experience', 'education', 'skills', 'languages', 'certifications'],
};

// Predefined color palettes
export const COLOR_PALETTES = [
    { name: 'Classic', background: '#FFFFFF', accent: '#1A1A1A' },
    { name: 'Navy', background: '#FFFFFF', accent: '#1E3A5F' },
    { name: 'Burgundy', background: '#FFFFFF', accent: '#722F37' },
    { name: 'Forest', background: '#FFFFFF', accent: '#2D5A27' },
    { name: 'Royal Purple', background: '#FFFFFF', accent: '#6B21A8' },
    { name: 'Modern Blue', background: '#F8FAFC', accent: '#3B82F6' },
    { name: 'Warm', background: '#FFFBEB', accent: '#D97706' },
    { name: 'Cool', background: '#F0F9FF', accent: '#0EA5E9' },
];

// Professional font options
export const FONT_OPTIONS = [
    { name: 'Inter', value: 'Inter, sans-serif', category: 'Sans-serif' },
    { name: 'Roboto', value: 'Roboto, sans-serif', category: 'Sans-serif' },
    { name: 'Open Sans', value: '"Open Sans", sans-serif', category: 'Sans-serif' },
    { name: 'Lato', value: 'Lato, sans-serif', category: 'Sans-serif' },
    { name: 'Montserrat', value: 'Montserrat, sans-serif', category: 'Sans-serif' },
    { name: 'Source Sans Pro', value: '"Source Sans Pro", sans-serif', category: 'Sans-serif' },
    { name: 'Raleway', value: 'Raleway, sans-serif', category: 'Sans-serif' },
    { name: 'Playfair Display', value: '"Playfair Display", serif', category: 'Serif' },
    { name: 'Merriweather', value: 'Merriweather, serif', category: 'Serif' },
    { name: 'Georgia', value: 'Georgia, serif', category: 'Serif' },
];

// Spacing presets
export const SPACING_PRESETS = {
    compact: { padding: 8, gap: 4, sectionGap: 16 },
    normal: { padding: 12, gap: 6, sectionGap: 24 },
    spacious: { padding: 16, gap: 8, sectionGap: 32 },
};

interface CanvasContextType {
    settings: CanvasSettings;
    updateSettings: (updates: Partial<CanvasSettings>) => void;
    resetSettings: () => void;
    toggleSection: (section: keyof CanvasSettings['visibleSections']) => void;
    reorderSections: (newOrder: string[]) => void;
    applyPalette: (palette: typeof COLOR_PALETTES[0]) => void;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

const STORAGE_KEY = 'resume-canvas-settings';

export function CanvasProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<CanvasSettings>(() => {
        // Load from localStorage on init
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.warn('Failed to load canvas settings from localStorage');
        }
        return DEFAULT_SETTINGS;
    });

    // Persist to localStorage on change
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        } catch (e) {
            console.warn('Failed to save canvas settings to localStorage');
        }
    }, [settings]);

    const updateSettings = (updates: Partial<CanvasSettings>) => {
        setSettings(prev => ({ ...prev, ...updates }));
    };

    const resetSettings = () => {
        setSettings(DEFAULT_SETTINGS);
        localStorage.removeItem(STORAGE_KEY);
    };

    const toggleSection = (section: keyof CanvasSettings['visibleSections']) => {
        setSettings(prev => ({
            ...prev,
            visibleSections: {
                ...prev.visibleSections,
                [section]: !prev.visibleSections[section],
            },
        }));
    };

    const reorderSections = (newOrder: string[]) => {
        setSettings(prev => ({ ...prev, sectionOrder: newOrder }));
    };

    const applyPalette = (palette: typeof COLOR_PALETTES[0]) => {
        setSettings(prev => ({
            ...prev,
            backgroundColor: palette.background,
            accentColor: palette.accent,
        }));
    };

    return (
        <CanvasContext.Provider
            value={{
                settings,
                updateSettings,
                resetSettings,
                toggleSection,
                reorderSections,
                applyPalette,
            }}
        >
            {children}
        </CanvasContext.Provider>
    );
}

export function useCanvas() {
    const context = useContext(CanvasContext);
    if (!context) {
        throw new Error('useCanvas must be used within a CanvasProvider');
    }
    return context;
}

// CSS variables helper for templates
export function getCanvasCSSVariables(settings: CanvasSettings): React.CSSProperties {
    const spacingPreset = SPACING_PRESETS[settings.spacing];
    const fontOption = FONT_OPTIONS.find(f => f.name === settings.fontFamily);

    return {
        '--canvas-bg': settings.backgroundColor,
        '--canvas-accent': settings.accentColor,
        '--canvas-font': fontOption?.value || 'Inter, sans-serif',
        '--canvas-base-size': `${settings.baseFontSize}px`,
        '--canvas-padding': `${spacingPreset.padding}px`,
        '--canvas-gap': `${spacingPreset.gap}px`,
        '--canvas-section-gap': `${spacingPreset.sectionGap}px`,
        '--canvas-zoom': `${settings.zoom}%`,
    } as React.CSSProperties;
}
