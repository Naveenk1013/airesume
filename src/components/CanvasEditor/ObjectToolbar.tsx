import { useState } from 'react';
import { useCanvasObjects, DEFAULT_TEXT_STYLES } from './CanvasObjectContext';
import {
    Type, Image, Square, Circle, Minus, Trash2, Copy, Layers,
    ChevronUp, ChevronDown, Lock, Unlock, Eye, EyeOff, RotateCcw,
    AlignVerticalJustifyCenter, AlignHorizontalJustifyCenter,
    AlignStartVertical, AlignEndVertical
} from 'lucide-react';

interface ObjectToolbarProps {
    className?: string;
}

export function ObjectToolbar({ className = '' }: ObjectToolbarProps) {
    const {
        objects,
        selectedIds,
        addObject,
        deleteSelected,
        duplicateSelected,
        bringToFront,
        sendToBack,
        bringForward,
        sendBackward,
        clearCanvas,
        updateObject,
        getSelectedObjects,
    } = useCanvasObjects();

    const [showShapeMenu, setShowShapeMenu] = useState(false);

    const selectedObjects = getSelectedObjects();
    const hasSelection = selectedIds.length > 0;
    const singleSelection = selectedIds.length === 1;
    const selectedObject = singleSelection ? selectedObjects[0] : null;

    // Add new text object
    const addText = () => {
        addObject({
            type: 'text',
            x: 100,
            y: 100,
            width: 200,
            height: 50,
            rotation: 0,
            locked: false,
            visible: true,
            opacity: 1,
            textContent: 'New Text',
            textStyles: { ...DEFAULT_TEXT_STYLES },
        });
    };

    // Add new image object
    const addImage = () => {
        addObject({
            type: 'image',
            x: 150,
            y: 150,
            width: 200,
            height: 150,
            rotation: 0,
            locked: false,
            visible: true,
            opacity: 1,
            imageSrc: '',
            imageObjectFit: 'cover',
            borderRadius: 0,
        });
    };

    // Add new shape
    const addShape = (shapeType: 'rectangle' | 'circle' | 'line') => {
        addObject({
            type: 'shape',
            x: 200,
            y: 200,
            width: shapeType === 'line' ? 200 : 100,
            height: shapeType === 'line' ? 4 : 100,
            rotation: 0,
            locked: false,
            visible: true,
            opacity: 1,
            shapeType,
            shapeFill: '#6B21A8',
            shapeStroke: 'transparent',
            shapeStrokeWidth: 0,
            borderRadius: 0,
        });
        setShowShapeMenu(false);
    };

    // Toggle lock on selected
    const toggleLock = () => {
        if (selectedObject) {
            updateObject(selectedObject.id, { locked: !selectedObject.locked });
        }
    };

    // Toggle visibility on selected
    const toggleVisibility = () => {
        if (selectedObject) {
            updateObject(selectedObject.id, { visible: !selectedObject.visible });
        }
    };

    // Alignment functions for multi-selection
    const alignObjects = (type: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
        if (selectedObjects.length < 2) return;

        const bounds = {
            minX: Math.min(...selectedObjects.map(o => o.x)),
            maxX: Math.max(...selectedObjects.map(o => o.x + o.width)),
            minY: Math.min(...selectedObjects.map(o => o.y)),
            maxY: Math.max(...selectedObjects.map(o => o.y + o.height)),
        };

        selectedObjects.forEach(obj => {
            let updates: Partial<typeof obj> = {};

            switch (type) {
                case 'left':
                    updates.x = bounds.minX;
                    break;
                case 'center':
                    updates.x = bounds.minX + (bounds.maxX - bounds.minX) / 2 - obj.width / 2;
                    break;
                case 'right':
                    updates.x = bounds.maxX - obj.width;
                    break;
                case 'top':
                    updates.y = bounds.minY;
                    break;
                case 'middle':
                    updates.y = bounds.minY + (bounds.maxY - bounds.minY) / 2 - obj.height / 2;
                    break;
                case 'bottom':
                    updates.y = bounds.maxY - obj.height;
                    break;
            }

            updateObject(obj.id, updates);
        });
    };

    return (
        <div className={`object-toolbar flex flex-wrap items-center gap-2 p-3 bg-gray-900 rounded-xl shadow-xl ${className}`}>
            {/* Add objects section */}
            <div className="flex items-center gap-1 pr-3 border-r border-gray-700">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider mr-1">Add</span>

                <button
                    onClick={addText}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    title="Add Text"
                >
                    <Type size={18} />
                </button>

                <button
                    onClick={addImage}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    title="Add Image"
                >
                    <Image size={18} />
                </button>

                <div className="relative">
                    <button
                        onClick={() => setShowShapeMenu(!showShapeMenu)}
                        className={`p-2 rounded-lg transition-colors ${showShapeMenu ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                        title="Add Shape"
                    >
                        <Square size={18} />
                    </button>

                    {showShapeMenu && (
                        <div className="absolute top-full left-0 mt-1 bg-gray-800 rounded-lg shadow-xl p-1 z-50 flex gap-1">
                            <button
                                onClick={() => addShape('rectangle')}
                                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                                title="Rectangle"
                            >
                                <Square size={16} />
                            </button>
                            <button
                                onClick={() => addShape('circle')}
                                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                                title="Circle"
                            >
                                <Circle size={16} />
                            </button>
                            <button
                                onClick={() => addShape('line')}
                                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                                title="Line"
                            >
                                <Minus size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Selection actions */}
            {hasSelection && (
                <div className="flex items-center gap-1 pr-3 border-r border-gray-700">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider mr-1">Edit</span>

                    <button
                        onClick={duplicateSelected}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                        title="Duplicate (Ctrl+D)"
                    >
                        <Copy size={16} />
                    </button>

                    <button
                        onClick={deleteSelected}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
                        title="Delete (Del)"
                    >
                        <Trash2 size={16} />
                    </button>

                    {singleSelection && selectedObject && (
                        <>
                            <button
                                onClick={toggleLock}
                                className={`p-2 rounded-lg transition-colors ${selectedObject.locked ? 'bg-yellow-600/30 text-yellow-400' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                                title={selectedObject.locked ? 'Unlock' : 'Lock'}
                            >
                                {selectedObject.locked ? <Lock size={16} /> : <Unlock size={16} />}
                            </button>

                            <button
                                onClick={toggleVisibility}
                                className={`p-2 rounded-lg transition-colors ${!selectedObject.visible ? 'bg-gray-700 text-gray-500' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                                title={selectedObject.visible ? 'Hide' : 'Show'}
                            >
                                {selectedObject.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* Layer ordering */}
            {singleSelection && (
                <div className="flex items-center gap-1 pr-3 border-r border-gray-700">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider mr-1">Layer</span>

                    <button
                        onClick={() => bringToFront(selectedIds[0])}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                        title="Bring to Front"
                    >
                        <Layers size={16} />
                    </button>

                    <button
                        onClick={() => bringForward(selectedIds[0])}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                        title="Bring Forward"
                    >
                        <ChevronUp size={16} />
                    </button>

                    <button
                        onClick={() => sendBackward(selectedIds[0])}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                        title="Send Backward"
                    >
                        <ChevronDown size={16} />
                    </button>

                    <button
                        onClick={() => sendToBack(selectedIds[0])}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors rotate-180"
                        title="Send to Back"
                    >
                        <Layers size={16} />
                    </button>
                </div>
            )}

            {/* Multi-selection alignment */}
            {selectedIds.length > 1 && (
                <div className="flex items-center gap-1 pr-3 border-r border-gray-700">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider mr-1">Align</span>

                    <button
                        onClick={() => alignObjects('left')}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                        title="Align Left"
                    >
                        <AlignStartVertical size={16} />
                    </button>

                    <button
                        onClick={() => alignObjects('center')}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                        title="Align Center"
                    >
                        <AlignHorizontalJustifyCenter size={16} />
                    </button>

                    <button
                        onClick={() => alignObjects('right')}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                        title="Align Right"
                    >
                        <AlignEndVertical size={16} />
                    </button>

                    <div className="w-px h-4 bg-gray-700 mx-1" />

                    <button
                        onClick={() => alignObjects('top')}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                        title="Align Top"
                    >
                        <AlignStartVertical size={16} className="rotate-90" />
                    </button>

                    <button
                        onClick={() => alignObjects('middle')}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                        title="Align Middle"
                    >
                        <AlignVerticalJustifyCenter size={16} />
                    </button>

                    <button
                        onClick={() => alignObjects('bottom')}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                        title="Align Bottom"
                    >
                        <AlignEndVertical size={16} className="rotate-90" />
                    </button>
                </div>
            )}

            {/* Canvas actions */}
            <div className="flex items-center gap-1 ml-auto">
                <span className="text-[10px] text-gray-500 mr-2">
                    {objects.length} object{objects.length !== 1 ? 's' : ''}
                    {hasSelection && ` • ${selectedIds.length} selected`}
                </span>

                <button
                    onClick={clearCanvas}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
                    title="Clear Canvas"
                >
                    <RotateCcw size={16} />
                </button>
            </div>
        </div>
    );
}

export default ObjectToolbar;
