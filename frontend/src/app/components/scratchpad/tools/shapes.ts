import { useScratchpadStore } from '../useScratchpadStore'
import type { SceneObject, ToolType } from '../types'

type ShapeCallback = (shape: SceneObject | null) => void

const ROUGHNESS: Record<string, number> = {
  rect: 1.4, circle: 1.6, line: 1.0, arrow: 1.2,
}

let startX = 0, startY = 0
let seed = 0
let onUpdate: ShapeCallback | null = null
let lastShape: SceneObject | null = null

function buildShape(
  x1: number, y1: number, x2: number, y2: number,
  tool: ToolType, shiftKey: boolean,
  color: string, fill: string
): SceneObject {
  const dx = x2 - x1, dy = y2 - y1
  const roughness = ROUGHNESS[tool] ?? 1.2
  const shapeStyle = { stroke: color, strokeWidth: 1.5, roughness, seed, fill }

  if (tool === 'rect') {
    const w = shiftKey ? Math.sign(dx) * Math.min(Math.abs(dx), Math.abs(dy)) : dx
    const h = shiftKey ? Math.sign(dy) * Math.min(Math.abs(dx), Math.abs(dy)) : dy
    return {
      type: 'rect', id: '__live__',
      x: w < 0 ? x2 : x1, y: h < 0 ? y2 : y1,
      w: Math.max(1, Math.abs(w)), h: Math.max(1, Math.abs(h)),
      rotation: 0, style: shapeStyle,
    }
  } else if (tool === 'circle') {
    const rx = shiftKey ? Math.min(Math.abs(dx), Math.abs(dy)) / 2 : Math.abs(dx) / 2
    const ry = shiftKey ? rx : Math.abs(dy) / 2
    return {
      type: 'circle', id: '__live__',
      x: x1, y: y1,
      rx: Math.max(1, rx), ry: Math.max(1, ry),
      rotation: 0, style: shapeStyle,
    }
  } else if (tool === 'line') {
    return {
      type: 'line', id: '__live__',
      points: [x1, y1, x2, y2],
      style: { stroke: color, strokeWidth: 1.5, roughness, seed },
    }
  } else {
    return {
      type: 'arrow', id: '__live__',
      points: [x1, y1, x2, y2],
      style: { stroke: color, strokeWidth: 1.5, roughness, seed },
    }
  }
}

export const shapesTool = {
  start(x: number, y: number, tool: ToolType, shiftKey: boolean, cb: ShapeCallback) {
    startX = x; startY = y
    seed = Math.floor(Math.random() * 10000)
    onUpdate = cb
    const { activeColor, activeFill } = useScratchpadStore.getState()
    lastShape = buildShape(x, y, x, y, tool, shiftKey, activeColor, activeFill)
    cb(lastShape)
  },
  move(x: number, y: number, tool: ToolType, shiftKey: boolean) {
    if (!onUpdate) return
    const { activeColor, activeFill } = useScratchpadStore.getState()
    lastShape = buildShape(startX, startY, x, y, tool, shiftKey, activeColor, activeFill)
    onUpdate(lastShape)
  },
  end(): SceneObject | null {
    onUpdate = null
    if (!lastShape) return null
    const shape = { ...lastShape, id: crypto.randomUUID() } as SceneObject
    lastShape = null
    return shape
  },
  // Legacy no-op
  onMouseUp() { this.end() },
}
