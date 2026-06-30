import { create } from 'zustand'
import type { SceneObject, ToolType, Viewport, ScratchpadPayload } from './types'

const STORAGE_KEY = 'scholar_scratchpad'
const DEBOUNCE_MS = 300

let saveTimer: ReturnType<typeof setTimeout> | null = null

function loadFromStorage(): Partial<ScratchpadPayload> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as ScratchpadPayload
  } catch {
    return {}
  }
}

function saveToStorage(payload: ScratchpadPayload, setState: (s: Partial<ScratchpadState>) => void) {
  if (saveTimer) clearTimeout(saveTimer)
  setState({ isDirty: true })
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
      setState({ isDirty: false, lastSaved: Date.now() })
    } catch {}
  }, DEBOUNCE_MS)
}

const saved = loadFromStorage()

interface ScratchpadState {
  // Drawer
  drawerState: 'collapsed' | 'medium' | 'expanded'
  drawerHeight: number

  // Canvas
  activeTool: ToolType
  viewport: Viewport
  objects: SceneObject[]
  selection: string[]

  // History
  undoStack: SceneObject[][]
  redoStack: SceneObject[][]

  // Status
  isDirty: boolean
  lastSaved: number

  // Color
  activeColor: string
  activeFill: string
  setActiveColor: (c: string) => void
  setActiveFill: (c: string) => void

  // Actions
  setDrawerState: (state: 'collapsed' | 'medium' | 'expanded') => void
  setDrawerHeight: (h: number) => void
  toggleDrawer: () => void
  setActiveTool: (tool: ToolType) => void
  setViewport: (vp: Viewport) => void
  setSelection: (ids: string[]) => void
  addObject: (obj: SceneObject) => void
  updateObject: (id: string, patch: Partial<SceneObject>) => void
  removeObjects: (ids: string[]) => void
  pushHistory: () => void
  undo: () => void
  redo: () => void
  clearCanvas: () => void
}

export const useScratchpadStore = create<ScratchpadState>((set, get) => ({
  drawerState: 'collapsed',
  drawerHeight: saved.drawerHeight ?? Math.round(window.innerHeight * 0.4),
  activeTool: 'pen',
  viewport: saved.viewport ?? { x: 0, y: 0, scale: 1 },
  objects: saved.objects ?? [],
  selection: [],
  undoStack: [],
  redoStack: [],
  isDirty: false,
  lastSaved: 0,
  activeColor: '#211f1b',
  activeFill: 'none',

  setDrawerState: (drawerState) => set({ drawerState }),

  setDrawerHeight: (drawerHeight) => {
    set({ drawerHeight })
    const s = get()
    saveToStorage({ objects: s.objects, viewport: s.viewport, drawerHeight }, set)
  },

  toggleDrawer: () => {
    const s = get()
    if (s.drawerState === 'collapsed') {
      set({ drawerState: 'medium' })
    } else {
      set({ drawerState: 'collapsed' })
    }
  },

  setActiveTool: (activeTool) => set({ activeTool }),

  setViewport: (viewport) => {
    set({ viewport })
    const s = get()
    saveToStorage({ objects: s.objects, viewport, drawerHeight: s.drawerHeight }, set)
  },

  setSelection: (selection) => set({ selection }),

  addObject: (obj) => {
    const s = get()
    const objects = [...s.objects, obj]
    set({ objects, redoStack: [] })
    saveToStorage({ objects, viewport: s.viewport, drawerHeight: s.drawerHeight }, set)
  },

  updateObject: (id, patch) => {
    const s = get()
    const objects = s.objects.map((o) => (o.id === id ? { ...o, ...patch } as SceneObject : o))
    set({ objects })
    saveToStorage({ objects, viewport: s.viewport, drawerHeight: s.drawerHeight }, set)
  },

  removeObjects: (ids) => {
    const s = get()
    const objects = s.objects.filter((o) => !ids.includes(o.id))
    set({ objects, selection: [], redoStack: [] })
    saveToStorage({ objects, viewport: s.viewport, drawerHeight: s.drawerHeight }, set)
  },

  pushHistory: () => {
    const s = get()
    set({ undoStack: [...s.undoStack.slice(-49), [...s.objects]], redoStack: [] })
  },

  undo: () => {
    const s = get()
    if (s.undoStack.length === 0) return
    const prev = s.undoStack[s.undoStack.length - 1]
    const undoStack = s.undoStack.slice(0, -1)
    const redoStack = [...s.redoStack, [...s.objects]]
    set({ objects: prev, undoStack, redoStack, selection: [] })
    saveToStorage({ objects: prev, viewport: s.viewport, drawerHeight: s.drawerHeight }, set)
  },

  redo: () => {
    const s = get()
    if (s.redoStack.length === 0) return
    const next = s.redoStack[s.redoStack.length - 1]
    const redoStack = s.redoStack.slice(0, -1)
    const undoStack = [...s.undoStack, [...s.objects]]
    set({ objects: next, undoStack, redoStack, selection: [] })
    saveToStorage({ objects: next, viewport: s.viewport, drawerHeight: s.drawerHeight }, set)
  },

  clearCanvas: () => {
    const s = get()
    const undoStack = [...s.undoStack.slice(-49), [...s.objects]]
    set({ objects: [], selection: [], undoStack, redoStack: [] })
    saveToStorage({ objects: [], viewport: s.viewport, drawerHeight: s.drawerHeight }, set)
  },

  setActiveColor: (activeColor) => set({ activeColor }),
  setActiveFill: (activeFill) => set({ activeFill }),
}))
