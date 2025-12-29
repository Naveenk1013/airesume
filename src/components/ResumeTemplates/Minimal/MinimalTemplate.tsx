import { EditableElement } from '../../EditableElement';
import type { ResumeData } from '../../../types';
import { useCanvas, FONT_OPTIONS, SPACING_PRESETS } from '../../CanvasEditor';
import { Phone, Mail, MapPin } from 'lucide-react';

interface TemplateProps {
    data: ResumeData;
    onUpdate?: (path: string, value: any) => void;
}

export function MinimalTemplate({ data, onUpdate = () => { } }: TemplateProps) {
    const { settings } = useCanvas();
    const update = (path: string) => (val: string) => onUpdate(path, val);

    const fontOption = FONT_OPTIONS.find(f => f.name === settings.fontFamily);
    const accentColor = settings.accentColor;
    const mainBg = settings.backgroundColor;

    const mainStyle: React.CSSProperties = {
        fontFamily: fontOption?.value || 'Inter, sans-serif',
        fontSize: `${settings.baseFontSize}px`,
    };

    return (
        <div className="resume-page !p-0 overflow-hidden flex" style={mainStyle}>
            {/* Left Column */}
            <aside className="w-[35%] p-8 flex flex-col gap-8" style={{ backgroundColor: mainBg === '#FFFFFF' ? '#f8fafc' : mainBg }}>
                {/* Name & Title */}
                <div className="text-center">
                    <EditableElement
                        tagName="h1"
                        value={data.personalInfo.fullName}
                        onChange={update('personalInfo.fullName')}
                        className="text-3xl font-light mb-1"
                        placeholder="Your Name"
                    />
                    <EditableElement
                        tagName="p"
                        value={data.personalInfo.title}
                        onChange={update('personalInfo.title')}
                        className="text-sm font-medium"
                        placeholder="Professional Title"
                        style={{ color: accentColor }}
                    />
                </div>

                {/* Photo */}
                {data.personalInfo.photo && (
                    <div className="flex justify-center">
                        <img
                            src={data.personalInfo.photo}
                            alt={data.personalInfo.fullName}
                            className="w-28 h-28 rounded-full object-cover border-2"
                            style={{ borderColor: accentColor + '30' }}
                        />
                    </div>
                )}

                {/* Contact */}
                <section className="resume-section">
                    <h2 className="text-xs font-bold uppercase tracking-[0.15em] mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></span>
                        Contact
                    </h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-3">
                            <Phone size={14} style={{ color: accentColor }} />
                            <EditableElement tagName="span" value={data.personalInfo.phone} onChange={update('personalInfo.phone')} className="opacity-70" placeholder="Phone" />
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail size={14} style={{ color: accentColor }} />
                            <EditableElement tagName="span" value={data.personalInfo.email} onChange={update('personalInfo.email')} className="opacity-70" placeholder="Email" />
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin size={14} style={{ color: accentColor }} />
                            <EditableElement tagName="span" value={data.personalInfo.location} onChange={update('personalInfo.location')} className="opacity-70" placeholder="Location" />
                        </div>
                    </div>
                </section>

                {/* About Me */}
                {settings.visibleSections.summary && (
                    <section className="resume-section">
                        <h2 className="text-xs font-bold uppercase tracking-[0.15em] mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></span>
                            About Me
                        </h2>
                        <EditableElement
                            tagName="p"
                            value={data.personalInfo.summary}
                            onChange={update('personalInfo.summary')}
                            multiline
                            className="opacity-70 text-sm leading-relaxed"
                            placeholder="Brief introduction..."
                        />
                    </section>
                )}

                {/* Skills */}
                {settings.visibleSections.skills && (
                    <section className="resume-section">
                        <h2 className="text-xs font-bold uppercase tracking-[0.15em] mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></span>
                            Skills
                        </h2>
                        <div className="space-y-2">
                            {data.skills?.map((skill, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }}></span>
                                    <EditableElement tagName="span" value={skill} onChange={update(`skills.${index}`)} className="opacity-70" />
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10" style={{ backgroundColor: mainBg }}>
                {/* Education */}
                {settings.visibleSections.education && (
                    <section className="resume-section mb-8">
                        <h2 className="text-sm font-bold uppercase tracking-[0.15em] mb-6 pb-2 border-b border-slate-200 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></span>
                            Education
                        </h2>
                        <div className="relative pl-6 border-l-2" style={{ borderColor: accentColor + '30' }}>
                            {data.education?.map((edu, index) => (
                                <div key={index} className="education-item mb-6 last:mb-0 relative">
                                    <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full border-4" style={{ backgroundColor: accentColor, borderColor: mainBg }}></div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <EditableElement tagName="h3" value={edu.degree} onChange={update(`education.${index}.degree`)} className="font-bold" placeholder="Degree" />
                                            <EditableElement tagName="p" value={edu.institution} onChange={update(`education.${index}.institution`)} className="font-medium text-sm" style={{ color: accentColor }} placeholder="Institution" />
                                            <EditableElement tagName="p" value={edu.field} onChange={update(`education.${index}.field`)} className="opacity-60 text-xs mt-1" placeholder="Field of Study" />
                                        </div>
                                        <div className="opacity-50 text-xs font-medium whitespace-nowrap">
                                            <EditableElement tagName="span" value={edu.graduationDate} onChange={update(`education.${index}.graduationDate`)} placeholder="Year" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Experience - Timeline */}
                {settings.visibleSections.experience && (
                    <section className="resume-section mb-8">
                        <h2 className="text-sm font-bold uppercase tracking-[0.15em] mb-6 pb-2 border-b border-slate-200 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></span>
                            Experience
                        </h2>
                        <div className="relative pl-6 border-l-2" style={{ borderColor: accentColor + '30' }}>
                            {data.experience?.map((exp, index) => (
                                <div key={index} className="experience-item mb-8 last:mb-0 relative">
                                    <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full border-4" style={{ backgroundColor: accentColor, borderColor: mainBg }}></div>
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <EditableElement tagName="h3" value={exp.position} onChange={update(`experience.${index}.position`)} className="font-bold" placeholder="Position" />
                                            <EditableElement tagName="p" value={exp.company} onChange={update(`experience.${index}.company`)} className="font-medium text-sm" style={{ color: accentColor }} placeholder="Company" />
                                        </div>
                                        <div className="opacity-50 text-xs font-medium whitespace-nowrap">
                                            <EditableElement tagName="span" value={exp.startDate} onChange={update(`experience.${index}.startDate`)} placeholder="Start" />
                                            <span className="mx-1">-</span>
                                            <EditableElement tagName="span" value={exp.endDate} onChange={update(`experience.${index}.endDate`)} placeholder="End" />
                                        </div>
                                    </div>
                                    <EditableElement
                                        tagName="p"
                                        value={exp.description}
                                        onChange={update(`experience.${index}.description`)}
                                        multiline
                                        className="opacity-70 text-sm whitespace-pre-wrap"
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
                        <h2 className="text-sm font-bold uppercase tracking-[0.15em] mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></span>
                            References
                        </h2>
                        <div className="grid grid-cols-2 gap-6">
                            {data.certifications?.slice(0, 2).map((cert, index) => (
                                <div key={index} className="text-sm">
                                    <EditableElement tagName="p" value={cert.name} onChange={update(`certifications.${index}.name`)} className="font-bold" placeholder="Name" />
                                    <EditableElement tagName="p" value={cert.issuer} onChange={update(`certifications.${index}.issuer`)} style={{ color: accentColor }} placeholder="Title / Company" />
                                    <EditableElement tagName="p" value={cert.date} onChange={update(`certifications.${index}.date`)} className="opacity-50 text-xs" placeholder="Contact" />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Languages */}
                {settings.visibleSections.languages && data.languages?.length > 0 && (
                    <section className="resume-section mt-8">
                        <h2 className="text-sm font-bold uppercase tracking-[0.15em] mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></span>
                            Languages
                        </h2>
                        <div className="flex flex-wrap gap-4">
                            {data.languages?.map((lang, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                    <EditableElement tagName="span" value={lang.language} onChange={update(`languages.${index}.language`)} className="font-medium" />
                                    <span className="opacity-30">:</span>
                                    <EditableElement tagName="span" value={lang.proficiency} onChange={update(`languages.${index}.proficiency`)} style={{ color: accentColor }} />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Custom Sections */}
                {data.customSections?.map((section, index) => (
                    <section key={section.id} className="resume-section mt-8 group">
                        <div className="flex justify-between items-center">
                            <h2 className="text-sm font-bold uppercase tracking-[0.15em] mb-4 pb-2 border-b border-slate-200 flex-1 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></span>
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
