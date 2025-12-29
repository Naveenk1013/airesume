import { useEffect } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { ResumeData } from '../types';

const INITIAL_DATA: ResumeData = {
    personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        title: '',
        summary: ''
    },
    experience: [],
    education: [],
    skills: [],
    languages: [],
    certifications: [],
    customSections: []
};

export const useResumeData = () => {
    // Load initial state from localStorage if available
    const savedData = localStorage.getItem('resumeData');
    const initialData = savedData ? JSON.parse(savedData) : INITIAL_DATA;

    const methods = useForm<ResumeData>({
        defaultValues: initialData
    });

    const resumeData = methods.watch();

    // Auto-save to localStorage
    useEffect(() => {
        const saveTimer = setTimeout(() => {
            localStorage.setItem('resumeData', JSON.stringify(resumeData));
        }, 1000); // Debounce save every 1s

        return () => clearTimeout(saveTimer);
    }, [resumeData]);

    const addCustomSection = () => {
        const newSection = {
            id: crypto.randomUUID(),
            title: 'Custom Section',
            content: 'Add details about your projects, volunteer work, or other achievements here.'
        };

        // access react-hook-form setValue to update nested array safely
        const currentSections = methods.getValues('customSections') || [];
        methods.setValue('customSections', [...currentSections, newSection]);
    };

    return {
        methods,
        resumeData,
        addCustomSection
    };
};
