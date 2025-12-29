// Template configuration types for AI-generated templates

export type LayoutType = 'single-column' | 'two-column' | 'sidebar-left' | 'sidebar-right' | 'header-focused';

export type SectionType =
    | 'personal'
    | 'summary'
    | 'experience'
    | 'education'
    | 'skills'
    | 'languages'
    | 'certifications'
    | 'projects'
    | 'awards'
    | 'references'
    | 'custom';

export interface TemplateColors {
    primary: string;        // Main accent color
    secondary: string;      // Secondary accent
    background: string;     // Page background
    headerBg: string;       // Header section background
    text: string;           // Main text color
    textMuted: string;      // Secondary text color
}

export interface TemplateTypography {
    fontFamily: string;           // Main font
    headingFontFamily: string;    // Heading font (optional)
    baseFontSize: number;         // Base font size in px
    headingScale: number;         // Scale factor for headings
}

export interface SectionConfig {
    type: SectionType;
    title?: string;           // Custom title override
    visible: boolean;
    order: number;
    inSidebar: boolean;       // For two-column layouts
}

export interface TemplateConfig {
    id: string;
    name: string;
    layout: LayoutType;
    sections: SectionConfig[];
    colors: TemplateColors;
    typography: TemplateTypography;
    spacing: {
        sectionGap: number;       // Gap between sections in px
        itemGap: number;          // Gap between items in px
        padding: number;          // Page padding in px
    };
    headerStyle: 'centered' | 'left-aligned' | 'split' | 'minimal';
    showPhoto: boolean;
    sidebarWidth: number;       // Percentage for sidebar (20-40)
}

// Default template configuration
export const DEFAULT_TEMPLATE_CONFIG: TemplateConfig = {
    id: 'ai-custom',
    name: 'AI Generated',
    layout: 'single-column',
    sections: [
        { type: 'personal', visible: true, order: 0, inSidebar: false },
        { type: 'summary', visible: true, order: 1, inSidebar: false },
        { type: 'experience', visible: true, order: 2, inSidebar: false },
        { type: 'education', visible: true, order: 3, inSidebar: false },
        { type: 'skills', visible: true, order: 4, inSidebar: false },
        { type: 'languages', visible: false, order: 5, inSidebar: false },
        { type: 'certifications', visible: false, order: 6, inSidebar: false },
    ],
    colors: {
        primary: '#2563eb',
        secondary: '#7c3aed',
        background: '#ffffff',
        headerBg: '#f8fafc',
        text: '#1f2937',
        textMuted: '#6b7280',
    },
    typography: {
        fontFamily: 'Inter, system-ui, sans-serif',
        headingFontFamily: 'Inter, system-ui, sans-serif',
        baseFontSize: 14,
        headingScale: 1.25,
    },
    spacing: {
        sectionGap: 24,
        itemGap: 12,
        padding: 40,
    },
    headerStyle: 'centered',
    showPhoto: true,
    sidebarWidth: 35,
};

// Preset template configs for quick selection
export const PRESET_CONFIGS: Record<string, Partial<TemplateConfig>> = {
    modern: {
        layout: 'sidebar-left',
        colors: {
            primary: '#0ea5e9',
            secondary: '#8b5cf6',
            background: '#ffffff',
            headerBg: '#0f172a',
            text: '#0f172a',
            textMuted: '#64748b',
        },
        headerStyle: 'split',
        sidebarWidth: 32,
    },
    elegant: {
        layout: 'single-column',
        colors: {
            primary: '#a855f7',
            secondary: '#ec4899',
            background: '#fefce8',
            headerBg: '#fef3c7',
            text: '#1c1917',
            textMuted: '#78716c',
        },
        headerStyle: 'centered',
        typography: {
            fontFamily: 'Georgia, serif',
            headingFontFamily: 'Georgia, serif',
            baseFontSize: 14,
            headingScale: 1.3,
        },
    },
    tech: {
        layout: 'two-column',
        colors: {
            primary: '#22c55e',
            secondary: '#3b82f6',
            background: '#0f172a',
            headerBg: '#1e293b',
            text: '#f1f5f9',
            textMuted: '#94a3b8',
        },
        headerStyle: 'left-aligned',
        sidebarWidth: 38,
    },
};
