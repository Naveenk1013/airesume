import { useState } from 'react';
import { useCanvasObjects, CanvasObjectData } from './CanvasObjectContext';
import { Square, Circle, Minus, Palette } from 'lucide-react';

interface ShapeObjectProps {
    object: CanvasObjectData;
    isSelected: boolean;
}

export function ShapeObject({ object, isSelected }: ShapeObjectProps) {
    const { updateObject } = useCanvasObjects();
    const [showPanel, setShowPanel] = useState(false);

    const shapeType = object.shapeType || 'rectangle';
    const fill = object.shapeFill || '#6B21A8';
    const stroke = object.shapeStroke || 'transparent';
    const strokeWidth = object.shapeStrokeWidth || 0;

    const updateShape = (updates: Partial<CanvasObjectData>) => {
        updateObject(object.id, updates);
    };

    const renderShape = () => {
        switch (shapeType) {
            case 'circle':
                return (
                    <div
                        className="w-full h-full rounded-full"
                        style={{
                            backgroundColor: fill,
                            border: strokeWidth > 0 ? `${strokeWidth}px solid ${stroke}` : 'none',
                        }}
                    />
                );
            case 'line':
                return (
                    <div className="w-full h-full flex items-center">
                        <div
                            className="w-full"
                            style={{
                                height: `${Math.max(strokeWidth || 2, 2)}px`,
                                backgroundColor: fill,
                            }}
                        />
                    </div>
                );
            case 'rectangle':
            default:
                return (
                    <div
                        className="w-full h-full"
                        style={{
                            backgroundColor: fill,
                            border: strokeWidth > 0 ? `${strokeWidth}px solid ${stroke}` : 'none',
                            borderRadius: `${object.borderRadius || 0}px`,
                        }}
                    />
                );
        }
    };

    return (
        <div className="w-full h-full relative">
            {renderShape()}

            {/* Panel toggle */}
            {isSelected && (
                <button
                    onClick={(e) => { e.stopPropagation(); setShowPanel(!showPanel); }}
                    className={`absolute -right-8 top-0 p-1.5 rounded-lg shadow-lg transition-all ${showPanel ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:text-purple-600'}`}
                    title="Shape Settings"
                >
                    <Palette size={14} />
                </button>
            )}

            {/* Settings panel */}
            {isSelected && showPanel && (
                <div
                    className="absolute -right-64 top-0 w-56 bg-gray-900 rounded-xl shadow-2xl p-3 z-50"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-3">Shape Settings</div>

                    {/* Shape type */}
                    <div className="mb-3">
                        <span className="text-xs text-gray-500 block mb-1">Shape Type</span>
                        <div className="flex gap-1">
                            <button
                                onClick={() => updateShape({ shapeType: 'rectangle' })}
                                className={`flex-1 p-2 rounded-lg transition-colors flex items-center justify-center ${shapeType === 'rectangle' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                                title="Rectangle"
                            >
                                <Square size={16} />
                            </button>
                            <button
                                onClick={() => updateShape({ shapeType: 'circle' })}
                                className={`flex-1 p-2 rounded-lg transition-colors flex items-center justify-center ${shapeType === 'circle' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                                title="Circle"
                            >
                                <Circle size={16} />
                            </button>
                            <button
                                onClick={() => updateShape({ shapeType: 'line' })}
                                className={`flex-1 p-2 rounded-lg transition-colors flex items-center justify-center ${shapeType === 'line' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                                title="Line"
                            >
                                <Minus size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Fill color */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs text-gray-500 w-10">Fill</span>
                        <div className="flex gap-1 flex-1">
                            {['#6B21A8', '#2563EB', '#059669', '#DC2626', '#F59E0B', '#1a1a1a', '#FFFFFF'].map(color => (
                                <button
                                    key={color}
                                    onClick={() => updateShape({ shapeFill: color })}
                                    style={{ backgroundColor: color }}
                                    className={`w-5 h-5 rounded-lg border border-gray-600 transition-transform hover:scale-110 ${fill === color ? 'ring-2 ring-purple-500' : ''}`}
                                />
                            ))}
                            <input
                                type="color"
                                value={fill}
                                onChange={(e) => updateShape({ shapeFill: e.target.value })}
                                className="w-5 h-5 p-0 bg-transparent border-none cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Stroke color */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs text-gray-500 w-10">Stroke</span>
                        <div className="flex gap-1 flex-1">
                            {['transparent', '#1a1a1a', '#6B21A8', '#2563EB', '#DC2626', '#FFFFFF'].map(color => (
                                <button
                                    key={color}
                                    onClick={() => updateShape({ shapeStroke: color })}
                                    style={{ backgroundColor: color === 'transparent' ? 'white' : color }}
                                    className={`w-5 h-5 rounded-lg border border-gray-600 transition-transform hover:scale-110 ${stroke === color ? 'ring-2 ring-purple-500' : ''} ${color === 'transparent' ? 'bg-gradient-to-br from-red-500 to-red-500 bg-[length:1px_1px] bg-center' : ''}`}
                                    title={color === 'transparent' ? 'No stroke' : color}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Stroke width */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs text-gray-500 w-10">Width</span>
                        <input
                            type="range"
                            min="0"
                            max="10"
                            value={strokeWidth}
                            onChange={(e) => updateShape({ shapeStrokeWidth: parseInt(e.target.value) })}
                            className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                        <span className="text-xs font-mono text-purple-400 w-8">{strokeWidth}px</span>
                    </div>

                    {/* Border radius (only for rectangle) */}
                    {shapeType === 'rectangle' && (
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 w-10">Radius</span>
                            <input
                                type="range"
                                min="0"
                                max="50"
                                value={object.borderRadius || 0}
                                onChange={(e) => updateShape({ borderRadius: parseInt(e.target.value) })}
                                className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                            />
                            <span className="text-xs font-mono text-purple-400 w-8">{object.borderRadius || 0}px</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default ShapeObject;
