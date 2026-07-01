import { describe, it, expect } from "vitest";
import { createCollection, getNoteId } from "./collection";
import { projectDocToFlat } from "./project-flat";

function makeDoc() {
  const doc = createCollection().createDoc({ id: "p" });
  doc.load(() => {
    const page = doc.addBlock("affine:page", {});
    doc.addBlock("affine:note", {}, page);
  });
  return doc;
}

describe("projectDocToFlat", () => {
  it("projects native and scholar blocks to flat shape", () => {
    const doc = makeDoc();
    const note = getNoteId(doc);
    doc.addBlock("affine:paragraph", { type: "h1", text: new doc.Text("Minimax") } as any, note);
    doc.addBlock("affine:paragraph", { text: new doc.Text("Body") } as any, note);
    doc.addBlock("scholar:callout", { tone: "insight", text: "Key idea" } as any, note);
    doc.addBlock("scholar:diagram", { code: "graph TD;A-->B" } as any, note);

    const flat = projectDocToFlat(doc);
    expect(flat).toEqual([
      { type: "heading", level: 1, text: "Minimax" },
      { type: "text", text: "Body" },
      { type: "callout", tone: "insight", text: "Key idea" },
      { type: "mermaid", code: "graph TD;A-->B" },
    ]);
  });
});
