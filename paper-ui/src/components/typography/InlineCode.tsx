import React from 'react';
import { cn } from '@paper-ui/utils';

export interface InlineCodeProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

export function InlineCode({ className, style, children, ...props }: InlineCodeProps) {
  return (
    <code
      className={cn('font-mono text-sm rounded-sm px-1.5 py-0.5 text-[#3a3733]', className)}
      style={{
        backgroundColor: '#f0efed',
        backgroundImage:
          'repeating-linear-gradient(45deg, rgba(0,0,0,0.05) 0 1px, transparent 1px 5px)',
        ...style,
      }}
      {...props}
    >
      {children}
    </code>
  );
}
