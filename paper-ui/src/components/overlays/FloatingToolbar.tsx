import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@paper-ui/utils'
import { SketchBorder } from '@paper-ui/core'

export interface FloatingToolbarProps {
  children: React.ReactNode
  containerRef?: React.RefObject<HTMLElement | null>
  className?: string
  offsetX?: number
  offsetY?: number
}

export function FloatingToolbar({
  children,
  containerRef,
  className,
  offsetX = 0,
  offsetY = 8,
}: FloatingToolbarProps) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  const [visible, setVisible] = useState(false)
  const toolbarRef = useRef<HTMLDivElement>(null)

  const handleSelection = useCallback(() => {
    const sel = window.getSelection()
    if (!sel || sel.isCollapsed || !sel.rangeCount) {
      setVisible(false)
      return
    }

    const range = sel.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) {
      setVisible(false)
      return
    }

    const container = containerRef?.current
    if (container && !container.contains(range.commonAncestorContainer)) {
      setVisible(false)
      return
    }

    setPos({
      top: rect.bottom + window.scrollY + offsetY,
      left: rect.left + window.scrollX + rect.width / 2 + offsetX,
    })
    setVisible(true)
  }, [containerRef, offsetX, offsetY])

  useEffect(() => {
    document.addEventListener('mouseup', handleSelection)
    document.addEventListener('keyup', handleSelection)
    return () => {
      document.removeEventListener('mouseup', handleSelection)
      document.removeEventListener('keyup', handleSelection)
    }
  }, [handleSelection])

  useEffect(() => {
    if (!visible || !pos || !toolbarRef.current) return
    const el = toolbarRef.current
    const w = el.offsetWidth
    const vw = window.innerWidth
    let left = pos.left - w / 2
    if (left < 8) left = 8
    if (left + w > vw - 8) left = vw - w - 8
    el.style.left = `${left}px`
  }, [visible, pos])

  if (!visible || !pos) return null

  return createPortal(
    <div
      ref={toolbarRef}
      role="toolbar"
      className={cn('absolute z-50', className)}
      style={{ top: pos.top, left: pos.left }}
    >
      <SketchBorder fill="#fffdf9" stroke="#3a3733" strokeWidth={1.4} shadow={4} roughness={0.8} radius={8} bleed={4} />
      <div className="relative z-[1] flex items-center gap-1 px-2 py-1.5">
        {children}
      </div>
    </div>,
    document.body,
  )
}
