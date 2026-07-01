import { useEffect, useRef, useState } from "react";
import { AffineEditorContainer } from "../../../lib/blocksuite/api";
import { createCollection, createNotebookDoc } from "../../../lib/blocksuite/collection";
import { ensureBlockSuiteEffects } from "./effects";
import type { Doc } from "../../../lib/blocksuite/api";

export function useBlockSuiteEditor(notebookId: string) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [doc, setDoc] = useState<Doc | null>(null);

  useEffect(() => {
    ensureBlockSuiteEffects();
    const collection = createCollection();
    const d = createNotebookDoc(collection, notebookId);
    const editor = new AffineEditorContainer();
    editor.doc = d;
    editor.mode = "page";
    const host = mountRef.current;
    host?.appendChild(editor);
    setDoc(d);
    return () => {
      editor.remove();
      d.dispose?.();
      setDoc(null);
    };
  }, [notebookId]);

  return { mountRef, doc };
}
