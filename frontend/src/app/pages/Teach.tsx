import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
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
  ShieldCheck,
  Star,
  FolderOpen,
  ChevronLeft,
  PauseCircle,
  PenLine,
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
import { ConsistencyReport } from "../components/ConsistencyReport";
import { cn } from "../components/ui/utils";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
} from "../components/ui/alert-dialog";
import { api, type PackageMeta, type FlashcardSet, type GeneratedQuiz, type GeneratedDiagram, type GeneratedMindmap, type GeneratedRevision, type ReadinessMissing } from "../lib/api";
import type { GeneratedDifference, Flashcard, QuizQuestion } from "../lib/types";
import {
  useTeachStore,
  ARTIFACT_KEYS,
  type ArtifactKey,
  type Depth,
  type ViewKey,
  type SlotStatus,
} from "../stores/useTeachStore";

function StarRating({ stars }: { stars: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "size-2.5",
            i < stars ? "fill-amber-400 text-amber-400" : "fill-muted text-muted-foreground/30",
          )}
        />
      ))}
    </span>
  );
}

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
  { id: "consistency", label: "Consistency", icon: ShieldCheck },
];

// ---------------------------------------------------------------------------
// Input phase
// ---------------------------------------------------------------------------

function InputPhase() {
  const {
    topic, depth, course, document, courses, documents, selected,
    recommendations, recommendationsLoading,
    setField, setCourse, setDocument, toggleArtifact,
    fetchRecommendations, applyRecommendations, selectAll, clearSelection,
    startGenerate, loadPackage, fetchCoursesAndDocs,
  } = useTeachStore();
  const [packages, setPackages] = useState<PackageMeta[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>(EXAMPLES);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  // Dependency readiness gate — surfaced before generating if prerequisites
  // for the chosen topic aren't mastered yet.
  const [gate, setGate] = useState<ReadinessMissing[] | null>(null);
  const [checking, setChecking] = useState(false);

  // Check prerequisite mastery before generating. If unmet, open the gate
  // modal; otherwise generate immediately. Failures fall through to generate.
  const handleGenerate = async () => {
    if (!topic.trim()) return startGenerate();
    setChecking(true);
    try {
      const r = await api.checkReadiness(topic.trim(), course === "none" ? null : course);
      if (!r.ready && r.missing.length) {
        setGate(r.missing);
        return;
      }
    } catch {
      /* readiness is best-effort — never block generation on it */
    } finally {
      setChecking(false);
    }
    startGenerate();
  };

  const generateAnyway = () => {
    setGate(null);
    startGenerate();
  };

  const studyPrerequisiteFirst = () => {
    const first = gate?.[0];
    setGate(null);
    if (first) {
      setField("topic", first.name);
      startGenerate();
    }
  };

  useEffect(() => {
    let cancelled = false;
    fetchCoursesAndDocs();
    api.listPackages().then((p) => { if (!cancelled) setPackages(p); }).catch(() => { });
    api.onboardingAnalysis().then((a) => {
      if (!cancelled) {
        const generated = [...(a.topics || []), ...(a.concepts || [])];
        if (generated.length > 0) {
          const unique = Array.from(new Set(generated)).slice(0, 6);
          setSuggestions(unique);
        }
      }
    }).catch(() => { });

    // Auto-load a package passed via ?package=<id> (e.g. from Courses page)
    const autoId = searchParams.get("package");
    if (autoId && !cancelled) {
      void loadPackage(autoId).then(() => {
        if (!cancelled) setSearchParams({}, { replace: true });
      });
    }

    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTopicChange = (value: string) => {
    setField("topic", value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length >= 3) {
      debounceRef.current = setTimeout(() => {
        void fetchRecommendations(value.trim());
      }, 800);
    }
  };

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
              data-tour="teach-input"
              value={topic}
              onChange={(e) => handleTopicChange(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") void handleGenerate(); }}
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
            <div className="mt-5" data-tour="teach-artifacts">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Artifacts
                  {recommendationsLoading && (
                    <Loader2 className="ml-1.5 inline size-3 animate-spin text-muted-foreground" />
                  )}
                </div>
                <div className="flex gap-1">
                  {recommendations && (
                    <button
                      onClick={applyRecommendations}
                      className="rounded px-2 py-0.5 text-xs text-primary transition-colors hover:bg-violet-soft/60"
                    >
                      Use Recommended
                    </button>
                  )}
                  <button
                    onClick={selectAll}
                    className="rounded px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    All
                  </button>
                  <button
                    onClick={clearSelection}
                    className="rounded px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    None
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {ARTIFACT_KEYS.map((key) => {
                  const rec = recommendations?.[key];
                  return (
                    <button
                      key={key}
                      onClick={() => toggleArtifact(key)}
                      className={cn(
                        "flex flex-col gap-1 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                        selected[key] ? "border-primary/50 bg-violet-soft/60" : "border-border bg-background text-muted-foreground hover:border-ring/40",
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <span className={cn("flex size-4 shrink-0 items-center justify-center rounded border", selected[key] ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40")}>
                          {selected[key] && <CheckCircle2 className="size-3" />}
                        </span>
                        {ARTIFACT_LABELS[key]}
                      </span>
                      {rec && (
                        <span className="flex flex-col gap-0.5 pl-6">
                          <StarRating stars={rec.stars} />
                          <span className="line-clamp-2 text-[10px] leading-tight text-muted-foreground">{rec.reason}</span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <Button data-tour="teach-generate" onClick={handleGenerate} disabled={checking} className="mt-6 w-full gap-2">
              {checking ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              {checking ? "Checking prerequisites…" : "Generate learning package"}
            </Button>
          </div>

          {/* Dependency readiness gate */}
          <AlertDialog open={!!gate} onOpenChange={(o) => !o && setGate(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>This topic depends on concepts you haven't mastered</AlertDialogTitle>
                <AlertDialogDescription>
                  Studying these prerequisites first will make <span className="font-medium text-foreground">{topic}</span> easier to understand.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="space-y-1.5">
                {(gate ?? []).map((m) => (
                  <div key={m.id} className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2">
                    <span className="text-sm">{m.name}</span>
                    <Badge variant="outline" className="text-[10px]">{m.masteryStatus}</Badge>
                  </div>
                ))}
              </div>
              <AlertDialogFooter>
                <Button variant="outline" onClick={generateAnyway}>Generate anyway</Button>
                <Button onClick={studyPrerequisiteFirst} className="gap-1.5">
                  <GraduationCap className="size-4" /> Study {gate?.[0]?.name ?? "prerequisite"} first
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

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

function StatusIcon({ status, paused }: { status: SlotStatus; paused?: boolean }) {
      switch (status) {
        case "loading":
          return <Loader2 className="size-3.5 shrink-0 animate-spin text-primary" />;
        case "done":
          return <CheckCircle2 className="size-3.5 shrink-0 text-success" />;
        case "error":
          return <AlertTriangle className="size-3.5 shrink-0 text-danger" />;
        case "queued":
          return paused
            ? <PauseCircle className="size-3.5 shrink-0 text-amber-500/70" />
            : <Clock className="size-3.5 shrink-0 text-muted-foreground/60" />;
        default:
          return null;
      }
    }

function ConsistencyView() {
      const report = useTeachStore((s) => s.consistency);
      const status = useTeachStore((s) => s.consistencyStatus);
      const generating = useTeachStore((s) => s.generating);
      const runConsistency = useTeachStore((s) => s.runConsistency);

      return (
        <div className="space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-medium text-foreground">Cross-artifact consistency</h2>
              <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                Check that every artifact covers the same concepts as the source material.
                Detects missing, weak and under-represented concepts. Analysis only — nothing
                is regenerated.
              </p>
            </div>
            <Button
              size="sm"
              className="shrink-0 gap-2"
              disabled={generating || status === "loading"}
              onClick={() => void runConsistency()}
            >
              {status === "loading" ? <Loader2 className="size-3.5 animate-spin" /> : <ShieldCheck className="size-3.5" />}
              {report ? "Re-analyze" : "Analyze"}
            </Button>
          </div>

          {status === "loading" ? (
            <Spinner message="Extracting concepts and comparing artifacts…" />
          ) : status === "error" ? (
            <ViewState icon={AlertTriangle} message="Failed to analyze consistency. Try again." />
          ) : report ? (
            <ConsistencyReport report={report} />
          ) : (
            <ViewState icon={ShieldCheck} message="Run an analysis to see concept coverage across your artifacts." />
          )}
        </div>
      );
    }

function WorkspacePhase() {
      const {
        topic, activeView, overview, overviewStatus, sources, packageId, pkgCourse, saving,
        artifacts, selected, generating, currentTask, consistencyStatus, openView, savePackage, reset,
        isPaused, approvedNotes, setApprovedNotes, approveAndResume,
      } = useTeachStore();
      const navigate = useNavigate();

      const grounded = overview?.grounded;

      // Status per nav item: overview/artifacts have real status; Sources rides on
      // the overview (its chunks come back with the overview).
      const statusFor = (view: ViewKey): SlotStatus => {
        if (view === "overview" || view === "sources") return overviewStatus;
        if (view === "consistency") return consistencyStatus;
        return artifacts[view as ArtifactKey].status;
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
                  ) : isPaused ? (
                    <span className="flex items-center gap-1.5 text-amber-500">
                      <PauseCircle className="size-3" />
                      Awaiting your review
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
                      <StatusIcon status={st} paused={isPaused && st === "queued"} />
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
              {pkgCourse && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full gap-2 text-muted-foreground"
                  onClick={() => navigate(`/courses?name=${encodeURIComponent(pkgCourse)}`)}
                >
                  <FolderOpen className="size-3.5" />
                  <ChevronLeft className="size-3 -mr-1" />
                  <span className="truncate">{pkgCourse}</span>
                </Button>
              )}
            </div>
          </div>

          {/* Main panel */}
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <div className="flex h-12 shrink-0 items-center gap-2 border-b border-border bg-background/80 px-6 backdrop-blur-xl">
              <span className="text-sm font-medium">{NAV.find((n) => n.id === activeView)?.label}</span>
              {isPaused && activeView === "notes" && (
                <Badge variant="outline" className="gap-1 border-amber-400/40 bg-amber-50/60 text-[10px] text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
                  <PenLine className="size-2.5" /> Draft — editable
                </Badge>
              )}
              {grounded !== undefined && activeView !== "notes" && (
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
            ) : activeView === "notes" && isPaused ? (
              /* HITL draft editor: student reviews and edits before artifact generation */
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="border-b border-amber-200/60 bg-amber-50/50 px-6 py-2.5 dark:border-amber-800/30 dark:bg-amber-900/10">
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    Review and edit the AI-generated notes below, then click <strong>Approve &amp; Generate Study Tools</strong> to create your flashcards, quiz, and more based on this content.
                  </p>
                </div>
                <div className="min-h-0 flex-1 p-6">
                  <textarea
                    className="h-full w-full resize-none rounded-lg border border-border bg-background p-4 font-mono text-sm leading-relaxed text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                    value={approvedNotes}
                    onChange={(e) => setApprovedNotes(e.target.value)}
                    placeholder="Your draft notes will appear here…"
                    spellCheck={false}
                  />
                </div>
                <div className="flex shrink-0 items-center justify-between gap-4 border-t border-border bg-background/90 px-6 py-3 backdrop-blur-sm">
                  <p className="text-sm text-muted-foreground">
                    <PauseCircle className="mr-1 inline size-3.5 text-amber-500" />
                    Flashcards, Quiz, Mind Map and Diagram are <strong>paused</strong> until you approve.
                  </p>
                  <Button
                    onClick={() => void approveAndResume()}
                    disabled={generating || !approvedNotes.trim()}
                    className="gap-2"
                  >
                    {generating ? <Loader2 className="size-3.5 animate-spin" /> : <CheckCircle2 className="size-3.5" />}
                    Approve &amp; Generate Study Tools
                  </Button>
                </div>
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
                      <Spinner message="Generating draft notes…" />
                    ) : overviewStatus === "error" ? (
                      <ViewState icon={AlertTriangle} message="Failed to generate the overview." />
                    ) : overview ? (
                      <MarkdownRenderer content={overview.markdown} />
                    ) : (
                      <ViewState icon={Sparkles} message="Generating overview…" />
                    )
                  ) : activeView === "consistency" ? (
                    <ConsistencyView />
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
