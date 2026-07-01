import { toast } from 'sonner'
import { useNavigate } from 'react-router'
import { Trash2, Download, NotebookText, ExternalLink } from 'lucide-react'
import { api } from '../../lib/api'
import { SketchBorder } from '@/paper-ui/core'
import { PaperTooltip, PaperPopover } from '@/paper-ui/components/dialogs'

export interface ExcalidrawFooterProps {
  apiRef: React.MutableRefObject<any>
}

export function ExcalidrawFooter({ apiRef }: ExcalidrawFooterProps) {
  const navigate = useNavigate()

  const handleClear = () => {
    if (!confirm('Clear the scratchpad?')) return
    apiRef.current?.resetScene()
    try { localStorage.removeItem('scholar_scratchpad_excalidraw') } catch {}
  }

  const getElements = () => apiRef.current?.getSceneElements?.() ?? []

  const handleExportPNG = async () => {
    const elements = getElements()
    if (!elements.length) { toast.error('Nothing to export'); return }
    try {
      const { exportToBlob } = await import('@excalidraw/excalidraw')
      const blob = await exportToBlob({
        elements,
        appState: { exportBackground: true, viewBackgroundColor: '#ffffff' },
        files: apiRef.current?.getFiles() ?? null,
        mimeType: 'image/png',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = 'scratchpad.png'; a.click()
      URL.revokeObjectURL(url)
    } catch { toast.error('Export failed') }
  }

  const handleExportSVG = async () => {
    const elements = getElements()
    if (!elements.length) { toast.error('Nothing to export'); return }
    try {
      const { exportToSvg } = await import('@excalidraw/excalidraw')
      const svg = await exportToSvg({
        elements,
        appState: { exportBackground: true, viewBackgroundColor: '#ffffff' },
        files: apiRef.current?.getFiles() ?? null,
      })
      const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = 'scratchpad.svg'; a.click()
      URL.revokeObjectURL(url)
    } catch { toast.error('Export failed') }
  }

  const handleMoveToNotebook = async () => {
    const elements = getElements()
    if (!elements.length) { toast.error('Nothing to move'); return }
    try {
      const { exportToBlob } = await import('@excalidraw/excalidraw')
      const blob = await exportToBlob({
        elements,
        appState: { exportBackground: true, viewBackgroundColor: '#ffffff' },
        files: apiRef.current?.getFiles() ?? null,
        mimeType: 'image/png',
      })
      const dataUrl = URL.createObjectURL(blob)
      const notebooks = await api.listNotebooks()
      if (notebooks.length === 0) { toast.error('No notebooks found. Create one first.'); return }
      const nb = notebooks[0]
      const current = await api.getNotebook(nb.id)
      const imageBlock = { type: 'image' as const, url: dataUrl, alt: 'Scratchpad snapshot' }
      const updatedBlocks = [...(current.blocks ?? []), imageBlock]
      await api.updateNotebook(nb.id, { blocks: updatedBlocks })
      toast.success(`Added to "${nb.name}"`)
    } catch { toast.error('Failed to move to notebook') }
  }

  const handleOpenFullEditor = async () => {
    const elements = getElements()
    if (!elements.length) { toast.error('Nothing to open'); return }
    try {
      const files = apiRef.current?.getFiles() ?? {}
      const appState = apiRef.current?.getAppState() ?? {}
      const scene = { elements, files, appState: { viewBackgroundColor: appState?.viewBackgroundColor ?? '#ffffff' } }
      const wb = await api.createWhiteboard({ title: 'From Scratchpad', scene })
      navigate(`/whiteboards/${wb.id}`)
    } catch { toast.error('Failed to open in full editor') }
  }

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
      <div className="relative z-[1] flex items-center justify-center gap-2 px-3 py-1.5">
        <PaperTooltip content="Clear scratchpad">
          <button
            onClick={handleClear}
            className="relative inline-flex items-center gap-1 rounded px-2 py-1 font-architect text-[12px] text-ink-muted hover:text-ink transition-colors"
          >
            <Trash2 size={12} />
            Clear
          </button>
        </PaperTooltip>
        <div className="w-px h-4 bg-[#e8e3d8]" />
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
              onClick={handleExportPNG}
            >
              Export PNG
            </button>
            <button
              className="flex w-full items-center gap-2 px-2 py-1.5 font-architect text-[13px] text-ink hover:bg-black/[0.04] rounded transition-colors text-left"
              onClick={handleExportSVG}
            >
              Export SVG
            </button>
          </div>
        </PaperPopover>
        <PaperTooltip content="Move to notebook">
          <button
            onClick={handleMoveToNotebook}
            className="relative inline-flex items-center gap-1 rounded px-2 py-1 font-architect text-[12px] text-ink-muted hover:text-ink transition-colors"
          >
            <NotebookText size={12} />
            Move to Notebook
          </button>
        </PaperTooltip>
        <PaperTooltip content="Open in full editor">
          <button
            onClick={handleOpenFullEditor}
            className="relative inline-flex items-center gap-1 rounded px-2 py-1 font-architect text-[12px] text-ink-muted hover:text-ink transition-colors"
          >
            <ExternalLink size={12} />
            Open in Full Editor
          </button>
        </PaperTooltip>
      </div>
    </div>
  )
}
