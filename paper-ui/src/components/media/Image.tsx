import React from 'react';
import { SketchBorder } from '@paper-ui/core';
import { cn } from '@paper-ui/utils';

export interface ImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  caption?: string;
  aspectRatio?: 'auto' | '1/1' | '4/3' | '16/9' | '3/2';
  objectFit?: 'cover' | 'contain';
  className?: string;
}

const roundedMap: Record<string, string> = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '16px',
  full: '9999px',
};

const aspectMap: Record<string, string> = {
  auto: 'auto',
  '1/1': '1 / 1',
  '4/3': '4 / 3',
  '16/9': '16 / 9',
  '3/2': '3 / 2',
};

export function Image({
  src,
  alt,
  width,
  height,
  rounded = 'md',
  caption,
  aspectRatio = 'auto',
  objectFit = 'cover',
  className,
}: ImageProps) {
  const borderRadius = roundedMap[rounded] ?? '8px';

  return (
    <figure className={cn('inline-block', className)} style={{ width, margin: 0 }}>
      <div
        className="relative overflow-hidden"
        style={{
          borderRadius,
          aspectRatio: aspectMap[aspectRatio],
          height: aspectRatio === 'auto' ? height : undefined,
        }}
      >
        <SketchBorder stroke="#2c2c2c" strokeWidth={1.8} roughness={1.2} radius={rounded === 'full' ? 999 : parseInt(borderRadius) || 8} />
        <img
          src={src}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit,
            display: 'block',
            borderRadius,
          }}
        />
      </div>
      {caption && (
        <figcaption
          style={{
            marginTop: '8px',
            fontSize: '0.78rem',
            color: '#6b6055',
            fontFamily: "'Kalam', 'Patrick Hand', cursive",
            textAlign: 'center',
            lineHeight: 1.4,
          }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
