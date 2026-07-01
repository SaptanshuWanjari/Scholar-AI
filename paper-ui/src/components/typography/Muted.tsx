import React from 'react';
import { cn } from '@paper-ui/utils';

export interface MutedProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

export function Muted({ className, children, ...props }: MutedProps) {
  return (
    <span
      className={cn('font-kalam text-sm text-[#9c9484]', className)}
      {...props}
    >
      {children}
    </span>
  );
}
