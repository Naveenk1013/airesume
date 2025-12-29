// Template Registry - Central hub for all resume templates
import { ClassicTemplate } from './Classic/ClassicTemplate';
import { ExecutiveTemplate } from './Executive/ExecutiveTemplate';
import { CreativeTemplate } from './Creative/CreativeTemplate';
import { CorporateTemplate } from './Corporate/Template1';
import { MinimalTemplate } from './Minimal/MinimalTemplate';
import { DynamicTemplate } from './Dynamic/DynamicTemplate';
import type { ResumeData } from '../../types';

export interface TemplateConfig {
    id: string;
    name: string;
    description: string;
    category: 'professional' | 'creative' | 'minimal' | 'custom';
    atsOptimized: boolean;
    thumbnail?: string;
    component: React.ComponentType<{
        data: ResumeData;
        onUpdate?: (path: string, value: any) => void;
        config?: any; // For DynamicTemplate
    }>;
}

export const TEMPLATE_REGISTRY: TemplateConfig[] = [
    {
        id: 'classic',
        name: 'Classic Professional',
        description: 'ATS-optimized single-column with key competencies grid',
        category: 'professional',
        atsOptimized: true,
        component: ClassicTemplate,
    },
    {
        id: 'executive',
        name: 'Executive Modern',
        description: 'Centered header with strong bullet hierarchy',
        category: 'professional',
        atsOptimized: true,
        component: ExecutiveTemplate,
    },
    {
        id: 'creative',
        name: 'Creative Sidebar',
        description: 'Two-column with dark sidebar and timeline',
        category: 'creative',
        atsOptimized: false,
        component: CreativeTemplate,
    },
    {
        id: 'corporate',
        name: 'Corporate Executive',
        description: 'Dark header banner with professional layout',
        category: 'professional',
        atsOptimized: false,
        component: CorporateTemplate,
    },
    {
        id: 'minimal',
        name: 'Minimal Elegance',
        description: 'Light two-column with blue accents',
        category: 'minimal',
        atsOptimized: false,
        component: MinimalTemplate,
    },
    {
        id: 'ai-custom',
        name: 'AI Custom',
        description: 'AI-generated template based on your preferences',
        category: 'custom',
        atsOptimized: true,
        component: DynamicTemplate as any,
    },
];

export const getTemplateById = (id: string): TemplateConfig | undefined => {
    return TEMPLATE_REGISTRY.find(t => t.id === id);
};

export const getTemplatesByCategory = (category: TemplateConfig['category']): TemplateConfig[] => {
    return TEMPLATE_REGISTRY.filter(t => t.category === category);
};

export const getATSOptimizedTemplates = (): TemplateConfig[] => {
    return TEMPLATE_REGISTRY.filter(t => t.atsOptimized);
};

// Re-export templates for direct use
export { ClassicTemplate, ExecutiveTemplate, CreativeTemplate, CorporateTemplate, MinimalTemplate, DynamicTemplate };
