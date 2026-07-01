import React from 'react';
import { cn } from '@paper-ui/utils';

export interface SmallProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

export function Small({ className, children, ...props }: SmallProps) {
  return (
    <small
      className={cn('font-architect text-xs text-[#9c9484]', className)}
      {...props}
    >
      {children}
    </small>
  );
}
