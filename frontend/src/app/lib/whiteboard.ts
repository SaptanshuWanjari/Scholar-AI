// Whiteboard helpers — Mermaid → Excalidraw conversion and thumbnail export.
// Excalidraw modules are dynamically imported so they stay out of the main
// bundle (only loaded when a whiteboard action actually needs them).
import type { WhiteboardScene } from "./types";

/**
 * Wrap unquoted flowchart node labels in double quotes so the Mermaid parser
 * never sees raw special characters (colons, leading digits, etc.).
 *
 * Matches `[unquoted label]` — skips labels already wrapped in " or '.
 * Handles the most common node shapes: A[label], A(label), A{label}.
 */
function quoteMermaidLabels(mermaid: string): string {
  // [content] where content has no existing quotes or nested brackets.
  return mermaid.replace(/\[([^\]["'[\]]+)\]/g, (_, content) => {
    const safe = content.replace(/"/g, "'");
    return `["${safe}"]`;
  });
}

/** Convert Mermaid syntax into an editable Excalidraw scene. */
export async function mermaidToScene(mermaid: string): Promise<WhiteboardScene> {
  const [{ parseMermaidToExcalidraw }, { convertToExcalidrawElements }] = await Promise.all([
    import("@excalidraw/mermaid-to-excalidraw"),
    import("@excalidraw/excalidraw"),
  ]);
  const sanitized = quoteMermaidLabels(mermaid);
  const { elements, files } = await parseMermaidToExcalidraw(sanitized);
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
