import { Job, type Doc, type DocSnapshot, type DocCollection } from "./api";

export type SnapshotEnvelope = {
  format: "blocksuite-snapshot@1";
  snapshot: DocSnapshot;
};

export function wrapSnapshot(snapshot: DocSnapshot): SnapshotEnvelope {
  return { format: "blocksuite-snapshot@1", snapshot };
}

export function isSnapshotEnvelope(v: unknown): v is SnapshotEnvelope {
  return (
    !!v &&
    typeof v === "object" &&
    (v as Record<string, unknown>).format === "blocksuite-snapshot@1" &&
    "snapshot" in (v as Record<string, unknown>)
  );
}

export async function docToEnvelope(doc: Doc): Promise<SnapshotEnvelope> {
  const job = new Job({ collection: doc.collection });
  const snapshot = job.docToSnapshot(doc);
  if (!snapshot) throw new Error("docToSnapshot returned undefined");
  return wrapSnapshot(snapshot);
}

export async function envelopeToDoc(
  collection: DocCollection,
  env: SnapshotEnvelope,
): Promise<Doc> {
  const job = new Job({ collection });
  const doc = await job.snapshotToDoc(env.snapshot);
  if (!doc) throw new Error("snapshotToDoc returned undefined");
  return doc;
}
