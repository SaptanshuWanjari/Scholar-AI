import { describe, it, expect } from "vitest";
import { createNotebookDoc, createCollection, getNoteId } from "./collection";
import { docToEnvelope, envelopeToDoc, isSnapshotEnvelope, wrapSnapshot } from "./persistence";

describe("snapshot envelope", () => {
  it("wraps and type-guards", () => {
    const env = wrapSnapshot({} as never);
    expect(env.format).toBe("blocksuite-snapshot@1");
    expect(isSnapshotEnvelope(env)).toBe(true);
    expect(isSnapshotEnvelope({ type: "text" })).toBe(false);
    expect(isSnapshotEnvelope(null)).toBe(false);
  });

  it("round-trips a doc through snapshot", async () => {
    const c1 = createCollection();
    const doc = createNotebookDoc(c1, "n1");
    const noteId = getNoteId(doc);
    doc.addBlock("affine:paragraph", { text: new doc.Text("Hello minimax") } as never, noteId);

    const env = await docToEnvelope(doc);
    expect(isSnapshotEnvelope(env)).toBe(true);

    const c2 = createCollection();
    const restored = await envelopeToDoc(c2, env);
    const noteId2 = getNoteId(restored);
    const para = restored.getBlock(noteId2)?.model.children[0];
    expect(para?.flavour).toBe("affine:paragraph");
    expect(para?.text?.toString()).toContain("Hello minimax");
  });
});
