import React from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import { useCanvasEditMode } from './CanvasEditModeContext';

interface SortableSectionProps {
    id: string;
    children: React.ReactNode;
}

function SortableSection({ id, children }: SortableSectionProps) {
    const { isCanvasMode, moveSectionUp, moveSectionDown, sectionOrder } = useCanvasEditMode();
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        position: 'relative' as const,
    };

    const index = sectionOrder.indexOf(id);
    const isFirst = index === 0;
    const isLast = index === sectionOrder.length - 1;

    if (!isCanvasMode) {
        return <>{children}</>;
    }

    return (
        <div ref={setNodeRef} style={style} className="group/section">
            {/* Drag Handle and Controls */}
            <div className="absolute -left-8 top-0 bottom-0 flex flex-col items-center justify-start pt-2 gap-1 opacity-0 group-hover/section:opacity-100 transition-opacity no-print">
                {/* Drag Handle */}
                <button
                    {...attributes}
                    {...listeners}
                    className="p-1 hover:bg-gray-200 rounded cursor-grab active:cursor-grabbing"
                    title="Drag to reorder"
                >
                    <GripVertical size={16} className="text-gray-400" />
                </button>

                {/* Move Up Button */}
                <button
                    onClick={() => moveSectionUp(id)}
                    disabled={isFirst}
                    className={`p-1 rounded ${isFirst ? 'text-gray-200' : 'text-gray-400 hover:bg-gray-200 hover:text-gray-600'}`}
                    title="Move up"
                >
                    <ChevronUp size={14} />
                </button>

                {/* Move Down Button */}
                <button
                    onClick={() => moveSectionDown(id)}
                    disabled={isLast}
                    className={`p-1 rounded ${isLast ? 'text-gray-200' : 'text-gray-400 hover:bg-gray-200 hover:text-gray-600'}`}
                    title="Move down"
                >
                    <ChevronDown size={14} />
                </button>
            </div>

            {/* Section Content */}
            <div className={`transition-all ${isDragging ? 'ring-2 ring-blue-400 ring-offset-2 rounded' : ''}`}>
                {children}
            </div>
        </div>
    );
}

interface SortableSectionsContainerProps {
    children: React.ReactNode;
}

export function SortableSectionsContainer({ children }: SortableSectionsContainerProps) {
    const { isCanvasMode, sectionOrder, reorderSections } = useCanvasEditMode();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = sectionOrder.indexOf(active.id as string);
            const newIndex = sectionOrder.indexOf(over.id as string);
            const newOrder = arrayMove(sectionOrder, oldIndex, newIndex);
            reorderSections(newOrder);
        }
    };

    if (!isCanvasMode) {
        return <>{children}</>;
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
                <div className="pl-8">
                    {children}
                </div>
            </SortableContext>
        </DndContext>
    );
}

export { SortableSection };
