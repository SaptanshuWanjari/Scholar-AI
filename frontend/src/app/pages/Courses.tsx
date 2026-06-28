import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { FolderOpen, Plus, Search, Trash2, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { api } from "../lib/api";
import type { Course } from "../lib/types";
import { useCourseWorkspaceStore } from "../stores/useCourseWorkspaceStore";
import { cn } from "../components/ui/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { CourseRow } from "./courses/CourseRow";
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

  const loadCourses = useCallback(() =>
    api.listCourses().then(setCourses).catch(() => {}), []);

  useEffect(() => { loadCourses(); }, [loadCourses]);

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

  return (
    <div className="flex h-full overflow-hidden">
      <div className="w-72 shrink-0 border-r border-border flex flex-col bg-sidebar overflow-hidden">
        <div className="px-3 pt-4 pb-2 space-y-2 shrink-0">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search courses\u2026"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-sm bg-card border-border"
            />
          </div>
          <Button size="sm" className="w-full gap-1.5" onClick={() => setCreating(true)}>
            <Plus className="size-3.5" /> New Course
          </Button>
        </div>

        {creating && (
          <div className="mx-3 mb-2 rounded-xl border border-violet/30 bg-violet-soft/20 p-3 space-y-2 shrink-0">
            <Input
              placeholder="Course name\u2026"
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); }}
              autoFocus
              className="h-8 text-sm bg-card border-border"
            />
            <div className="flex gap-2">
              <Button size="sm" className="flex-1" onClick={handleCreate} disabled={!newCourseName.trim()}>
                Create
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setCreating(false)}>
                <X className="size-3.5" />
              </Button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
          {filtered.length === 0 && !creating && (
            <div className="text-center py-10">
              <FolderOpen className="size-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">No courses found</p>
            </div>
          )}
          {filtered.map((c) => (
            <div key={c.id} className="relative">
              <CourseRow
                course={c}
                isSelected={selectedCourseId === c.id}
                onSelect={() => selectCourse(c.id)}
                onRename={() => { setEditingId(c.id); setEditName(c.name); }}
                onDelete={() => setDeletingId(c.id)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden bg-background">
        {!selectedCourse ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="size-20 rounded-full bg-accent flex items-center justify-center mb-5">
              <FolderOpen className="size-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold">Select a Course</h2>
            <p className="text-muted-foreground text-sm mt-2 max-w-sm">
              Choose a course from the left panel to manage its documents and generated artifacts.
            </p>
          </div>
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

      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this course?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes the course and all its documents. Generated artifacts stored in their
              respective pages are not deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
