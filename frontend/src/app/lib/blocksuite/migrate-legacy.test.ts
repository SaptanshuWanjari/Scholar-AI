import { describe, it, expect } from "vitest";
import { createCollectionWithScholar, getNoteId } from "./collection";
import { legacyBlocksToDoc } from "./migrate-legacy";

describe("legacyBlocksToDoc", () => {
  it("maps known types and preserves dropped-type text", () => {
    const c = createCollectionWithScholar();
    const doc = legacyBlocksToDoc(c, "m1", [
      { type: "heading", level: 1, text: "Minimax" },
      { type: "callout", tone: "insight", text: "Key" },
      { type: "ai-answer", question: "Q", answer: "A" },
    ]);
    const note = doc.getBlock(getNoteId(doc))!.model;
    const kinds = note.children.map((c: any) => c.flavour);
    expect(kinds).toEqual(["affine:paragraph", "scholar:callout", "affine:paragraph"]);
    // dropped ai-answer keeps its text
    expect((note.children[2] as any).text.toString()).toContain("A");
  });

  it("promotes metadata sticky notes to standalone blocks", () => {
    const c = createCollectionWithScholar();
    const doc = legacyBlocksToDoc(c, "m2", [
      { type: "text", text: "Body", metadata: { stickyNotes: [{ text: "note!", color: "yellow" }] } },
    ]);
    const note = doc.getBlock(getNoteId(doc))!.model;
    expect(note.children.map((c: any) => c.flavour)).toEqual([
      "affine:paragraph",
      "scholar:sticky-note",
    ]);
  });
});
