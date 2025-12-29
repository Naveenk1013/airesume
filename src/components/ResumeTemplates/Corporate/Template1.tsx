import { EditableElement } from '../../EditableElement';
import type { ResumeData } from '../../../types';
import { useCanvas, FONT_OPTIONS, SPACING_PRESETS } from '../../CanvasEditor';
import { Phone, Mail, MapPin } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
  onUpdate?: (path: string, value: any) => void;
}

export function CorporateTemplate({ data, onUpdate = () => { } }: TemplateProps) {
  const { settings } = useCanvas();
  const update = (path: string) => (val: string) => onUpdate(path, val);

  const fontOption = FONT_OPTIONS.find(f => f.name === settings.fontFamily);
  const accentColor = settings.accentColor;

  // Calculate contrasting sidebar color based on accent
  const sidebarBg = accentColor;
  const mainBg = settings.backgroundColor;

  const mainStyle: React.CSSProperties = {
    fontFamily: fontOption?.value || 'Inter, sans-serif',
    fontSize: `${settings.baseFontSize}px`,
  };

  return (
    <div className="resume-page !p-0 overflow-hidden" style={mainStyle}>
      {/* Dark Header Banner */}
      <header className="text-white px-10 py-8 flex items-center justify-between" style={{ backgroundColor: sidebarBg }}>
        <div>
          <EditableElement
            tagName="h1"
            value={data.personalInfo.fullName}
            onChange={update('personalInfo.fullName')}
            className="text-4xl font-black uppercase tracking-wider text-white mb-1"
            placeholder="YOUR NAME"
          />
          <EditableElement
            tagName="p"
            value={data.personalInfo.title}
            onChange={update('personalInfo.title')}
            className="text-lg uppercase tracking-[0.2em] text-white/70"
            placeholder="PROFESSIONAL TITLE"
          />
        </div>
        {data.personalInfo.photo && (
          <img
            src={data.personalInfo.photo}
            alt={data.personalInfo.fullName}
            className="w-24 h-24 rounded-lg object-cover border-2 border-white/30"
          />
        )}
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-[35%] text-white p-8 space-y-8 min-h-[calc(100%-140px)]" style={{ backgroundColor: sidebarBg }}>
          {/* Contact */}
          <section className="resume-section">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white/60 mb-4 pb-2 border-b border-white/20">Contact</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Phone size={14} className="text-white/60" />
                <EditableElement tagName="span" value={data.personalInfo.phone} onChange={update('personalInfo.phone')} className="text-white/80" placeholder="Phone" />
              </div>
              <div className="flex items-center gap-3">
                <Mail size={14} className="text-white/60" />
                <EditableElement tagName="span" value={data.personalInfo.email} onChange={update('personalInfo.email')} className="text-white/80" placeholder="Email" />
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={14} className="text-white/60" />
                <EditableElement tagName="span" value={data.personalInfo.location} onChange={update('personalInfo.location')} className="text-white/80" placeholder="Location" />
              </div>
            </div>
          </section>

          {/* Skills */}
          {settings.visibleSections.skills && (
            <section className="resume-section">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white/60 mb-4 pb-2 border-b border-white/20">Skills</h2>
              <div className="space-y-2">
                {data.skills?.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span className="w-1.5 h-1.5 bg-white/60 rounded-full"></span>
                    <EditableElement tagName="span" value={skill} onChange={update(`skills.${index}`)} className="text-white/80" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {settings.visibleSections.languages && data.languages?.length > 0 && (
            <section className="resume-section">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white/60 mb-4 pb-2 border-b border-white/20">Languages</h2>
              <div className="space-y-2 text-sm">
                {data.languages?.map((lang, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-white/60 rounded-full"></span>
                    <EditableElement tagName="span" value={lang.language} onChange={update(`languages.${index}.language`)} className="text-white/80" />
                    <span className="text-white/40">(</span>
                    <EditableElement tagName="span" value={lang.proficiency} onChange={update(`languages.${index}.proficiency`)} className="text-white/60" />
                    <span className="text-white/40">)</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Reference */}
          {settings.visibleSections.certifications && data.certifications?.length > 0 && (
            <section className="resume-section">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white/60 mb-4 pb-2 border-b border-white/20">Reference</h2>
              <div className="text-sm">
                <EditableElement tagName="p" value={data.certifications[0]?.name || ''} onChange={update(`certifications.0.name`)} className="font-bold text-white" placeholder="Name" />
                <EditableElement tagName="p" value={data.certifications[0]?.issuer || ''} onChange={update(`certifications.0.issuer`)} className="text-white/60" placeholder="Title" />
                <EditableElement tagName="p" value={data.certifications[0]?.date || ''} onChange={update(`certifications.0.date`)} className="text-white/40 text-xs" placeholder="Contact" />
              </div>
            </section>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-10" style={{ backgroundColor: mainBg }}>
          {/* Profile */}
          {settings.visibleSections.summary && (
            <section className="resume-section mb-8">
              <h2 className="text-sm font-bold uppercase tracking-[0.15em] mb-4 pb-2 border-b-2" style={{ color: accentColor, borderColor: accentColor }}>Profile</h2>
              <EditableElement
                tagName="p"
                value={data.personalInfo.summary}
                onChange={update('personalInfo.summary')}
                multiline
                className="opacity-70 text-sm leading-relaxed text-justify"
                placeholder="Professional profile summary..."
              />
            </section>
          )}

          {/* Work Experience */}
          {settings.visibleSections.experience && (
            <section className="resume-section mb-8">
              <h2 className="text-sm font-bold uppercase tracking-[0.15em] mb-4 pb-2 border-b-2" style={{ color: accentColor, borderColor: accentColor }}>Work Experience</h2>
              {data.experience?.map((exp, index) => (
                <div key={index} className="experience-item mb-6 last:mb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <EditableElement tagName="h3" value={exp.company} onChange={update(`experience.${index}.company`)} className="font-bold" placeholder="Company" />
                      <EditableElement tagName="p" value={exp.position} onChange={update(`experience.${index}.position`)} className="text-sm italic" style={{ color: accentColor }} placeholder="Position" />
                    </div>
                    <div className="text-white text-xs font-bold px-3 py-1 rounded whitespace-nowrap" style={{ backgroundColor: accentColor }}>
                      <EditableElement tagName="span" value={exp.startDate} onChange={update(`experience.${index}.startDate`)} className="text-white" placeholder="Start" />
                      <span className="mx-1">-</span>
                      <EditableElement tagName="span" value={exp.endDate} onChange={update(`experience.${index}.endDate`)} className="text-white" placeholder="End" />
                    </div>
                  </div>
                  <EditableElement
                    tagName="div"
                    value={exp.description}
                    onChange={update(`experience.${index}.description`)}
                    multiline
                    className="opacity-70 text-sm whitespace-pre-wrap pl-4"
                    placeholder="• Achievement 1
• Achievement 2"
                  />
                </div>
              ))}
            </section>
          )}

          {/* Education */}
          {settings.visibleSections.education && (
            <section className="resume-section">
              <h2 className="text-sm font-bold uppercase tracking-[0.15em] mb-4 pb-2 border-b-2" style={{ color: accentColor, borderColor: accentColor }}>Education</h2>
              <div className="grid grid-cols-2 gap-6">
                {data.education?.map((edu, index) => (
                  <div key={index} className="education-item flex justify-between items-start page-break-inside-avoid break-inside-avoid">
                    <div>
                      <EditableElement tagName="p" value={edu.degree} onChange={update(`education.${index}.degree`)} className="font-bold text-sm" placeholder="Degree" />
                      <EditableElement tagName="p" value={edu.field} onChange={update(`education.${index}.field`)} className="opacity-60 text-xs" placeholder="Field" />
                      <EditableElement tagName="p" value={edu.institution} onChange={update(`education.${index}.institution`)} className="text-xs" style={{ color: accentColor }} placeholder="Institution" />
                    </div>
                    <div className="text-xs font-bold px-2 py-1 rounded whitespace-nowrap" style={{ backgroundColor: accentColor + '20', color: accentColor }}>
                      <EditableElement tagName="span" value={edu.graduationDate} onChange={update(`education.${index}.graduationDate`)} placeholder="Year" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Custom Sections */}
          {data.customSections?.map((section, index) => (
            <section key={section.id} className="resume-section mt-8 group">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-bold uppercase tracking-[0.15em] mb-4 pb-2 border-b-2 flex-1" style={{ color: accentColor, borderColor: accentColor }}>
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
    </div>
  );
}