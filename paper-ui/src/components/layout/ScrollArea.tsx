import React from 'react';
import { cn } from '@paper-ui/utils';

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  maxHeight?: string | number;
}

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, children, maxHeight, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'overflow-y-auto overflow-x-hidden',
        '[scrollbar-width:thin] [scrollbar-color:var(--paper-stroke-sm)_transparent]',
        className,
      )}
      style={{ maxHeight, ...style }}
      {...props}
    >
      {children}
    </div>
  ),
);
ScrollArea.displayName = 'ScrollArea';
