import { DocCollection, Schema, type Doc } from "./api";
import { AffineSchemas } from "./api";

export function createCollection(): DocCollection {
  const schema = new Schema().register(AffineSchemas);
  const collection = new DocCollection({ schema });
  // Required in 0.19.5 before createDoc() returns a usable Doc.
  collection.meta.initialize();
  return collection;
}

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
