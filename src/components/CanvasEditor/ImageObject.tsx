import React, { useState, useRef } from 'react';
import { useCanvasObjects, CanvasObjectData } from './CanvasObjectContext';
import { Image, Upload, Link, Maximize, Square } from 'lucide-react';

interface ImageObjectProps {
    object: CanvasObjectData;
    isSelected: boolean;
}

export function ImageObject({ object, isSelected }: ImageObjectProps) {
    const { updateObject } = useCanvasObjects();
    const [showPanel, setShowPanel] = useState(false);
    const [urlInput, setUrlInput] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                updateObject(object.id, { imageSrc: event.target?.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUrlSubmit = () => {
        if (urlInput.trim()) {
            updateObject(object.id, { imageSrc: urlInput.trim() });
            setUrlInput('');
        }
    };

    const setObjectFit = (fit: 'cover' | 'contain' | 'fill') => {
        updateObject(object.id, { imageObjectFit: fit });
    };

    const setBorderRadius = (radius: number) => {
        updateObject(object.id, { borderRadius: radius });
    };

    return (
        <div className="w-full h-full relative">
            {object.imageSrc ? (
                <img
                    src={object.imageSrc}
                    alt="Canvas image"
                    className="w-full h-full"
                    style={{
                        objectFit: object.imageObjectFit || 'cover',
                        borderRadius: `${object.borderRadius || 0}px`,
                    }}
                    draggable={false}
                />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg">
                    <Image size={32} className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Click to add image</span>
                </div>
            )}

            {/* Panel toggle */}
            {isSelected && (
                <button
                    onClick={(e) => { e.stopPropagation(); setShowPanel(!showPanel); }}
                    className={`absolute -right-8 top-0 p-1.5 rounded-lg shadow-lg transition-all ${showPanel ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:text-purple-600'}`}
                    title="Image Settings"
                >
                    <Image size={14} />
                </button>
            )}

            {/* Settings panel */}
            {isSelected && showPanel && (
                <div
                    className="absolute -right-64 top-0 w-56 bg-gray-900 rounded-xl shadow-2xl p-3 z-50"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-3">Image Settings</div>

                    {/* Upload button */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex items-center justify-center gap-2 p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg mb-2 transition-colors"
                    >
                        <Upload size={14} />
                        <span className="text-sm">Upload Image</span>
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                    />

                    {/* URL input */}
                    <div className="flex gap-1 mb-3">
                        <input
                            type="text"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            placeholder="Image URL..."
                            className="flex-1 px-2 py-1.5 text-sm bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-purple-500 outline-none"
                        />
                        <button
                            onClick={handleUrlSubmit}
                            className="p-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                        >
                            <Link size={14} />
                        </button>
                    </div>

                    {/* Object fit */}
                    <div className="mb-3">
                        <span className="text-xs text-gray-500 block mb-1">Fit Mode</span>
                        <div className="flex gap-1">
                            {(['cover', 'contain', 'fill'] as const).map(fit => (
                                <button
                                    key={fit}
                                    onClick={() => setObjectFit(fit)}
                                    className={`flex-1 py-1.5 text-xs rounded-lg transition-colors ${object.imageObjectFit === fit ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                                >
                                    {fit.charAt(0).toUpperCase() + fit.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Border radius */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-14">Radius</span>
                        <input
                            type="range"
                            min="0"
                            max="50"
                            value={object.borderRadius || 0}
                            onChange={(e) => setBorderRadius(parseInt(e.target.value))}
                            className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                        <span className="text-xs font-mono text-purple-400 w-8">{object.borderRadius || 0}px</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ImageObject;
