import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Command, Search, X } from 'lucide-react'
import { cn } from '@paper-ui/utils'
import { SketchBorder } from '@paper-ui/core'

export interface CommandItem {
  id: string
  label: string
  icon?: React.ReactNode
  onSelect: () => void
}

export interface CommandDialogProps {
  open: boolean
  onClose: () => void
  items: CommandItem[]
  placeholder?: string
  className?: string
}

export function CommandDialog({
  open,
  onClose,
  items,
  placeholder = 'Search commands…',
  className,
}: CommandDialogProps) {
  const [query, setQuery] = useState('')
  const [activeIdx, setActiveIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(
    () => items.filter(i => i.label.toLowerCase().includes(query.toLowerCase())),
    [items, query],
  )

  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIdx(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    setActiveIdx(0)
    listRef.current?.scrollTo(0, 0)
  }, [query])

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (!open) return
    if (e.key === 'Escape') { onClose(); return }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(i => Math.min(i + 1, filtered.length - 1))
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(i => Math.max(i - 1, 0))
      return
    }
    if (e.key === 'Enter' && filtered[activeIdx]) {
      e.preventDefault()
      filtered[activeIdx].onSelect()
      onClose()
    }
  }, [open, filtered, activeIdx, onClose])

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  useEffect(() => {
    const el = listRef.current?.children[activeIdx] as HTMLElement | undefined
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeIdx])

  if (!open) return null

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    background: 'rgba(15,12,10,0.55)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: '15vh',
  }

  const cmdIcon = <Command size={14} style={{ marginRight: 2 }} />

  return createPortal(
    <div style={overlayStyle} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className={cn('w-full relative', className)} style={{ maxWidth: 540, margin: '0 16px' }}>
        <SketchBorder fill="#fffdf9" stroke="#3a3733" strokeWidth={1.8} shadow={12} radius={10} roughness={1.2} bleed={6} />
        <div className="relative z-[1]">
          {/* Search input */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 16px',
            borderBottom: '1px solid #e8e3d8',
          }}>
            <Search size={18} style={{ color: '#9c9484', flexShrink: 0 }} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={placeholder}
              aria-label="Search commands"
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontFamily: "'Kalam', cursive",
                fontSize: 15,
                color: '#3a3733',
              }}
            />
            <kbd style={{
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              fontSize: 11,
              color: '#9c9484',
              fontFamily: 'monospace',
              border: '1px solid #d4cfc2',
              borderRadius: 4,
              padding: '2px 6px',
              flexShrink: 0,
            }}>
              {cmdIcon}K
            </kbd>
          </div>

          {/* Items */}
          <div ref={listRef} role="listbox" style={{
            maxHeight: 320,
            overflowY: 'auto',
            padding: '8px',
          }}>
            {filtered.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '24px 16px',
                fontFamily: "'Kalam', cursive",
                fontSize: 14,
                color: '#9c9484',
              }}>
                No results
              </div>
            )}
            {filtered.map((item, i) => (
              <button
                key={item.id}
                role="option"
                aria-selected={i === activeIdx}
                onClick={() => { item.onSelect(); onClose() }}
                onMouseEnter={() => setActiveIdx(i)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '10px 14px',
                  border: 'none',
                  borderRadius: 6,
                  background: i === activeIdx ? '#f0ede6' : 'transparent',
                  cursor: 'pointer',
                  fontFamily: "'Kalam', cursive",
                  fontSize: 14,
                  color: '#3a3733',
                  textAlign: 'left',
                  transition: 'background 0.1s',
                }}
              >
                {item.icon && <span style={{ flexShrink: 0, display: 'flex' }}>{item.icon}</span>}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
