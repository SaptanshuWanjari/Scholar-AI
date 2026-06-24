import { useEffect, useState } from "react";
import {
  GraduationCap,
  BookOpen,
  NotebookPen,
  Layers,
  ListChecks,
  Network,
  Workflow,
  Columns2,
  FileText,
  Sparkles,
  Loader2,
  AlertTriangle,
  Save,
  Plus,
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { ScrollArea } from "../components/ui/scroll-area";
import { MarkdownRenderer } from "../components/MarkdownRenderer";
import { FlashcardCard } from "../components/FlashcardCard";
import { DiagramViewer } from "../components/DiagramViewer";
import { SourcePanel } from "../components/SourcePanel";
import { MindMapTree, countNodes, parseMindmapText } from "../components/MindMapTree";
import { cn } from "../components/ui/utils";
import { api, type PackageMeta, type FlashcardSet, type GeneratedQuiz, type GeneratedDiagram, type GeneratedMindmap, type GeneratedRevision } from "../lib/api";
import type { GeneratedDifference, Flashcard, QuizQuestion } from "../lib/types";
import {
  useTeachStore,
  ARTIFACT_KEYS,
  type ArtifactKey,
  type Depth,
  type ViewKey,
  type SlotStatus,
} from "../stores/useTeachStore";

const EXAMPLES = ["CAP Theorem", "RAG", "Deadlocks", "Service Discovery", "OS Scheduling", "LangGraph"];

const DEPTHS: { id: Depth; label: string }[] = [
  { id: "quick", label: "Quick Overview" },
  { id: "standard", label: "Standard" },
  { id: "deep", label: "Deep Dive" },
];

const ARTIFACT_LABELS: Record<ArtifactKey, string> = {
  notes: "Notes",
  flashcards: "Flashcards",
  quiz: "Quiz",
  mindmap: "Mind Map",
  diagram: "Diagram",
  difference: "Difference Tables",
};

const NAV: { id: ViewKey; label: string; icon: typeof BookOpen }[] = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "notes", label: "Notes", icon: NotebookPen },
  { id: "flashcards", label: "Flashcards", icon: Layers },
  { id: "quiz", label: "Quiz", icon: ListChecks },
  { id: "mindmap", label: "Mind Map", icon: Network },
  { id: "diagram", label: "Diagram", icon: Workflow },
  { id: "difference", label: "Difference Tables", icon: Columns2 },
  { id: "sources", label: "Sources", icon: FileText },
];

// ---------------------------------------------------------------------------
// Input phase
// ---------------------------------------------------------------------------

function InputPhase() {
  const { topic, depth, course, document, courses, documents, selected, setField, setCourse, setDocument, toggleArtifact, startGenerate, loadPackage, fetchCoursesAndDocs } =
    useTeachStore();
  const [packages, setPackages] = useState<PackageMeta[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>(EXAMPLES);

  useEffect(() => {
    let cancelled = false;
    fetchCoursesAndDocs();
    api.listPackages().then((p) => { if (!cancelled) setPackages(p); }).catch(() => { });
    api.onboardingAnalysis().then((a) => {
      if (!cancelled) {
        const generated = [...(a.topics || []), ...(a.concepts || [])];
        if (generated.length > 0) {
          // Get unique suggestions up to 6
          const unique = Array.from(new Set(generated)).slice(0, 6);
          setSuggestions(unique);
        }
      }
    }).catch(() => { });
    return () => { cancelled = true; };
  }, []);

    const removePackage = async (id: string) => {
      try {
        await api.deletePackage(id);
        setPackages((prev) => prev.filter((p) => p.id !== id));
        toast.success("Package deleted");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to delete");
      }
    };

    return (
      <ScrollArea className="h-full">
        <div className="mx-auto max-w-2xl px-6 py-12">
          <div className="flex flex-col items-center text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-violet-soft text-primary">
              <GraduationCap className="size-6" />
            </div>
            <h1 className="mt-4 text-2xl font-semibold">Teach Me</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter a topic and get a complete learning workspace — notes, flashcards, quiz,
              mind map, diagram and more, all in one place.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-card p-5">
            <Input
              value={topic}
              onChange={(e) => setField("topic", e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") startGenerate(); }}
              placeholder="What would you like to learn?"
              className="h-11 bg-input-background text-base"
              autoFocus
            />

            <div className="mt-3 flex flex-wrap gap-1.5">
              {suggestions.map((ex) => (
                <button
                  key={ex}
                  onClick={() => setField("topic", ex)}
                  className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-ring/40 hover:text-foreground"
                >
                  {ex}
                </button>
              ))}
            </div>

            {/* Context Pickers */}
            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Course</div>
                <Select value={course} onValueChange={setCourse}>
                  <SelectTrigger>
                    <SelectValue placeholder="All courses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">All courses</SelectItem>
                    {courses.map((c) => (
                      <SelectItem key={c.id} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Document</div>
                <Select
                  value={document ?? "all"}
                  onValueChange={(v) => setDocument(v === "all" ? null : v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All documents" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All documents</SelectItem>
                    {(course === "none" ? documents : documents.filter(d => d.course === course)).map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Depth */}
            <div className="mt-5">
              <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Depth</div>
              <div className="flex gap-2">
                {DEPTHS.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setField("depth", d.id)}
                    className={cn(
                      "flex-1 rounded-lg border px-3 py-2 text-sm transition-colors",
                      depth === d.id ? "border-primary bg-violet-soft text-primary" : "border-border bg-background hover:border-ring/40",
                    )}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Artifacts */}
            <div className="mt-5">
              <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Artifacts</div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {ARTIFACT_KEYS.map((key) => (
                  <button
                    key={key}
                    onClick={() => toggleArtifact(key)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
                      selected[key] ? "border-primary/50 bg-violet-soft/60" : "border-border bg-background text-muted-foreground hover:border-ring/40",
                    )}
                  >
                    <span className={cn("flex size-4 items-center justify-center rounded border", selected[key] ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40")}>
                      {selected[key] && <CheckCircle2 className="size-3" />}
                    </span>
                    {ARTIFACT_LABELS[key]}
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={startGenerate} className="mt-6 w-full gap-2">
              <Sparkles className="size-4" /> Generate learning package
            </Button>
          </div>

          {/* Library */}
          {packages.length > 0 && (
            <div className="mt-10">
              <h2 className="mb-3 text-sm font-medium">Your learning packages</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {packages.map((p) => (
                  <div
                    key={p.id}
                    className="group flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-ring/40"
                    onClick={() => loadPackage(p.id)}
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-violet-soft text-primary">
                      <GraduationCap className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{p.title}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground capitalize">
                        {p.depth} · {p.artifactCount} {p.artifactCount === 1 ? "artifact" : "artifacts"}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 shrink-0 text-muted-foreground opacity-0 hover:text-danger group-hover:opacity-100"
                      onClick={(e) => { e.stopPropagation(); void removePackage(p.id); }}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    );
  }

// ---------------------------------------------------------------------------
// Workspace views
// ---------------------------------------------------------------------------

function ViewState({ icon: Icon, message }: { icon: typeof Sparkles; message: string }) {
      return (
        <div className="flex flex-col items-center justify-center gap-3 pt-24 text-center text-muted-foreground">
          <Icon className="size-7 opacity-50" />
          <p className="max-w-sm text-sm">{message}</p>
        </div>
      );
    }

function Spinner({ message }: { message: string }) {
      return (
        <div className="flex flex-col items-center pt-24 text-muted-foreground">
          <Loader2 className="size-6 animate-spin text-primary" />
          <p className="mt-3 text-sm">{message}</p>
        </div>
      );
    }

function QuizReview({ questions }: { questions: QuizQuestion[] }) {
      const [revealed, setRevealed] = useState<Record<string, boolean>>({});
      if (!questions.length) {
        return <ViewState icon={ListChecks} message="No quiz questions were generated for this topic." />;
      }
      return (
        <div className="space-y-4">
          {questions.map((q, i) => {
            const show = revealed[q.id];
            return (
              <div key={q.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-violet-soft text-[11px] font-medium text-primary">{i + 1}</span>
                  <p className="text-sm font-medium leading-snug">{q.prompt}</p>
                </div>
                {q.options && q.options.length > 0 && (
                  <ul className="mt-3 space-y-1.5 pl-7">
                    {q.options.map((opt, oi) => {
                      const isAnswer = show && opt.trim() === q.answer.trim();
                      return (
                        <li
                          key={oi}
                          className={cn(
                            "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm",
                            isAnswer ? "border-success/50 bg-success-soft text-success" : "border-border",
                          )}
                        >
                          {isAnswer && <CheckCircle2 className="size-3.5 shrink-0" />}
                          {opt}
                        </li>
                      );
                    })}
                  </ul>
                )}
                <div className="mt-3 pl-7">
                  {show ? (
                    q.explanation && (
                      <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm">
                        <p className="text-muted-foreground">{q.explanation}</p>
                      </div>
                    )
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => setRevealed((r) => ({ ...r, [q.id]: true }))}>
                      Show answer
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

function ArtifactBody({ view }: { view: ArtifactKey }) {
      const slot = useTeachStore((s) => s.artifacts[view]);
      const selected = useTeachStore((s) => s.selected[view]);
      const retryArtifact = useTeachStore((s) => s.retryArtifact);

      if (!selected) {
        return <ViewState icon={XCircle} message={`${ARTIFACT_LABELS[view]} was not included in this package.`} />;
      }
      if (slot.status === "queued") return <Spinner message="Queued — waiting for earlier artifacts…" />;
      if (slot.status === "loading") return <Spinner message={`Generating ${ARTIFACT_LABELS[view].toLowerCase()}…`} />;
      if (slot.status === "error") {
        return (
          <div className="flex flex-col items-center gap-3 pt-24 text-center text-muted-foreground">
            <AlertTriangle className="size-7 text-danger/70" />
            <p className="max-w-sm text-sm">{slot.error}</p>
            <Button variant="outline" size="sm" onClick={() => void retryArtifact(view)}>Retry</Button>
          </div>
        );
      }
      if (!slot.data) return <Spinner message="Loading…" />;

      switch (view) {
        case "notes":
          return <MarkdownRenderer content={(slot.data as GeneratedRevision).markdown} />;
        case "difference":
          return <MarkdownRenderer content={(slot.data as GeneratedDifference).content} />;
        case "flashcards": {
          const cards = (slot.data as FlashcardSet).cards as Flashcard[];
          if (!cards.length) return <ViewState icon={Layers} message="No flashcards were generated." />;
          return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {cards.map((c) => <FlashcardCard key={c.id} card={c} />)}
            </div>
          );
        }
        case "quiz":
          return <QuizReview questions={(slot.data as GeneratedQuiz).questions} />;
        case "diagram":
          return <DiagramViewer code={(slot.data as GeneratedDiagram).mermaid} flush />;
        case "mindmap": {
          const text = (slot.data as GeneratedMindmap).text;
          if (!text?.trim()) return <ViewState icon={Network} message="No mind map was generated." />;
          const count = countNodes(parseMindmapText(text));
          return (
            <div>
              <Badge variant="outline" className="mb-4 border-cyan/40 bg-cyan-soft text-cyan">
                {count} {count === 1 ? "node" : "nodes"}
              </Badge>
              <MindMapTree text={text} />
            </div>
          );
        }
      }
    }

function StatusIcon({ status }: { status: SlotStatus }) {
      switch (status) {
        case "loading":
          return <Loader2 className="size-3.5 shrink-0 animate-spin text-primary" />;
        case "done":
          return <CheckCircle2 className="size-3.5 shrink-0 text-success" />;
        case "error":
          return <AlertTriangle className="size-3.5 shrink-0 text-danger" />;
        case "queued":
          return <Clock className="size-3.5 shrink-0 text-muted-foreground/60" />;
        default:
          return null;
      }
    }

function WorkspacePhase() {
      const {
        topic, activeView, overview, overviewStatus, sources, packageId, saving,
        artifacts, selected, generating, currentTask, openView, savePackage, reset,
      } = useTeachStore();

      const grounded = overview?.grounded;

      // Status per nav item: overview/artifacts have real status; Sources rides on
      // the overview (its chunks come back with the overview).
      const statusFor = (view: ViewKey): SlotStatus => {
        if (view === "overview" || view === "sources") return overviewStatus;
        return artifacts[view].status;
      };

      // Progress across the whole package: overview + each selected artifact.
      const total = 1 + ARTIFACT_KEYS.filter((k) => selected[k]).length;
      const done =
        (overviewStatus === "done" ? 1 : 0) +
        ARTIFACT_KEYS.filter((k) => selected[k] && artifacts[k].status === "done").length;
      const currentLabel = currentTask ? NAV.find((n) => n.id === currentTask)?.label : null;

      return (
        <div className="flex h-full">
          {/* Nav rail */}
          <div className="flex w-64 shrink-0 flex-col border-r border-border bg-card/40">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <GraduationCap className="size-4 text-primary" />
              <span className="truncate text-sm font-medium">{topic}</span>
            </div>

            {/* Live progress strip */}
            <div className="border-b border-border px-4 py-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-muted-foreground">
                  {generating ? (
                    <span className="flex items-center gap-1.5 text-foreground">
                      <Loader2 className="size-3 animate-spin text-primary" />
                      Generating {currentLabel ?? "…"}
                    </span>
                  ) : done >= total ? (
                    "All artifacts ready"
                  ) : (
                    "Ready"
                  )}
                </span>
                <span className="font-mono text-muted-foreground">{done}/{total}</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  animate={{ width: `${total ? (done / total) * 100 : 0}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>

            <div className="min-h-0 flex-1">
              <ScrollArea className="h-full">
              <nav className="space-y-1 p-2">
                {NAV.map((item) => {
                  const st = statusFor(item.id);
                  const isArtifact = (ARTIFACT_KEYS as string[]).includes(item.id);
                  const notIncluded = isArtifact && !selected[item.id as ArtifactKey];
                  return (
                    <button
                      key={item.id}
                      onClick={() => openView(item.id)}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                        activeView === item.id ? "bg-violet-soft text-primary" : "text-muted-foreground hover:bg-accent/40 hover:text-foreground",
                        notIncluded && "opacity-40",
                      )}
                    >
                      <item.icon className="size-4 shrink-0" />
                      <span className="flex-1 truncate">{item.label}</span>
                      <StatusIcon status={st} />
                    </button>
                  );
                })}
              </nav>
              </ScrollArea>
            </div>
            <div className="space-y-2 border-t border-border p-3">
              <Button onClick={savePackage} disabled={saving || !overview} className="w-full gap-2" size="sm">
                {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
                {packageId ? "Saved" : "Save Learning Package"}
              </Button>
              <Button onClick={reset} variant="outline" className="w-full gap-2" size="sm">
                <Plus className="size-3.5" /> New topic
              </Button>
            </div>
          </div>

          {/* Main panel */}
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <div className="flex h-12 shrink-0 items-center gap-2 border-b border-border bg-background/80 px-6 backdrop-blur-xl">
              <span className="text-sm font-medium">{NAV.find((n) => n.id === activeView)?.label}</span>
              {grounded !== undefined && (
                <Badge variant="outline" className={cn("text-[10px]", grounded ? "border-success/40 bg-success-soft text-success" : "border-warning/40 bg-warning-soft text-warning")}>
                  {grounded ? "From your documents" : "General knowledge"}
                </Badge>
              )}
            </div>

            {activeView === "sources" ? (
              <div className="min-h-0 flex-1">
                <SourcePanel sources={sources} />
              </div>
            ) : activeView === "diagram" ? (
              <div className="min-h-0 flex-1 relative">
                <motion.div
                  key={activeView}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute inset-0"
                >
                  <ArtifactBody view={activeView as ArtifactKey} />
                </motion.div>
              </div>
            ) : (
              <div className="min-h-0 flex-1">
                <ScrollArea className="h-full">
                <motion.div
                  key={activeView}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mx-auto max-w-3xl px-8 py-8"
                >
                  {activeView === "overview" ? (
                    overviewStatus === "loading" ? (
                      <Spinner message="Retrieving sources…" />
                    ) : overviewStatus === "error" ? (
                      <ViewState icon={AlertTriangle} message="Failed to generate the overview." />
                    ) : overview ? (
                      <MarkdownRenderer content={overview.markdown} />
                    ) : (
                      <ViewState icon={Sparkles} message="Generating overview…" />
                    )
                  ) : (
                    <ArtifactBody view={activeView as ArtifactKey} />
                  )}
                </motion.div>
                </ScrollArea>
              </div>
            )}
          </div>
        </div>
      );
    }

export function Teach() {
    const phase = useTeachStore((s) => s.phase);
    return phase === "input" ? <InputPhase /> : <WorkspacePhase />;
  }
