import { useScratchpadStore } from '../useScratchpadStore'
import type { SceneObject } from '../types'

export const textTool = {
  onDblClick(stageX: number, stageY: number): string {
    const id = crypto.randomUUID()
    const { activeColor } = useScratchpadStore.getState()
    const obj: SceneObject = {
      type: 'text',
      id,
      x: stageX,
      y: stageY,
      content: 'Text',
      rotation: 0,
      style: { fontSize: 16, fill: activeColor, fontFamily: 'Inter, sans-serif' },
    }
    useScratchpadStore.getState().pushHistory()
    useScratchpadStore.getState().addObject(obj)
    useScratchpadStore.getState().setSelection([id])
    return id
  },
}
