import type { Doc } from "./api";
import { getNoteId } from "./collection";

export type FlatBlock = { type: string; [k: string]: unknown };

const HEADING_LEVEL: Record<string, number> = { h1: 1, h2: 2, h3: 3 };

export function projectDocToFlat(doc: Doc): FlatBlock[] {
  const noteId = getNoteId(doc);
  const note = doc.getBlock(noteId)!.model;
  const out: FlatBlock[] = [];

  for (const child of note.children) {
    const m = child as any;
    switch (m.flavour) {
      case "affine:paragraph": {
        const text = m.text?.toString() ?? "";
        if (m.type && HEADING_LEVEL[m.type]) {
          out.push({ type: "heading", level: HEADING_LEVEL[m.type], text });
        } else {
          out.push({ type: "text", text });
        }
        break;
      }
      case "affine:list":
        out.push({ type: "text", text: "- " + (m.text?.toString() ?? "") });
        break;
      case "affine:code":
        out.push({ type: "code", lang: m.language ?? "", code: m.text?.toString() ?? "" });
        break;
      case "affine:image":
        out.push({ type: "image", url: m.sourceId ?? "", alt: m.caption ?? "" });
        break;
      case "scholar:callout":
        out.push({ type: "callout", tone: m.tone, text: m.text });
        break;
      case "scholar:sticky-note":
        out.push({ type: "sticky", text: m.text, color: m.color });
        break;
      case "scholar:diagram":
        out.push({ type: "mermaid", code: m.code });
        break;
      case "scholar:page-break":
        out.push({ type: "page-break", label: m.label });
        break;
    }
  }
  return out;
}
