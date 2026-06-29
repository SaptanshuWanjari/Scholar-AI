import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import {
  StickyNote as StickyNoteIcon,
  PencilRuler,
  Columns,
  Plus,
  Trash2,
  Pencil,
  Check,
  X,
  Loader2,
  PuzzleIcon,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "../ui/utils";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { api, type NotebookMeta } from "../../lib/api";
import type { NoteCategory, StickyNote, WhiteboardItem, NoteRect } from "../../lib/types";
import {
  NOTE_CATEGORIES,
  NOTE_CATEGORY_LIST,
  useReadingNotesStore,
} from "../../stores/useReadingNotesStore";

type SubMode = "notes" | "draw" | "both";

export interface ReadingWorkspaceProps {
  docId: string;
  course?: string | null;
  excalidrawEnabled: boolean;
  notebooks: NotebookMeta[];
  onScrollToRegion?: (page: number, bbox: NoteRect) => void;
}

export function ReadingWorkspace({
  docId,
  course,
  excalidrawEnabled,
  notebooks,
  onScrollToRegion,
}: ReadingWorkspaceProps) {
  const [subMode, setSubMode] = useState<SubMode>("notes");

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Sub-mode toggle */}
      <div className="flex shrink-0 items-center justify-center border-b border-border bg-card/40 px-3 py-2">
        <div className="flex rounded-lg border border-border bg-card p-0.5">
          {(
            [
              { v: "notes", label: "Notes", icon: StickyNoteIcon },
              { v: "draw", label: "Draw", icon: PencilRuler },
              { v: "both", label: "Both", icon: Columns },
            ] as { v: SubMode; label: string; icon: typeof StickyNoteIcon }[]
          ).map((t) => (
            <button
              key={t.v}
              onClick={() => setSubMode(t.v)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors",
                subMode === t.v
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <t.icon className="size-3.5" /> {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className={cn("flex min-h-0 flex-1", subMode === "both" ? "flex-col" : "")}>
        {(subMode === "notes" || subMode === "both") && (
          <div className={cn("min-h-0 overflow-y-auto", subMode === "both" ? "h-1/2 border-b border-border" : "flex-1")}>
            <NotesPanel
              docId={docId}
              notebooks={notebooks}
              onScrollToRegion={onScrollToRegion}
            />
          </div>
        )}
        {(subMode === "draw" || subMode === "both") && (
          <div className={cn("min-h-0 overflow-y-auto", subMode === "both" ? "h-1/2" : "flex-1")}>
            <DrawPanel docId={docId} course={course} excalidrawEnabled={excalidrawEnabled} />
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Notes panel
// ---------------------------------------------------------------------------

function NotesPanel({
  docId,
  notebooks,
  onScrollToRegion,
}: {
  docId: string;
  notebooks: NotebookMeta[];
  onScrollToRegion?: (page: number, bbox: NoteRect) => void;
}) {
  const notes = useReadingNotesStore((s) => s.notes);
  const addNote = useReadingNotesStore((s) => s.addNote);
  const updateNoteInStore = useReadingNotesStore((s) => s.updateNote);
  const removeNote = useReadingNotesStore((s) => s.removeNote);

  const [filter, setFilter] = useState<NoteCategory | "all">("all");
  const [draft, setDraft] = useState("");
  const [draftCat, setDraftCat] = useState<NoteCategory>("general");
  const [notebookId, setNotebookId] = useState<string>("none");
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editCat, setEditCat] = useState<NoteCategory>("general");

  const visible = filter === "all" ? notes : notes.filter((n) => n.category === filter);

  const submit = async () => {
    const content = draft.trim();
    if (!content) return;
    setSaving(true);
    try {
      const note = await api.createNote(docId, {
        content,
        category: draftCat,
        pageNumber: 1,
        notebookId: notebookId === "none" ? null : notebookId,
      });
      addNote(note);
      setDraft("");
      toast.success("Note added");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to add note");
    } finally {
      setSaving(false);
    }
  };

  const saveEdit = async (note: StickyNote) => {
    try {
      const updated = await api.updateNote(docId, note.id, {
        content: editText.trim(),
        category: editCat,
      });
      updateNoteInStore(updated);
      setEditId(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save");
    }
  };

  const remove = async (note: StickyNote) => {
    try {
      await api.deleteNote(docId, note.id);
      removeNote(note.id);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete");
    }
  };

  return (
    <div className="flex flex-col gap-3 p-4">
      {/* Composer */}
      <div className="rounded-lg border border-border bg-card/50 p-3">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Write a note… (markdown supported). Select text in the PDF to anchor a note to a region."
          rows={3}
          className="w-full resize-none rounded-md border border-input bg-input-background p-2 text-sm outline-none focus:ring-1 focus:ring-primary"
        />
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <CategoryPicker value={draftCat} onChange={setDraftCat} />
          <Select value={notebookId} onValueChange={setNotebookId}>
            <SelectTrigger className="h-8 w-auto min-w-[150px] text-xs">
              <SelectValue placeholder="Sync to notebook…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none" className="text-xs">No notebook sync</SelectItem>
              {notebooks.map((nb) => (
                <SelectItem key={nb.id} value={nb.id} className="text-xs">
                  {nb.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" className="ml-auto h-8" onClick={submit} disabled={saving || !draft.trim()}>
            {saving ? <Loader2 className="mr-1 size-3.5 animate-spin" /> : <Plus className="mr-1 size-3.5" />}
            Add note
          </Button>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-1.5">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
          All ({notes.length})
        </FilterChip>
        {NOTE_CATEGORY_LIST.map((cat) => {
          const meta = NOTE_CATEGORIES[cat];
          const count = notes.filter((n) => n.category === cat).length;
          return (
            <FilterChip key={cat} active={filter === cat} onClick={() => setFilter(cat)}>
              <meta.icon className={cn("size-3", meta.dot)} /> {meta.label} ({count})
            </FilterChip>
          );
        })}
      </div>

      {/* List */}
      {visible.length === 0 ? (
        <p className="px-1 py-6 text-center text-xs text-muted-foreground">
          No notes yet. Write one above, or select PDF text and choose “Add Note”.
        </p>
      ) : (
        <div className="space-y-2">
          {visible.map((note) => {
            const meta = NOTE_CATEGORIES[note.category];
            const editing = editId === note.id;
            return (
              <div key={note.id} className="rounded-lg border border-border bg-card p-3">
                <div className="mb-1.5 flex items-center gap-2">
                  <span className={cn("flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium", meta.chip)}>
                    <meta.icon className="size-3" /> {meta.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground">p.{note.page_number}</span>
                  <div className="ml-auto flex items-center gap-0.5">
                    {editing ? (
                      <>
                        <button className="rounded p-1 hover:bg-accent" onClick={() => saveEdit(note)}>
                          <Check className="size-3.5 text-emerald-500" />
                        </button>
                        <button className="rounded p-1 hover:bg-accent" onClick={() => setEditId(null)}>
                          <X className="size-3.5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="rounded p-1 hover:bg-accent"
                          onClick={() => {
                            setEditId(note.id);
                            setEditText(note.content);
                            setEditCat(note.category);
                          }}
                        >
                          <Pencil className="size-3.5 text-muted-foreground" />
                        </button>
                        <button className="rounded p-1 hover:bg-accent" onClick={() => remove(note)}>
                          <Trash2 className="size-3.5 text-muted-foreground" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {editing ? (
                  <div className="space-y-2">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={3}
                      className="w-full resize-none rounded-md border border-input bg-input-background p-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                    />
                    <CategoryPicker value={editCat} onChange={setEditCat} />
                  </div>
                ) : (
                  <div
                    className={cn(
                      "prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed text-foreground/85",
                      note.bounding_box && onScrollToRegion ? "cursor-pointer" : "",
                    )}
                    onClick={() =>
                      note.bounding_box && onScrollToRegion?.(note.page_number, note.bounding_box)
                    }
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{note.content}</ReactMarkdown>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CategoryPicker({
  value,
  onChange,
}: {
  value: NoteCategory;
  onChange: (c: NoteCategory) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {NOTE_CATEGORY_LIST.map((cat) => {
        const meta = NOTE_CATEGORIES[cat];
        const active = value === cat;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onChange(cat)}
            title={meta.label}
            className={cn(
              "flex items-center gap-1 rounded-md border px-1.5 py-1 text-[10px] font-medium transition-colors",
              active ? meta.chip : "border-border text-muted-foreground hover:bg-accent/50",
            )}
          >
            <meta.icon className="size-3" /> {meta.label}
          </button>
        );
      })}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] transition-colors",
        active ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground hover:bg-accent/50",
      )}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Draw panel
// ---------------------------------------------------------------------------

function DrawPanel({
  docId,
  course,
  excalidrawEnabled,
}: {
  docId: string;
  course?: string | null;
  excalidrawEnabled: boolean;
}) {
  const navigate = useNavigate();
  const [boards, setBoards] = useState<WhiteboardItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!excalidrawEnabled) return;
    let cancelled = false;
    setLoading(true);
    api
      .listDocAnnotations(docId)
      .then((b) => !cancelled && setBoards(b))
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [docId, excalidrawEnabled]);

  if (!excalidrawEnabled) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
        <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground">
          <PuzzleIcon className="size-6" />
        </div>
        <p className="text-sm font-medium">Excalidraw plugin not configured</p>
        <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
          Enable the <span className="font-medium text-foreground">Excalidraw Whiteboards</span> plugin
          in Settings to draw region annotations. Sticky notes work without it.
        </p>
      </div>
    );
  }

  const createBlank = async () => {
    setCreating(true);
    try {
      const wb = await api.createWhiteboard({
        title: "Annotation",
        course: course ?? null,
        source: "annotation",
        documentId: Number(docId),
      });
      navigate(`/whiteboards/${wb.id}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to create board");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-4">
      <Button size="sm" onClick={createBlank} disabled={creating} className="self-start">
        {creating ? <Loader2 className="mr-1 size-3.5 animate-spin" /> : <Plus className="mr-1 size-3.5" />}
        New blank board
      </Button>
      <p className="text-[11px] text-muted-foreground">
        Tip: select PDF text and choose “Annotate Region” to start a board with that region as a
        traceable background.
      </p>
      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : boards.length === 0 ? (
        <p className="px-1 py-6 text-center text-xs text-muted-foreground">
          No annotation boards for this document yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {boards.map((wb) => (
            <button
              key={wb.id}
              onClick={() => navigate(`/whiteboards/${wb.id}`)}
              className="flex flex-col overflow-hidden rounded-lg border border-border bg-card text-left transition-colors hover:border-primary"
            >
              <div className="flex aspect-video items-center justify-center bg-muted/40">
                {wb.thumbnail ? (
                  <img src={wb.thumbnail} alt={wb.title} className="h-full w-full object-cover" />
                ) : (
                  <PencilRuler className="size-5 text-muted-foreground" />
                )}
              </div>
              <div className="truncate px-2 py-1.5 text-xs font-medium">{wb.title}</div>
              {wb.pageNumber != null && (
                <div className="px-2 pb-1.5 text-[10px] text-muted-foreground">p.{wb.pageNumber}</div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
