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
  BookPlus,
} from "lucide-react";
import { MarkdownRenderer } from "../MarkdownRenderer";
import { AddToNotebookMenu } from "../AddToNotebookMenu";
import { StickyNoteComposer } from "../StickyNoteComposer";
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

export type SubMode = "notes" | "draw" | "both";

export interface ReadingWorkspaceProps {
  docId: string;
  course?: string | null;
  excalidrawEnabled: boolean;
  notebooks: NotebookMeta[];
  notebooks: NotebookMeta[];
  subMode: SubMode;
  onScrollToRegion?: (page: number, bbox: NoteRect) => void;
}

export function ReadingWorkspace({
  docId,
  course,
  excalidrawEnabled,
  notebooks,
  subMode,
  onScrollToRegion,
}: ReadingWorkspaceProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
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
  const [isComposerOpen, setIsComposerOpen] = useState(false);

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
        setIsComposerOpen(false);
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
        setIsComposerOpen(false);
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
    setIsComposerOpen(true);
  };

  const cancelEdit = () => {
    setEditId(null);
    setDraft("");
    setDraftCat("general");
    setIsComposerOpen(false);
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
    <div className="flex flex-col px-4 pt-2 pb-4 bg-[#faf9f6] dark:bg-card text-slate-800 dark:text-foreground min-h-full font-sans shadow-inner overflow-x-hidden relative">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-300/60 dark:border-border pb-2 mb-3">
        <div className="flex items-center gap-3">
          <Pin className="size-6 -rotate-45 text-slate-400 drop-shadow-sm" />
          <div>
            <h2 className="text-xl font-bold tracking-[0.2em] text-slate-700 dark:text-foreground">STICKY NOTES</h2>
            <p className="text-[13px] text-slate-500 dark:text-muted-foreground font-medium mt-0.5">Notes anchored to this PDF ({notes.length} notes)</p>
          </div>
        </div>
        <button 
          onClick={() => { 
            setEditId(null);
            setDraft("");
            setDraftCat("general");
            setIsComposerOpen(true); 
            setTimeout(() => document.getElementById('draft-textarea')?.focus(), 100);
          }}
          className="bg-[#fef3c7] hover:bg-[#fde68a] text-amber-900 border border-amber-200/50 rounded-sm px-3 py-1.5 text-xs font-bold tracking-wider flex items-center gap-1.5 transition-transform hover:-translate-y-0.5 shadow-[2px_3px_6px_rgba(0,0,0,0.06)] dark:bg-amber-950 dark:hover:bg-amber-900 dark:text-amber-200 dark:border-amber-800"
        >
          <Plus className="size-4" /> NEW NOTE
        </button>
      </div>

      {/* Inline Composer */}
      {isComposerOpen && (
        <div className="mb-6">
          <StickyNoteComposer
            content={draft}
            onChangeContent={setDraft}
            category={draftCat}
            onChangeCategory={(cat) => setDraftCat(cat as NoteCategory)}
            onSave={submit}
            onCancel={cancelEdit}
            saving={saving}
            isEditing={!!editId}
            placeholder="Write a note... &#10;Select text in the PDF to anchor a note to that region."
            autoFocus
            extraControls={
              !editId && (
                <>
                  <span className="text-xs font-medium text-slate-600 dark:text-muted-foreground">Sync:</span>
                  <Select value={notebookId} onValueChange={setNotebookId}>
                    <SelectTrigger className="h-8 w-auto min-w-[130px] text-xs bg-white border-slate-300 text-slate-700 dark:bg-background dark:border-border dark:text-foreground">
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
              )
            }
          />
        </div>
      )}

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
          <span className="text-xs font-medium text-slate-600 dark:text-muted-foreground">Sort:</span>
          <Select defaultValue="page">
            <SelectTrigger className="h-8 w-[100px] text-xs bg-white border-slate-300 dark:bg-background dark:border-border dark:text-foreground">
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
              const categoryStr = (note.category || "general").toLowerCase() as NoteCategory;
              const meta = NOTE_CATEGORIES[categoryStr] || NOTE_CATEGORIES["general"];              
              const rotations = ["-rotate-1", "rotate-1", "-rotate-[1.5deg]", "rotate-[1.5deg]"];
              const rotation = rotations[idx % rotations.length];
              
              const bgColors: Record<string, string> = {
                insight: "bg-[#fef3c7] dark:bg-amber-950/30 dark:text-amber-100 dark:border-amber-800/60 border border-transparent",
                question: "bg-[#f3e8ff] dark:bg-violet-950/30 dark:text-violet-100 dark:border-violet-800/60 border border-transparent",
                formula: "bg-[#d1fae5] dark:bg-emerald-950/30 dark:text-emerald-100 dark:border-emerald-800/60 border border-transparent",
                confusing: "bg-[#ffe4e6] dark:bg-rose-950/30 dark:text-rose-100 dark:border-rose-800/60 border border-transparent",
                general: "bg-[#e0f2fe] dark:bg-blue-950/30 dark:text-blue-100 dark:border-blue-800/60 border border-transparent"
              };
              const colorClass = bgColors[note.category] || "bg-[#fef3c7] dark:bg-amber-950/30 dark:text-amber-100 dark:border-amber-800/60 border border-transparent";
              
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
                  <div className="absolute -top-3 left-1/2 w-10 h-6 -translate-x-1/2 bg-yellow-600/15 dark:bg-yellow-600/5 mix-blend-multiply rotate-2 shadow-[0_1px_2px_rgba(0,0,0,0.1)]" />

                  <div className="flex items-start justify-between mb-4 mt-1">
                    <span className={cn("flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase", meta.dot)}>
                      <meta.icon className="size-4" /> {meta.label}
                    </span>
                    <span className="text-xs font-medium text-slate-600/70 dark:text-slate-400/80">p. {note.page_number}</span>
                  </div>

                  <div className="flex-1 mb-4">
                    <MarkdownRenderer content={note.content} className="!font-kalam text-2xl text-slate-800 dark:text-slate-200 break-words [&_p]:!mb-1.5 [&_p]:!leading-snug [&_ul]:!mb-1.5 [&_ul]:!space-y-0.5 [&_li]:!mb-0.5" />
                  </div>

                  <hr className="border-t border-dashed border-black/10 dark:border-white/10 my-3" />
                  
                  <div className="mb-4">
                    <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mb-1.5">Anchored region:</div>
                    <div className={cn(
                      "p-2 rounded text-xs text-black/60 dark:text-slate-300 italic",
                      note.bounding_box ? "bg-black/5 dark:bg-white/5" : "text-black/40 dark:text-slate-500"
                    )}>
                      {note.bounding_box ? `Region attached on page ${note.page_number}` : "No region anchored."}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 relative">
                    <button 
                      onClick={() => note.bounding_box && onScrollToRegion?.(note.page_number, note.bounding_box)} 
                      className="flex flex-col items-center gap-1.5 text-[10px] font-medium text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 hover:text-black transition-colors disabled:opacity-40" 
                      disabled={!note.bounding_box}
                    >
                      <MapPin className="size-4" /> Go to
                    </button>
                    <button 
                      onClick={() => startEdit(note)} 
                      className="flex flex-col items-center gap-1.5 text-[10px] font-medium text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 hover:text-black transition-colors"
                    >
                      <Pencil className="size-4" /> Edit
                    </button>
                    <AddToNotebookMenu
                      artifactType="reading"
                      sourceId={note.id}
                      customBlocks={() => [{
                        type: "text",
                        text: `[ ${meta.label}] ${note.content}\n\n— ${docId}, p.${note.page_number} #${docId}-n${note.id}`,
                        source: { type: "reading", id: note.id }
                      }]}
                      trigger={
                        <button className="flex flex-col items-center gap-1.5 text-[10px] font-medium text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 hover:text-black transition-colors">
                          <BookPlus className="size-4" /> Sync
                        </button>
                      }
                    />
                    <div className="relative">
                      <button 
                        onClick={() => setActiveTagPopup(activeTagPopup === note.id ? null : note.id)} 
                        className={cn("flex flex-col items-center gap-1.5 text-[10px] font-medium transition-colors", activeTagPopup === note.id ? "text-primary" : "text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 hover:text-black")}
                      >
                        <Tag className="size-4" /> Tag
                      </button>
                      
                      {activeTagPopup === note.id && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-white dark:bg-popover rounded-lg shadow-xl border border-slate-200 dark:border-border z-50 w-max">
                          <div className="text-[10px] font-semibold text-slate-400 dark:text-muted-foreground mb-1.5 px-1 uppercase tracking-wider">Change Type</div>
                          <div className="grid grid-cols-2 gap-1.5">
                            {NOTE_CATEGORY_LIST.map(cat => {
                              const cMeta = NOTE_CATEGORIES[cat];
                              return (
                                <button
                                  key={cat}
                                  onClick={() => updateCategoryInline(note, cat)}
                                  className={cn("flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[10px] font-medium border text-left", note.category === cat ? cMeta.chip : "border-slate-100 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 dark:text-zinc-300")}
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
                      className="flex flex-col items-center gap-1.5 text-[10px] font-medium text-slate-600 dark:text-slate-400 dark:hover:text-red-400 hover:text-red-600 transition-colors"
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
              "flex items-center gap-1.5 rounded-sm border px-2 py-1 text-[11px] font-medium transition-colors bg-white dark:bg-zinc-900 shadow-sm",
              active ? cn(meta.chip, "border-opacity-50 ring-1 ring-black/10") : "border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800"
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
        active ? cn("ring-1 ring-black/5", className || "border-slate-400 dark:border-zinc-700 bg-slate-700 dark:bg-zinc-800 text-white") : "border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800"
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
