import React from 'react';
import { SketchBorder } from '@paper-ui/core';
import { cn } from '@paper-ui/utils';

export interface ThumbnailProps {
  src: string;
  alt: string;
  size?: number;
  selected?: boolean;
  onClick?: () => void;
  label?: string;
  className?: string;
}

export function Thumbnail({
  src,
  alt,
  size = 80,
  selected = false,
  onClick,
  label,
  className,
}: ThumbnailProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('group relative flex flex-col items-center gap-1 bg-transparent border-0 p-0 cursor-pointer', className)}
      style={{ width: size }}
      aria-pressed={selected}
    >
      <div
        className="relative overflow-hidden transition-transform duration-150 group-hover:scale-105"
        style={{
          width: size,
          height: size,
          borderRadius: 6,
        }}
      >
        <SketchBorder
          stroke={selected ? '#c0392b' : '#2c2c2c'}
          strokeWidth={selected ? 2.5 : 1.6}
          roughness={1.1}
          radius={6}
        />
        <img
          src={src}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            borderRadius: 6,
          }}
        />
        {selected && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(192, 57, 43, 0.12)',
              borderRadius: 6,
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
      {label && (
        <span
          style={{
            fontSize: '0.7rem',
            color: selected ? '#c0392b' : '#6b6055',
            fontFamily: "'Kalam', cursive",
            lineHeight: 1.2,
            maxWidth: size,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'block',
          }}
        >
          {label}
        </span>
      )}
    </button>
  );
}
