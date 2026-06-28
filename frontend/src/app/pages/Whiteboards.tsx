import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { PencilRuler, Plus, Trash2, Loader2, Sparkles, Clock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { api } from "../lib/api";
import type { Course } from "../lib/types";
import { useWhiteboardStore, ALL_COURSES } from "../stores/useWhiteboardStore";
import { cn } from "../components/ui/utils";

const SOURCE_LABEL: Record<string, string> = {
  manual: "Manual",
  ai: "AI",
  imported: "Imported",
  selection: "From reading",
};

export function Whiteboards() {
  const navigate = useNavigate();
  const { list, loading, load, create, remove } = useWhiteboardStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [course, setCourse] = useState<string>(ALL_COURSES);
  const [creating, setCreating] = useState(false);

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
              <h1 className="text-2xl font-bold tracking-tight">Whiteboards</h1>
              <p className="text-sm text-muted-foreground">
                Free-form canvases for sketching, problem solving, and visual notes.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={course} onValueChange={setCourse}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All courses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_COURSES}>All courses</SelectItem>
                {courses.map((c) => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleCreate} disabled={creating}>
              {creating ? (
                <Loader2 className="mr-1.5 size-4 animate-spin" />
              ) : (
                <Plus className="mr-1.5 size-4" />
              )}
              New whiteboard
            </Button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="size-6 animate-spin text-violet" />
          </div>
        ) : list.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500">
              <PencilRuler className="size-7" />
            </div>
            <p className="text-sm text-muted-foreground">No whiteboards yet.</p>
            <Button variant="outline" onClick={handleCreate} disabled={creating}>
              <Plus className="mr-1.5 size-4" /> Create your first whiteboard
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((wb) => (
              <div
                key={wb.id}
                onClick={() => navigate(`/whiteboards/${wb.id}`)}
                className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-violet/40"
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
                    <span className="truncate text-sm font-medium">{wb.title}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete "${wb.title}"?`)) remove(wb.id);
                      }}
                      className="shrink-0 rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    {wb.course && <span className="truncate">{wb.course}</span>}
                    {wb.source !== "manual" && (
                      <span className="inline-flex items-center gap-1 rounded bg-violet/10 px-1.5 py-0.5 text-violet">
                        {wb.source === "ai" && <Sparkles className="size-2.5" />}
                        {SOURCE_LABEL[wb.source] ?? wb.source}
                      </span>
                    )}
                  </div>
                  <div className="mt-auto flex items-center gap-1 pt-1 text-[11px] text-muted-foreground">
                    <Clock className="size-3" />
                    <span>{wb.updated}</span>
                    {wb.revisions > 0 && (
                      <span className={cn("ml-auto")}>{wb.revisions} rev</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
