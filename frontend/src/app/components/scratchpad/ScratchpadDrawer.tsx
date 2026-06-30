import { useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useScratchpadStore } from './useScratchpadStore'
import { DrawerHandle } from './DrawerHandle'
import { DrawerHeader } from './DrawerHeader'
import { DrawerFooter } from './DrawerFooter'
import { ScratchCanvas } from './ScratchCanvas'
import { SketchToolbar } from './SketchToolbar'

const MEDIUM_VH = 0.4
const EXPANDED_VH = 0.75
const SNAP_THRESHOLD = 0.1

export function ScratchpadDrawer() {
  const { drawerState, drawerHeight, setDrawerHeight, setDrawerState } = useScratchpadStore()
  const stageRef = useRef<any>(null)
  const dragStartY = useRef<number | null>(null)
  const dragStartH = useRef<number>(0)

  const isOpen = drawerState !== 'collapsed'

  const panelHeight = drawerState === 'expanded'
    ? Math.round(window.innerHeight * EXPANDED_VH)
    : drawerHeight

  const onDragStart = useCallback((e: React.MouseEvent) => {
    dragStartY.current = e.clientY
    dragStartH.current = panelHeight

    const onMove = (ev: MouseEvent) => {
      if (dragStartY.current === null) return
      const delta = dragStartY.current - ev.clientY
      const newH = Math.max(120, Math.min(window.innerHeight * 0.9, dragStartH.current + delta))
      setDrawerHeight(newH)
    }

    const onUp = (ev: MouseEvent) => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      const h = dragStartH.current + (dragStartY.current! - ev.clientY)
      const medH = window.innerHeight * MEDIUM_VH
      const expH = window.innerHeight * EXPANDED_VH
      if (Math.abs(h - expH) / expH < SNAP_THRESHOLD) {
        setDrawerState('expanded')
      } else if (Math.abs(h - medH) / medH < SNAP_THRESHOLD) {
        setDrawerState('medium')
      }
      dragStartY.current = null
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }, [panelHeight, setDrawerHeight, setDrawerState])

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none"
      style={{ userSelect: 'none' }}
    >
      {/* Handle always visible */}
      <div className="pointer-events-auto">
        <DrawerHandle />
      </div>

      {/* Animated panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="scratchpad-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: panelHeight, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            className="pointer-events-auto bg-card border-t border-border flex flex-col overflow-hidden"
            style={{ height: panelHeight }}
          >
            {/* Drag resize handle */}
            <div
              className="h-1 w-full cursor-ns-resize bg-transparent hover:bg-border/50 shrink-0"
              onMouseDown={onDragStart}
            />
            <DrawerHeader />
            {/* Body: toolbar + canvas placeholder */}
            <div className="flex flex-1 min-h-0">
              <SketchToolbar />
              {/* Canvas area */}
              <ScratchCanvas stageRef={stageRef} />
            </div>
            <DrawerFooter stageRef={stageRef} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
