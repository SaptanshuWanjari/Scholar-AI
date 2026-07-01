import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useNotebookV2Store } from "../stores/useNotebookV2Store";
import { api, type NotebookMeta } from "../lib/api";
import { parseBackendNotebook, serializeV2Notebook } from "../lib/notebook-v2-parser";
import { useAutoSave } from "../hooks/useAutoSave";
// TEMP spike — replaced by NotebookShell in Task 12
import { useBlockSuiteEditor } from "../components/notebook-v2/editor/useBlockSuiteEditor";

function Spike({ id }: { id: string }) {
  const { mountRef } = useBlockSuiteEditor(id);
  return <div ref={mountRef} style={{ height: "100%", overflow: "auto" }} />;
}

export function NotebookV2() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  
  const [list, setList] = useState<NotebookMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDraftBanner, setShowDraftBanner] = useState(false);
  
  const notebook = useNotebookV2Store((s) => s.notebook);
  const loadNotebook = useNotebookV2Store((s) => s.loadNotebook);

  const saveFn = useCallback(async (nextNb: any) => {
    if (!id || !nextNb) return;
    const blocks = serializeV2Notebook(nextNb);
    await api.updateNotebook(id, {
      blocks,
      is_draft: true,
    });
  }, [id]);

  const { schedule: autoSave, flush: flushSave, saving } = useAutoSave(saveFn);

  // Subscribe to store changes to trigger autosave
  useEffect(() => {
    const unsub = useNotebookV2Store.subscribe((state, prevState) => {
      if (state.notebook && state.notebook !== prevState.notebook) {
        autoSave(state.notebook);
      }
    });
    return unsub;
  }, [autoSave]);

  useEffect(() => {
    window.addEventListener("beforeunload", flushSave);
    return () => window.removeEventListener("beforeunload", flushSave);
  }, [flushSave]);

  // Load list on mount
  useEffect(() => {
    api.listNotebooks()
      .then((nbs) => {
        setList(nbs);
        if (nbs.length > 0 && !id) {
          navigate(`/notebook-v2/${nbs[0].id}`, { replace: true });
        } else if (nbs.length === 0) {
          // If no notebooks, we could show empty state or create one.
          // For now, let's just stop loading.
          setLoading(false);
        }
      })
      .catch((e) => toast.error(`Failed to load notebooks: ${e.message}`));
  }, [id, navigate]);

  // Load specific notebook
  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    
    api.getNotebook(id)
      .then((nb) => {
        if (cancelled) return;
        const v2Nb = parseBackendNotebook(nb);
        loadNotebook(v2Nb);
        setShowDraftBanner(nb.is_draft === true);
      })
      .catch((e) => {
        if (!cancelled) toast.error(`Failed to open notebook: ${e.message}`);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
      
    return () => {
      cancelled = true;
    };
  }, [id, loadNotebook]);

  if (loading) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 bg-paper text-ink/40">
        <Loader2 className="size-6 animate-spin" />
        <p className="font-caveat text-xl">Loading notebook...</p>
      </div>
    );
  }

  if (!notebook && list.length === 0) {
    return (
      <div className="flex h-full items-center justify-center bg-paper text-ink/30">
        <p className="font-caveat text-lg">No notebooks available.</p>
      </div>
    );
  }

  return (
    <>
      {showDraftBanner && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between rounded-md border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800 shadow-sm">
          <span>Auto-saved changes from your last session have been restored.</span>
          <button
            className="ml-4 font-medium underline hover:no-underline"
            onClick={() => {
              flushSave();
              setShowDraftBanner(false);
              if (id) api.updateNotebook(id, { is_draft: false }).catch(() => {});
            }}
          >
            Got it
          </button>
        </div>
      )}
      <Spike id={id ?? "spike"} />
    </>
  );
}
