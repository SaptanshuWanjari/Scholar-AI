import React from 'react';
import { cn } from '@paper-ui/utils';

export type ParagraphSize = 'sm' | 'base' | 'lg';
export type ParagraphLeading = 'normal' | 'relaxed' | 'loose';

export interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: ParagraphSize;
  leading?: ParagraphLeading;
  children?: React.ReactNode;
}

const sizeMap: Record<ParagraphSize, string> = {
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
};

const leadingMap: Record<ParagraphLeading, string> = {
  normal: 'leading-normal',
  relaxed: 'leading-relaxed',
  loose: 'leading-loose',
};

export function Paragraph({
  size = 'base',
  leading = 'relaxed',
  className,
  children,
  ...props
}: ParagraphProps) {
  return (
    <p
      className={cn(
        'font-kalam',
        sizeMap[size],
        leadingMap[leading],
        'text-[#3a3733]',
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}
