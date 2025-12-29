import { EditableElement } from '../../EditableElement';
import type { ResumeData } from '../../../types';
import { useCanvas, FONT_OPTIONS, SPACING_PRESETS } from '../../CanvasEditor';

interface TemplateProps {
    data: ResumeData;
    onUpdate?: (path: string, value: any) => void;
}

export function ExecutiveTemplate({ data, onUpdate = () => { } }: TemplateProps) {
    const { settings } = useCanvas();
    const update = (path: string) => (val: string) => onUpdate(path, val);

    const fontOption = FONT_OPTIONS.find(f => f.name === settings.fontFamily);
    const spacingPreset = SPACING_PRESETS[settings.spacing];
    const accentColor = settings.accentColor;

    const containerStyle: React.CSSProperties = {
        backgroundColor: settings.backgroundColor,
        fontFamily: fontOption?.value || 'Inter, sans-serif',
        fontSize: `${settings.baseFontSize}px`,
        padding: `${spacingPreset.padding * 3}px`,
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        if (dateStr.toLowerCase() === 'present') return 'Present';
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return dateStr;
            return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="resume-page leading-relaxed" style={containerStyle}>
            {/* Centered Header */}
            <header className="text-center mb-6 pb-4 border-b" style={{ borderColor: accentColor + '40' }}>
                {/* Profile Photo */}
                {data.personalInfo.photo && (
                    <div className="flex justify-center mb-4">
                        <img
                            src={data.personalInfo.photo}
                            alt={data.personalInfo.fullName}
                            className="w-24 h-24 rounded-full object-cover border-2"
                            style={{ borderColor: accentColor }}
                        />
                    </div>
                )}
                <EditableElement
                    tagName="h1"
                    value={data.personalInfo.fullName}
                    onChange={update('personalInfo.fullName')}
                    className="text-3xl font-bold uppercase tracking-wider mb-1"
                    placeholder="YOUR NAME"
                />
                <EditableElement
                    tagName="p"
                    value={data.personalInfo.title}
                    onChange={update('personalInfo.title')}
                    className="text-lg uppercase tracking-wide mb-2"
                    placeholder="PROFESSIONAL TITLE"
                    style={{ color: accentColor }}
                />
                <div className="flex flex-wrap justify-center items-center gap-x-2 text-sm opacity-70">
                    <EditableElement tagName="span" value={data.personalInfo.location} onChange={update('personalInfo.location')} placeholder="Location" />
                    <span>•</span>
                    <EditableElement tagName="span" value={data.personalInfo.phone} onChange={update('personalInfo.phone')} placeholder="Phone" />
                    <span>•</span>
                    <EditableElement tagName="span" value={data.personalInfo.email} onChange={update('personalInfo.email')} placeholder="Email" />
                </div>
            </header>

            {/* Summary */}
            {settings.visibleSections.summary && (
                <section className="resume-section mb-6">
                    <h2 className="text-lg font-bold mb-2 pb-1 border-b" style={{ color: accentColor, borderColor: accentColor + '30' }}>SUMMARY</h2>
                    <EditableElement
                        tagName="p"
                        value={data.personalInfo.summary}
                        onChange={update('personalInfo.summary')}
                        multiline
                        className="opacity-80 leading-relaxed text-justify"
                        placeholder="Strategic professional summary..."
                    />
                </section>
            )}

            {/* Work Experience */}
            {settings.visibleSections.experience && (
                <section className="resume-section mb-6">
                    <h2 className="text-lg font-bold mb-4 pb-1 border-b" style={{ color: accentColor, borderColor: accentColor + '30' }}>WORK EXPERIENCE</h2>
                    {data.experience?.map((exp, index) => (
                        <div key={index} className="experience-item mb-5 last:mb-0">
                            <div className="flex justify-between items-baseline mb-1">
                                <EditableElement tagName="h3" value={exp.position} onChange={update(`experience.${index}.position`)} className="text-base font-bold" placeholder="Position Title" />
                                <span className="text-sm font-medium whitespace-nowrap opacity-60">
                                    {formatDate(exp.startDate)} – {formatDate(exp.endDate)}
                                </span>
                            </div>
                            <EditableElement tagName="p" value={exp.company} onChange={update(`experience.${index}.company`)} className="font-medium mb-2" style={{ color: accentColor }} placeholder="Company Name" />
                            <div className="pl-4">
                                <EditableElement
                                    tagName="div"
                                    value={exp.description}
                                    onChange={update(`experience.${index}.description`)}
                                    multiline
                                    className="opacity-80 whitespace-pre-wrap"
                                    placeholder="• Led initiatives achieving significant results...
• Developed comprehensive strategies...
• Facilitated successful implementations..."
                                />
                            </div>
                        </div>
                    ))}
                </section>
            )}

            {/* Education */}
            {settings.visibleSections.education && (
                <section className="resume-section mb-6">
                    <h2 className="text-lg font-bold mb-3 pb-1 border-b" style={{ color: accentColor, borderColor: accentColor + '30' }}>EDUCATION</h2>
                    {data.education?.map((edu, index) => (
                        <div key={index} className="education-item mb-3 last:mb-0">
                            <div className="flex items-baseline gap-2">
                                <EditableElement tagName="span" value={edu.degree} onChange={update(`education.${index}.degree`)} className="font-bold" placeholder="Degree" />
                                <span className="opacity-40">in</span>
                                <EditableElement tagName="span" value={edu.field} onChange={update(`education.${index}.field`)} className="opacity-80" placeholder="Field" />
                            </div>
                            <div className="flex items-center gap-2 opacity-60">
                                <span>•</span>
                                <span>Graduated:</span>
                                <EditableElement tagName="span" value={edu.graduationDate} onChange={update(`education.${index}.graduationDate`)} placeholder="Date" />
                            </div>
                            <EditableElement tagName="p" value={edu.institution} onChange={update(`education.${index}.institution`)} style={{ color: accentColor }} placeholder="Institution" />
                        </div>
                    ))}
                </section>
            )}

            {/* Skills */}
            {settings.visibleSections.skills && data.skills?.length > 0 && (
                <section className="resume-section mb-6">
                    <h2 className="text-lg font-bold mb-3 pb-1 border-b" style={{ color: accentColor, borderColor: accentColor + '30' }}>SKILLS</h2>
                    <div className="flex flex-wrap gap-2">
                        {data.skills?.map((skill, index) => (
                            <span key={index} className="flex items-center">
                                <EditableElement tagName="span" value={skill} onChange={update(`skills.${index}`)} className="opacity-80" />
                                {index < (data.skills?.length || 0) - 1 && <span className="mx-2 opacity-30">|</span>}
                            </span>
                        ))}
                    </div>
                </section>
            )}

            {/* Certifications */}
            {settings.visibleSections.certifications && data.certifications?.length > 0 && (
                <section className="resume-section mb-6">
                    <h2 className="text-lg font-bold mb-3 pb-1 border-b" style={{ color: accentColor, borderColor: accentColor + '30' }}>CERTIFICATIONS</h2>
                    {data.certifications?.map((cert, index) => (
                        <div key={index} className="certification-item flex items-center gap-2 mb-1">
                            <span style={{ color: accentColor }}>•</span>
                            <EditableElement tagName="span" value={cert.name} onChange={update(`certifications.${index}.name`)} className="font-medium" />
                            <span className="opacity-40">-</span>
                            <EditableElement tagName="span" value={cert.issuer} onChange={update(`certifications.${index}.issuer`)} className="opacity-60" />
                            <span className="opacity-40">(</span>
                            <EditableElement tagName="span" value={cert.date} onChange={update(`certifications.${index}.date`)} className="opacity-60" />
                            <span className="opacity-40">)</span>
                        </div>
                    ))}
                </section>
            )}

            {/* Custom Sections */}
            {data.customSections?.map((section, index) => (
                <section key={section.id} className="resume-section mb-6 group">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold mb-3 pb-1 border-b flex-1" style={{ color: accentColor, borderColor: accentColor + '30' }}>
                            <EditableElement tagName="span" value={section.title} onChange={update(`customSections.${index}.title`)} placeholder="Section Title" className="uppercase" />
                        </h2>
                        <button
                            onClick={(e) => { e.stopPropagation(); onUpdate('customSections', data.customSections?.filter((_, i) => i !== index)); }}
                            className="opacity-0 group-hover:opacity-100 text-red-500 text-xs ml-2 no-print"
                        >
                            [Delete]
                        </button>
                    </div>
                    <EditableElement tagName="p" value={section.content} onChange={update(`customSections.${index}.content`)} multiline className="opacity-80 whitespace-pre-wrap" placeholder="Content..." />
                </section>
            ))}
        </div>
    );
}
