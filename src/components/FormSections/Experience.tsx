import { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import type { ResumeData } from '../../types';
import { AIAssistantModal, type UserCareerInfo } from '../AIAssistantModal';
import { generateExperienceDescription } from '../../utils/aiService';

export function Experience() {
  const { register, control, formState: { errors }, setValue, getValues } = useFormContext<ResumeData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experience'
  });

  const [generatingIndex, setGeneratingIndex] = useState<number | null>(null);
  const [showAIModal, setShowAIModal] = useState(false);
  const [activeExperienceIndex, setActiveExperienceIndex] = useState<number | null>(null);

  const openAIModal = (index: number) => {
    setActiveExperienceIndex(index);
    setShowAIModal(true);
  };

  const handleAIGenerate = async (data: UserCareerInfo) => {
    if (activeExperienceIndex === null) return;

    setGeneratingIndex(activeExperienceIndex);
    try {
      // Get current values from the form to combine with user input
      const currentValues = getValues(`experience.${activeExperienceIndex}`);

      const description = await generateExperienceDescription({
        position: currentValues.position || data.role,
        company: currentValues.company || 'Company',
        startDate: currentValues.startDate || '2020-01-01',
        endDate: currentValues.endDate || 'Present',
        responsibilities: data.responsibilities,
      });

      setValue(`experience.${activeExperienceIndex}.description`, description, { shouldValidate: true });

      // Also update other fields if they were empty and provided in the modal
      if (!currentValues.position && data.role) {
        setValue(`experience.${activeExperienceIndex}.position`, data.role);
      }
    } catch (error) {
      console.error('Failed to generate description:', error);
      throw error;
    } finally {
      setGeneratingIndex(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900">Work Experience</h3>
        <button
          type="button"
          onClick={() => append({ company: '', position: '', startDate: '', endDate: '', description: '' })}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          <Plus size={16} />
          Add Experience
        </button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="p-6 border border-gray-200 rounded-2xl bg-white/40 shadow-sm">
          <div className="flex justify-between mb-4">
            <h4 className="text-lg font-bold text-gray-800">Position {index + 1}</h4>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openAIModal(index)}
                disabled={generatingIndex === index}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-purple-600 bg-purple-50 rounded-full hover:bg-purple-100 disabled:opacity-50 transition-all border border-purple-100"
              >
                <Sparkles size={14} />
                {generatingIndex === index ? 'Generating...' : 'Generate with AI'}
              </button>
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-600 hover:text-red-800 p-1"
                title="Remove Experience"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
                Company <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register(`experience.${index}.company`, {
                  required: 'Company name is required'
                })}
                placeholder="e.g., Google, Microsoft"
                className="mt-2 block w-full bg-white/50 border-gray-200 rounded-xl shadow-sm focus:border-purple-500 focus:ring-purple-500 text-gray-900 placeholder-gray-400 transition-all"
              />
              {errors.experience?.[index]?.company && (
                <p className="mt-1 text-sm text-red-600">{errors.experience[index]?.company?.message}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
                Position <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register(`experience.${index}.position`, {
                  required: 'Position title is required'
                })}
                placeholder="e.g., Senior Software Engineer"
                className="mt-2 block w-full bg-white/50 border-gray-200 rounded-xl shadow-sm focus:border-purple-500 focus:ring-purple-500 text-gray-900 placeholder-gray-400 transition-all"
                onChange={(e) => {
                  // Allow manual input to update form state immediately for AI to use
                  setValue(`experience.${index}.position`, e.target.value);
                }}
              />
              {errors.experience?.[index]?.position && (
                <p className="mt-1 text-sm text-red-600">{errors.experience[index]?.position?.message}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register(`experience.${index}.startDate`, {
                  required: 'Start date is required'
                })}
                className="mt-2 block w-full bg-white/50 border-gray-200 rounded-xl shadow-sm focus:border-purple-500 focus:ring-purple-500 text-gray-900 placeholder-gray-400 transition-all"
              />
              {errors.experience?.[index]?.startDate && (
                <p className="mt-1 text-sm text-red-600">{errors.experience[index]?.startDate?.message}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register(`experience.${index}.endDate`, {
                  required: 'End date is required (use current date if ongoing)'
                })}
                className="mt-2 block w-full bg-white/50 border-gray-200 rounded-xl shadow-sm focus:border-purple-500 focus:ring-purple-500 text-gray-900 placeholder-gray-400 transition-all"
              />
              {errors.experience?.[index]?.endDate && (
                <p className="mt-1 text-sm text-red-600">{errors.experience[index]?.endDate?.message}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register(`experience.${index}.description`, {
                  required: 'Job description is required',
                  minLength: { value: 50, message: 'Description should be at least 50 characters for better ATS score' }
                })}
                rows={5}
                placeholder="Describe your key responsibilities and achievements..."
                className="mt-2 block w-full bg-white/50 border-gray-200 rounded-xl shadow-sm focus:border-purple-500 focus:ring-purple-500 text-gray-900 placeholder-gray-400 transition-all"
              />
              {errors.experience?.[index]?.description && (
                <p className="mt-1 text-sm text-red-600">{errors.experience[index]?.description?.message}</p>
              )}
            </div>
          </div>
        </div>
      ))}

      <AIAssistantModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onGenerate={handleAIGenerate}
        section="experience"
      />
    </div>
  );
}