import { useRef, useEffect, useState } from 'react';
import Moveable, { OnDrag, OnDragEnd, OnResize, OnResizeEnd, OnRotate, OnRotateEnd } from 'react-moveable';
import { useCanvasObjects, CanvasObjectData } from './CanvasObjectContext';
import { Trash2, Copy, ArrowUp, ArrowDown } from 'lucide-react';

interface CanvasObjectProps {
    object: CanvasObjectData;
    isSelected: boolean;
    onSelect: (e: React.MouseEvent) => void;
    children: React.ReactNode;
    canvasRef: React.RefObject<HTMLDivElement | null>;
    allObjectRefs: Map<string, HTMLDivElement>;
}

export function CanvasObject({
    object,
    isSelected,
    onSelect,
    children,
    canvasRef,
    allObjectRefs,
}: CanvasObjectProps) {
    const targetRef = useRef<HTMLDivElement>(null);
    const { updateObject, deleteObject, duplicateObject, bringToFront, sendToBack } = useCanvasObjects();
    const [showControls, setShowControls] = useState(false);

    // Register ref with parent
    useEffect(() => {
        if (targetRef.current) {
            allObjectRefs.set(object.id, targetRef.current);
        }
        return () => {
            allObjectRefs.delete(object.id);
        };
    }, [object.id, allObjectRefs]);

    // Get other objects for snapping (excluding current)
    const getSnapElements = () => {
        const elements: HTMLElement[] = [];
        allObjectRefs.forEach((el, id) => {
            if (id !== object.id && el) {
                elements.push(el);
            }
        });
        return elements;
    };

    const handleDrag = (e: OnDrag) => {
        e.target.style.left = `${e.left}px`;
        e.target.style.top = `${e.top}px`;
    };

    const handleDragEnd = (e: OnDragEnd) => {
        if (!e.target) return;
        const target = e.target as HTMLElement;
        updateObject(object.id, {
            x: parseFloat(target.style.left) || 0,
            y: parseFloat(target.style.top) || 0,
        });
    };

    const handleResize = (e: OnResize) => {
        const target = e.target as HTMLElement;
        target.style.width = `${e.width}px`;
        target.style.height = `${e.height}px`;
        target.style.left = `${e.drag.left}px`;
        target.style.top = `${e.drag.top}px`;
    };

    const handleResizeEnd = (e: OnResizeEnd) => {
        if (!e.target) return;
        const target = e.target as HTMLElement;
        updateObject(object.id, {
            x: parseFloat(target.style.left) || 0,
            y: parseFloat(target.style.top) || 0,
            width: parseFloat(target.style.width) || object.width,
            height: parseFloat(target.style.height) || object.height,
        });
    };

    const handleRotate = (e: OnRotate) => {
        e.target.style.transform = e.transform;
    };

    const handleRotateEnd = (e: OnRotateEnd) => {
        if (!e.target) return;
        const target = e.target as HTMLElement;
        const match = target.style.transform.match(/rotate\(([^)]+)deg\)/);
        if (match) {
            updateObject(object.id, { rotation: parseFloat(match[1]) });
        }
    };

    return (
        <>
            <div
                ref={targetRef}
                className={`canvas-object absolute ${isSelected ? 'ring-2 ring-blue-500 ring-offset-1' : ''} ${object.locked ? 'pointer-events-none opacity-75' : 'cursor-move'}`}
                style={{
                    left: object.x,
                    top: object.y,
                    width: object.width,
                    height: object.height,
                    transform: `rotate(${object.rotation}deg)`,
                    zIndex: object.zIndex,
                    opacity: object.opacity,
                    display: object.visible ? 'block' : 'none',
                }}
                onClick={onSelect}
                onMouseEnter={() => setShowControls(true)}
                onMouseLeave={() => !isSelected && setShowControls(false)}
            >
                {children}

                {/* Quick action buttons */}
                {(isSelected || showControls) && !object.locked && (
                    <div className="absolute -top-10 left-0 flex gap-1 bg-gray-900 rounded-lg p-1 shadow-xl z-50">
                        <button
                            onClick={(e) => { e.stopPropagation(); duplicateObject(object.id); }}
                            className="p-1.5 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
                            title="Duplicate"
                        >
                            <Copy size={14} />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); bringToFront(object.id); }}
                            className="p-1.5 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
                            title="Bring to Front"
                        >
                            <ArrowUp size={14} />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); sendToBack(object.id); }}
                            className="p-1.5 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
                            title="Send to Back"
                        >
                            <ArrowDown size={14} />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); deleteObject(object.id); }}
                            className="p-1.5 text-gray-300 hover:text-red-400 hover:bg-gray-700 rounded transition-colors"
                            title="Delete"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                )}
            </div>

            {/* Moveable controller - only show when selected and not locked */}
            {isSelected && !object.locked && targetRef.current && (
                <Moveable
                    target={targetRef.current}
                    container={canvasRef.current}

                    // Dragging
                    draggable={true}
                    throttleDrag={0}
                    onDrag={handleDrag}
                    onDragEnd={handleDragEnd}

                    // Resizing
                    resizable={true}
                    keepRatio={false}
                    throttleResize={0}
                    renderDirections={['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se']}
                    onResize={handleResize}
                    onResizeEnd={handleResizeEnd}

                    // Rotation
                    rotatable={true}
                    throttleRotate={0}
                    onRotate={handleRotate}
                    onRotateEnd={handleRotateEnd}

                    // Snapping / Alignment Guides
                    snappable={true}
                    snapThreshold={5}
                    elementGuidelines={getSnapElements()}
                    snapDirections={{
                        top: true,
                        left: true,
                        bottom: true,
                        right: true,
                        center: true,
                        middle: true,
                    }}
                    elementSnapDirections={{
                        top: true,
                        left: true,
                        bottom: true,
                        right: true,
                        center: true,
                        middle: true,
                    }}

                    // Styling
                    origin={false}
                    padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
                />
            )}
        </>
    );
}

export default CanvasObject;

