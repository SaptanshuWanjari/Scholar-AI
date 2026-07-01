import React from 'react';
import { cn } from '@paper-ui/utils';
import { SketchBorder } from '@paper-ui/core';

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

export function Kbd({ className, children, ...props }: KbdProps) {
  return (
    <kbd
      className={cn(
        'relative inline-flex items-center justify-center font-architect text-xs text-[#3a3733] px-2 py-0.5 min-w-[1.6rem]',
        className,
      )}
      {...props}
    >
      <SketchBorder radius={5} strokeWidth={1.2} stroke="#bdb7a8" roughness={0.8} bleed={4} />
      <span className="relative z-[1]">{children}</span>
    </kbd>
  );
}
