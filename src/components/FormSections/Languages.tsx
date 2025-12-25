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
                <h3 className="text-xl font-semibold text-gray-900">Languages</h3>
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
                <div key={field.id} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between mb-4">
                        <h4 className="text-lg font-medium">Language {index + 1}</h4>
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
                            <label className="block text-sm font-medium text-gray-700">Language</label>
                            <input
                                type="text"
                                {...register(`languages.${index}.language`)}
                                placeholder="e.g., English, Spanish, Mandarin"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Proficiency</label>
                            <select
                                {...register(`languages.${index}.proficiency`)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
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
