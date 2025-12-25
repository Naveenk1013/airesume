import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Plus, X, Sparkles } from 'lucide-react';
import type { ResumeData } from '../../types';
import { AIAssistantModal, type UserCareerInfo } from '../AIAssistantModal';
import { suggestSkills } from '../../utils/aiService';

export function Skills() {
  const { register, watch, setValue } = useFormContext<ResumeData>();
  const [newSkill, setNewSkill] = useState('');
  const [showAIModal, setShowAIModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const skills = watch('skills');

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setValue('skills', [...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setValue('skills', skills.filter(skill => skill !== skillToRemove));
  };

  const handleAIGenerate = async (data: UserCareerInfo) => {
    setIsGenerating(true);
    try {
      const experienceLevel = data.yearsOfExperience > 7 ? 'senior' : data.yearsOfExperience > 3 ? 'intermediate' : 'entry';
      const suggestedSkills = await suggestSkills(data.role, data.industry, experienceLevel);

      // Merge with existing skills (avoid duplicates)
      const uniqueSkills = [...new Set([...skills, ...suggestedSkills])];
      setValue('skills', uniqueSkills);
    } catch (error) {
      console.error('Failed to generate skills:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Skills</h3>
        <button
          type="button"
          onClick={() => setShowAIModal(true)}
          disabled={isGenerating}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Sparkles size={16} />
          {isGenerating ? 'Suggesting...' : 'Suggest Skills with AI'}
        </button>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
          placeholder="Add a skill"
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        />
        <button
          type="button"
          onClick={addSkill}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="text-purple-600 hover:text-purple-800"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <AIAssistantModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onGenerate={handleAIGenerate}
        section="skills"
      />
    </div>
  );
}