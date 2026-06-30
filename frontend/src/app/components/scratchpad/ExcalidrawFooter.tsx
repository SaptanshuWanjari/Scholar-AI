import { toast } from 'sonner'
import { useNavigate } from 'react-router'
import { Trash2, Download, NotebookText, ExternalLink } from 'lucide-react'
import { api } from '../../lib/api'

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
    <div className="flex items-center justify-center gap-2 border-t border-border bg-card px-3 py-1.5 shrink-0">
      <button
        onClick={handleClear}
        className="flex items-center gap-1 rounded px-2 py-1 text-xs hover:bg-muted text-muted-foreground hover:text-foreground"
      >
        <Trash2 size={12} />
        Clear
      </button>
      <div className="w-px h-4 bg-border" />
      <div className="relative group">
        <button className="flex items-center gap-1 rounded px-2 py-1 text-xs hover:bg-muted text-muted-foreground hover:text-foreground">
          <Download size={12} />
          Export
        </button>
        <div className="absolute bottom-full right-0 mb-1 hidden group-hover:flex flex-col bg-popover border border-border rounded shadow-md text-xs z-50 min-w-[100px]">
          <button className="px-3 py-2 hover:bg-muted text-left" onClick={handleExportPNG}>Export PNG</button>
          <button className="px-3 py-2 hover:bg-muted text-left" onClick={handleExportSVG}>Export SVG</button>
        </div>
      </div>
      <button
        onClick={handleMoveToNotebook}
        className="flex items-center gap-1 rounded px-2 py-1 text-xs hover:bg-muted text-muted-foreground hover:text-foreground"
      >
        <NotebookText size={12} />
        Move to Notebook
      </button>
      <button
        onClick={handleOpenFullEditor}
        className="flex items-center gap-1 rounded px-2 py-1 text-xs hover:bg-muted text-muted-foreground hover:text-foreground"
      >
        <ExternalLink size={12} />
        Open in Full Editor
      </button>
    </div>
  )
}
