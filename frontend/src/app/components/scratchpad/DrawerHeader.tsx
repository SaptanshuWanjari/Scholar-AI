import { X } from 'lucide-react'
import { useScratchpadStore } from './useScratchpadStore'
import { PaperBadge } from '@/paper-ui/components/badges'
import { IconButton } from '@/paper-ui/components/buttons'

export function DrawerHeader() {
  const { setDrawerState, isDirty, lastSaved } = useScratchpadStore()

  const savedLabel = lastSaved
    ? `Autosaved • ${new Date(lastSaved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    : isDirty
    ? 'Saving...'
    : 'Autosaved'

  return (
    <div className="flex items-center justify-between border-b border-[#e8e3d8] px-6 py-3 shrink-0">
      <div className="flex items-center gap-3">
        <span className="font-architect text-[13px] tracking-widest text-ink uppercase">
          Scratch Pad
        </span>
        <PaperBadge tone="ink">{savedLabel}</PaperBadge>
      </div>
      <IconButton label="Close scratchpad" onClick={() => setDrawerState('collapsed')}>
        <X size={14} />
      </IconButton>
    </div>
  )
}
