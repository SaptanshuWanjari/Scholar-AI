import { useEffect, useState, useMemo } from "react";
import { Trash2, RotateCcw, Archive, Loader2 } from "lucide-react";
import { useBinStore } from "../stores/useBinStore";
import { Page } from "../components/Page";
import type { TrashItem } from "../lib/api/trash";
import { toast } from "@/app/lib/toast";
import { PaperButton, IconButton } from "@/paper-ui/components/buttons";
import { ConfirmationDialog } from "@/paper-ui/components/dialogs";
import { StickyNoteCard } from "@/paper-ui/components/cards";
import { PaperH1, PaperCard } from "@/paper-ui/core";
import { ArtifactRow } from "@/paper-ui/components/rows/ArtifactRow";
import { Tabs } from "@/paper-ui/components/navigation/Tabs";
import { PaperBadge } from "@/paper-ui/components/badges/PaperBadge";
import { EmptyState } from "@/paper-ui/components/feedback/EmptyState";
import type { IconTone } from "@/paper-ui/core";
import { FileText, BookOpen, Brain, Layout, HelpCircle } from "lucide-react";

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

const getTypeIconAndTone = (type: string): { icon: React.ReactNode; tone: IconTone } => {
  switch (type) {
    case "course": return { icon: <BookOpen size={16} />, tone: "brick" };
    case "document":
    case "revision":
    case "difference":
    case "notebook": return { icon: <FileText size={16} />, tone: "sky" };
    case "mindmap": return { icon: <Brain size={16} />, tone: "sage" };
    case "whiteboard":
    case "diagram": return { icon: <Layout size={16} />, tone: "lavender" };
    case "quiz":
    case "pyq_paper":
    case "pyq_question": return { icon: <HelpCircle size={16} />, tone: "ochre" };
    default: return { icon: <FileText size={16} />, tone: "ink" };
  }
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
  const { items, loading, fetchItems, restoreItem, archiveItem, permanentDelete, purgeAll } = useBinStore();
  const [purgeConfirmOpen, setPurgeConfirmOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: string; title: string } | null>(null);
  const [activeTab, setActiveTab] = useState("deleted");

  const displayItems = useMemo(() => {
    return items.filter((i) => activeTab === "archived" ? i.archived : !i.archived);
  }, [items, activeTab]);

  const displayGroups = useMemo(() => {
    const groups: Record<string, TrashItem[]> = {};
    for (const item of displayItems) {
      if (!groups[item.artifact_type]) groups[item.artifact_type] = [];
      groups[item.artifact_type].push(item);
    }
    return Object.entries(groups);
  }, [displayItems]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Page className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <PaperH1>Global Bin</PaperH1>
          <p className="text-sm font-kalam text-muted-foreground mt-1">
            {displayItems.length} item{displayItems.length !== 1 ? "s" : ""} 
            {activeTab === "deleted" ? " · Permanently deleted after 10 days" : " · Kept indefinitely"}
          </p>
        </div>
        {activeTab === "deleted" && items.filter((i) => !i.archived).length > 0 && (
          <PaperButton onClick={() => setPurgeConfirmOpen(true)}>
            Empty Bin
          </PaperButton>
        )}
      </div>

      <div className="mb-6">
        <Tabs
          active={activeTab}
          onChange={setActiveTab}
          items={[
            { key: "deleted", label: "Deleted", count: items.filter((i) => !i.archived).length },
            { key: "archived", label: "Archived", count: items.filter((i) => i.archived).length },
          ]}
        />
      </div>

      {displayItems.length === 0 ? (
        <EmptyState
          icon={<Trash2 size={32} className="text-ink-muted" />}
          title="No items found"
          description={
            activeTab === "deleted"
              ? "Deleted items will appear here for 10 days before permanent removal."
              : "You don't have any archived items."
          }
          className="my-12 max-w-lg mx-auto"
        />
      ) : (
        <div className="space-y-8">
          {displayGroups.map(([type, typeItems]) => (
            <PaperCard key={type} className="p-6">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border/50">
                <span className="font-medium font-architect text-xl">{TYPE_LABELS[type] || type}</span>
                <span className="text-sm text-ink-muted ml-auto bg-black/5 px-2.5 py-0.5 rounded-full">{typeItems.length}</span>
              </div>
              <div className="space-y-1.5">
                {typeItems.map((item) => {
                  const { icon, tone } = getTypeIconAndTone(type);
                  return (
                    <ArtifactRow
                      key={item.id}
                      title={item.title}
                      icon={icon}
                      tone={tone}
                      date={daysAgo(item.deleted_at)}
                      badge={
                        <div className="flex gap-1.5 items-center mt-1">
                          {item.course_name && (
                            <PaperBadge tone="ink">{item.course_name}</PaperBadge>
                          )}
                          {item.archived && (
                            <PaperBadge tone="ochre">Archived</PaperBadge>
                          )}
                        </div>
                      }
                      actions={
                        <>
                          <IconButton onClick={() => handleRestore(item)} label="Restore">
                            <RotateCcw className="w-4 h-4" />
                          </IconButton>
                          <IconButton onClick={() => handleArchive(item)} label={item.archived ? "Unarchive" : "Archive"}>
                            <Archive className={`w-4 h-4 ${item.archived ? "text-amber-500" : ""}`} />
                          </IconButton>
                          <IconButton
                            onClick={() =>
                              setDeleteConfirm({ type: item.artifact_type, id: item.artifact_id, title: item.title })
                            }
                            label="Delete permanently"
                            className="hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </IconButton>
                        </>
                      }
                    />
                  );
                })}
              </div>
            </PaperCard>
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
    </Page>
  );
}
