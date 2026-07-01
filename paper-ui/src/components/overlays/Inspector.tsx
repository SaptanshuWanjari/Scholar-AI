import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@paper-ui/utils'
import { SketchBorder } from '@paper-ui/core'

export interface InspectorField {
  label: string
  value: React.ReactNode
}

export interface InspectorProps {
  open: boolean
  onClose: () => void
  title?: string
  fields: InspectorField[]
  children?: React.ReactNode
  width?: number
  className?: string
}

export function Inspector({
  open,
  onClose,
  title,
  fields,
  children,
  width = 420,
  className,
}: InspectorProps) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    background: 'rgba(15,12,10,0.55)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  }

  return createPortal(
    <div style={overlayStyle} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className={cn('relative', className)} style={{ width, maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
        <SketchBorder fill="#fffdf9" stroke="#3a3733" strokeWidth={1.8} shadow={10} radius={10} roughness={1.0} bleed={6} />
        <div className="relative z-[1] flex flex-col" style={{ maxHeight: '80vh' }}>
          {/* Header */}
          {title && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #e8e3d8',
              padding: '16px 24px',
              flexShrink: 0,
            }}>
              <span className="font-architect text-[17px]" style={{ color: '#3a3733' }}>{title}</span>
              <button type="button" aria-label="Close" onClick={onClose}
                className="inline-flex h-7 w-7 items-center justify-center transition-colors"
                style={{ color: '#9c9484' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#3a3733')}
                onMouseLeave={e => (e.currentTarget.style.color = '#9c9484')}
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Fields */}
          <div style={{ overflowY: 'auto', padding: '20px 24px' }}>
            {fields.map((f, i) => (
              <div key={i} style={{
                display: 'flex',
                gap: 12,
                padding: '6px 0',
                borderBottom: i < fields.length - 1 ? '1px dashed #e8e3d8' : 'none',
              }}>
                <span style={{
                  flexShrink: 0,
                  width: 100,
                  fontFamily: "'Architects Daughter', cursive",
                  fontSize: 12,
                  color: '#9c9484',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  paddingTop: 2,
                }}>
                  {f.label}
                </span>
                <span style={{
                  fontFamily: "'Kalam', cursive",
                  fontSize: 14,
                  color: '#3a3733',
                }}>
                  {f.value}
                </span>
              </div>
            ))}
            {children && <div style={{ marginTop: 12 }}>{children}</div>}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
