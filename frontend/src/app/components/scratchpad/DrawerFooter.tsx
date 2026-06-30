import React from 'react'
import { Minus, Plus, Maximize2, RotateCcw, RotateCw, Trash2, Download } from 'lucide-react'
import { toSvg } from 'html-to-image'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { api } from '../../lib/api'
import { useScratchpadStore } from './useScratchpadStore'

export function DrawerFooter({ stageRef }: { stageRef: React.RefObject<any> }) {
  const { viewport, setViewport, undo, redo, undoStack, redoStack, clearCanvas } = useScratchpadStore()
  const navigate = useNavigate()

  const zoom = Math.round(viewport.scale * 100)

  const zoomTo = (scale: number) =>
    setViewport({ ...viewport, scale: Math.max(0.1, Math.min(5, scale)) })

  return (
    <div className="flex items-center justify-between border-t border-border bg-card px-3 py-1.5 shrink-0">
      {/* Left: zoom */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => zoomTo(viewport.scale - 0.1)}
          className="rounded p-1 hover:bg-muted text-muted-foreground hover:text-foreground"
          aria-label="Zoom out"
        >
          <Minus size={13} />
        </button>
        <button
          onClick={() => zoomTo(1)}
          className="text-xs text-muted-foreground hover:text-foreground px-1 min-w-[42px] text-center"
          aria-label="Reset zoom"
        >
          {zoom}%
        </button>
        <button
          onClick={() => zoomTo(viewport.scale + 0.1)}
          className="rounded p-1 hover:bg-muted text-muted-foreground hover:text-foreground"
          aria-label="Zoom in"
        >
          <Plus size={13} />
        </button>
        <button
          className="rounded p-1 hover:bg-muted text-muted-foreground hover:text-foreground ml-1"
          aria-label="Fit to screen"
          onClick={() => setViewport({ x: 0, y: 0, scale: 1 })}
        >
          <Maximize2 size={13} />
        </button>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={undo}
          disabled={undoStack.length === 0}
          className="flex items-center gap-1 rounded px-2 py-1 text-xs hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <RotateCcw size={12} />
          Undo
        </button>
        <button
          onClick={redo}
          disabled={redoStack.length === 0}
          className="flex items-center gap-1 rounded px-2 py-1 text-xs hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <RotateCw size={12} />
          Redo
        </button>
        <div className="w-px h-4 bg-border mx-1" />
        <button
          onClick={() => { if (confirm('Clear the scratchpad?')) clearCanvas() }}
          className="flex items-center gap-1 rounded px-2 py-1 text-xs hover:bg-muted text-muted-foreground hover:text-foreground"
        >
          <Trash2 size={12} />
          Clear
        </button>
        <div className="relative group">
          <button
            className="flex items-center gap-1 rounded px-2 py-1 text-xs hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            <Download size={12} />
            Export
          </button>
          <div className="absolute bottom-full right-0 mb-1 hidden group-hover:flex flex-col bg-popover border border-border rounded shadow-md text-xs z-50 min-w-[100px]">
            <button
              className="px-3 py-2 hover:bg-muted text-left"
              onClick={async () => {
                const stage = stageRef.current
                if (!stage) return
                const canvas = stage.toCanvas()
                const url = canvas.toDataURL('image/png')
                const a = document.createElement('a')
                a.href = url
                a.download = 'scratchpad.png'
                a.click()
              }}
            >
              Export PNG
            </button>
            <button
              className="px-3 py-2 hover:bg-muted text-left"
              onClick={async () => {
                const stage = stageRef.current
                if (!stage) return
                const el = stage.content as HTMLElement
                try {
                  const svg = await toSvg(el)
                  const a = document.createElement('a')
                  a.href = svg
                  a.download = 'scratchpad.svg'
                  a.click()
                } catch {
                  toast.error('SVG export failed')
                }
              }}
            >
              Export SVG
            </button>
          </div>
        </div>
        <div className="w-px h-4 bg-border mx-1" />
        <button
          className="rounded px-2 py-1 text-xs hover:bg-muted text-muted-foreground hover:text-foreground"
          onClick={async () => {
            const stage = stageRef.current
            if (!stage) return
            try {
              const canvas = stage.toCanvas()
              const dataUrl = canvas.toDataURL('image/png')
              // List notebooks, pick the first one (or prompt user)
              const notebooks = await api.listNotebooks()
              if (notebooks.length === 0) { toast.error('No notebooks found. Create one first.'); return }
              const nb = notebooks[0]
              const current = await api.getNotebook(nb.id)
              const imageBlock = { type: 'image' as const, url: dataUrl, alt: 'Scratchpad snapshot' }
              const updatedBlocks = [...(current.blocks ?? []), imageBlock]
              await api.updateNotebook(nb.id, { blocks: updatedBlocks })
              toast.success(`Added to "${nb.name}"`)
            } catch {
              toast.error('Failed to move to notebook')
            }
          }}
        >
          Move to Notebook
        </button>
        <button
          className="rounded px-2 py-1 text-xs hover:bg-muted text-muted-foreground hover:text-foreground"
          onClick={async () => {
            const stage = stageRef.current
            if (!stage) return
            try {
              const canvas = stage.toCanvas()
              const dataUrl = canvas.toDataURL('image/png')
              const fileId = crypto.randomUUID().replace(/-/g, '')
              const scene = {
                elements: [
                  {
                    id: crypto.randomUUID(),
                    type: 'image',
                    x: 0, y: 0,
                    width: canvas.width,
                    height: canvas.height,
                    fileId,
                    status: 'saved',
                    scale: [1, 1],
                    isDeleted: false,
                    version: 1,
                    versionNonce: 0,
                    updated: Date.now(),
                    angle: 0,
                    opacity: 100,
                    strokeColor: '#000000',
                    backgroundColor: 'transparent',
                    fillStyle: 'solid',
                    strokeWidth: 1,
                    strokeStyle: 'solid',
                    roughness: 0,
                    seed: 1,
                    groupIds: [],
                    frameId: null,
                    roundness: null,
                    boundElements: null,
                    link: null,
                    locked: false,
                  }
                ],
                files: {
                  [fileId]: {
                    id: fileId,
                    dataURL: dataUrl,
                    mimeType: 'image/png',
                    created: Date.now(),
                  }
                },
                appState: { viewBackgroundColor: '#ffffff' },
              }
              const wb = await api.createWhiteboard({ title: 'From Scratchpad', scene })
              navigate(`/whiteboards/${wb.id}`)
              toast.success('Opened in Excalidraw')
            } catch {
              toast.error('Failed to open in Excalidraw')
            }
          }}
        >
          Open in Excalidraw
        </button>
      </div>
    </div>
  )
}
