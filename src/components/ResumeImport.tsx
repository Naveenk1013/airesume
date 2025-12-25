import React, { useRef, useState } from 'react';
import { Upload, FileText, Loader2, AlertCircle } from 'lucide-react';
import { parseResumeFile } from '../utils/fileParser';
import { extractDataFromText } from '../utils/aiService';
import type { ResumeData } from '../types';

interface ResumeImportProps {
    onImport: (data: ResumeData) => void;
}

export function ResumeImport({ onImport }: ResumeImportProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFile = async (file: File) => {
        setIsUploading(true);
        setError(null);

        try {
            // 1. Parse file to text
            const text = await parseResumeFile(file);

            // 2. Extract data using AI
            const data = await extractDataFromText(text);

            // 3. Update parent
            onImport(data);
        } catch (err) {
            console.error('Import failed:', err);
            setError('Failed to parse resume. Please try a different file or check your internet connection.');
        } finally {
            setIsUploading(false);
            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        await handleFile(file);
    };

    const handleDrop = async (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragging(false);

        const file = event.dataTransfer.files[0];
        if (file && (file.type === 'application/pdf' || file.name.endsWith('.docx'))) {
            await handleFile(file);
        } else {
            setError('Please upload a PDF or DOCX file.');
        }
    };

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    return (
        <div className="w-full">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.docx"
                className="hidden"
            />

            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`
          relative border-2 border-dashed rounded-xl p-8 transition-all
          ${isDragging ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'}
          ${isUploading ? 'pointer-events-none opacity-70' : 'hover:border-green-400 hover:bg-green-50/50'}
        `}
            >
                <div className="flex flex-col items-center gap-4">
                    {isUploading ? (
                        <>
                            <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
                            <div className="text-center">
                                <p className="font-semibold text-gray-900">Analyzing your resume...</p>
                                <p className="text-sm text-gray-500 mt-1">This may take a few seconds</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <Upload className="w-8 h-8 text-green-600" />
                            </div>

                            <div className="text-center">
                                <p className="text-lg font-semibold text-gray-900 mb-1">
                                    Drop your resume here
                                </p>
                                <p className="text-sm text-gray-500 mb-4">
                                    or click the button below to browse
                                </p>

                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm"
                                >
                                    Choose File
                                </button>
                            </div>

                            <p className="text-xs text-gray-400 flex items-center gap-2">
                                <FileText size={14} />
                                Supports PDF & DOCX files
                            </p>
                        </>
                    )}
                </div>
            </div>

            {error && (
                <div className="mt-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg animate-fadeIn">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
}
