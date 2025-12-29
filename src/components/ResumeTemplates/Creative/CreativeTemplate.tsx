import { EditableElement } from '../../EditableElement';
import type { ResumeData } from '../../../types';
import { useCanvas, FONT_OPTIONS, SPACING_PRESETS } from '../../CanvasEditor';
import { Phone, Mail, MapPin } from 'lucide-react';

interface TemplateProps {
    data: ResumeData;
    onUpdate?: (path: string, value: any) => void;
}

export function CreativeTemplate({ data, onUpdate = () => { } }: TemplateProps) {
    const { settings } = useCanvas();
    const update = (path: string) => (val: string) => onUpdate(path, val);

    const fontOption = FONT_OPTIONS.find(f => f.name === settings.fontFamily);
    const accentColor = settings.accentColor;
    const sidebarBg = '#1e293b'; // Dark slate for sidebar
    const mainBg = settings.backgroundColor;

    const mainStyle: React.CSSProperties = {
        fontFamily: fontOption?.value || 'Inter, sans-serif',
        fontSize: `${settings.baseFontSize}px`,
    };

    return (
        <div className="resume-page !p-0 overflow-hidden flex" style={mainStyle}>
            {/* Dark Sidebar */}
            <aside className="w-[35%] text-white p-8 flex flex-col gap-8" style={{ backgroundColor: sidebarBg }}>
                {/* Photo */}
                {data.personalInfo.photo && (
                    <div className="flex justify-center">
                        <img
                            src={data.personalInfo.photo}
                            alt={data.personalInfo.fullName}
                            className="w-36 h-36 rounded-full object-cover border-4"
                            style={{ borderColor: accentColor + '50' }}
                        />
                    </div>
                )}

                {/* Contact */}
                <section className="resume-section">
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-4 pb-2 border-b border-slate-700">Contact</h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-3">
                            <Phone size={14} style={{ color: accentColor }} />
                            <EditableElement tagName="span" value={data.personalInfo.phone} onChange={update('personalInfo.phone')} className="text-slate-200" placeholder="Phone" />
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail size={14} style={{ color: accentColor }} />
                            <EditableElement tagName="span" value={data.personalInfo.email} onChange={update('personalInfo.email')} className="text-slate-200" placeholder="Email" />
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin size={14} style={{ color: accentColor }} />
                            <EditableElement tagName="span" value={data.personalInfo.location} onChange={update('personalInfo.location')} className="text-slate-200" placeholder="Location" />
                        </div>
                    </div>
                </section>

                {/* Education */}
                {settings.visibleSections.education && (
                    <section className="resume-section">
                        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-4 pb-2 border-b border-slate-700">Education</h2>
                        <div className="space-y-4">
                            {data.education?.map((edu, index) => (
                                <div key={index} className="education-item">
                                    <p className="text-slate-400 text-xs mb-1">
                                        <EditableElement tagName="span" value={edu.graduationDate} onChange={update(`education.${index}.graduationDate`)} placeholder="Year" />
                                    </p>
                                    <EditableElement tagName="p" value={edu.degree} onChange={update(`education.${index}.degree`)} className="font-bold text-white text-sm" placeholder="Degree" />
                                    <EditableElement tagName="p" value={edu.institution} onChange={update(`education.${index}.institution`)} className="text-slate-300 text-xs" placeholder="Institution" />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Expertise/Skills */}
                {settings.visibleSections.skills && (
                    <section className="resume-section">
                        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-4 pb-2 border-b border-slate-700">Expertise</h2>
                        <div className="space-y-2">
                            {data.skills?.map((skill, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }}></span>
                                    <EditableElement tagName="span" value={skill} onChange={update(`skills.${index}`)} className="text-slate-200" />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Languages */}
                {settings.visibleSections.languages && data.languages?.length > 0 && (
                    <section className="resume-section">
                        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-4 pb-2 border-b border-slate-700">Language</h2>
                        <div className="space-y-2">
                            {data.languages?.map((lang, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                    <EditableElement tagName="span" value={lang.language} onChange={update(`languages.${index}.language`)} className="text-slate-200" />
                                    <EditableElement tagName="span" value={lang.proficiency} onChange={update(`languages.${index}.proficiency`)} className="text-slate-400" />
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10" style={{ backgroundColor: mainBg }}>
                {/* Header */}
                <header className="mb-8 pb-6 border-b border-slate-200">
                    <EditableElement
                        tagName="h1"
                        value={data.personalInfo.fullName}
                        onChange={update('personalInfo.fullName')}
                        className="text-4xl font-bold mb-2"
                        placeholder="Your Name"
                    />
                    <EditableElement
                        tagName="p"
                        value={data.personalInfo.title}
                        onChange={update('personalInfo.title')}
                        className="text-xl font-semibold mb-4"
                        placeholder="Professional Title"
                        style={{ color: accentColor }}
                    />
                    {settings.visibleSections.summary && (
                        <EditableElement
                            tagName="p"
                            value={data.personalInfo.summary}
                            onChange={update('personalInfo.summary')}
                            multiline
                            className="opacity-70 text-sm leading-relaxed"
                            placeholder="Professional summary..."
                        />
                    )}
                </header>

                {/* Experience - Timeline Style */}
                {settings.visibleSections.experience && (
                    <section className="resume-section mb-8">
                        <h2 className="text-sm font-bold uppercase tracking-[0.15em] mb-6" style={{ color: accentColor }}>Experience</h2>
                        <div className="relative pl-6 border-l-2" style={{ borderColor: accentColor + '40' }}>
                            {data.experience?.map((exp, index) => (
                                <div key={index} className="experience-item mb-8 last:mb-0 relative">
                                    {/* Timeline Dot */}
                                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border-4" style={{ backgroundColor: accentColor, borderColor: mainBg }}></div>

                                    <div className="flex items-start justify-between mb-1">
                                        <div className="text-xs font-bold px-3 py-1 rounded" style={{ backgroundColor: accentColor + '20', color: accentColor }}>
                                            <EditableElement tagName="span" value={exp.startDate} onChange={update(`experience.${index}.startDate`)} placeholder="Start" />
                                            <span className="mx-1">-</span>
                                            <EditableElement tagName="span" value={exp.endDate} onChange={update(`experience.${index}.endDate`)} placeholder="End" />
                                        </div>
                                    </div>

                                    <EditableElement tagName="p" value={exp.company} onChange={update(`experience.${index}.company`)} className="opacity-60 text-xs font-medium mt-2" placeholder="Company" />
                                    <EditableElement tagName="h3" value={exp.position} onChange={update(`experience.${index}.position`)} className="font-bold text-lg" placeholder="Position" />

                                    <EditableElement
                                        tagName="p"
                                        value={exp.description}
                                        onChange={update(`experience.${index}.description`)}
                                        multiline
                                        className="opacity-70 text-sm mt-2 whitespace-pre-wrap"
                                        placeholder="Description..."
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* References */}
                {settings.visibleSections.certifications && data.certifications?.length > 0 && (
                    <section className="resume-section">
                        <h2 className="text-sm font-bold uppercase tracking-[0.15em] mb-4" style={{ color: accentColor }}>Reference</h2>
                        <div className="grid grid-cols-2 gap-6">
                            {data.certifications?.slice(0, 2).map((cert, index) => (
                                <div key={index} className="text-sm">
                                    <EditableElement tagName="p" value={cert.name} onChange={update(`certifications.${index}.name`)} className="font-bold" placeholder="Name" />
                                    <EditableElement tagName="p" value={cert.issuer} onChange={update(`certifications.${index}.issuer`)} className="opacity-60" placeholder="Title / Company" />
                                    <EditableElement tagName="p" value={cert.date} onChange={update(`certifications.${index}.date`)} className="opacity-40 text-xs" placeholder="Contact" />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Custom Sections */}
                {data.customSections?.map((section, index) => (
                    <section key={section.id} className="resume-section mt-8 group">
                        <div className="flex justify-between items-center">
                            <h2 className="text-sm font-bold uppercase tracking-[0.15em] mb-4" style={{ color: accentColor }}>
                                <EditableElement tagName="span" value={section.title} onChange={update(`customSections.${index}.title`)} placeholder="Section Title" />
                            </h2>
                            <button
                                onClick={(e) => { e.stopPropagation(); onUpdate('customSections', data.customSections?.filter((_, i) => i !== index)); }}
                                className="opacity-0 group-hover:opacity-100 text-red-500 text-xs no-print"
                            >
                                [Delete]
                            </button>
                        </div>
                        <EditableElement tagName="p" value={section.content} onChange={update(`customSections.${index}.content`)} multiline className="opacity-70 text-sm whitespace-pre-wrap" placeholder="Content..." />
                    </section>
                ))}
            </main>
        </div>
    );
}
