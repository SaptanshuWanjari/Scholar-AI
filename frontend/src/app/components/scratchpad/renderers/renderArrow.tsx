import { Shape } from 'react-konva'
import rough from 'roughjs'
import type { SceneObject } from '../types'

type ArrowObj = Extract<SceneObject, { type: 'arrow' }>

const gen = rough.generator()

function drawOpSet(ctx: CanvasRenderingContext2D, opSet: any) {
  const ops = opSet.ops
  ctx.beginPath()
  for (const op of ops) {
    const d = op.data
    if (op.op === 'move') ctx.moveTo(d[0], d[1])
    else if (op.op === 'lineTo') ctx.lineTo(d[0], d[1])
    else if (op.op === 'bcurveTo') ctx.bezierCurveTo(d[0], d[1], d[2], d[3], d[4], d[5])
  }
  ctx.stroke()
}

function arrowhead(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, size = 12) {
  const angle = Math.atan2(y2 - y1, x2 - x1)
  ctx.beginPath()
  ctx.moveTo(x2, y2)
  ctx.lineTo(x2 - size * Math.cos(angle - Math.PI / 6), y2 - size * Math.sin(angle - Math.PI / 6))
  ctx.moveTo(x2, y2)
  ctx.lineTo(x2 - size * Math.cos(angle + Math.PI / 6), y2 - size * Math.sin(angle + Math.PI / 6))
  ctx.stroke()
}

export function RenderArrow({ obj }: { obj: ArrowObj }) {
  if (obj.points.length < 4) return null
  const x1 = obj.points[0], y1 = obj.points[1]
  const x2 = obj.points[obj.points.length - 2], y2 = obj.points[obj.points.length - 1]

  return (
    <Shape
      id={obj.id}
      sceneFunc={(ctx) => {
        const drawable = gen.line(x1, y1, x2, y2, {
          roughness: obj.style.roughness,
          seed: obj.style.seed,
          stroke: obj.style.stroke,
          strokeWidth: obj.style.strokeWidth,
        })
        ctx.save()
        ctx.strokeStyle = obj.style.stroke
        ctx.lineWidth = obj.style.strokeWidth
        for (const set of drawable.sets) drawOpSet(ctx as unknown as CanvasRenderingContext2D, set)
        arrowhead(ctx as unknown as CanvasRenderingContext2D, x1, y1, x2, y2)
        ctx.restore()
      }}
      hitFunc={(ctx, shape) => {
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.closePath()
        ctx.fillStrokeShape(shape)
      }}
    />
  )
}
