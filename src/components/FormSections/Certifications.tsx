import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import type { ResumeData } from '../../types';

export function Certifications() {
    const { register, control } = useFormContext<ResumeData>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'certifications'
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Certifications</h3>
                <button
                    type="button"
                    onClick={() => append({ name: '', issuer: '', date: '' })}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                    <Plus size={16} />
                    Add Certification
                </button>
            </div>

            {fields.map((field, index) => (
                <div key={field.id} className="p-6 border border-gray-200 rounded-2xl bg-white/40 shadow-sm">
                    <div className="flex justify-between mb-4">
                        <h4 className="text-lg font-bold text-gray-800">Certification {index + 1}</h4>
                        <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-red-600 hover:text-red-800"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Certification Name</label>
                            <input
                                type="text"
                                {...register(`certifications.${index}.name`)}
                                placeholder="e.g., AWS Certified Solutions Architect"
                                className="mt-2 block w-full bg-white/50 border-gray-200 rounded-xl shadow-sm focus:border-purple-500 focus:ring-purple-500 text-gray-900 placeholder-gray-400 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Issuing Organization</label>
                            <input
                                type="text"
                                {...register(`certifications.${index}.issuer`)}
                                placeholder="e.g., Amazon Web Services"
                                className="mt-2 block w-full bg-white/50 border-gray-200 rounded-xl shadow-sm focus:border-purple-500 focus:ring-purple-500 text-gray-900 placeholder-gray-400 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Date Obtained</label>
                            <input
                                type="date"
                                {...register(`certifications.${index}.date`)}
                                className="mt-2 block w-full bg-white/50 border-gray-200 rounded-xl shadow-sm focus:border-purple-500 focus:ring-purple-500 text-gray-900 placeholder-gray-400 transition-all"
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
