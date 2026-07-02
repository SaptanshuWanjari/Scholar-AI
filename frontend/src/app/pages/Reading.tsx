import { useEffect, useRef, useState } from "react";
import {
  PanelLeftClose, PanelLeftOpen,
  PanelRightClose, PanelRightOpen,
  Bookmark, Highlighter, Wand2, GraduationCap, Sparkles,
  BookOpen, Clock, X, FileText, Loader2,
  ZoomIn, ZoomOut, BookMarked, PencilRuler,
  Columns, StickyNote as StickyNoteIcon, PenLine, PuzzleIcon, LayoutPanelLeft, PencilLine, Trash2, BookPlus,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "@/app/lib/toast";
import { cn } from "@/paper-ui/utils";
import { AppShell, ScrollArea } from "@/paper-ui/components/layout";
import { PaperButton, ChipButton, IconButton } from "@/paper-ui/components/buttons";
import { PaperSelect, SketchSearch } from "@/paper-ui/components/inputs";
import { SectionLabel, MarkerHighlight, SketchBorder, PaperCard } from "@/paper-ui/core";
import { SketchDivider } from "@/paper-ui/components/decorations";
import { ReadingProgress } from "@/paper-ui/components/pdf";
import { SelectionToolbar, type SelectionAction } from "../components/SelectionToolbar";
import { api, type ReadingDoc, type NotebookMeta } from "../lib/api";
import type { DocumentItem } from "../lib/types";
import PDFViewer, { type HighlightItem, type HighlightRect, type PDFViewerRef } from "../components/PDFViewer";
import { ReadingWorkspace, type SubMode } from "../components/reading/ReadingWorkspace";
import { usePluginStore } from "../plugins/usePluginStore";
import { useReadingNotesStore } from "../stores/useReadingNotesStore";
import type { NoteRect } from "../lib/types";
import { snapshotRegion, buildSnapshotScene, unionRects } from "../lib/pdf-snapshot";

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

  const readingAnnotEnabled = usePluginStore((s) => s.isEnabled("reading-annotations"));
  const excalidrawEnabled = usePluginStore((s) => s.isEnabled("excalidraw"));

  const notes = useReadingNotesStore((s) => s.notes);
  const setNotes = useReadingNotesStore((s) => s.setNotes);
  const addNoteToStore = useReadingNotesStore((s) => s.addNote);
  const clearNotes = useReadingNotesStore((s) => s.clear);

  const [viewMode, setViewMode] = useState<"pdf" | "text" | "split" | "compare">("split");
  const [compareDocId, setCompareDocId] = useState<string | null>(null);

  const searchInputId = "reading-search-input";
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        e.stopPropagation();
        setLeftCollapsed(false);
        setTimeout(() => document.getElementById(searchInputId)?.focus(), 50);
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

  useEffect(() => {
    let cancelled = false;
    setDocsLoading(true);
    api.listDocuments()
      .then((items) => { if (!cancelled) { setDocuments(items); if (items.length > 0) setDocId((cur) => cur ?? items[0].id); } })
      .catch((e) => toast.error(e instanceof Error ? e.message : "Failed to load documents"))
      .finally(() => !cancelled && setDocsLoading(false));
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    api.listNotebooks().then(nbs => { if (!cancelled) setNotebooks(nbs); }).catch(() => { });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!docId) { setDoc(null); return; }
    let cancelled = false;
    setDocLoading(true);
    setSelected(null);
    setExplanation(null);
    setCurrentPage(1);
    lastViewedPageRef.current = 1;
    api.getReading(docId)
      .then((d) => { if (!cancelled) setDoc(d); })
      .catch((e) => toast.error(e instanceof Error ? e.message : "Failed to load reading"))
      .finally(() => !cancelled && setDocLoading(false));
    return () => { cancelled = true; };
  }, [docId]);

  useEffect(() => {
    if (viewMode !== "compare" || !compareDocId) return;
    let cancelled = false;
    api.getReading(compareDocId).then(d => { if (!cancelled) setCompareDoc(d); }).catch(() => { });
    return () => { cancelled = true; };
  }, [viewMode, compareDocId]);

  useEffect(() => {
    if (!docId || !readingAnnotEnabled) { clearNotes(); return; }
    let cancelled = false;
    api.getNotes(docId).then((ns) => { if (!cancelled) setNotes(docId, ns); }).catch(() => { });
    return () => { cancelled = true; };
  }, [docId, readingAnnotEnabled, setNotes, clearNotes]);

  useEffect(() => {
    const pageParam = searchParams.get("page");
    if (pageParam && doc && pdfRef.current) {
      const targetPage = parseInt(pageParam, 10);
      if (!isNaN(targetPage) && targetPage >= 1 && targetPage <= doc.pages) {
        setTimeout(() => pdfRef.current?.scrollToPage(targetPage), 300);
      }
    }
  }, [doc, searchParams]);

  const handlePdfPageVisible = (page: number) => { lastViewedPageRef.current = page; setCurrentPage(page); };

  const runLens = async (text: string, level: Lens) => {
    if (!docId || !text) return;
    setSelected(text);
    setLensLoading(true);
    setExplanation(null);
    try {
      const res = await api.readingLens(docId, text, level);
      setExplanation(res.text);
      const { page, rects } = pendingHighlightRef.current;
      const updated = await api.addHighlight(docId, text, page, rects, res.text);
      setDoc(updated);
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed to fetch explanation"); }
    finally { setLensLoading(false); }
  };

  const handleSaveToNotebook = async (notebookId: string) => {
    if (!explanation || !docId) return;
    setSavingToNotebook(true);
    try {
      const textToSave = `> **Highlight**: ${selected}\n\n**Lens Explanation (${lens})**:\n${explanation}`;
      await api.appendToNotebook(notebookId, textToSave, "reading", docId);
      toast.success("Saved to notebook");
    } catch (e) { toast.error("Failed to save to notebook"); }
    finally { setSavingToNotebook(false); }
  };

  const handlePDFTextSelect = (_text: string, page: number, rects: HighlightRect[]) => {
    pendingHighlightRef.current = { page, rects };
  };

  const onExplain = (text: string) => { runLens(text, lens); };
  const onHighlight = async (text: string) => {
    if (!docId) return;
    const { page, rects } = pendingHighlightRef.current;
    try { const updated = await api.addHighlight(docId, text, page, rects); setDoc(updated); toast.success("Highlight saved"); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Failed to add highlight"); }
  };
  const onBookmark = async (text: string) => {
    if (!docId) return;
    const { page, rects } = pendingHighlightRef.current;
    try { const updated = await api.addBookmark(docId, `Page ${page}`, text, rects); setDoc(updated); toast.success("Bookmark saved"); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Failed to add bookmark"); }
  };
  const onWhiteboard = async (text: string) => {
    const courseName = documents.find((d) => d.id === docId)?.course ?? null;
    const title = text.length > 48 ? `${text.slice(0, 48)}…` : text;
    try {
      const wb = await api.createWhiteboard({ title, course: courseName, source: "selection" });
      navigate(`/whiteboards/${wb.id}?generate=${encodeURIComponent(text)}`);
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed to open whiteboard"); }
  };
  const onAddNote = async (text: string) => {
    if (!docId) return;
    const { page, rects } = pendingHighlightRef.current;
    const bbox = unionRects(rects as NoteRect[]);
    try {
      const note = await api.createNote(docId, { content: text, category: "general", pageNumber: page, boundingBox: bbox });
      addNoteToStore(note);
      toast.success("Note added — categorize it in the Workspace pane");
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed to add note"); }
  };
  const onRemoveBookmark = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!docId) return;
    try { await api.removeBookmark(docId, id); setDoc(prev => prev ? { ...prev, bookmarks: prev.bookmarks.filter(b => b.id !== id) } : null); toast.success("Bookmark removed"); }
    catch (e) { toast.error("Failed to remove bookmark"); }
  };
  const onRemoveHighlight = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!docId) return;
    try { await api.removeHighlight(docId, id); setDoc(prev => prev ? { ...prev, highlights: (prev.highlights as any).filter((h: any) => h.id !== id) } : null); toast.success("Highlight removed"); }
    catch (e) { toast.error("Failed to remove highlight"); }
  };
  const onAnnotateRegion = async (text: string) => {
    if (!docId) return;
    if (!excalidrawEnabled) { toast.error("Enable the Excalidraw plugin to annotate regions"); return; }
    const { page, rects } = pendingHighlightRef.current;
    const bbox = unionRects(rects as NoteRect[]);
    if (!bbox) { toast.error("Select a region in the PDF first"); return; }
    const snap = snapshotRegion(page, bbox);
    if (!snap) { toast.error("Could not capture the region — make sure the PDF page is visible"); return; }
    try {
      const courseName = documents.find((d) => d.id === docId)?.course ?? null;
      const title = text.length > 40 ? `${text.slice(0, 40)}…` : text || "Annotation";
      const wb = await api.createWhiteboard({ title, course: courseName, source: "annotation", documentId: Number(docId), pageNumber: page, scene: buildSnapshotScene(snap), thumbnail: snap.dataURL });
      navigate(`/whiteboards/${wb.id}`);
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed to open annotation board"); }
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

  const pickLens = (l: Lens) => { setLens(l); if (selected) runLens(selected, l); };

  const allHighlights = (doc?.highlights ?? []) as HighlightItem[];
  const allBookmarks = doc?.bookmarks ?? [];
  const highlights = allHighlights.filter(h => h.text.toLowerCase().includes(searchQuery.toLowerCase()));
  const bookmarks = allBookmarks.filter(b => b.section.toLowerCase().includes(searchQuery.toLowerCase()) || b.note.toLowerCase().includes(searchQuery.toLowerCase()));
  const pages = doc?.pages ?? 0;
  const progress = pages > 0 ? Math.round((currentPage / pages) * 100) : 0;

  if (!docsLoading && documents.length === 0) {
    return (
      <AppShell fullscreen={false} className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center max-w-xs">
          <div className="flex size-14 items-center justify-center"><PaperCard shadow="sm" className="p-3"><FileText className="size-6 text-ink-muted" /></PaperCard></div>
          <p className="font-caveat text-2xl font-bold text-ink">No documents to read yet</p>
          <p className="font-kalam text-sm text-ink-muted leading-relaxed">
            Upload and index a document first, then come back here to read it with AI-assisted highlights, bookmarks, and explanations.
          </p>
          <PaperButton tone="dark" className="mt-2" onClick={() => navigate("/documents")}>
            <BookOpen size={16} /> Go to Documents
          </PaperButton>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell fullscreen={false} className="h-full">
      <div className="flex h-full flex-col overflow-hidden">
        {/* Top bar */}
        <header className="relative z-20 flex shrink-0 items-center justify-between px-3 py-2">
          <SketchBorder
            fill="var(--color-paper-card, #fffdf9)"
            stroke="var(--color-border, #e4e0d6)"
            strokeWidth={1.5} roughness={1.2} radius={8} shadow={2} bleed={3}
          />
          <div className="relative z-[1] flex w-full items-center justify-between">
            <div className="flex items-center gap-1">
              <IconButton label={leftCollapsed ? "Expand sidebar" : "Collapse sidebar"} onClick={() => setLeftCollapsed(!leftCollapsed)}>
                {leftCollapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
              </IconButton>
            </div>

            <div className="flex items-center gap-1.5">
              <PaperSelect
                value={viewMode}
                onChange={(v) => setViewMode(v as any)}
                options={[
                  { value: "pdf", label: "PDF", icon: <BookOpen size={14} /> },
                  { value: "text", label: "Annotate", icon: <PencilLine size={14} /> },
                  { value: "split", label: "Split", icon: <Columns size={14} /> },
                  { value: "compare", label: "Compare", icon: <LayoutPanelLeft size={14} /> },
                ]}
                className="!px-2 !py-1 !text-xs !font-architect min-w-[100px]"
              />
              {(viewMode === "split" || viewMode === "text") && readingAnnotEnabled && (
                <PaperSelect
                  value={annotSubMode}
                  onChange={(v) => setAnnotSubMode(v as SubMode)}
                  options={[
                    { value: "notes", label: "Notes", icon: <StickyNoteIcon size={14} /> },
                    { value: "draw", label: "Draw", icon: <PencilRuler size={14} /> },
                    { value: "both", label: "Both", icon: <Columns size={14} /> },
                  ]}
                  className="!px-2 !py-1 !text-xs !font-architect min-w-[80px]"
                />
              )}
            </div>

            <div className="flex items-center gap-1">
              <IconButton label={rightCollapsed ? "Expand context" : "Collapse context"} onClick={() => setRightCollapsed(!rightCollapsed)}>
                {rightCollapsed ? <PanelRightOpen size={17} /> : <PanelRightClose size={17} />}
              </IconButton>
            </div>
          </div>
        </header>

        <div className="flex min-h-0 flex-1">
          {/* Left sidebar */}
          <motion.aside
            animate={{ width: leftCollapsed ? 0 : 260 }}
            transition={{ type: "spring", stiffness: 340, damping: 36 }}
            className={cn(
              "relative z-10 flex h-full shrink-0 flex-col overflow-hidden",
              "border-r border-[#c8c0b0] bg-sidebar",
              leftCollapsed && "overflow-hidden border-r-0"
            )}
          >
            <div className={cn("flex min-w-[260px] flex-1 flex-col overflow-hidden", leftCollapsed && "invisible")}>
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#c8c0b0]/50">
                <SectionLabel>Content</SectionLabel>
                <IconButton label="Collapse sidebar" onClick={() => setLeftCollapsed(true)}>
                  <PanelLeftClose size={15} />
                </IconButton>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-3 border-b border-[#c8c0b0]/50">
                  <div className="mb-2 flex items-center gap-1.5">
                    <FileText size={13} className="text-ink-muted" />
                    <SectionLabel className="!text-[11px]">Document</SectionLabel>
                  </div>
                  <PaperSelect
                    value={docId ?? undefined}
                    onChange={setDocId}
                    placeholder={docsLoading ? "Loading…" : "Select a document"}
                    disabled={docsLoading}
                    options={documents.map(d => ({ value: d.id, label: d.title }))}
                    className="!px-2 !py-1.5 !text-sm"
                  />
                </div>

                <div className="p-3 border-b border-[#c8c0b0]/50">
                  <div className="mb-2 flex items-center gap-1.5">
                    <BookMarked size={13} className="text-ink-muted" />
                    <SectionLabel className="!text-[11px]">Navigation</SectionLabel>
                  </div>
                  <SketchSearch
                    id={searchInputId}
                    placeholder="Search..."
                    width="100%"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    shortcut={null}
                  />
                  <div className="mt-2 text-sm text-ink-muted">
                    Page <span className="font-medium text-ink">{doc ? currentPage : "—"}</span> of <span className="font-medium text-ink">{pages || "—"}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <IconButton label="Zoom out" onClick={() => setScale((s) => Math.max(0.5, +(s - 0.25).toFixed(2)))}>
                      <ZoomOut size={15} />
                    </IconButton>
                    <span className="flex-1 text-center text-xs text-ink-muted">{Math.round(scale * 100)}%</span>
                    <IconButton label="Zoom in" onClick={() => setScale((s) => Math.min(3.0, +(s + 0.25).toFixed(2)))}>
                      <ZoomIn size={15} />
                    </IconButton>
                  </div>
                  {doc?.sections && doc.sections.length > 0 && (
                    <div className="mt-3">
                      <div className="mb-1.5 font-architect text-[10px] uppercase tracking-wider text-ink-muted/70">Contents</div>
                      <div className="flex flex-col gap-0.5">
                        {doc.sections.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase())).map((section) => (
                          <button key={section.id} onClick={() => { const page = section.paragraphs?.[0]?.page; if (page) pdfRef.current?.scrollToPage(page); }}
                            className="text-left px-2 py-1.5 text-xs text-ink-muted hover:bg-black/[0.04] hover:text-ink rounded transition-colors font-architect">
                            {section.number} {section.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-3 border-b border-[#c8c0b0]/50">
                  <div className="mb-2 flex items-center gap-1.5">
                    <Bookmark size={13} className="text-ink-muted" />
                    <SectionLabel className="!text-[11px]">Bookmarks</SectionLabel>
                  </div>
                  <SketchDivider variant="dashed" />
                  {bookmarks.length === 0 ? (
                    <p className="mt-2 text-xs text-ink-muted/60 font-kalam">No bookmarks yet.</p>
                  ) : (
                    <div className="mt-2 space-y-1">
                      {bookmarks.map((b) => (
                        <div key={b.id} className="group relative cursor-pointer rounded px-2.5 py-1.5 hover:bg-black/[0.03] pr-8"
                          onClick={() => { const m = b.section.match(/Page (\d+)/); if (m) pdfRef.current?.scrollToPage(parseInt(m[1], 10)); }}>
                          <div className="font-architect text-sm text-ink/80">{b.section}</div>
                          <div className="font-kalam text-xs text-ink-muted">{b.note}</div>
                          <IconButton label="Remove bookmark" onClick={(e) => onRemoveBookmark(b.id, e)}
                            className="absolute right-1 top-1.5 size-6 opacity-0 group-hover:opacity-100 !text-ink-muted hover:!text-danger">
                            <Trash2 size={13} />
                          </IconButton>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <div className="mb-2 flex items-center gap-1.5">
                    <Highlighter size={13} className="text-ink-muted" />
                    <SectionLabel className="!text-[11px]">Highlights</SectionLabel>
                  </div>
                  <SketchDivider variant="dashed" />
                  {highlights.length === 0 ? (
                    <p className="mt-2 text-xs text-ink-muted/60 font-kalam">No highlights yet.</p>
                  ) : (
                    <div className="mt-2 space-y-1">
                      {highlights.map((h) => (
                        <div key={h.id} className="group relative cursor-pointer rounded px-2.5 py-1.5 hover:bg-black/[0.03] pr-8"
                          onClick={() => pdfRef.current?.scrollToPage(h.page_number)}>
                          <div className="font-kalam text-sm text-ink/80 leading-snug">
                            <MarkerHighlight color="#f6e27a" thickness={6}>{h.text}</MarkerHighlight>
                          </div>
                          <div className="font-kalam text-xs text-ink-muted mt-0.5">Page {h.page_number}</div>
                          <IconButton label="Remove highlight" onClick={(e) => onRemoveHighlight(h.id, e)}
                            className="absolute right-1 top-1.5 size-6 opacity-0 group-hover:opacity-100 !text-ink-muted hover:!text-danger">
                            <Trash2 size={13} />
                          </IconButton>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </motion.aside>

          {/* Center — Reader */}
          <div className="relative min-w-0 flex-1">
            <main data-tour="reading-reader" className="h-full overflow-y-auto paper-scrollbar" ref={scrollRef}>
              <SelectionToolbar containerRef={readerRef} actions={actions} />

              {docLoading ? (
                <div className="flex h-full items-center justify-center gap-2 text-ink-muted font-architect">
                  <Loader2 className="size-4 animate-spin" /> Loading…
                </div>
              ) : !doc ? (
                <div className="flex h-full items-center justify-center text-sm text-ink-muted font-architect">
                  Select a document to start reading.
                </div>
              ) : (
                <div ref={readerRef} className="flex h-full">
                  {viewMode === "compare" ? (
                    <>
                      <div className="h-full overflow-y-auto w-1/2 border-r border-[#c8c0b0]">
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
                      <div className="h-full overflow-y-auto w-1/2 relative">
                        <div className="absolute top-3 right-6 z-10 w-48">
                          <PaperSelect
                            value={compareDocId ?? undefined}
                            onChange={setCompareDocId}
                            placeholder="Select document..."
                            options={documents.map(d => ({ value: d.id, label: d.title }))}
                            className="!px-2 !py-1 !text-xs"
                          />
                        </div>
                        {compareDoc ? (
                          <div className="px-6 py-6 mt-10">
                            <PDFViewer
                              pdfUrl={`/api/documents/${compareDocId}/raw`}
                              highlights={(compareDoc.highlights ?? []) as HighlightItem[]}
                              scale={scale}
                              onTextSelect={() => {}}
                            />
                          </div>
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-ink-muted font-architect mt-10">
                            Select a secondary document to compare.
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      {(viewMode === "pdf" || viewMode === "split") && (
                        <div className={`h-full overflow-y-auto ${viewMode === "split" ? "w-1/2 border-r border-[#c8c0b0]" : "w-full"}`}>
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
                        <div className={`h-full ${viewMode === "split" ? "w-1/2" : "w-full"}`}>
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
                              <PaperCard shadow="sm" className="p-4"><PuzzleIcon className="size-6 text-ink-muted" /></PaperCard>
                              <p className="font-caveat text-xl font-bold text-ink">Reading Annotations plugin not configured</p>
                              <p className="font-kalam text-sm text-ink-muted max-w-xs leading-relaxed">
                                Enable the <span className="font-medium text-ink">Reading Annotations</span> plugin in Settings to use sticky notes and region annotations here.
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

            {viewMode !== "text" && (
              <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1">
                <PaperCard shadow="sm" className="!px-2 !py-1 flex items-center gap-1">
                  <IconButton label="Zoom out" onClick={() => setScale((s) => Math.max(0.25, +(s - 0.25).toFixed(2)))}>
                    <ZoomOut size={14} />
                  </IconButton>
                  <span className="min-w-[3rem] text-center font-architect text-xs text-ink-muted tabular-nums">
                    {Math.round(scale * 100)}%
                  </span>
                  <IconButton label="Zoom in" onClick={() => setScale((s) => Math.min(3.0, +(s + 0.25).toFixed(2)))}>
                    <ZoomIn size={14} />
                  </IconButton>
                </PaperCard>
              </div>
            )}
          </div>

          {/* Right sidebar — Academic Lens context */}
          <motion.aside
            animate={{ width: rightCollapsed ? 0 : 320 }}
            transition={{ type: "spring", stiffness: 340, damping: 36 }}
            className={cn(
              "relative z-10 flex h-full shrink-0 flex-col overflow-hidden",
              "border-l border-[#c8c0b0] bg-sidebar",
              rightCollapsed && "overflow-hidden border-l-0"
            )}
          >
            <div className={cn("flex min-w-[320px] flex-1 flex-col overflow-hidden", rightCollapsed && "invisible")}>
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#c8c0b0]/50">
                <IconButton label="Collapse context" onClick={() => setRightCollapsed(true)}>
                  <PanelRightClose size={15} />
                </IconButton>
                <SectionLabel>Context</SectionLabel>
                {selected ? (
                  <IconButton label="Clear" onClick={() => { setSelected(null); setExplanation(null); }}>
                    <X size={14} />
                  </IconButton>
                ) : <div className="size-8" />}
              </div>

              <ScrollArea className="flex-1">
                <div data-tour="reading-lens" className="p-4 border-b border-[#c8c0b0]/50">
                  <div className="mb-3 flex items-center gap-1.5">
                    <GraduationCap size={14} className="text-ink-muted" />
                    <SectionLabel className="!text-[11px]">Academic Lens</SectionLabel>
                  </div>
                  <div className="flex gap-1">
                    {(["Beginner", "Intermediate", "Expert"] as Lens[]).map((l) => (
                      <ChipButton key={l} selected={lens === l} onClick={() => pickLens(l)} className="!text-xs flex-1">
                        {l}
                      </ChipButton>
                    ))}
                  </div>
                </div>

                <div data-tour="reading-context" className="p-4 space-y-5">
                  <AnimatePresence mode="wait">
                    {selected ? (
                      <motion.div key="ctx" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                        <div>
                          <SectionLabel className="!text-[11px] mb-2 block">Selected Text</SectionLabel>
                          <div className="font-kalam text-sm text-ink/90 leading-relaxed px-3 py-2 rounded" style={{ backgroundColor: "rgba(246,226,122,0.15)", borderLeft: "3px solid #f6e27a" }}>
                            &ldquo;{selected}&rdquo;
                          </div>
                          <div className="mt-1.5 font-kalam text-xs text-ink-muted">Page {pendingHighlightRef.current.page}</div>
                        </div>
                        <div>
                          <SectionLabel className="!text-[11px] mb-2 block">AI Explanation &middot; {lens}</SectionLabel>
                          <PaperCard shadow="sm" className="!p-4">
                            <div className="mb-2 flex items-center gap-1.5 font-architect text-xs text-ink-muted">
                              <Sparkles size={14} /> ScholarAI
                            </div>
                            {lensLoading ? (
                              <div className="flex items-center gap-2 py-1 font-kalam text-sm text-ink-muted">
                                <Loader2 className="size-3.5 animate-spin" /> Thinking&hellip;
                              </div>
                            ) : (
                              <p className="font-kalam text-sm text-ink/90 leading-relaxed">
                                {explanation ?? "No explanation available."}
                              </p>
                            )}
                            {explanation && !lensLoading && (
                              <div className="mt-3 flex justify-end">
                                <PaperSelect
                                  value={undefined}
                                  onChange={handleSaveToNotebook}
                                  placeholder={savingToNotebook ? "Saving..." : "Save to Notebook"}
                                  disabled={savingToNotebook}
                                  options={[
                                    ...notebooks.map(nb => ({ value: nb.id, label: nb.name, icon: <BookPlus size={13} /> })),
                                    ...(notebooks.length === 0 ? [{ value: "", label: "No notebooks found" }] : []),
                                  ]}
                                  className="!px-2 !py-1 !text-xs min-w-[140px]"
                                />
                              </div>
                            )}
                          </PaperCard>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="flex flex-col items-center pt-10 text-center">
                        <PaperCard shadow="sm" className="!p-4"><BookOpen size={22} className="text-ink-muted" /></PaperCard>
                        <p className="mt-3 font-caveat text-lg font-bold text-ink">Highlight to learn</p>
                        <p className="mt-1 font-kalam text-xs text-ink-muted leading-relaxed max-w-xs">
                          Select any passage in the reader and choose &ldquo;Explain&rdquo; to get an AI explanation tuned to your chosen lens.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            </div>
          </motion.aside>
        </div>

        {/* Bottom bar — reading progress */}
        <div className="relative z-10 flex shrink-0 items-center gap-6 px-6 py-2.5 text-xs text-ink-muted border-t border-[#c8c0b0]/50 bg-sidebar">
          <span className="flex items-center gap-1.5 font-architect">
            <BookOpen size={14} /> Page {doc ? currentPage : 1} of {Math.max(1, pages)}
          </span>
          <span className="flex items-center gap-1.5 font-architect">
            <Clock size={14} /> ~{Math.max(1, pages - currentPage)} min left
          </span>
          <span className="flex items-center gap-1.5 font-architect">
            <Highlighter size={14} /> {highlights.length} highlights
          </span>
          <span className="flex items-center gap-1.5 font-architect">
            <Bookmark size={14} /> {bookmarks.length} bookmarks
          </span>
          <div className="ml-auto flex items-center gap-3 min-w-[180px]">
            <span className="font-architect font-medium text-ink">{progress}%</span>
            <ReadingProgress value={progress} height={6} label={false} className="flex-1" color="#7fa37b" />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
