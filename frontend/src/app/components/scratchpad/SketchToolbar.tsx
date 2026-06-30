import {
  MousePointer2, Hand, Pen, Highlighter, Eraser, Type,
  ArrowRight, Square, Circle, Minus, StickyNote,
} from 'lucide-react'
import { useScratchpadStore } from './useScratchpadStore'
import type { ToolType } from './types'
import { cn } from '../ui/utils'
import { ColorPickerPopover } from './ColorPickerPopover'

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
    <div className="flex flex-col items-center gap-1 py-2 px-1 bg-muted border-r border-border shrink-0 w-10">
      {TOOLS.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          title={label}
          onClick={() => setActiveTool(id)}
          className={cn(
            'w-7 h-7 flex items-center justify-center rounded transition-colors',
            activeTool === id
              ? 'bg-foreground text-background'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent',
          )}
        >
          <Icon size={14} />
        </button>
      ))}
      <div className="flex flex-col items-center gap-1 mt-1">
        <div className="w-5 h-px bg-border mb-0.5" />
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
  )
}
