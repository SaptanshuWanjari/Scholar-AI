import React from 'react';
import { cn } from '@paper-ui/utils';

export interface MarkProps extends React.HTMLAttributes<HTMLElement> {
  color?: string;
  children?: React.ReactNode;
}

export function Mark({
  color = '#fde047',
  className,
  style,
  children,
  ...props
}: MarkProps) {
  return (
    <mark
      className={cn('px-1 py-0.5 rounded-sm text-[#3a3733]', className)}
      style={{
        background: `linear-gradient(104deg, transparent 0%, ${color}cc 5%, ${color} 20%, ${color} 80%, ${color}cc 95%, transparent 100%)`,
        // Reset browser default mark styling
        backgroundColor: 'transparent',
        ...style,
      }}
      {...props}
    >
      {children}
    </mark>
  );
}
