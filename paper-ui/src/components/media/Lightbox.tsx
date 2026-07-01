import React, { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export interface LightboxImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface LightboxProps {
  images: LightboxImage[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export function Lightbox({ images, initialIndex = 0, isOpen, onClose }: LightboxProps) {
  const [current, setCurrent] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) setCurrent(initialIndex);
  }, [isOpen, initialIndex]);

  const prev = useCallback(() => {
    setCurrent(c => (c - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback(() => {
    setCurrent(c => (c + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose, prev, next]);

  if (!isOpen) return null;

  const img = images[current];

  const btnStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.15)',
    border: '1.5px solid rgba(255,255,255,0.3)',
    borderRadius: 8,
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px',
    backdropFilter: 'blur(4px)',
    transition: 'background 0.15s',
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal
      aria-label="Image lightbox"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 12, 10, 0.88)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Close lightbox"
        style={{
          ...btnStyle,
          position: 'absolute',
          top: 16,
          right: 16,
        }}
      >
        <X size={20} />
      </button>

      {/* Counter */}
      <div style={{
        position: 'absolute',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'rgba(255,255,255,0.6)',
        fontSize: '0.8rem',
        fontFamily: "'Kalam', cursive",
      }}>
        {current + 1} / {images.length}
      </div>

      {/* Image area */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        width: '100%',
        maxWidth: 900,
        flex: '1 1 auto',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* Prev */}
        {images.length > 1 && (
          <button onClick={prev} aria-label="Previous image" style={btnStyle}>
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Image */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          overflow: 'hidden',
          maxHeight: 'calc(100vh - 140px)',
        }}>
          <img
            key={current}
            src={img.src}
            alt={img.alt}
            style={{
              maxWidth: '100%',
              maxHeight: 'calc(100vh - 200px)',
              objectFit: 'contain',
              borderRadius: 8,
              border: '2px solid rgba(255,255,255,0.15)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
              animation: 'fadeIn 0.2s ease',
            }}
          />
          {img.caption && (
            <p style={{
              color: 'rgba(255,255,255,0.7)',
              fontFamily: "'Kalam', cursive",
              fontSize: '0.85rem',
              textAlign: 'center',
              margin: 0,
            }}>
              {img.caption}
            </p>
          )}
        </div>

        {/* Next */}
        {images.length > 1 && (
          <button onClick={next} aria-label="Next image" style={btnStyle}>
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      {/* Dot indicators */}
      {images.length > 1 && (
        <div style={{
          display: 'flex',
          gap: 8,
          marginTop: 16,
          flexShrink: 0,
        }}>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to image ${i + 1}`}
              style={{
                width: i === current ? 20 : 8,
                height: 8,
                borderRadius: 4,
                background: i === current ? '#fff' : 'rgba(255,255,255,0.35)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.2s',
              }}
            />
          ))}
        </div>
      )}

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }`}</style>
    </div>,
    document.body
  );
}
