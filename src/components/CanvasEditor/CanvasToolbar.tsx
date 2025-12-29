import { useState } from 'react';
import { useCanvas, COLOR_PALETTES, FONT_OPTIONS, SPACING_PRESETS } from './CanvasContext';
import { useCanvasEditModeOptional } from './CanvasEditModeContext';
import { Type, Maximize2, ZoomIn, ZoomOut, RotateCcw, ChevronDown, Paintbrush, MousePointer2, Trash2 } from 'lucide-react';

export function CanvasToolbar() {
    const { settings, updateSettings, resetSettings, applyPalette } = useCanvas();
    const canvasEditMode = useCanvasEditModeOptional();

    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showFontPicker, setShowFontPicker] = useState(false);
    const [showSpacingPicker, setShowSpacingPicker] = useState(false);
    const [activeColorType, setActiveColorType] = useState<'background' | 'accent'>('accent');

    const handleZoom = (delta: number) => {
        const newZoom = Math.max(50, Math.min(150, settings.zoom + delta));
        updateSettings({ zoom: newZoom });
    };

    const isCanvasMode = canvasEditMode?.isCanvasMode || false;
    const selectedCount = canvasEditMode?.selectedElementIds?.length || 0;

    return (
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-4 mb-6 ring-1 ring-gray-100 relative z-50">
            <div className="flex items-center justify-between gap-4 flex-wrap">

                {/* Selection Mode Toggle - NEW */}
                {canvasEditMode && (
                    <div className="flex items-center gap-2 pr-3 border-r border-gray-200">
                        <button
                            onClick={canvasEditMode.toggleCanvasMode}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all ${isCanvasMode
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                                }`}
                            title="Toggle Selection Mode"
                        >
                            <MousePointer2 size={16} />
                            <span className="hidden md:inline">Select</span>
                        </button>

                        {isCanvasMode && selectedCount > 0 && (
                            <>
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold">
                                    {selectedCount}
                                </span>
                                <button
                                    onClick={canvasEditMode.hideSelectedElements}
                                    className="flex items-center gap-1 px-2 py-1.5 text-xs bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-bold transition-all"
                                    title="Delete selected elements (Delete key)"
                                >
                                    <Trash2 size={12} />
                                    Delete
                                </button>
                                <button
                                    onClick={canvasEditMode.clearSelection}
                                    className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
                                    title="Deselect (Escape key)"
                                >
                                    ✕
                                </button>
                            </>
                        )}

                        {/* Restore Hidden Elements */}
                        {isCanvasMode && canvasEditMode.hiddenElementIds.length > 0 && (
                            <button
                                onClick={canvasEditMode.restoreAllElements}
                                className="flex items-center gap-1 px-2 py-1.5 text-xs bg-green-50 text-green-600 hover:bg-green-100 rounded-lg font-bold transition-all"
                                title="Restore all hidden elements"
                            >
                                <RotateCcw size={12} />
                                Restore ({canvasEditMode.hiddenElementIds.length})
                            </button>
                        )}

                        {/* Reset Section Order */}
                        {isCanvasMode && (
                            <button
                                onClick={canvasEditMode.resetSectionOrder}
                                className="flex items-center gap-1 px-2 py-1.5 text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg font-medium transition-all"
                                title="Reset section order to default"
                            >
                                <RotateCcw size={12} />
                                Reset Order
                            </button>
                        )}
                    </div>
                )}

                {/* Color Controls */}
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <button
                            onClick={() => { setActiveColorType('background'); setShowColorPicker(!showColorPicker); setShowFontPicker(false); setShowSpacingPicker(false); }}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all text-sm font-medium"
                        >
                            <div className="w-5 h-5 rounded-lg border-2 border-gray-200" style={{ backgroundColor: settings.backgroundColor }}></div>
                            <span className="text-gray-600 hidden lg:inline">Background</span>
                            <ChevronDown size={14} className="text-gray-400" />
                        </button>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => { setActiveColorType('accent'); setShowColorPicker(!showColorPicker); setShowFontPicker(false); setShowSpacingPicker(false); }}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all text-sm font-medium"
                        >
                            <div className="w-5 h-5 rounded-lg border-2 border-gray-200" style={{ backgroundColor: settings.accentColor }}></div>
                            <span className="text-gray-600 hidden lg:inline">Accent</span>
                            <ChevronDown size={14} className="text-gray-400" />
                        </button>
                    </div>

                    {/* Color Picker Dropdown */}
                    {showColorPicker && (
                        <div className="absolute top-full left-0 mt-2 p-4 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 min-w-[280px]">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                                {activeColorType === 'background' ? 'Background Color' : 'Accent Color'}
                            </h4>

                            {/* Palettes */}
                            <div className="grid grid-cols-4 gap-2 mb-4">
                                {COLOR_PALETTES.map((palette) => (
                                    <button
                                        key={palette.name}
                                        onClick={() => {
                                            if (activeColorType === 'background') {
                                                updateSettings({ backgroundColor: palette.background });
                                            } else {
                                                updateSettings({ accentColor: palette.accent });
                                            }
                                        }}
                                        className="group relative"
                                        title={palette.name}
                                    >
                                        <div
                                            className="w-10 h-10 rounded-xl border-2 border-gray-200 hover:border-purple-400 hover:scale-110 transition-all shadow-sm"
                                            style={{ backgroundColor: activeColorType === 'background' ? palette.background : palette.accent }}
                                        ></div>
                                    </button>
                                ))}
                            </div>

                            {/* Custom Color Input */}
                            <div className="flex items-center gap-2">
                                <Paintbrush size={14} className="text-gray-400" />
                                <input
                                    type="color"
                                    value={activeColorType === 'background' ? settings.backgroundColor : settings.accentColor}
                                    onChange={(e) => updateSettings({ [activeColorType === 'background' ? 'backgroundColor' : 'accentColor']: e.target.value })}
                                    className="w-8 h-8 rounded-lg cursor-pointer border-0"
                                />
                                <input
                                    type="text"
                                    value={activeColorType === 'background' ? settings.backgroundColor : settings.accentColor}
                                    onChange={(e) => updateSettings({ [activeColorType === 'background' ? 'backgroundColor' : 'accentColor']: e.target.value })}
                                    className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg font-mono uppercase"
                                    placeholder="#FFFFFF"
                                />
                            </div>

                            <button onClick={() => setShowColorPicker(false)} className="mt-3 w-full text-sm text-gray-500 hover:text-gray-700">
                                Done
                            </button>
                        </div>
                    )}
                </div>

                {/* Font Selector */}
                <div className="relative">
                    <button
                        onClick={() => { setShowFontPicker(!showFontPicker); setShowColorPicker(false); setShowSpacingPicker(false); }}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all text-sm font-medium"
                    >
                        <Type size={16} className="text-gray-500" />
                        <span className="text-gray-600 hidden md:inline">{settings.fontFamily}</span>
                        <ChevronDown size={14} className="text-gray-400" />
                    </button>

                    {showFontPicker && (
                        <div className="absolute top-full left-0 mt-2 p-3 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 min-w-[200px] max-h-[300px] overflow-y-auto">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Font Family</h4>
                            <div className="space-y-1">
                                {FONT_OPTIONS.map((font) => (
                                    <button
                                        key={font.name}
                                        onClick={() => { updateSettings({ fontFamily: font.name }); setShowFontPicker(false); }}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${settings.fontFamily === font.name ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-50'}`}
                                        style={{ fontFamily: font.value }}
                                    >
                                        {font.name}
                                        <span className="text-xs text-gray-400 ml-2">{font.category}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Spacing Control */}
                <div className="relative">
                    <button
                        onClick={() => { setShowSpacingPicker(!showSpacingPicker); setShowColorPicker(false); setShowFontPicker(false); }}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all text-sm font-medium"
                    >
                        <Maximize2 size={16} className="text-gray-500" />
                        <span className="text-gray-600 capitalize hidden md:inline">{settings.spacing}</span>
                        <ChevronDown size={14} className="text-gray-400" />
                    </button>

                    {showSpacingPicker && (
                        <div className="absolute top-full left-0 mt-2 p-3 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Spacing / Density</h4>
                            <div className="flex gap-2">
                                {(Object.keys(SPACING_PRESETS) as Array<keyof typeof SPACING_PRESETS>).map((preset) => (
                                    <button
                                        key={preset}
                                        onClick={() => { updateSettings({ spacing: preset }); setShowSpacingPicker(false); }}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${settings.spacing === preset ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                    >
                                        {preset}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Zoom Controls */}
                <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                    <button onClick={() => handleZoom(-10)} className="p-2 hover:bg-white rounded-lg transition-all" title="Zoom Out">
                        <ZoomOut size={16} className="text-gray-600" />
                    </button>
                    <span className="px-2 text-sm font-bold text-gray-700 min-w-[40px] text-center">{settings.zoom}%</span>
                    <button onClick={() => handleZoom(10)} className="p-2 hover:bg-white rounded-lg transition-all" title="Zoom In">
                        <ZoomIn size={16} className="text-gray-600" />
                    </button>
                </div>

                {/* Reset Button */}
                <button
                    onClick={resetSettings}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-50 text-red-500 transition-all text-sm font-medium"
                    title="Reset to Defaults"
                >
                    <RotateCcw size={16} />
                </button>
            </div>

            {/* Quick Palette Strip */}
            <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Quick Palettes:</span>
                    <div className="flex gap-2">
                        {COLOR_PALETTES.slice(0, 6).map((palette) => (
                            <button
                                key={palette.name}
                                onClick={() => applyPalette(palette)}
                                className="group flex items-center gap-1 hover:scale-110 transition-all"
                                title={palette.name}
                            >
                                <div className="w-4 h-4 rounded border border-gray-200" style={{ backgroundColor: palette.background }}></div>
                                <div className="w-4 h-4 rounded border border-gray-200" style={{ backgroundColor: palette.accent }}></div>
                            </button>
                        ))}
                    </div>

                    {/* Selection Mode Hint */}
                    {isCanvasMode && (
                        <span className="ml-auto text-xs text-blue-500 font-medium">
                            Selection Mode: Click → Format → Double-click to edit
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

