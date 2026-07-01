import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@paper-ui/utils'
import { SketchBorder } from '@paper-ui/core'

export interface HoverCardProps {
  trigger: React.ReactNode
  children: React.ReactNode
  openDelay?: number
  closeDelay?: number
  placement?: 'top' | 'bottom' | 'left' | 'right'
  maxWidth?: number
  className?: string
}

interface Pos {
  top: number
  left: number
}

function computePos(
  rect: DOMRect,
  el: HTMLDivElement,
  placement: HoverCardProps['placement'],
): Pos {
  const gap = 10
  const w = el.offsetWidth
  const h = el.offsetHeight

  switch (placement) {
    case 'top':
      return { top: rect.top + window.scrollY - h - gap, left: rect.left + window.scrollX + rect.width / 2 - w / 2 }
    case 'left':
      return { top: rect.top + window.scrollY + rect.height / 2 - h / 2, left: rect.left + window.scrollX - w - gap }
    case 'right':
      return { top: rect.top + window.scrollY + rect.height / 2 - h / 2, left: rect.right + window.scrollX + gap }
    case 'bottom':
    default:
      return { top: rect.bottom + window.scrollY + gap, left: rect.left + window.scrollX + rect.width / 2 - w / 2 }
  }
}

export function HoverCard({
  trigger,
  children,
  openDelay = 400,
  closeDelay = 200,
  placement = 'bottom',
  maxWidth = 300,
  className,
}: HoverCardProps) {
  const triggerRef = useRef<HTMLSpanElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<Pos | null>(null)

  const clearTimers = () => {
    if (openTimer.current) clearTimeout(openTimer.current)
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }

  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    openTimer.current = setTimeout(() => {
      setOpen(true)
    }, openDelay)
  }

  const handleMouseLeave = () => {
    if (openTimer.current) clearTimeout(openTimer.current)
    closeTimer.current = setTimeout(() => {
      setOpen(false)
    }, closeDelay)
  }

  useEffect(() => {
    if (!open) return
    const rect = triggerRef.current?.getBoundingClientRect()
    const el = cardRef.current
    if (rect && el) {
      setPos(computePos(rect, el, placement))
    }
  }, [open, placement])

  useEffect(() => () => clearTimers(), [])

  return (
    <>
      <span
        ref={triggerRef}
        className="inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {trigger}
      </span>
      {open && createPortal(
        <div
          ref={cardRef}
          className={cn('absolute z-50 p-3', className)}
          style={{ top: pos?.top ?? -9999, left: pos?.left ?? -9999, maxWidth }}
          onMouseEnter={() => { if (closeTimer.current) clearTimeout(closeTimer.current) }}
          onMouseLeave={handleMouseLeave}
        >
          <div className="relative">
            <SketchBorder fill="#fffdf9" stroke="#3a3733" strokeWidth={1.6} shadow={6} roughness={1.0} radius={8} bleed={6} />
            <div className="relative z-[1] px-4 py-3 font-kalam text-[14px] text-ink">
              {children}
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
