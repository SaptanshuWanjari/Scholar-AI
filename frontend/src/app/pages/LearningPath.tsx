import { useEffect } from "react";
import { useNavigate } from "react-router";
import { AddToNotebookMenu } from "../components/AddToNotebookMenu";
import { api } from "../lib/api";
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
import {
  PaperButton,
  ChipButton,
  GhostButton,
} from "@paper-ui/components/buttons";
import { PaperInput, PaperSelect } from "@paper-ui/components/inputs";
import type { SelectOption } from "@paper-ui/components/inputs";
import { PaperBadge } from "@paper-ui/components/badges";
import { LearningProgress } from "@paper-ui/components/progress";
import { PaperModal } from "@paper-ui/components/dialogs";
import { PaperCard, SectionHeader, SectionLabel } from "@paper-ui/core";
import { cn } from "@paper-ui/utils";
import { Page } from "../components/Page";
import { MarkdownRenderer } from "../components/MarkdownRenderer";
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

const STATUS_OPTIONS: SelectOption[] = [
  { value: "not_started", label: "Not Started" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "needs_revision", label: "Needs Revision" },
  { value: "weak_area", label: "Weak Area" },
];

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy: "text-[#3f7a4e]",
  Medium: "text-[#a3771f]",
  Hard: "text-[#9f3a36]",
};

const MASTERY_DOT: Record<string, string> = {
  Mastered: "bg-green-500",
  Learning: "bg-amber-400",
  Weak: "bg-red-500",
  "Needs Revision": "bg-orange-400",
};

const ACTIONS: { label: string; icon: typeof Sparkles; runLabel: string; iconClass: string }[] = [
  { label: "Explain", icon: Sparkles, runLabel: "Explain Concept", iconClass: "text-[#6f63a3]" },
  { label: "Summary", icon: NotebookPen, runLabel: "Generate Summary", iconClass: "text-[#3f7a4e]" },
  { label: "Flashcards", icon: Layers, runLabel: "Generate Flashcards", iconClass: "text-[#a3544a]" },
  { label: "Quiz", icon: ListChecks, runLabel: "Generate Quiz", iconClass: "text-[#b07a2e]" },
  { label: "Mind Map", icon: Network, runLabel: "Generate Mind Map", iconClass: "text-[#4a6f91]" },
  { label: "Diagram", icon: Workflow, runLabel: "Generate Diagram", iconClass: "text-[#a3771f]" },
  { label: "Notebook", icon: Notebook, runLabel: "Add To Notebook", iconClass: "text-ink-muted" },
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
  return Math.round((done / cs.length) * 100);
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
    <PaperCard className="p-4 focus-within:z-10">
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-kalam text-[15px] font-bold leading-snug text-ink">
          {concept.title}
        </h4>
        <div className="flex items-center gap-1.5 shrink-0">
          {concept.masteryStatus && concept.masteryStatus !== "Unknown" && (
            <span
              className={cn(
                "size-2 rounded-full",
                MASTERY_DOT[concept.masteryStatus],
              )}
              title={concept.masteryStatus}
            />
          )}
          <span
            className={cn(
              "font-architect text-[11px] font-medium",
              DIFFICULTY_COLOR[concept.difficulty] ?? "",
            )}
          >
            {concept.difficulty}
          </span>
        </div>
      </div>

      {concept.summary && (
        <p className="mt-1 line-clamp-2 font-kalam text-[13px] text-ink-muted">
          {concept.summary}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1.5">
        <PaperBadge tone="sky" className="flex items-center gap-1 font-medium">
          <Clock className="size-3" /> {fmtMinutes(concept.estimatedMinutes)}
        </PaperBadge>
        {concept.prerequisites.length > 0 && (
          <PaperBadge
            tone="brick"
            className="flex items-center gap-1 font-medium cursor-help"
            title={concept.prerequisites.join(", ")}
          >
            <Lock className="size-3" /> {concept.prerequisites.length} prereq
          </PaperBadge>
        )}
        {concept.unlocks.length > 0 && (
          <PaperBadge
            tone="sage"
            className="flex items-center gap-1 font-medium cursor-help"
            title={concept.unlocks.join(", ")}
          >
            <Unlock className="size-3" /> unlocks {concept.unlocks.length}
          </PaperBadge>
        )}
      </div>

      <div className="mt-3">
        <PaperSelect
          value={concept.status}
          onChange={(v) => setConceptStatus(concept.title, v as ConceptStatus)}
          options={STATUS_OPTIONS}
          className="h-8"
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <GhostButton onClick={openTeach} size="sm">
          <Lightbulb className="size-3 text-[#b07a2e]" /> Teach Me
        </GhostButton>
        {concept.depConceptId != null && (
          <GhostButton
            size="sm"
            onClick={() =>
              navigate(`/knowledge-base?conceptId=${concept.depConceptId}`)
            }
          >
            <Network className="size-3 text-[#4a6f91]" /> Graph
          </GhostButton>
        )}
        {ACTIONS.map((a) => {
          const isNotebook = a.label === "Notebook";
          const isSummary = a.label === "Summary";
          const isExplain = a.label === "Explain";

          const btn = (
            <GhostButton
              key={a.label}
              size="sm"
              disabled={!!running}
              onClick={
                !isNotebook && !isSummary && !isExplain
                  ? () =>
                    runAction(
                      { name: concept.title },
                      conceptId,
                      a.runLabel,
                      navigate,
                    )
                  : undefined
              }
            >
              {busy && running === a.runLabel ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <a.icon className={cn("size-3", a.iconClass)} />
              )}
              {a.label}
            </GhostButton>
          );

          if (isNotebook || isExplain) {
            return (
              <AddToNotebookMenu
                key={a.label}
                trigger={btn}
                asyncBackground
                backgroundTitle={`Explanation for ${concept.title}`}
                customBlocks={async () => {
                  const ex = await api.ask(
                    `Explain the concept: ${concept.title}`,
                  );
                  return [
                    { type: "heading", level: 1, text: concept.title },
                    {
                      type: "ai-answer",
                      question: `Explain ${concept.title}`,
                      answer: ex.content,
                      confidence: 1,
                      sources: 0,
                    },
                  ];
                }}
              />
            );
          } else if (isSummary) {
            return (
              <AddToNotebookMenu
                key={a.label}
                trigger={btn}
                asyncBackground
                backgroundTitle={`Summary for ${concept.title}`}
                customBlocks={async () => {
                  const r = await api.generateRevision({
                    topic: concept.title,
                    format: "summary",
                  });
                  return [
                    {
                      type: "heading",
                      level: 2,
                      text: `Summary: ${concept.title}`,
                    },
                    { type: "text", text: r.markdown },
                  ];
                }}
              />
            );
          }
          return btn;
        })}
      </div>
    </PaperCard>
  );
}

const STAT_COLORS: Record<string, string> = {
  "Difficulty": "text-[#a3544a]", // brick
  "Concepts": "text-[#4a6f91]",   // sky
  "Est. Time": "text-[#3f7a4e]",  // sage
  "Sessions": "text-[#6f63a3]",   // lavender
  "Pace": "text-[#b07a2e]",       // ochre
};

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <PaperCard className="px-4 py-3">
      <SectionLabel className="text-[11px]">{label}</SectionLabel>
      <div className={cn("mt-1 font-caveat text-xl font-bold", STAT_COLORS[label] || "text-ink")}>{value}</div>
    </PaperCard>
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
        <h1 className="mt-4 font-caveat text-[38px] font-bold text-ink">
          Learning Path
        </h1>
        <p className="mt-1 max-w-lg font-kalam text-[14px] text-ink-muted">
          Turn your material into a dependency-ordered roadmap — concepts
          arranged so you learn the foundations before the advanced topics that
          build on them.
        </p>
      </div>

      <PaperCard className="mt-8 p-5 z-10">
        <PaperInput
          value={topic}
          onChange={(e) => setField("topic", e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") generate();
          }}
          placeholder="What subject do you want a roadmap for?"
          className="h-11"
          autoFocus
        />

        <div className="mt-3 flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((ex) => (
            <ChipButton key={ex} onClick={() => setField("topic", ex)}>
              {ex}
            </ChipButton>
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <SectionLabel className="mb-2 block">Course</SectionLabel>
            <PaperSelect
              value={course}
              onChange={setCourse}
              options={[
                { value: "none", label: "All courses" },
                ...courses.map((c) => ({ value: c.name, label: c.name })),
              ]}
              placeholder="All courses"
            />
          </div>

          <div className="flex-1">
            <SectionLabel className="mb-2 block">Document</SectionLabel>
            <PaperSelect
              value={document ?? "all"}
              onChange={(v) => setDocument(v === "all" ? null : v)}
              options={[
                { value: "all", label: "All documents" },
                ...(course === "none"
                  ? documents
                  : documents.filter((d) => d.course === course)
                ).map((d) => ({ value: d.id, label: d.title })),
              ]}
              placeholder="All documents"
            />
          </div>
        </div>

        <PaperButton
          onClick={generate}
          disabled={generating}
          tone="dark"
          size="lg"
          className="mt-5 w-full text-lg py-4"
        >
          {generating ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Building roadmap…
            </>
          ) : (
            <>
              <Milestone className="size-4" /> Generate learning path
            </>
          )}
        </PaperButton>
      </PaperCard>

      {saved.length > 0 && (
        <div className="mt-8">
          <SectionHeader title="Saved paths" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {saved.map((p) => (
              <PaperCard key={p.id} className="group p-4">
                <div className="flex w-full items-center justify-between gap-3">
                  <button
                    onClick={() => loadPath(p.id)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <div className="font-kalam text-[15px] font-bold text-ink">
                      {p.title}
                    </div>
                    <div className="mt-1 font-architect text-[12px] text-ink-muted">
                      {p.conceptCount} concepts{p.course ? ` · ${p.course}` : ""}
                    </div>
                  </button>

                  <button
                    onClick={() => deletePath(p.id)}
                    className="shrink-0 rounded-md p-1.5 text-ink-muted opacity-0 transition-opacity hover:bg-[rgba(159,58,54,0.1)] hover:text-[#9f3a36] group-hover:opacity-100"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </PaperCard>
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
          <h1 className="font-caveat text-[28px] font-semibold text-ink">
            {path.title}
          </h1>
          <p className="font-architect text-[12px] text-ink-muted">
            {path.course || "All courses"}
            {!path.grounded &&
              " · general knowledge (not grounded in your documents)"}
          </p>
        </div>
        <PaperButton size="sm" onClick={reset} tone="paper">
          <Plus className="size-4" /> New path
        </PaperButton>
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
      <PaperCard className="p-4">
        <LearningProgress
          value={progress.percent}
          label="Overall Progress"
          done={`Concepts ${progress.conceptsDone} / ${progress.conceptsTotal}`}
          total={`Study ${progress.studyHoursDone} / ${progress.studyHoursTotal} h`}
        />
      </PaperCard>

      {/* Next recommendation */}
      {nextRecommendation && (
        <PaperCard className="p-4" surface="#f5f0ea">
          <div className="flex items-center gap-2 font-architect text-[12px] font-medium uppercase tracking-wide text-[#6f63a3]">
            <Target className="size-3.5" /> Next Recommendation
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-kalam text-[17px] font-bold leading-snug text-ink">
                {nextRecommendation.conceptTitle}
              </div>
              <div className="font-architect text-[12px] text-ink-muted">
                {nextRecommendation.reason} ·{" "}
                {fmtMinutes(nextRecommendation.estimatedMinutes)}
              </div>
            </div>
            <PaperButton
              size="sm"
              tone="dark"
              onClick={() => openTeachFor(nextRecommendation.conceptTitle)}
            >
              <Lightbulb className="size-4" /> Start in Teach Me
            </PaperButton>
          </div>
        </PaperCard>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_260px]">
        {/* Stages */}
        <div className="space-y-6">
          {stages.map((stage, i) => (
            <div key={i}>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-kalam text-[17px] font-bold text-ink">
                    <span className="text-[#a3544a]">Stage {i + 1}</span> · {stage.title}
                  </h3>
                  {stage.summary && (
                    <p className="font-kalam text-[13px] text-ink-muted">
                      {stage.summary}
                    </p>
                  )}
                </div>
                <PaperBadge tone={stageCompletion(stage) === 100 ? "sage" : (stageCompletion(stage) > 0 ? "sky" : "ink")} className="text-[10px] px-2 py-0.5">
                  {stageCompletion(stage)}%
                </PaperBadge>
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
        <div className="space-y-6 lg:sticky lg:top-6 self-start">
          <PaperCard className="p-4">
            <SectionLabel>Learning Order</SectionLabel>
            <div className="mt-3 flex flex-col">
              {orderedConcepts.map((c, idx) => (
                <div key={c.title} className="flex flex-col items-start">
                  <span
                    className={cn(
                      "rounded-md px-2 py-1 font-architect text-[13px] transition-colors",
                      c.status === "completed"
                        ? "text-[#3f7a4e] line-through bg-[#e7efe4]"
                        : "text-ink hover:bg-black/5",
                    )}
                  >
                    {c.title}
                  </span>
                  {idx < orderedConcepts.length - 1 && (
                    <ArrowDown className="ml-2 size-3 text-ink-muted" />
                  )}
                </div>
              ))}
            </div>
          </PaperCard>

          <PaperCard className="p-4">
            <div className="mb-3 flex items-center gap-1.5 font-architect text-[12px] font-medium uppercase tracking-wide text-ink-muted">
              <TrendingUp className="size-3.5" /> Analytics
            </div>
            <dl className="space-y-2 font-architect text-[12px]">
              <AnalyticsRow
                label="Strongest stage"
                value={analytics.strongestStage}
                valueColor="text-[#3f7a4e]"
              />
              <AnalyticsRow
                label="Weakest stage"
                value={analytics.weakestStage}
                valueColor="text-[#a3544a]"
              />
              <AnalyticsRow
                label="Most revised"
                value={analytics.mostRevisedTopic}
              />
              <AnalyticsRow
                label="Highest mistakes"
                value={analytics.highestMistakeTopic}
              />
              <AnalyticsRow
                label="Concepts skipped"
                value={String(analytics.conceptsSkipped)}
              />
              <AnalyticsRow
                label="Avg completion"
                value={
                  analytics.avgCompletionMinutes
                    ? fmtMinutes(analytics.avgCompletionMinutes)
                    : null
                }
              />
            </dl>
          </PaperCard>
        </div>
      </div>
    </div>
  );
}

function AnalyticsRow({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string | null;
  valueColor?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="text-ink-muted">{label}</dt>
      <dd className={cn("text-right font-medium", valueColor || "text-ink")}>{value ?? "—"}</dd>
    </div>
  );
}

function ActionResultDialog() {
  const result = useConceptActionStore((s) => s.result);
  const clearResult = useConceptActionStore((s) => s.clearResult);
  return (
    <PaperModal
      open={!!result}
      onClose={clearResult}
      title={result?.title}
      width={640}
      className="max-h-[80vh] overflow-y-auto"
    >
      {result &&
        (result.mono ? (
          <pre className="whitespace-pre-wrap rounded-lg bg-muted p-3 font-mono text-xs">
            {result.body}
          </pre>
        ) : (
          <MarkdownRenderer content={result.body} />
        ))}
    </PaperModal>
  );
}

export function LearningPath() {
  const phase = useLearningPathStore((s) => s.phase);
  const path = useLearningPathStore((s) => s.path);
  const fetchCoursesAndDocs = useLearningPathStore(
    (s) => s.fetchCoursesAndDocs,
  );
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
