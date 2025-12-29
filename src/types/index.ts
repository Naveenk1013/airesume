export interface ResumeTemplate {
  id: string;
  name: string;
  category: 'corporate' | 'sales' | 'it' | 'academic';
  thumbnail: string;
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  photo?: string;
  title: string;
  summary: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
}

export interface Language {
  language: string;
  proficiency: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  languages: Language[];
  certifications: Certification[];
  customSections?: CustomSection[];
}