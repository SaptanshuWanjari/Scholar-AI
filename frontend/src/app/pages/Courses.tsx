import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { FolderOpen, Plus, X } from "lucide-react";
import { toast } from "@/app/lib/toast";
import PageLoading from "@/app/components/ui/PageLoading";
import { api } from "../lib/api";
import type { Course } from "../lib/types";
import { useCourseWorkspaceStore } from "../stores/useCourseWorkspaceStore";
import { DataEmptyState } from "@/paper-ui/components/dataDisplay";
import { ConfirmationDialog } from "@/paper-ui/components/dialogs";
import { PaperButton, GhostButton } from "@/paper-ui/components/buttons";
import { PaperInput } from "@/paper-ui/components/inputs";
import { CourseRow } from "@/paper-ui/components/rows";
import { CourseWorkspace } from "./courses/CourseWorkspace";

export function Courses() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { selectedCourseId, setSelectedCourse } = useCourseWorkspaceStore();

  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [newCourseName, setNewCourseName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCourses = useCallback(() =>
    api.listCourses().then(setCourses).catch(() => {}), []);

  useEffect(() => {
    loadCourses().finally(() => setLoading(false));
  }, [loadCourses]);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id && id !== selectedCourseId) setSelectedCourse(id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const name = searchParams.get("name");
    if (!name || courses.length === 0) return;
    const match = courses.find((c) => c.name === decodeURIComponent(name));
    if (match) {
      setSelectedCourse(match.id);
      setSearchParams({ id: match.id }, { replace: true });
    }
  }, [courses]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectCourse = (id: string) => {
    setSelectedCourse(id);
    setSearchParams({ id });
  };

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) ?? null;

  const filtered = courses.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async () => {
    if (!newCourseName.trim()) return;
    try {
      const c = await api.createCourse(newCourseName);
      setNewCourseName("");
      setCreating(false);
      await loadCourses();
      selectCourse(c.id);
    } catch (e) { toast.error(String(e)); }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    try {
      await api.updateCourse(id, editName);
      setEditingId(null);
      loadCourses();
    } catch (e) { toast.error(String(e)); }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await api.deleteCourse(deletingId);
      if (selectedCourseId === deletingId) {
        setSelectedCourse(null);
        setSearchParams({});
      }
      loadCourses();
    } catch (e) { toast.error(String(e)); }
    setDeletingId(null);
  };

  if (loading) return <PageLoading />;

  return (
    <div className="flex h-full overflow-hidden bg-paper">
      {/* Sidebar */}
      <div className="w-56 shrink-0 border-r border-[#e4e0d6] flex flex-col bg-paper-card overflow-hidden">
        <div className="px-3 pt-4 pb-2 space-y-2 shrink-0">
          <input
            placeholder="Search courses"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 rounded-lg border border-[#e4e0d6] bg-paper-card px-3 pl-9 font-architect text-sm text-ink placeholder:text-ink-muted/70 focus:outline-none focus:border-ink transition-colors"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2363635d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: '10px center', backgroundSize: '16px' }}
          />
          <PaperButton size="lg" tone="dark" className="w-full justify-center gap-1.5" onClick={() => setCreating(true)}>
            <Plus className="size-3.5" /> New Course
          </PaperButton>
        </div>

        {creating && (
          <div className="mx-3 mb-2 rounded-xl bg-panel p-3 space-y-2 shrink-0 border border-[#e4e0d6]">
            <PaperInput
              placeholder="Course name"
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); }}
              autoFocus
              className="w-full h-8 rounded-lg border border-[#e4e0d6] bg-paper-card px-3 font-architect text-sm text-ink placeholder:text-ink-muted/70 focus:outline-none focus:border-ink transition-colors"
            />
            <div className="flex gap-2">
              <PaperButton size="sm" tone="dark" className="flex-1 justify-center" onClick={handleCreate} disabled={!newCourseName.trim()}>
                Create
              </PaperButton>
              <button onClick={() => setCreating(false)} className="size-8 flex items-center justify-center rounded-lg text-ink-muted hover:text-ink hover:bg-black/5 transition-colors">
                <X className="size-4" />
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-0.5">
          {filtered.length === 0 && !creating && (
            <div className="text-center py-10">
              <FolderOpen className="size-8 text-ink-muted/50 mx-auto mb-2" />
              <p className="font-architect text-xs text-ink-muted">No courses found</p>
            </div>
          )}
          {filtered.map((c) => (
            <CourseRow
              key={c.id}
              color={c.color}
              initials={c.code.split(" ")[0].slice(0, 2)}
              title={c.name}
              meta={`${c.documents} docs \u00b7 ${c.flashcards} cards`}
              isSelected={selectedCourseId === c.id}
              onClick={() => selectCourse(c.id)}
              actions={
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditingId(c.id); setEditName(c.name); }}
                    className="size-7 flex items-center justify-center rounded-md hover:bg-black/5 text-ink-muted hover:text-ink transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeletingId(c.id); }}
                    className="size-7 flex items-center justify-center rounded-md hover:bg-brick-soft text-ink-muted hover:text-brick transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                </div>
              }
            />
          ))}
        </div>
      </div>

      {/* Workspace */}
      <div className="flex-1 overflow-hidden bg-paper">
        {!selectedCourse ? (
          <DataEmptyState
            title="Select a Course"
            description="Choose a course from the left panel to manage its documents and generated artifacts."
            icon={<FolderOpen className="size-12 text-ink-muted/30" />}
            variant="dashed"
            className="h-full justify-center"
          />
        ) : (
          <CourseWorkspace
            key={selectedCourse.id}
            course={selectedCourse}
            isRenaming={editingId === selectedCourse.id}
            editName={editName}
            setEditName={setEditName}
            onRenameSubmit={() => handleUpdate(selectedCourse.id)}
            onRenameCancel={() => setEditingId(null)}
            onRenameStart={() => { setEditingId(selectedCourse.id); setEditName(selectedCourse.name); }}
            onDelete={() => setDeletingId(selectedCourse.id)}
            navigate={navigate}
          />
        )}
      </div>

      <ConfirmationDialog
        open={!!deletingId}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingId(null)}
        title="Delete this course?"
        message="This permanently deletes the course and all its documents. Generated artifacts stored in their respective pages are not deleted."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive
      />
    </div>
  );
}
