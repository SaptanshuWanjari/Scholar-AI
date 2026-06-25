import { useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Milestone,
  Loader2,
  Sparkles,
  NotebookPen,
  Layers,
  ListChecks,
  Network,
  Workflow,
  Notebook,
  Lightbulb,
  Clock,
  ArrowDown,
  Trash2,
  Plus,
  Target,
  TrendingUp,
  Lock,
  Unlock,
} from "lucide-react";
import { motion } from "motion/react";
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
import { Progress } from "../components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Page, SectionTitle } from "../components/Page";
import { MarkdownRenderer } from "../components/MarkdownRenderer";
import { cn } from "../components/ui/utils";
import {
  type LearningPathConcept,
  type LearningPathStage,
  type ConceptStatus,
} from "../lib/api";
import { useLearningPathStore } from "../stores/useLearningPathStore";
import { useConceptActionStore } from "../stores/useConceptActionStore";
import { useTeachStore } from "../stores/useTeachStore";

const SUGGESTIONS = [
  "Operating Systems",
  "Computer Networks",
  "DBMS",
  "Data Structures",
  "Machine Learning",
];

const STATUS_OPTIONS: { value: ConceptStatus; label: string }[] = [
  { value: "not_started", label: "Not Started" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "needs_revision", label: "Needs Revision" },
  { value: "weak_area", label: "Weak Area" },
];

const STATUS_COLOR: Record<ConceptStatus, string> = {
  not_started: "border-border bg-background text-muted-foreground",
  in_progress: "border-primary/40 bg-violet-soft text-primary",
  completed: "border-success/40 bg-success-soft text-success",
  needs_revision: "border-warning/40 bg-warning-soft text-warning",
  weak_area: "border-danger/40 bg-danger-soft text-danger",
};

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy: "border-success/40 bg-success-soft text-success",
  Medium: "border-warning/40 bg-warning-soft text-warning",
  Hard: "border-danger/40 bg-danger-soft text-danger",
};

// Concept-card actions wired to existing generators via useConceptActionStore.
const ACTIONS: { label: string; icon: typeof Sparkles; runLabel: string }[] = [
  { label: "Explain", icon: Sparkles, runLabel: "Explain Concept" },
  { label: "Summary", icon: NotebookPen, runLabel: "Generate Summary" },
  { label: "Flashcards", icon: Layers, runLabel: "Generate Flashcards" },
  { label: "Quiz", icon: ListChecks, runLabel: "Generate Quiz" },
  { label: "Mind Map", icon: Network, runLabel: "Generate Mind Map" },
  { label: "Diagram", icon: Workflow, runLabel: "Generate Diagram" },
  { label: "Notebook", icon: Notebook, runLabel: "Add To Notebook" },
];

function fmtMinutes(min: number): string {
  if (!min) return "—";
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

function stageCompletion(stage: LearningPathStage): number {
  const cs = stage.concepts;
  if (!cs.length) return 0;
  const done = cs.filter((c) => c.status === "completed").length;
  return Math.round((100 * done) / cs.length);
}

function ConceptCard({
  concept,
  pathId,
}: {
  concept: LearningPathConcept;
  pathId: string;
}) {
  const navigate = useNavigate();
  const setConceptStatus = useLearningPathStore((s) => s.setConceptStatus);
  const runAction = useConceptActionStore((s) => s.runAction);
  const running = useConceptActionStore((s) => s.running);
  const runningConceptId = useConceptActionStore((s) => s.runningConceptId);

  const conceptId = `${pathId}:${concept.title}`;
  const busy = runningConceptId === conceptId;

  const openTeach = () => {
    useTeachStore.setState({ topic: concept.title, phase: "input" });
    navigate("/teach");
  };

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-4 transition-colors hover:border-ring/40">
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-medium leading-snug text-foreground">{concept.title}</h4>
        <Badge
          variant="outline"
          className={cn("shrink-0 text-[10px]", DIFFICULTY_COLOR[concept.difficulty] ?? "")}
        >
          {concept.difficulty}
        </Badge>
      </div>

      {concept.summary && (
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{concept.summary}</p>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="size-3" /> {fmtMinutes(concept.estimatedMinutes)}
        </span>
        {concept.prerequisites.length > 0 && (
          <span className="flex items-center gap-1" title={concept.prerequisites.join(", ")}>
            <Lock className="size-3" /> {concept.prerequisites.length} prereq
          </span>
        )}
        {concept.unlocks.length > 0 && (
          <span className="flex items-center gap-1" title={concept.unlocks.join(", ")}>
            <Unlock className="size-3" /> unlocks {concept.unlocks.length}
          </span>
        )}
      </div>

      <div className="mt-3">
        <Select
          value={concept.status}
          onValueChange={(v) => setConceptStatus(concept.title, v as ConceptStatus)}
        >
          <SelectTrigger className={cn("h-8 text-xs", STATUS_COLOR[concept.status])}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value} className="text-xs">
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <button
          onClick={openTeach}
          className="flex items-center gap-1 rounded-md border border-primary/40 bg-violet-soft px-2 py-1 text-[11px] text-primary transition-colors hover:bg-violet-soft/70"
        >
          <Lightbulb className="size-3" /> Teach Me
        </button>
        {ACTIONS.map((a) => (
          <button
            key={a.label}
            disabled={!!running}
            onClick={() => runAction({ name: concept.title }, conceptId, a.runLabel, navigate)}
            className="flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:border-ring/40 hover:text-foreground disabled:opacity-50"
          >
            {busy && running === a.runLabel ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <a.icon className="size-3" />
            )}
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-lg font-semibold text-foreground">{value}</div>
    </div>
  );
}

function InputPhase() {
  const topic = useLearningPathStore((s) => s.topic);
  const course = useLearningPathStore((s) => s.course);
  const document = useLearningPathStore((s) => s.document);
  const courses = useLearningPathStore((s) => s.courses);
  const documents = useLearningPathStore((s) => s.documents);
  const generating = useLearningPathStore((s) => s.generating);
  const saved = useLearningPathStore((s) => s.saved);
  const setField = useLearningPathStore((s) => s.setField);
  const setCourse = useLearningPathStore((s) => s.setCourse);
  const setDocument = useLearningPathStore((s) => s.setDocument);
  const generate = useLearningPathStore((s) => s.generate);
  const loadPath = useLearningPathStore((s) => s.loadPath);
  const deletePath = useLearningPathStore((s) => s.deletePath);

  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="flex flex-col items-center text-center">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-violet-soft text-primary">
          <Milestone className="size-6" />
        </div>
        <h1 className="mt-4 text-2xl font-semibold">Learning Path</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Turn your material into a dependency-ordered roadmap — concepts arranged so you
          learn the foundations before the advanced topics that build on them.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-5">
        <Input
          value={topic}
          onChange={(e) => setField("topic", e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") generate();
          }}
          placeholder="What subject do you want a roadmap for?"
          className="h-11 bg-input-background text-base"
          autoFocus
        />

        <div className="mt-3 flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((ex) => (
            <button
              key={ex}
              onClick={() => setField("topic", ex)}
              className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-ring/40 hover:text-foreground"
            >
              {ex}
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Course
            </div>
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
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Document
            </div>
            <Select
              value={document ?? "all"}
              onValueChange={(v) => setDocument(v === "all" ? null : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All documents" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All documents</SelectItem>
                {(course === "none" ? documents : documents.filter((d) => d.course === course)).map(
                  (d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.title}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={generate} disabled={generating} className="mt-5 h-11 w-full">
          {generating ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Building roadmap…
            </>
          ) : (
            <>
              <Milestone className="size-4" /> Generate learning path
            </>
          )}
        </Button>
      </div>

      {saved.length > 0 && (
        <div className="mt-8">
          <SectionTitle title="Saved paths" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {saved.map((p) => (
              <div
                key={p.id}
                className="group flex items-start justify-between gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-ring/40"
              >
                <button onClick={() => loadPath(p.id)} className="flex-1 text-left">
                  <div className="font-medium text-foreground">{p.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {p.conceptCount} concepts{p.course ? ` · ${p.course}` : ""}
                  </div>
                </button>
                <button
                  onClick={() => deletePath(p.id)}
                  className="rounded-md p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-danger-soft hover:text-danger group-hover:opacity-100"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RoadmapPhase() {
  const navigate = useNavigate();
  const path = useLearningPathStore((s) => s.path)!;
  const reset = useLearningPathStore((s) => s.reset);

  const { overview, stages, progress, analytics, nextRecommendation } = path;
  const orderedConcepts = stages.flatMap((st) => st.concepts);

  const openTeachFor = (title: string) => {
    useTeachStore.setState({ topic: title, phase: "input" });
    navigate("/teach");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-foreground">{path.title}</h1>
          <p className="text-xs text-muted-foreground">
            {path.course || "All courses"}
            {!path.grounded && " · general knowledge (not grounded in your documents)"}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={reset}>
          <Plus className="size-4" /> New path
        </Button>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Difficulty" value={overview.difficulty} />
        <StatCard label="Concepts" value={overview.conceptCount} />
        <StatCard label="Est. Time" value={`${overview.estimatedHours}h`} />
        <StatCard label="Sessions" value={overview.studySessions} />
        <StatCard label="Pace" value={overview.recommendedPace} />
      </div>

      {/* Progress */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">Overall Progress</span>
          <span className="text-muted-foreground">{progress.percent}%</span>
        </div>
        <Progress value={progress.percent} className="h-2" />
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>
            Concepts {progress.conceptsDone} / {progress.conceptsTotal}
          </span>
          <span>
            Study {progress.studyHoursDone} / {progress.studyHoursTotal} h
          </span>
        </div>
      </div>

      {/* Next recommendation */}
      {nextRecommendation && (
        <div className="rounded-xl border border-primary/30 bg-violet-soft/50 p-4">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-primary">
            <Target className="size-3.5" /> Next Recommendation
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-base font-semibold text-foreground">
                {nextRecommendation.conceptTitle}
              </div>
              <div className="text-xs text-muted-foreground">
                {nextRecommendation.reason} · {fmtMinutes(nextRecommendation.estimatedMinutes)}
              </div>
            </div>
            <Button size="sm" onClick={() => openTeachFor(nextRecommendation.conceptTitle)}>
              <Lightbulb className="size-4" /> Start in Teach Me
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_260px]">
        {/* Stages */}
        <div className="space-y-6">
          {stages.map((stage, i) => (
            <div key={i}>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Stage {i + 1} · {stage.title}
                  </h3>
                  {stage.summary && (
                    <p className="text-xs text-muted-foreground">{stage.summary}</p>
                  )}
                </div>
                <Badge variant="outline" className="shrink-0 text-[10px]">
                  {stageCompletion(stage)}%
                </Badge>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {stage.concepts.map((c) => (
                  <ConceptCard key={c.title} concept={c} pathId={path.id} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Side rail: dependency order + analytics */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Learning Order
            </div>
            <div className="flex flex-col">
              {orderedConcepts.map((c, idx) => (
                <div key={c.title} className="flex flex-col items-start">
                  <span
                    className={cn(
                      "rounded-md px-2 py-1 text-xs",
                      c.status === "completed"
                        ? "text-success line-through"
                        : "text-foreground",
                    )}
                  >
                    {c.title}
                  </span>
                  {idx < orderedConcepts.length - 1 && (
                    <ArrowDown className="ml-2 size-3 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <TrendingUp className="size-3.5" /> Analytics
            </div>
            <dl className="space-y-2 text-xs">
              <AnalyticsRow label="Strongest stage" value={analytics.strongestStage} />
              <AnalyticsRow label="Weakest stage" value={analytics.weakestStage} />
              <AnalyticsRow label="Most revised" value={analytics.mostRevisedTopic} />
              <AnalyticsRow label="Highest mistakes" value={analytics.highestMistakeTopic} />
              <AnalyticsRow label="Concepts skipped" value={String(analytics.conceptsSkipped)} />
              <AnalyticsRow
                label="Avg completion"
                value={analytics.avgCompletionMinutes ? fmtMinutes(analytics.avgCompletionMinutes) : null}
              />
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium text-foreground">{value ?? "—"}</dd>
    </div>
  );
}

function ActionResultDialog() {
  const result = useConceptActionStore((s) => s.result);
  const clearResult = useConceptActionStore((s) => s.clearResult);
  return (
    <Dialog open={!!result} onOpenChange={(open) => !open && clearResult()}>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{result?.title}</DialogTitle>
        </DialogHeader>
        {result &&
          (result.mono ? (
            <pre className="whitespace-pre-wrap rounded-lg bg-muted p-3 font-mono text-xs">
              {result.body}
            </pre>
          ) : (
            <MarkdownRenderer content={result.body} />
          ))}
      </DialogContent>
    </Dialog>
  );
}

export function LearningPath() {
  const phase = useLearningPathStore((s) => s.phase);
  const path = useLearningPathStore((s) => s.path);
  const fetchCoursesAndDocs = useLearningPathStore((s) => s.fetchCoursesAndDocs);
  const fetchSaved = useLearningPathStore((s) => s.fetchSaved);

  useEffect(() => {
    fetchCoursesAndDocs();
    fetchSaved();
  }, [fetchCoursesAndDocs, fetchSaved]);

  return (
    <Page>
      {phase === "roadmap" && path ? <RoadmapPhase /> : <InputPhase />}
      <ActionResultDialog />
    </Page>
  );
}
