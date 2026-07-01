import React, { useCallback, useRef, useState } from 'react';
import { SketchBorder } from '@paper-ui/core';
import { cn } from '@paper-ui/utils';
import { GripVertical } from 'lucide-react';

export interface SortableItem {
  id: string;
  content: React.ReactNode;
}

export interface SortableListProps {
  items: SortableItem[];
  onReorder: (items: SortableItem[]) => void;
  className?: string;
}

export function SortableList({ items, onReorder, className }: SortableListProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const dragItem = useRef<number | null>(null);

  const handleDragStart = useCallback((index: number) => {
    dragItem.current = index;
    setDragIndex(index);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setOverIndex(index);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, dropIndex: number) => {
      e.preventDefault();
      const from = dragItem.current;
      if (from === null || from === dropIndex) {
        setDragIndex(null);
        setOverIndex(null);
        return;
      }
      const next = [...items];
      const [moved] = next.splice(from, 1);
      next.splice(dropIndex, 0, moved);
      onReorder(next);
      setDragIndex(null);
      setOverIndex(null);
      dragItem.current = null;
    },
    [items, onReorder],
  );

  const handleDragEnd = useCallback(() => {
    setDragIndex(null);
    setOverIndex(null);
    dragItem.current = null;
  }, []);

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {items.map((item, i) => (
        <div
          key={item.id}
          draggable
          onDragStart={() => handleDragStart(i)}
          onDragOver={(e) => handleDragOver(e, i)}
          onDrop={(e) => handleDrop(e, i)}
          onDragEnd={handleDragEnd}
          className={cn(
            'relative flex items-center gap-2 rounded-md px-3 py-2 transition-shadow',
            dragIndex === i && 'opacity-40',
            overIndex === i && 'shadow-[0_2px_0_#3a3733]',
          )}
          style={{ background: '#faf8f5', cursor: 'grab' }}
        >
          <SketchBorder stroke="#d4cfc2" strokeWidth={1.2} roughness={1} radius={6} bleed={4} />
          <span style={{ color: '#9c9484', display: 'flex', cursor: 'grab' }} aria-hidden>
            <GripVertical size={14} />
          </span>
          <span style={{ flex: 1, fontSize: '0.85rem', color: '#3a3733' }}>{item.content}</span>
        </div>
      ))}
    </div>
  );
}
