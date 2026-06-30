import { ChevronUp, ChevronDown, PenLine } from 'lucide-react'
import { useScratchpadStore } from './useScratchpadStore'

export function DrawerHandle() {
  const { drawerState, toggleDrawer } = useScratchpadStore()
  const isOpen = drawerState !== 'collapsed'

  return (
    <div className="flex justify-center">
      <button
        onClick={toggleDrawer}
        className="flex items-center gap-1.5 rounded-t-lg bg-muted border border-b-0 border-border px-4 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        aria-label={isOpen ? 'Close scratchpad' : 'Open scratchpad'}
      >
        <PenLine size={12} />
        <span>Scratchpad</span>
        {isOpen ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
      </button>
    </div>
  )
}
