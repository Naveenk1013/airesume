import { useState } from 'react';
import { Sparkles, X, Loader2 } from 'lucide-react';

interface AIAssistantModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (data: UserCareerInfo) => Promise<void>;
    section?: 'summary' | 'experience' | 'skills';
}

export interface UserCareerInfo {
    role: string;
    yearsOfExperience: number;
    industry: string;
    skills?: string[];
    goals?: string;
    responsibilities?: string;
}

export function AIAssistantModal({ isOpen, onClose, onGenerate, section = 'summary' }: AIAssistantModalProps) {
    const [formData, setFormData] = useState<UserCareerInfo>({
        role: '',
        yearsOfExperience: 0,
        industry: '',
        skills: [],
        goals: '',
        responsibilities: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await onGenerate(formData);
            onClose();
            // Reset form
            setFormData({
                role: '',
                yearsOfExperience: 0,
                industry: '',
                skills: [],
                goals: '',
                responsibilities: '',
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate content');
        } finally {
            setIsLoading(false);
        }
    };

    const getSectionTitle = () => {
        switch (section) {
            case 'summary':
                return 'Generate Professional Summary';
            case 'experience':
                return 'Generate Job Description';
            case 'skills':
                return 'Suggest Skills';
            default:
                return 'AI Assistant';
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center gap-2">
                        <Sparkles className="text-purple-600" size={24} />
                        <h2 className="text-2xl font-bold text-gray-900">{getSectionTitle()}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                        disabled={isLoading}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Job Title / Role <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            placeholder="e.g., Senior Software Engineer, Marketing Manager"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Years of Experience <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            value={formData.yearsOfExperience}
                            onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) || 0 })}
                            placeholder="e.g., 5"
                            min="0"
                            max="50"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Industry <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.industry}
                            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                            placeholder="e.g., Technology, Healthcare, Finance"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {section === 'summary' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Career Goals (Optional)
                                </label>
                                <textarea
                                    value={formData.goals}
                                    onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                                    placeholder="What are you looking to achieve in your next role?"
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    disabled={isLoading}
                                />
                            </div>
                        </>
                    )}

                    {section === 'experience' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Key Responsibilities (Optional)
                            </label>
                            <textarea
                                value={formData.responsibilities}
                                onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                                placeholder="Brief description of what you did in this role..."
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                disabled={isLoading}
                            />
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t">
                        <p className="text-sm text-gray-500">
                            ✨ AI will generate professional, ATS-optimized content
                        </p>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={16} />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={16} />
                                        Generate
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
