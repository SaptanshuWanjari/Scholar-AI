import { Shape } from 'react-konva'
import rough from 'roughjs'
import type { SceneObject } from '../types'

type RectObj = Extract<SceneObject, { type: 'rect' }>
type CircleObj = Extract<SceneObject, { type: 'circle' }>
type LineObj = Extract<SceneObject, { type: 'line' }>

const gen = rough.generator()

const drawableCache = new Map<string, ReturnType<typeof gen.rectangle>>()

function shapeKey(id: string, ...parts: (string | number)[]): string {
  return `${id}:${parts.join(':')}`
}

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

export function RenderRect({ obj }: { obj: RectObj }) {
  const key = shapeKey(obj.id, obj.w, obj.h, obj.style.roughness, obj.style.seed, obj.style.stroke, obj.style.fill)
  let drawable = drawableCache.get(key)
  if (!drawable) {
    drawable = gen.rectangle(0, 0, obj.w, obj.h, {
      roughness: obj.style.roughness,
      seed: obj.style.seed,
      stroke: obj.style.stroke,
      strokeWidth: obj.style.strokeWidth,
      fill: obj.style.fill !== 'none' ? obj.style.fill : undefined,
      fillStyle: 'solid',
    })
    drawableCache.set(key, drawable)
  }
  return (
    <Shape
      id={obj.id}
      x={obj.x}
      y={obj.y}
      width={obj.w}
      height={obj.h}
      rotation={obj.rotation}
      sceneFunc={(ctx, shape) => {
        ctx.save()
        ctx.strokeStyle = obj.style.stroke
        ctx.lineWidth = obj.style.strokeWidth
        for (const set of drawable!.sets) drawOpSet(ctx as unknown as CanvasRenderingContext2D, set)
        ctx.restore()
        shape.setAttr('width', obj.w)
        shape.setAttr('height', obj.h)
      }}
      hitFunc={(ctx, shape) => {
        ctx.beginPath()
        ctx.rect(0, 0, obj.w, obj.h)
        ctx.closePath()
        ctx.fillStrokeShape(shape)
      }}
    />
  )
}

export function RenderCircle({ obj }: { obj: CircleObj }) {
  const key = shapeKey(obj.id, obj.rx, obj.ry, obj.style.roughness, obj.style.seed, obj.style.stroke, obj.style.fill)
  let drawable = drawableCache.get(key)
  if (!drawable) {
    drawable = gen.ellipse(obj.rx, obj.ry, obj.rx * 2, obj.ry * 2, {
      roughness: obj.style.roughness,
      seed: obj.style.seed,
      stroke: obj.style.stroke,
      strokeWidth: obj.style.strokeWidth,
      fill: obj.style.fill !== 'none' ? obj.style.fill : undefined,
      fillStyle: 'solid',
    })
    drawableCache.set(key, drawable)
  }
  return (
    <Shape
      id={obj.id}
      x={obj.x}
      y={obj.y}
      width={obj.rx * 2}
      height={obj.ry * 2}
      rotation={obj.rotation}
      sceneFunc={(ctx, shape) => {
        ctx.save()
        ctx.strokeStyle = obj.style.stroke
        ctx.lineWidth = obj.style.strokeWidth
        for (const set of drawable!.sets) drawOpSet(ctx as unknown as CanvasRenderingContext2D, set)
        ctx.restore()
        shape.setAttr('width', obj.rx * 2)
        shape.setAttr('height', obj.ry * 2)
      }}
      hitFunc={(ctx, shape) => {
        ctx.beginPath()
        ctx.ellipse(obj.rx, obj.ry, obj.rx, obj.ry, 0, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fillStrokeShape(shape)
      }}
    />
  )
}

export function RenderLine({ obj }: { obj: LineObj }) {
  if (obj.points.length < 4) return null
  const x1 = obj.points[0], y1 = obj.points[1]
  const x2 = obj.points[obj.points.length - 2], y2 = obj.points[obj.points.length - 1]
  const key = shapeKey(obj.id, x1, y1, x2, y2, obj.style.roughness, obj.style.seed, obj.style.stroke)
  let drawable = drawableCache.get(key)
  if (!drawable) {
    drawable = gen.line(x1, y1, x2, y2, {
      roughness: obj.style.roughness,
      seed: obj.style.seed,
      stroke: obj.style.stroke,
      strokeWidth: obj.style.strokeWidth,
    })
    drawableCache.set(key, drawable)
  }
  return (
    <Shape
      id={obj.id}
      sceneFunc={(ctx, shape) => {
        ctx.save()
        ctx.strokeStyle = obj.style.stroke
        ctx.lineWidth = obj.style.strokeWidth
        for (const set of drawable!.sets) drawOpSet(ctx as unknown as CanvasRenderingContext2D, set)
        ctx.restore()
        shape.setAttr('width', Math.abs(x2 - x1) + 20)
        shape.setAttr('height', Math.abs(y2 - y1) + 20)
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
