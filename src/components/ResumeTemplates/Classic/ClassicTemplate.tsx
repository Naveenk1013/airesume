import { EditableElement } from '../../EditableElement';
import type { ResumeData } from '../../../types';
import { useCanvas, FONT_OPTIONS, SPACING_PRESETS } from '../../CanvasEditor';

interface TemplateProps {
    data: ResumeData;
    onUpdate?: (path: string, value: any) => void;
}

export function ClassicTemplate({ data, onUpdate = () => { } }: TemplateProps) {
    const { settings } = useCanvas();
    const update = (path: string) => (val: string) => onUpdate(path, val);

    const fontOption = FONT_OPTIONS.find(f => f.name === settings.fontFamily);
    const spacingPreset = SPACING_PRESETS[settings.spacing];

    // Dynamic styles based on canvas settings
    const containerStyle: React.CSSProperties = {
        backgroundColor: settings.backgroundColor,
        fontFamily: fontOption?.value || 'Inter, sans-serif',
        fontSize: `${settings.baseFontSize}px`,
        padding: `${spacingPreset.padding * 3}px`,
    };

    const accentColor = settings.accentColor;

    return (
        <div className="resume-page leading-relaxed" style={containerStyle}>
            {/* Header */}
            <header className="mb-6">
                <div className="flex items-start gap-4">
                    {/* Profile Photo */}
                    {data.personalInfo.photo && (
                        <img
                            src={data.personalInfo.photo}
                            alt={data.personalInfo.fullName}
                            className="w-20 h-20 rounded-full object-cover border-2 flex-shrink-0"
                            style={{ borderColor: accentColor }}
                        />
                    )}
                    <div className="flex-1">
                        <EditableElement
                            tagName="h1"
                            value={data.personalInfo.fullName}
                            onChange={update('personalInfo.fullName')}
                            className="text-3xl font-bold mb-1"
                            placeholder="Your Name"
                        />
                        <div className="flex flex-wrap items-center gap-x-2 text-sm opacity-70">
                            <EditableElement tagName="span" value={data.personalInfo.phone} onChange={update('personalInfo.phone')} placeholder="Phone" />
                            <span>•</span>
                            <EditableElement tagName="span" value={data.personalInfo.email} onChange={update('personalInfo.email')} placeholder="Email" />
                            <span>•</span>
                            <EditableElement tagName="span" value={data.personalInfo.location} onChange={update('personalInfo.location')} placeholder="Location" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Professional Title & Summary */}
            <section className="resume-section mb-6 pb-4 border-b-2" style={{ borderColor: accentColor }}>
                <EditableElement
                    tagName="h2"
                    value={data.personalInfo.title}
                    onChange={update('personalInfo.title')}
                    className="text-lg font-bold uppercase tracking-wide mb-2"
                    placeholder="PROFESSIONAL TITLE"
                    style={{ color: accentColor }}
                />
                <EditableElement
                    tagName="p"
                    value={data.personalInfo.summary}
                    onChange={update('personalInfo.summary')}
                    multiline
                    className="opacity-80 leading-relaxed"
                    placeholder="Professional summary..."
                />
            </section>

            {/* Key Competencies - 3 Column Grid */}
            {settings.visibleSections.skills && data.skills?.length > 0 && (
                <section className="resume-section mb-6 pb-4 border-b-2" style={{ borderColor: accentColor }}>
                    <h2 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: accentColor }}>Key Competencies</h2>
                    <div className="grid grid-cols-3 gap-x-4 gap-y-1">
                        {data.skills?.map((skill, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: accentColor }}></span>
                                <EditableElement tagName="span" value={skill} onChange={update(`skills.${index}`)} className="opacity-80" />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Professional Experience */}
            {settings.visibleSections.experience && (
                <section className="resume-section mb-6 pb-4 border-b-2" style={{ borderColor: accentColor }}>
                    <h2 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: accentColor }}>Professional Experience</h2>
                    {data.experience?.map((exp, index) => (
                        <div key={index} className="experience-item mb-5 last:mb-0">
                            <div className="flex justify-between items-start mb-1">
                                <div>
                                    <EditableElement tagName="span" value={exp.company} onChange={update(`experience.${index}.company`)} className="font-bold" placeholder="Company" />
                                </div>
                                <div className="text-sm font-medium whitespace-nowrap opacity-60">
                                    <EditableElement tagName="span" value={exp.startDate} onChange={update(`experience.${index}.startDate`)} placeholder="Start" />
                                    <span className="mx-1">-</span>
                                    <EditableElement tagName="span" value={exp.endDate} onChange={update(`experience.${index}.endDate`)} placeholder="End" />
                                </div>
                            </div>
                            <EditableElement tagName="p" value={exp.position} onChange={update(`experience.${index}.position`)} className="font-semibold italic mb-2" style={{ color: accentColor }} placeholder="Position" />
                            <EditableElement
                                tagName="p"
                                value={exp.description}
                                onChange={update(`experience.${index}.description`)}
                                multiline
                                className="opacity-80 whitespace-pre-wrap"
                                placeholder="Description with bullet points..."
                            />
                        </div>
                    ))}
                </section>
            )}

            {/* Bottom Split: Education | Certifications/Languages */}
            <div className="grid grid-cols-2 gap-8">
                {/* Education & Certifications */}
                {settings.visibleSections.education && (
                    <section className="resume-section">
                        <h2 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: accentColor }}>Education & Certifications</h2>
                        {data.education?.map((edu, index) => (
                            <div key={index} className="education-item mb-3">
                                <EditableElement tagName="p" value={edu.degree} onChange={update(`education.${index}.degree`)} className="font-bold" placeholder="Degree" />
                                <div className="opacity-80">
                                    <EditableElement tagName="span" value={edu.field} onChange={update(`education.${index}.field`)} placeholder="Major" />
                                </div>
                                <EditableElement tagName="p" value={edu.institution} onChange={update(`education.${index}.institution`)} className="opacity-60" placeholder="Institution" />
                            </div>
                        ))}
                        {settings.visibleSections.certifications && data.certifications?.map((cert, index) => (
                            <div key={index} className="certification-item mb-2">
                                <EditableElement tagName="p" value={cert.name} onChange={update(`certifications.${index}.name`)} className="font-bold" placeholder="Certification" />
                                <EditableElement tagName="p" value={cert.issuer} onChange={update(`certifications.${index}.issuer`)} className="opacity-60" placeholder="Issuer" />
                            </div>
                        ))}
                    </section>
                )}

                {/* Languages & Activities */}
                {settings.visibleSections.languages && (
                    <section className="resume-section">
                        <h2 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: accentColor }}>Languages & Activities</h2>
                        {data.languages?.map((lang, index) => (
                            <div key={index} className="flex justify-between mb-1">
                                <EditableElement tagName="span" value={lang.language} onChange={update(`languages.${index}.language`)} />
                                <EditableElement tagName="span" value={lang.proficiency} onChange={update(`languages.${index}.proficiency`)} className="opacity-60" />
                            </div>
                        ))}
                        {data.customSections?.map((section, index) => (
                            <div key={section.id} className="mt-4">
                                <EditableElement tagName="h3" value={section.title} onChange={update(`customSections.${index}.title`)} className="font-bold mb-1" placeholder="Section Title" />
                                <EditableElement tagName="p" value={section.content} onChange={update(`customSections.${index}.content`)} multiline className="opacity-80 whitespace-pre-wrap" placeholder="Content" />
                            </div>
                        ))}
                    </section>
                )}
            </div>
        </div>
    );
}
