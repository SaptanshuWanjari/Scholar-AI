export type ToolType =
  | 'select'
  | 'pen'
  | 'highlighter'
  | 'eraser'
  | 'text'
  | 'arrow'
  | 'rect'
  | 'circle'
  | 'line'
  | 'sticky'

export interface StrokeStyle {
  stroke: string
  strokeWidth: number
  opacity: number
}

export interface HighlightStyle {
  stroke: string
  strokeWidth: number
  opacity: number
}

export interface TextStyle {
  fontSize: number
  fill: string
  fontFamily: string
}

export interface ShapeStyle {
  stroke: string
  strokeWidth: number
  roughness: number
  seed: number
  fill: string
}

export interface ArrowStyle {
  stroke: string
  strokeWidth: number
  roughness: number
  seed: number
}

export interface LineStyle {
  stroke: string
  strokeWidth: number
  roughness: number
  seed: number
}

export interface StickyStyle {
  color: string  // background color: '#e8e0ff' | '#d1f0d8' | '#ffd6e0' | '#fff3b0' | '#b3e5fc'
}

export type SceneObject =
  | { type: 'stroke';    id: string; points: number[]; style: StrokeStyle }
  | { type: 'highlight'; id: string; points: number[]; style: HighlightStyle }
  | { type: 'text';      id: string; x: number; y: number; content: string; style: TextStyle }
  | { type: 'rect';      id: string; x: number; y: number; w: number; h: number; rotation: number; style: ShapeStyle }
  | { type: 'circle';    id: string; x: number; y: number; rx: number; ry: number; rotation: number; style: ShapeStyle }
  | { type: 'arrow';     id: string; points: number[]; style: ArrowStyle }
  | { type: 'line';      id: string; points: number[]; style: LineStyle }
  | { type: 'sticky';    id: string; x: number; y: number; w: number; h: number; content: string; style: StickyStyle }

export interface Viewport {
  x: number
  y: number
  scale: number
}

export interface ScratchpadPayload {
  objects: SceneObject[]
  viewport: Viewport
  drawerHeight: number
}
