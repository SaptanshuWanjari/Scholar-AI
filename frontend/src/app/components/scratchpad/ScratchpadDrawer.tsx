import { useRef, useCallback, Suspense } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Loader2 } from 'lucide-react'
import { useScratchpadStore } from './useScratchpadStore'
import { usePluginStore } from '../../plugins/usePluginStore'
import { DrawerHandle } from './DrawerHandle'
import { DrawerHeader } from './DrawerHeader'
import { DrawerFooter } from './DrawerFooter'
import { ScratchCanvas } from './ScratchCanvas'
import { SketchToolbar } from './SketchToolbar'
import { ScratchpadExcalidraw } from './ScratchpadExcalidraw'
import { PaperSheetBorder } from '@/paper-ui/core'

const MEDIUM_VH = 0.4
const EXPANDED_VH = 0.75
const SNAP_THRESHOLD = 0.1

const SPINNER = (
  <div className="flex h-full w-full items-center justify-center">
    <Loader2 className="size-5 animate-spin text-ink-muted" />
  </div>
)

export function ScratchpadDrawer() {
  const { drawerState, drawerHeight, setDrawerHeight, setDrawerState } = useScratchpadStore()
  const isExcalidrawInstalled = usePluginStore((s) => s.isInstalled("excalidraw"))
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
      <div className="pointer-events-auto relative z-50">
        <DrawerHandle />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="scratchpad-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: panelHeight, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            className="pointer-events-auto relative flex flex-col overflow-hidden"
            style={{ height: panelHeight }}
          >
            <PaperSheetBorder
              fill="#fffdf9"
              stroke="#3a3733"
              strokeWidth={1.8}
              shadow={4}
              fold={false}
              attachedBottom={true}
            />
            <div className="relative z-[1] flex flex-col h-full pt-[2.2vw]">
              <div
                className="absolute top-[1.8vw] left-0 right-0 h-4 cursor-ns-resize bg-transparent hover:bg-[#c0b9ae]/30 z-10"
                onMouseDown={onDragStart}
              />
              <DrawerHeader />
              {isExcalidrawInstalled ? (
                <Suspense fallback={SPINNER}>
                  <ScratchpadExcalidraw />
                </Suspense>
              ) : (
                <>
                  <div className="flex flex-1 min-h-0">
                    <SketchToolbar />
                    <ScratchCanvas stageRef={stageRef} />
                  </div>
                  <DrawerFooter stageRef={stageRef} />
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
