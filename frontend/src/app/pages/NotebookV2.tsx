import { useEffect, useRef } from "react";
import { useParams } from "react-router";
import { AffineEditorContainer } from "../lib/blocksuite/api";
import { createCollection, createNotebookDoc, getNoteId } from "../lib/blocksuite/collection";
import { ensureBlockSuiteEffects } from "../components/notebook-v2/editor/effects";

/**
 * Task 15 (in progress) — diagnostic mount: a full-height BlockSuite editor
 * seeded with native content, to verify the core engine renders. The paper
 * shell (Task 13) and scholar-block specs (Task 11) layer on next.
 */
export function NotebookV2() {
  const { id } = useParams<{ id?: string }>();
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureBlockSuiteEffects();
    const collection = createCollection();
    const doc = createNotebookDoc(collection, String(id ?? "spike"));
    const note = getNoteId(doc);
    doc.addBlock(
      "affine:paragraph",
      { type: "h1", text: new doc.Text("Notebook V2 — BlockSuite") } as never,
      note,
    );
    doc.addBlock(
      "affine:paragraph",
      { text: new doc.Text("If you can edit this line, the editor is live. Start typing…") } as never,
      note,
    );

    const editor = new AffineEditorContainer();
    editor.doc = doc;
    editor.mode = "page";
    const host = mountRef.current;
    host?.appendChild(editor);
    // eslint-disable-next-line no-console
    console.log("[NotebookV2] editor mounted", { docId: doc.id });

    return () => {
      editor.remove();
    };
  }, [id]);

  return (
    <div
      ref={mountRef}
      className="h-full w-full overflow-auto bg-paper p-6"
      style={{ minHeight: "85vh" }}
    />
  );
}
