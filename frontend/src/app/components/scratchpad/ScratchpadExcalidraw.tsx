import { lazy, Suspense, useCallback, useRef, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { ExcalidrawFooter } from './ExcalidrawFooter'

const STORAGE_KEY = 'scholar_scratchpad_excalidraw'
const DEBOUNCE_MS = 300

let saveTimer: ReturnType<typeof setTimeout> | null = null

function loadScene(): any {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw)
    if (parsed?.elements) return parsed
  } catch {}
}

const Excalidraw = lazy(() =>
  import("@excalidraw/excalidraw").then((m) => ({ default: m.Excalidraw })),
)

const loader = (
  <div className="flex h-full w-full items-center justify-center">
    <Loader2 className="size-5 animate-spin text-ink-muted" />
  </div>
)

export function ScratchpadExcalidraw() {
  const apiRef = useRef<any>(null)
  const sceneRef = useRef(loadScene())

  useEffect(() => {
    return () => {
      if (saveTimer) clearTimeout(saveTimer)
    }
  }, [])

  const handleChange = useCallback(
    (elements: readonly any[], appState: any, files: any) => {
      if (saveTimer) clearTimeout(saveTimer)
      saveTimer = setTimeout(() => {
        try {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              elements,
              appState: { viewBackgroundColor: appState?.viewBackgroundColor ?? '#ffffff' },
              files: files ?? {},
            }),
          )
        } catch {}
      }, DEBOUNCE_MS)
    },
    [],
  )

  return (
    <>
      <div className="flex-1 min-h-0">
        <Suspense fallback={loader}>
          <Excalidraw
            initialData={
              sceneRef.current
                ? { elements: sceneRef.current.elements, appState: {}, files: sceneRef.current.files }
                : undefined
            }
            excalidrawAPI={(api: any) => { apiRef.current = api }}
            onChange={handleChange}
            UIOptions={{
              canvasActions: {
                changeViewBackgroundColor: false,
                loadScene: false,
                saveToActiveFile: false,
                toggleTheme: false,
                export: false,
                clearCanvas: false,
                saveAsImage: false,
              },
              tools: { image: false },
            }}
            theme="light"
          />
        </Suspense>
      </div>
      <ExcalidrawFooter apiRef={apiRef} />
    </>
  )
}
