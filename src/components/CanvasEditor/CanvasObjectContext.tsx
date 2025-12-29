import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Types for canvas objects
export type ObjectType = 'text' | 'image' | 'shape';
export type ShapeType = 'rectangle' | 'circle' | 'line';

export interface TextStyles {
    fontFamily: string;
    fontSize: number;
    fontWeight: 'normal' | 'bold';
    fontStyle: 'normal' | 'italic';
    textDecoration: 'none' | 'underline';
    color: string;
    textAlign: 'left' | 'center' | 'right' | 'justify';
    lineHeight: number;
}

export interface CanvasObjectData {
    id: string;
    type: ObjectType;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    zIndex: number;
    locked: boolean;
    visible: boolean;
    opacity: number;

    // Text specific
    textContent?: string;
    textStyles?: TextStyles;

    // Image specific
    imageSrc?: string;
    imageObjectFit?: 'cover' | 'contain' | 'fill';
    borderRadius?: number;

    // Shape specific
    shapeType?: ShapeType;
    shapeFill?: string;
    shapeStroke?: string;
    shapeStrokeWidth?: number;
}

interface CanvasObjectContextType {
    objects: CanvasObjectData[];
    selectedIds: string[];

    // Selection
    selectObject: (id: string, addToSelection?: boolean) => void;
    selectAll: () => void;
    clearSelection: () => void;

    // CRUD
    addObject: (object: Omit<CanvasObjectData, 'id' | 'zIndex'>) => string;
    updateObject: (id: string, updates: Partial<CanvasObjectData>) => void;
    deleteObject: (id: string) => void;
    deleteSelected: () => void;
    duplicateObject: (id: string) => string | null;
    duplicateSelected: () => void;

    // Ordering
    bringToFront: (id: string) => void;
    sendToBack: (id: string) => void;
    bringForward: (id: string) => void;
    sendBackward: (id: string) => void;

    // Bulk operations
    setObjects: (objects: CanvasObjectData[]) => void;
    clearCanvas: () => void;

    // Utility
    getObject: (id: string) => CanvasObjectData | undefined;
    getSelectedObjects: () => CanvasObjectData[];
}

const CanvasObjectContext = createContext<CanvasObjectContextType | undefined>(undefined);

const generateId = () => `obj_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

const STORAGE_KEY = 'resume-canvas-objects';

const DEFAULT_TEXT_STYLES: TextStyles = {
    fontFamily: 'Inter, sans-serif',
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
    color: '#1a1a1a',
    textAlign: 'left',
    lineHeight: 1.5,
};

export function CanvasObjectProvider({ children }: { children: ReactNode }) {
    const [objects, setObjectsState] = useState<CanvasObjectData[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.warn('Failed to load canvas objects from localStorage');
        }
        return [];
    });

    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Persist to localStorage
    const persistObjects = useCallback((newObjects: CanvasObjectData[]) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newObjects));
        } catch (e) {
            console.warn('Failed to save canvas objects to localStorage');
        }
    }, []);

    const setObjects = useCallback((newObjects: CanvasObjectData[]) => {
        setObjectsState(newObjects);
        persistObjects(newObjects);
    }, [persistObjects]);

    // Selection
    const selectObject = useCallback((id: string, addToSelection = false) => {
        setSelectedIds(prev => {
            if (addToSelection) {
                return prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
            }
            return [id];
        });
    }, []);

    const selectAll = useCallback(() => {
        setSelectedIds(objects.map(o => o.id));
    }, [objects]);

    const clearSelection = useCallback(() => {
        setSelectedIds([]);
    }, []);

    // CRUD
    const addObject = useCallback((objectData: Omit<CanvasObjectData, 'id' | 'zIndex'>) => {
        const id = generateId();
        const maxZIndex = objects.length > 0 ? Math.max(...objects.map(o => o.zIndex)) : 0;

        const newObject: CanvasObjectData = {
            ...objectData,
            id,
            zIndex: maxZIndex + 1,
        };

        const newObjects = [...objects, newObject];
        setObjects(newObjects);
        setSelectedIds([id]);

        return id;
    }, [objects, setObjects]);

    const updateObject = useCallback((id: string, updates: Partial<CanvasObjectData>) => {
        setObjects(objects.map(obj =>
            obj.id === id ? { ...obj, ...updates } : obj
        ));
    }, [objects, setObjects]);

    const deleteObject = useCallback((id: string) => {
        setObjects(objects.filter(obj => obj.id !== id));
        setSelectedIds(prev => prev.filter(i => i !== id));
    }, [objects, setObjects]);

    const deleteSelected = useCallback(() => {
        setObjects(objects.filter(obj => !selectedIds.includes(obj.id)));
        setSelectedIds([]);
    }, [objects, selectedIds, setObjects]);

    const duplicateObject = useCallback((id: string) => {
        const original = objects.find(o => o.id === id);
        if (!original) return null;

        const newId = generateId();
        const maxZIndex = Math.max(...objects.map(o => o.zIndex));

        const duplicate: CanvasObjectData = {
            ...original,
            id: newId,
            x: original.x + 20,
            y: original.y + 20,
            zIndex: maxZIndex + 1,
        };

        const newObjects = [...objects, duplicate];
        setObjects(newObjects);
        setSelectedIds([newId]);

        return newId;
    }, [objects, setObjects]);

    const duplicateSelected = useCallback(() => {
        const newIds: string[] = [];
        let maxZIndex = Math.max(...objects.map(o => o.zIndex), 0);

        const duplicates = selectedIds.map(id => {
            const original = objects.find(o => o.id === id);
            if (!original) return null;

            maxZIndex += 1;
            const newId = generateId();
            newIds.push(newId);

            return {
                ...original,
                id: newId,
                x: original.x + 20,
                y: original.y + 20,
                zIndex: maxZIndex,
            };
        }).filter(Boolean) as CanvasObjectData[];

        setObjects([...objects, ...duplicates]);
        setSelectedIds(newIds);
    }, [objects, selectedIds, setObjects]);

    // Ordering
    const bringToFront = useCallback((id: string) => {
        const maxZIndex = Math.max(...objects.map(o => o.zIndex));
        setObjects(objects.map(obj =>
            obj.id === id ? { ...obj, zIndex: maxZIndex + 1 } : obj
        ));
    }, [objects, setObjects]);

    const sendToBack = useCallback((id: string) => {
        const minZIndex = Math.min(...objects.map(o => o.zIndex));
        setObjects(objects.map(obj =>
            obj.id === id ? { ...obj, zIndex: minZIndex - 1 } : obj
        ));
    }, [objects, setObjects]);

    const bringForward = useCallback((id: string) => {
        const obj = objects.find(o => o.id === id);
        if (!obj) return;

        const higherObjects = objects.filter(o => o.zIndex > obj.zIndex);
        if (higherObjects.length === 0) return;

        const nextHigher = higherObjects.reduce((min, o) =>
            o.zIndex < min.zIndex ? o : min
        );

        setObjects(objects.map(o => {
            if (o.id === id) return { ...o, zIndex: nextHigher.zIndex };
            if (o.id === nextHigher.id) return { ...o, zIndex: obj.zIndex };
            return o;
        }));
    }, [objects, setObjects]);

    const sendBackward = useCallback((id: string) => {
        const obj = objects.find(o => o.id === id);
        if (!obj) return;

        const lowerObjects = objects.filter(o => o.zIndex < obj.zIndex);
        if (lowerObjects.length === 0) return;

        const nextLower = lowerObjects.reduce((max, o) =>
            o.zIndex > max.zIndex ? o : max
        );

        setObjects(objects.map(o => {
            if (o.id === id) return { ...o, zIndex: nextLower.zIndex };
            if (o.id === nextLower.id) return { ...o, zIndex: obj.zIndex };
            return o;
        }));
    }, [objects, setObjects]);

    // Utility
    const clearCanvas = useCallback(() => {
        setObjects([]);
        setSelectedIds([]);
    }, [setObjects]);

    const getObject = useCallback((id: string) => {
        return objects.find(o => o.id === id);
    }, [objects]);

    const getSelectedObjects = useCallback(() => {
        return objects.filter(o => selectedIds.includes(o.id));
    }, [objects, selectedIds]);

    return (
        <CanvasObjectContext.Provider
            value={{
                objects,
                selectedIds,
                selectObject,
                selectAll,
                clearSelection,
                addObject,
                updateObject,
                deleteObject,
                deleteSelected,
                duplicateObject,
                duplicateSelected,
                bringToFront,
                sendToBack,
                bringForward,
                sendBackward,
                setObjects,
                clearCanvas,
                getObject,
                getSelectedObjects,
            }}
        >
            {children}
        </CanvasObjectContext.Provider>
    );
}

export function useCanvasObjects() {
    const context = useContext(CanvasObjectContext);
    if (!context) {
        throw new Error('useCanvasObjects must be used within a CanvasObjectProvider');
    }
    return context;
}

export { DEFAULT_TEXT_STYLES };
