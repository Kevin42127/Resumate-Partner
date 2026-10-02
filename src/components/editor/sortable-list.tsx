"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "./dnd-modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { createContext, useContext } from "react";
import { GripIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

type HandleProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
const HandleContext = createContext<{ props: HandleProps; setRef: (el: HTMLElement | null) => void } | null>(null);

export function SortableList<T extends string>({
  ids,
  onReorder,
  children,
}: {
  ids: T[];
  onReorder: (ids: T[]) => void;
  children: React.ReactNode;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    onReorder(arrayMove(ids, ids.indexOf(active.id as T), ids.indexOf(over.id as T)));
  };
  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd} modifiers={[restrictToVerticalAxis]}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
}

export function SortableItem({ id, className, children }: { id: string; className?: string; children: React.ReactNode }) {
  const { setNodeRef, setActivatorNodeRef, transform, transition, isDragging, listeners, attributes } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn(className, isDragging && "relative z-10 shadow-lg ring-1 ring-brand/20")}
    >
      <HandleContext.Provider value={{ props: { ...attributes, ...listeners } as HandleProps, setRef: setActivatorNodeRef }}>
        {children}
      </HandleContext.Provider>
    </div>
  );
}

export function DragHandle({ label }: { label: string }) {
  const ctx = useContext(HandleContext);
  return (
    <button
      type="button"
      ref={ctx?.setRef}
      {...ctx?.props}
      aria-label={label}
      title={label}
      className="grid size-7 shrink-0 cursor-grab touch-none place-items-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-none active:cursor-grabbing"
    >
      <GripIcon />
    </button>
  );
}
