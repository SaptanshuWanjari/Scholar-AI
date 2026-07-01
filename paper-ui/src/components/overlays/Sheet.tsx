import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@paper-ui/utils'
import { SketchBorder } from '@paper-ui/core'

export interface SheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  side?: 'right' | 'bottom'
  width?: number | string
  height?: number | string
  className?: string
}

const sheetOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 60,
  background: 'rgba(15,12,10,0.4)',
}

const sheetPanelBase: React.CSSProperties = {
  position: 'fixed',
  zIndex: 61,
  display: 'flex',
  flexDirection: 'column',
  background: '#fffdf9',
  transition: 'transform 0.25s ease',
}

export function Sheet({
  open,
  onClose,
  title,
  children,
  side = 'right',
  width = 380,
  height = 320,
  className,
}: SheetProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (open) {
      setMounted(true)
    } else {
      const t = setTimeout(() => setMounted(false), 250)
      return () => clearTimeout(t)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!mounted) return null

  const isRight = side === 'right'
  const panelStyle: React.CSSProperties = {
    ...sheetPanelBase,
    ...(isRight
      ? { top: 0, bottom: 0, right: 0, width }
      : { bottom: 0, left: 0, right: 0, height }),
    transform: open
      ? 'translateX(0) translateY(0)'
      : isRight
        ? 'translateX(100%)'
        : 'translateY(100%)',
  }

  return createPortal(
    <>
      <div style={sheetOverlayStyle} onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label={title} style={panelStyle} className={className}>
        <SketchBorder fill="#fffdf9" stroke="#3a3733" strokeWidth={1.6} shadow={8} radius={isRight ? 0 : 12} bleed={4} />
        <div className="relative z-[1] flex h-full flex-col">
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
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', fontFamily: "'Kalam', cursive", fontSize: 14, color: '#3a3733' }}>
            {children}
          </div>
        </div>
      </div>
    </>,
    document.body,
  )
}
