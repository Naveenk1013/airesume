import React, { useEffect, useRef, useState } from 'react';

interface ResumePreviewWrapperProps {
    children: React.ReactNode;
}

export function ResumePreviewWrapper({ children }: ResumePreviewWrapperProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const calculateScale = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.clientWidth;
                const targetWidth = 794; // A4 width in px

                // Add some padding/margin safety
                const availableWidth = containerWidth - 32;

                // Only scale down, never up
                const newScale = Math.min(1, availableWidth / targetWidth);
                setScale(newScale);
            }
        };

        // Initial calculation
        calculateScale();

        // Add resize listener
        window.addEventListener('resize', calculateScale);

        // Cleanup
        return () => window.removeEventListener('resize', calculateScale);
    }, []);

    return (
        <div
            ref={containerRef}
            className="w-full relative overflow-hidden flex justify-center bg-gray-100 rounded-xl border border-gray-200"
            style={{
                // Dynamic height based on scale to prevent extra whitespace
                minHeight: `${1120 * scale + 40}px`
            }}
        >
            <div
                style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'top center',
                    width: '794px', // Force the fixed width for the inner content
                    marginTop: '20px',
                    marginBottom: '20px'
                }}
            >
                {children}
            </div>
        </div>
    );
}
