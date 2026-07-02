import React from 'react'
import { Minus, Plus, Maximize2, RotateCcw, RotateCw, Trash2, Download } from 'lucide-react'
import { toSvg } from 'html-to-image'
import { useNavigate } from 'react-router'
import { toast } from "@/app/lib/toast"
import { api } from '../../lib/api'
import { useScratchpadStore } from './useScratchpadStore'
import { SketchBorder } from '@/paper-ui/core'
import { PaperTooltip } from '@/paper-ui/components/dialogs'
import { PaperPopover } from '@/paper-ui/components/dialogs'

export function DrawerFooter({ stageRef }: { stageRef: React.RefObject<any> }) {
  const { viewport, setViewport, undo, redo, undoStack, redoStack, clearCanvas } = useScratchpadStore()
  const navigate = useNavigate()

  const zoom = Math.round(viewport.scale * 100)

  const zoomTo = (scale: number) =>
    setViewport({ ...viewport, scale: Math.max(0.1, Math.min(5, scale)) })

  return (
    <div className="relative shrink-0">
      <SketchBorder
        fill="#fffdf9"
        stroke="#3a3733"
        strokeWidth={1.4}
        radius={0}
        roughness={1.0}
        shadow={0}
        bleed={4}
      />
      <div className="relative z-[1] flex items-center justify-between px-3 py-1.5">
        {/* Left: zoom */}
        <div className="flex items-center gap-1">
          <PaperTooltip content="Zoom out">
            <button
              onClick={() => zoomTo(viewport.scale - 0.1)}
              className="relative inline-flex h-7 w-7 items-center justify-center text-ink-muted hover:text-ink transition-colors"
              aria-label="Zoom out"
            >
              <Minus size={13} />
            </button>
          </PaperTooltip>
          <button
            onClick={() => zoomTo(1)}
            className="font-architect text-[12px] text-ink-muted hover:text-ink px-1 min-w-[42px] text-center"
            aria-label="Reset zoom"
          >
            {zoom}%
          </button>
          <PaperTooltip content="Zoom in">
            <button
              onClick={() => zoomTo(viewport.scale + 0.1)}
              className="relative inline-flex h-7 w-7 items-center justify-center text-ink-muted hover:text-ink transition-colors"
              aria-label="Zoom in"
            >
              <Plus size={13} />
            </button>
          </PaperTooltip>
          <PaperTooltip content="Fit to screen">
            <button
              className="relative inline-flex h-7 w-7 items-center justify-center text-ink-muted hover:text-ink transition-colors ml-1"
              aria-label="Fit to screen"
              onClick={() => setViewport({ x: 0, y: 0, scale: 1 })}
            >
              <Maximize2 size={13} />
            </button>
          </PaperTooltip>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1">
          <PaperTooltip content={undoStack.length > 0 ? 'Undo (Ctrl+Z)' : 'Nothing to undo'}>
            <button
              onClick={undo}
              disabled={undoStack.length === 0}
              className="relative inline-flex items-center gap-1 rounded px-2 py-1 font-architect text-[12px] text-ink-muted hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <RotateCcw size={12} />
              Undo
            </button>
          </PaperTooltip>
          <PaperTooltip content={redoStack.length > 0 ? 'Redo (Ctrl+Shift+Z)' : 'Nothing to redo'}>
            <button
              onClick={redo}
              disabled={redoStack.length === 0}
              className="relative inline-flex items-center gap-1 rounded px-2 py-1 font-architect text-[12px] text-ink-muted hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <RotateCw size={12} />
              Redo
            </button>
          </PaperTooltip>
          <div className="w-px h-4 bg-[#e8e3d8] mx-1" />
          <PaperTooltip content="Clear scratchpad">
            <button
              onClick={() => { if (confirm('Clear the scratchpad?')) clearCanvas() }}
              className="relative inline-flex items-center gap-1 rounded px-2 py-1 font-architect text-[12px] text-ink-muted hover:text-ink transition-colors"
            >
              <Trash2 size={12} />
              Clear
            </button>
          </PaperTooltip>
          <PaperPopover
            placement="top"
            trigger={
              <button className="relative inline-flex items-center gap-1 rounded px-2 py-1 font-architect text-[12px] text-ink-muted hover:text-ink transition-colors">
                <Download size={12} />
                Export
              </button>
            }
          >
            <div className="flex flex-col gap-0.5 min-w-[120px]">
              <button
                className="flex w-full items-center gap-2 px-2 py-1.5 font-architect text-[13px] text-ink hover:bg-black/[0.04] rounded transition-colors text-left"
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
                className="flex w-full items-center gap-2 px-2 py-1.5 font-architect text-[13px] text-ink hover:bg-black/[0.04] rounded transition-colors text-left"
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
          </PaperPopover>
          <div className="w-px h-4 bg-[#e8e3d8] mx-1" />
          <PaperTooltip content="Move canvas snapshot to notebook">
            <button
              className="relative inline-flex items-center gap-1 rounded px-2 py-1 font-architect text-[12px] text-ink-muted hover:text-ink transition-colors"
              onClick={async () => {
                const stage = stageRef.current
                if (!stage) return
                try {
                  const canvas = stage.toCanvas()
                  const dataUrl = canvas.toDataURL('image/png')
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
          </PaperTooltip>
          <PaperTooltip content="Open in Excalidraw editor">
            <button
              className="relative inline-flex items-center gap-1 rounded px-2 py-1 font-architect text-[12px] text-ink-muted hover:text-ink transition-colors"
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
          </PaperTooltip>
        </div>
      </div>
    </div>
  )
}
