import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@paper-ui/utils'
import { SketchBorder } from '@paper-ui/core'

export interface ActionSheetItem {
  id: string
  label: string
  icon?: React.ReactNode
  destructive?: boolean
  disabled?: boolean
  onSelect: () => void
}

export interface ActionSheetProps {
  open: boolean
  onClose: () => void
  title?: string
  items: ActionSheetItem[]
  cancelLabel?: string
  className?: string
}

export function ActionSheet({
  open,
  onClose,
  title,
  items,
  cancelLabel = 'Cancel',
  className,
}: ActionSheetProps) {
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

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    background: 'rgba(15,12,10,0.45)',
    backdropFilter: 'blur(3px)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    padding: 16,
    transition: 'opacity 0.2s',
  }

  const sheetStyle: React.CSSProperties = {
    maxWidth: 480,
    width: '100%',
    margin: '0 auto',
    transform: open ? 'translateY(0)' : 'translateY(100%)',
    transition: 'transform 0.25s ease',
  }

  return createPortal(
    <div style={overlayStyle} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className={cn('relative', className)} style={sheetStyle}>
        {title && (
          <div style={{
            textAlign: 'center',
            padding: '14px 16px',
            borderBottom: '1px solid #e8e3d8',
          }}>
            <span className="font-architect text-[15px]" style={{ color: '#3a3733' }}>{title}</span>
          </div>
        )}
        <SketchBorder fill="#fffdf9" stroke="#3a3733" strokeWidth={1.6} shadow={8} radius={12} roughness={1.0} bleed={6} />
        <div className="relative z-[1]">
          <div style={{ padding: 8 }}>
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                disabled={item.disabled}
                onClick={() => { if (!item.disabled) { item.onSelect(); onClose() } }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  width: '100%',
                  padding: '12px 16px',
                  border: 'none',
                  borderRadius: 8,
                  background: 'transparent',
                  cursor: item.disabled ? 'not-allowed' : 'pointer',
                  fontFamily: "'Kalam', cursive",
                  fontSize: 15,
                  color: item.destructive ? '#c0392b' : item.disabled ? '#d4cfc2' : '#3a3733',
                  textAlign: 'left',
                  transition: 'background 0.1s',
                  opacity: item.disabled ? 0.5 : 1,
                }}
                onMouseEnter={e => { if (!item.disabled) e.currentTarget.style.background = '#f0ede6' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
              >
                {item.icon && <span style={{ flexShrink: 0, display: 'flex' }}>{item.icon}</span>}
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cancel button */}
        <div style={{ marginTop: 8 }} className="relative">
          <SketchBorder fill="#fffdf9" stroke="#3a3733" strokeWidth={1.6} shadow={4} radius={12} roughness={1.0} bleed={6} />
          <div className="relative z-[1]">
            <button
              type="button"
              onClick={onClose}
              style={{
                width: '100%',
                padding: '14px 16px',
                border: 'none',
                borderRadius: 8,
                background: 'transparent',
                cursor: 'pointer',
                fontFamily: "'Architects Daughter', cursive",
                fontSize: 15,
                color: '#3a3733',
                textAlign: 'center',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f0ede6' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
            >
              {cancelLabel}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
