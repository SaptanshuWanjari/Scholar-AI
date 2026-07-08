import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { PencilRuler, Plus, Loader2 } from "lucide-react";
import { PaperButton } from "@/paper-ui/components/buttons";
import { PaperSelect } from "@/paper-ui/components/inputs";
import { ConfirmationDialog } from "@/paper-ui/components/dialogs";
import { Tabs } from "@/paper-ui/components/navigation";
import { PaperH1, PaperIconCircle } from "@/paper-ui/core";
import { api } from "../lib/api";
import type { Course } from "../lib/types";
import { useWhiteboardStore, ALL_COURSES } from "../stores/useWhiteboardStore";
import { cn } from "@/paper-ui/utils";
import { WhiteboardCard } from "@/paper-ui/components/cards";


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
            <PaperIconCircle className="flex p-5 size-10 items-center justify-center rounded-xl bg-sky-500/10 ">
              <PencilRuler className="size-6 text-sky-500" />
            </PaperIconCircle>
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
            <PaperIconCircle className="flex p-5 size-14 items-center justify-center rounded-2xl bg-sky-500/10 ">
              <PencilRuler className="size-7 text-sky-500" />
            </PaperIconCircle>
            <div className="font-kalam mt-2 mb-4">
              {activeTab === "active" && (
                <>
                  <span className="block text-sm font-semibold text-foreground mb-1">No whiteboards yet</span>
                </>
              )}
              {activeTab === "archived" && <span className="text-sm text-muted-foreground">No archived whiteboards.</span>}
              {activeTab === "binned" && <span className="text-sm text-muted-foreground">Bin is empty.</span>}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredList.map((wb) => (
              <WhiteboardCard
                key={wb.id}
                title={wb.title}
                course={wb.course}
                thumbnail={wb.thumbnail}
                source={wb.source}
                updated={wb.updated}
                revisions={wb.revisions}
                status={wb.status}
                deletedAt={wb.deletedAt}
                onClick={() => navigate(`/whiteboards/${wb.id}`)}
                onArchive={activeTab === "active" ? () => archive(wb.id) : undefined}
                onMoveToBin={activeTab === "active" || activeTab === "archived" ? () => moveToBin(wb.id) : undefined}
                onRestore={activeTab === "archived" || activeTab === "binned" ? () => restore(wb.id) : undefined}
                onDeletePermanently={activeTab === "binned" ? () => setDeletingWb({ id: wb.id, title: wb.title }) : undefined}
              />
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
