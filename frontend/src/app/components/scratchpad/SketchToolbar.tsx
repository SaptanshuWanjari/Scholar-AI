import {
  MousePointer2, Hand, Pen, Highlighter, Eraser, Type,
  ArrowRight, Square, Circle, Minus, StickyNote,
} from 'lucide-react'
import { useScratchpadStore } from './useScratchpadStore'
import type { ToolType } from './types'
import { cn } from '@/paper-ui/utils'
import { ColorPickerPopover } from './ColorPickerPopover'
import { SketchBorder } from '@/paper-ui/core'
import { PaperTooltip } from '@/paper-ui/components/dialogs'

const TOOLS: { id: ToolType; icon: React.ElementType; label: string; key: string }[] = [
  { id: 'select',      icon: MousePointer2, label: 'Select (V)',      key: 'V' },
  { id: 'pan',         icon: Hand,          label: 'Pan (drag)',      key: '' },
  { id: 'pen',         icon: Pen,           label: 'Pen (P)',         key: 'P' },
  { id: 'highlighter', icon: Highlighter,   label: 'Highlighter (H)', key: 'H' },
  { id: 'eraser',      icon: Eraser,        label: 'Eraser (E)',      key: 'E' },
  { id: 'text',        icon: Type,          label: 'Text (T)',        key: 'T' },
  { id: 'arrow',       icon: ArrowRight,    label: 'Arrow (A)',       key: 'A' },
  { id: 'rect',        icon: Square,        label: 'Rectangle (R)',   key: 'R' },
  { id: 'circle',      icon: Circle,        label: 'Circle (O)',      key: 'O' },
  { id: 'line',        icon: Minus,         label: 'Line (L)',        key: 'L' },
  { id: 'sticky',      icon: StickyNote,    label: 'Sticky Note',     key: '' },
]

export function SketchToolbar() {
  const { activeTool, setActiveTool, activeColor, activeFill, setActiveColor, setActiveFill } = useScratchpadStore()

  return (
    <div className="relative shrink-0 max-h-full flex flex-col">
      <SketchBorder
        fill="#fffdf9"
        stroke="#3a3733"
        strokeWidth={1.4}
        radius={0}
        roughness={1.0}
        shadow={0}
        bleed={4}
      />
      <div className="relative z-[1] flex flex-col items-center gap-1 py-2 px-1.5 w-11 overflow-y-auto overflow-x-hidden scrollbar-none">
        {TOOLS.map(({ id, icon: Icon, label }) => (
          <PaperTooltip key={id} content={label} placement="right" delay={600}>
            <button
              title={label}
              onClick={() => setActiveTool(id)}
              className={cn(
                'relative w-7 h-7 flex items-center justify-center',
                activeTool === id ? 'text-[#fbf8f2]' : 'text-ink-muted hover:text-ink',
              )}
            >
              {activeTool === id && (
                <SketchBorder
                  fill="#262320"
                  stroke="#262320"
                  strokeWidth={1.2}
                  radius={4}
                  roughness={0.8}
                  shadow={0}
                  bleed={4}
                />
              )}
              <span className={cn('relative z-[1]', activeTool === id ? 'text-[#fbf8f2]' : '')}>
                <Icon size={14} />
              </span>
            </button>
          </PaperTooltip>
        ))}
        <div className="flex flex-col items-center gap-1 mt-1">
          <div className="w-5 h-px bg-[#e8e3d8] mb-0.5" />
          <ColorPickerPopover
            color={activeColor}
            onChange={setActiveColor}
            label="S"
          />
          <ColorPickerPopover
            color={activeFill}
            onChange={setActiveFill}
            allowNone
            label="F"
          />
        </div>
      </div>
    </div>
  )
}
