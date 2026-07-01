import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { AffineEditorContainer, type Doc } from "../lib/blocksuite/api";
import { createCollection, createNotebookDoc, getNoteId } from "../lib/blocksuite/collection";
import { ensureBlockSuiteEffects } from "../components/notebook-v2/editor/effects";
import { buildScholarSpecs } from "../components/notebook-v2/editor/specs";
import { NotebookShell } from "../components/notebook-v2/NotebookShell";
import { useNotebookV2Store } from "../stores/useNotebookV2Store";

/**
 * Task 15 (in progress) — diagnostic mount: a full-height BlockSuite editor
 * wrapped in the paper shell. Seeds native + scholar content to verify both
 * render paths. Load/save wiring (Task 15) layers on next.
 */
export function NotebookV2() {
  const { id } = useParams<{ id?: string }>();
  const mountRef = useRef<HTMLDivElement>(null);
  const [doc, setDoc] = useState<Doc | null>(null);
  const setNotebookMeta = useNotebookV2Store((s) => s.setNotebookMeta);

  useEffect(() => {
    ensureBlockSuiteEffects();
    const collection = createCollection();
    const docId = String(id ?? "spike");
    const d = createNotebookDoc(collection, docId);
    const note = getNoteId(d);
    d.addBlock(
      "affine:paragraph",
      { type: "h1", text: new d.Text("Notebook V2 — BlockSuite") } as never,
      note,
    );
    d.addBlock(
      "affine:paragraph",
      { text: new d.Text("If you can edit this line, the editor is live. Start typing…") } as never,
      note,
    );
    d.addBlock(
      "scholar:callout",
      { tone: "insight", text: "This callout is a React-in-Lit scholar block." } as never,
      note,
    );
    setNotebookMeta({ id: docId, title: "Notebook V2", subtitle: "BlockSuite diagnostic" });
    setDoc(d);

    const editor = new AffineEditorContainer();
    editor.pageSpecs = buildScholarSpecs();
    editor.doc = d;
    editor.mode = "page";
    const host = mountRef.current;
    host?.appendChild(editor);
    // eslint-disable-next-line no-console
    console.log("[NotebookV2] editor mounted", { docId: d.id });

    return () => {
      editor.remove();
      d.dispose?.();
      setDoc(null);
    };
  }, [id, setNotebookMeta]);

  return (
    <NotebookShell
      doc={doc}
      editor={
        <div
          ref={mountRef}
          className="h-full w-full overflow-auto bg-paper p-6"
          style={{ minHeight: "85vh" }}
        />
      }
    />
  );
}
