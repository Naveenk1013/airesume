import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import type { ResumeData } from '../../types';

export function Education() {
  const { register, control, formState: { errors } } = useFormContext<ResumeData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education'
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900">Education</h3>
        <button
          type="button"
          onClick={() => append({ institution: '', degree: '', field: '', graduationDate: '' })}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          <Plus size={16} />
          Add Education
        </button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="p-6 border border-gray-200 rounded-2xl bg-white/40 shadow-sm">
          <div className="flex justify-between mb-4">
            <h4 className="text-lg font-bold text-gray-800">Education {index + 1}</h4>
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
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
                Institution <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register(`education.${index}.institution`, {
                  required: 'Institution name is required'
                })}
                placeholder="e.g., Stanford University"
                className="mt-2 block w-full bg-white/50 border-gray-200 rounded-xl shadow-sm focus:border-purple-500 focus:ring-purple-500 text-gray-900 placeholder-gray-400 transition-all"
              />
              {errors.education?.[index]?.institution && (
                <p className="mt-1 text-sm text-red-600">{errors.education[index]?.institution?.message}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
                Degree <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register(`education.${index}.degree`, {
                  required: 'Degree is required'
                })}
                placeholder="e.g., Bachelor of Science"
                className="mt-2 block w-full bg-white/50 border-gray-200 rounded-xl shadow-sm focus:border-purple-500 focus:ring-purple-500 text-gray-900 placeholder-gray-400 transition-all"
              />
              {errors.education?.[index]?.degree && (
                <p className="mt-1 text-sm text-red-600">{errors.education[index]?.degree?.message}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
                Field of Study <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register(`education.${index}.field`, {
                  required: 'Field of study is required'
                })}
                placeholder="e.g., Computer Science"
                className="mt-2 block w-full bg-white/50 border-gray-200 rounded-xl shadow-sm focus:border-purple-500 focus:ring-purple-500 text-gray-900 placeholder-gray-400 transition-all"
              />
              {errors.education?.[index]?.field && (
                <p className="mt-1 text-sm text-red-600">{errors.education[index]?.field?.message}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
                Graduation Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register(`education.${index}.graduationDate`, {
                  required: 'Graduation date is required'
                })}
                className="mt-2 block w-full bg-white/50 border-gray-200 rounded-xl shadow-sm focus:border-purple-500 focus:ring-purple-500 text-gray-900 placeholder-gray-400 transition-all"
              />
              {errors.education?.[index]?.graduationDate && (
                <p className="mt-1 text-sm text-red-600">{errors.education[index]?.graduationDate?.message}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}