import { useRef, useEffect, useCallback, useState } from 'react'
import { Stage, Layer, Transformer } from 'react-konva'
import { useScratchpadStore } from './useScratchpadStore'
import { RenderStroke, RenderHighlight } from './renderers/renderStroke'
import { RenderRect, RenderCircle, RenderLine } from './renderers/renderShape'
import { RenderArrow } from './renderers/renderArrow'
import { RenderText } from './renderers/renderText'
import { RenderSticky } from './renderers/renderSticky'
import { penTool, highlighterTool, shapesTool, textTool, eraserTool, selectTool } from './tools'
import type { SceneObject, ToolType } from './types'

const TOOL_CURSORS: Record<string, string> = {
  select: 'default',
  pan: 'grab',
  pen: 'crosshair',
  highlighter: 'crosshair',
  eraser: 'cell',
  text: 'text',
  arrow: 'crosshair',
  rect: 'crosshair',
  circle: 'crosshair',
  line: 'crosshair',
  sticky: 'copy',
}

function findNodeId(target: any): string | null {
  const stage = target.getStage?.()
  let node = target
  while (node && node !== stage) {
    const id = node.id?.()
    if (id) return id
    node = node.parent
  }
  return null
}

function renderObject(obj: SceneObject) {
  switch (obj.type) {
    case 'stroke':    return <RenderStroke key={obj.id} obj={obj} />
    case 'highlight': return <RenderHighlight key={obj.id} obj={obj} />
    case 'rect':      return <RenderRect key={obj.id} obj={obj} />
    case 'circle':    return <RenderCircle key={obj.id} obj={obj} />
    case 'line':      return <RenderLine key={obj.id} obj={obj} />
    case 'arrow':     return <RenderArrow key={obj.id} obj={obj} />
    case 'text':      return <RenderText key={obj.id} obj={obj} />
    case 'sticky':    return <RenderSticky key={obj.id} obj={obj} />
    default:          return null
  }
}

export function ScratchCanvas({ stageRef }: { stageRef: React.RefObject<any> }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [liveObj, setLiveObj] = useState<SceneObject | null>(null)
  const { objects, viewport, setViewport, selection, activeTool } = useScratchpadStore()
  const isPanning = useRef(false)
  const panStart = useRef({ x: 0, y: 0, vx: 0, vy: 0 })
  const spaceHeld = useRef(false)
  const transformerRef = useRef<any>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; id: string } | null>(null)
  const isDraggingSelect = useRef(false)

  // Measure container
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      setSize({ w: el.offsetWidth, h: el.offsetHeight })
    })
    ro.observe(el)
    setSize({ w: el.offsetWidth, h: el.offsetHeight })
    return () => ro.disconnect()
  }, [])

  // Space key for pan mode
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && document.activeElement?.closest('#scratchpad-canvas-container')) {
        spaceHeld.current = true
        if (containerRef.current) containerRef.current.style.cursor = 'grab'
        e.preventDefault()
      }
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        spaceHeld.current = false
        const tool = useScratchpadStore.getState().activeTool
        if (containerRef.current) containerRef.current.style.cursor = TOOL_CURSORS[tool] ?? 'crosshair'
      }
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('keyup', onKeyUp)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  // Tool + edit keyboard shortcuts
  useEffect(() => {
    const TOOL_KEYS: Record<string, ToolType> = {
      v: 'select', p: 'pen', h: 'highlighter',
      e: 'eraser', t: 'text', a: 'arrow',
      r: 'rect',   o: 'circle', l: 'line',
    }

    const onKey = (ev: KeyboardEvent) => {
      // Only fire when canvas is focused
      if (!document.activeElement?.closest('#scratchpad-canvas-container')) return

      const store = useScratchpadStore.getState()
      const key = ev.key.toLowerCase()

      if (ev.ctrlKey && ev.key === 'z') { ev.preventDefault(); store.undo(); return }
      if (ev.ctrlKey && ev.shiftKey && ev.key === 'Z') { ev.preventDefault(); store.redo(); return }
      if (ev.key === 'Delete' || ev.key === 'Backspace') {
        ev.preventDefault()
        if (store.selection.length > 0) { store.pushHistory(); store.removeObjects(store.selection) }
        return
      }
      if (ev.ctrlKey && ev.key === 'c') {
        // Copy: store selection to clipboard state
        const selected = store.objects.filter((o) => store.selection.includes(o.id))
        ;(window as any).__scratchCopied = selected
        return
      }
      if (ev.ctrlKey && ev.key === 'v') {
        const copied: any[] = (window as any).__scratchCopied ?? []
        if (copied.length === 0) return
        store.pushHistory()
        copied.forEach((obj) => {
          const newObj = { ...obj, id: crypto.randomUUID() } as any
          if ('x' in newObj) { newObj.x += 16; newObj.y += 16 }
          store.addObject(newObj)
        })
        return
      }

      if (!ev.ctrlKey && !ev.metaKey && !ev.altKey && TOOL_KEYS[key]) {
        ev.preventDefault()
        store.setActiveTool(TOOL_KEYS[key])
      }
    }

    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const TRANSFORMABLE = ['rect', 'circle', 'text', 'sticky']

  useEffect(() => {
    if (!transformerRef.current || !stageRef.current) return
    const tr = transformerRef.current
    if (selection.length === 1) {
      const obj = objects.find((o) => o.id === selection[0])
      if (obj && TRANSFORMABLE.includes(obj.type)) {
        const node = stageRef.current.findOne('#' + selection[0])
        if (node) {
          tr.nodes([node])
          tr.getLayer()?.batchDraw()
          return
        }
      }
    }
    tr.nodes([])
    tr.getLayer()?.batchDraw()
  }, [selection, objects])

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const scaleBy = 1.08
    const stage = stageRef.current
    if (!stage) return
    const pointer = stage.getPointerPosition()
    if (!pointer) return
    const oldScale = viewport.scale
    const newScale = e.deltaY < 0
      ? Math.min(oldScale * scaleBy, 5)
      : Math.max(oldScale / scaleBy, 0.1)
    const mousePointTo = {
      x: (pointer.x - viewport.x) / oldScale,
      y: (pointer.y - viewport.y) / oldScale,
    }
    setViewport({
      scale: newScale,
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    })
  }, [viewport, setViewport, stageRef])

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const store = useScratchpadStore.getState()
    if (spaceHeld.current || store.activeTool === 'pan') {
      isPanning.current = true
      panStart.current = { x: e.clientX, y: e.clientY, vx: viewport.x, vy: viewport.y }
    }
  }, [viewport])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning.current) return
    const dx = e.clientX - panStart.current.x
    const dy = e.clientY - panStart.current.y
    setViewport({ ...viewport, x: panStart.current.vx + dx, y: panStart.current.vy + dy })
  }, [viewport, setViewport])

  const onMouseUp = useCallback(() => {
    isPanning.current = false
  }, [])

  const commitTextEdit = useCallback(() => {
    if (!editingId || !textareaRef.current) return
    const value = textareaRef.current.value.trim()
    const store = useScratchpadStore.getState()
    const obj = store.objects.find((o) => o.id === editingId)
    if (value) {
      store.updateObject(editingId, { content: value } as any)
    } else if (obj?.type === 'text') {
      store.removeObjects([editingId])
    }
    setEditingId(null)
  }, [editingId])

  useEffect(() => {
    if (!editingId || !stageRef.current || !textareaRef.current) return
    const stage = stageRef.current
    const node = stage.findOne('#' + editingId)
    if (!node) return
    const obj = useScratchpadStore.getState().objects.find((o) => o.id === editingId)
    if (!obj || (obj.type !== 'text' && obj.type !== 'sticky')) return

    const absPos = node.getAbsolutePosition()
    const scale = viewport.scale
    const ta = textareaRef.current

    if (obj.type === 'text') {
      ta.style.left = absPos.x + 'px'
      ta.style.top = absPos.y + 'px'
      ta.style.width = ''
      ta.style.height = ''
      ta.style.fontSize = (obj.style.fontSize * scale) + 'px'
      ta.style.fontFamily = obj.style.fontFamily
      ta.style.color = obj.style.fill
    } else {
      ta.style.left = (absPos.x + 8 * scale) + 'px'
      ta.style.top = (absPos.y + 8 * scale) + 'px'
      ta.style.width = ((obj.w - 16) * scale) + 'px'
      ta.style.height = ((obj.h - 16) * scale) + 'px'
      ta.style.fontSize = (13 * scale) + 'px'
      ta.style.fontFamily = 'Inter, sans-serif'
      ta.style.color = '#211f1b'
    }
    ta.value = obj.content
    ta.focus()
    ta.select()
  }, [editingId, viewport.scale])

  return (
    <div
      ref={containerRef}
      id="scratchpad-canvas-container"
      className="w-full h-full overflow-hidden"
      tabIndex={0}
      onWheel={onWheel}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      style={{ cursor: TOOL_CURSORS[activeTool] ?? 'crosshair', outline: 'none' }}
    >
      {size.w > 0 && (
        <Stage
          ref={stageRef}
          width={size.w}
          height={size.h}
          scaleX={viewport.scale}
          scaleY={viewport.scale}
          x={viewport.x}
          y={viewport.y}
          onMouseDown={(e) => {
            if (spaceHeld.current) return
            const store = useScratchpadStore.getState()
            if (store.activeTool === 'pan') {
              isPanning.current = true
              panStart.current = { x: e.evt.clientX, y: e.evt.clientY, vx: viewport.x, vy: viewport.y }
              return
            }
            const stage = e.target.getStage()
            const pos = stage?.getRelativePointerPosition()
            if (!pos) return

            if (store.activeTool === 'pen') {
              penTool.start(pos.x, pos.y, (pts) =>
                setLiveObj({ type: 'stroke', id: '__live__', points: pts, style: { stroke: store.activeColor, strokeWidth: 2, opacity: 1 } })
              )
            } else if (store.activeTool === 'highlighter') {
              highlighterTool.start(pos.x, pos.y, (pts) =>
                setLiveObj({ type: 'highlight', id: '__live__', points: pts, style: { stroke: store.activeColor, strokeWidth: 18, opacity: 0.4 } })
              )
            } else if (['rect', 'circle', 'line', 'arrow'].includes(store.activeTool)) {
              shapesTool.start(pos.x, pos.y, store.activeTool as ToolType, e.evt.shiftKey, setLiveObj)
            } else if (store.activeTool === 'eraser') {
              const hit = e.target !== stage ? e.target.id() : null
              eraserTool.onMouseDown(hit)
            } else if (store.activeTool === 'select') {
              if (e.target === stage) {
                selectTool.onStageClick()
              } else {
                const id = findNodeId(e.target)
                if (id && id !== '__live__') {
                  selectTool.onObjectClick(id, e.evt.shiftKey)
                  const pos = stage?.getRelativePointerPosition()
                  if (pos) selectTool.onDragStart(id, pos.x, pos.y)
                  isDraggingSelect.current = true
                }
              }
            }
          }}
          onMouseMove={(e) => {
            if (spaceHeld.current) return
            const store = useScratchpadStore.getState()
            if (store.activeTool === 'pan' && isPanning.current) {
              const dx = e.evt.clientX - panStart.current.x
              const dy = e.evt.clientY - panStart.current.y
              setViewport({ ...viewport, x: panStart.current.vx + dx, y: panStart.current.vy + dy })
              return
            }
            const stage = e.target.getStage()
            const pos = stage?.getRelativePointerPosition()
            if (!pos) return

            if (store.activeTool === 'pen') penTool.move(pos.x, pos.y)
            else if (store.activeTool === 'highlighter') highlighterTool.move(pos.x, pos.y)
            else if (['rect', 'circle', 'line', 'arrow'].includes(store.activeTool))
              shapesTool.move(pos.x, pos.y, store.activeTool as ToolType, e.evt.shiftKey)
            else if (store.activeTool === 'eraser' && eraserTool.isErasing) {
              const pointer = stage!.getPointerPosition()
              if (pointer) {
                const node = stage!.getIntersection(pointer)
                const hitId = node && node !== (stage as any) ? node.id() : null
                if (hitId && hitId !== '__live__') eraserTool.onMouseMove(hitId)
              }
            } else if (store.activeTool === 'select' && isDraggingSelect.current) {
              const pos = stage?.getRelativePointerPosition()
              if (pos) selectTool.onDragMove(pos.x, pos.y)
            }
          }}
          onMouseUp={() => {
            const store = useScratchpadStore.getState()
            isPanning.current = false

            if (store.activeTool === 'pen') {
              const pts = penTool.end()
              if (pts.length >= 4) {
                store.pushHistory()
                store.addObject({ type: 'stroke', id: crypto.randomUUID(), points: pts, style: { stroke: store.activeColor, strokeWidth: 2, opacity: 1 } })
              }
              setLiveObj(null)
            } else if (store.activeTool === 'highlighter') {
              const pts = highlighterTool.end()
              if (pts.length >= 4) {
                store.pushHistory()
                store.addObject({ type: 'highlight', id: crypto.randomUUID(), points: pts, style: { stroke: store.activeColor, strokeWidth: 18, opacity: 0.4 } })
              }
              setLiveObj(null)
            } else if (['rect', 'circle', 'line', 'arrow'].includes(store.activeTool)) {
              const shape = shapesTool.end()
              if (shape) {
                store.pushHistory()
                store.addObject(shape)
              }
              setLiveObj(null)
            } else {
              eraserTool.onMouseUp()
            }
            isDraggingSelect.current = false
            selectTool.onDragEnd()
          }}
          onDblClick={(e) => {
            const store = useScratchpadStore.getState()
            const stage = e.target.getStage()

            // Double-click on an existing text/sticky node → edit it (any tool)
            if (e.target !== stage) {
              const id = findNodeId(e.target)
              if (id) {
                const obj = store.objects.find((o) => o.id === id)
                if (obj && (obj.type === 'text' || obj.type === 'sticky')) {
                  setEditingId(obj.id)
                  return
                }
              }
            }

            const pos = stage?.getRelativePointerPosition()
            if (!pos) return

            if (store.activeTool === 'text') {
              const newId = textTool.onDblClick(pos.x, pos.y)
              setEditingId(newId)
            } else if (store.activeTool === 'sticky') {
              const COLORS = ['#e8e0ff', '#d1f0d8', '#ffd6e0', '#fff3b0', '#b3e5fc']
              const color = COLORS[Math.floor(Math.random() * COLORS.length)]
              const id = crypto.randomUUID()
              store.pushHistory()
              store.addObject({
                type: 'sticky',
                id,
                x: pos.x,
                y: pos.y,
                w: 160,
                h: 120,
                content: 'Note',
                rotation: 0,
                style: { color },
              })
              store.setSelection([id])
            }
          }}
          onContextMenu={(e) => {
            e.evt.preventDefault()
            const stage = e.target.getStage()
            if (!stage || e.target === stage) return
            const id = findNodeId(e.target)
            if (!id) return
            const obj = useScratchpadStore.getState().objects.find((o) => o.id === id)
            if (!obj || obj.type !== 'sticky') return
            const pointer = stage.getPointerPosition()
            if (!pointer) return
            const rect = stage.container().getBoundingClientRect()
            setContextMenu({ x: rect.left + pointer.x, y: rect.top + pointer.y, id })
          }}
        >
          <Layer>
            {objects.filter((o) => o.id !== editingId).map(renderObject)}
            {liveObj && renderObject(liveObj)}
            <Transformer
              ref={transformerRef}
              rotateEnabled={true}
              borderStrokeWidth={1}
              anchorSize={8}
              onTransformEnd={() => {
                const tr = transformerRef.current
                if (!tr) return
                const nodes = tr.nodes()
                if (nodes.length !== 1) return
                const node = nodes[0]
                const id = node.id()
                const obj = useScratchpadStore.getState().objects.find((o) => o.id === id)
                if (!obj) return

                useScratchpadStore.getState().pushHistory()
                const sx = node.scaleX()
                const sy = node.scaleY()
                node.scaleX(1)
                node.scaleY(1)
                const base = { x: node.x(), y: node.y(), rotation: node.rotation() }

                if (obj.type === 'rect' || obj.type === 'sticky') {
                  useScratchpadStore.getState().updateObject(id, {
                    ...base,
                    w: Math.max(10, (obj as any).w * sx),
                    h: Math.max(10, (obj as any).h * sy),
                  } as any)
                } else if (obj.type === 'circle') {
                  useScratchpadStore.getState().updateObject(id, {
                    ...base,
                    rx: Math.max(5, obj.rx * sx),
                    ry: Math.max(5, obj.ry * sy),
                  } as any)
                } else if (obj.type === 'text') {
                  useScratchpadStore.getState().updateObject(id, {
                    ...base,
                    style: { ...obj.style, fontSize: Math.max(8, Math.round(obj.style.fontSize * sy)) },
                  } as any)
                }
              }}
            />
          </Layer>
        </Stage>
      )}
      {editingId && (
        <textarea
          ref={textareaRef}
          className="absolute z-50 min-w-[120px] min-h-[24px] resize-none bg-white/95 border border-violet-500 rounded px-1 py-0.5 outline-none"
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setEditingId(null)
            } else if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              commitTextEdit()
            }
          }}
          onBlur={commitTextEdit}
        />
      )}
      {contextMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setContextMenu(null)} />
          <div
            className="fixed z-50 bg-popover border border-border rounded-md shadow-md py-1 min-w-[140px]"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            <button
              className="w-full px-3 py-1.5 text-sm text-left hover:bg-accent hover:text-accent-foreground"
              onClick={() => { setEditingId(contextMenu.id); setContextMenu(null) }}
            >
              Edit note
            </button>
            <button
              className="w-full px-3 py-1.5 text-sm text-left text-destructive hover:bg-accent"
              onClick={() => {
                const store = useScratchpadStore.getState()
                store.pushHistory()
                store.removeObjects([contextMenu.id])
                setContextMenu(null)
              }}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  )
}
