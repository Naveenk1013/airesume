import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { useCanvasObjects } from './CanvasObjectContext';
import { CanvasObject } from './CanvasObject';
import { TextObject } from './TextObject';
import { ImageObject } from './ImageObject';
import { ShapeObject } from './ShapeObject';
import { useCanvas } from './CanvasContext';

interface InteractiveCanvasProps {
    width?: number;
    height?: number;
    showGrid?: boolean;
}

// A4 dimensions in pixels at 96 DPI
const A4_WIDTH = 794; // 210mm
const A4_HEIGHT = 1123; // 297mm

export function InteractiveCanvas({
    width = A4_WIDTH,
    height = A4_HEIGHT,
    showGrid = true,
}: InteractiveCanvasProps) {
    const canvasRef = useRef<HTMLDivElement>(null);
    const objectRefs = useMemo(() => new Map<string, HTMLDivElement>(), []);

    const { settings } = useCanvas();
    const {
        objects,
        selectedIds,
        selectObject,
        clearSelection,
        deleteSelected,
        duplicateSelected,
    } = useCanvasObjects();

    // Handle canvas click (deselect all)
    const handleCanvasClick = (e: React.MouseEvent) => {
        if (e.target === canvasRef.current) {
            clearSelection();
        }
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Only handle if not typing in an input
            if (
                e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement ||
                (e.target as HTMLElement).isContentEditable
            ) {
                return;
            }

            // Delete selected
            if (e.key === 'Delete' || e.key === 'Backspace') {
                e.preventDefault();
                deleteSelected();
            }

            // Duplicate (Ctrl/Cmd + D)
            if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                e.preventDefault();
                duplicateSelected();
            }

            // Select all (Ctrl/Cmd + A)
            if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
                e.preventDefault();
                // selectAll() - we'd need to pass this in
            }

            // Escape to deselect
            if (e.key === 'Escape') {
                clearSelection();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [deleteSelected, duplicateSelected, clearSelection]);

    // Handle object selection
    const handleObjectSelect = useCallback((id: string) => (e: React.MouseEvent) => {
        e.stopPropagation();
        selectObject(id, e.shiftKey || e.ctrlKey || e.metaKey);
    }, [selectObject]);

    // Render object content based on type
    const renderObjectContent = (object: typeof objects[0], isSelected: boolean) => {
        switch (object.type) {
            case 'text':
                return <TextObject object={object} isSelected={isSelected} />;
            case 'image':
                return <ImageObject object={object} isSelected={isSelected} />;
            case 'shape':
                return <ShapeObject object={object} isSelected={isSelected} />;
            default:
                return null;
        }
    };

    // Sort objects by z-index for rendering
    const sortedObjects = useMemo(() => {
        return [...objects].sort((a, b) => a.zIndex - b.zIndex);
    }, [objects]);

    // Grid pattern for visual guidance
    const gridPattern = showGrid ? (
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
                </pattern>
                <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                    <rect width="100" height="100" fill="url(#smallGrid)" />
                    <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#d1d5db" strokeWidth="1" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
    ) : null;

    // Center guides
    const centerGuides = (
        <div className="absolute inset-0 pointer-events-none">
            {/* Vertical center */}
            <div
                className="absolute top-0 bottom-0 w-px bg-blue-400/30"
                style={{ left: '50%' }}
            />
            {/* Horizontal center */}
            <div
                className="absolute left-0 right-0 h-px bg-blue-400/30"
                style={{ top: '50%' }}
            />
        </div>
    );

    return (
        <div className="interactive-canvas-wrapper relative flex items-center justify-center p-8 bg-gray-200 min-h-full overflow-auto">
            {/* Canvas container with zoom */}
            <div
                ref={canvasRef}
                className="interactive-canvas relative bg-white shadow-2xl overflow-hidden"
                style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    backgroundColor: settings.backgroundColor,
                    transform: `scale(${settings.zoom / 100})`,
                    transformOrigin: 'center center',
                }}
                onClick={handleCanvasClick}
            >
                {/* Grid pattern */}
                {gridPattern}

                {/* Center guides (only visible when dragging - controlled by Moveable) */}
                {centerGuides}

                {/* Render all objects */}
                {sortedObjects.map(object => (
                    <CanvasObject
                        key={object.id}
                        object={object}
                        isSelected={selectedIds.includes(object.id)}
                        onSelect={handleObjectSelect(object.id)}
                        canvasRef={canvasRef}
                        allObjectRefs={objectRefs}
                    >
                        {renderObjectContent(object, selectedIds.includes(object.id))}
                    </CanvasObject>
                ))}

                {/* Empty state */}
                {objects.length === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 pointer-events-none">
                        <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <p className="text-lg font-medium">Empty Canvas</p>
                        <p className="text-sm">Use the toolbar to add text, images, or shapes</p>
                    </div>
                )}
            </div>

            {/* Page info */}
            <div className="absolute bottom-4 right-4 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded shadow">
                A4 • {width}×{height}px • {settings.zoom}%
            </div>
        </div>
    );
}

export default InteractiveCanvas;
