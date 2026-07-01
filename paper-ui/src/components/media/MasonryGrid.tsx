import React from 'react';
import { cn } from '@paper-ui/utils';

export interface MasonryGridProps {
  children: React.ReactNode;
  columns?: number;
  gap?: number;
  className?: string;
}

export function MasonryGrid({ children, columns = 3, gap = 16, className }: MasonryGridProps) {
  return (
    <div
      className={cn('[&>*]:break-inside-avoid', className)}
      style={{
        columnCount: columns,
        columnGap: gap,
      }}
    >
      {children}
    </div>
  );
}
