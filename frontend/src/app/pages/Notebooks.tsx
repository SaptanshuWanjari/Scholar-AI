import { useMemo, useCallback, useEffect, useRef, useState } from "react";
import {
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Plus,
  Search,
  Hash,
  FolderClosed,
  Clock,
  Sparkles,
  FileText,
  ScrollText,
  Wand2,
  Layers,
  ListChecks,
  Workflow,
  Quote,
  Gauge,
  GripVertical,
  Lightbulb,
  Info,
  TriangleAlert,
  Check,
  BookOpen,
  Loader2,
  Trash2,
  Bold,
  Italic,
  Code2,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Link2,
  Strikethrough,
  Heading3,
  Table,
  ListTodo,
  BookPlus,
} from "lucide-react";
import { toast } from "sonner";
import { applyMarkdown, type MarkdownAction } from "../lib/markdown-format";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { cn } from "../components/ui/utils";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { MarkdownRenderer } from "../components/MarkdownRenderer";
import { DiagramViewer } from "../components/DiagramViewer";
import { SelectionToolbar } from "../components/SelectionToolbar";
import { type NotebookBlock } from "../lib/notebook-data";
import { artifactLabel } from "../lib/serializers";
import {
  api,
  type NotebookMeta,
  type NotebookFull,
  type Collection,
} from "../lib/api";
import type { Course } from "../lib/types";
import { useAutoSave } from "../hooks/useAutoSave";
import { Virtuoso } from "react-virtuoso";

// Deterministic default icon per notebook (no icon field on real notebooks).
const NOTEBOOK_ICONS = [
  BookOpen,
  FileText,
  Layers,
  ScrollText,
  Lightbulb,
] as const;
function iconFor(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return NOTEBOOK_ICONS[h % NOTEBOOK_ICONS.length];
}

const calloutMeta = {
  note: {
    icon: Info,
    cls: "border-border bg-muted/50 text-foreground",
    iconCls: "text-muted-foreground",
  },
  insight: {
    icon: Lightbulb,
    cls: "border-violet/30 bg-violet-soft text-foreground",
    iconCls: "text-violet",
  },
  warning: {
    icon: TriangleAlert,
    cls: "border-warning/30 bg-warning-soft text-foreground",
    iconCls: "text-warning",
  },
};

export function Notebooks() {
  const [list, setList] = useState<NotebookMeta[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [active, setActive] = useState<NotebookFull | null>(null);
  const [blocks, setBlocks] = useState<NotebookBlock[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingNotebook, setLoadingNotebook] = useState(false);
  const [assisting, setAssisting] = useState(false);

  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Block editing / drag-reorder state.
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  // Dynamic sidebar sections (collections + tags).
  const [collections, setCollections] = useState<Collection[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  // New-notebook dialog state
  const [courses, setCourses] = useState<Course[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCourse, setNewCourse] = useState<string>("none");
  const [creating, setCreating] = useState(false);

  // Draft restore banner state
  const [showDraftBanner, setShowDraftBanner] = useState(false);

  const [scrollParent, setScrollParent] = useState<HTMLElement | null>(null);

  // Auto-save wiring
  const saveFn = useCallback(
    async (next: NotebookBlock[]) => {
      if (!activeId) return;
      const updated = await api.updateNotebook(activeId, { blocks: next, is_draft: true });
      setActive(updated);
      setList((prev) =>
        prev.map((n) =>
          n.id === activeId
            ? { ...n, notes: next.length, lastEdited: "just now" }
            : n,
        ),
      );
    },
    [activeId],
  );

  const { schedule: autoSave, flush: flushSave, saving, lastSaved } = useAutoSave(saveFn);

  // Fetch the dynamic sidebar sections (collections + tags). Called on mount
  // and again whenever a notebook is created so counts/tags stay fresh.
  function loadSidebar() {
    api
      .listNotebookCollections()
      .then(setCollections)
      .catch(() => setCollections([]));
    api
      .listNotebookTags()
      .then(setTags)
      .catch(() => setTags([]));
  }

  // Load the notebook list on mount.
  useEffect(() => {
    setLoadingList(true);
    api
      .listNotebooks()
      .then((nbs) => {
        setList(nbs);
        if (nbs.length > 0) setActiveId(nbs[0].id);
      })
      .catch((e) => toast.error(`Failed to load notebooks: ${e.message}`))
      .finally(() => setLoadingList(false));
    api
      .listCourses()
      .then(setCourses)
      .catch(() => setCourses([]));
    loadSidebar();
  }, []);

  // Load the selected notebook whenever the active id changes.
  useEffect(() => {
    if (!activeId) {
      setActive(null);
      setBlocks([]);
      return;
    }
    let cancelled = false;
    setLoadingNotebook(true);
    api
      .getNotebook(activeId)
      .then((nb) => {
        if (cancelled) return;
        setActive(nb);
        setBlocks((nb.blocks ?? []) as NotebookBlock[]);
        setShowDraftBanner(nb.is_draft === true);
      })
      .catch((e) => {
        if (!cancelled) toast.error(`Failed to open notebook: ${e.message}`);
      })
      .finally(() => {
        if (!cancelled) setLoadingNotebook(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activeId]);

  // beforeunload: flush any pending debounced save before the tab closes.
  useEffect(() => {
    window.addEventListener("beforeunload", flushSave);
    return () => window.removeEventListener("beforeunload", flushSave);
  }, [flushSave]);

  // Dismiss the draft-restore banner and mark the notebook as no longer a draft.
  async function dismissDraftBanner() {
    flushSave();
    setShowDraftBanner(false);
    if (activeId) {
      await api.updateNotebook(activeId, { is_draft: false }).catch(() => {});
    }
  }

  // Persist the given blocks for the active notebook via debounced auto-save.
  function persistBlocks(next: NotebookBlock[]) {
    if (!activeId) return;
    setBlocks(next);
    autoSave(next);
  }

  // Append a fresh block of the given type and jump straight into editing it.
  async function checkDeduplication(text: string, blockIndex: number) {
    if (!activeId || !text.trim()) return;
    try {
      const res = await api.notebookDeduplicate(parseInt(activeId, 10), text);
      if (res.redundant && res.existing_block_index !== null) {
        setBlocks((prev) => {
          const next = [...prev];
          if (next[blockIndex]) {
            next[blockIndex] = { 
              ...next[blockIndex], 
              _flagged: { 
                similarity: res.similarity, 
                content: text,
                originalIndex: res.existing_block_index
              } 
            } as any;
          }
          return next;
        });
      }
    } catch (e) {
      console.error("Deduplication check failed", e);
    }
  }

  function addBlock(block: NotebookBlock) {
    const next = [...blocks, block];
    persistBlocks(next);
    setEditingIndex(next.length - 1);
    const newText = (block as any).text || (block as any).answer || (block as any).code;
    if (newText && block.type === "ai-answer") {
      checkDeduplication(newText, next.length - 1);
    }
  }

  function updateBlock(index: number, patch: Partial<NotebookBlock>) {
    persistBlocks(
      blocks.map((b, i) =>
        i === index ? ({ ...b, ...patch } as NotebookBlock) : b,
      ),
    );
    const newText = (patch as any).text || (patch as any).answer || (patch as any).code;
    // Don't dedup if we're just removing the flag
    if (newText && !("text" in patch === false && "answer" in patch === false && "code" in patch === false && Object.keys(patch).length === 1 && "_flagged" in patch)) {
      checkDeduplication(newText, index);
    }
  }

  function mergeBlock(index: number, targetIndex: number) {
    const sourceBlock = blocks[index] as any;
    const targetBlock = blocks[targetIndex] as any;
    
    if (!sourceBlock || !targetBlock) return;
    
    const sourceText = sourceBlock.text || sourceBlock.answer || sourceBlock.code || "";
    const targetText = targetBlock.text || targetBlock.answer || targetBlock.code || "";
    
    const next = [...blocks];
    
    if (targetBlock.type === "text" || targetBlock.type === "callout" || targetBlock.type === "heading") {
      next[targetIndex] = { ...targetBlock, text: targetText + "\n\n" + sourceText };
    } else if (targetBlock.type === "ai-answer") {
      next[targetIndex] = { ...targetBlock, answer: targetText + "\n\n" + sourceText };
    } else if (targetBlock.type === "code" || targetBlock.type === "mermaid") {
      next[targetIndex] = { ...targetBlock, code: targetText + "\n\n" + sourceText };
    }
    
    // Remove the source block
    next.splice(index, 1);
    persistBlocks(next);
  }

  function deleteBlock(index: number) {
    if (editingIndex === index) setEditingIndex(null);
    persistBlocks(blocks.filter((_, i) => i !== index));
  }

  // Reorder via drag handle: pull `from` out, splice it back at `to`.
  function moveBlock(from: number, to: number) {
    if (from === to) return;
    const next = [...blocks];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    persistBlocks(next);
  }

  async function handleCreate() {
    const title = newTitle.trim();
    if (!title) {
      toast.error("Enter a notebook title");
      return;
    }
    setCreating(true);
    try {
      const nb = await api.createNotebook(
        title,
        newCourse === "none" ? null : newCourse,
      );
      const meta: NotebookMeta = {
        id: nb.id,
        name: nb.title,
        course: nb.course,
        color: nb.color,
        notes: nb.blocks?.length ?? 0,
        lastEdited: "just now",
      };
      setList((prev) => [meta, ...prev]);
      setActiveId(nb.id);
      setCreateOpen(false);
      setNewTitle("");
      setNewCourse("none");
      loadSidebar();
      toast.success(`Created “${nb.title}”`);
    } catch (e: any) {
      toast.error(`Failed to create notebook: ${e.message}`);
    } finally {
      setCreating(false);
    }
  }

  // AI assist: run the action on the selected text, then insert the
  // returned markdown as a new ai-answer block and persist.
  async function runAssist(
    action: "explain" | "summarize" | "improve",
    selected: string,
  ) {
    const sel = selected.trim();
    if (!sel) {
      toast.error("Select some text first");
      return;
    }
    if (!activeId || assisting) return;
    const labels: Record<typeof action, string> = {
      explain: "Explaining selection…",
      summarize: "Summarizing selection…",
      improve: "Improving selection…",
    };
    setAssisting(true);
    const toastId = toast.loading(labels[action]);
    try {
      const { text } = await api.notebookAssist(
        action,
        sel,
        active?.course ?? null,
      );
      const block: NotebookBlock = {
        type: "ai-answer",
        question: `${action[0].toUpperCase()}${action.slice(1)}: ${sel.slice(0, 80)}${sel.length > 80 ? "…" : ""}`,
        answer: text,
        confidence: 1,
        sources: 0,
      };
      persistBlocks([...blocks, block]);
      toast.success("AI block added", { id: toastId });
    } catch (e: any) {
      toast.error(`AI assist failed: ${e.message}`, { id: toastId });
    } finally {
      setAssisting(false);
    }
  }

  const actions = [
    {
      label: "Explain",
      icon: Wand2,
      onSelect: (text: string) => runAssist("explain", text),
    },
    {
      label: "Summarize",
      icon: ScrollText,
      onSelect: (text: string) => runAssist("summarize", text),
    },
    {
      label: "Improve",
      icon: Sparkles,
      onSelect: (text: string) => runAssist("improve", text),
    },
    {
      label: "Cite",
      icon: Quote,
      onSelect: () => toast.success("Citation saved"),
    },
  ];

  const activeMeta = list.find((n) => n.id === activeId);

  // Recent notes derived from the already-loaded notebook list (list is kept
  // in recency order — newly created notebooks are prepended).
  const recentNotes = list.slice(0, 5).map((n) => ({
    id: n.id,
    title: n.name,
    notebook: n.course || "Notebook",
  }));

  const dynamicInspector = useMemo(() => {
    if (!active) return null;

    let wordCount = 0;
    let aiCount = 0;
    let diagramCount = 0;
    let flashcardCount = 0;
    let quizCount = 0;

    (blocks || []).forEach((b: any) => {
      if (!b) return;
      if (b.type === "text" || b.type === "heading" || b.type === "callout") {
        wordCount += (b.text || "").split(/\s+/).length;
      } else if (b.type === "ai-answer") {
        wordCount += (b.answer || "").split(/\s+/).length;
        aiCount++;
      } else if (b.type === "mermaid") {
        diagramCount++;
      } else if (b.type === "flashdeck") {
        flashcardCount += b.count || 0;
      } else if (b.type === "quiz-results") {
        quizCount++;
      }
    });

    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    const generatedAssets = [
      { label: "AI Answers", count: aiCount },
      { label: "Diagrams", count: diagramCount },
      { label: "Flashcards", count: flashcardCount },
      { label: "Quizzes", count: quizCount },
    ].filter((a) => a.count > 0);

    return {
      details: {
        notebook: activeMeta?.name ?? active.title,
        type: active.course || "General Note",
        created: active.updated || "Unknown",
      },
      wordCount,
      readingTime: `${readingTime} min`,
      linkedSources: [] as string[],
      generatedAssets,
      relatedTopics: [] as string[],
      revisionStatus: "In progress",
    };
  }, [active, activeMeta, blocks]);

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left — Notebooks */}
      <aside
        className={cn(
          "hidden shrink-0 flex-col overflow-y-auto border-r border-border bg-card/40 transition-all duration-300 lg:flex",
          leftCollapsed ? "w-0 border-r-0" : "w-[280px]",
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Notebooks
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={() => setLeftCollapsed(true)}
            >
              <PanelLeftClose className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="size-4" />
            </Button>
          </div>
        </div>
        <div className="border-b border-border p-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search notes…"
              className="h-8 bg-input-background pl-8 text-xs"
            />
          </div>
        </div>

        <div className="space-y-1 p-2">
          {loadingList ? (
            <div className="flex items-center gap-2 px-2.5 py-3 text-xs text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" /> Loading notebooks…
            </div>
          ) : list.length === 0 ? (
            <button
              onClick={() => setCreateOpen(true)}
              className="flex w-full items-center gap-2 rounded-lg border border-dashed border-border px-2.5 py-3 text-left text-xs text-muted-foreground hover:border-violet/50 hover:text-violet"
            >
              <Plus className="size-3.5" /> Create your first notebook
            </button>
          ) : (
            list.map((n) => {
              const Icon = iconFor(n.id);
              return (
                <button
                  key={n.id}
                  onClick={() => setActiveId(n.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors",
                    activeId === n.id ? "bg-accent" : "hover:bg-accent/50",
                  )}
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-background/50">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{n.name}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {n.notes} notes · {n.lastEdited}
                    </div>
                  </div>
                  <span
                    className="size-1.5 rounded-full"
                    style={{ backgroundColor: n.color }}
                  />
                </button>
              );
            })
          )}
        </div>

        <Section label="Collections" icon={FolderClosed}>
          {collections.length === 0 ? (
            <div className="px-2.5 py-1.5 text-xs text-muted-foreground">
              No collections
            </div>
          ) : (
            collections.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-md px-2.5 py-1.5 text-sm text-foreground/80 hover:bg-accent/50"
              >
                <span className="truncate">{c.name}</span>
                <span className="text-xs text-muted-foreground">{c.count}</span>
              </div>
            ))
          )}
        </Section>

        <Section label="Tags" icon={Hash}>
          {tags.length === 0 ? (
            <div className="px-2.5 py-1.5 text-xs text-muted-foreground">
              No tags
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5 px-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border bg-card px-2 py-0.5 text-[11px] text-muted-foreground"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </Section>

        <Section label="Recent" icon={Clock}>
          {recentNotes.length === 0 ? (
            <div className="px-2.5 py-1.5 text-xs text-muted-foreground">
              No recent notes
            </div>
          ) : (
            recentNotes.map((r) => (
              <div
                key={r.id}
                className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-foreground/80 hover:bg-accent/50"
              >
                <FileText className="size-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate">{r.title}</span>
              </div>
            ))
          )}
        </Section>
      </aside>

      {/* Center — Content */}
      <main ref={setScrollParent} className="relative min-w-0 flex-1 overflow-y-auto">
        <SelectionToolbar containerRef={contentRef} actions={actions} />

        {/* Sidebar Toggles */}
        <div className="pointer-events-none absolute left-0 top-4 z-10 flex w-full justify-between px-4">
          <div className="pointer-events-auto">
            {leftCollapsed && (
              <Button
                variant="outline"
                size="icon"
                className="size-8 rounded-full bg-card/80 backdrop-blur shadow-sm"
                onClick={() => setLeftCollapsed(false)}
              >
                <PanelLeftOpen className="size-4" />
              </Button>
            )}
          </div>
          <div className="pointer-events-auto">
            {rightCollapsed && (
              <Button
                variant="outline"
                size="icon"
                className="size-8 rounded-full bg-card/80 backdrop-blur shadow-sm"
                onClick={() => setRightCollapsed(false)}
              >
                <PanelRightOpen className="size-4" />
              </Button>
            )}
          </div>
        </div>

        <div ref={contentRef} className="mx-auto max-w-[900px] px-10 py-12">
          {loadingNotebook ? (
            <div className="flex items-center gap-2 py-20 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Loading notebook…
            </div>
          ) : !active ? (
            <div className="flex flex-col items-center gap-4 py-24 text-center text-muted-foreground">
              <BookOpen className="size-10 opacity-40" />
              <div>
                <div className="text-base font-medium text-foreground">
                  No notebook selected
                </div>
                <p className="mt-1 text-sm">
                  Pick a notebook from the sidebar or create a new one.
                </p>
              </div>
              <Button onClick={() => setCreateOpen(true)}>
                <Plus className="mr-2 size-4" /> New notebook
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <span>
                  {activeMeta?.name ?? active.title} · {active.updated}
                </span>
                {saving && <Loader2 className="size-3 animate-spin" />}
              </div>
              <h1 className="mt-3 text-[2.75rem] leading-[1.1]">
                {active.title}
              </h1>
              {active.subtitle && (
                <p className="mt-3 font-reading text-lg italic text-muted-foreground">
                  {active.subtitle}
                </p>
              )}

              <div className="mt-8 space-y-5">
                {showDraftBanner && (
                  <div className="mb-3 flex items-center justify-between rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
                    <span>Auto-saved changes from your last session have been restored.</span>
                    <button
                      className="ml-4 text-xs font-medium underline hover:no-underline"
                      onClick={dismissDraftBanner}
                    >
                      Got it
                    </button>
                  </div>
                )}

                {blocks.length === 0 && (
                  <div className="rounded-xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">
                    This notebook is empty. Add a block below, or select text
                    elsewhere and use AI assist.
                  </div>
                )}

                {scrollParent && blocks.length > 0 && (
                  <Virtuoso
                    useWindowScroll
                    customScrollParent={scrollParent}
                    data={blocks}
                    itemContent={(i, block) => (
                      <div className="pb-5">
                        <BlockView
                          block={block}
                          index={i}
                          editing={editingIndex === i}
                          dragging={dragIndex === i}
                          dropTarget={
                            overIndex === i && dragIndex !== null && dragIndex !== i
                          }
                          onEdit={() => setEditingIndex(i)}
                          onSave={(patch) => {
                            updateBlock(i, patch);
                            setEditingIndex(null);
                          }}
                          onCancel={() => setEditingIndex(null)}
                          onDelete={() => deleteBlock(i)}
                          onMerge={(targetIdx) => mergeBlock(i, targetIdx)}
                          onDragStart={() => setDragIndex(i)}
                          onDragEnter={() => dragIndex !== null && setOverIndex(i)}
                          onDragEnd={() => {
                            if (dragIndex !== null && overIndex !== null)
                              moveBlock(dragIndex, overIndex);
                            setDragIndex(null);
                            setOverIndex(null);
                          }}
                        />
                      </div>
                    )}
                  />
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="group flex w-full items-center gap-2 rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-violet/50 hover:text-violet">
                      <Plus className="size-4" /> Add block
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[300px]">
                    <DropdownMenuItem
                      onClick={() =>
                        addBlock({
                          type: "text",
                          text: "New text block. Edit me!",
                        })
                      }
                    >
                      <FileText className="mr-2 size-4 text-muted-foreground" />{" "}
                      Text
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        addBlock({
                          type: "heading",
                          level: 2,
                          text: "New Heading",
                        })
                      }
                    >
                      <Hash className="mr-2 size-4 text-muted-foreground" />{" "}
                      Heading
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        addBlock({
                          type: "callout",
                          tone: "note",
                          text: "New note callout.",
                        })
                      }
                    >
                      <Info className="mr-2 size-4 text-muted-foreground" />{" "}
                      Callout
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        addBlock({
                          type: "code",
                          lang: "python",
                          code: "print('Hello world')",
                        })
                      }
                    >
                      <Workflow className="mr-2 size-4 text-muted-foreground" />{" "}
                      Code
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        addBlock({
                          type: "mermaid",
                          code: "graph TD\n  A[Start] --> B[End]",
                        })
                      }
                    >
                      <Workflow className="mr-2 size-4 text-muted-foreground" />{" "}
                      Diagram
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        addBlock({
                          type: "table",
                          headers: ["Column A", "Column B"],
                          rows: [["", ""]],
                        })
                      }
                    >
                      <Layers className="mr-2 size-4 text-muted-foreground" />{" "}
                      Table
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Right — Inspector */}
      <aside
        className={cn(
          "hidden shrink-0 flex-col overflow-y-auto border-l border-border bg-card/40 transition-all duration-300 xl:flex",
          rightCollapsed ? "w-0 border-l-0" : "w-[300px]",
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => setRightCollapsed(true)}
          >
            <PanelRightClose className="size-4" />
          </Button>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Inspector
          </span>
          <div className="size-7" /> {/* spacer */}
        </div>

        {dynamicInspector ? (
          <div className="space-y-5 p-4">
            <InspectorBlock title="Notebook Details">
              <MetaRow k="Notebook" v={dynamicInspector.details.notebook} />
              <MetaRow k="Course" v={dynamicInspector.details.type} />
              <MetaRow k="Updated" v={dynamicInspector.details.created} />
            </InspectorBlock>

            <div className="grid grid-cols-2 gap-2">
              <Stat label="Words" value={dynamicInspector.wordCount} />
              <Stat label="Reading" value={dynamicInspector.readingTime} />
            </div>

            {dynamicInspector.linkedSources.length > 0 && (
              <InspectorBlock title="Linked Sources">
                {dynamicInspector.linkedSources.map((s) => (
                  <div
                    key={s}
                    className="flex items-start gap-2 py-1 text-sm text-foreground/80"
                  >
                    <FileText className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                    <span className="leading-snug">{s}</span>
                  </div>
                ))}
              </InspectorBlock>
            )}

            {dynamicInspector.generatedAssets.length > 0 && (
              <InspectorBlock title="Generated Assets">
                <div className="grid grid-cols-2 gap-2">
                  {dynamicInspector.generatedAssets.map((a) => (
                    <div
                      key={a.label}
                      className="rounded-lg border border-border bg-card px-3 py-2"
                    >
                      <div className="font-display text-xl leading-none">
                        {a.count}
                      </div>
                      <div className="mt-1 text-[11px] text-muted-foreground">
                        {a.label}
                      </div>
                    </div>
                  ))}
                </div>
              </InspectorBlock>
            )}

            {dynamicInspector.relatedTopics.length > 0 && (
              <InspectorBlock title="Related Topics">
                <div className="flex flex-wrap gap-1.5">
                  {dynamicInspector.relatedTopics.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-border bg-card px-2 py-0.5 text-[11px] text-foreground/70"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </InspectorBlock>
            )}

            <InspectorBlock title="Revision Status">
              <Badge
                variant="outline"
                className="gap-1.5 border-warning/40 bg-warning-soft text-warning"
              >
                <Gauge className="size-3" /> {dynamicInspector.revisionStatus}
              </Badge>
            </InspectorBlock>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground mt-10">
            <Info className="size-8 opacity-20 mb-3" />
            <p className="text-sm">Select a notebook to view its details.</p>
          </div>
        )}
      </aside>

      {/* New notebook dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New notebook</DialogTitle>
            <DialogDescription>
              Give your notebook a title and optionally link a course.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Title
              </label>
              <Input
                autoFocus
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !creating) handleCreate();
                }}
                placeholder="e.g. Machine Learning"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Course (optional)
              </label>
              <Select value={newCourse} onValueChange={setNewCourse}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="No course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No course</SelectItem>
                  {courses.map((c) => (
                    <SelectItem key={c.id} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateOpen(false)}
              disabled={creating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={creating || !newTitle.trim()}
            >
              {creating && <Loader2 className="mr-2 size-4 animate-spin" />}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// A block in the document: hover reveals a drag handle (reorder), edit and
// delete controls. Clicking edit swaps the rendered block for an inline editor.
function BlockView({
  block,
  index,
  editing,
  dragging,
  dropTarget,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onMerge,
  onDragStart,
  onDragEnter,
  onDragEnd,
}: {
  block: NotebookBlock;
  index: number;
  editing: boolean;
  dragging: boolean;
  dropTarget: boolean;
  onEdit: () => void;
  onSave: (patch: Partial<NotebookBlock>) => void;
  onCancel: () => void;
  onDelete: () => void;
  onMerge?: (targetIndex: number) => void;
  onDragStart: () => void;
  onDragEnter: () => void;
  onDragEnd: () => void;
}) {
  const editable = EDITABLE_TYPES.has(block.type);
  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={onDragEnter}
      className={cn(
        "group/block relative -mx-3 rounded-lg px-3 py-1 transition-colors hover:bg-accent/20",
        dragging && "opacity-40",
        dropTarget &&
        "before:absolute before:-top-1 before:left-3 before:right-3 before:h-0.5 before:rounded-full before:bg-violet",
        (block as any)._flagged && "border-l-4 border-yellow-500 bg-yellow-500/5"
      )}
    >
      {(block as any)._flagged && !editing && (
        <div className="absolute -left-10 top-2 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-6 text-yellow-500 hover:text-yellow-600 bg-card/80 backdrop-blur">
                <TriangleAlert className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <div className="px-2 py-1.5 text-xs text-muted-foreground font-medium">
                Redundant block ({((block as any)._flagged.similarity * 100).toFixed(0)}% match)
              </div>
              {(block as any)._flagged.originalIndex !== undefined && onMerge && (
                <DropdownMenuItem onClick={() => onMerge((block as any)._flagged.originalIndex)}>
                  Merge
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onSave({ _flagged: undefined } as any)}>
                Keep Both
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
                Discard Redundant Info
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {!editing && (
        <div className="absolute -left-3 top-2 flex items-center opacity-0 transition-opacity group-hover/block:opacity-100">
          <span
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            className="cursor-grab active:cursor-grabbing"
            title="Drag to reorder"
          >
            <GripVertical className="size-4 text-muted-foreground" />
          </span>
        </div>
      )}

      {!editing && (
        <div className="absolute -top-1 right-1 z-10 flex items-center gap-0.5 opacity-0 transition-opacity group-hover/block:opacity-100">
          {editable && (
            <Button
              variant="ghost"
              size="icon"
              className="size-6 bg-card/80 backdrop-blur"
              onClick={onEdit}
              title="Edit"
            >
              <Wand2 className="size-3.5 text-muted-foreground" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="size-6 bg-card/80 backdrop-blur hover:text-destructive"
            onClick={onDelete}
            title="Delete"
          >
            <Trash2 className="size-3.5 text-muted-foreground hover:text-destructive" />
          </Button>
        </div>
      )}

      {editing ? (
        <BlockEditor block={block} onSave={onSave} onCancel={onCancel} />
      ) : (
        <BlockInner block={block} />
      )}
    </div>
  );
}

const EDITABLE_TYPES = new Set([
  "heading",
  "text",
  "callout",
  "code",
  "mermaid",
  "ai-answer",
  "table",
]);

// Inline editor for the common authorable block types. Commits a typed patch
// back to the parent on save.
function BlockEditor({
  block,
  onSave,
  onCancel,
}: {
  block: NotebookBlock;
  onSave: (patch: Partial<NotebookBlock>) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<NotebookBlock>(block);
  const d = draft as any;

  const field = (patch: Record<string, unknown>) =>
    setDraft({ ...d, ...patch } as NotebookBlock);

  const textRef = useRef<HTMLTextAreaElement>(null);
  const format = (action: MarkdownAction) => {
    if (!textRef.current) return;
    field({ text: applyMarkdown(textRef.current, action) });
  };

  return (
    <div className="space-y-3 rounded-xl border border-violet/40 bg-card/60 p-4">
      {draft.type === "heading" && (
        <>
          <div className="flex gap-1.5">
            {[1, 2].map((lvl) => (
              <button
                key={lvl}
                onClick={() => field({ level: lvl })}
                className={cn(
                  "rounded-md border px-2.5 py-1 text-xs",
                  d.level === lvl
                    ? "border-violet bg-violet-soft text-violet"
                    : "border-border text-muted-foreground",
                )}
              >
                H{lvl}
              </button>
            ))}
          </div>
          <Input
            value={d.text}
            onChange={(e) => field({ text: e.target.value })}
            placeholder="Heading text"
            autoFocus
          />
        </>
      )}

      {draft.type === "text" && (
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-0.5 rounded-lg border border-border bg-card/60 p-1">
            {([
              ["bold", Bold, "Bold"],
              ["italic", Italic, "Italic"],
              ["strikethrough", Strikethrough, "Strikethrough"],
              ["code", Code2, "Code"],
              ["h1", Heading1, "Heading 1"],
              ["h2", Heading2, "Heading 2"],
              ["h3", Heading3, "Heading 3"],
              ["ul", List, "Bullet list"],
              ["ol", ListOrdered, "Numbered list"],
              ["task", ListTodo, "Task list"],
              ["quote", Quote, "Quote block"],
              ["link", Link2, "Link"],
              ["table", Table, "Table"],
            ] as [MarkdownAction, React.ElementType, string][]).map(([action, Icon, label]) => (
              <button
                key={action}
                type="button"
                title={label}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => format(action)}
                className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                <Icon className="size-3.5" />
              </button>
            ))}
          </div>
          <textarea
            ref={textRef}
            value={d.text}
            onChange={(e) => field({ text: e.target.value })}
            placeholder="Write markdown…"
            autoFocus
            rows={5}
            className="w-full resize-y rounded-lg border border-border bg-input-background p-3 font-reading text-sm leading-relaxed outline-none focus:border-violet"
          />
        </div>
      )}

      {draft.type === "callout" && (
        <>
          <div className="flex gap-1.5">
            {(["note", "insight", "warning"] as const).map((tone) => (
              <button
                key={tone}
                onClick={() => field({ tone })}
                className={cn(
                  "rounded-md border px-2.5 py-1 text-xs capitalize",
                  d.tone === tone
                    ? "border-violet bg-violet-soft text-violet"
                    : "border-border text-muted-foreground",
                )}
              >
                {tone}
              </button>
            ))}
          </div>
          <textarea
            value={d.text}
            onChange={(e) => field({ text: e.target.value })}
            placeholder="Callout text"
            autoFocus
            rows={3}
            className="w-full resize-y rounded-lg border border-border bg-input-background p-3 text-sm outline-none focus:border-violet"
          />
        </>
      )}

      {draft.type === "code" && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Input
              value={d.lang}
              onChange={(e) => field({ lang: e.target.value })}
              placeholder="Language (e.g. python)"
              className="h-8 max-w-[150px] text-xs"
            />
            <div className="flex gap-1">
              {["python", "typescript", "sql", "rust", "go"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => field({ lang })}
                  className={cn(
                    "rounded-md border px-2 py-1 text-[11px] font-medium uppercase tracking-wider transition-colors",
                    d.lang === lang
                      ? "border-violet bg-violet-soft text-violet"
                      : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={d.code}
            onChange={(e) => field({ code: e.target.value })}
            placeholder="Code…"
            autoFocus
            rows={6}
            spellCheck={false}
            className="w-full resize-y rounded-lg border border-border bg-secondary p-3 font-mono text-[13px] leading-relaxed outline-none focus:border-violet"
          />
        </div>
      )}

      {draft.type === "mermaid" && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {[
              ["graph TD\n    A[Start] --> B{Decision}\n    B -->|Yes| C[OK]\n    B -->|No| D[End]", "Graph"],
              ["sequenceDiagram\n    Alice->>+Bob: Hello\n    Bob-->>-Alice: Hi!", "Sequence"],
              ["classDiagram\n    Animal <|-- Duck\n    class Animal{\n      +int age\n      +mate()\n    }", "Class"],
              ["stateDiagram-v2\n    [*] --> Still\n    Still --> [*]", "State"],
              ["pie title Pets\n    \"Dogs\" : 386\n    \"Cats\" : 85", "Pie"],
            ].map(([tpl, label]) => (
              <button
                key={label}
                onClick={() => field({ code: tpl })}
                className="rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {label}
              </button>
            ))}
          </div>
          <textarea
            value={d.code}
            onChange={(e) => field({ code: e.target.value })}
            placeholder="Mermaid graph definition…"
            autoFocus
            rows={6}
            spellCheck={false}
            className="w-full resize-y rounded-lg border border-border bg-secondary p-3 font-mono text-[13px] leading-relaxed outline-none focus:border-violet"
          />
        </div>
      )}

      {draft.type === "table" && (
        <div className="overflow-x-auto rounded-xl border border-border bg-card/50">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-muted/60">
              <tr>
                {d.headers.map((h: string, j: number) => (
                  <th key={j} className="border-b border-border p-0">
                    <input
                      className="w-full bg-transparent px-4 py-2.5 font-semibold outline-none focus:bg-accent/20"
                      value={h}
                      onChange={(e) => {
                        const next = [...d.headers];
                        next[j] = e.target.value;
                        field({ headers: next });
                      }}
                      placeholder={`Header ${j + 1}`}
                    />
                  </th>
                ))}
                <th className="w-8 border-b border-border p-1 text-center">
                  <button
                    onClick={() => {
                      field({
                        headers: [...d.headers, `Col ${d.headers.length + 1}`],
                        rows: d.rows.map((r: string[]) => [...r, ""])
                      });
                    }}
                    className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground"
                    title="Add column"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {d.rows.map((row: string[], i: number) => (
                <tr key={i}>
                  {row.map((cell: string, j: number) => (
                    <td key={j} className="border-b border-border/60 p-0">
                      <input
                        className="w-full bg-transparent px-4 py-2.5 text-foreground/80 outline-none focus:bg-accent/20"
                        value={cell}
                        onChange={(e) => {
                          const next = [...d.rows];
                          next[i] = [...next[i]];
                          next[i][j] = e.target.value;
                          field({ rows: next });
                        }}
                        placeholder="..."
                      />
                    </td>
                  ))}
                  <td className="border-b border-border/60 p-1 text-center">
                    <button
                      onClick={() => {
                        const next = [...d.rows];
                        next.splice(i, 1);
                        field({ rows: next });
                      }}
                      className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      title="Remove row"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={d.headers.length + 1} className="p-1">
                  <button
                    onClick={() => {
                      field({ rows: [...d.rows, new Array(d.headers.length).fill("")] });
                    }}
                    className="flex w-full items-center justify-center gap-1.5 rounded py-2 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    <Plus className="size-3.5" /> Add Row
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {draft.type === "ai-answer" && (
        <>
          <Input
            value={d.question}
            onChange={(e) => field({ question: e.target.value })}
            placeholder="Question / prompt"
            autoFocus
          />
          <textarea
            value={d.answer}
            onChange={(e) => field({ answer: e.target.value })}
            placeholder="Answer (markdown)"
            rows={5}
            className="w-full resize-y rounded-lg border border-border bg-input-background p-3 text-sm leading-relaxed outline-none focus:border-violet"
          />
        </>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" onClick={() => onSave(draft)}>
          <Check className="mr-1.5 size-3.5" /> Save
        </Button>
      </div>
    </div>
  );
}

function BlockInner({ block }: { block: NotebookBlock }) {
  switch (block.type) {
    case "heading":
      return block.level === 1 ? (
        <h1 className="mt-4 text-3xl">{block.text}</h1>
      ) : (
        <h2 className="mt-4">{block.text}</h2>
      );
    case "text":
      return (
        <>
          {block.source && (
            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
              <BookPlus className="size-3" /> Source: {artifactLabel(block.source.type)}
            </span>
          )}
          <MarkdownRenderer content={block.text} />
        </>
      );
    case "callout": {
      const m = calloutMeta[block.tone];
      return (
        <div className={cn("flex gap-3 rounded-xl border p-4", m.cls)}>
          <m.icon className={cn("mt-0.5 size-5 shrink-0", m.iconCls)} />
          <div className="font-reading leading-relaxed">{block.text}</div>
        </div>
      );
    }
    case "code":
      return (
        <pre className="overflow-x-auto rounded-lg border border-border bg-secondary p-4">
          <code className="font-mono text-[13px] leading-relaxed text-foreground/90">
            {block.code}
          </code>
        </pre>
      );
    case "table":
      return (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-muted/60">
              <tr>
                {block.headers.map((h) => (
                  <th
                    key={h}
                    className="border-b border-border px-4 py-2.5 text-left font-semibold"
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
                      className="border-b border-border/60 px-4 py-2.5 text-foreground/80"
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
          <div className="flex items-center justify-between border-b border-violet/15 px-4 py-2.5">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet">
              <Sparkles className="size-3.5" /> Saved AI Answer
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Gauge className="size-3" /> {(block.confidence * 100).toFixed(0)}
              % · {block.sources} sources
            </span>
          </div>
          <div className="px-4 pb-3 pt-3">
            <div className="mb-2 font-reading text-base font-medium italic text-foreground">
              {block.question}
            </div>
            <MarkdownRenderer content={block.answer} />
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
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-medium">
              <Layers className="size-4 text-violet" /> {block.name}
            </span>
            <Badge variant="outline" className="text-xs text-muted-foreground">
              {block.count} cards
            </Badge>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {block.cards.map((c, i) => (
              <div
                key={i}
                className="rounded-lg border border-border bg-background/50 p-3"
              >
                <div className="font-reading text-sm leading-snug">
                  {c.front}
                </div>
                <div className="mt-2 border-t border-border pt-2 text-xs text-muted-foreground">
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
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
          <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-xl bg-success-soft text-success">
            <span className="font-display text-xl leading-none">{pct}%</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ListChecks className="size-4 text-success" /> {block.title}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Scored {block.score} of {block.total} · embedded quiz result
            </div>
          </div>
          <Check className="size-5 text-success" />
        </div>
      );
    }
    default:
      return null;
  }
}

function Section({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: typeof Hash;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-border px-2 py-3">
      <div className="flex items-center gap-1.5 px-2.5 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="size-3" /> {label}
      </div>
      {children}
    </div>
  );
}

function InspectorBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </div>
      {children}
    </div>
  );
}

function MetaRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between py-0.5 text-sm">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2.5">
      <div className="font-display text-2xl leading-none">{value}</div>
      <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
