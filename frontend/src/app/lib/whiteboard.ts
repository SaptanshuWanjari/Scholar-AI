// Whiteboard helpers — Mermaid → Excalidraw conversion and thumbnail export.
// Excalidraw modules are dynamically imported so they stay out of the main
// bundle (only loaded when a whiteboard action actually needs them).
import type { WhiteboardScene } from "./types";

/** Convert Mermaid syntax into an editable Excalidraw scene. */
export async function mermaidToScene(mermaid: string): Promise<WhiteboardScene> {
  const [{ parseMermaidToExcalidraw }, { convertToExcalidrawElements }] = await Promise.all([
    import("@excalidraw/mermaid-to-excalidraw"),
    import("@excalidraw/excalidraw"),
  ]);
  const { elements, files } = await parseMermaidToExcalidraw(mermaid);
  const excalidrawElements = convertToExcalidrawElements(elements as any);
  return { elements: excalidrawElements, files: files ?? {}, appState: { viewBackgroundColor: "#ffffff" } };
}

/** Merge a Mermaid sub-graph into an existing scene (used by AI "expand"). */
export async function mergeMermaidIntoScene(
  scene: WhiteboardScene,
  mermaid: string,
): Promise<WhiteboardScene> {
  const added = await mermaidToScene(mermaid);
  return {
    elements: [...(scene.elements ?? []), ...(added.elements ?? [])],
    files: { ...(scene.files ?? {}), ...(added.files ?? {}) },
    appState: scene.appState ?? { viewBackgroundColor: "#ffffff" },
  };
}

/** Render a scene to an inline SVG data-URL for cards and search thumbnails. */
export async function sceneThumbnail(scene: WhiteboardScene): Promise<string | null> {
  const elements = scene?.elements ?? [];
  if (!elements.length) return null;
  try {
    const { exportToSvg } = await import("@excalidraw/excalidraw");
    const svg = await exportToSvg({
      elements,
      appState: { exportBackground: true, viewBackgroundColor: "#ffffff", exportPadding: 12 } as any,
      files: scene.files ?? null,
    });
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg.outerHTML);
  } catch {
    return null;
  }
}
