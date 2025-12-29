// Canvas Editor - Export all components
export { CanvasProvider, useCanvas, getCanvasCSSVariables, COLOR_PALETTES, FONT_OPTIONS, SPACING_PRESETS } from './CanvasContext';
export type { CanvasSettings } from './CanvasContext';
export { CanvasToolbar } from './CanvasToolbar';
export { StylePanel } from './StylePanel';

// Canvas Edit Mode (for template integration)
export { CanvasEditModeProvider, useCanvasEditMode, useCanvasEditModeOptional, DEFAULT_SECTION_ORDER } from './CanvasEditModeContext';

// Sortable Sections
export { SortableSectionsContainer, SortableSection } from './SortableSections';

// Object-based Canvas System
export { CanvasObjectProvider, useCanvasObjects, DEFAULT_TEXT_STYLES } from './CanvasObjectContext';
export type { CanvasObjectData, ObjectType, ShapeType, TextStyles } from './CanvasObjectContext';
export { CanvasObject } from './CanvasObject';
export { TextObject } from './TextObject';
export { ImageObject } from './ImageObject';
export { ShapeObject } from './ShapeObject';
export { InteractiveCanvas } from './InteractiveCanvas';
export { ObjectToolbar } from './ObjectToolbar';
