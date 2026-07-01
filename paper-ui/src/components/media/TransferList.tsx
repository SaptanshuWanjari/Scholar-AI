import React, { useState } from 'react';
import { SketchBorder } from '@paper-ui/core';
import { cn } from '@paper-ui/utils';
import { PaperCheckbox } from '../inputs/PaperCheckbox';
import { ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft } from 'lucide-react';

export interface TransferItem {
  id: string;
  label: string;
}

export interface TransferListProps {
  left: TransferItem[];
  right: TransferItem[];
  onChange: (left: TransferItem[], right: TransferItem[]) => void;
  className?: string;
}

export function TransferList({ left, right, onChange, className }: TransferListProps) {
  const [selectedLeft, setSelectedLeft] = useState<Set<string>>(new Set());
  const [selectedRight, setSelectedRight] = useState<Set<string>>(new Set());

  const toggle = (id: string, side: 'left' | 'right') => {
    const set = side === 'left' ? setSelectedLeft : setSelectedRight;
    set((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const move = (from: 'left' | 'right', all?: boolean) => {
    const source = from === 'left' ? left : right;
    const target = from === 'left' ? right : left;
    const sel = from === 'left' ? selectedLeft : selectedRight;
    const ids = all ? new Set(source.map((i) => i.id)) : sel;
    if (ids.size === 0) return;
    const moved = source.filter((i) => ids.has(i.id));
    const kept = source.filter((i) => !ids.has(i.id));
    const merged = [...target, ...moved];
    if (from === 'left') {
      setSelectedLeft(new Set());
      onChange(kept, merged);
    } else {
      setSelectedRight(new Set());
      onChange(merged, kept);
    }
  };

  const panel = (items: TransferItem[], side: 'left' | 'right') => {
    const sel = side === 'left' ? selectedLeft : selectedRight;
    return (
      <div className="relative flex-1" style={{ minHeight: 200, borderRadius: 8, padding: 6 }}>
        <SketchBorder stroke="#d4cfc2" strokeWidth={1.4} roughness={1.1} radius={8} bleed={5} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 300, overflowY: 'auto' }}>
          {items.length === 0 && (
            <div style={{ padding: 16, textAlign: 'center', color: '#9c9484', fontSize: '0.8rem', fontFamily: "'Kalam', cursive" }}>
              empty
            </div>
          )}
          {items.map((item) => (
            <label
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 8px',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: '0.82rem',
                color: '#3a3733',
                background: sel.has(item.id) ? '#e8e4dc' : 'transparent',
              }}
            >
              <PaperCheckbox
                checked={sel.has(item.id)}
                onChange={() => toggle(item.id, side)}
              />
              {item.label}
            </label>
          ))}
        </div>
      </div>
    );
  };

  const btn = (onClick: () => void, disabled: boolean, label: string, icon: React.ReactNode) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      style={{
        background: disabled ? '#f0efed' : '#faf8f5',
        border: '1.5px solid #d4cfc2',
        borderRadius: 6,
        cursor: disabled ? 'not-allowed' : 'pointer',
        padding: '5px 8px',
        display: 'flex',
        color: disabled ? '#d4cfc2' : '#3a3733',
      }}
    >
      {icon}
    </button>
  );

  const leftEmpty = left.length === 0;
  const rightEmpty = right.length === 0;

  return (
    <div className={cn('flex gap-3 items-center', className)}>
      {panel(left, 'left')}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {btn(() => move('left'), selectedLeft.size === 0, 'Move selected right', <ChevronRight size={16} />)}
        {btn(() => move('left', true), leftEmpty, 'Move all right', <ChevronsRight size={16} />)}
        {btn(() => move('right'), selectedRight.size === 0, 'Move selected left', <ChevronLeft size={16} />)}
        {btn(() => move('right', true), rightEmpty, 'Move all left', <ChevronsLeft size={16} />)}
      </div>
      {panel(right, 'right')}
    </div>
  );
}
