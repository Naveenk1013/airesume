import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import type { ResumeData } from '../../types';

export function Languages() {
    const { register, control } = useFormContext<ResumeData>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'languages'
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Languages</h3>
                <button
                    type="button"
                    onClick={() => append({ language: '', proficiency: '' })}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                    <Plus size={16} />
                    Add Language
                </button>
            </div>

            {fields.map((field, index) => (
                <div key={field.id} className="p-6 border border-gray-200 rounded-2xl bg-white/40 shadow-sm">
                    <div className="flex justify-between mb-4">
                        <h4 className="text-lg font-bold text-gray-800">Language {index + 1}</h4>
                        <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-red-600 hover:text-red-800"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Language</label>
                            <input
                                type="text"
                                {...register(`languages.${index}.language`)}
                                placeholder="e.g., English, Spanish, Mandarin"
                                className="mt-2 block w-full bg-white/50 border-gray-200 rounded-xl shadow-sm focus:border-purple-500 focus:ring-purple-500 text-gray-900 placeholder-gray-400 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Proficiency</label>
                            <select
                                {...register(`languages.${index}.proficiency`)}
                                className="mt-2 block w-full bg-white/50 border-gray-200 rounded-xl shadow-sm focus:border-purple-500 focus:ring-purple-500 text-gray-900 placeholder-gray-400 transition-all"
                            >
                                <option value="">Select proficiency</option>
                                <option value="Native">Native</option>
                                <option value="Fluent">Fluent</option>
                                <option value="Advanced">Advanced</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Basic">Basic</option>
                            </select>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
