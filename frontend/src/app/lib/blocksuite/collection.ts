import { DocCollection, Schema, type Doc } from "./api";
import { AffineSchemas } from "./api";
import { ScholarSchemas } from "./schemas";

/**
 * Build a schema registering affine + scholar blocks. `affine:note` ships a
 * hardcoded children allowlist that only permits `affine:*` blocks, so we widen
 * it with `scholar:*` to let our custom blocks live under the note.
 */
function buildSchema(): Schema {
  const schema = new Schema().register(AffineSchemas).register(ScholarSchemas);
  const note = (schema as unknown as {
    flavourSchemaMap: Map<string, { model: { children: string[] } }>;
  }).flavourSchemaMap.get("affine:note");
  if (note && !note.model.children.includes("scholar:*")) {
    note.model.children.push("scholar:*");
  }
  return schema;
}

export function createCollection(): DocCollection {
  const collection = new DocCollection({ schema: buildSchema() });
  // Required in 0.19.5 before createDoc() returns a usable Doc.
  collection.meta.initialize();
  return collection;
}

/** Scholar blocks are always registered; kept as a named alias for callers. */
export const createCollectionWithScholar = createCollection;

/** Empty notebook doc: page > note (blocks are added under the note). */
export function createNotebookDoc(collection: DocCollection, id: string): Doc {
  const doc = collection.createDoc({ id });
  doc.load(() => {
    const pageId = doc.addBlock("affine:page", {});
    doc.addBlock("affine:note", {}, pageId);
  });
  return doc;
}

/** The id of the note block that holds top-level content. */
export function getNoteId(doc: Doc): string {
  const page = doc.root;
  const note = page?.children.find((b) => b.flavour === "affine:note");
  if (!note) throw new Error("notebook doc missing affine:note");
  return note.id;
}
