// Lazy-loaded Excalidraw canvas. The heavy editor (~150KB+) and its CSS are
// only fetched when this component mounts, keeping the main bundle lean for
// users who never open a whiteboard.
import React, { lazy, Suspense, useEffect } from "react";
import { Loader2 } from "lucide-react";
import type { WhiteboardScene } from "../../lib/types";

// Cast to ComponentType<any>: lazy() drops Excalidraw's prop types, causing TS2322
const Excalidraw = lazy<React.ComponentType<any>>(() =>
  import("@excalidraw/excalidraw").then((m) => ({ default: m.Excalidraw as React.ComponentType<any> })),
);

export interface ExcalidrawCanvasProps {
  initialScene?: WhiteboardScene;
  onChange?: (scene: WhiteboardScene) => void;
  /** Surfaces the Excalidraw imperative API (for exports, scene updates). */
  onApiReady?: (api: any) => void;
}

/** Strip non-serializable / transient appState before persisting as JSON. */
function cleanScene(elements: readonly any[], appState: any, files: any): WhiteboardScene {
  return {
    elements: elements ?? [],
    files: files ?? {},
    appState: {
      viewBackgroundColor: appState?.viewBackgroundColor ?? "#ffffff",
      gridSize: appState?.gridSize ?? null,
    },
  };
}

export function ExcalidrawCanvas({ initialScene, onChange, onApiReady }: ExcalidrawCanvasProps) {
  useEffect(() => {
    import("@excalidraw/excalidraw/index.css").catch(() => {});
  }, []);

  const hasScene = initialScene && Object.keys(initialScene).length > 0;
  const initialData = hasScene
    ? {
        elements: initialScene!.elements ?? [],
        files: initialScene!.files ?? {},
        appState: { ...(initialScene!.appState ?? {}), collaborators: undefined },
        scrollToContent: true,
      }
    : undefined;

  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center">
          <Loader2 className="size-6 animate-spin text-violet" />
        </div>
      }
    >
      <Excalidraw
        initialData={initialData}
        excalidrawAPI={(api: any) => onApiReady?.(api)}
        onChange={(elements: readonly any[], appState: any, files: any) =>
          onChange?.(cleanScene(elements, appState, files))
        }
      />
    </Suspense>
  );
}
