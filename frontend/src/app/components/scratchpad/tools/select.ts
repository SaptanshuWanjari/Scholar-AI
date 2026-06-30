import { useScratchpadStore } from '../useScratchpadStore'

let dragId: string | null = null
let startX = 0, startY = 0
let objStartX = 0, objStartY = 0
let startPoints: number[] | null = null
let historyPushed = false

export const selectTool = {
  onObjectClick(id: string, multi: boolean) {
    const { selection, setSelection } = useScratchpadStore.getState()
    if (multi) {
      setSelection(selection.includes(id) ? selection.filter((s) => s !== id) : [...selection, id])
    } else {
      setSelection([id])
    }
  },

  onStageClick() {
    useScratchpadStore.getState().setSelection([])
  },

  onDragStart(id: string, stageX: number, stageY: number) {
    dragId = id
    startX = stageX
    startY = stageY
    historyPushed = false
    const obj = useScratchpadStore.getState().objects.find((o) => o.id === id)
    if (obj && 'x' in obj) {
      objStartX = (obj as any).x
      objStartY = (obj as any).y
      startPoints = null
    } else if (obj && 'points' in obj) {
      startPoints = [...(obj as any).points]
      objStartX = 0
      objStartY = 0
    }
  },

  onDragMove(stageX: number, stageY: number) {
    if (!dragId) return
    const dx = stageX - startX
    const dy = stageY - startY
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return
    if (!historyPushed) {
      useScratchpadStore.getState().pushHistory()
      historyPushed = true
    }
    if (startPoints) {
      const newPoints = startPoints.map((p, i) => (i % 2 === 0 ? p + dx : p + dy))
      useScratchpadStore.getState().updateObject(dragId, { points: newPoints } as any)
    } else {
      useScratchpadStore.getState().updateObject(dragId, {
        x: objStartX + dx,
        y: objStartY + dy,
      } as any)
    }
  },

  onDragEnd() {
    dragId = null
    historyPushed = false
    startPoints = null
  },

  deleteSelected() {
    const { selection, removeObjects } = useScratchpadStore.getState()
    if (selection.length > 0) removeObjects(selection)
  },
}
