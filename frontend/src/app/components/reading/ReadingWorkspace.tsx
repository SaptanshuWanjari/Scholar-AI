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
  Pin,
  MapPin,
  Tag,
  Bold,
  Italic,
  List,
  Sigma,
} from "lucide-react";
import { MarkdownRenderer } from "../MarkdownRenderer";
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
      <div className="flex shrink-0 items-center justify-center border-b border-border bg-card/40 px-3 py-1">
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

  const visible = filter === "all" ? notes : notes.filter((n) => n.category === filter);

  const submit = async () => {
    const content = draft.trim();
    if (!content) return;
    setSaving(true);
    try {
      if (editId) {
        const updated = await api.updateNote(docId, editId, {
          content,
          category: draftCat,
        });
        updateNoteInStore(updated);
        setEditId(null);
        setDraft("");
        setDraftCat("general");
        toast.success("Note updated");
      } else {
        const note = await api.createNote(docId, {
          content,
          category: draftCat,
          pageNumber: 1,
          notebookId: notebookId === "none" ? null : notebookId,
        });
        addNote(note);
        setDraft("");
        toast.success("Note added");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save note");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (note: StickyNote) => {
    try {
      await api.deleteNote(docId, note.id);
      removeNote(note.id);
      if (editId === note.id) {
        cancelEdit();
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete");
    }
  };

  const startEdit = (note: StickyNote) => {
    setEditId(note.id);
    setDraft(note.content);
    setDraftCat(note.category);
    const textarea = document.getElementById('draft-textarea');
    if (textarea) {
      textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => textarea.focus(), 300);
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setDraft("");
    setDraftCat("general");
  };

  const insertMarkdown = (before: string, after: string = "") => {
    const textarea = document.getElementById('draft-textarea') as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = draft.substring(start, end);
    const newText = draft.substring(0, start) + before + selected + after + draft.substring(end);
    setDraft(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const [activeTagPopup, setActiveTagPopup] = useState<string | null>(null);

  const updateCategoryInline = async (note: StickyNote, newCat: NoteCategory) => {
    if (note.category === newCat) {
      setActiveTagPopup(null);
      return;
    }
    try {
      const updated = await api.updateNote(docId, note.id, {
        content: note.content,
        category: newCat,
      });
      updateNoteInStore(updated);
      toast.success("Tag updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update tag");
    } finally {
      setActiveTagPopup(null);
    }
  };

  return (
    <div className="flex flex-col px-4 pt-2 pb-4 bg-[#faf9f6] text-slate-800 min-h-full font-sans shadow-inner overflow-x-hidden relative">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-300/60 pb-2 mb-3">
        <div className="flex items-center gap-3">
          <Pin className="size-6 -rotate-45 text-slate-400 drop-shadow-sm" />
          <div>
            <h2 className="text-xl font-bold tracking-[0.2em] text-slate-700">STICKY NOTES</h2>
            <p className="text-[13px] text-slate-500 font-medium mt-0.5">Notes anchored to this PDF ({notes.length} notes)</p>
          </div>
        </div>
        <button 
          onClick={() => { cancelEdit(); document.getElementById('draft-textarea')?.focus(); }}
          className="bg-[#fef3c7] hover:bg-[#fde68a] text-amber-900 border border-amber-200/50 rounded-sm px-3 py-1.5 text-xs font-bold tracking-wider flex items-center gap-1.5 transition-transform hover:-translate-y-0.5 shadow-[2px_3px_6px_rgba(0,0,0,0.06)]"
        >
          <Plus className="size-4" /> NEW NOTE
        </button>
      </div>

      {/* Composer */}
      <div className={cn("rounded-xl border-2 border-dashed border-slate-300 bg-white/40 p-3 mb-4 shadow-sm relative transition-colors", editId ? "border-primary/50 bg-primary/5" : "")}>
        {editId && (
          <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
            EDITING
          </div>
        )}
        <div className="absolute -top-3 -left-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 -rotate-12"><path d="M13.22 19.03a1.4 1.4 0 0 0 1.98 0l6.77-6.77a1.4 1.4 0 0 0 0-1.98l-7.78-7.78a1.4 1.4 0 0 0-1.98 0L2.44 12.27a1.4 1.4 0 0 0 0 1.98z"/><path d="m9 16 3-3"/></svg>
        </div>
        
        {/* Markdown Toolbar */}
        <div className="flex items-center gap-1 mb-2 border-b border-slate-200/50 pb-2">
          <button onClick={() => insertMarkdown("**", "**")} className="p-1 hover:bg-slate-200 rounded text-slate-500" title="Bold"><Bold className="size-3.5" /></button>
          <button onClick={() => insertMarkdown("*", "*")} className="p-1 hover:bg-slate-200 rounded text-slate-500" title="Italic"><Italic className="size-3.5" /></button>
          <button onClick={() => insertMarkdown("- ")} className="p-1 hover:bg-slate-200 rounded text-slate-500" title="List"><List className="size-3.5" /></button>
          <button onClick={() => insertMarkdown("$$ ", " $$")} className="p-1 hover:bg-slate-200 rounded text-slate-500" title="Equation"><Sigma className="size-3.5" /></button>
        </div>

        <textarea
          id="draft-textarea"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Write a note... (markdown supported)&#10;Select text in the PDF to anchor a note to that region."
          rows={3}
          className="w-full resize-none bg-transparent p-2 text-base font-kalam text-slate-700 placeholder:text-slate-400 outline-none focus:ring-0"
        />
        <div className="mt-2 flex flex-wrap items-center gap-3 border-t border-dashed border-slate-300 pt-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-600">Note Type:</span>
            <CategoryPicker value={draftCat} onChange={setDraftCat} />
          </div>
          <div className="ml-auto flex items-center gap-2">
            {!editId && (
              <>
                <span className="text-xs font-medium text-slate-600">Sync:</span>
                <Select value={notebookId} onValueChange={setNotebookId}>
                  <SelectTrigger className="h-8 w-auto min-w-[130px] text-xs bg-white border-slate-300 text-slate-700">
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
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {editId && (
              <button 
                className="h-8 rounded border border-slate-300 px-3 text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-100" 
                onClick={cancelEdit} 
              >
                Cancel
              </button>
            )}
            <button 
              className="h-8 rounded bg-primary px-3 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/90 flex items-center disabled:opacity-50" 
              onClick={submit} 
              disabled={saving || !draft.trim()}
            >
              {saving ? <Loader2 className="mr-1 size-3.5 animate-spin" /> : <Check className="mr-1 size-3.5" />}
              {editId ? "Save changes" : "Add note"}
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Sort */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
            <span className="font-semibold">All</span> ({notes.length})
          </FilterChip>
          {NOTE_CATEGORY_LIST.map((cat) => {
            const meta = NOTE_CATEGORIES[cat];
            const count = notes.filter((n) => n.category === cat).length;
            return (
              <FilterChip key={cat} active={filter === cat} onClick={() => setFilter(cat)} className={meta.chip}>
                <meta.icon className={cn("size-3.5", meta.dot)} /> {meta.label} ({count})
              </FilterChip>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-600">Sort:</span>
          <Select defaultValue="page">
            <SelectTrigger className="h-8 w-[100px] text-xs bg-white border-slate-300">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="page">Page ↑</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 pb-20">
        {visible.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center opacity-60">
            <StickyNoteIcon className="size-12 text-slate-300 mb-3" />
            <p className="text-sm font-medium text-slate-500">No notes yet.</p>
            <p className="text-xs text-slate-400 max-w-xs text-center mt-1">Select text in the PDF or use the box above to write a new sticky note.</p>
          </div>
        ) : (
          <div className="flex flex-wrap items-start gap-5 pb-8">
            {visible.map((note, idx) => {
              const meta = NOTE_CATEGORIES[note.category];
              
              const rotations = ["-rotate-1", "rotate-1", "-rotate-[1.5deg]", "rotate-[1.5deg]"];
              const rotation = rotations[idx % rotations.length];
              
              const bgColors: Record<string, string> = {
                insight: "bg-[#fef3c7]",
                question: "bg-[#f3e8ff]",
                formula: "bg-[#d1fae5]",
                confusing: "bg-[#ffe4e6]",
                general: "bg-[#e0f2fe]"
              };
              const colorClass = bgColors[note.category] || "bg-[#fef3c7]";
              
              const isEditing = editId === note.id;

              return (
                <div 
                  key={note.id} 
                  className={cn(
                    "relative w-[260px] p-4 flex flex-col min-h-[280px]",
                    "shadow-[2px_4px_12px_rgba(0,0,0,0.12)] transition-transform hover:z-10 hover:scale-105",
                    colorClass, 
                    rotation,
                    isEditing ? "ring-2 ring-primary ring-offset-2 scale-105 z-10" : ""
                  )}
                >
                  {/* Tape */}
                  <div className="absolute -top-3 left-1/2 w-10 h-6 -translate-x-1/2 bg-yellow-600/15 mix-blend-multiply rotate-2 shadow-[0_1px_2px_rgba(0,0,0,0.1)]" />

                  <div className="flex items-start justify-between mb-4 mt-1">
                    <span className={cn("flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase", meta.dot)}>
                      <meta.icon className="size-4" /> {meta.label}
                    </span>
                    <span className="text-xs font-medium text-slate-600/70">p. {note.page_number}</span>
                  </div>

                  <div className="font-kalam text-2xl leading-relaxed flex-1 text-slate-800 break-words mb-4 whitespace-pre-wrap">
                    <MarkdownRenderer content={note.content} />
                  </div>

                  <hr className="border-t border-dashed border-black/10 my-3" />
                  
                  <div className="mb-4">
                    <div className="text-[10px] font-medium text-slate-500 mb-1.5">Anchored region:</div>
                    <div className={cn(
                      "p-2 rounded text-xs text-black/60 italic",
                      note.bounding_box ? "bg-black/5" : "text-black/40"
                    )}>
                      {note.bounding_box ? `Region attached on page ${note.page_number}` : "No region anchored."}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 relative">
                    <button 
                      onClick={() => note.bounding_box && onScrollToRegion?.(note.page_number, note.bounding_box)} 
                      className="flex flex-col items-center gap-1.5 text-[10px] font-medium text-slate-600 hover:text-black transition-colors disabled:opacity-40" 
                      disabled={!note.bounding_box}
                    >
                      <MapPin className="size-4" /> Go to
                    </button>
                    <button 
                      onClick={() => startEdit(note)} 
                      className="flex flex-col items-center gap-1.5 text-[10px] font-medium text-slate-600 hover:text-black transition-colors"
                    >
                      <Pencil className="size-4" /> Edit
                    </button>
                    <div className="relative">
                      <button 
                        onClick={() => setActiveTagPopup(activeTagPopup === note.id ? null : note.id)} 
                        className={cn("flex flex-col items-center gap-1.5 text-[10px] font-medium transition-colors", activeTagPopup === note.id ? "text-primary" : "text-slate-600 hover:text-black")}
                      >
                        <Tag className="size-4" /> Tag
                      </button>
                      
                      {activeTagPopup === note.id && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-white rounded-lg shadow-xl border border-slate-200 z-50 w-max">
                          <div className="text-[10px] font-semibold text-slate-400 mb-1.5 px-1 uppercase tracking-wider">Change Type</div>
                          <div className="grid grid-cols-2 gap-1.5">
                            {NOTE_CATEGORY_LIST.map(cat => {
                              const cMeta = NOTE_CATEGORIES[cat];
                              return (
                                <button
                                  key={cat}
                                  onClick={() => updateCategoryInline(note, cat)}
                                  className={cn("flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[10px] font-medium border text-left", note.category === cat ? cMeta.chip : "border-slate-100 hover:bg-slate-50")}
                                >
                                  <cMeta.icon className={cn("size-3", note.category === cat ? cMeta.dot : "text-slate-400")} /> {cMeta.label}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => remove(note)} 
                      className="flex flex-col items-center gap-1.5 text-[10px] font-medium text-slate-600 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="size-4" /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

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
    <div className="flex flex-wrap gap-1.5">
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
              "flex items-center gap-1.5 rounded-sm border px-2 py-1 text-[11px] font-medium transition-colors bg-white shadow-sm",
              active ? cn(meta.chip, "border-opacity-50 ring-1 ring-black/10") : "border-slate-200 text-slate-500 hover:bg-slate-50"
            )}
          >
            <meta.icon className={cn("size-3.5", active ? meta.dot : "text-slate-400")} /> {meta.label}
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
  className,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-sm border px-2.5 py-1 text-xs transition-colors shadow-sm",
        active ? cn("ring-1 ring-black/5", className || "border-slate-400 bg-slate-700 text-white") : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
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
