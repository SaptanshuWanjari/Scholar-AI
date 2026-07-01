import { ChevronUp, ChevronDown, PenLine } from 'lucide-react'
import { useScratchpadStore } from './useScratchpadStore'
import { SketchBorder } from '@/paper-ui/core'

export function DrawerHandle() {
  const { drawerState, toggleDrawer } = useScratchpadStore()
  const isOpen = drawerState !== 'collapsed'

  return (
    <div className={`flex justify-center transition-transform duration-300 ${isOpen ? 'translate-y-[2.4vw]' : ''}`}>
      <button
        onClick={toggleDrawer}
        className="relative flex items-center gap-1.5 px-4 py-1.5 text-xs font-architect text-ink-muted hover:text-ink transition-colors"
        aria-label={isOpen ? 'Close scratchpad' : 'Open scratchpad'}
      >
        <SketchBorder
          fill="#fffdf9"
          stroke="#3a3733"
          strokeWidth={1.4}
          radius={0}
          roughness={1.0}
          shadow={2}
          bleed={6}
        />
        <span className="relative z-[1] flex items-center gap-1.5">
          <PenLine size={12} />
          <span>Scratchpad</span>
          {isOpen ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
        </span>
      </button>
    </div>
  )
}
