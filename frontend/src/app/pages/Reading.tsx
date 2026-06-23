import { useEffect, useRef, useState } from "react";
import {
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  List,
  Bookmark,
  Highlighter,
  Wand2,
  Minimize2,
  Layers,
  ListChecks,
  Workflow,
  Network,
  NotebookPen,
  Sparkles,
  BookOpen,
  Quote,
  GraduationCap,
  Clock,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { cn } from "../components/ui/utils";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { SelectionToolbar } from "../components/SelectionToolbar";
import { readingDoc, bookmarks, highlights, lensExplanations } from "../lib/reading-data";

type Lens = "Beginner" | "Intermediate" | "Expert";

export function Reading() {
  const readerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("sec1");
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [lens, setLens] = useState<Lens>("Intermediate");
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? Math.min(100, Math.round((el.scrollTop / max) * 100)) : 0);
      // active section
      const sections = readingDoc.sections;
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
  }, []);

  const jump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const explain = (text: string) => setSelected(text);

  const actions = [
    { label: "Explain", icon: Wand2, onSelect: explain },
    { label: "Simplify", icon: Minimize2, onSelect: explain },
    { label: "Flashcard", icon: Layers, onSelect: () => toast.success("Flashcard created") },
    { label: "Quiz", icon: ListChecks, onSelect: () => toast.success("Quiz generated") },
    { label: "Diagram", icon: Workflow, onSelect: () => toast.success("Diagram generated") },
    { label: "Mind Map", icon: Network, onSelect: () => toast.success("Mind map created") },
    { label: "Notebook", icon: NotebookPen, onSelect: () => toast.success("Added to notebook") },
    { label: "Ask AI", icon: Sparkles, onSelect: explain },
  ];

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
          <Group label="Outline" icon={List}>
            {readingDoc.sections.map((s) => (
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
            {bookmarks.map((b) => (
              <div key={b.id} className="rounded-md px-2.5 py-1.5 hover:bg-accent/50">
                <div className="text-sm text-foreground/80">{b.section}</div>
                <div className="text-[11px] text-muted-foreground">{b.note}</div>
              </div>
            ))}
          </Group>

          <Group label="Highlights" icon={Highlighter}>
            {highlights.map((h) => (
              <div key={h.id} className="rounded-md px-2.5 py-1.5 hover:bg-accent/50">
                <div className="study-mark inline font-reading text-[13px] leading-snug text-foreground/80">
                  {h.text}
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground">{h.section}</div>
              </div>
            ))}
          </Group>
        </aside>

        {/* Center — Reader */}
        <main className="relative min-w-0 flex-1 overflow-y-auto" ref={scrollRef}>
          <SelectionToolbar containerRef={readerRef} actions={actions} />
          
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

          <div ref={readerRef} className="mx-auto max-w-[760px] px-8 py-14">
            <div className="border-b border-border pb-8 text-center">
              <Badge variant="outline" className="text-[11px] text-muted-foreground">{readingDoc.kind}</Badge>
              <h1 className="mt-4 text-[2.75rem] leading-[1.1]">{readingDoc.title}</h1>
              <p className="mt-3 text-sm text-muted-foreground">{readingDoc.author}</p>
            </div>

            {readingDoc.sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-8 pt-12">
                <div className="mb-4 flex items-baseline gap-3">
                  <span className="font-mono text-sm text-violet">{s.number}</span>
                  <h2 className="text-[1.75rem]">{s.title}</h2>
                </div>
                {s.paragraphs.map((p, i) => (
                  <p
                    key={i}
                    className="mb-6 font-book text-[18px] leading-[1.85] text-foreground/85 selection:bg-warning/25"
                  >
                    {p}
                  </p>
                ))}
              </section>
            ))}
            <div className="h-24" />
          </div>
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
              <Button variant="ghost" size="icon" className="size-6" onClick={() => setSelected(null)}>
                <X className="size-3.5" />
              </Button>
            ) : (
              <div className="size-7" />
            )}
          </div>

          {/* Academic Lens */}
          <div className="border-b border-border p-4">
            <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <GraduationCap className="size-3.5" /> Academic Lens
            </div>
            <div className="flex rounded-lg border border-border bg-card p-0.5">
              {(["Beginner", "Intermediate", "Expert"] as Lens[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLens(l)}
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
                  </Block>
                  <Block title={`AI Explanation · ${lens}`}>
                    <div className="rounded-lg border border-violet/25 bg-violet-soft/50 p-3">
                      <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-violet">
                        <Sparkles className="size-3.5" /> ScholarAI
                      </div>
                      <p className="font-reading text-sm leading-relaxed text-foreground/90">
                        {lensExplanations[lens]}
                      </p>
                    </div>
                  </Block>
                  <Block title="Related Concepts">
                    <div className="flex flex-wrap gap-1.5">
                      {["Loss surface", "Learning rate", "Chain rule", "Convexity"].map((t) => (
                        <span key={t} className="rounded-full border border-border bg-card px-2 py-0.5 text-[11px] text-foreground/70">
                          {t}
                        </span>
                      ))}
                    </div>
                  </Block>
                  <Block title="Source References">
                    {["Deep Learning, Ch. 6", "Backpropagation.pdf, p.12"].map((s) => (
                      <div key={s} className="flex items-center gap-2 py-1 text-sm text-foreground/80">
                        <Quote className="size-3.5 shrink-0 text-muted-foreground" /> {s}
                      </div>
                    ))}
                  </Block>
                  <Button variant="outline" className="w-full gap-2" onClick={() => toast.success("Added to notebook")}>
                    <NotebookPen className="size-4" /> Save to Notebook
                  </Button>
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
                    Select any passage in the reader to get an AI explanation tuned to your chosen lens.
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
          <BookOpen className="size-3.5" /> Page {Math.max(1, Math.round((progress / 100) * readingDoc.pages))} of {readingDoc.pages}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="size-3.5" /> ~{Math.max(1, readingDoc.pages - Math.round((progress / 100) * readingDoc.pages))} min left
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
