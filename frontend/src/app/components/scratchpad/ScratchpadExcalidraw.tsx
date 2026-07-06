import { useRef } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";

import { ExcalidrawFooter } from "./ExcalidrawFooter";

const STORAGE_KEY = "scholar_scratchpad_excalidraw";

function loadScene() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
  } catch {
    return undefined;
  }
}

export function ScratchpadExcalidraw() {
  const apiRef = useRef<any>(null);
  const initialSceneRef = useRef(loadScene());

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // const initialScene = loadScene();

  return (
    <>
      <div className="h-full w-full">
        <Excalidraw
          initialData={initialSceneRef.current}
          excalidrawAPI={(api) => {
            apiRef.current = api;
          }}
          onChange={(elements: readonly any[], appState: any, files: any) => {
            if (saveTimer.current) {
              clearTimeout(saveTimer.current);
            }

            saveTimer.current = setTimeout(() => {
              localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                  elements,
                  files,
                  appState: {
                    viewBackgroundColor:
                      appState?.viewBackgroundColor ?? "#ffffff",
                  },
                }),
              );
            }, 300);
          }}
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
            tools: {
              image: false,
            },
          }}
          theme="light"
        />
      </div>

      <ExcalidrawFooter apiRef={apiRef} />
    </>
  );
}
