import { createCollection, createNotebookDoc } from "./collection";
import {
  docToEnvelope,
  envelopeToDoc,
  isSnapshotEnvelope,
  type SnapshotEnvelope,
} from "./persistence";
import { legacyBlocksToDoc } from "./migrate-legacy";
import { projectDocToFlat, type FlatBlock } from "./project-flat";
import type { Doc, DocCollection } from "./api";
import { notebooksApi, type NotebookFull } from "../api/notebooks";

/**
 * Open (or create) a Doc for a notebook, using the dual-store contract:
 *   1. If the backend returns a `bs_snapshot` envelope -> hydrate from it.
 *   2. Else if `blocks` is non-empty -> one-shot migrate legacy -> block-suite.
 *   3. Else -> fresh empty doc (page + note).
 * In every case, both stores stay in sync on save: snapshot is the source of
 * truth, the flat `blocks` projection is regenerated as a backend-facing index.
 */
export async function loadNotebookDoc(notebookId: string): Promise<{
  doc: Doc;
  collection: DocCollection;
  meta: NotebookFull;
}> {
  const collection = createCollection();
  const meta = await notebooksApi.getNotebook(notebookId);
  const snap = meta.bs_snapshot;
  if (isSnapshotEnvelope(snap)) {
    const doc = await envelopeToDoc(collection, snap);
    return { doc, collection, meta };
  }
  if (meta.blocks && meta.blocks.length > 0) {
    return { doc: legacyBlocksToDoc(collection, meta.id, meta.blocks), collection, meta };
  }
  return { doc: createNotebookDoc(collection, meta.id), collection, meta };
}

/** Snapshot -> envelope + flat projection; ships both to the backend. */
export function snapshotNotebook(notebookId: string, doc: Doc) {
  return docToEnvelope(doc).then((envelope: SnapshotEnvelope) => ({
    bs_snapshot: envelope,
    blocks: projectDocToFlat(doc) as FlatBlock[],
  }));
}

/** Save the current Doc by id; returns the updated NotebookFull. */
export async function saveNotebookDoc(notebookId: string, doc: Doc): Promise<NotebookFull> {
  const patch = await snapshotNotebook(notebookId, doc);
  return notebooksApi.updateNotebook(notebookId, patch);
}
