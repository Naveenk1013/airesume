import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { PhotoUpload } from './components/PhotoUpload';
import { PersonalInfo } from './components/FormSections/PersonalInfo';
import { Experience } from './components/FormSections/Experience';
import { Education } from './components/FormSections/Education';
import { Skills } from './components/FormSections/Skills';
import { Languages } from './components/FormSections/Languages';
import { Certifications } from './components/FormSections/Certifications';
import { getTemplateById } from './components/ResumeTemplates/TemplateRegistry';
import { TemplateSelector } from './components/ResumeTemplates/TemplateSelector';
import { ATSScoreCalculator } from './components/ATSScoreCalculator';
import { FormProvider } from 'react-hook-form';
import { Download, Plus, Pencil } from 'lucide-react';
import { useToast } from './contexts/ToastContext';
import { exportToWord } from './utils/exportUtils';
import { useResumeData } from './hooks/useResumeData';
import { ResumeData } from './types';


import { AIChatInterface } from './components/AIChat/AIChatInterface';
import { ResumeImport } from './components/ResumeImport';
import { ResumePreviewWrapper } from './components/ResumePreviewWrapper';
import Orb from './components/UI/Orb';
import ImageTrail from './components/UI/ImageTrail';
import Silk from './components/UI/Silk';
import { Instructions } from './components/AIFeatures/Instructions';
import { PromptsLibrary } from './components/AIFeatures/PromptsLibrary';
import { PromptInjection } from './components/AIFeatures/PromptInjection';
import { CanvasProvider, CanvasToolbar, CanvasEditModeProvider } from './components/CanvasEditor';
import { IntroScreen } from './components/IntroScreen';

const App = () => {
  const { success, error: showError } = useToast();
  // Show intro screen on first load
  const [showIntro, setShowIntro] = useState(true);
  // 'landing' | 'builder' | 'instructions' | 'prompts' | 'injection'
  const [viewMode, setViewMode] = useState<'landing' | 'builder' | 'instructions' | 'prompts' | 'injection'>('landing');
  const [showAIChat, setShowAIChat] = useState(true);
  const [selectedTemplateId, setSelectedTemplateId] = useState('classic');


  const resumeRef = useRef<HTMLDivElement>(null);
  const { methods, resumeData, addCustomSection } = useResumeData();

  // Use react-to-print for native browser print to PDF
  const handlePrint = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: 'Resume',
    onAfterPrint: () => {
      success('Resume ready for printing/saving as PDF!');
    },
    onPrintError: (error) => {
      console.error('Print failed:', error);
      showError('Print failed. Please try again.');
    },
    pageStyle: `
      @page {
        size: A4;
        margin: 0;
      }
      @media print {
        html, body {
          height: 100%;
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden;
        }
        .resume-page {
          width: 210mm !important;
          min-height: 297mm !important;
          padding: 15mm !important;
          margin: 0 !important;
          box-shadow: none !important;
          background: white !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
    `,
  });

  const handleExportPDF = () => {
    handlePrint();
  };

  const handleExportWord = async () => {
    try {
      await exportToWord(resumeData);
      success('Resume exported to Word successfully!');
    } catch (error) {
      console.error('Failed to export Word document:', error);
      showError('Failed to export Word document. Please try again.');
    }
  };



  const handleAIChatComplete = (data: ResumeData) => {
    methods.reset(data);
    setShowAIChat(false);
    setViewMode('builder'); // Explicitly switch to builder view
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

  const trailImages = [
    '/templates/resume1.png',
    '/templates/resume2.png',
    '/templates/resume3.png',
    '/templates/resume4.png',
    '/templates/resume1.png',
    '/templates/resume2.png',
    '/templates/resume3.png',
    '/templates/resume4.png',
    '/templates/resume2.png',
    '/templates/resume1.png',
    '/templates/resume3.png',
    '/templates/resume4.png',
  ];

  return (
    <>
      {/* Interactive Intro Screen */}
      {showIntro && (
        <IntroScreen onComplete={() => setShowIntro(false)} />
      )}

      {/* Main App */}
      {!showIntro && (
        <CanvasProvider>
          <div className="min-h-screen bg-[#FAF9F6] text-gray-800 font-sans selection:bg-purple-200 selection:text-purple-900">
            {/* Global Background Silk */}
            <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
              <Silk color="#F5F5DC" speed={1.5} scale={0.7} noiseIntensity={0.6} />
            </div>

            <div className="relative z-10">
              <Header onNavigate={setViewMode} currentMode={viewMode} />

              <main className="container mx-auto px-4 py-12">
                {viewMode === 'landing' && (
                  <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden rounded-[3rem] mt-8 mx-4">
                    {/* Local Background Layer */}
                    <div className="absolute inset-0 z-1 opacity-20">
                      <ImageTrail items={trailImages} variant={1} />
                    </div>

                    {/* Foreground Content */}
                    <div className="relative z-10 max-w-6xl mx-auto text-center space-y-16 py-20 animate-fadeIn w-full px-8">
                      <div className="space-y-8">
                        <div className="inline-block px-4 py-1.5 bg-purple-50 border border-purple-100 rounded-full text-purple-600 text-xs font-black uppercase tracking-[0.2em] mb-4">
                          Powered by LANCE AI 2.0
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black text-gray-900 leading-[1.1] tracking-tighter">
                          Craft Your <br />
                          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600">Future Identity</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto font-medium leading-relaxed">
                          The world's most intelligent resume architect. <br className="hidden md:block" />
                          Designed for those who lead.
                        </p>
                      </div>

                      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* AI Builder Option */}
                        <button
                          onClick={handleStartAI}
                          className="flex flex-col items-center p-10 bg-white/40 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl shadow-gray-200/40 hover:shadow-purple-500/10 transition-all transform hover:-translate-y-4 border border-white/60 hover:border-purple-500/40 group relative overflow-hidden"
                        >
                          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-purple-500/10 transition-all"></div>
                          <div className="w-24 h-24 bg-black rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-all overflow-hidden relative shadow-2xl shadow-black/30">
                            <div className="absolute inset-0 w-full h-full">
                              <Orb hoverIntensity={0.6} rotateOnHover={true} />
                            </div>
                          </div>
                          <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">AI Agent</h3>
                          <p className="text-gray-500 text-center leading-relaxed font-bold text-base">
                            Real-time synthesis with LANCE AI.
                          </p>
                          <div className="mt-8 px-10 py-3 bg-gray-900 text-white rounded-2xl font-black shadow-2xl transition-all group-hover:bg-purple-600 group-hover:scale-105 active:scale-95 tracking-tight uppercase text-sm">
                            Launch AI
                          </div>
                        </button>

                        {/* Manual Builder Option */}
                        <button
                          onClick={handleStartManual}
                          className="flex flex-col items-center p-10 bg-white/40 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl shadow-gray-200/40 transition-all transform hover:-translate-y-4 border border-white/60 hover:border-blue-500/40 group relative overflow-hidden"
                        >
                          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-blue-500/10 transition-all"></div>
                          <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-all shadow-xl shadow-blue-100 border border-blue-100">
                            <span className="text-5xl">✍️</span>
                          </div>
                          <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Manual</h3>
                          <p className="text-gray-500 text-center leading-relaxed font-bold text-base">
                            Precise control over your narrative.
                          </p>
                          <div className="mt-8 px-10 py-3 bg-white text-gray-900 rounded-2xl font-black border-2 border-gray-100 shadow-xl transition-all group-hover:border-blue-500/40 group-hover:scale-105 active:scale-95 tracking-tight uppercase text-sm">
                            Build Now
                          </div>
                        </button>
                        {/* Import Resume Option */}
                        <div className="flex flex-col p-10 bg-white/40 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl shadow-gray-200/40 transition-all transform hover:-translate-y-4 border border-white/60 hover:border-green-500/40 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-green-500/10 transition-all"></div>
                          <div className="flex flex-col items-center mb-8">
                            <div className="w-24 h-24 bg-green-50 rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-green-100 border border-green-100 transition-all">
                              <span className="text-5xl">📤</span>
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Import</h3>
                            <p className="text-gray-500 text-center leading-relaxed font-bold text-base mb-6">
                              Upload existing resume.
                            </p>
                          </div>
                          <ResumeImport onImport={handleImport} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {viewMode === 'instructions' && (
                  <div className="animate-fadeIn">
                    <button
                      onClick={() => setViewMode('landing')}
                      className="mb-8 text-sm text-gray-500 hover:text-gray-900 flex items-center gap-2 font-bold px-4 py-2 bg-white/50 rounded-full w-fit transition-all backdrop-blur-sm"
                    >
                      ← Back to Home
                    </button>
                    <Instructions />
                  </div>
                )}

                {viewMode === 'prompts' && (
                  <div className="animate-fadeIn">
                    <button
                      onClick={() => setViewMode('landing')}
                      className="mb-8 text-sm text-gray-500 hover:text-gray-900 flex items-center gap-2 font-bold px-4 py-2 bg-white/50 rounded-full w-fit transition-all backdrop-blur-sm"
                    >
                      ← Back to Home
                    </button>
                    <PromptsLibrary />
                  </div>
                )}

                {viewMode === 'injection' && (
                  <div className="animate-fadeIn">
                    <button
                      onClick={() => setViewMode('landing')}
                      className="mb-8 text-sm text-gray-500 hover:text-gray-900 flex items-center gap-2 font-bold px-4 py-2 bg-white/50 rounded-full w-fit transition-all backdrop-blur-sm"
                    >
                      ← Back to Home
                    </button>
                    <PromptInjection />
                  </div>
                )}

                {viewMode === 'builder' && (
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
                          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white overflow-hidden ring-1 ring-gray-200/50">
                            <AIChatInterface
                              onComplete={handleAIChatComplete}
                              onProgress={handleAIProgress}
                            />
                          </div>
                        ) : (
                          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white animate-fadeIn ring-1 ring-gray-200/50">
                            <div className="flex justify-between items-center mb-8">
                              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Precision Builder</h2>
                              <button
                                onClick={() => setShowAIChat(true)}
                                className="flex items-center gap-2 px-5 py-2.5 bg-purple-50 text-purple-600 rounded-full hover:bg-purple-100 transition-all border border-purple-100 font-bold"
                              >
                                ✨ Resume Chat
                              </button>
                            </div>

                            <div className="space-y-10">
                              <div>
                                <h3 className="text-lg font-bold mb-6 text-gray-800 uppercase tracking-widest text-xs">Profile Branding</h3>
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
                          <div className="p-8 bg-purple-50/50 rounded-[2.5rem] border border-purple-100 text-center space-y-4">
                            <p className="text-purple-900 font-bold">Need help crafting the perfect response?</p>
                            <button
                              onClick={() => setViewMode('instructions')}
                              className="px-6 py-2 bg-purple-600 text-white rounded-full font-bold shadow-lg shadow-purple-200 hover:bg-purple-700 transition-all"
                            >
                              View Interactive Guide
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Right Column: Live Preview (Always Visible) */}
                      <div className="lg:sticky lg:top-8 space-y-4 h-fit">
                        <div className="flex gap-4 justify-end">
                          {showAIChat && (
                            <button
                              onClick={() => {
                                setShowAIChat(false);
                                setViewMode('builder');
                              }}
                              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 shadow-sm transition-all"
                            >
                              <Pencil size={16} />
                              Finish & Edit
                            </button>
                          )}
                          <button
                            onClick={handleExportPDF}
                            className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 shadow-lg shadow-purple-200 transition-all font-bold"
                          >
                            <Download size={20} />
                            Export PDF
                          </button>
                          <button
                            onClick={handleExportWord}
                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all font-bold"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Word
                          </button>
                        </div>

                        <TemplateSelector selectedId={selectedTemplateId} onSelect={setSelectedTemplateId} />

                        <ATSScoreCalculator data={resumeData} />

                        <CanvasEditModeProvider>
                          <CanvasToolbar />

                          <ResumePreviewWrapper>
                            <div ref={resumeRef} className="bg-white rounded-xl shadow-2xl min-h-[1120px] overflow-hidden">
                              {(() => {
                                const template = getTemplateById(selectedTemplateId);
                                if (template) {
                                  const TemplateComponent = template.component;
                                  return (
                                    <TemplateComponent
                                      data={resumeData}
                                      onUpdate={(path, value) => {
                                        methods.setValue(path as any, value, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
                                      }}
                                    />
                                  );
                                }
                                return null;
                              })()}
                            </div>
                          </ResumePreviewWrapper>
                        </CanvasEditModeProvider>

                        <button
                          onClick={addCustomSection}
                          className="mt-6 w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50 transition-all font-bold"
                        >
                          <Plus className="w-5 h-5 mr-2" />
                          Add New Custom Section
                        </button>
                      </div>
                    </div>
                  </FormProvider>
                )}
              </main>
              <Footer />
            </div>
          </div>
        </CanvasProvider>
      )}
    </>
  );
}

export default App;