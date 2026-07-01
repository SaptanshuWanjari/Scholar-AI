import type { Doc, DocCollection } from "./api";
import { getNoteId } from "./collection";

const HLEVEL: Record<number, string> = { 1: "h1", 2: "h2", 3: "h3" };

function droppedText(b: any): string {
  if (b.answer) return `${b.question ? b.question + "\n" : ""}${b.answer}`;
  if (b.title) return String(b.title);
  return JSON.stringify(b);
}

export function legacyBlocksToDoc(
  collection: DocCollection,
  id: string,
  blocks: any[],
): Doc {
  const doc = collection.createDoc({ id });
  doc.load(() => {
    const page = doc.addBlock("affine:page", {});
    const note = doc.addBlock("affine:note", {}, page);
    for (const b of blocks ?? []) {
      addLegacy(doc, note, b);
      for (const s of b?.metadata?.stickyNotes ?? []) {
        doc.addBlock(
          "scholar:sticky-note",
          { text: s.text ?? "", color: s.color ?? "yellow", pin: "push-pin", align: "inline" } as any,
          note,
        );
      }
    }
  });
  return doc;
}

function addLegacy(doc: Doc, note: string, b: any) {
  switch (b?.type) {
    case "heading":
      doc.addBlock(
        "affine:paragraph",
        { type: HLEVEL[b.level] ?? "h2", text: new doc.Text(b.text ?? "") } as any,
        note,
      );
      return;
    case "text":
      doc.addBlock("affine:paragraph", { text: new doc.Text(b.text ?? "") } as any, note);
      return;
    case "callout":
      doc.addBlock(
        "scholar:callout",
        { tone: b.tone ?? "note", text: b.text ?? "" } as any,
        note,
      );
      return;
    case "code":
      doc.addBlock(
        "affine:code",
        { language: b.lang ?? "", text: new doc.Text(b.code ?? "") } as any,
        note,
      );
      return;
    case "image":
      doc.addBlock(
        "affine:image",
        { sourceId: b.url ?? "", caption: b.alt ?? "" } as any,
        note,
      );
      return;
    case "mermaid":
      doc.addBlock("scholar:diagram", { code: b.code ?? "" } as any, note);
      return;
    case "sticky":
      doc.addBlock(
        "scholar:sticky-note",
        {
          text: b.text ?? "",
          color: b.color ?? "yellow",
          pin: "push-pin",
          align: "inline",
        } as any,
        note,
      );
      return;
    default:
      doc.addBlock(
        "affine:paragraph",
        { text: new doc.Text(droppedText(b)) } as any,
        note,
      );
  }
}
