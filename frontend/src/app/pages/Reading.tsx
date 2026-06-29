import { useEffect, useRef, useState } from "react";
import {
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Bookmark,
  Highlighter,
  Wand2,
  GraduationCap,
  Sparkles,
  BookOpen,
  Clock,
  X,
  FileText,
  Loader2,
  ZoomIn,
  ZoomOut,
  BookMarked,
  PencilRuler,
  Search,
  LayoutPanelLeft,
  Columns,
  BookOpenText,
  Save,
  Trash2,
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { cn } from "../components/ui/utils";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { SelectionToolbar, type SelectionAction } from "../components/SelectionToolbar";
import { api, type ReadingDoc, type NotebookMeta } from "../lib/api";
import type { DocumentItem } from "../lib/types";
import { StickyNote as StickyNoteIcon, PenLine, PuzzleIcon } from "lucide-react";
import PDFViewer, { type HighlightItem, type HighlightRect, type PDFViewerRef } from "../components/PDFViewer";
import { ReadingWorkspace, type SubMode } from "../components/reading/ReadingWorkspace";
import { usePluginStore } from "../plugins/usePluginStore";
import { useReadingNotesStore } from "../stores/useReadingNotesStore";
import type { NoteRect } from "../lib/types";
import { snapshotRegion, buildSnapshotScene, unionRects } from "../lib/pdf-snapshot";

import { PencilLine } from "lucide-react";
type Lens = "Beginner" | "Intermediate" | "Expert";

export function Reading() {
  const readerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pendingHighlightRef = useRef<{ page: number; rects: HighlightRect[] }>({ page: 1, rects: [] });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [docsLoading, setDocsLoading] = useState(true);
  const [docId, setDocId] = useState<string | null>(null);

  const [doc, setDoc] = useState<ReadingDoc | null>(null);
  const [docLoading, setDocLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(true);

  const pdfRef = useRef<PDFViewerRef>(null);
  const isScrollingRef = useRef(false);
  const lastViewedPageRef = useRef(1);

  // Plugin gating: the workspace pane belongs to the "reading-annotations"
  // plugin; freehand drawing additionally needs the "excalidraw" plugin.
  const readingAnnotEnabled = usePluginStore((s) => s.isEnabled("reading-annotations"));
  const excalidrawEnabled = usePluginStore((s) => s.isEnabled("excalidraw"));

  // Sticky notes are shared between this page and the PDF margin badges.
  const notes = useReadingNotesStore((s) => s.notes);
  const setNotes = useReadingNotesStore((s) => s.setNotes);
  const addNoteToStore = useReadingNotesStore((s) => s.addNote);
  const clearNotes = useReadingNotesStore((s) => s.clear);

  const [viewMode, setViewMode] = useState<"pdf" | "text" | "split" | "compare">("split");
  const [compareDocId, setCompareDocId] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Global Ctrl+F binding
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        e.stopPropagation();
        setLeftCollapsed(false);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
    };
    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => window.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, []);
  const [compareDoc, setCompareDoc] = useState<ReadingDoc | null>(null);

  const [lens, setLens] = useState<Lens>("Intermediate");
  const [selected, setSelected] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [lensLoading, setLensLoading] = useState(false);
  const [notebooks, setNotebooks] = useState<NotebookMeta[]>([]);
  const [savingToNotebook, setSavingToNotebook] = useState(false);
  const [annotSubMode, setAnnotSubMode] = useState<SubMode>("notes");

  // ---- Load the document list ----
  useEffect(() => {
    let cancelled = false;
    setDocsLoading(true);
    api
      .listDocuments()
      .then((items) => {
        if (cancelled) return;
        setDocuments(items);
        if (items.length > 0) setDocId((cur) => cur ?? items[0].id);
      })
      .catch((e) => toast.error(e instanceof Error ? e.message : "Failed to load documents"))
      .finally(() => !cancelled && setDocsLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  // ---- Load Notebooks ----
  useEffect(() => {
    let cancelled = false;
    api.listNotebooks().then(nbs => {
      if (!cancelled) setNotebooks(nbs);
    }).catch(() => { });
    return () => { cancelled = true; };
  }, []);

  // ---- Load the selected reading document ----
  useEffect(() => {
    if (!docId) {
      setDoc(null);
      return;
    }
    let cancelled = false;
    setDocLoading(true);
    setSelected(null);
    setExplanation(null);
    setCurrentPage(1);
    lastViewedPageRef.current = 1;
    api
      .getReading(docId)
      .then((d) => {
        if (cancelled) return;
        setDoc(d);
      })
      .catch((e) => toast.error(e instanceof Error ? e.message : "Failed to load reading"))
      .finally(() => !cancelled && setDocLoading(false));
    return () => {
      cancelled = true;
    };
  }, [docId]);


  // ---- Compare doc loading ----
  useEffect(() => {
    if (viewMode !== "compare" || !compareDocId) return;
    let cancelled = false;
    api.getReading(compareDocId)
      .then(d => { if (!cancelled) setCompareDoc(d); })
      .catch(() => { });
    return () => { cancelled = true; };
  }, [viewMode, compareDocId]);

  // ---- Load sticky notes for the document into the shared store ----
  useEffect(() => {
    if (!docId || !readingAnnotEnabled) {
      clearNotes();
      return;
    }
    let cancelled = false;
    api
      .getNotes(docId)
      .then((ns) => {
        if (!cancelled) setNotes(docId, ns);
      })
      .catch(() => { });
    return () => {
      cancelled = true;
    };
  }, [docId, readingAnnotEnabled, setNotes, clearNotes]);

  // ---- Handle page query parameter (from notebook anchor links) ----
  useEffect(() => {
    const pageParam = searchParams.get("page");
    if (pageParam && doc && pdfRef.current) {
      const targetPage = parseInt(pageParam, 10);
      if (!isNaN(targetPage) && targetPage >= 1 && targetPage <= doc.pages) {
        setTimeout(() => pdfRef.current?.scrollToPage(targetPage), 300);
      }
    }
  }, [doc, searchParams]);

  const handlePdfPageVisible = (page: number) => {
    lastViewedPageRef.current = page;
    setCurrentPage(page);
  };

  // ---- Lens: fetch an adaptive explanation for some text ----
  const runLens = async (text: string, level: Lens) => {
    if (!docId || !text) return;
    setSelected(text);
    setLensLoading(true);
    setExplanation(null);
    try {
      const res = await api.readingLens(docId, text, level);
      setExplanation(res.text);
      // Auto-save AI response as an annotation (margin note)
      const { page, rects } = pendingHighlightRef.current;
      const updated = await api.addHighlight(docId, text, page, rects, res.text);
      setDoc(updated);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to fetch explanation");
    } finally {
      setLensLoading(false);
    }
  };

  const handleSaveToNotebook = async (notebookId: string) => {
    if (!explanation || !docId) return;
    setSavingToNotebook(true);
    try {
      // Create markdown block to save
      const textToSave = `> **Highlight**: ${selected}\n\n**Lens Explanation (${lens})**:\n${explanation}`;
      await api.appendToNotebook(notebookId, textToSave, "reading", docId);
      toast.success("Saved to notebook");
    } catch (e) {
      toast.error("Failed to save to notebook");
    } finally {
      setSavingToNotebook(false);
    }
  };

  // ---- PDF text selection: capture page + rects before toolbar fires ----
  const handlePDFTextSelect = (_text: string, page: number, rects: HighlightRect[]) => {
    pendingHighlightRef.current = { page, rects };
  };

  // ---- Selection toolbar actions ----
  const onExplain = (text: string) => {
    runLens(text, lens);
  };

  const onHighlight = async (text: string) => {
    if (!docId) return;
    const { page, rects } = pendingHighlightRef.current;
    try {
      const updated = await api.addHighlight(docId, text, page, rects);
      setDoc(updated);
      toast.success("Highlight saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to add highlight");
    }
  };

  const onBookmark = async (text: string) => {
    if (!docId) return;
    const { page, rects } = pendingHighlightRef.current;
    try {
      const updated = await api.addBookmark(docId, `Page ${page}`, text, rects);
      setDoc(updated);
      toast.success("Bookmark saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to add bookmark");
    }
  };

  const onWhiteboard = async (text: string) => {
    const courseName = documents.find((d) => d.id === docId)?.course ?? null;
    const title = text.length > 48 ? `${text.slice(0, 48)}…` : text;
    try {
      const wb = await api.createWhiteboard({
        title,
        course: courseName,
        source: "selection",
      });
      // Editor auto-generates a diagram from the selection via ?generate=.
      navigate(`/whiteboards/${wb.id}?generate=${encodeURIComponent(text)}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to open whiteboard");
    }
  };

  // ---- Add a region-anchored sticky note from the current selection ----
  const onAddNote = async (text: string) => {
    if (!docId) return;
    const { page, rects } = pendingHighlightRef.current;
    const bbox = unionRects(rects as NoteRect[]);
    try {
      const note = await api.createNote(docId, {
        content: text,
        category: "general",
        pageNumber: page,
        boundingBox: bbox,
      });
      addNoteToStore(note);
      toast.success("Note added — categorize it in the Workspace pane");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to add note");
    }
  };

  const onRemoveBookmark = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!docId) return;
    try {
      await api.removeBookmark(docId, id);
      setDoc(prev => prev ? { ...prev, bookmarks: prev.bookmarks.filter(b => b.id !== id) } : null);
      toast.success("Bookmark removed");
    } catch (e) {
      toast.error("Failed to remove bookmark");
    }
  };

  const onRemoveHighlight = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!docId) return;
    try {
      await api.removeHighlight(docId, id);
      setDoc(prev => prev ? { ...prev, highlights: (prev.highlights as any).filter((h: any) => h.id !== id) } : null);
      toast.success("Highlight removed");
    } catch (e) {
      toast.error("Failed to remove highlight");
    }
  };

  // ---- Open an Excalidraw board over a snapshot of the selected region ----
  const onAnnotateRegion = async (text: string) => {
    if (!docId) return;
    if (!excalidrawEnabled) {
      toast.error("Enable the Excalidraw plugin to annotate regions");
      return;
    }
    const { page, rects } = pendingHighlightRef.current;
    const bbox = unionRects(rects as NoteRect[]);
    if (!bbox) {
      toast.error("Select a region in the PDF first");
      return;
    }
    const snap = snapshotRegion(page, bbox);
    if (!snap) {
      toast.error("Could not capture the region — make sure the PDF page is visible");
      return;
    }
    try {
      const courseName = documents.find((d) => d.id === docId)?.course ?? null;
      const title = text.length > 40 ? `${text.slice(0, 40)}…` : text || "Annotation";
      const wb = await api.createWhiteboard({
        title,
        course: courseName,
        source: "annotation",
        documentId: Number(docId),
        pageNumber: page,
        scene: buildSnapshotScene(snap),
        thumbnail: snap.dataURL,
      });
      navigate(`/whiteboards/${wb.id}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to open annotation board");
    }
  };

  const actions: SelectionAction[] = [
    { label: "Explain", icon: Wand2, onSelect: onExplain },
    { label: "Highlight", icon: Highlighter, onSelect: onHighlight },
    { label: "Bookmark", icon: Bookmark, onSelect: onBookmark },
    { label: "Whiteboard", icon: PencilRuler, onSelect: onWhiteboard },
    ...(readingAnnotEnabled
      ? [
        { label: "Add Note", icon: StickyNoteIcon, onSelect: onAddNote },
        { label: "Annotate Region", icon: PenLine, onSelect: onAnnotateRegion },
      ]
      : []),
  ];

  // ---- When the user switches lens with active selection, re-fetch ----
  const pickLens = (l: Lens) => {
    setLens(l);
    if (selected) runLens(selected, l);
  };

  const allHighlights = (doc?.highlights ?? []) as HighlightItem[];
  const allBookmarks = doc?.bookmarks ?? [];
  const highlights = allHighlights.filter(h => h.text.toLowerCase().includes(searchQuery.toLowerCase()));
  const bookmarks = allBookmarks.filter(b => b.section.toLowerCase().includes(searchQuery.toLowerCase()) || b.note.toLowerCase().includes(searchQuery.toLowerCase()));
  const pages = doc?.pages ?? 0;
  const progress = pages > 0 ? Math.round((currentPage / pages) * 100) : 0;

  // ---- Empty state: no documents at all ----
  if (!docsLoading && documents.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
        <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground">
          <FileText className="size-6" />
        </div>
        <p className="text-sm font-medium">No documents to read yet</p>
        <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
          Upload and index a document first, then come back here to read it with AI-assisted
          highlights, bookmarks, and explanations.
        </p>
        <Button asChild variant="outline" className="mt-1">
          <Link to="/documents">Go to Documents</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Left — Content */}
        <aside className={cn(
          "hidden shrink-0 flex-col overflow-y-auto border-r border-border bg-card/40 transition-all duration-300 lg:flex",
          leftCollapsed ? "w-0 border-r-0" : "w-[260px]"
        )}>
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Content</span>
            <Button variant="ghost" size="icon" className="size-7" onClick={() => setLeftCollapsed(true)}>
              <PanelLeftClose className="size-4" />
            </Button>
          </div>

          {/* Document picker */}
          <div data-tour="reading-doc" className="border-b border-border p-3">
            <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <FileText className="size-3" /> Document
            </div>
            <Select value={docId ?? undefined} onValueChange={setDocId} disabled={docsLoading}>
              <SelectTrigger className="w-full bg-input-background" size="sm">
                <SelectValue placeholder={docsLoading ? "Loading…" : "Select a document"} />
              </SelectTrigger>
              <SelectContent>
                {documents.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Group label="Navigation" icon={BookMarked}>
            <div className="px-2.5 pt-1.5 pb-2">
              <div className="relative">
                <Search className="absolute left-2 top-1.5 size-3.5 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-7 w-full rounded-md border border-input bg-input-background pl-7 pr-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <div className="px-2.5 pb-2 text-sm text-muted-foreground">
              Page{" "}
              <span className="font-medium text-foreground">{doc ? currentPage : "—"}</span>
              {" "}of{" "}
              <span className="font-medium text-foreground">{pages || "—"}</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 pb-2">
              <Button
                variant="outline"
                size="icon"
                className="size-7"
                onClick={() => setScale((s) => Math.max(0.5, +(s - 0.25).toFixed(2)))}
              >
                <ZoomOut className="size-3.5" />
              </Button>
              <span className="flex-1 text-center text-xs text-muted-foreground">{Math.round(scale * 100)}%</span>
              <Button
                variant="outline"
                size="icon"
                className="size-7"
                onClick={() => setScale((s) => Math.min(3.0, +(s + 0.25).toFixed(2)))}
              >
                <ZoomIn className="size-3.5" />
              </Button>
            </div>
            {doc?.sections && doc.sections.length > 0 && (
              <div className="px-2 pb-2">
                <div className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                  Contents
                </div>
                <div className="flex flex-col gap-0.5">
                  {doc.sections
                    .filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((section) => (
                    <button
                      key={section.id}
                      onClick={() => {
                        const page = section.paragraphs?.[0]?.page;
                        if (page) pdfRef.current?.scrollToPage(page);
                      }}
                      className="text-left px-2 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground rounded transition-colors"
                    >
                      {section.number} {section.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Group>

          <Group label="Bookmarks" icon={Bookmark}>
            {bookmarks.length === 0 ? (
              <p className="px-2.5 py-1.5 text-[11px] text-muted-foreground">No bookmarks yet.</p>
            ) : (
              bookmarks.map((b) => (
                <div 
                  key={b.id} 
                  className="group relative cursor-pointer rounded-md px-2.5 py-1.5 hover:bg-accent/50 pr-8"
                  onClick={() => {
                    const pageMatch = b.section.match(/Page (\d+)/);
                    if (pageMatch) {
                      pdfRef.current?.scrollToPage(parseInt(pageMatch[1], 10));
                    }
                  }}
                >
                  <div className="text-sm text-foreground/80">{b.section}</div>
                  <div className="text-[11px] text-muted-foreground">{b.note}</div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-1 top-1.5 size-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => onRemoveBookmark(b.id, e)}
                  >
                    <Trash2 className="size-3.5 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              ))
            )}
          </Group>

          <Group label="Highlights" icon={Highlighter}>
            {highlights.length === 0 ? (
              <p className="px-2.5 py-1.5 text-[11px] text-muted-foreground">No highlights yet.</p>
            ) : (
              highlights.map((h) => (
                <div 
                  key={h.id} 
                  className="group relative cursor-pointer rounded-md px-2.5 py-1.5 hover:bg-accent/50 pr-8"
                  onClick={() => pdfRef.current?.scrollToPage(h.page_number)}
                >
                  <div className="study-mark inline font-reading text-[13px] leading-snug text-foreground/80">
                    {h.text}
                  </div>
                  <div className="mt-1 text-[11px] text-muted-foreground">Page {h.page_number}</div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-1 top-1.5 size-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => onRemoveHighlight(h.id, e)}
                  >
                    <Trash2 className="size-3.5 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              ))
            )}
          </Group>
        </aside>

        {/* Center — Reader + overlay wrapper */}
        <div className="relative min-w-0 flex-1">
          <main data-tour="reading-reader" className="h-full overflow-y-auto" ref={scrollRef}>
            <SelectionToolbar containerRef={readerRef} actions={actions} />

            {/* Sidebar Toggles & View Mode */}
            <div className="pointer-events-none sticky top-4 z-10 flex w-full justify-between px-4">
              <div className="pointer-events-auto">
                {leftCollapsed && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-8 rounded-full bg-card/80 shadow-sm backdrop-blur"
                    onClick={() => setLeftCollapsed(false)}
                  >
                    <PanelLeftOpen className="size-4" />
                  </Button>
                )}
              </div>

              <div className="pointer-events-auto flex items-center justify-center gap-2">
                <div className="flex bg-card/90 shadow-sm border border-border rounded-lg p-1 backdrop-blur">
                  <Button variant="ghost" size="sm" className={`h-7 px-2 text-xs ${viewMode === "pdf" ? "bg-accent" : ""}`} onClick={() => setViewMode("pdf")}><BookOpen className="size-3.5 mr-1" /> PDF</Button>
                  <Button variant="ghost" size="sm" className={`h-7 px-2 text-xs ${viewMode === "text" ? "bg-accent" : ""}`} onClick={() => setViewMode("text")}><PencilLine className="size-3.5 mr-1" /> Annotate</Button>
                  <Button variant="ghost" size="sm" className={`h-7 px-2 text-xs ${viewMode === "split" ? "bg-accent" : ""}`} onClick={() => setViewMode("split")}><Columns className="size-3.5 mr-1" /> Split</Button>
                  <Button variant="ghost" size="sm" className={`h-7 px-2 text-xs ${viewMode === "compare" ? "bg-accent" : ""}`} onClick={() => { setViewMode("compare"); if (!compareDocId && documents.length > 1) setCompareDocId(documents.find(d => d.id !== docId)?.id ?? null); }}><Columns className="size-3.5 mr-1" /> Compare</Button>
                </div>
                
                {(viewMode === "split" || viewMode === "text") && readingAnnotEnabled && (
                  <div className="flex bg-card/90 shadow-sm border border-border rounded-lg p-1 backdrop-blur">
                    {(
                      [
                        { v: "notes", label: "Notes", icon: StickyNoteIcon },
                        { v: "draw", label: "Draw", icon: PencilRuler },
                        { v: "both", label: "Both", icon: Columns },
                      ] as { v: SubMode; label: string; icon: typeof StickyNoteIcon }[]
                    ).map((t) => (
                      <Button
                        key={t.v}
                        variant="ghost"
                        size="sm"
                        className={`h-7 px-2 text-xs font-medium transition-colors ${
                          annotSubMode === t.v 
                            ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" 
                            : "text-muted-foreground hover:text-foreground hover:bg-transparent"
                        }`}
                        onClick={() => setAnnotSubMode(t.v)}
                      >
                        <t.icon className="size-3.5 mr-1" /> {t.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              <div className="pointer-events-auto">
                {rightCollapsed && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-8 rounded-full bg-card/80 shadow-sm backdrop-blur"
                    onClick={() => setRightCollapsed(false)}
                  >
                    <PanelRightOpen className="size-4" />
                  </Button>
                )}
              </div>
            </div>

            {docLoading ? (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <Loader2 className="size-5 animate-spin" />
              </div>
            ) : !doc ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Select a document to start reading.
              </div>
            ) : (
              <div ref={readerRef} className="flex h-full">
                {viewMode === "compare" ? (
                  <>
                    <div className="h-full overflow-y-auto w-[50%] border-r border-border flex flex-col">
                      <div className="px-6 py-6">
                        <PDFViewer
                          pdfUrl={`/api/documents/${docId}/raw`}
                          highlights={highlights}
                          bookmarks={bookmarks}
                          scale={scale}
                          onTextSelect={handlePDFTextSelect}
                        />
                      </div>
                    </div>
                    <div className="h-full overflow-y-auto w-[50%] flex flex-col relative">
                      <div className="absolute top-2 right-6 z-10 w-48">
                        <Select value={compareDocId ?? undefined} onValueChange={setCompareDocId}>
                          <SelectTrigger className="w-full bg-card shadow-sm text-xs h-8">
                            <SelectValue placeholder="Select document..." />
                          </SelectTrigger>
                          <SelectContent>
                            {documents.map((d) => (
                              <SelectItem key={d.id} value={d.id}>{d.title}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {compareDoc ? (
                        <div className="px-6 py-6 mt-8">
                          <PDFViewer
                            pdfUrl={`/api/documents/${compareDocId}/raw`}
                            highlights={(compareDoc.highlights ?? []) as HighlightItem[]}
                            scale={scale}
                            onTextSelect={() => { }}
                          />
                        </div>
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-muted-foreground mt-8">
                          Select a secondary document to compare.
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {(viewMode === "pdf" || viewMode === "split") && (
                      <div className={`h-full overflow-y-auto ${viewMode === "split" ? "w-[50%] border-r border-border" : "w-full"}`}>
                        <div className="px-6 py-6">
                          <PDFViewer
                            ref={pdfRef}
                            pdfUrl={`/api/documents/${docId}/raw`}
                            highlights={highlights}
                            bookmarks={bookmarks}
                            notes={readingAnnotEnabled ? notes : []}
                            onNoteClick={() => { if (viewMode === "pdf") setViewMode("split"); }}
                            scale={scale}
                            onTextSelect={handlePDFTextSelect}
                            onPageVisible={handlePdfPageVisible}
                            initialPage={lastViewedPageRef.current}
                          />
                        </div>
                      </div>
                    )}
                    {(viewMode === "text" || viewMode === "split") && (
                      <div className={`h-full ${viewMode === "split" ? "w-[50%]" : "w-full"} ${viewMode === "text" ? "pt-10" : ""}`}>
                        {readingAnnotEnabled ? (
                            <ReadingWorkspace
                              docId={docId!}
                              course={documents.find((d) => d.id === docId)?.course ?? null}
                              excalidrawEnabled={excalidrawEnabled}
                              notebooks={notebooks}
                              subMode={annotSubMode}
                              onScrollToRegion={(page, bbox) => pdfRef.current?.scrollToRegion(page, bbox)}
                            />
                        ) : (
                          <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
                            <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground">
                              <PuzzleIcon className="size-6" />
                            </div>
                            <p className="text-sm font-medium">Reading Annotations plugin not configured</p>
                            <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
                              Enable the{" "}
                              <span className="font-medium text-foreground">Reading Annotations</span>{" "}
                              plugin in Settings to use sticky notes and region annotations here.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </main>

          {/* Zoom pill — absolute on the non-scrolling wrapper, always visible */}
          {viewMode !== "text" && (
            <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1 rounded-full border border-border bg-card/90 px-2 py-1 shadow-md backdrop-blur">
              <Button
                variant="ghost"
                size="icon"
                className="size-7 rounded-full"
                onClick={() => setScale((s) => Math.max(0.25, +(s - 0.25).toFixed(2)))}
              >
                <ZoomOut className="size-3.5" />
              </Button>
              <span className="min-w-[3rem] text-center text-xs font-medium tabular-nums text-muted-foreground">
                {Math.round(scale * 100)}%
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="size-7 rounded-full"
                onClick={() => setScale((s) => Math.min(3.0, +(s + 0.25).toFixed(2)))}
              >
                <ZoomIn className="size-3.5" />
              </Button>
            </div>
          )}
        </div>{/* end center wrapper */}

        {/* Right — Context */}
        <aside className={cn(
          "hidden shrink-0 flex-col overflow-y-auto border-l border-border bg-card/40 transition-all duration-300 xl:flex",
          rightCollapsed ? "w-0 border-l-0" : "w-[320px]"
        )}>
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <Button variant="ghost" size="icon" className="size-7" onClick={() => setRightCollapsed(true)}>
              <PanelRightClose className="size-4" />
            </Button>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Context</span>
            {selected ? (
              <Button variant="ghost" size="icon" className="size-6" onClick={() => { setSelected(null); setExplanation(null); }}>
                <X className="size-3.5" />
              </Button>
            ) : (
              <div className="size-7" />
            )}
          </div>

          {/* Academic Lens */}
          <div data-tour="reading-lens" className="border-b border-border p-4">
            <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <GraduationCap className="size-3.5" /> Academic Lens
            </div>
            <div className="flex rounded-lg border border-border bg-card p-0.5">
              {(["Beginner", "Intermediate", "Expert"] as Lens[]).map((l) => (
                <button
                  key={l}
                  onClick={() => pickLens(l)}
                  className={cn(
                    "flex-1 rounded-md py-1.5 text-xs font-medium transition-colors",
                    lens === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div data-tour="reading-context" className="flex-1 space-y-5 p-4">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key="ctx"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-5"
                >
                  <Block title="Selected Text">
                    <div className="study-mark inline font-reading text-sm leading-relaxed text-foreground/90">
                      "{selected}"
                    </div>
                    <div className="mt-1.5 text-[11px] text-muted-foreground">
                      Page {pendingHighlightRef.current.page}
                    </div>
                  </Block>
                  <Block title={`AI Explanation · ${lens}`}>
                    <div className="rounded-lg border border-violet/25 bg-violet-soft/50 p-3">
                      <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-violet">
                        <Sparkles className="size-3.5" /> ScholarAI
                      </div>
                      {lensLoading ? (
                        <div className="flex items-center gap-2 py-1 text-sm text-muted-foreground">
                          <Loader2 className="size-3.5 animate-spin" /> Thinking…
                        </div>
                      ) : (
                        <p className="font-reading text-sm leading-relaxed text-foreground/90">
                          {explanation ?? "No explanation available."}
                        </p>
                      )}

                      {explanation && !lensLoading && (
                        <div className="mt-3 flex justify-end">
                          <Select onValueChange={handleSaveToNotebook} disabled={savingToNotebook}>
                            <SelectTrigger className="h-7 w-auto min-w-[140px] text-[11px] bg-background">
                              <Save className="size-3 mr-1" />
                              <SelectValue placeholder={savingToNotebook ? "Saving..." : "Save to Notebook"} />
                            </SelectTrigger>
                            <SelectContent>
                              {notebooks.map(nb => (
                                <SelectItem key={nb.id} value={nb.id} className="text-xs">{nb.name}</SelectItem>
                              ))}
                              {notebooks.length === 0 && (
                                <div className="p-2 text-xs text-muted-foreground text-center">No notebooks found</div>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </Block>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center pt-10 text-center"
                >
                  <div className="flex size-11 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground">
                    <BookOpen className="size-5" />
                  </div>
                  <p className="mt-3 text-sm font-medium">Highlight to learn</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Select any passage in the reader and choose "Explain" to get an AI explanation tuned to your chosen lens.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </aside>
      </div>

      {/* Bottom — Reading progress */}
      <div className="flex h-12 shrink-0 items-center gap-6 border-t border-border bg-card/60 px-6 text-xs text-muted-foreground backdrop-blur">
        <span className="flex items-center gap-1.5">
          <BookOpen className="size-3.5" /> Page {doc ? currentPage : 1} of {Math.max(1, pages)}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="size-3.5" /> ~{Math.max(1, pages - currentPage)} min left
        </span>
        <span className="flex items-center gap-1.5">
          <Highlighter className="size-3.5" /> {highlights.length} highlights
        </span>
        <span className="flex items-center gap-1.5">
          <Bookmark className="size-3.5" /> {bookmarks.length} bookmarks
        </span>
        <div className="ml-auto flex items-center gap-3">
          <span className="font-medium text-foreground">{progress}%</span>
          <div className="h-1.5 w-40 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-violet transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Group({ label, icon: Icon, children }: { label: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div className="border-b border-border p-2">
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="size-3" /> {label}
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
      {children}
    </div>
  );
}
