import { useScratchpadStore } from '../useScratchpadStore'

type PointCallback = (pts: number[]) => void

let pts: number[] = []
let onUpdate: PointCallback | null = null

export const highlighterTool = {
  start(x: number, y: number, cb: PointCallback) {
    pts = [x, y]
    onUpdate = cb
    cb([...pts])
  },
  move(x: number, y: number) {
    if (!onUpdate) return
    pts.push(x, y)
    onUpdate([...pts])
  },
  end(): number[] {
    onUpdate = null
    const result = [...pts]
    pts = []
    return result
  },
  onMouseUp() { this.end() },
}
