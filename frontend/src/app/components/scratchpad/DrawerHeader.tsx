import { X } from 'lucide-react'
import { useScratchpadStore } from './useScratchpadStore'

export function DrawerHeader() {
  const { setDrawerState, isDirty, lastSaved } = useScratchpadStore()

  const savedLabel = lastSaved
    ? `Autosaved • ${new Date(lastSaved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    : isDirty
    ? 'Saving...'
    : 'Autosaved'

  return (
    <div className="flex items-center justify-between border-b border-border px-3 py-2 shrink-0">
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold tracking-widest text-foreground uppercase">
          Scratch Pad
        </span>
        <span className="text-xs text-muted-foreground">{savedLabel}</span>
      </div>
      <button
        onClick={() => setDrawerState('collapsed')}
        className="rounded p-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Close scratchpad"
      >
        <X size={14} />
      </button>
    </div>
  )
}
