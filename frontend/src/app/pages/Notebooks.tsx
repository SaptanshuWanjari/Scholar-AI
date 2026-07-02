import { useNavigate } from "react-router";
import { useMemo, useCallback, useEffect, useRef, useState } from "react";
import {
  PanelLeftOpen,
  PanelRightOpen,
  Plus,
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
  StickyNote,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "@/app/lib/toast";
import { PaperDropdown, type DropdownItem } from "@/paper-ui/components/dialogs";
import { PaperButton, IconButton } from "@/paper-ui/components/buttons";
import { PaperH1 } from "@/paper-ui/core";
import { LoadingPaper } from "@/paper-ui/components/feedback";
import { IllustratedEmptyState } from "@/paper-ui/components/feedback";
import { SelectionToolbar } from "../components/SelectionToolbar";
import { type NotebookBlock } from "../lib/notebook-data";
import { api, type NotebookMeta, type NotebookFull } from "../lib/api";
import { useAutoSave } from "../hooks/useAutoSave";
import { Virtuoso, type VirtuosoHandle } from "react-virtuoso";

import { Sidebar } from "../components/notebooks/Sidebar";
import { InspectorPanel } from "../components/notebooks/InspectorPanel";
import { BlockView } from "../components/notebooks/BlockView";
import { CreateNotebookDialog } from "../components/notebooks/CreateNotebookDialog";
import { parseNotes, getBlockText, getBlockSource } from "../components/notebooks/utils";

import { Code } from "lucide-react";
export function Notebooks() {
  const [list, setList] = useState<NotebookMeta[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [active, setActive] = useState<NotebookFull | null>(null);
  const [blocks, setBlocks] = useState<NotebookBlock[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingNotebook, setLoadingNotebook] = useState(false);
  const [assisting, setAssisting] = useState(false);
  const navigate = useNavigate();

  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(true);
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

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const max = 1920;
        if (width > max || height > max) {
          const ratio = Math.min(max / width, max / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/webp", 0.8);
        addBlock({
          type: "image",
          url: dataUrl,
          width,
          height,
          alt: file.name,
        });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
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

  async function moveBlockToNotebook(blockIndex: number, targetNotebookId: string) {
    if (!activeId) return;
    const block = blocks[blockIndex];
    if (!block) return;
    try {
      const targetNb = await api.getNotebook(targetNotebookId);
      const targetBlocks = (targetNb.blocks ?? []) as NotebookBlock[];
      targetBlocks.push(block);
      await api.updateNotebook(targetNotebookId, { blocks: targetBlocks });
      deleteBlock(blockIndex);
      toast.success("Block moved to notebook");
    } catch (e: any) {
      toast.error(`Failed to move block: ${e.message}`);
    }
  }

  function ungroupNote(blockIndex: number, noteIndex: number) {
    const block = blocks[blockIndex];
    if (!block) return;
    const notes = parseNotes(getBlockText(block));
    if (notes.length <= 1) return;

    const ungroupedNote = notes[noteIndex];
    const remainingNotes = notes.filter((_, idx) => idx !== noteIndex);

    const formatNote = (n: (typeof notes)[0]) => {
      const clean = n.raw
        .replace(/(?:^|\n)[ \t]*>[ \t]*/g, "\n")
        .replace(/^\n/, "");
      return clean
        .split("\n")
        .map((line) => `> ${line}`)
        .join("\n");
    };

    const next = [...blocks];
    next[blockIndex] = {
      ...block,
      text: remainingNotes.map(formatNote).join("\n\n"),
    } as NotebookBlock;

    const newBlock: NotebookBlock = {
      ...block,
      text: formatNote(ungroupedNote),
    } as NotebookBlock;
    persistBlocks(next);
  }

  function deleteNoteFromGroup(blockIndex: number, noteIndex: number) {
    const block = blocks[blockIndex];
    if (!block) return;
    const notes = parseNotes(getBlockText(block));
    if (notes.length <= 1) {
      deleteBlock(blockIndex);
      return;
    }

    const remainingNotes = notes.filter((_, idx) => idx !== noteIndex);
    const formatNote = (n: (typeof notes)[0]) => {
      const clean = n.raw
        .replace(/(?:^|\n)[ \t]*>[ \t]*/g, "\n")
        .replace(/^\n/, "");
      return clean
        .split("\n")
        .map((line) => `> ${line}`)
        .join("\n");
    };

    const next = [...blocks];
    next[blockIndex] = {
      ...block,
      text: remainingNotes.map(formatNote).join("\n\n"),
    } as NotebookBlock;
    persistBlocks(next);
  }

  function updateNoteInGroup(
    blockIndex: number,
    noteIndex: number,
    newRaw: string,
  ) {
    const block = blocks[blockIndex];
    if (!block) return;
    const notes = parseNotes(getBlockText(block));
    if (!notes[noteIndex]) return;

    notes[noteIndex].raw = newRaw;

    const formatNote = (n: (typeof notes)[0]) => {
      const clean = n.raw
        .replace(/(?:^|\n)[ \t]*>[ \t]*/g, "\n")
        .replace(/^\n/, "");
      return clean
        .split("\n")
        .map((line) => `> ${line}`)
        .join("\n");
    };

    const next = [...blocks];
    next[blockIndex] = {
      ...block,
      text: notes.map(formatNote).join("\n\n"),
    } as NotebookBlock;
    persistBlocks(next);
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

  const addBlockItems: DropdownItem[] = [
    {
      key: "note",
      label: "Sticky Note",
      icon: <StickyNote className="size-4" />,
      onClick: () =>
        addBlock({
          type: "text",
          text: "[ General] New note...",
          source: { type: "reading", id: "new" },
        }),
    },
    {
      key: "text",
      label: "Text",
      icon: <FileText className="size-4" />,
      onClick: () =>
        addBlock({
          type: "text",
          text: "New text block. Edit me!",
        }),
    },
    {
      key: "heading",
      label: "Heading",
      icon: <Hash className="size-4" />,
      onClick: () =>
        addBlock({
          type: "heading",
          level: 2,
          text: "New Heading",
        }),
    },
    {
      key: "callout",
      label: "Callout",
      icon: <Info className="size-4" />,
      onClick: () =>
        addBlock({
          type: "callout",
          tone: "note",
          text: "New note callout.",
        }),
    },
    {
      key: "code",
      label: "Code",
      icon: <Code className="size-4" />,
      onClick: () =>
        addBlock({
          type: "code",
          lang: "python",
          code: "print('Hello world')",
        }),
    },
    {
      key: "diagram",
      label: "Diagram",
      icon: <Workflow className="size-4" />,
      onClick: () =>
        addBlock({
          type: "mermaid",
          code: "graph TD\n  A[Start] --> B[End]",
        }),
    },
    {
      key: "table",
      label: "Table",
      icon: <Layers className="size-4" />,
      onClick: () =>
        addBlock({
          type: "table",
          headers: ["Column A", "Column B"],
          rows: [["", ""]],
        }),
    },
    {
      key: "image",
      label: "Image",
      icon: <ImageIcon className="size-4" />,
      onClick: () => fileInputRef.current?.click(),
    },
  ];

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

        <div className="pointer-events-none sticky left-0 top-4 z-10 flex h-0 w-full justify-between px-4">
          <div className="pointer-events-auto">
            {leftCollapsed && (
              <IconButton
                label="Show sidebar"
                onClick={() => setLeftCollapsed(false)}
              >
                <PanelLeftOpen className="size-4" />
              </IconButton>
            )}
          </div>
          <div className="pointer-events-auto">
            {rightCollapsed && (
              <IconButton
                label="Show inspector"
                onClick={() => setRightCollapsed(false)}
              >
                <PanelRightOpen className="size-4" />
              </IconButton>
            )}
          </div>
        </div>

        <div
          ref={contentRef}
          className="mx-auto max-w-[1350px] px-6 md:px-10 py-12"
        >
          {loadingNotebook ? (
            <div className="flex items-center justify-center py-20">
              <LoadingPaper variant="lines" size="lg" label="Opening notebook…" />
            </div>
          ) : !active ? (
            list.length === 0 ? (
              <IllustratedEmptyState
                illustration="notebook"
                title="No notebooks found"
                description="Create a notebook. Use Teach Me to generate structured notes first."
                action={
                  <PaperButton tone="dark" onClick={() => navigate("/teach")}>
                    <Sparkles className="mr-2 size-4" /> Go to Teach Me
                  </PaperButton>
                }
              />
            ) : (
              <IllustratedEmptyState
                illustration="notebook"
                title="No notebook selected"
                description="Pick a notebook from the sidebar or create a new one."
                action={
                  <PaperButton tone="dark" onClick={() => setCreateOpen(true)}>
                    <Plus className="mr-2 size-4" /> New notebook
                  </PaperButton>
                }
              />
            )
          ) : (
            <>
              <div className="flex items-center gap-2 font-architect text-xs uppercase tracking-[0.12em] text-ink-muted">
                <span>
                  {activeMeta?.name ?? active.title} · {active.updated}
                </span>
                {saving && <Loader2 className="size-3 animate-spin" />}
              </div>
              <PaperH1 marker markerColor="#f6e27a">{active.title}</PaperH1>

              {active.subtitle && (
                <p className="mt-3 font-caveat text-[22px] italic text-ink-muted leading-snug">
                  {active.subtitle}
                </p>
              )}

              <div className="mt-8 space-y-6">
                {showDraftBanner && (
                  <div className="mb-3 flex items-center justify-between rounded-md border border-amber-200 bg-amber-50 px-3 py-2 font-kalam text-sm text-amber-800">
                    <span>
                      Auto-saved changes from your last session have been
                      restored.
                    </span>
                    <button
                      className="ml-4 font-architect text-xs font-medium underline hover:no-underline"
                      onClick={dismissDraftBanner}
                    >
                      Got it
                    </button>
                  </div>
                )}

                {blocks.length === 0 && (
                  <div className="rounded-xl border border-dashed border-ink-muted/30 px-6 py-10 text-center font-kalam text-sm text-ink-muted">
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
                          onMerge={(() => {
                            if (getBlockSource(block)?.type !== "reading")
                              return undefined;
                            for (let j = i - 1; j >= 0; j--) {
                              if (
                                getBlockSource(blocks[j])?.type === "reading" &&
                                parseNotes(getBlockText(blocks[j])).length +
                                parseNotes(getBlockText(block)).length <=
                                4
                              ) {
                                return () => mergeBlock(i, j);
                              }
                            }
                            return undefined;
                          })()}
                          onUngroup={(noteIndex) => ungroupNote(i, noteIndex)}
                          onDeleteNote={(noteIndex) =>
                            deleteNoteFromGroup(i, noteIndex)
                          }
                          onUpdateNote={(noteIndex, newRaw) =>
                            updateNoteInGroup(i, noteIndex, newRaw)
                          }
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
                          availableNotebooks={list.filter(n => n.id !== activeId)}
                          onMoveToNotebook={(notebookId) => moveBlockToNotebook(i, notebookId)}
                        />
                      </div>
                    )}
                  />
                )}

                <PaperDropdown
                  trigger={
                    <button className="group flex w-full items-center gap-2.5 rounded-xl border border-dashed border-ink-muted/30 px-5 py-4 font-architect text-[16px] text-ink-muted transition-colors hover:border-violet/50 hover:text-violet">
                      <Plus className="size-5" /> Add block
                    </button>
                  }
                  items={addBlockItems}
                />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
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
