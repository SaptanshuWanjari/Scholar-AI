import React from 'react';
import { SketchBorder } from '@paper-ui/core';
import { cn } from '@paper-ui/utils';

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

export interface AvatarGroupAvatar {
  src?: string;
  alt?: string;
  name?: string;
}

export interface AvatarGroupProps {
  avatars: AvatarGroupAvatar[];
  max?: number;
  size?: number;
  className?: string;
}

export function AvatarGroup({ avatars, max = 4, size = 36, className }: AvatarGroupProps) {
  const shown = avatars.slice(0, max);
  const overflow = avatars.length - shown.length;
  const offset = Math.round(size * 0.35);

  return (
    <div className={cn('flex items-center', className)} style={{ height: size }}>
      {shown.map((a, i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-full"
          style={{
            width: size,
            height: size,
            marginLeft: i === 0 ? 0 : -offset,
            zIndex: shown.length - i,
            flexShrink: 0,
          }}
        >
          <span className="absolute inset-0 z-[2] pointer-events-none">
            <SketchBorder
              stroke="rgba(0,0,0,0.18)"
              strokeWidth={1.4}
              radius={size / 2}
              roughness={0.9}
              bowing={0.7}
              bleed={3}
            />
          </span>
          {a.src ? (
            <img
              src={a.src}
              alt={a.alt ?? a.name ?? 'avatar'}
              className="h-full w-full object-cover"
            />
          ) : (
            <span
              className="flex h-full w-full items-center justify-center font-architect text-xs font-medium select-none"
              style={{ background: '#f0efed', color: '#3a3733' }}
            >
              {a.name ? getInitials(a.name) : '?'}
            </span>
          )}
        </div>
      ))}
      {overflow > 0 && (
        <div
          className="relative flex items-center justify-center rounded-full font-architect font-medium select-none"
          style={{
            width: size,
            height: size,
            marginLeft: -offset,
            background: '#f0efed',
            color: '#3a3733',
            fontSize: Math.round(size * 0.3),
            flexShrink: 0,
          }}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}
