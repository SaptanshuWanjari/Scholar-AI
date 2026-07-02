import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { toast } from "@/app/lib/toast";
import {
  StickyNote as StickyNoteIcon,
  PencilRuler, Columns, Plus, Trash2, Pencil,
  Loader2, PuzzleIcon, MapPin, Tag, BookPlus,
  Bold, Italic, Underline, Code, Sigma, List,
} from "lucide-react";
import { cn } from "@/paper-ui/utils";
import { PaperButton, ChipButton, IconButton, GhostButton } from "@/paper-ui/components/buttons";
import { PaperSelect, PaperTextarea } from "@/paper-ui/components/inputs";
import { SectionLabel, PaperCard } from "@/paper-ui/core";
import { StickyNoteCard } from "@/paper-ui/components/cards";
import { SketchDivider, PushPin } from "@/paper-ui/components/decorations";
import { MarkdownRenderer } from "../MarkdownRenderer";
import { AddToNotebookMenu } from "../AddToNotebookMenu";
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
  subMode: SubMode;
  onScrollToRegion?: (page: number, bbox: NoteRect) => void;
}

export function ReadingWorkspace({
  docId, course, excalidrawEnabled, notebooks, subMode, onScrollToRegion,
}: ReadingWorkspaceProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden paper-texture">
      <div className={cn("flex min-h-0 flex-1", subMode === "both" ? "flex-col" : "")}>
        {(subMode === "notes" || subMode === "both") && (
          <div className={cn("min-h-0 overflow-y-auto paper-scrollbar", subMode === "both" ? "h-1/2 border-b border-[#c8c0b0]" : "flex-1")}>
            <NotesPanel docId={docId} notebooks={notebooks} onScrollToRegion={onScrollToRegion} />
          </div>
        )}
        {(subMode === "draw" || subMode === "both") && (
          <div className={cn("min-h-0 overflow-y-auto paper-scrollbar", subMode === "both" ? "h-1/2" : "flex-1")}>
            <DrawPanel docId={docId} course={course} excalidrawEnabled={excalidrawEnabled} />
          </div>
        )}
      </div>
    </div>
  );
}

function NotesPanel({
  docId, notebooks, onScrollToRegion,
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
        const updated = await api.updateNote(docId, editId, { content, category: draftCat });
        updateNoteInStore(updated);
        cancelEdit();
        toast.success("Note updated");
      } else {
        const note = await api.createNote(docId, { content, category: draftCat, pageNumber: 1, notebookId: notebookId === "none" ? null : notebookId });
        addNote(note);
        setDraft("");
        setIsComposerOpen(false);
        toast.success("Note added");
      }
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed to save note"); }
    finally { setSaving(false); }
  };

  const remove = async (note: StickyNote) => {
    try { await api.deleteNote(docId, note.id); removeNote(note.id); if (editId === note.id) cancelEdit(); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Failed to delete"); }
  };

  const startEdit = (note: StickyNote) => {
    setEditId(note.id); setDraft(note.content); setDraftCat(note.category); setIsComposerOpen(true);
  };

  const cancelEdit = () => { setEditId(null); setDraft(""); setDraftCat("general"); setIsComposerOpen(false); };

  const [activeTagPopup, setActiveTagPopup] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertMarkdown = (syntax: "bold" | "italic" | "underline" | "code" | "equation" | "bullet") => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = el.value;
    const selected = text.substring(start, end);

    let replacement = "";
    switch (syntax) {
      case "bold":
        replacement = `**${selected || "bold text"}**`;
        break;
      case "italic":
        replacement = `*${selected || "italic text"}*`;
        break;
      case "underline":
        replacement = `<u>${selected || "underlined text"}</u>`;
        break;
      case "code":
        replacement = `\`${selected || "code"}\``;
        break;
      case "equation":
        replacement = `$$${selected || "equation"}$$`;
        break;
      case "bullet":
        replacement = `\n- ${selected || "item"}`;
        break;
    }

    const newVal = text.substring(0, start) + replacement + text.substring(end);
    setDraft(newVal);

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 0);
  };

  const updateCategoryInline = async (note: StickyNote, newCat: NoteCategory) => {
    if (note.category === newCat) { setActiveTagPopup(null); return; }
    try {
      const updated = await api.updateNote(docId, note.id, { content: note.content, category: newCat });
      updateNoteInStore(updated);
      toast.success("Tag updated");
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed to update tag"); }
    finally { setActiveTagPopup(null); }
  };

  return (
    <div className="flex flex-col px-5 pt-4 pb-4 min-h-full overflow-x-hidden">
      {/* Header with pin */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#c8c0b0]/50">
        <div className="flex items-center gap-3">
          <PushPin size={24} position="none" className="!drop-shadow-none" />
          <div>
            <SectionLabel className="!text-xs tracking-[0.2em]">Sticky Notes</SectionLabel>
            <p className="font-kalam text-xs text-ink-muted mt-0.5">
              Notes anchored to this PDF ({notes.length} notes)
            </p>
          </div>
        </div>
        <PaperButton size="sm" tone="paper" onClick={() => { setEditId(null); setDraft(""); setDraftCat("general"); setIsComposerOpen(true); }}>
          <Plus size={15} /> New Note
        </PaperButton>
      </div>

      {/* Inline composer */}
      {isComposerOpen && (
        <div className="mb-6">
          <PaperCard shadow="sm" className="!p-4">
            {/* Markdown Toolbar */}
            <div className="flex flex-wrap items-center gap-1">
              <IconButton label="Bold" onClick={() => insertMarkdown("bold")} type="button" className="!h-8 !w-8 hover:bg-black/[0.04]">
                <Bold size={13} />
              </IconButton>
              <IconButton label="Italic" onClick={() => insertMarkdown("italic")} type="button" className="!h-8 !w-8 hover:bg-black/[0.04]">
                <Italic size={13} />
              </IconButton>
              <IconButton label="Underline" onClick={() => insertMarkdown("underline")} type="button" className="!h-8 !w-8 hover:bg-black/[0.04]">
                <Underline size={13} />
              </IconButton>
              <IconButton label="Code" onClick={() => insertMarkdown("code")} type="button" className="!h-8 !w-8 hover:bg-black/[0.04]">
                <Code size={13} />
              </IconButton>
              <IconButton label="Equation" onClick={() => insertMarkdown("equation")} type="button" className="!h-8 !w-8 hover:bg-black/[0.04]">
                <Sigma size={13} />
              </IconButton>
              <IconButton label="Bullet List" onClick={() => insertMarkdown("bullet")} type="button" className="!h-8 !w-8 hover:bg-black/[0.04]">
                <List size={13} />
              </IconButton>
            </div>
            <SketchDivider variant="dashed" className="mb-3 mt-1.5" />

            <PaperTextarea
              ref={textareaRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Write a note...&#10;Select text in the PDF to anchor a note to that region."
              className="!px-3 !py-2 !font-kalam !text-sm"
              rows={5}
            />
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <SectionLabel className="!text-[10px]">Category:</SectionLabel>
                <div className="flex flex-wrap gap-1">
                  {NOTE_CATEGORY_LIST.map((cat) => {
                    const meta = NOTE_CATEGORIES[cat];
                    const active = draftCat === cat;
                    return (
                      <ChipButton key={cat} selected={active} onClick={() => setDraftCat(cat)} className="!text-[11px] !h-7">
                        <meta.icon size={12} /> {meta.label}
                      </ChipButton>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {!editId && (
                  <>
                    <SectionLabel className="!text-[10px]">Sync:</SectionLabel>
                    <PaperSelect
                      value={notebookId}
                      onChange={setNotebookId}
                      options={[
                        { value: "none", label: "No notebook sync" },
                        ...notebooks.map(nb => ({ value: nb.id, label: nb.name })),
                      ]}
                      className="!px-2 !py-1 !text-xs"
                    />
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <GhostButton onClick={cancelEdit} className="!text-xs">Cancel</GhostButton>
                <PaperButton tone="dark" size="sm" onClick={submit} disabled={saving}>
                  {saving ? <Loader2 className="size-3.5 animate-spin" /> : null}
                  {editId ? "Update" : "Save"}
                </PaperButton>
              </div>
            </div>
          </PaperCard>
        </div>
      )}

      {/* Filter chips */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <ChipButton selected={filter === "all"} onClick={() => setFilter("all")} className="!text-xs">
          All ({notes.length})
        </ChipButton>
        {NOTE_CATEGORY_LIST.map((cat) => {
          const meta = NOTE_CATEGORIES[cat];
          const count = notes.filter((n) => n.category === cat).length;
          return (
            <ChipButton key={cat} selected={filter === cat} onClick={() => setFilter(cat)} className="!text-xs">
              <meta.icon size={12} /> {meta.label} ({count})
            </ChipButton>
          );
        })}
      </div>

      <SketchDivider variant="straight" />

      {/* Notes grid */}
      <div className="flex-1 pb-20 pt-4">
        {visible.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center opacity-60">
            <StickyNoteIcon size={40} className="text-ink-muted/30 mb-3" />
            <p className="font-kalam text-sm text-ink-muted">No notes yet.</p>
            <p className="font-kalam text-xs text-ink-muted/60 max-w-xs text-center mt-1">
              Select text in the PDF or use the box above to write a new sticky note.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap items-start gap-5 pb-8">
            {visible.map((note) => {
              const cat = (note.category || "general").toLowerCase() as NoteCategory;
              const meta = NOTE_CATEGORIES[cat] || NOTE_CATEGORIES["general"];
              const colorMap: Record<string, "yellow" | "pink" | "blue" | "green" | "orange" | "purple"> = {
                insight: "yellow",
                question: "purple",
                formula: "green",
                confusing: "pink",
                general: "blue",
              };
              const stickyColor = colorMap[cat] || "yellow";

              return (
                <StickyNoteCard
                  key={note.id}
                  color={stickyColor}
                  rotate={Math.random() * 3 - 1.5}
                  pin="tape"
                  className="w-[260px]"
                  tags={[meta.label]}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-architect text-[11px] text-ink-muted flex items-center gap-1">
                      <meta.icon size={13} /> p.{note.page_number}
                    </span>
                  </div>
                  <MarkdownRenderer content={note.content} className="!font-kalam text-base text-ink/85 break-words [&_p]:!mb-1.5 [&_p]:!leading-snug [&_ul]:!mb-1.5 [&_li]:!mb-0.5" />
                  <SketchDivider variant="dashed" className="my-3" />
                  <div className="text-xs text-ink-muted mb-3">
                    {note.bounding_box ? `Region attached on page ${note.page_number}` : "No region anchored."}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-black/[0.06]">
                    <IconButton label="Go to region" onClick={() => note.bounding_box && onScrollToRegion?.(note.page_number, note.bounding_box)} disabled={!note.bounding_box}>
                      <MapPin size={14} />
                    </IconButton>
                    <IconButton label="Edit" onClick={() => startEdit(note)}>
                      <Pencil size={14} />
                    </IconButton>
                    <AddToNotebookMenu
                      artifactType="reading"
                      sourceId={note.id}
                      customBlocks={() => [{
                        type: "text",
                        text: `[${meta.label}] ${note.content}\n\n— ${docId}, p.${note.page_number} #${docId}-n${note.id}`,
                        source: { type: "reading", id: note.id },
                      }]}
                      trigger={
                        <IconButton label="Sync to notebook">
                          <BookPlus size={14} />
                        </IconButton>
                      }
                    />
                    <div className="relative">
                      <IconButton label="Change category" onClick={() => setActiveTagPopup(activeTagPopup === note.id ? null : note.id)}>
                        <Tag size={14} />
                      </IconButton>
                      {activeTagPopup === note.id && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50">
                          <PaperCard shadow="md" className="!p-3 min-w-[220px]">
                            <div className="font-architect text-xs text-ink-muted uppercase tracking-wider mb-2 px-1">Change Type</div>
                            <div className="grid grid-cols-2 gap-2">
                              {NOTE_CATEGORY_LIST.map(c => {
                                const cMeta = NOTE_CATEGORIES[c];
                                return (
                                  <ChipButton key={c} selected={note.category === c} onClick={() => updateCategoryInline(note, c)} className="!text-xs !h-8 !px-2">
                                    <cMeta.icon size={13} /> {cMeta.label}
                                  </ChipButton>
                                );
                              })}
                            </div>
                          </PaperCard>
                        </div>
                      )}
                    </div>
                    <IconButton label="Delete" onClick={() => remove(note)} className="hover:!text-danger">
                      <Trash2 size={14} />
                    </IconButton>
                  </div>
                </StickyNoteCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function DrawPanel({
  docId, course, excalidrawEnabled,
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
    api.listDocAnnotations(docId)
      .then((b) => !cancelled && setBoards(b))
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [docId, excalidrawEnabled]);

  if (!excalidrawEnabled) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
        <PaperCard shadow="sm" className="!p-4"><PuzzleIcon className="size-6 text-ink-muted" /></PaperCard>
        <p className="font-caveat text-xl font-bold text-ink">Excalidraw plugin not configured</p>
        <p className="font-kalam text-sm text-ink-muted max-w-xs leading-relaxed">
          Enable the <span className="font-medium text-ink">Excalidraw Whiteboards</span> plugin in Settings to draw region annotations. Sticky notes work without it.
        </p>
      </div>
    );
  }

  const createBlank = async () => {
    setCreating(true);
    try {
      const wb = await api.createWhiteboard({ title: "Annotation", course: course ?? null, source: "annotation", documentId: Number(docId) });
      navigate(`/whiteboards/${wb.id}`);
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed to create board"); }
    finally { setCreating(false); }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="self-start">
        <PaperButton size="sm" tone="paper" onClick={createBlank} disabled={creating}>
          {creating ? <Loader2 className="size-3.5 animate-spin" /> : <Plus size={15} />}
          New blank board
        </PaperButton>
      </div>
      <p className="font-kalam text-xs text-ink-muted">
        Tip: select PDF text and choose &ldquo;Annotate Region&rdquo; to start a board with that region as a traceable background.
      </p>
      <SketchDivider variant="straight" />
      {loading ? (
        <div className="flex justify-center py-6"><Loader2 className="size-5 animate-spin text-ink-muted" /></div>
      ) : boards.length === 0 ? (
        <p className="font-kalam text-xs text-ink-muted text-center py-6">
          No annotation boards for this document yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {boards.map((wb) => (
            <button key={wb.id} onClick={() => navigate(`/whiteboards/${wb.id}`)}
              className="group relative overflow-hidden rounded text-left transition-transform hover:-translate-y-0.5">
              <PaperCard shadow="sm" className="!p-0">
                <div className="flex aspect-video items-center justify-center bg-black/[0.03]">
                  {wb.thumbnail ? <img src={wb.thumbnail} alt={wb.title} className="h-full w-full object-cover" /> : <PencilRuler size={20} className="text-ink-muted/60" />}
                </div>
                <div className="px-3 py-2">
                  <div className="font-architect text-xs text-ink truncate">{wb.title}</div>
                  {wb.pageNumber != null && <div className="font-kalam text-[10px] text-ink-muted">p.{wb.pageNumber}</div>}
                </div>
              </PaperCard>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
