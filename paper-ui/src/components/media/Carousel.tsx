import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SketchBorder } from '@paper-ui/core';
import { cn } from '@paper-ui/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CarouselProps {
  children: React.ReactNode[];
  autoPlay?: number;
  className?: string;
}

export function Carousel({ children, autoPlay, className }: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((i: number) => {
    setCurrent(((i % children.length) + children.length) % children.length);
  }, [children.length]);

  const next = useCallback(() => go(current + 1), [go, current]);
  const prev = useCallback(() => go(current - 1), [go, current]);

  useEffect(() => {
    if (!autoPlay || children.length < 2) return;
    timerRef.current = setInterval(next, autoPlay);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [autoPlay, next, children.length]);

  if (children.length === 0) return null;

  const arrowBase: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    background: '#faf8f5',
    border: '1.5px solid #d4cfc2',
    borderRadius: 6,
    cursor: 'pointer',
    padding: 6,
    display: 'flex',
    color: '#3a3733',
    zIndex: 2,
    opacity: 0.7,
  };

  return (
    <div className={cn('relative', className)} style={{ borderRadius: 8 }}>
      <SketchBorder stroke="#d4cfc2" strokeWidth={1.4} roughness={1.1} radius={8} bleed={5} />
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 6 }}>
        <div
          style={{
            display: 'flex',
            transition: 'transform 0.3s ease',
            transform: `translateX(-${current * 100}%)`,
          }}
        >
          {children.map((child, i) => (
            <div key={i} style={{ minWidth: '100%' }}>
              {child}
            </div>
          ))}
        </div>
      </div>
      {children.length > 1 && (
        <>
          <button onClick={prev} aria-label="Previous" style={{ ...arrowBase, left: 8 }}>
            <ChevronLeft size={18} />
          </button>
          <button onClick={next} aria-label="Next" style={{ ...arrowBase, right: 8 }}>
            <ChevronRight size={18} />
          </button>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, padding: '10px 0 6px' }}>
            {children.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`Slide ${i + 1}`}
                style={{
                  width: i === current ? 20 : 8,
                  height: 8,
                  borderRadius: 4,
                  border: 'none',
                  background: i === current ? '#3a3733' : '#d4cfc2',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.2s',
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
