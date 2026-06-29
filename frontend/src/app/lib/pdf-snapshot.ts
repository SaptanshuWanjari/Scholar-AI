import type { NoteRect, WhiteboardScene } from "./types";

/** Union of normalized rects → a single bounding box (page-relative 0..1). */
export function unionRects(rects: NoteRect[]): NoteRect | null {
  if (!rects.length) return null;
  let minX = 1, minY = 1, maxX = 0, maxY = 0;
  for (const r of rects) {
    minX = Math.min(minX, r.x);
    minY = Math.min(minY, r.y);
    maxX = Math.max(maxX, r.x + r.width);
    maxY = Math.max(maxY, r.y + r.height);
  }
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

export interface RegionSnapshot {
  dataURL: string;
  width: number;
  height: number;
}

/**
 * Crop the rendered react-pdf canvas for `page` to the normalized `bbox`
 * (page-relative). Returns a base64 PNG plus its pixel dimensions, or null if
 * the page canvas isn't mounted.
 */
export function snapshotRegion(page: number, bbox: NoteRect, pad = 0.06): RegionSnapshot | null {
  const wrapper = document.querySelector(`[data-page-number="${page}"]`);
  const canvas = wrapper?.querySelector("canvas") as HTMLCanvasElement | null;
  if (!canvas) return null;

  const clamp = (v: number) => Math.max(0, Math.min(1, v));
  const x0 = clamp(bbox.x - pad);
  const y0 = clamp(bbox.y - pad);
  const x1 = clamp(bbox.x + bbox.width + pad);
  const y1 = clamp(bbox.y + bbox.height + pad);

  const sx = Math.round(x0 * canvas.width);
  const sy = Math.round(y0 * canvas.height);
  const sw = Math.max(1, Math.round((x1 - x0) * canvas.width));
  const sh = Math.max(1, Math.round((y1 - y0) * canvas.height));

  const out = document.createElement("canvas");
  out.width = sw;
  out.height = sh;
  const ctx = out.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(canvas, sx, sy, sw, sh, 0, 0, sw, sh);
  return { dataURL: out.toDataURL("image/png"), width: sw, height: sh };
}

/** Build an Excalidraw scene with the snapshot as a single locked background image. */
export function buildSnapshotScene(snap: RegionSnapshot): WhiteboardScene {
  const fileId = `pdfsnap-${Date.now()}`;
  const imageEl = {
    id: `${fileId}-el`,
    type: "image",
    x: 0,
    y: 0,
    width: snap.width,
    height: snap.height,
    angle: 0,
    strokeColor: "transparent",
    backgroundColor: "transparent",
    fillStyle: "solid",
    strokeWidth: 1,
    strokeStyle: "solid",
    roughness: 1,
    opacity: 100,
    groupIds: [],
    frameId: null,
    roundness: null,
    seed: 1,
    version: 1,
    versionNonce: 1,
    isDeleted: false,
    boundElements: null,
    updated: 1,
    link: null,
    locked: true,
    status: "saved",
    fileId,
    scale: [1, 1],
  };
  return {
    elements: [imageEl],
    files: {
      [fileId]: {
        id: fileId,
        mimeType: "image/png",
        dataURL: snap.dataURL,
        created: Date.now(),
      },
    },
    appState: { viewBackgroundColor: "#ffffff", gridSize: null },
  };
}
