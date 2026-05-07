"use client";

import { useRef } from "react";

export function useDragReorder<T>(
    items: T[],
    setItems: React.Dispatch<React.SetStateAction<T[]>>
) {
    const dragIndex = useRef<number | null>(null);
    const overIndex = useRef<number | null>(null);

    function onDragStart(index: number) {
        dragIndex.current = index;
    }

    function onDragEnter(index: number) {
        overIndex.current = index;
    }

    function onDragOver(e: React.DragEvent) {
        e.preventDefault();
    }

    function onDrop(e: React.DragEvent) {
        e.preventDefault();
        const from = dragIndex.current;
        const to = overIndex.current;
        if (from === null || to === null || from === to) return;
        setItems((prev) => {
            const next = [...prev];
            const [moved] = next.splice(from, 1);
            next.splice(to, 0, moved);
            return next;
        });
        dragIndex.current = null;
        overIndex.current = null;
    }

    function onDragEnd() {
        dragIndex.current = null;
        overIndex.current = null;
    }

    return { onDragStart, onDragEnter, onDragOver, onDrop, onDragEnd };
}
