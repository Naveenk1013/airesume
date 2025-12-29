import React from 'react';
import { TemplateConfig, DEFAULT_TEMPLATE_CONFIG, SectionConfig } from '../../../types/templateConfig';
import { ResumeData } from '../../../types';
import { EditableElement } from '../../EditableElement';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useCanvas, FONT_OPTIONS, SPACING_PRESETS } from '../../CanvasEditor';

interface DynamicTemplateProps {
    data: ResumeData;
    config?: TemplateConfig;
    onChange: (field: string, value: any) => void;
}

export function DynamicTemplate({
    data,
    config = DEFAULT_TEMPLATE_CONFIG,
    onChange
}: DynamicTemplateProps) {
    // Get canvas settings (same as other templates)
    const { settings } = useCanvas();
    const fontOption = FONT_OPTIONS.find(f => f.name === settings.fontFamily);
    const spacingPreset = SPACING_PRESETS[settings.spacing];

    // Merge with defaults
    const templateConfig: TemplateConfig = { ...DEFAULT_TEMPLATE_CONFIG, ...config };

    // Generate CSS variables from config, but override with canvas settings
    const cssVars = {
        '--primary': settings.accentColor || templateConfig.colors.primary,
        '--secondary': templateConfig.colors.secondary,
        '--background': settings.backgroundColor || templateConfig.colors.background,
        '--header-bg': templateConfig.colors.headerBg,
        '--text': templateConfig.colors.text,
        '--text-muted': templateConfig.colors.textMuted,
        '--font-family': fontOption?.value || templateConfig.typography.fontFamily,
        '--heading-font': fontOption?.value || templateConfig.typography.headingFontFamily,
        '--font-size': `${settings.baseFontSize || templateConfig.typography.baseFontSize}px`,
        '--section-gap': `${spacingPreset?.gap || templateConfig.spacing.sectionGap}px`,
        '--item-gap': `${spacingPreset?.gap ? spacingPreset.gap / 2 : templateConfig.spacing.itemGap}px`,
        '--padding': `${spacingPreset?.padding ? spacingPreset.padding * 3 : templateConfig.spacing.padding}px`,
        '--sidebar-width': `${templateConfig.sidebarWidth}%`,
    } as React.CSSProperties;

    // Helper to check if a section type has data
    const sectionHasData = (type: string): boolean => {
        switch (type) {
            case 'personal':
                return !!(data.personalInfo?.fullName || data.personalInfo?.email);
            case 'summary':
                return !!data.personalInfo?.summary;
            case 'experience':
                return !!(data.experience && data.experience.length > 0);
            case 'education':
                return !!(data.education && data.education.length > 0);
            case 'skills':
                return !!(data.skills && data.skills.length > 0);
            case 'languages':
                return !!(data.languages && data.languages.length > 0);
            case 'certifications':
                return !!(data.certifications && data.certifications.length > 0);
            default:
                return false;
        }
    };

    // Sort sections by order - show section if visible in config OR if it has data
    const visibleSections = templateConfig.sections
        .filter(s => s.visible || sectionHasData(s.type))
        .sort((a, b) => a.order - b.order);

    const mainSections = visibleSections.filter(s => !s.inSidebar);
    const sidebarSections = visibleSections.filter(s => s.inSidebar);

    // Render individual section based on type
    const renderSection = (section: SectionConfig) => {
        const sectionTitle = section.title || getSectionTitle(section.type);

        switch (section.type) {
            case 'personal':
                return renderPersonalSection();
            case 'summary':
                return renderSummarySection(sectionTitle);
            case 'experience':
                return renderExperienceSection(sectionTitle);
            case 'education':
                return renderEducationSection(sectionTitle);
            case 'skills':
                return renderSkillsSection(sectionTitle);
            case 'languages':
                return renderLanguagesSection(sectionTitle);
            case 'certifications':
                return renderCertificationsSection(sectionTitle);
            default:
                return null;
        }
    };

    const getSectionTitle = (type: string): string => {
        const titles: Record<string, string> = {
            summary: 'Professional Summary',
            experience: 'Professional Experience',
            education: 'Education',
            skills: 'Skills',
            languages: 'Languages',
            certifications: 'Certifications',
            projects: 'Projects',
            awards: 'Awards',
        };
        return titles[type] || type;
    };

    // Section renderers
    const renderPersonalSection = () => {
        const headerStyles: Record<string, string> = {
            centered: 'text-center',
            'left-aligned': 'text-left',
            split: 'flex justify-between items-center',
            minimal: 'text-left',
        };

        return (
            <header
                className={`p-6 rounded-lg mb-4 ${headerStyles[templateConfig.headerStyle]}`}
                style={{ backgroundColor: 'var(--header-bg)' }}
            >
                {/* Profile Photo - for centered style, show above name */}
                {templateConfig.showPhoto && data.personalInfo.photo && templateConfig.headerStyle === 'centered' && (
                    <div className="flex justify-center mb-4">
                        <img
                            src={data.personalInfo.photo}
                            alt={data.personalInfo.fullName}
                            className="w-28 h-28 rounded-full object-cover border-4"
                            style={{ borderColor: 'var(--primary)' }}
                        />
                    </div>
                )}

                {/* Profile Photo - for split/left-aligned, show in a flex container */}
                {templateConfig.showPhoto && data.personalInfo.photo && templateConfig.headerStyle !== 'centered' && (
                    <div className="flex items-center gap-6 mb-4">
                        <img
                            src={data.personalInfo.photo}
                            alt={data.personalInfo.fullName}
                            className="w-24 h-24 rounded-full object-cover border-4 flex-shrink-0"
                            style={{ borderColor: 'var(--primary)' }}
                        />
                        <div className="flex-1">
                            <EditableElement
                                value={data.personalInfo.fullName}
                                onChange={(v) => onChange('personalInfo.fullName', v)}
                                tagName="h1"
                                className="text-3xl font-bold mb-1"
                                style={{ color: 'var(--text)' }}
                                placeholder="Your Name"
                                elementId="personal-name"
                            />
                            <EditableElement
                                value={data.personalInfo.title}
                                onChange={(v) => onChange('personalInfo.title', v)}
                                tagName="h2"
                                className="text-xl mb-3"
                                style={{ color: 'var(--primary)' }}
                                placeholder="Job Title"
                                elementId="personal-title"
                            />
                        </div>
                    </div>
                )}

                {/* Name and title - show when no photo OR centered style */}
                {(!templateConfig.showPhoto || !data.personalInfo.photo || templateConfig.headerStyle === 'centered') && (
                    <div className={templateConfig.headerStyle === 'split' ? 'flex-1' : ''}>
                        <EditableElement
                            value={data.personalInfo.fullName}
                            onChange={(v) => onChange('personalInfo.fullName', v)}
                            tagName="h1"
                            className="text-3xl font-bold mb-1"
                            style={{ color: 'var(--text)' }}
                            placeholder="Your Name"
                            elementId="personal-name"
                        />
                        <EditableElement
                            value={data.personalInfo.title}
                            onChange={(v) => onChange('personalInfo.title', v)}
                            tagName="h2"
                            className="text-xl mb-3"
                            style={{ color: 'var(--primary)' }}
                            placeholder="Job Title"
                            elementId="personal-title"
                        />
                    </div>
                )}

                <div className={`flex flex-wrap gap-4 ${templateConfig.headerStyle === 'centered' ? 'justify-center' : ''}`}
                    style={{ color: 'var(--text-muted)' }}>
                    {data.personalInfo.email && (
                        <span className="flex items-center gap-1 text-sm">
                            <Mail size={14} />
                            <EditableElement
                                value={data.personalInfo.email}
                                onChange={(v) => onChange('personalInfo.email', v)}
                                tagName="span"
                                placeholder="email@example.com"
                                elementId="personal-email"
                            />
                        </span>
                    )}
                    {data.personalInfo.phone && (
                        <span className="flex items-center gap-1 text-sm">
                            <Phone size={14} />
                            <EditableElement
                                value={data.personalInfo.phone}
                                onChange={(v) => onChange('personalInfo.phone', v)}
                                tagName="span"
                                placeholder="+1 234 567 890"
                                elementId="personal-phone"
                            />
                        </span>
                    )}
                    {data.personalInfo.location && (
                        <span className="flex items-center gap-1 text-sm">
                            <MapPin size={14} />
                            <EditableElement
                                value={data.personalInfo.location}
                                onChange={(v) => onChange('personalInfo.location', v)}
                                tagName="span"
                                placeholder="City, Country"
                                elementId="personal-location"
                            />
                        </span>
                    )}
                </div>
            </header>
        );
    };

    const renderSummarySection = (title: string) => (
        <section className="resume-section mb-6">
            <h3 className="text-lg font-bold border-b-2 pb-1 mb-3"
                style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }}>
                {title}
            </h3>
            <EditableElement
                value={data.personalInfo.summary}
                onChange={(v) => onChange('personalInfo.summary', v)}
                tagName="p"
                className="leading-relaxed"
                style={{ color: 'var(--text)' }}
                placeholder="Write a compelling professional summary..."
                multiline
                elementId="summary-content"
            />
        </section>
    );

    const renderExperienceSection = (title: string) => (
        <section className="resume-section mb-6">
            <h3 className="text-lg font-bold border-b-2 pb-1 mb-3"
                style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }}>
                {title}
            </h3>
            {(data.experience || []).map((exp, index) => (
                <div key={index} className="experience-item mb-4">
                    <div className="flex justify-between items-start mb-1">
                        <EditableElement
                            value={exp.position}
                            onChange={(v) => onChange(`experience.${index}.position`, v)}
                            tagName="h4"
                            className="font-semibold"
                            style={{ color: 'var(--text)' }}
                            placeholder="Job Title"
                            elementId={`exp-${index}-position`}
                        />
                        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                            {exp.startDate} - {exp.endDate}
                        </span>
                    </div>
                    <EditableElement
                        value={exp.company}
                        onChange={(v) => onChange(`experience.${index}.company`, v)}
                        tagName="p"
                        className="font-medium mb-2"
                        style={{ color: 'var(--secondary)' }}
                        placeholder="Company Name"
                        elementId={`exp-${index}-company`}
                    />
                    <EditableElement
                        value={exp.description}
                        onChange={(v) => onChange(`experience.${index}.description`, v)}
                        tagName="p"
                        className="text-sm leading-relaxed"
                        style={{ color: 'var(--text-muted)' }}
                        placeholder="Describe your achievements..."
                        multiline
                        elementId={`exp-${index}-description`}
                    />
                </div>
            ))}
        </section>
    );

    const renderEducationSection = (title: string) => (
        <section className="resume-section mb-6">
            <h3 className="text-lg font-bold border-b-2 pb-1 mb-3"
                style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }}>
                {title}
            </h3>
            {(data.education || []).map((edu, index) => (
                <div key={index} className="education-item mb-3">
                    <EditableElement
                        value={`${edu.degree} in ${edu.field}`}
                        onChange={(v) => onChange(`education.${index}.degree`, v)}
                        tagName="h4"
                        className="font-semibold"
                        style={{ color: 'var(--text)' }}
                        placeholder="Degree"
                        elementId={`edu-${index}-degree`}
                    />
                    <div className="flex justify-between">
                        <EditableElement
                            value={edu.institution}
                            onChange={(v) => onChange(`education.${index}.institution`, v)}
                            tagName="p"
                            style={{ color: 'var(--secondary)' }}
                            placeholder="Institution"
                            elementId={`edu-${index}-institution`}
                        />
                        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                            {edu.graduationDate}
                        </span>
                    </div>
                </div>
            ))}
        </section>
    );

    const renderSkillsSection = (title: string) => (
        <section className="resume-section mb-6">
            <h3 className="text-lg font-bold border-b-2 pb-1 mb-3"
                style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }}>
                {title}
            </h3>
            <div className="flex flex-wrap gap-2">
                {(data.skills || []).map((skill, index) => (
                    <span
                        key={index}
                        className="px-3 py-1 rounded-full text-sm"
                        style={{
                            backgroundColor: `color-mix(in srgb, var(--primary) 15%, transparent)`,
                            color: 'var(--primary)'
                        }}
                    >
                        {skill}
                    </span>
                ))}
            </div>
        </section>
    );

    const renderLanguagesSection = (title: string) => {
        if (!data.languages || data.languages.length === 0) return null;
        return (
            <section className="resume-section mb-6">
                <h3 className="text-lg font-bold border-b-2 pb-1 mb-3"
                    style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }}>
                    {title}
                </h3>
                <ul className="space-y-1">
                    {data.languages.map((lang, index) => (
                        <li key={index} className="flex justify-between text-sm">
                            <span style={{ color: 'var(--text)' }}>{lang.language}</span>
                            <span style={{ color: 'var(--text-muted)' }}>{lang.proficiency}</span>
                        </li>
                    ))}
                </ul>
            </section>
        );
    };

    const renderCertificationsSection = (title: string) => {
        if (!data.certifications || data.certifications.length === 0) return null;
        return (
            <section className="resume-section mb-6">
                <h3 className="text-lg font-bold border-b-2 pb-1 mb-3"
                    style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }}>
                    {title}
                </h3>
                {data.certifications.map((cert, index) => (
                    <div key={index} className="certification-item mb-2">
                        <p className="font-medium" style={{ color: 'var(--text)' }}>{cert.name}</p>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                            {cert.issuer} • {cert.date}
                        </p>
                    </div>
                ))}
            </section>
        );
    };

    // Render custom sections
    const renderCustomSections = () => {
        if (!data.customSections || data.customSections.length === 0) return null;
        return (
            <>
                {data.customSections.map((section, index) => (
                    <section key={section.id} className="resume-section mb-6 group">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold border-b-2 pb-1 mb-3 flex-1"
                                style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }}>
                                <EditableElement
                                    value={section.title}
                                    onChange={(v) => onChange(`customSections.${index}.title`, v)}
                                    tagName="span"
                                    placeholder="Section Title"
                                    elementId={`custom-${index}-title`}
                                />
                            </h3>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onChange('customSections', data.customSections?.filter((_, i) => i !== index));
                                }}
                                className="opacity-0 group-hover:opacity-100 text-red-500 text-xs ml-2 no-print"
                            >
                                [Delete]
                            </button>
                        </div>
                        <EditableElement
                            value={section.content}
                            onChange={(v) => onChange(`customSections.${index}.content`, v)}
                            tagName="p"
                            className="leading-relaxed whitespace-pre-wrap"
                            style={{ color: 'var(--text)' }}
                            placeholder="Section content..."
                            multiline
                            elementId={`custom-${index}-content`}
                        />
                    </section>
                ))}
            </>
        );
    };

    // Main render based on layout type
    const renderLayout = () => {
        switch (templateConfig.layout) {
            case 'two-column':
            case 'sidebar-left':
                return (
                    <div className="flex gap-6">
                        <aside style={{ width: 'var(--sidebar-width)' }}>
                            {sidebarSections.map((section, idx) => (
                                <div key={idx}>{renderSection(section)}</div>
                            ))}
                        </aside>
                        <main className="flex-1">
                            {mainSections.map((section, idx) => (
                                <div key={idx}>{renderSection(section)}</div>
                            ))}
                        </main>
                    </div>
                );

            case 'sidebar-right':
                return (
                    <div className="flex gap-6">
                        <main className="flex-1">
                            {mainSections.map((section, idx) => (
                                <div key={idx}>{renderSection(section)}</div>
                            ))}
                        </main>
                        <aside style={{ width: 'var(--sidebar-width)' }}>
                            {sidebarSections.map((section, idx) => (
                                <div key={idx}>{renderSection(section)}</div>
                            ))}
                        </aside>
                    </div>
                );

            case 'single-column':
            case 'header-focused':
            default:
                return (
                    <div>
                        {visibleSections.map((section, idx) => (
                            <div key={idx}>{renderSection(section)}</div>
                        ))}
                    </div>
                );
        }
    };

    return (
        <div
            className="resume-page"
            style={{
                ...cssVars,
                backgroundColor: 'var(--background)',
                color: 'var(--text)',
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--font-size)',
                padding: 'var(--padding)',
            }}
        >
            {/* Personal section is always first, rendered outside layout for header-focused */}
            {templateConfig.layout === 'header-focused' && renderPersonalSection()}

            {renderLayout()}

            {/* Custom sections always at the end */}
            {renderCustomSections()}
        </div>
    );
}

export default DynamicTemplate;
