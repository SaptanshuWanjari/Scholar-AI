import { describe, it, expect } from "vitest";
import { createCollection, getNoteId } from "./collection";

describe("scholar schemas", () => {
  it("register and create with prop defaults under affine:note", () => {
    const collection = createCollection();
    const doc = collection.createDoc({ id: "s" });
    doc.load(() => {
      const page = doc.addBlock("affine:page", {});
      doc.addBlock("affine:note", {}, page);
      const note = getNoteId(doc);
      const id = doc.addBlock("scholar:callout", {}, note);
      const model = doc.getBlock(id)!.model as unknown as {
        flavour: string;
        tone: string;
        text: string;
      };
      expect(model.flavour).toBe("scholar:callout");
      expect(model.tone).toBe("note");
      expect(model.text).toBe("");
    });
  });
});
