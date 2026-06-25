import { useEffect, useState } from "react";
import { FolderOpen, Plus, Search, Trash2, Pencil, Check, X } from "lucide-react";
import { Page } from "../components/Page";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { api } from "../lib/api";
import type { Course } from "../lib/types";
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

export function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [newCourseName, setNewCourseName] = useState("");
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadCourses = () => api.listCourses().then(setCourses).catch(() => {});
  useEffect(() => { loadCourses(); }, []);

  const handleCreate = async () => {
    if (!newCourseName.trim()) return;
    try {
      await api.createCourse(newCourseName);
      setNewCourseName("");
      setCreating(false);
      loadCourses();
    } catch {}
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    try {
      await api.updateCourse(id, editName);
      setEditingId(null);
      loadCourses();
    } catch {}
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await api.deleteCourse(deletingId);
      loadCourses();
    } catch {}
    setDeletingId(null);
  };

  const filtered = courses.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Page className="max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage your subjects, modules, and collections.</p>
        </div>
        <Button onClick={() => setCreating(true)}><Plus className="size-4 mr-2" /> New Course</Button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search courses..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            className="pl-9 bg-card border-border"
          />
        </div>
      </div>

      {creating && (
        <div className="mb-6 rounded-2xl border border-violet/30 bg-violet-soft/20 p-5 flex items-center gap-3 shadow-sm">
          <div className="size-10 rounded-xl bg-violet-soft flex items-center justify-center shrink-0">
            <FolderOpen className="size-5 text-violet" />
          </div>
          <Input 
            placeholder="Course name (e.g. Machine Learning)" 
            value={newCourseName} 
            onChange={e => setNewCourseName(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") handleCreate(); }}
            autoFocus
            className="flex-1 bg-card border-border h-10"
          />
          <Button onClick={handleCreate} disabled={!newCourseName.trim()}>Create</Button>
          <Button variant="ghost" onClick={() => setCreating(false)}>Cancel</Button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(c => (
          <div key={c.id} className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-sm">
            {editingId === c.id ? (
              <div className="flex flex-col gap-3 h-full">
                <Input 
                  value={editName} 
                  onChange={e => setEditName(e.target.value)} 
                  onKeyDown={e => { if (e.key === "Enter") handleUpdate(c.id); }} 
                  autoFocus 
                  className="h-9 bg-input-background" 
                />
                <div className="flex items-center gap-2 justify-end mt-auto pt-4">
                  <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}><X className="size-3.5 mr-1" /> Cancel</Button>
                  <Button size="sm" onClick={() => handleUpdate(c.id)}><Check className="size-3.5 mr-1" /> Save</Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${c.color}20`, color: c.color }}>
                      <FolderOpen className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base line-clamp-1" title={c.name}>{c.name}</h3>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{c.code}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="ghost" className="size-7 hover:bg-accent" onClick={() => { setEditingId(c.id); setEditName(c.name); }}>
                      <Pencil className="size-3.5 text-muted-foreground" />
                    </Button>
                    <Button size="icon" variant="ghost" className="size-7 hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDelete(c.id)}>
                      <Trash2 className="size-3.5 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-auto pt-4 border-t border-border/50">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-2xl font-display leading-none">{c.documents}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Documents</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-2xl font-display leading-none">{c.flashcards}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Cards</span>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      {!creating && filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="inline-flex size-16 items-center justify-center rounded-full bg-accent mb-4">
            <FolderOpen className="size-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground">No courses found</h3>
          <p className="text-muted-foreground mt-1 max-w-sm mx-auto">Create a new course to start organizing your documents and study materials.</p>
          <Button onClick={() => setCreating(true)} className="mt-6">
            <Plus className="size-4 mr-2" /> Create First Course
          </Button>
        </div>
      )}

      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this course?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your course and all its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Page>
  );
}
