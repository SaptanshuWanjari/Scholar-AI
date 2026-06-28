import { useNavigate } from "react-router";
import { useMemo, useCallback, useEffect, useRef, useState } from "react";
import {
  PanelLeftOpen,
  PanelRightOpen,
  Plus,
  Search,
  Sparkles,
  ScrollText,
  Wand2,
  Quote,
  BookOpen,
  Loader2,
  FileText,
  Info,
  Hash,
  Layers,
  Workflow,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../components/ui/dropdown-menu";
import { cn } from "../components/ui/utils";
import { Button } from "../components/ui/button";
import { SelectionToolbar } from "../components/SelectionToolbar";
import { type NotebookBlock } from "../lib/notebook-data";
import { api, type NotebookMeta, type NotebookFull } from "../lib/api";
import { useAutoSave } from "../hooks/useAutoSave";
import { Virtuoso, type VirtuosoHandle } from "react-virtuoso";

import { Sidebar } from "../components/notebooks/Sidebar";
import { InspectorPanel } from "../components/notebooks/InspectorPanel";
import { BlockView } from "../components/notebooks/BlockView";
import { CreateNotebookDialog } from "../components/notebooks/CreateNotebookDialog";

import { Code } from "lucide-react";
export function Notebooks() {
  const [list, setList] = useState<NotebookMeta[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [active, setActive] = useState<NotebookFull | null>(null);
  const [blocks, setBlocks] = useState<NotebookBlock[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingNotebook, setLoadingNotebook] = useState(false);
  const [assisting, setAssisting] = useState(false);
  const navigate = useNavigate();

  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const [collections, setCollections] = useState<any[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const [courses, setCourses] = useState<any[]>([]);
  const [createOpen, setCreateOpen] = useState(false);

  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const [showDraftBanner, setShowDraftBanner] = useState(false);
  const [scrollParent, setScrollParent] = useState<HTMLElement | null>(null);

  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const [collapsed, setCollapsed] = useState<Set<number>>(new Set());
  const toggleCollapse = useCallback((i: number) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }, []);
  const jumpToBlock = useCallback((i: number) => {
    setCollapsed((prev) => {
      if (!prev.has(i)) return prev;
      const next = new Set(prev);
      next.delete(i);
      return next;
    });
    virtuosoRef.current?.scrollToIndex({
      index: i,
      align: "start",
      behavior: "smooth",
    });
  }, []);

  const saveFn = useCallback(
    async (next: NotebookBlock[]) => {
      if (!activeId) return;
      const updated = await api.updateNotebook(activeId, {
        blocks: next,
        is_draft: true,
      });
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

  const { schedule: autoSave, flush: flushSave, saving } = useAutoSave(saveFn);

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

  useEffect(() => {
    if (!activeId) {
      setActive(null);
      setBlocks([]);
      return;
    }
    let cancelled = false;
    setLoadingNotebook(true);
    setCollapsed(new Set());
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

  useEffect(() => {
    window.addEventListener("beforeunload", flushSave);
    return () => window.removeEventListener("beforeunload", flushSave);
  }, [flushSave]);

  async function dismissDraftBanner() {
    flushSave();
    setShowDraftBanner(false);
    if (activeId) {
      await api.updateNotebook(activeId, { is_draft: false }).catch(() => { });
    }
  }

  function persistBlocks(next: NotebookBlock[]) {
    if (!activeId) return;
    setBlocks(next);
    autoSave(next);
  }

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
                originalIndex: res.existing_block_index,
              },
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
    const newText =
      (block as any).text || (block as any).answer || (block as any).code;
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
    const newText =
      (patch as any).text || (patch as any).answer || (patch as any).code;
    if (
      newText &&
      !(
        "text" in patch === false &&
        "answer" in patch === false &&
        "code" in patch === false &&
        Object.keys(patch).length === 1 &&
        "_flagged" in patch
      )
    ) {
      checkDeduplication(newText, index);
    }
  }

  function mergeBlock(index: number, targetIndex: number) {
    const sourceBlock = blocks[index] as any;
    const targetBlock = blocks[targetIndex] as any;
    if (!sourceBlock || !targetBlock) return;

    const sourceText =
      sourceBlock.text || sourceBlock.answer || sourceBlock.code || "";
    const targetText =
      targetBlock.text || targetBlock.answer || targetBlock.code || "";

    const next = [...blocks];
    if (
      targetBlock.type === "text" ||
      targetBlock.type === "callout" ||
      targetBlock.type === "heading"
    ) {
      next[targetIndex] = {
        ...targetBlock,
        text: targetText + "\n\n" + sourceText,
      };
    } else if (targetBlock.type === "ai-answer") {
      next[targetIndex] = {
        ...targetBlock,
        answer: targetText + "\n\n" + sourceText,
      };
    } else if (targetBlock.type === "code" || targetBlock.type === "mermaid") {
      next[targetIndex] = {
        ...targetBlock,
        code: targetText + "\n\n" + sourceText,
      };
    }
    next.splice(index, 1);
    persistBlocks(next);
  }

  function deleteBlock(index: number) {
    if (editingIndex === index) setEditingIndex(null);
    persistBlocks(blocks.filter((_, i) => i !== index));
  }

  function moveBlock(from: number, to: number) {
    if (from === to) return;
    const next = [...blocks];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    persistBlocks(next);
  }

  function handleCreated(meta: NotebookMeta) {
    setList((prev) => [meta, ...prev]);
    setActiveId(meta.id);
    loadSidebar();
  }

  async function saveRename(id: string) {
    const name = renameValue.trim();
    if (!name) return;
    try {
      const updated = await api.updateNotebook(id, { title: name });
      setList((prev) =>
        prev.map((n) => (n.id === id ? { ...n, name: updated.title } : n)),
      );
      if (activeId === id)
        setActive((a) => (a ? { ...a, title: updated.title } : a));
      setRenamingId(null);
      loadSidebar();
    } catch (e: any) {
      toast.error(`Failed to rename: ${e.message}`);
    }
  }

  async function deleteNotebookFromSidebar(id: string) {
    try {
      await api.deleteNotebook(id);
      setList((prev) => prev.filter((n) => n.id !== id));
      if (activeId === id) {
        setActiveId(null);
        setActive(null);
      }
      loadSidebar();
      toast.success("Notebook deleted");
    } catch (e: any) {
      toast.error(`Failed to delete: ${e.message}`);
    }
  }

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
      <Sidebar
        list={list}
        loadingList={loadingList}
        activeId={activeId}
        collapsed={leftCollapsed}
        renamingId={renamingId}
        renameValue={renameValue}
        collections={collections}
        tags={tags}
        recentNotes={recentNotes}
        onSelectNotebook={setActiveId}
        onStartRename={(id, name) => {
          setRenameValue(name);
          setRenamingId(id);
        }}
        onRenameValueChange={setRenameValue}
        onSaveRename={saveRename}
        onCancelRename={() => setRenamingId(null)}
        onDeleteNotebook={deleteNotebookFromSidebar}
        onCreateNotebook={() => setCreateOpen(true)}
        onToggleCollapse={() => setLeftCollapsed(true)}
      />

      <main
        ref={setScrollParent}
        className="relative min-w-0 flex-1 overflow-y-auto"
      >
        <SelectionToolbar containerRef={contentRef} actions={actions} />

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

        <div
          ref={contentRef}
          className="mx-auto max-w-[1350px] px-6 md:px-10 py-12"
        >
          {loadingNotebook ? (
            <div className="flex items-center gap-2 py-20 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Loading notebook…
            </div>
          ) : !active ? (
            <div className="flex flex-col items-center gap-4 py-24 text-center text-muted-foreground">
              <BookOpen className="size-10 opacity-40" />
              <div>
                <div className="text-base font-medium text-foreground">
                  {list.length === 0 ? "No notebooks found" : "No notebook selected"}
                </div>
                <p className="mt-1 max-w-sm text-sm">
                  {list.length === 0 
                    ? "Create a notebook. Use Teach Me to generate structured notes first." 
                    : "Pick a notebook from the sidebar or create a new one."}
                </p>
              </div>
              {list.length === 0 ? (
                <Button onClick={() => navigate("/teach")}>
                  <Sparkles className="mr-2 size-4" /> Go to Teach Me
                </Button>
              ) : (
                <Button onClick={() => setCreateOpen(true)}>
                  <Plus className="mr-2 size-4" /> New notebook
                </Button>
              )}
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

              <div className="mt-8 space-y-6">
                {showDraftBanner && (
                  <div className="mb-3 flex items-center justify-between rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
                    <span>
                      Auto-saved changes from your last session have been
                      restored.
                    </span>
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
                    ref={virtuosoRef}
                    useWindowScroll
                    customScrollParent={scrollParent}
                    data={blocks}
                    itemContent={(i, block) => (
                      <div className="pb-6">
                        <BlockView
                          block={block}
                          index={i}
                          collapsed={collapsed.has(i)}
                          onToggleCollapse={() => toggleCollapse(i)}
                          editing={editingIndex === i}
                          dragging={dragIndex === i}
                          dropTarget={
                            overIndex === i &&
                            dragIndex !== null &&
                            dragIndex !== i
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
                          onDragEnter={() =>
                            dragIndex !== null && setOverIndex(i)
                          }
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
                    <button className="group flex w-full items-center gap-2.5 rounded-xl border border-dashed border-border px-5 py-4 text-base text-muted-foreground transition-colors hover:border-violet/50 hover:text-violet">
                      <Plus className="size-5" /> Add block
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
                      <Code className="mr-2 text-muted-foreground" />
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

      <InspectorPanel
        inspector={dynamicInspector}
        blocks={blocks}
        collapsedBlocks={collapsed}
        panelCollapsed={rightCollapsed}
        onJumpToBlock={jumpToBlock}
        onToggleCollapse={() => setRightCollapsed(true)}
      />

      <CreateNotebookDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        courses={courses}
        onCreated={handleCreated}
      />
    </div>
  );
}
