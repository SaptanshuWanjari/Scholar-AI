import React from 'react';
import { cn } from '@paper-ui/utils';
import { SketchBorder } from '@paper-ui/core';

export type BlockquoteTone = 'ochre' | 'sage' | 'sky' | 'lavender' | 'brick' | 'ink';

export interface BlockquoteProps extends React.HTMLAttributes<HTMLQuoteElement> {
  tone?: BlockquoteTone;
  attribution?: string;
  children?: React.ReactNode;
}

const toneColorMap: Record<BlockquoteTone, string> = {
  ochre: '#b07a2e',
  sage: '#3f7a4e',
  sky: '#4a6f91',
  lavender: '#6f63a3',
  brick: '#a3544a',
  ink: '#3a3733',
};

export function Blockquote({
  tone = 'ochre',
  attribution,
  className,
  children,
  ...props
}: BlockquoteProps) {
  const color = toneColorMap[tone];

  return (
    <blockquote
      className={cn('relative pl-5 py-2 my-1', className)}
      style={{ borderLeft: `3px solid ${color}` }}
      {...props}
    >
      <p className="font-kalam text-base italic leading-relaxed" style={{ color }}>
        {children}
      </p>
      {attribution && (
        <footer
          className="font-architect text-xs mt-2 opacity-70"
          style={{ color }}
        >
          — {attribution}
        </footer>
      )}
    </blockquote>
  );
}
