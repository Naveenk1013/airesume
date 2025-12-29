import React, { useState, useEffect, useRef, useId } from 'react';
import {
    Settings, Palette, Maximize2, Ghost, RefreshCcw, Type, Move, GripHorizontal,
    Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useCanvasEditModeOptional } from './CanvasEditor';

interface EditableElementProps {
    value: string;
    onChange: (value: string) => void;
    tagName: keyof JSX.IntrinsicElements;
    className?: string;
    placeholder?: string;
    multiline?: boolean;
    style?: React.CSSProperties;
    resizable?: boolean;
    elementId?: string; // Optional unique ID for canvas mode tracking
}

type TextAlign = 'left' | 'center' | 'right' | 'justify';

export function EditableElement({
    value,
    onChange,
    tagName: Tag,
    className = '',
    placeholder = 'Click to edit',
    multiline = false,
    style: externalStyle = {},
    resizable = true,
    elementId
}: EditableElementProps) {
    const { success } = useToast();
    const generatedId = useId();
    const uniqueId = elementId || generatedId;

    // Canvas edit mode context (optional - works without provider too)
    const canvasContext = useCanvasEditModeOptional();
    const isCanvasMode = canvasContext?.isCanvasMode || false;
    const isSelected = canvasContext?.isElementSelected?.(uniqueId) || false;
    const isHidden = canvasContext?.isElementHidden?.(uniqueId) || false;

    // Don't render hidden elements
    if (isHidden) {
        return null;
    }

    const [isEditing, setIsEditing] = useState(false);
    const [showStyles, setShowStyles] = useState(false);
    const [tempValue, setTempValue] = useState(value);

    // Typography state
    const [fontSize, setFontSize] = useState<number | null>(null);
    const [fontColor, setFontColor] = useState<string | null>(null);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [textAlign, setTextAlign] = useState<TextAlign | null>(null);
    const [isStealth, setIsStealth] = useState(false);

    // Resizing state
    const [customWidth, setCustomWidth] = useState<number | null>(null);
    const [isResizing, setIsResizing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    // Canvas mode position state
    const [canvasPosition, setCanvasPosition] = useState<{ x: number; y: number } | null>(null);
    const [_canvasSize, setCanvasSize] = useState<{ width: number; height: number } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef<{ x: number; y: number; startX: number; startY: number } | null>(null);

    // Register/unregister with canvas context for alignment guides
    useEffect(() => {
        if (canvasContext && containerRef.current) {
            canvasContext.registerElement(uniqueId, containerRef.current);
            // Load saved position
            const savedPos = canvasContext.getElementPosition(uniqueId);
            if (savedPos) {
                setCanvasPosition({ x: savedPos.x, y: savedPos.y });
                if (savedPos.width && savedPos.height) {
                    setCanvasSize({ width: savedPos.width, height: savedPos.height });
                }
            }
            return () => canvasContext.unregisterElement(uniqueId);
        }
    }, [canvasContext, uniqueId]);

    const toggleStyles = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const nextState = !showStyles;
        setShowStyles(nextState);
        if (nextState) {
            success('Style mode active');
        }
    };

    useEffect(() => {
        setTempValue(value);
    }, [value]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    // Stealth Mode Sync
    useEffect(() => {
        if (isStealth) {
            setFontSize(1);
            setFontColor('#FFFFFF');
        }
    }, [isStealth]);

    // Close style popover on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setShowStyles(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Resize handling
    const handleResizeStart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);

        const startX = e.clientX;
        const startWidth = containerRef.current?.offsetWidth || 100;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const newWidth = Math.max(50, startWidth + deltaX);
            setCustomWidth(newWidth);
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleBlur = () => {
        setIsEditing(false);
        if (tempValue !== value) {
            onChange(tempValue);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey && !multiline) {
            e.preventDefault();
            handleBlur();
        }
        if (e.key === 'Escape') {
            setTempValue(value);
            setIsEditing(false);
        }
    };

    const resetAllStyles = () => {
        setFontSize(null);
        setFontColor(null);
        setIsBold(false);
        setIsItalic(false);
        setIsUnderline(false);
        setTextAlign(null);
        setIsStealth(false);
        setCustomWidth(null);
    };

    const elementStyles: React.CSSProperties = {
        ...externalStyle,
        fontSize: fontSize ? `${fontSize}px` : externalStyle.fontSize,
        color: fontColor || externalStyle.color,
        fontWeight: isBold ? 'bold' : externalStyle.fontWeight,
        fontStyle: isItalic ? 'italic' : externalStyle.fontStyle,
        textDecoration: isUnderline ? 'underline' : externalStyle.textDecoration,
        textAlign: textAlign || externalStyle.textAlign,
        transition: 'all 0.3s ease',
        background: isStealth ? '#F3E8FF' : undefined,
    };

    const containerStyles: React.CSSProperties = {
        width: customWidth ? `${customWidth}px` : undefined,
        minWidth: customWidth ? `${customWidth}px` : undefined,
        maxWidth: customWidth ? `${customWidth}px` : undefined,
    };

    const renderControls = () => (
        <div
            ref={popoverRef}
            className="absolute z-[1000] bottom-full mb-2 left-0 min-w-[340px] flex flex-col gap-4 bg-gray-900 border border-gray-800 shadow-2xl rounded-2xl p-4 animate-fadeIn no-print"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                <span className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <Type size={12} className="text-purple-400" /> Typography
                </span>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsStealth(!isStealth)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all ${isStealth ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                        title="Stealth Mode (White + Size 1)"
                    >
                        <Ghost size={12} /> {isStealth ? 'ON' : 'Stealth'}
                    </button>
                    <button
                        onClick={resetAllStyles}
                        className="p-1 hover:text-red-500 text-gray-400 transition-colors"
                        title="Reset All Styles"
                    >
                        <RefreshCcw size={12} />
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {/* Text Style Buttons: Bold, Italic, Underline */}
                <div className="flex items-center gap-2">
                    <span className="text-[9px] text-gray-500 uppercase tracking-wider w-12">Style</span>
                    <div className="flex gap-1">
                        <button
                            onClick={() => setIsBold(!isBold)}
                            className={`p-2 rounded-lg transition-all ${isBold ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                            title="Bold"
                        >
                            <Bold size={14} />
                        </button>
                        <button
                            onClick={() => setIsItalic(!isItalic)}
                            className={`p-2 rounded-lg transition-all ${isItalic ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                            title="Italic"
                        >
                            <Italic size={14} />
                        </button>
                        <button
                            onClick={() => setIsUnderline(!isUnderline)}
                            className={`p-2 rounded-lg transition-all ${isUnderline ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                            title="Underline"
                        >
                            <Underline size={14} />
                        </button>
                    </div>
                </div>

                {/* Alignment Buttons */}
                <div className="flex items-center gap-2">
                    <span className="text-[9px] text-gray-500 uppercase tracking-wider w-12">Align</span>
                    <div className="flex gap-1">
                        <button
                            onClick={() => setTextAlign(textAlign === 'left' ? null : 'left')}
                            className={`p-2 rounded-lg transition-all ${textAlign === 'left' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                            title="Align Left"
                        >
                            <AlignLeft size={14} />
                        </button>
                        <button
                            onClick={() => setTextAlign(textAlign === 'center' ? null : 'center')}
                            className={`p-2 rounded-lg transition-all ${textAlign === 'center' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                            title="Align Center"
                        >
                            <AlignCenter size={14} />
                        </button>
                        <button
                            onClick={() => setTextAlign(textAlign === 'right' ? null : 'right')}
                            className={`p-2 rounded-lg transition-all ${textAlign === 'right' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                            title="Align Right"
                        >
                            <AlignRight size={14} />
                        </button>
                        <button
                            onClick={() => setTextAlign(textAlign === 'justify' ? null : 'justify')}
                            className={`p-2 rounded-lg transition-all ${textAlign === 'justify' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                            title="Justify"
                        >
                            <AlignJustify size={14} />
                        </button>
                    </div>
                </div>

                {/* Font Size */}
                <div className="flex items-center gap-2">
                    <span className="text-[9px] text-gray-500 uppercase tracking-wider w-12">Size</span>
                    <Maximize2 size={14} className="text-gray-500" />
                    <input
                        type="range"
                        min="1"
                        max="72"
                        value={fontSize || 14}
                        onChange={(e) => {
                            setFontSize(parseInt(e.target.value));
                            setIsStealth(false);
                        }}
                        className="flex-1 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                    <span className="text-xs font-mono text-purple-400 w-8 text-right">{fontSize ? `${fontSize}px` : '—'}</span>
                </div>

                {/* Color Picker */}
                <div className="flex items-center gap-2">
                    <span className="text-[9px] text-gray-500 uppercase tracking-wider w-12">Color</span>
                    <Palette size={14} className="text-gray-500" />
                    <div className="flex flex-1 gap-2 items-center">
                        {['#111827', '#6B7280', '#DC2626', '#059669', '#7C3AED', '#FFFFFF'].map(c => (
                            <button
                                key={c}
                                onClick={() => {
                                    setFontColor(c);
                                    setIsStealth(false);
                                }}
                                style={{ backgroundColor: c }}
                                className={`w-5 h-5 rounded-lg border border-gray-700 transition-transform hover:scale-125 ${fontColor === c ? 'ring-2 ring-purple-500' : ''}`}
                            />
                        ))}
                        <input
                            type="color"
                            value={fontColor || '#111827'}
                            onChange={(e) => {
                                setFontColor(e.target.value);
                                setIsStealth(false);
                            }}
                            className="w-6 h-6 p-0 bg-transparent border-none cursor-pointer"
                        />
                    </div>
                </div>

                {/* Width Control */}
                {resizable && (
                    <div className="flex items-center gap-2 border-t border-gray-800 pt-3">
                        <span className="text-[9px] text-gray-500 uppercase tracking-wider w-12">Width</span>
                        <Move size={14} className="text-gray-500" />
                        <input
                            type="range"
                            min="50"
                            max="500"
                            value={customWidth || 200}
                            onChange={(e) => setCustomWidth(parseInt(e.target.value))}
                            className="flex-1 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <span className="text-xs font-mono text-blue-400 w-12 text-right">
                            {customWidth ? `${customWidth}px` : 'Auto'}
                        </span>
                        <button
                            onClick={() => setCustomWidth(null)}
                            className="text-[9px] text-gray-500 hover:text-white px-2 py-0.5 bg-gray-800 rounded"
                        >
                            Auto
                        </button>
                    </div>
                )}
            </div>

            {isStealth && (
                <p className="text-[9px] text-purple-400 font-bold italic border-t border-gray-800 pt-2">
                    AI Stealth: Text invisible to humans (#FFF, 1px) but crawlable by AI.
                </p>
            )}
        </div>
    );

    const handleCanvasClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (canvasContext && isCanvasMode) {
            // Shift+Click for multi-selection
            canvasContext.toggleElementSelection(uniqueId, e.shiftKey);
        }
    };

    const handleCanvasDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isCanvasMode && !isDragging) {
            setIsEditing(true);
        }
    };

    // Mouse-based drag handlers using CSS transform
    const handleDragStart = (e: React.MouseEvent) => {
        if (!isCanvasMode || !isSelected) return;
        e.preventDefault();
        e.stopPropagation();

        const currentPos = canvasPosition || { x: 0, y: 0 };
        dragStartRef.current = {
            x: e.clientX,
            y: e.clientY,
            startX: currentPos.x,
            startY: currentPos.y
        };
        setIsDragging(true);

        // Track the final position in a variable that closures can access
        let finalPosition = { x: currentPos.x, y: currentPos.y };

        const handleMouseMove = (moveEvent: MouseEvent) => {
            if (!dragStartRef.current) return;
            const deltaX = moveEvent.clientX - dragStartRef.current.x;
            const deltaY = moveEvent.clientY - dragStartRef.current.y;
            const newX = dragStartRef.current.startX + deltaX;
            const newY = dragStartRef.current.startY + deltaY;
            finalPosition = { x: newX, y: newY };
            setCanvasPosition(finalPosition);
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            if (canvasContext) {
                // Save the final position to context/localStorage
                canvasContext.updateElementPosition(uniqueId, {
                    x: finalPosition.x,
                    y: finalPosition.y
                });
            }
            dragStartRef.current = null;
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    // Apply transform based on position
    const transformStyle = canvasPosition && (canvasPosition.x !== 0 || canvasPosition.y !== 0)
        ? { transform: `translate(${canvasPosition.x}px, ${canvasPosition.y}px)` }
        : {};

    // NOTE: Drag positioning is disabled because CSS position:relative + left/top 
    // breaks document flow for template-based layouts. Canvas mode now only provides:
    // - Selection highlighting
    // - Quick access to formatting controls
    // - Double-click to edit text

    return (
        <div
            ref={containerRef}
            className={`
                relative group/view 
                ${showStyles ? 'ring-4 ring-purple-500/30 rounded-xl bg-purple-50/50 transition-all duration-300' : ''} 
                ${isResizing ? 'select-none' : ''}
                ${isDragging ? 'select-none cursor-grabbing z-50' : ''}
                ${isCanvasMode && isSelected ? 'ring-2 ring-blue-500 ring-offset-2 z-10 bg-blue-50/30' : ''}
                ${isCanvasMode && !isSelected ? 'hover:ring-2 hover:ring-blue-300 hover:ring-offset-1 cursor-pointer' : ''}
            `}
            style={{ ...containerStyles, ...transformStyle }}
            onClick={isCanvasMode ? handleCanvasClick : undefined}
            onDoubleClick={isCanvasMode ? handleCanvasDoubleClick : undefined}
        >
            {/* Settings button */}
            <button
                onClick={toggleStyles}
                className="absolute -right-6 top-0 p-1 text-gray-300 hover:text-purple-500 transition-all opacity-0 group-hover/view:opacity-100 z-10 no-print"
                title="Style Settings"
            >
                <Settings size={12} />
            </button>

            {/* Show formatting controls when element is selected in canvas mode */}
            {isCanvasMode && isSelected && !showStyles && (
                <div className="absolute -top-8 left-0 flex gap-1 bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg z-20 no-print">
                    {/* Drag Handle */}
                    <button
                        onMouseDown={handleDragStart}
                        className="cursor-grab active:cursor-grabbing hover:bg-blue-700 px-1 rounded"
                        title="Drag to move"
                    >
                        <Move size={12} />
                    </button>
                    <span className="opacity-60">•</span>
                    <button
                        onClick={(e) => { e.stopPropagation(); toggleStyles(e); }}
                        className="underline hover:no-underline"
                    >
                        Format
                    </button>
                    <span className="opacity-60">•</span>
                    <span className="opacity-75">Double-click to edit</span>
                </div>
            )}

            {showStyles && renderControls()}

            {isEditing ? (
                <div className={`${showStyles ? 'ring-4 ring-purple-500/30 rounded-xl bg-purple-50/50 transition-all duration-300' : ''}`}>
                    {multiline ? (
                        <textarea
                            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                            style={elementStyles}
                            className={`bg-purple-50 outline-none border border-purple-300 rounded-xl px-2 py-1 w-full min-h-[1em] resize-y overflow-hidden ${className}`}
                        />
                    ) : (
                        <input
                            ref={inputRef as React.RefObject<HTMLInputElement>}
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                            style={elementStyles}
                            className={`bg-purple-50 outline-none border border-purple-300 rounded-lg px-2 py-0.5 w-full ${className}`}
                        />
                    )}
                </div>
            ) : (
                React.createElement(
                    Tag,
                    {
                        onClick: isCanvasMode ? undefined : () => setIsEditing(true),
                        style: elementStyles,
                        className: `${isCanvasMode ? '' : 'cursor-text hover:bg-purple-50/50 hover:outline-dashed hover:outline-1 hover:outline-purple-300'} rounded-lg transition-all px-1 -mx-1 empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 relative group/inner ${customWidth ? 'whitespace-nowrap overflow-hidden text-ellipsis' : ''} ${className}`,
                        'data-placeholder': placeholder
                    },
                    value
                )
            )}

            {/* Resize Handle - show when not in canvas mode */}
            {resizable && !isCanvasMode && (
                <div
                    onMouseDown={handleResizeStart}
                    className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize flex items-center justify-center opacity-0 group-hover/view:opacity-100 hover:bg-blue-100 transition-all no-print"
                    title="Drag to resize width"
                >
                    <GripHorizontal size={10} className="text-blue-400 rotate-90" />
                </div>
            )}
        </div>
    );
}

export default EditableElement;
