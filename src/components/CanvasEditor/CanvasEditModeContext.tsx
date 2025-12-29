import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

interface ElementPosition {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
}

// Default section order
const DEFAULT_SECTION_ORDER = [
    'summary',
    'experience',
    'education',
    'skills',
    'certifications',
    'languages',
    'customSections'
];

interface CanvasEditModeContextType {
    isCanvasMode: boolean;
    setCanvasMode: (enabled: boolean) => void;
    toggleCanvasMode: () => void;

    // Selection (supports multi-selection)
    selectedElementIds: string[];
    selectedElementId: string | null;
    setSelectedElementId: (id: string | null) => void;
    toggleElementSelection: (id: string, addToSelection?: boolean) => void;
    selectAllElements: () => void;
    clearSelection: () => void;
    isElementSelected: (id: string) => boolean;

    // Element positions
    elementPositions: Map<string, ElementPosition>;
    updateElementPosition: (id: string, pos: Partial<ElementPosition>) => void;
    getElementPosition: (id: string) => ElementPosition | undefined;
    resetElementPosition: (id: string) => void;
    resetSelectedPositions: () => void;
    resetAllPositions: () => void;

    // Section ordering
    sectionOrder: string[];
    reorderSections: (newOrder: string[]) => void;
    moveSectionUp: (sectionId: string) => void;
    moveSectionDown: (sectionId: string) => void;
    resetSectionOrder: () => void;

    // Element hiding/deletion
    hiddenElementIds: string[];
    hideElement: (id: string) => void;
    hideSelectedElements: () => void;
    restoreElement: (id: string) => void;
    restoreAllElements: () => void;
    isElementHidden: (id: string) => boolean;

    // Element refs
    registerElement: (id: string, element: HTMLElement) => void;
    unregisterElement: (id: string) => void;
    getOtherElements: (excludeId: string) => HTMLElement[];
    getAllElementIds: () => string[];
}

const CanvasEditModeContext = createContext<CanvasEditModeContextType | undefined>(undefined);

const STORAGE_KEY = 'resume-element-positions';
const SECTION_ORDER_KEY = 'resume-section-order';
const HIDDEN_ELEMENTS_KEY = 'resume-hidden-elements';

export function CanvasEditModeProvider({ children }: { children: ReactNode }) {
    const [isCanvasMode, setIsCanvasMode] = useState(false);
    const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);

    // Element positions
    const [elementPositions, setElementPositions] = useState<Map<string, ElementPosition>>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                return new Map(JSON.parse(saved));
            }
        } catch (e) {
            console.warn('Failed to load element positions');
        }
        return new Map();
    });

    // Section order
    const [sectionOrder, setSectionOrder] = useState<string[]>(() => {
        try {
            const saved = localStorage.getItem(SECTION_ORDER_KEY);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Failed to load section order');
        }
        return DEFAULT_SECTION_ORDER;
    });

    // Hidden elements
    const [hiddenElementIds, setHiddenElementIds] = useState<string[]>(() => {
        try {
            const saved = localStorage.getItem(HIDDEN_ELEMENTS_KEY);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Failed to load hidden elements');
        }
        return [];
    });

    const [elementRefs] = useState<Map<string, HTMLElement>>(new Map());

    // Persist functions
    const persistPositions = useCallback((positions: Map<string, ElementPosition>) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(positions.entries())));
        } catch (e) {
            console.warn('Failed to save element positions');
        }
    }, []);

    const persistSectionOrder = useCallback((order: string[]) => {
        try {
            localStorage.setItem(SECTION_ORDER_KEY, JSON.stringify(order));
        } catch (e) {
            console.warn('Failed to save section order');
        }
    }, []);

    const persistHiddenElements = useCallback((ids: string[]) => {
        try {
            localStorage.setItem(HIDDEN_ELEMENTS_KEY, JSON.stringify(ids));
        } catch (e) {
            console.warn('Failed to save hidden elements');
        }
    }, []);

    // Canvas mode
    const setCanvasMode = useCallback((enabled: boolean) => {
        setIsCanvasMode(enabled);
        if (!enabled) {
            setSelectedElementIds([]);
        }
    }, []);

    const toggleCanvasMode = useCallback(() => {
        setCanvasMode(!isCanvasMode);
    }, [isCanvasMode, setCanvasMode]);

    // Selection
    const setSelectedElementId = useCallback((id: string | null) => {
        setSelectedElementIds(id ? [id] : []);
    }, []);

    const toggleElementSelection = useCallback((id: string, addToSelection?: boolean) => {
        setSelectedElementIds(prev => {
            if (addToSelection) {
                if (prev.includes(id)) {
                    return prev.filter(i => i !== id);
                } else {
                    return [...prev, id];
                }
            } else {
                return prev.includes(id) && prev.length === 1 ? [] : [id];
            }
        });
    }, []);

    const selectAllElements = useCallback(() => {
        setSelectedElementIds(Array.from(elementRefs.keys()));
    }, [elementRefs]);

    const clearSelection = useCallback(() => {
        setSelectedElementIds([]);
    }, []);

    const isElementSelected = useCallback((id: string) => {
        return selectedElementIds.includes(id);
    }, [selectedElementIds]);

    // Element positions
    const updateElementPosition = useCallback((id: string, pos: Partial<ElementPosition>) => {
        setElementPositions(prev => {
            const current = prev.get(id) || { x: 0, y: 0, width: 0, height: 0, rotation: 0 };
            const updated = new Map(prev);
            updated.set(id, { ...current, ...pos });
            persistPositions(updated);
            return updated;
        });
    }, [persistPositions]);

    const getElementPosition = useCallback((id: string) => {
        return elementPositions.get(id);
    }, [elementPositions]);

    const resetElementPosition = useCallback((id: string) => {
        setElementPositions(prev => {
            const updated = new Map(prev);
            updated.delete(id);
            persistPositions(updated);
            return updated;
        });
    }, [persistPositions]);

    const resetSelectedPositions = useCallback(() => {
        setElementPositions(prev => {
            const updated = new Map(prev);
            selectedElementIds.forEach(id => updated.delete(id));
            persistPositions(updated);
            return updated;
        });
        setSelectedElementIds([]);
    }, [selectedElementIds, persistPositions]);

    const resetAllPositions = useCallback(() => {
        setElementPositions(new Map());
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    // Section ordering
    const reorderSections = useCallback((newOrder: string[]) => {
        setSectionOrder(newOrder);
        persistSectionOrder(newOrder);
    }, [persistSectionOrder]);

    const moveSectionUp = useCallback((sectionId: string) => {
        setSectionOrder(prev => {
            const index = prev.indexOf(sectionId);
            if (index <= 0) return prev;
            const newOrder = [...prev];
            [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
            persistSectionOrder(newOrder);
            return newOrder;
        });
    }, [persistSectionOrder]);

    const moveSectionDown = useCallback((sectionId: string) => {
        setSectionOrder(prev => {
            const index = prev.indexOf(sectionId);
            if (index < 0 || index >= prev.length - 1) return prev;
            const newOrder = [...prev];
            [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
            persistSectionOrder(newOrder);
            return newOrder;
        });
    }, [persistSectionOrder]);

    const resetSectionOrder = useCallback(() => {
        setSectionOrder(DEFAULT_SECTION_ORDER);
        localStorage.removeItem(SECTION_ORDER_KEY);
    }, []);

    // Element hiding/deletion
    const hideElement = useCallback((id: string) => {
        setHiddenElementIds(prev => {
            if (prev.includes(id)) return prev;
            const updated = [...prev, id];
            persistHiddenElements(updated);
            return updated;
        });
    }, [persistHiddenElements]);

    const hideSelectedElements = useCallback(() => {
        setHiddenElementIds(prev => {
            const updated = [...new Set([...prev, ...selectedElementIds])];
            persistHiddenElements(updated);
            return updated;
        });
        setSelectedElementIds([]);
    }, [selectedElementIds, persistHiddenElements]);

    const restoreElement = useCallback((id: string) => {
        setHiddenElementIds(prev => {
            const updated = prev.filter(i => i !== id);
            persistHiddenElements(updated);
            return updated;
        });
    }, [persistHiddenElements]);

    const restoreAllElements = useCallback(() => {
        setHiddenElementIds([]);
        localStorage.removeItem(HIDDEN_ELEMENTS_KEY);
    }, []);

    const isElementHidden = useCallback((id: string) => {
        return hiddenElementIds.includes(id);
    }, [hiddenElementIds]);

    // Element refs
    const registerElement = useCallback((id: string, element: HTMLElement) => {
        elementRefs.set(id, element);
    }, [elementRefs]);

    const unregisterElement = useCallback((id: string) => {
        elementRefs.delete(id);
    }, [elementRefs]);

    const getOtherElements = useCallback((excludeId: string) => {
        const elements: HTMLElement[] = [];
        elementRefs.forEach((el, id) => {
            if (id !== excludeId) {
                elements.push(el);
            }
        });
        return elements;
    }, [elementRefs]);

    const getAllElementIds = useCallback(() => {
        return Array.from(elementRefs.keys());
    }, [elementRefs]);

    // Keyboard shortcuts
    useEffect(() => {
        if (!isCanvasMode) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            // Delete/Backspace - hide selected elements
            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementIds.length > 0) {
                if ((e.target as HTMLElement).tagName !== 'INPUT' &&
                    (e.target as HTMLElement).tagName !== 'TEXTAREA' &&
                    !(e.target as HTMLElement).isContentEditable) {
                    e.preventDefault();
                    hideSelectedElements();
                }
            }
            // Escape - clear selection
            if (e.key === 'Escape') {
                clearSelection();
            }
            // Ctrl/Cmd + A - select all
            if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
                e.preventDefault();
                selectAllElements();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isCanvasMode, selectedElementIds, hideSelectedElements, clearSelection, selectAllElements]);

    return (
        <CanvasEditModeContext.Provider
            value={{
                isCanvasMode,
                setCanvasMode,
                toggleCanvasMode,
                selectedElementIds,
                selectedElementId: selectedElementIds[0] || null,
                setSelectedElementId,
                toggleElementSelection,
                selectAllElements,
                clearSelection,
                isElementSelected,
                elementPositions,
                updateElementPosition,
                getElementPosition,
                resetElementPosition,
                resetSelectedPositions,
                resetAllPositions,
                sectionOrder,
                reorderSections,
                moveSectionUp,
                moveSectionDown,
                resetSectionOrder,
                hiddenElementIds,
                hideElement,
                hideSelectedElements,
                restoreElement,
                restoreAllElements,
                isElementHidden,
                registerElement,
                unregisterElement,
                getOtherElements,
                getAllElementIds,
            }}
        >
            {children}
        </CanvasEditModeContext.Provider>
    );
}

export function useCanvasEditMode() {
    const context = useContext(CanvasEditModeContext);
    if (!context) {
        throw new Error('useCanvasEditMode must be used within a CanvasEditModeProvider');
    }
    return context;
}

// Optional hook that doesn't throw
export function useCanvasEditModeOptional() {
    return useContext(CanvasEditModeContext);
}

// Export default section order for templates
export { DEFAULT_SECTION_ORDER };

