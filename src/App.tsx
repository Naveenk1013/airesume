import React, { useState, useRef } from 'react';
import { Header } from './components/Header';
import { PhotoUpload } from './components/PhotoUpload';
import { PersonalInfo } from './components/FormSections/PersonalInfo';
import { Experience } from './components/FormSections/Experience';
import { Education } from './components/FormSections/Education';
import { Skills } from './components/FormSections/Skills';
import { Languages } from './components/FormSections/Languages';
import { Certifications } from './components/FormSections/Certifications';
import { CorporateTemplate1 } from './components/ResumeTemplates/Corporate/Template1';
import { ATSScoreCalculator } from './components/ATSScoreCalculator';
import { ResumeGuide } from './components/ResumeGuide';
import { FormProvider, useForm } from 'react-hook-form';
import { Download } from 'lucide-react';
import { exportToPDF, exportToWord } from './utils/exportUtils';
import type { ResumeData, ResumeTemplate } from './types';

const TEMPLATES: ResumeTemplate[] = [
  {
    id: 'corporate-1',
    name: 'Executive Pro',
    category: 'corporate',
    thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=400'
  },
  {
    id: 'sales-1',
    name: 'Sales Impact',
    category: 'sales',
    thumbnail: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&w=400'
  },
  {
    id: 'it-1',
    name: 'Tech Stack',
    category: 'it',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-bf19f8fd1085?auto=format&fit=crop&w=400'
  }
];

import { AIChatInterface } from './components/AIChat/AIChatInterface';
import { ResumeImport } from './components/ResumeImport';

function App() {
  // 'landing' | 'builder'
  const [viewMode, setViewMode] = useState<'landing' | 'builder'>('landing');
  const [showAIChat, setShowAIChat] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate | null>(TEMPLATES[0]);

  const resumeRef = useRef<HTMLDivElement>(null);

  // Load initial state from localStorage if available
  const savedData = localStorage.getItem('resumeData');
  const initialData = savedData ? JSON.parse(savedData) : {
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      title: '',
      summary: ''
    },
    experience: [],
    education: [],
    skills: [],
    languages: [],
    certifications: []
  };

  const methods = useForm<ResumeData>({
    defaultValues: initialData
  });

  const resumeData = methods.watch();

  // Auto-save to localStorage
  React.useEffect(() => {
    const saveTimer = setTimeout(() => {
      localStorage.setItem('resumeData', JSON.stringify(resumeData));
    }, 1000); // Debounce save every 1s

    return () => clearTimeout(saveTimer);
  }, [resumeData]);

  const handleExportPDF = async () => {
    if (resumeRef.current) {
      try {
        await exportToPDF(resumeRef.current);
      } catch (error) {
        console.error('Failed to export PDF:', error);
      }
    }
  };

  const handleExportWord = async () => {
    try {
      await exportToWord(resumeData);
    } catch (error) {
      console.error('Failed to export Word document:', error);
    }
  };

  const handleAIChatComplete = (data: ResumeData) => {
    methods.reset(data);
    setShowAIChat(false);
  };

  // Real-time update handler
  const handleAIProgress = React.useCallback((data: ResumeData) => {
    methods.reset(data, { keepDefaultValues: true });
  }, [methods]);

  // Handle mode selection
  const handleStartAI = () => {
    setShowAIChat(true);
    setViewMode('builder');
  };

  const handleImport = (data: ResumeData) => {
    methods.reset(data);
    setShowAIChat(false);
    setViewMode('builder');
  };

  const handleStartManual = () => {
    setShowAIChat(false);
    setViewMode('builder');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {viewMode === 'landing' ? (
          <div className="max-w-4xl mx-auto text-center space-y-12 py-12 animate-fadeIn">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Build Your Dream Resume <br />
                <span className="text-purple-600">With AI Intelligence</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Create a professional, ATS-friendly resume in minutes. Choose how you want to build.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* AI Builder Option */}
              <button
                onClick={handleStartAI}
                className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 border-2 border-transparent hover:border-purple-500 group"
              >
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-4xl">🤖</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">AI Resume Interviewer</h3>
                <p className="text-gray-600 text-center">
                  Chat with our AI assistant to extract your skills and experience naturally. Best for a quick, tailored resume.
                </p>
                <div className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-full font-medium group-hover:bg-purple-700 transition-colors">
                  Start AI Chat
                </div>
              </button>

              {/* Manual Builder Option */}
              <button
                onClick={handleStartManual}
                className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 border-2 border-transparent hover:border-blue-500 group"
              >
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-4xl">✍️</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Manual Builder</h3>
                <p className="text-gray-600 text-center">
                  Build your resume section by section using our comprehensive form editor. Total control over every detail.
                </p>
                <div className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full font-medium group-hover:bg-blue-700 transition-colors">
                  Start Manually
                </div>
              </button>

              {/* Import Resume Option */}
              <div className="flex flex-col p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 border-2 border-transparent hover:border-green-500">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-4xl">📤</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Import Resume</h3>
                  <p className="text-gray-600 text-center mb-6">
                    Upload your existing resume and let AI extract and rebuild it with your customizations.
                  </p>
                </div>
                <ResumeImport onImport={handleImport} />
              </div>
            </div>
          </div>
        ) : (
          <FormProvider {...methods}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: AI Chat or Form Builder */}
              <div className="space-y-8">
                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={() => setViewMode('landing')}
                    className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1"
                  >
                    ← Back to Home
                  </button>
                </div>
                {showAIChat ? (
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <AIChatInterface
                      onComplete={handleAIChatComplete}
                      onProgress={handleAIProgress}
                    />
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-lg p-6 animate-fadeIn">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold">Edit Your Resume</h2>
                      <button
                        onClick={() => setShowAIChat(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
                      >
                        ✨ Resume Chat
                      </button>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Profile Photo</h3>
                        <PhotoUpload
                          value={resumeData.personalInfo.photo}
                          onChange={(photo) => methods.setValue('personalInfo.photo', photo)}
                        />
                      </div>
                      <PersonalInfo />
                      <Experience />
                      <Education />
                      <Skills />
                      <Languages />
                      <Certifications />
                    </div>
                  </div>
                )}

                {!showAIChat && (
                  <>
                    <ATSScoreCalculator data={resumeData} />
                    <ResumeGuide />
                  </>
                )}
              </div>

              {/* Right Column: Live Preview (Always Visible) */}
              <div className="lg:sticky lg:top-8 space-y-4 h-fit">
                <div className="flex gap-4 justify-end">
                  <button
                    onClick={handleExportPDF}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 shadow-sm transition-all"
                  >
                    <Download size={20} />
                    Export PDF
                  </button>
                  <button
                    onClick={handleExportWord}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm transition-all"
                  >
                    <Download size={20} />
                    Export Word
                  </button>
                </div>

                <div ref={resumeRef} className="bg-white rounded-xl shadow-2xl p-8 min-h-[800px] border border-gray-100">
                  {/* Default to Corporate1 since we removed selection */}
                  <CorporateTemplate1 data={resumeData} />
                </div>
              </div>
            </div>
          </FormProvider>
        )}
      </main>
    </div>
  );
}

export default App;