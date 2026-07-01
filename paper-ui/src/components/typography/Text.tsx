import React from 'react';
import { cn } from '@paper-ui/utils';

// tone colors: ink=#3a3733, muted=#9c9484, sage=#3f7a4e, ochre=#b07a2e, sky=#4a6f91, lavender=#6f63a3, brick=#a3544a

export type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl';
export type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';
export type TextFont = 'kalam' | 'architect' | 'caveat' | 'mono';
export type TextTone = 'ink' | 'muted' | 'sage' | 'ochre' | 'sky' | 'lavender' | 'brick';
export type TextAs = 'span' | 'p' | 'div';

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  size?: TextSize;
  weight?: TextWeight;
  font?: TextFont;
  tone?: TextTone;
  as?: TextAs;
  children?: React.ReactNode;
}

const sizeMap: Record<TextSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
};

const weightMap: Record<TextWeight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const fontMap: Record<TextFont, string> = {
  kalam: 'font-kalam',
  architect: 'font-architect',
  caveat: 'font-caveat',
  mono: 'font-mono',
};

const toneColorMap: Record<TextTone, string> = {
  ink: '#3a3733',
  muted: '#9c9484',
  sage: '#3f7a4e',
  ochre: '#b07a2e',
  sky: '#4a6f91',
  lavender: '#6f63a3',
  brick: '#a3544a',
};

export function Text({
  size = 'base',
  weight = 'normal',
  font = 'kalam',
  tone = 'ink',
  as: Tag = 'span',
  className,
  style,
  children,
  ...props
}: TextProps) {
  return (
    <Tag
      className={cn(sizeMap[size], weightMap[weight], fontMap[font], className)}
      style={{ color: toneColorMap[tone], ...style }}
      {...props}
    >
      {children}
    </Tag>
  );
}
