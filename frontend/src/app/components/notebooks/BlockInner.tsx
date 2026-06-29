import { useState, useRef } from "react";
import {
  BookPlus,
  Sparkles,
  Gauge,
  Workflow,
  Layers,
  ListChecks,
  Check,
  PencilRuler,
  ExternalLink,
  Scissors,
  Pencil,
  Trash2,
  X,
  Bold,
  Italic,
  List,
  Sigma,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { cn } from "../ui/utils";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "../ui/dialog";
import { MarkdownRenderer } from "../MarkdownRenderer";
import { DiagramViewer } from "../DiagramViewer";
import { StickyNoteComposer } from "../StickyNoteComposer";
import type { NotebookBlock } from "../../lib/notebook-data";
import { artifactLabel } from "../../lib/serializers";
import { calloutMeta, parseNotes } from "./utils";
import { NOTE_CATEGORIES, NOTE_CATEGORY_LIST } from "../../stores/useReadingNotesStore";
import type { NoteCategory } from "../../lib/types";
import { api } from "../../lib/api";

const CITE_RE = /\[\[cite:(\d+)(?::(\d+))?\]\]/;

function renderCiteText(text: string): (string | React.ReactNode)[] {
  const parts: (string | React.ReactNode)[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  const re = new RegExp(CITE_RE.source, "g");
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const docId = m[1];
    const page = m[2] ? ` p.${m[2]}` : "";
    parts.push(
      <Badge
        key={m.index}
        variant="outline"
        className="mx-0.5 inline-flex cursor-help gap-1 border-cyan/30 bg-cyan-soft/30 px-1.5 py-0.5 text-[11px] font-medium text-cyan hover:bg-cyan-soft/50"
        title={`Source document #${docId}${page}`}
      >
        <BookPlus className="mr-0.5 size-3" />
        Source {docId}{page}
      </Badge>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function hasCitations(text: string): boolean {
  CITE_RE.lastIndex = 0;
  return CITE_RE.test(text);
}

export function BlockInner({
  block,
  onUngroup,
  onDeleteNote,
  onUpdateNote,
}: {
  block: NotebookBlock;
  onUngroup?: (noteIndex: number) => void;
  onDeleteNote?: (noteIndex: number) => void;
  onUpdateNote?: (noteIndex: number, newRaw: string) => void;
}) {
  const navigate = useNavigate();
  const [editModalIdx, setEditModalIdx] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editCat, setEditCat] = useState<string>("General");
  const [editSaving, setEditSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  switch (block.type) {
    case "heading":
      return block.level === 1 ? (
        <h1 className="mt-6 text-4xl font-bold">{block.text}</h1>
      ) : (
        <h2 className="mt-5 text-2xl font-semibold">{block.text}</h2>
      );
    case "text": {
      if (block.source?.type === "reading") {
        const parsedNotes = parseNotes(block.text);
        
        const saveEditModal = async (idx: number, note: (typeof parsedNotes)[number]) => {
          if (!editContent.trim()) return;
          setEditSaving(true);
          try {
            const footer = note.raw.match(/\s*(?:—|–|-)\s*(.+?),\s*p\.(\d+)\s*(?:#\S+)?\s*$/);
            const footerStr = footer ? footer[0].trim() : "";
            const newRaw = footerStr
              ? `[ ${editCat}] ${editContent}\n\n${footerStr}`
              : `[ ${editCat}] ${editContent}`;
            
            onUpdateNote?.(idx, newRaw);
            
            const catKey = NOTE_CATEGORY_LIST.find((k) => NOTE_CATEGORIES[k].label === editCat);
            if (block.source?.type === "reading" && note.docId && note.noteId && catKey) {
              api
                .updateNote(note.docId, note.noteId, {
                  content: editContent,
                  category: catKey,
                })
                .catch(() => toast.error("Failed to sync note to reading page"));
            }
            
            setEditModalIdx(null);
          } catch {
            toast.error("Failed to save note");
          } finally {
            setEditSaving(false);
          }
        };
        
        const insertMd = (before: string, after: string = "") => {
          const ta = textareaRef.current;
          if (!ta) return;
          const start = ta.selectionStart;
          const end = ta.selectionEnd;
          const sel = editContent.substring(start, end);
          setEditContent(editContent.substring(0, start) + before + sel + after + editContent.substring(end));
          setTimeout(() => {
            ta.focus();
            ta.setSelectionRange(start + before.length, end + before.length);
          }, 0);
        };
        
        return (
          <>
          <div className="flex flex-wrap items-start gap-5 py-4">
            {parsedNotes.map((note, idx) => {
              const categoryStr = (note.category || "general").toLowerCase() as NoteCategory;
              const meta = NOTE_CATEGORIES[categoryStr] || NOTE_CATEGORIES["general"];
              
              const rotations = ["-rotate-1", "rotate-1", "-rotate-[1.5deg]", "rotate-[1.5deg]"];
              const rotationClass = rotations[idx % rotations.length];
              
              const bgColors: Record<string, string> = {
                insight: "bg-[#fef3c7]",
                question: "bg-[#f3e8ff]",
                formula: "bg-[#d1fae5]",
                confusing: "bg-[#ffe4e6]",
                general: "bg-[#e0f2fe]"
              };
              const colorClass = bgColors[categoryStr] || "bg-[#fef3c7]";

              return (
                <div 
                  key={idx}
                  className={cn(
                    "relative w-full max-w-[260px] p-4 flex flex-col min-h-[280px] group/card",
                    "shadow-[2px_4px_12px_rgba(0,0,0,0.12)] transition-transform hover:z-10 hover:scale-105",
                    colorClass, 
                    rotationClass,
                  )}
                >
                  {/* Tape */}
                  <div className="absolute -top-3 left-1/2 w-10 h-6 -translate-x-1/2 bg-yellow-600/15 mix-blend-multiply rotate-2 shadow-[0_1px_2px_rgba(0,0,0,0.1)]" />
                  
                  <div className="flex items-start justify-between mb-4 mt-1">
                    <span className={cn("flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase", meta.dot)}>
                      <meta.icon className="size-4" /> {meta.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditModalIdx(idx);
                          setEditContent(note.content);
                          setEditCat(note.category);
                          setTimeout(() => textareaRef.current?.focus(), 100);
                        }}
                        className="opacity-0 group-hover/card:opacity-100 transition-opacity text-slate-500 hover:text-primary p-0.5 rounded hover:bg-black/5"
                        title="Edit note"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      {parsedNotes.length > 1 && onUngroup && (
                        <button
                          onClick={() => onUngroup(idx)}
                          className="opacity-0 group-hover/card:opacity-100 transition-opacity text-slate-500 hover:text-primary p-0.5 rounded hover:bg-black/5"
                          title="Ungroup note"
                        >
                          <Scissors className="size-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => onDeleteNote?.(idx)}
                        className="opacity-0 group-hover/card:opacity-100 transition-opacity text-slate-500 hover:text-destructive p-0.5 rounded hover:bg-black/5"
                        title="Delete note"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                      {note.pageNum && <span className="text-xs font-medium text-slate-600/70">p. {note.pageNum}</span>}
                    </div>
                  </div>

                  <div className="font-kalam text-2xl leading-relaxed flex-1 text-slate-800 break-words mb-2 whitespace-pre-wrap">
                    <MarkdownRenderer content={note.content} className="!font-kalam text-2xl" />
                  </div>
                  
                  {note.docTitle && (
                    <div className="mt-4 text-[11px] font-medium text-slate-400 italic text-right border-t border-black/5 pt-2">
                      from {note.docTitle}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <Dialog open={editModalIdx !== null} onOpenChange={(open) => { if (!open) setEditModalIdx(null); }}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogTitle>Edit Note</DialogTitle>
              {editModalIdx !== null && (
                <div className="mt-2">
                  <StickyNoteComposer
                    content={editContent}
                    onChangeContent={setEditContent}
                    category={editCat}
                    onChangeCategory={setEditCat}
                    onSave={() => {
                      const note = parsedNotes[editModalIdx];
                      if (note) saveEditModal(editModalIdx, note);
                    }}
                    onCancel={() => setEditModalIdx(null)}
                    saving={editSaving}
                    isEditing={true}
                    autoFocus
                  />
                </div>
              )}
            </DialogContent>
          </Dialog>
        </>
        );
      }
      return (
        <>
          {block.source && (
            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
              <BookPlus className="size-3" /> Source:{" "}
              {artifactLabel(block.source.type)}
            </span>
          )}
          {hasCitations(block.text) ? (
            <div className="text-[18px] leading-relaxed [&>p]:mb-4">
              {renderCiteText(block.text)}
            </div>
          ) : (
            <MarkdownRenderer content={block.text} className="text-[18px] leading-relaxed" />
          )}
        </>
      );
    }
    case "callout": {
      const m = calloutMeta[block.tone];
      return (
        <div className={cn("flex gap-4 rounded-xl border p-5", m.cls)}>
          <m.icon className={cn("mt-0.5 size-6 shrink-0", m.iconCls)} />
          <div className="font-reading text-[18px] leading-relaxed">{block.text}</div>
        </div>
      );
    }
    case "code":
      return (
        <pre className="overflow-x-auto rounded-lg border border-border bg-secondary p-5">
          <code className="font-mono text-[14.5px] leading-relaxed text-foreground/90">
            {block.code}
          </code>
        </pre>
      );
    case "table":
      return (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full border-collapse text-base">
            <thead className="bg-muted/60">
              <tr>
                {block.headers.map((h) => (
                  <th
                    key={h}
                    className="border-b border-border px-5 py-3 text-left font-semibold"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className="border-b border-border/60 px-5 py-3 text-foreground/80"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "ai-answer":
      return (
        <div className="overflow-hidden rounded-xl border border-violet/25 bg-violet-soft/40">
          <div className="flex items-center justify-between border-b border-violet/15 px-5 py-3.5">
            <span className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-violet">
              <Sparkles className="size-4" /> Saved AI Answer
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Gauge className="size-3.5" /> {(block.confidence * 100).toFixed(0)}
              % · {block.sources} sources
            </span>
          </div>
          <div className="px-5 pb-4 pt-4">
            <div className="mb-3 font-reading text-lg font-medium italic text-foreground">
              {block.question}
            </div>
            <MarkdownRenderer content={block.answer} className="text-[18px] leading-relaxed" />
          </div>
        </div>
      );
    case "mermaid":
      return (
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Workflow className="size-3.5" /> Diagram
          </div>
          <DiagramViewer code={block.code} />
        </div>
      );
    case "flashdeck":
      return (
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2.5 text-base font-semibold">
              <Layers className="size-5 text-violet" /> {block.name}
            </span>
            <Badge variant="outline" className="text-xs text-muted-foreground px-2.5 py-0.5">
              {block.count} cards
            </Badge>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {block.cards.map((c, i) => (
              <div
                key={i}
                className="rounded-lg border border-border bg-background/50 p-4"
              >
                <div className="font-reading text-base leading-snug font-medium">
                  {c.front}
                </div>
                <div className="mt-2.5 border-t border-border pt-2 text-xs text-muted-foreground">
                  {c.back}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    case "quiz-results": {
      const pct = Math.round((block.score / block.total) * 100);
      return (
        <div className="flex items-center gap-5 rounded-xl border border-border bg-card p-5">
          <div className="flex size-16 shrink-0 flex-col items-center justify-center rounded-xl bg-success-soft text-success">
            <span className="font-display text-2xl leading-none">{pct}%</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5 text-base font-semibold">
              <ListChecks className="size-5 text-success" /> {block.title}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              Scored {block.score} of {block.total} · embedded quiz result
            </div>
          </div>
          <Check className="size-6 text-success" />
        </div>
      );
    }
    case "whiteboard":
      // Static read-only snapshot — clicking opens the live whiteboard editor.
      // A snapshot (not a live canvas) keeps notebooks lightweight.
      return (
        <button
          type="button"
          onClick={() => navigate(`/whiteboards/${block.whiteboardId}`)}
          className="group/wb block w-full overflow-hidden rounded-xl border border-border bg-card text-left transition-colors hover:border-violet/40"
        >
          <div className="flex aspect-video items-center justify-center overflow-hidden border-b border-border bg-muted/30">
            {block.thumbnail ? (
              <img src={block.thumbnail} alt="" className="h-full w-full object-contain" />
            ) : (
              <PencilRuler className="size-10 text-muted-foreground/40" />
            )}
          </div>
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <span className="flex min-w-0 items-center gap-2.5 text-base font-semibold">
              <PencilRuler className="size-5 shrink-0 text-violet" />
              <span className="truncate">{block.title || "Whiteboard"}</span>
            </span>
            <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground group-hover/wb:text-violet">
              Open <ExternalLink className="size-3.5" />
            </span>
          </div>
        </button>
      );
    default:
      return null;
  }
}
