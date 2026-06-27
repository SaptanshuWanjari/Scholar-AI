import { useEffect, useMemo, useRef, useState } from "react";
import {
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  List,
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
  Monitor,
} from "lucide-react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { cn } from "../components/ui/utils";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { SelectionToolbar, type SelectionAction } from "../components/SelectionToolbar";
import { api, type ReadingDoc } from "../lib/api";
import type { DocumentItem } from "../lib/types";
import { MarkdownRenderer } from "../components/MarkdownRenderer";

type Lens = "Beginner" | "Intermediate" | "Expert";

export function Reading() {
  const readerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [docsLoading, setDocsLoading] = useState(true);
  const [docId, setDocId] = useState<string | null>(null);

  const [doc, setDoc] = useState<ReadingDoc | null>(null);
  const [docLoading, setDocLoading] = useState(false);

  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<"reader" | "original">("reader");

  const [lens, setLens] = useState<Lens>("Intermediate");
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [lensLoading, setLensLoading] = useState(false);

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
    setProgress(0);
    api
      .getReading(docId)
      .then((d) => {
        if (cancelled) return;
        setDoc(d);
        setActiveSection(d.sections[0]?.id ?? null);
      })
      .catch((e) => toast.error(e instanceof Error ? e.message : "Failed to load reading"))
      .finally(() => !cancelled && setDocLoading(false));
    return () => {
      cancelled = true;
    };
  }, [docId]);

  // ---- Scroll progress + active section tracking ----
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !doc) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? Math.min(100, Math.round((el.scrollTop / max) * 100)) : 0);
      const sections = doc.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const node = document.getElementById(sections[i].id);
        if (node && node.offsetTop - el.scrollTop <= 160) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [doc]);

  const jump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const currentSectionTitle = useMemo(() => {
    if (!doc) return "";
    const match = doc.sections.find((s) => s.id === activeSection);
    return match?.title ?? doc.sections[0]?.title ?? "";
  }, [doc, activeSection]);

  // ---- Lens: fetch an adaptive explanation for some text ----
  const runLens = async (text: string, level: Lens) => {
    if (!docId || !text) return;
    setSelected(text);
    setLensLoading(true);
    setExplanation(null);
    try {
      const res = await api.readingLens(docId, text, level);
      setExplanation(res.text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to fetch explanation");
    } finally {
      setLensLoading(false);
    }
  };

  // ---- Selection toolbar actions ----
  const onExplain = (text: string) => {
    setSelectedSection(currentSectionTitle);
    runLens(text, lens);
  };

  const onHighlight = async (text: string) => {
    if (!docId) return;
    try {
      const updated = await api.addHighlight(docId, text, currentSectionTitle);
      setDoc(updated);
      toast.success("Highlight saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to add highlight");
    }
  };

  const onBookmark = async (text: string) => {
    if (!docId) return;
    try {
      const updated = await api.addBookmark(docId, currentSectionTitle, text);
      setDoc(updated);
      toast.success("Bookmark saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to add bookmark");
    }
  };

  const actions: SelectionAction[] = [
    { label: "Explain", icon: Wand2, onSelect: onExplain },
    { label: "Highlight", icon: Highlighter, onSelect: onHighlight },
    { label: "Bookmark", icon: Bookmark, onSelect: onBookmark },
  ];

  // ---- When the user switches lens with active selection, re-fetch ----
  const pickLens = (l: Lens) => {
    setLens(l);
    if (selected) runLens(selected, l);
  };

  const highlights = doc?.highlights ?? [];
  const bookmarks = doc?.bookmarks ?? [];
  const pages = doc?.pages ?? 0;

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
          <div className="border-b border-border p-3">
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

          <Group label="Outline" icon={List}>
            {(doc?.sections ?? []).map((s) => (
              <button
                key={s.id}
                onClick={() => jump(s.id)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors",
                  activeSection === s.id ? "bg-accent text-foreground" : "text-foreground/70 hover:bg-accent/50",
                )}
              >
                <span className={cn("font-mono text-xs", activeSection === s.id ? "text-violet" : "text-muted-foreground")}>
                  {s.number}
                </span>
                <span className="truncate">{s.title}</span>
              </button>
            ))}
          </Group>

          <Group label="Bookmarks" icon={Bookmark}>
            {bookmarks.length === 0 ? (
              <p className="px-2.5 py-1.5 text-[11px] text-muted-foreground">No bookmarks yet.</p>
            ) : (
              bookmarks.map((b) => (
                <div key={b.id} className="rounded-md px-2.5 py-1.5 hover:bg-accent/50">
                  <div className="text-sm text-foreground/80">{b.section}</div>
                  <div className="text-[11px] text-muted-foreground">{b.note}</div>
                </div>
              ))
            )}
          </Group>

          <Group label="Highlights" icon={Highlighter}>
            {highlights.length === 0 ? (
              <p className="px-2.5 py-1.5 text-[11px] text-muted-foreground">No highlights yet.</p>
            ) : (
              highlights.map((h) => (
                <div key={h.id} className="rounded-md px-2.5 py-1.5 hover:bg-accent/50">
                  <div className="study-mark inline font-reading text-[13px] leading-snug text-foreground/80">
                    {h.text}
                  </div>
                  <div className="mt-1 text-[11px] text-muted-foreground">{h.section}</div>
                </div>
              ))
            )}
          </Group>
        </aside>

        {/* Center — Reader */}
        <main className="relative min-w-0 flex-1 overflow-y-auto" ref={scrollRef}>
          <SelectionToolbar containerRef={readerRef} actions={actions} />

          {/* Sidebar Toggles & View Mode */}
          <div className="pointer-events-none absolute left-0 top-4 z-10 flex w-full justify-between px-4">
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
          ) : viewMode === "original" ? (
            <div className="h-full w-full ">
              <iframe
                src={`/api/documents/${docId}/raw`}
                className="h-full w-full border-none bg-white"
                title="Original Document"
              />
            </div>
          ) : (
            <div ref={readerRef} className="mx-auto max-w-[760px] px-8 py-14">
              <div className="border-b border-border pb-8 text-center">
                <Badge variant="outline" className="text-[11px] text-muted-foreground">{doc.kind}</Badge>
                <h1 className="mt-4 text-[2.75rem] leading-[1.1]">{doc.title}</h1>
                {doc.author && <p className="mt-3 text-sm text-muted-foreground">{doc.author}</p>}
              </div>

              {doc.sections.map((s) => (
                <section key={s.id} id={s.id} className="scroll-mt-8 pt-12">
                  <div className="mb-4 flex items-baseline gap-3">
                    <span className="font-mono text-sm text-violet">{s.number}</span>
                    <h2 className="text-[1.75rem]">{s.title}</h2>
                  </div>
                  {s.paragraphs.map((p, i) => (
                    <div key={i} className="selection:bg-primary selection:text-primary-foreground">
                      <MarkdownRenderer content={p} className="text-[17px] leading-relaxed" />
                    </div>
                  ))}
                </section>
              ))}
              <div className="h-24" />
            </div>
          )}
        </main>

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

          {/* View Mode */}
          {doc && (
            <div className="border-b border-border p-4">
              <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <Monitor className="size-3.5" /> View Mode
              </div>
              <div className="flex rounded-lg border border-border bg-card p-0.5">
                <button
                  onClick={() => setViewMode("reader")}
                  className={cn(
                    "flex-1 rounded-md py-1.5 text-xs font-medium transition-colors",
                    viewMode === "reader" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Reader
                </button>
                <button
                  onClick={() => setViewMode("original")}
                  className={cn(
                    "flex-1 rounded-md py-1.5 text-xs font-medium transition-colors",
                    viewMode === "original" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Original
                </button>
              </div>
            </div>
          )}

          {/* Academic Lens */}
          <div className="border-b border-border p-4">
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

          <div className="flex-1 space-y-5 p-4">
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
                    {selectedSection && (
                      <div className="mt-1.5 text-[11px] text-muted-foreground">in {selectedSection}</div>
                    )}
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
          <BookOpen className="size-3.5" /> Page {Math.max(1, Math.round((progress / 100) * pages))} of {Math.max(1, pages)}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="size-3.5" /> ~{Math.max(1, pages - Math.round((progress / 100) * pages))} min left
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

function Group({ label, icon: Icon, children }: { label: string; icon: typeof List; children: React.ReactNode }) {
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
