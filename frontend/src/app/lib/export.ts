// Export helpers — render a DOM node (Mermaid SVG, mind-map tree, etc.) to a
// high-resolution PNG or a PDF. Uses html-to-image (DOM → PNG) + jsPDF.

import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

const SCALE = 2; // 2× pixel ratio for crisp, high-res output.

function triggerDownload(href: string, filename: string): void {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function safeName(name: string): string {
  return (name || "export").replace(/[^\w.-]+/g, "_");
}

/** Render `node` to a PNG data URL at high resolution. */
export async function nodeToPng(node: HTMLElement): Promise<string> {
  return toPng(node, {
    pixelRatio: SCALE,
    cacheBust: true,
    backgroundColor: getBg(node),
  });
}

/** Read an effective background so transparent areas don't export as black. */
function getBg(node: HTMLElement): string {
  const bg = getComputedStyle(node).backgroundColor;
  if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") return bg;
  return "#ffffff";
}

/** Export a DOM node as a downloaded PNG file. */
export async function exportNodeToPng(node: HTMLElement, name: string): Promise<void> {
  const url = await nodeToPng(node);
  triggerDownload(url, `${safeName(name)}.png`);
}

/** Export a DOM node as a downloaded single-page PDF sized to the image. */
export async function exportNodeToPdf(node: HTMLElement, name: string): Promise<void> {
  const url = await nodeToPng(node);
  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Failed to load rendered image"));
    img.src = url;
  });
  const w = img.width;
  const h = img.height;
  const pdf = new jsPDF({
    orientation: w >= h ? "landscape" : "portrait",
    unit: "px",
    format: [w, h],
  });
  pdf.addImage(url, "PNG", 0, 0, w, h);
  pdf.save(`${safeName(name)}.pdf`);
}
