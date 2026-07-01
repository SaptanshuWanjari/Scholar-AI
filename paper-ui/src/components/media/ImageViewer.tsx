import React, { useCallback, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { SketchBorder } from '@paper-ui/core';

export interface ImageViewerProps {
  src: string;
  alt: string;
  caption?: string;
}

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.25;

export function ImageViewer({ src, alt, caption }: ImageViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const startPan = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const clampZoom = (z: number) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z));

  const zoomIn = () => {
    setZoom(z => clampZoom(z + ZOOM_STEP));
    if (zoom >= 1) return;
    setPan({ x: 0, y: 0 });
  };

  const zoomOut = () => {
    setZoom(z => {
      const next = clampZoom(z - ZOOM_STEP);
      if (next <= 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const reset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom <= 1) return;
    dragging.current = true;
    startPos.current = { x: e.clientX, y: e.clientY };
    startPan.current = { ...pan };
    e.preventDefault();
  }, [zoom, pan]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    setPan({ x: startPan.current.x + dx, y: startPan.current.y + dy });
  }, []);

  const onMouseUp = useCallback(() => {
    dragging.current = false;
  }, []);

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
    setZoom(z => {
      const next = clampZoom(z + delta);
      if (next <= 1) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const percent = Math.round(zoom * 100);

  const btnStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f4f1ea',
    border: '1.5px solid #c8bfb0',
    borderRadius: 6,
    cursor: 'pointer',
    padding: '6px 10px',
    color: '#3d3530',
    fontSize: '0.78rem',
    fontFamily: "'Kalam', cursive",
    gap: 4,
    transition: 'background 0.15s',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Viewer area */}
      <div
        ref={containerRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onWheel={onWheel}
        style={{
          position: 'relative',
          width: '100%',
          height: 400,
          overflow: 'hidden',
          borderRadius: 10,
          background: '#f0ebe2',
          cursor: zoom > 1 ? (dragging.current ? 'grabbing' : 'grab') : 'default',
          userSelect: 'none',
        }}
      >
        <SketchBorder stroke="#2c2c2c" strokeWidth={1.8} roughness={1.2} radius={10} />
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <img
            src={src}
            alt={alt}
            draggable={false}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
              transition: dragging.current ? 'none' : 'transform 0.15s ease',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        justifyContent: 'center',
        position: 'relative',
      }}>
        <button onClick={zoomOut} style={btnStyle} aria-label="Zoom out" disabled={zoom <= MIN_ZOOM}>
          <ZoomOut size={14} />
        </button>

        <div style={{
          minWidth: 64,
          textAlign: 'center',
          position: 'relative',
          padding: '5px 12px',
          fontSize: '0.82rem',
          fontFamily: "'Kalam', cursive",
          color: '#3d3530',
        }}>
          <SketchBorder stroke="#b0a898" strokeWidth={1.2} roughness={1} radius={5} />
          {percent}%
        </div>

        <button onClick={zoomIn} style={btnStyle} aria-label="Zoom in" disabled={zoom >= MAX_ZOOM}>
          <ZoomIn size={14} />
        </button>

        <button onClick={reset} style={btnStyle} aria-label="Reset zoom">
          <RotateCcw size={14} />
          Reset
        </button>
      </div>

      {caption && (
        <p style={{
          textAlign: 'center',
          color: '#6b6055',
          fontFamily: "'Kalam', cursive",
          fontSize: '0.82rem',
          margin: 0,
        }}>
          {caption}
        </p>
      )}
    </div>
  );
}
