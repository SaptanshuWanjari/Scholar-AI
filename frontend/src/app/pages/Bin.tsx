import { useEffect, useState, useMemo } from "react";
import { Trash2, RotateCcw, Archive, Loader2 } from "lucide-react";
import { useBinStore } from "../stores/useBinStore";
import type { TrashItem } from "../lib/api/trash";
import { toast } from "@/app/lib/toast";
import { PaperButton, GhostButton } from "@/paper-ui/components/buttons";
import { ConfirmationDialog } from "@/paper-ui/components/dialogs";
import { PaperSheetCard } from "@/paper-ui/components/cards";
import { PaperH1 } from "@/paper-ui/core";

const TYPE_LABELS: Record<string, string> = {
  course: "Course",
  document: "Document",
  deck: "Flashcard Deck",
  card: "Flashcard",
  quiz: "Quiz",
  notebook: "Notebook",
  diagram: "Diagram",
  mindmap: "Mind Map",
  whiteboard: "Whiteboard",
  difference: "Difference Table",
  revision: "Revision Notes",
  prompt: "Prompt",
  pyq_paper: "PYQ Paper",
  pyq_question: "PYQ Question",
  learning_path: "Learning Path",
  learning_package: "Teach Package",
};

function daysAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 10) return `${days} days ago`;
  return `${Math.floor(days / 7)} weeks ago`;
}

export default function Bin() {
  const { items, grouped, loading, fetchItems, restoreItem, archiveItem, permanentDelete, purgeAll } = useBinStore();
  const [purgeConfirmOpen, setPurgeConfirmOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: string; title: string } | null>(null);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleRestore = async (item: TrashItem) => {
    try {
      await restoreItem(item.artifact_type, item.artifact_id);
      toast.success("Restored", { description: `${item.title} has been restored.` });
    } catch {
      toast.error("Failed", { description: "Could not restore item." });
    }
  };

  const handleArchive = async (item: TrashItem) => {
    try {
      await archiveItem(item.artifact_type, item.artifact_id, !item.archived);
    } catch {
      toast.error("Failed", { description: "Could not toggle archive." });
    }
  };

  const handlePermanentDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await permanentDelete(deleteConfirm.type, deleteConfirm.id);
      toast.success("Deleted", { description: `${deleteConfirm.title} permanently deleted.` });
    } catch {
      toast.error("Failed", { description: "Could not delete item." });
    }
    setDeleteConfirm(null);
  };

  const handlePurgeAll = async () => {
    try {
      await purgeAll();
      toast.success("Purged", { description: "All expired items removed." });
    } catch {
      toast.error("Failed", { description: "Could not purge items." });
    }
    setPurgeConfirmOpen(false);
  };

  const typeGroups = useMemo(() => Object.entries(grouped), [grouped]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <PaperH1>Global Bin</PaperH1>
          <p className="text-sm text-muted-foreground mt-1">
            {items.length} item{items.length !== 1 ? "s" : ""} · Permanently deleted after 10 days
          </p>
        </div>
        {items.length > 0 && (
          <PaperButton onClick={() => setPurgeConfirmOpen(true)}>
            Empty Bin
          </PaperButton>
        )}
      </div>

      {items.length === 0 ? (
        <PaperSheetCard className="text-center p-12">
          <div className="text-6xl mb-4">🗑️</div>
          <h2 className="text-xl font-semibold mb-2">Bin is empty</h2>
          <p className="text-muted-foreground mb-6">
            Deleted items will appear here for 10 days before permanent removal.
          </p>
        </PaperSheetCard>
      ) : (
        <div className="space-y-6">
          {typeGroups.map(([type, typeItems]) => (
            <PaperSheetCard key={type} className="p-4">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
                <span className="font-medium">{TYPE_LABELS[type] || type}</span>
                <span className="text-xs text-muted-foreground ml-auto">{typeItems.length}</span>
              </div>
              <div className="space-y-1">
                {typeItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{item.title}</div>
                      <div className="text-xs text-muted-foreground flex gap-2">
                        {item.course_name && <span>{item.course_name}</span>}
                        {item.course_name && <span>·</span>}
                        <span>{daysAgo(item.deleted_at)}</span>
                        {item.archived && (
                          <>
                            <span>·</span>
                            <span className="text-amber-500">Archived</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      <GhostButton onClick={() => handleRestore(item)} title="Restore">
                        <RotateCcw className="w-4 h-4" />
                      </GhostButton>
                      <GhostButton onClick={() => handleArchive(item)} title={item.archived ? "Unarchive" : "Archive"}>
                        <Archive className={`w-4 h-4 ${item.archived ? "text-amber-500" : ""}`} />
                      </GhostButton>
                      <GhostButton
                        onClick={() =>
                          setDeleteConfirm({ type: item.artifact_type, id: item.artifact_id, title: item.title })
                        }
                        title="Delete permanently"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </GhostButton>
                    </div>
                  </div>
                ))}
              </div>
            </PaperSheetCard>
          ))}
        </div>
      )}

      <ConfirmationDialog
        open={purgeConfirmOpen}
        onConfirm={handlePurgeAll}
        onCancel={() => setPurgeConfirmOpen(false)}
        title="Empty Bin?"
        message="Permanently delete all expired items? Archived items will be kept."
        confirmLabel="Delete All"
        destructive
      />

      <ConfirmationDialog
        open={!!deleteConfirm}
        onConfirm={handlePermanentDelete}
        onCancel={() => setDeleteConfirm(null)}
        title="Delete Permanently?"
        message={`"${deleteConfirm?.title}" will be permanently deleted. This cannot be undone.`}
        confirmLabel="Delete"
        destructive
      />
    </div>
  );
}
