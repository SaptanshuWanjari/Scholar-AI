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
import { cn } from "@/paper-ui/utils";
import { PaperBadge } from "@/paper-ui/components/badges";
import { PaperModal } from "@/paper-ui/components/dialogs";
import { PaperH1, PaperH2 } from "@/paper-ui/core";
import { PaperCard } from "@/paper-ui/core";
import { PaperTable, TableHeader, TableRow, PaperTh, PaperTd } from "@/paper-ui/components/tables";
import { MarkdownRenderer } from "../MarkdownRenderer";
import { DiagramViewer } from "../DiagramViewer";
import { StickyNoteComposer } from "../StickyNoteComposer";
import type { NotebookBlock } from "../../lib/notebook-data";
import { artifactLabel } from "../../lib/serializers";
import { calloutMeta, parseNotes } from "./utils";
import { NOTE_CATEGORIES, NOTE_CATEGORY_LIST } from "../../stores/useReadingNotesStore";
import type { NoteCategory } from "../../lib/types";
import { api } from "../../lib/api";
import { ImageViewer } from "./ImageViewer";

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
      <PaperBadge
        key={m.index}
        tone="sky"
        className="mx-0.5 inline-flex cursor-help gap-1 px-1.5 py-0.5 text-[11px] font-medium"
      >
        <BookPlus className="mr-0.5 size-3" />
        Source {docId}{page}
      </PaperBadge>,
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
        <PaperH1 marker markerColor="#f6e27a">{block.text}</PaperH1>
      ) : (
        <PaperH2 marker markerColor="#f6e27aaa">{block.text}</PaperH2>
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
                  <div className="absolute -top-3 left-1/2 w-10 h-6 -translate-x-1/2 bg-yellow-600/15 mix-blend-multiply rotate-2 shadow-[0_1px_2px_rgba(0,0,0,0.1)]" />
                  
                  <div className="flex items-start justify-between mb-4 mt-1">
                    <span className={cn("flex items-center gap-1.5 font-architect text-xs font-semibold tracking-wide uppercase", meta.dot)}>
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
                      {note.pageNum && <span className="font-architect text-xs font-medium text-slate-600/70">p. {note.pageNum}</span>}
                    </div>
                  </div>

                  <div className="font-kalam text-2xl leading-relaxed flex-1 text-slate-800 break-words mb-2 whitespace-pre-wrap">
                    <MarkdownRenderer content={note.content} className="!font-kalam text-2xl" />
                  </div>
                  
                  {note.docTitle && (
                    <div className="mt-4 font-architect text-[11px] font-medium text-slate-400 italic text-right border-t border-black/5 pt-2">
                      from {note.docTitle}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <PaperModal
            open={editModalIdx !== null}
            onClose={() => setEditModalIdx(null)}
            title="Edit Note"
            width={600}
          >
            {editModalIdx !== null && (
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
            )}
          </PaperModal>
        </>
        );
      }
      return (
        <>
          {block.source && (
            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-ink-muted/20 bg-ink/3 px-2.5 py-0.5 font-architect text-[11px] font-medium text-ink-muted">
              <BookPlus className="size-3" /> Source:{" "}
              {artifactLabel(block.source.type)}
            </span>
          )}
          {hasCitations(block.text) ? (
            <div className="font-kalam text-[18px] leading-relaxed [&>p]:mb-4">
              {renderCiteText(block.text)}
            </div>
          ) : (
            <MarkdownRenderer content={block.text} className="font-kalam text-[18px] leading-relaxed" />
          )}
        </>
      );
    }
    case "callout": {
      const m = calloutMeta[block.tone];
      return (
        <PaperCard shadow="sm" surface="#fffdf9" border={{ strokeWidth: 1.3, roughness: 1 }}>
          <div className={cn("flex gap-4 p-5", m.cls.replace(/border-border|bg-muted\/50|bg-violet-soft|bg-warning-soft/g, ""))}>
            <m.icon className={cn("mt-0.5 size-6 shrink-0", m.iconCls)} />
            <div className="font-kalam text-[18px] leading-relaxed">{block.text}</div>
          </div>
        </PaperCard>
      );
    }
    case "code":
      return (
        <PaperCard shadow="sm" surface="#f8f7f3" border={{ strokeWidth: 1, roughness: 0.9 }}>
          <pre className="overflow-x-auto p-5">
            <code className="font-mono text-[14.5px] leading-relaxed text-ink/90">
              {block.code}
            </code>
          </pre>
        </PaperCard>
      );
    case "table":
      return (
        <PaperTable striped>
          <TableHeader>
            <tr>
              {block.headers.map((h) => (
                <PaperTh key={h}>{h}</PaperTh>
              ))}
            </tr>
          </TableHeader>
          <tbody>
            {block.rows.map((row, i) => (
              <TableRow key={i} index={i}>
                {row.map((cell, j) => (
                  <PaperTd key={j}>{cell}</PaperTd>
                ))}
              </TableRow>
            ))}
          </tbody>
        </PaperTable>
      );
    case "ai-answer":
      return (
        <PaperCard shadow="sm" surface="#faf8ff" border={{ strokeWidth: 1.3, roughness: 1.1, stroke: "#a78bfa" }}>
          <div className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-violet/15 px-5 py-3.5">
              <span className="flex items-center gap-2 font-architect text-sm font-semibold uppercase tracking-[0.1em] text-violet">
                <Sparkles className="size-4" /> Saved AI Answer
              </span>
              <span className="flex items-center gap-1.5 font-architect text-xs text-ink-muted">
                <Gauge className="size-3.5" /> {(block.confidence * 100).toFixed(0)}
                % · {block.sources} sources
              </span>
            </div>
            <div className="px-5 pb-4 pt-4">
              <div className="mb-3 font-caveat text-[22px] leading-snug italic text-ink">
                {block.question}
              </div>
              <MarkdownRenderer content={block.answer} className="font-kalam text-[18px] leading-relaxed" />
            </div>
          </div>
        </PaperCard>
      );
    case "mermaid":
      return (
        <div>
          <div className="mb-2 flex items-center gap-2 font-architect text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
            <Workflow className="size-3.5" /> Diagram
          </div>
          <DiagramViewer code={block.code} />
        </div>
      );
    case "flashdeck":
      return (
        <PaperCard shadow="sm" surface="#fffdf9" border={{ strokeWidth: 1.3, roughness: 1 }}>
          <div className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2.5 font-caveat text-[22px] font-semibold text-ink">
                <Layers className="size-5 text-violet" /> {block.name}
              </span>
              <PaperBadge tone="ink">
                {block.count} cards
              </PaperBadge>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {block.cards.map((c, i) => (
                <PaperCard key={i} shadow="none" surface="#fffdf9" border={{ strokeWidth: 0.9, roughness: 0.8 }}>
                  <div className="p-4">
                    <div className="font-caveat text-[18px] leading-snug font-semibold text-ink">
                      {c.front}
                    </div>
                    <div className="mt-2.5 border-t border-ink-muted/15 pt-2 font-kalam text-xs text-ink-muted">
                      {c.back}
                    </div>
                  </div>
                </PaperCard>
              ))}
            </div>
          </div>
        </PaperCard>
      );
    case "quiz-results": {
      const pct = Math.round((block.score / block.total) * 100);
      return (
        <PaperCard shadow="sm" surface="#fffdf9" border={{ strokeWidth: 1.3, roughness: 1 }}>
          <div className="flex items-center gap-5 p-5">
            <div className="flex size-16 shrink-0 flex-col items-center justify-center rounded-xl bg-success-soft text-success">
              <span className="font-caveat text-[28px] leading-none">{pct}%</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2.5 font-caveat text-[19px] font-semibold text-ink">
                <ListChecks className="size-5 text-success" /> {block.title}
              </div>
              <div className="mt-1 font-kalam text-sm text-ink-muted">
                Scored {block.score} of {block.total} · embedded quiz result
              </div>
            </div>
            <Check className="size-6 text-success" />
          </div>
        </PaperCard>
      );
    }
    case "whiteboard":
      return (
        <PaperCard shadow="sm" lift surface="#fffdf9" border={{ strokeWidth: 1.3, roughness: 1, stroke: "#a78bfa" }}>
          <button
            type="button"
            onClick={() => navigate(`/whiteboards/${block.whiteboardId}`)}
            className="group/wb block w-full text-left"
          >
            <div className="flex aspect-video items-center justify-center overflow-hidden border-b border-ink-muted/10 bg-ink/[0.02]">
              {block.thumbnail ? (
                <img src={block.thumbnail} alt="" className="h-full w-full object-contain" />
              ) : (
                <PencilRuler className="size-10 text-ink-muted/30" />
              )}
            </div>
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <span className="flex min-w-0 items-center gap-2.5 font-caveat text-[19px] font-semibold text-ink">
                <PencilRuler className="size-5 shrink-0 text-violet" />
                <span className="truncate">{block.title || "Whiteboard"}</span>
              </span>
              <span className="flex shrink-0 items-center gap-1.5 font-architect text-xs text-ink-muted group-hover/wb:text-violet">
                Open <ExternalLink className="size-3.5" />
              </span>
            </div>
          </button>
        </PaperCard>
      );
    case "image":
      return <ImageViewer url={block.url} alt={block.alt} />;
    default:
      return null;
  }
}
