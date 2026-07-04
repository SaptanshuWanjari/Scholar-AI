import React, { lazy, Suspense, useCallback, useRef, useState, useLayoutEffect } from 'react'
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

// Cast to ComponentType<any> so TypeScript accepts all Excalidraw props through the lazy wrapper
const Excalidraw = lazy<React.ComponentType<any>>(() =>
  import("@excalidraw/excalidraw").then((m) => ({ default: m.Excalidraw as React.ComponentType<any> })),
)

const LOADER = (
  <div className="absolute inset-0 flex items-center justify-center">
    <Loader2 className="size-5 animate-spin text-ink-muted" />
  </div>
)

/**
 * ScratchpadExcalidraw
 *
 * Root cause of DOMException "Canvas exceeds max size":
 *   Excalidraw's App.componentDidMount calls updateDOMRect() which calls
 *   excalidrawContainerRef.current.getBoundingClientRect(). If width/height
 *   are 0 (because the browser hasn't resolved flex layout for this subtree
 *   at the React-scheduler microtask moment), appState.width = 0.
 *   StaticCanvas then sets canvas.width = 0 * devicePixelRatio = 0, and
 *   ctx.setTransform(dpr, 0, 0, dpr, 0, 0) throws on a zero-size canvas.
 *
 * Fix: measure our outer container with a ResizeObserver to get real pixel
 * dimensions, then render the Excalidraw wrapper with explicit pixel
 * width/height. This guarantees getBoundingClientRect() inside Excalidraw
 * always returns non-zero values, regardless of when React's scheduler
 * decides to run componentDidMount.
 */
export function ScratchpadExcalidraw() {
  const apiRef = useRef<any>(null)
  const sceneRef = useRef(loadScene())
  const outerRef = useRef<HTMLDivElement>(null)

  // Measured pixel dimensions of our outer flex container.
  // null = not yet measured; {w, h} = ready to render Excalidraw.
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null)

  useLayoutEffect(() => {
    const el = outerRef.current
    if (!el) return

    const measure = () => {
      const r = el.getBoundingClientRect()
      if (r.width > 0 && r.height > 0) {
        setDims({ w: r.width, h: r.height })
      }
    }

    // Attempt immediate measurement first (may already be laid out).
    measure()

    // Watch for the first non-zero measurement in case flex layout settles
    // asynchronously (e.g. inside a Framer Motion panel).
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
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
      {/*
        outerRef is the flex child; its size is controlled by the parent layout.
        We measure it here, then pass explicit pixel sizes to the Excalidraw
        wrapper so Excalidraw's internal getBoundingClientRect() always returns
        non-zero dimensions at componentDidMount time.
      */}
      <div ref={outerRef} className="flex-1 min-h-0 relative overflow-hidden">
        {dims ? (
          /*
            This inner div has explicit pixel width/height.
            Excalidraw's .excalidraw-container is width:100% height:100% in its
            own CSS, so it resolves to these exact pixel values immediately —
            no flex cascade needed during getBoundingClientRect() calls.
          */
          <div
            style={{ width: dims.w, height: dims.h }}
            className="relative overflow-hidden"
          >
            <Suspense fallback={LOADER}>
              <Excalidraw
                initialData={
                  sceneRef.current
                    ? {
                        elements: sceneRef.current.elements,
                        appState: {
                          viewBackgroundColor:
                            sceneRef.current.appState?.viewBackgroundColor ?? '#ffffff',
                        },
                        files: sceneRef.current.files,
                      }
                    : undefined
                }
                excalidrawAPI={(api: any) => {
                  apiRef.current = api
                }}
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
        ) : LOADER}
      </div>
      <ExcalidrawFooter apiRef={apiRef} />
    </>
  )
}
