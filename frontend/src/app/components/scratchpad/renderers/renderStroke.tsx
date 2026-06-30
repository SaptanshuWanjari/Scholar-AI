import { Line } from 'react-konva'
import type { SceneObject } from '../types'

type StrokeObj = Extract<SceneObject, { type: 'stroke' }>
type HighlightObj = Extract<SceneObject, { type: 'highlight' }>

export function RenderStroke({ obj }: { obj: StrokeObj }) {
  if (obj.points.length < 4) return null
  return (
    <Line
      id={obj.id}
      points={obj.points}
      stroke={obj.style.stroke}
      strokeWidth={obj.style.strokeWidth}
      opacity={obj.style.opacity}
      lineCap="round"
      lineJoin="round"
      tension={0.3}
      draggable={false}
    />
  )
}

export function RenderHighlight({ obj }: { obj: HighlightObj }) {
  if (obj.points.length < 4) return null
  return (
    <Line
      id={obj.id}
      points={obj.points}
      stroke={obj.style.stroke}
      strokeWidth={obj.style.strokeWidth}
      opacity={obj.style.opacity}
      lineCap="round"
      lineJoin="round"
      tension={0.3}
      globalCompositeOperation="multiply"
      draggable={false}
    />
  )
}
