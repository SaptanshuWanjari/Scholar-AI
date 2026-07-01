import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { AffineEditorContainer, type Doc } from "../lib/blocksuite/api";
import { createCollection, createNotebookDoc } from "../lib/blocksuite/collection";
import { loadNotebookDoc } from "../lib/blocksuite/notebookStore";
import { ensureBlockSuiteEffects } from "../components/notebook-v2/editor/effects";
import { buildScholarSpecs } from "../components/notebook-v2/editor/specs";
import { NotebookShell } from "../components/notebook-v2/NotebookShell";
import { useNotebookV2Store } from "../stores/useNotebookV2Store";

export function NotebookV2() {
  const { id } = useParams<{ id?: string }>();
  const mountRef = useRef<HTMLDivElement>(null);
  const [doc, setDoc] = useState<Doc | null>(null);
  const [loading, setLoading] = useState(true);
  const setNotebookMeta = useNotebookV2Store((s) => s.setNotebookMeta);

  useEffect(() => {
    ensureBlockSuiteEffects();

    let cancelled = false;
    let editor: AffineEditorContainer | null = null;
    let currentDoc: Doc | null = null;

    (async () => {
      let d: Doc;
      try {
        if (id) {
          const loaded = await loadNotebookDoc(id);
          if (cancelled) { loaded.doc.dispose?.(); return; }
          d = loaded.doc;
          setNotebookMeta({ id: loaded.meta.id, title: loaded.meta.title, subtitle: loaded.meta.subtitle });
        } else {
          const collection = createCollection();
          d = createNotebookDoc(collection, "new");
          setNotebookMeta({ id: "", title: "New Notebook", subtitle: "Untitled" });
        }
      } catch {
        const collection = createCollection();
        d = createNotebookDoc(collection, "new");
        setNotebookMeta({ id: "", title: "Notebook", subtitle: "Offline fallback" });
      }

      if (cancelled) { d.dispose?.(); return; }
      currentDoc = d;
      setDoc(d);
      setLoading(false);

      editor = new AffineEditorContainer();
      editor.pageSpecs = buildScholarSpecs();
      editor.doc = d;
      editor.mode = "page";
      mountRef.current?.appendChild(editor);
    })();

    return () => {
      cancelled = true;
      editor?.remove();
      currentDoc?.dispose?.();
      setDoc(null);
      setLoading(true);
    };
  }, [id, setNotebookMeta]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-ink/50">
        Loading notebook…
      </div>
    );
  }

  return (
    <NotebookShell
      doc={doc}
      editor={
        <div
          ref={mountRef}
          className="h-full w-full"
          style={{ minHeight: "85vh" }}
        />
      }
    />
  );
}
