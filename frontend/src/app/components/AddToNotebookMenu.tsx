// Universal "Add to Notebook" action. Drop into any artifact page: it opens a
// modal where the user can pick a target notebook (or create a new one),
// serializes the artifact to Markdown client-side, and appends it via the
// backend append endpoint. If the backend flags the content as a near-duplicate,
// the user is prompted to Merge into the existing block or Skip.
//
// Notebook management (rename/delete) lives on the Notebooks page sidebar, not
// here — this modal is only for choosing a target.

import { useCallback, useState } from "react";
import { BookPlus, Loader2, Plus } from "lucide-react";
import { toast } from "@/app/lib/toast";

import { api, type NotebookMeta } from "../lib/api";
import type { NotebookBlock } from "../lib/notebook-data";
import { artifactLabel, serializeArtifact } from "../lib/serializers";
import { NOTE_CATEGORIES, type CategoryMeta } from "../stores/useReadingNotesStore";
import { useNotificationStore } from "../stores/useNotificationStore";
import { PaperButton } from "@/paper-ui/components/buttons";
import { PaperInput } from "@/paper-ui/components/inputs";
import { PaperModal, ConfirmationDialog } from "@paper-ui/components/dialogs";
import { cn } from "@paper-ui/utils";

interface AddToNotebookMenuProps {
  artifactType?: string;
  content?: unknown;
  sourceId?: string;
  label?: string;
  tone?: React.ComponentProps<typeof PaperButton>["tone"];
  size?: React.ComponentProps<typeof PaperButton>["size"];
  className?: string;
  course?: string | null;
  noteData?: { docId: string; page: number; id: string; cat: string };
  customBlocks?: () => NotebookBlock[] | Promise<NotebookBlock[]>;
  trigger?: React.ReactNode;
  asyncBackground?: boolean;
  backgroundTitle?: string;
}

interface DedupState {
  notebookId: string;
  notebookName: string;
  markdown: string;
  existingIndex: number | null;
}

export function AddToNotebookMenu({
  artifactType,
  content,
  sourceId,
  label = "Add to Notebook",
  tone = "paper",
  size = "sm",
  className,
  course,
  customBlocks,
  trigger,
  asyncBackground,
  backgroundTitle,
}: AddToNotebookMenuProps) {
  const [open, setOpen] = useState(false);
  const [notebooks, setNotebooks] = useState<NotebookMeta[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [dedup, setDedup] = useState<DedupState | null>(null);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  // Id of the notebook currently being appended to (drives the row spinner).
  const [pendingId, setPendingId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setNotebooks(await api.listNotebooks());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load notebooks");
      setNotebooks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const onOpenChange = useCallback(
    (next: boolean) => {
      setOpen(next);
      if (next) {
        setNewName("");
        setCreating(false);
        void refresh();
      }
    },
    [refresh],
  );

  const serialize = useCallback((): string | null => {
    if (!artifactType) return null;
    let markdown: string;
    try {
      markdown = serializeArtifact(artifactType, content);
    } catch {
      toast.error("Could not serialize this artifact");
      return null;
    }
    if (!markdown.trim()) {
      toast.error("Nothing to add");
      return null;
    }
    return markdown;
  }, [artifactType, content]);

  const addTo = useCallback(
    async (notebookId: string, notebookName: string) => {
      if (customBlocks) {
        if (asyncBackground) {
          setOpen(false);
          toast.info(backgroundTitle || "Adding to notebook...", { description: "Running in background" });
          try {
            const blocks = await customBlocks();
            const nb = await api.getNotebook(notebookId);
            await api.updateNotebook(notebookId, { blocks: [...(nb.blocks ?? []), ...blocks] });
            useNotificationStore.getState().add({ title: `${backgroundTitle || "Item"} added to ${notebookName}`, status: "success" });
          } catch (err) {
            useNotificationStore.getState().add({ title: `Failed to add to ${notebookName}`, status: "error", message: err instanceof Error ? err.message : "Error" });
          }
          return;
        }

        setBusy(true);
        setPendingId(notebookId);
        try {
          const blocks = await customBlocks();
          const nb = await api.getNotebook(notebookId);
          await api.updateNotebook(notebookId, { blocks: [...(nb.blocks ?? []), ...blocks] });
          toast.success(`Added to ${notebookName}`);
          setOpen(false);
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Failed to add to notebook");
        } finally {
          setBusy(false);
          setPendingId(null);
        }
        return;
      }
      const markdown = serialize();
      if (markdown === null) return;
      setBusy(true);
      setPendingId(notebookId);
      try {
        const res = await api.appendToNotebook(notebookId, markdown, artifactType!, sourceId!);
        if (res.redundant) {
          setDedup({ notebookId, notebookName, markdown, existingIndex: res.existing_block_index });
          return;
        }
        toast.success(`Added to ${notebookName}`);
        setOpen(false);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to add to notebook");
      } finally {
        setBusy(false);
        setPendingId(null);
      }
    },
    [customBlocks, serialize, artifactType, sourceId],
  );

  const createAndAdd = useCallback(async () => {
    const name = newName.trim();
    if (!name) return;
    if (!customBlocks && serialize() === null) return;
    
    if (customBlocks && asyncBackground) {
      setOpen(false);
      toast.info(backgroundTitle || "Adding to notebook...", { description: "Running in background" });
      try {
        const nb = await api.createNotebook(name, course ?? null);
        setNewName("");
        setCreating(false);
        void refresh();
        const blocks = await customBlocks();
        await api.updateNotebook(nb.id, { blocks: [...(nb.blocks ?? []), ...blocks] });
        useNotificationStore.getState().add({ title: `${backgroundTitle || "Item"} added to ${nb.title}`, status: "success" });
      } catch (err) {
        useNotificationStore.getState().add({ title: `Failed to create/add`, status: "error", message: err instanceof Error ? err.message : "Error" });
      }
      return;
    }

    setBusy(true);
    try {
      const nb = await api.createNotebook(name, course ?? null);
      setNewName("");
      setCreating(false);
      await refresh();
      await addTo(nb.id, nb.title);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create notebook");
    } finally {
      setBusy(false);
    }
  }, [newName, serialize, course, refresh, addTo, customBlocks, asyncBackground, backgroundTitle]);

  const forceAppend = useCallback(async () => {
    if (!dedup) return;
    setBusy(true);
    try {
      await api.appendToNotebook(dedup.notebookId, dedup.markdown, artifactType!, sourceId!, true);
      toast.success(`Added to ${dedup.notebookName}`);
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add to notebook");
    } finally {
      setBusy(false);
      setDedup(null);
    }
  }, [dedup, artifactType, sourceId]);

  const mergeIntoExisting = useCallback(async () => {
    if (!dedup || dedup.existingIndex === null) {
      await forceAppend();
      return;
    }
    setBusy(true);
    try {
      const nb = await api.getNotebook(dedup.notebookId);
      const blocks = [...(nb.blocks ?? [])];
      const target = blocks[dedup.existingIndex] as { text?: string } | undefined;
      if (!target) {
        await forceAppend();
        return;
      }
      blocks[dedup.existingIndex] = {
        ...target,
        text: `${target.text ?? ""}\n\n${dedup.markdown}`.trim(),
      };
      await api.updateNotebook(dedup.notebookId, { blocks });
      toast.success("Merged into existing note");
      setDedup(null);
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to merge");
    } finally {
      setBusy(false);
    }
  }, [dedup, forceAppend]);  return (
    <>
      <span onClick={() => onOpenChange(true)} className={cn("contents", className)}>
        {trigger ? (
          trigger
        ) : (
          <PaperButton tone={tone} size={size}>
            <BookPlus className="size-4" />
            {label && <span className="ml-1.5">{label}</span>}
          </PaperButton>
        )}
      </span>

      <PaperModal
        open={open}
        onClose={() => onOpenChange(false)}
        title="Add to notebook"
        width={440}
      >
        <div className="font-kalam text-[13px] text-ink-muted mb-4">
          Pick a notebook to add this {artifactLabel(artifactType ?? "").toLowerCase()} to.
        </div>

        <div className="max-h-60 space-y-1 overflow-y-auto py-1">
          {loading && (
            <div className="flex items-center gap-2 px-2 py-6 text-sm text-ink-muted font-kalam">
              <Loader2 className="size-4 animate-spin" /> Loading…
            </div>
          )}
          {!loading && notebooks?.length === 0 && (
            <div className="px-2 py-6 text-center text-sm text-ink-muted font-kalam">
              No notebooks yet. Create one below.
            </div>
          )}
          {!loading &&
            notebooks?.map((nb) => (
              <button
                key={nb.id}
                type="button"
                disabled={busy}
                onClick={() => void addTo(nb.id, nb.name)}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-black/[0.03] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pendingId === nb.id ? (
                  <Loader2 className="size-3.5 shrink-0 animate-spin text-[#6f63a3]" />
                ) : (
                  <span
                    className="size-2.5 shrink-0 rounded-full border border-black/10"
                    style={{ backgroundColor: nb.color }}
                  />
                )}
                <div className="min-w-0 flex-1 leading-tight font-kalam">
                  <span className="block truncate text-[14px] font-bold text-ink">{nb.name}</span>
                  <span className="block truncate text-xs text-ink-muted mt-0.5">
                    {pendingId === nb.id
                      ? "Adding…"
                      : `${nb.course || "Uncategorized"} · ${nb.notes} notes`}
                  </span>
                </div>
              </button>
            ))}
        </div>

        <div className="border-t border-border pt-4 mt-3">
          {creating ? (
            <div className="flex items-center gap-2">
              <PaperInput
                autoFocus
                placeholder="Notebook name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void createAndAdd();
                  if (e.key === "Escape") setCreating(false);
                }}
                className="h-9"
                wrapperClassName="flex-1 min-w-0"
              />
              <PaperButton onClick={() => void createAndAdd()} disabled={busy || !newName.trim()} size="sm">
                {busy ? <Loader2 className="size-4 animate-spin" /> : "+"}
              </PaperButton>
            </div>
          ) : (
            <PaperButton
              tone="paper"
              className="w-full justify-center gap-1.5"
              onClick={() => setCreating(true)}
              size="md"
            >
              <Plus className="size-4" /> Create new notebook
            </PaperButton>
          )}
        </div>
      </PaperModal>

      {/* Dedup warning */}
      <ConfirmationDialog
        open={dedup !== null}
        onConfirm={mergeIntoExisting}
        onCancel={() => setDedup(null)}
        title="Similar content already exists"
        message={
          <>
            This {artifactLabel(artifactType ?? "").toLowerCase()} looks very similar to something
            already in “{dedup?.notebookName}”. Merge it into the existing note, or skip to
            avoid duplicates.
          </>
        }
        confirmLabel={busy ? "Merging…" : "Merge"}
        cancelLabel="Skip"
      />
    </>
  );
}
