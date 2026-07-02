import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { PencilRuler, Plus, Trash2, Loader2, Sparkles, Clock, Archive, Undo } from "lucide-react";
import { toast } from "@/app/lib/toast";
import { PaperButton, GhostButton } from "@/paper-ui/components/buttons";
import { PaperSelect } from "@/paper-ui/components/inputs";
import { ConfirmationDialog } from "@/paper-ui/components/dialogs";
import { Tabs } from "@/paper-ui/components/navigation";
import { PaperH1 } from "@/paper-ui/core";
import { api } from "../lib/api";
import type { Course } from "../lib/types";
import { useWhiteboardStore, ALL_COURSES } from "../stores/useWhiteboardStore";
import { cn } from "@/paper-ui/utils";

const SOURCE_LABEL: Record<string, string> = {
  manual: "Manual",
  ai: "AI",
  imported: "Imported",
  selection: "From reading",
};

export function Whiteboards() {
  const navigate = useNavigate();
  const { list, loading, load, create, remove, archive, moveToBin, restore } = useWhiteboardStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [course, setCourse] = useState<string>(ALL_COURSES);
  const [creating, setCreating] = useState(false);
  const [deletingWb, setDeletingWb] = useState<{ id: string; title: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"active" | "archived" | "binned">("active");

  const filteredList = list.filter((w) => {
    if (activeTab === "active") return w.status === "saved" || w.status === "draft" || !w.status;
    if (activeTab === "archived") return w.status === "archived";
    if (activeTab === "binned") return w.status === "binned";
    return false;
  });

  useEffect(() => {
    api.listCourses().then(setCourses).catch(() => {});
  }, []);

  useEffect(() => {
    load(course);
  }, [course, load]);

  const handleCreate = async () => {
    setCreating(true);
    const wb = await create(
      "Untitled whiteboard",
      course === ALL_COURSES ? null : course,
    );
    setCreating(false);
    if (wb) navigate(`/whiteboards/${wb.id}`);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 border-b border-border px-8 pb-6 pt-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500">
              <PencilRuler className="size-5" />
            </div>
            <div>
              <PaperH1 className="!text-2xl">Whiteboards</PaperH1>
              <p className="text-sm font-kalam text-muted-foreground">
                Free-form canvases for sketching, problem solving, and visual notes.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <PaperSelect
              value={course}
              onChange={setCourse}
              options={[
                { value: ALL_COURSES, label: "All courses" },
                ...courses.map((c) => ({ value: c.name, label: c.name })),
              ]}
              placeholder="All courses"
              className="w-48"
            />
            <PaperButton tone="dark" onClick={handleCreate} disabled={creating}>
              {creating ? (
                <Loader2 className="mr-1.5 size-4 animate-spin" />
              ) : (
                <Plus className="mr-1.5 size-4" />
              )}
              New whiteboard
            </PaperButton>
          </div>
        </div>
        <div className="mt-6 flex items-center">
          <Tabs
            items={[
              { key: "active", label: "Active" },
              { key: "archived", label: "Archived" },
              { key: "binned", label: "Bin" },
            ]}
            active={activeTab}
            onChange={(key) => setActiveTab(key as typeof activeTab)}
            className="w-full max-w-[400px]"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="size-6 animate-spin text-violet" />
          </div>
        ) : filteredList.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500">
              <PencilRuler className="size-7" />
            </div>
            <div className="font-kalam mt-2 mb-4">
              {activeTab === "active" && (
                <>
                  <span className="block text-sm font-semibold text-foreground mb-1">No whiteboards yet</span>
                  <span className="text-sm text-muted-foreground">Create a blank canvas to organize your thoughts.</span>
                </>
              )}
              {activeTab === "archived" && <span className="text-sm text-muted-foreground">No archived whiteboards.</span>}
              {activeTab === "binned" && <span className="text-sm text-muted-foreground">Bin is empty.</span>}
            </div>
            {activeTab === "active" && (
              <PaperButton onClick={handleCreate} disabled={creating}>
                <Plus className="mr-1.5 size-4" /> Create your first whiteboard
              </PaperButton>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredList.map((wb) => (
              <div
                key={wb.id}
                onClick={() => navigate(`/whiteboards/${wb.id}`)}
                className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-violet/40 font-kalam"
              >
                <div className="flex aspect-video items-center justify-center overflow-hidden border-b border-border bg-muted/30">
                  {wb.thumbnail ? (
                    <img src={wb.thumbnail} alt="" className="h-full w-full object-contain" />
                  ) : (
                    <PencilRuler className="size-8 text-muted-foreground/40" />
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-1 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="truncate text-sm font-semibold font-caveat">{wb.title}</span>
                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      {activeTab === "active" && (
                        <>
                          <button title="Archive" onClick={(e) => { e.stopPropagation(); archive(wb.id); }} className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
                            <Archive className="size-3.5" />
                          </button>
                          <button title="Move to Bin" onClick={(e) => { e.stopPropagation(); moveToBin(wb.id); }} className="rounded-md p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                            <Trash2 className="size-3.5" />
                          </button>
                        </>
                      )}
                      {activeTab === "archived" && (
                        <>
                          <button title="Restore" onClick={(e) => { e.stopPropagation(); restore(wb.id); }} className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
                            <Undo className="size-3.5" />
                          </button>
                          <button title="Move to Bin" onClick={(e) => { e.stopPropagation(); moveToBin(wb.id); }} className="rounded-md p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                            <Trash2 className="size-3.5" />
                          </button>
                        </>
                      )}
                      {activeTab === "binned" && (
                        <>
                          <button title="Restore" onClick={(e) => { e.stopPropagation(); restore(wb.id); }} className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
                            <Undo className="size-3.5" />
                          </button>
                          <button title="Delete Permanently" onClick={(e) => { e.stopPropagation(); setDeletingWb({ id: wb.id, title: wb.title }); }} className="rounded-md p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                            <Trash2 className="size-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-architect text-muted-foreground">
                    {wb.course && <span className="truncate">{wb.course}</span>}
                    {wb.source !== "manual" && (
                      <span className="inline-flex items-center gap-1 rounded bg-violet/10 px-1.5 py-0.5 text-violet">
                        {wb.source === "ai" && <Sparkles className="size-2.5" />}
                        {SOURCE_LABEL[wb.source] ?? wb.source}
                      </span>
                    )}
                  </div>
                  <div className="mt-auto flex items-center gap-1 pt-1 text-xs font-architect text-muted-foreground">
                    <Clock className="size-3" />
                    <span>{wb.updated}</span>
                    {wb.revisions > 0 && (
                      <span className={cn("ml-auto")}>{wb.revisions} rev</span>
                    )}
                  </div>
                  {wb.status === "binned" && wb.deletedAt && (
                    <div className="mt-1 text-xs font-architect text-destructive">
                      Auto-deletes in {Math.max(0, 10 - Math.floor((Date.now() - new Date(wb.deletedAt).getTime()) / (1000 * 60 * 60 * 24)))} days
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmationDialog
        open={!!deletingWb}
        title="Delete Whiteboard?"
        message={`Are you sure you want to delete "${deletingWb?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive
        onConfirm={() => {
          if (deletingWb) {
            remove(deletingWb.id);
            setDeletingWb(null);
          }
        }}
        onCancel={() => setDeletingWb(null)}
      />
    </div>
  );
}
