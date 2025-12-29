import React, { useState, useRef, useEffect } from 'react';
import { useCanvasObjects, CanvasObjectData, TextStyles, DEFAULT_TEXT_STYLES } from './CanvasObjectContext';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify, Type } from 'lucide-react';

interface TextObjectProps {
    object: CanvasObjectData;
    isSelected: boolean;
}

export function TextObject({ object, isSelected }: TextObjectProps) {
    const { updateObject } = useCanvasObjects();
    const [isEditing, setIsEditing] = useState(false);
    const [showStylePanel, setShowStylePanel] = useState(false);
    const textRef = useRef<HTMLDivElement>(null);
    const styles = object.textStyles || DEFAULT_TEXT_STYLES;

    useEffect(() => {
        if (isEditing && textRef.current) {
            textRef.current.focus();
            // Place cursor at end
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(textRef.current);
            range.collapse(false);
            sel?.removeAllRanges();
            sel?.addRange(range);
        }
    }, [isEditing]);

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(true);
    };

    const handleBlur = () => {
        setIsEditing(false);
        if (textRef.current) {
            updateObject(object.id, { textContent: textRef.current.innerText });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setIsEditing(false);
            textRef.current?.blur();
        }
    };

    const updateStyle = (key: keyof TextStyles, value: any) => {
        updateObject(object.id, {
            textStyles: { ...styles, [key]: value },
        });
    };

    const toggleBold = () => updateStyle('fontWeight', styles.fontWeight === 'bold' ? 'normal' : 'bold');
    const toggleItalic = () => updateStyle('fontStyle', styles.fontStyle === 'italic' ? 'normal' : 'italic');
    const toggleUnderline = () => updateStyle('textDecoration', styles.textDecoration === 'underline' ? 'none' : 'underline');

    return (
        <div className="w-full h-full relative">
            {/* Text content */}
            <div
                ref={textRef}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onDoubleClick={handleDoubleClick}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className={`w-full h-full outline-none overflow-hidden ${isEditing ? 'cursor-text bg-white/50' : 'cursor-move'}`}
                style={{
                    fontFamily: styles.fontFamily,
                    fontSize: `${styles.fontSize}px`,
                    fontWeight: styles.fontWeight,
                    fontStyle: styles.fontStyle,
                    textDecoration: styles.textDecoration,
                    color: styles.color,
                    textAlign: styles.textAlign,
                    lineHeight: styles.lineHeight,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                }}
            >
                {object.textContent || 'Double-click to edit'}
            </div>

            {/* Style toggle button */}
            {isSelected && (
                <button
                    onClick={(e) => { e.stopPropagation(); setShowStylePanel(!showStylePanel); }}
                    className={`absolute -right-8 top-0 p-1.5 rounded-lg shadow-lg transition-all ${showStylePanel ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:text-purple-600'}`}
                    title="Text Styles"
                >
                    <Type size={14} />
                </button>
            )}

            {/* Style panel */}
            {isSelected && showStylePanel && (
                <div
                    className="absolute -right-64 top-0 w-56 bg-gray-900 rounded-xl shadow-2xl p-3 z-50"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Text Styles</div>

                    {/* Style toggles */}
                    <div className="flex gap-1 mb-3">
                        <button
                            onClick={toggleBold}
                            className={`p-2 rounded-lg transition-all ${styles.fontWeight === 'bold' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                        >
                            <Bold size={14} />
                        </button>
                        <button
                            onClick={toggleItalic}
                            className={`p-2 rounded-lg transition-all ${styles.fontStyle === 'italic' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                        >
                            <Italic size={14} />
                        </button>
                        <button
                            onClick={toggleUnderline}
                            className={`p-2 rounded-lg transition-all ${styles.textDecoration === 'underline' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                        >
                            <Underline size={14} />
                        </button>
                    </div>

                    {/* Alignment */}
                    <div className="flex gap-1 mb-3">
                        <button
                            onClick={() => updateStyle('textAlign', 'left')}
                            className={`p-2 rounded-lg transition-all ${styles.textAlign === 'left' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                        >
                            <AlignLeft size={14} />
                        </button>
                        <button
                            onClick={() => updateStyle('textAlign', 'center')}
                            className={`p-2 rounded-lg transition-all ${styles.textAlign === 'center' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                        >
                            <AlignCenter size={14} />
                        </button>
                        <button
                            onClick={() => updateStyle('textAlign', 'right')}
                            className={`p-2 rounded-lg transition-all ${styles.textAlign === 'right' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                        >
                            <AlignRight size={14} />
                        </button>
                        <button
                            onClick={() => updateStyle('textAlign', 'justify')}
                            className={`p-2 rounded-lg transition-all ${styles.textAlign === 'justify' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                        >
                            <AlignJustify size={14} />
                        </button>
                    </div>

                    {/* Font size */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs text-gray-500 w-10">Size</span>
                        <input
                            type="range"
                            min="8"
                            max="72"
                            value={styles.fontSize}
                            onChange={(e) => updateStyle('fontSize', parseInt(e.target.value))}
                            className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                        <span className="text-xs font-mono text-purple-400 w-8">{styles.fontSize}px</span>
                    </div>

                    {/* Color */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-10">Color</span>
                        <div className="flex gap-1 flex-1">
                            {['#1a1a1a', '#6B7280', '#DC2626', '#059669', '#7C3AED', '#2563EB'].map(color => (
                                <button
                                    key={color}
                                    onClick={() => updateStyle('color', color)}
                                    style={{ backgroundColor: color }}
                                    className={`w-5 h-5 rounded-lg border border-gray-600 transition-transform hover:scale-110 ${styles.color === color ? 'ring-2 ring-purple-500' : ''}`}
                                />
                            ))}
                            <input
                                type="color"
                                value={styles.color}
                                onChange={(e) => updateStyle('color', e.target.value)}
                                className="w-5 h-5 p-0 bg-transparent border-none cursor-pointer"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TextObject;
