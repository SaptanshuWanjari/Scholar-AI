// Universal "Add to Notebook" action. Drop into any artifact page: it lets the
// user pick a target notebook (or create one), serializes the artifact to
// Markdown client-side, and appends it via the backend append endpoint. If the
// backend flags the content as a near-duplicate, the user is prompted to Merge
// into the existing block or Skip.

import { useCallback, useState } from "react";
import { BookPlus, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { api, type NotebookMeta } from "../lib/api";
import { artifactLabel, serializeArtifact } from "../lib/serializers";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";

interface AddToNotebookMenuProps {
  artifactType: string;
  /** Raw artifact payload; serialized by `serializeArtifact(artifactType, content)`. */
  content: unknown;
  sourceId: string;
  label?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
  className?: string;
  course?: string | null;
}

interface DedupState {
  notebookId: string;
  markdown: string;
  existingIndex: number | null;
}

export function AddToNotebookMenu({
  artifactType,
  content,
  sourceId,
  label = "Add to Notebook",
  variant = "outline",
  size = "sm",
  className,
  course,
}: AddToNotebookMenuProps) {
  const [notebooks, setNotebooks] = useState<NotebookMeta[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [dedup, setDedup] = useState<DedupState | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");

  const loadNotebooks = useCallback(async (open: boolean) => {
    if (!open || notebooks !== null) return;
    setLoading(true);
    try {
      setNotebooks(await api.listNotebooks());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load notebooks");
      setNotebooks([]);
    } finally {
      setLoading(false);
    }
  }, [notebooks]);

  const appendTo = useCallback(
    async (notebookId: string, notebookName?: string) => {
      let markdown: string;
      try {
        markdown = serializeArtifact(artifactType, content);
      } catch {
        toast.error("Could not serialize this artifact");
        return;
      }
      if (!markdown.trim()) {
        toast.error("Nothing to add");
        return;
      }
      setBusy(true);
      try {
        const res = await api.appendToNotebook(notebookId, markdown, artifactType, sourceId);
        if (res.redundant) {
          setDedup({ notebookId, markdown, existingIndex: res.existing_block_index });
          return;
        }
        toast.success(`Added to ${notebookName ?? "notebook"}`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to add to notebook");
      } finally {
        setBusy(false);
      }
    },
    [artifactType, content, sourceId],
  );

  const forceAppend = useCallback(async () => {
    if (!dedup) return;
    setBusy(true);
    try {
      await api.appendToNotebook(dedup.notebookId, dedup.markdown, artifactType, sourceId, true);
      toast.success("Added to notebook");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add to notebook");
    } finally {
      setBusy(false);
      setDedup(null);
    }
  }, [dedup, artifactType, sourceId]);

  const mergeIntoExisting = useCallback(async () => {
    if (!dedup || dedup.existingIndex === null) {
      // No specific block to merge into — fall back to a forced append.
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
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to merge");
    } finally {
      setBusy(false);
    }
  }, [dedup, forceAppend]);

  const createAndAppend = useCallback(async () => {
    const name = newName.trim();
    if (!name) return;
    setBusy(true);
    try {
      const nb = await api.createNotebook(name, course ?? null);
      setNotebooks((prev) => (prev ? null : prev)); // invalidate cache; reloads on next open
      setCreateOpen(false);
      setNewName("");
      await appendTo(nb.id, name);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create notebook");
    } finally {
      setBusy(false);
    }
  }, [newName, course, appendTo]);

  return (
    <>
      <DropdownMenu onOpenChange={loadNotebooks}>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} size={size} className={className} disabled={busy}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : <BookPlus className="size-4" />}
            {label && <span className="ml-1.5">{label}</span>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60">
          <DropdownMenuLabel>Add to notebook</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {loading && (
            <div className="flex items-center gap-2 px-2 py-3 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Loading…
            </div>
          )}
          {!loading && notebooks?.length === 0 && (
            <div className="px-2 py-3 text-sm text-muted-foreground">No notebooks yet.</div>
          )}
          {!loading &&
            notebooks?.map((nb) => (
              <DropdownMenuItem key={nb.id} onSelect={() => appendTo(nb.id, nb.name)}>
                <span
                  className="mr-2 size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: nb.color }}
                />
                <span className="truncate">{nb.name}</span>
              </DropdownMenuItem>
            ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setCreateOpen(true)}>
            <Plus className="mr-2 size-4" /> Create new notebook
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dedup warning */}
      <AlertDialog open={dedup !== null} onOpenChange={(o) => !o && setDedup(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Similar content already exists</AlertDialogTitle>
            <AlertDialogDescription>
              This {artifactLabel(artifactType).toLowerCase()} looks very similar to something
              already in the notebook. Merge it into the existing note, or skip to avoid
              duplicates.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Skip</AlertDialogCancel>
            <AlertDialogAction onClick={mergeIntoExisting} disabled={busy}>
              {busy ? "Merging…" : "Merge"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create new notebook */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New notebook</DialogTitle>
          </DialogHeader>
          <Input
            autoFocus
            placeholder="Notebook name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") createAndAppend();
            }}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)} disabled={busy}>
              Cancel
            </Button>
            <Button onClick={createAndAppend} disabled={busy || !newName.trim()}>
              {busy ? "Creating…" : "Create & add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
