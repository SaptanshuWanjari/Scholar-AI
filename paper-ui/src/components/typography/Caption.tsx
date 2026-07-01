import React from 'react';
import { cn } from '@paper-ui/utils';

export type CaptionAlign = 'left' | 'center' | 'right';

export interface CaptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  align?: CaptionAlign;
  children?: React.ReactNode;
}

const alignMap: Record<CaptionAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export function Caption({ align = 'left', className, children, ...props }: CaptionProps) {
  return (
    <p
      className={cn('font-architect text-xs text-[#9c9484]', alignMap[align], className)}
      {...props}
    >
      {children}
    </p>
  );
}
