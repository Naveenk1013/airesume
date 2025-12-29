import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Sparkles } from 'lucide-react';
import type { ResumeData } from '../../types';
import { AIAssistantModal, type UserCareerInfo } from '../AIAssistantModal';
import { generateProfessionalSummary } from '../../utils/aiService';

export function PersonalInfo() {
  const { register, formState: { errors }, setValue } = useFormContext<ResumeData>();
  const [showAIModal, setShowAIModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAIGenerate = async (data: UserCareerInfo) => {
    setIsGenerating(true);
    try {
      const summary = await generateProfessionalSummary({
        role: data.role,
        yearsOfExperience: data.yearsOfExperience,
        industry: data.industry,
        skills: data.skills || [],
        goals: data.goals,
      });

      // Auto-fill the summary field
      setValue('personalInfo.summary', summary, { shouldValidate: true });
    } catch (error) {
      console.error('Failed to generate summary:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
        <button
          type="button"
          onClick={() => setShowAIModal(true)}
          disabled={isGenerating}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Sparkles size={16} />
          {isGenerating ? 'Generating...' : 'Generate Summary with AI'}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('personalInfo.fullName', {
              required: 'Full name is required',
              minLength: { value: 2, message: 'Name must be at least 2 characters' }
            })}
            className="mt-2 block w-full bg-white/50 border-gray-200 rounded-xl shadow-sm focus:border-purple-500 focus:ring-purple-500 text-gray-900 placeholder-gray-400 transition-all"
          />
          {errors.personalInfo?.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.personalInfo.fullName.message}</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
            Professional Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('personalInfo.title', {
              required: 'Professional title is required'
            })}
            className="mt-2 block w-full bg-white/50 border-gray-200 rounded-xl shadow-sm focus:border-purple-500 focus:ring-purple-500 text-gray-900 placeholder-gray-400 transition-all"
          />
          {errors.personalInfo?.title && (
            <p className="mt-1 text-sm text-red-600">{errors.personalInfo.title.message}</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            {...register('personalInfo.email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            className="mt-2 block w-full bg-white/50 border-gray-200 rounded-xl shadow-sm focus:border-purple-500 focus:ring-purple-500 text-gray-900 placeholder-gray-400 transition-all"
          />
          {errors.personalInfo?.email && (
            <p className="mt-1 text-sm text-red-600">{errors.personalInfo.email.message}</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            {...register('personalInfo.phone', {
              required: 'Phone number is required',
              pattern: {
                value: /^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/,
                message: 'Invalid phone number format'
              }
            })}
            className="mt-2 block w-full bg-white/50 border-gray-200 rounded-xl shadow-sm focus:border-purple-500 focus:ring-purple-500 text-gray-900 placeholder-gray-400 transition-all"
          />
          {errors.personalInfo?.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.personalInfo.phone.message}</p>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
            Location
          </label>
          <input
            type="text"
            {...register('personalInfo.location')}
            placeholder="City, State/Country"
            className="mt-2 block w-full bg-white/50 border-gray-200 rounded-xl shadow-sm focus:border-purple-500 focus:ring-purple-500 text-gray-900 placeholder-gray-400 transition-all"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
            Professional Summary <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register('personalInfo.summary', {
              required: 'Professional summary is required',
              minLength: { value: 50, message: 'Summary should be at least 50 characters for better ATS score' }
            })}
            rows={4}
            placeholder="Write a compelling professional summary highlighting your key skills and experience..."
            className="mt-2 block w-full bg-white/50 border-gray-200 rounded-xl shadow-sm focus:border-purple-500 focus:ring-purple-500 text-gray-900 placeholder-gray-400 transition-all"
          />
          {errors.personalInfo?.summary && (
            <p className="mt-1 text-sm text-red-600">{errors.personalInfo.summary.message}</p>
          )}
        </div>
      </div>

      <AIAssistantModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onGenerate={handleAIGenerate}
        section="summary"
      />
    </div>
  );
}