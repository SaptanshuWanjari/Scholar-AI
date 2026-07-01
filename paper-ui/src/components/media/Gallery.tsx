import React from 'react';
import { Image } from './Image';
import { cn } from '@paper-ui/utils';

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface GalleryProps {
  images: GalleryImage[];
  columns?: 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

const gapMap: Record<string, string> = {
  sm: '8px',
  md: '16px',
  lg: '24px',
};

export function Gallery({ images, columns = 3, gap = 'md', className }: GalleryProps) {
  const gapPx = gapMap[gap] ?? '16px';

  return (
    <div
      className={cn('w-full', className)}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: gapPx,
      }}
    >
      {images.map((img, i) => (
        <Image
          key={i}
          src={img.src}
          alt={img.alt}
          caption={img.caption}
          aspectRatio="4/3"
          objectFit="cover"
          className="w-full"
        />
      ))}
    </div>
  );
}
