import { useScratchpadStore } from '../useScratchpadStore'

let _isErasing = false
let historyPushed = false

export const eraserTool = {
  get isErasing() { return _isErasing },

  onMouseDown(targetId: string | null) {
    _isErasing = true
    historyPushed = false
    if (!targetId) return
    useScratchpadStore.getState().pushHistory()
    historyPushed = true
    useScratchpadStore.getState().removeObjects([targetId])
  },

  onMouseMove(targetId: string) {
    if (!_isErasing) return
    if (!historyPushed) {
      useScratchpadStore.getState().pushHistory()
      historyPushed = true
    }
    useScratchpadStore.getState().removeObjects([targetId])
  },

  onMouseUp() {
    _isErasing = false
    historyPushed = false
  },
}
