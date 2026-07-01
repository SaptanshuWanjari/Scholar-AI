import { useNavigate } from "react-router";
import {
  Trophy,
  RotateCw,
  Check,
  CircleDot,
  Sparkles,
  Network,
  NotebookPen,
  Layers3,
  ListChecks,
} from "lucide-react";
import { motion } from "motion/react";
import { MarkdownRenderer } from "../../components/MarkdownRenderer";
import { cn } from "../../components/ui/utils";
import { PaperButton, GhostButton } from "@paper-ui/components/buttons";
import { PaperBadge } from "@paper-ui/components/badges";
import {
  PaperCard,
  PaperPanel,
  PaperH1,
  PaperH3,
  PaperIconCircle,
  SectionLabel,
} from "@paper-ui/core";
import { SketchDivider } from "@paper-ui/components/decorations";
import { SketchProgress } from "@paper-ui/components/progress";
import { Page } from "../../components/Page";
import type { ExamResult } from "../../lib/api";
import { useExamStore } from "../../stores/useExamStore";
import { useFlashcardGenStore } from "../../stores/useFlashcardGenStore";
import { useQuizStore } from "../../stores/useQuizStore";
import { useRevisionStore } from "../../stores/useRevisionStore";
import { useMindmapStore } from "../../stores/useMindmapStore";

export function ExamResults() {
  const result = useExamStore((s) => s.result) as ExamResult;
  const difficultyLabel = useExamStore((s) => s.difficultyLabel);
  const onRestart = useExamStore((s) => s.reset);

  const { score, correct, total, topicPerformance, difficultyAnalysis, review = [], recommendedRevisions = [] } =
    result;
  const pct = Math.round(score);

  const weak = topicPerformance.filter((t) => t.score < 70);
  const strong = topicPerformance.filter((t) => t.score >= 70);

  const navigate = useNavigate();
  const examCourse = useExamStore((s) => s.course);
  const weakTopics = weak.map((t) => t.topic);

  const handleRevisionAction = (label: string) => {
    const combinedTopic = weakTopics.join(", ") || "General Revision";
    if (label === "Study Sheet") {
      useRevisionStore.getState().setField("topic", combinedTopic);
      useRevisionStore.getState().setField("course", examCourse);
      navigate("/revision");
    } else if (label === "Flashcards") {
      useFlashcardGenStore.getState().setField("topic", combinedTopic);
      useFlashcardGenStore.getState().setField("course", examCourse);
      navigate("/flashcards");
    } else if (label === "Quiz") {
      useQuizStore.getState().setField("topic", combinedTopic);
      useQuizStore.getState().setField("course", examCourse);
      navigate("/quiz");
    } else if (label === "Mind Map") {
      useMindmapStore.getState().setField("topic", combinedTopic);
      useMindmapStore.getState().setField("course", examCourse);
      navigate("/mindmaps");
    }
  };

  const revisionActions = [
    { label: "Study Sheet", icon: NotebookPen },
    { label: "Flashcards", icon: Layers3 },
    { label: "Quiz", icon: ListChecks },
    { label: "Mind Map", icon: Network },
  ];

  return (
    <Page className="max-w-4xl space-y-6">
      {/* Score header card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <PaperCard className="p-6">
          <div className="flex flex-wrap items-center gap-6">
            <div className="relative flex size-24 shrink-0 flex-col items-center justify-center">
              <PaperIconCircle tone="lavender" size={96}>
                <div className="flex flex-col items-center">
                  <Trophy className="size-5 text-primary" />
                  <span className="mt-1 font-architect text-2xl leading-none text-ink">
                    {pct}%
                  </span>
                </div>
              </PaperIconCircle>
            </div>
            <div className="min-w-0 flex-1">
              <PaperH1 className="text-3xl">Exam Complete</PaperH1>
              <p className="mt-1 font-kalam text-sm text-ink-muted">
                You answered {correct} of {total} correctly.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Stat label="Score" value={`${correct}/${total}`} />
                <Stat label="Percentage" value={`${pct}%`} />
                <Stat label="Difficulty" value={difficultyLabel} />
              </div>
            </div>
            <PaperButton tone="paper" className="gap-2 shrink-0" onClick={onRestart}>
              <RotateCw className="size-4" /> New Exam
            </PaperButton>
          </div>
        </PaperCard>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Topic performance + difficulty */}
        <PaperCard className="p-5 lg:col-span-2">
          <SectionLabel className="text-[12px]">Topic Performance</SectionLabel>

          <SketchDivider variant="dashed" className="my-3 opacity-40" />

          <div className="space-y-4">
            {topicPerformance.map((t) => (
              <div key={t.topic}>
                <div className="mb-1.5 flex items-center justify-between font-architect text-sm">
                  <span className="text-ink">{t.topic}</span>
                  <span className="font-medium tabular-nums text-ink-muted">{t.score}%</span>
                </div>
                <SketchProgress
                  value={t.score}
                  height={12}
                  color={
                    t.score >= 70
                      ? "var(--color-success, #5f8f5a)"
                      : t.score >= 50
                        ? "var(--color-warning, #c9954f)"
                        : "var(--color-danger, #a3544a)"
                  }
                />
              </div>
            ))}
          </div>

          <SketchDivider variant="wavy" className="my-5" />

          <SectionLabel className="text-[12px]">Difficulty Analysis</SectionLabel>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {difficultyAnalysis.map((d) => (
              <PaperPanel key={d.level} className="p-3 text-center">
                <div className="font-architect text-2xl leading-none text-ink">
                  {d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0}%
                </div>
                <div className="mt-1 font-kalam text-xs text-ink-muted">
                  {d.level}
                </div>
                <div className="font-kalam text-[11px] text-ink-muted/70">
                  {d.correct}/{d.total} correct
                </div>
              </PaperPanel>
            ))}
          </div>
        </PaperCard>

        {/* Strong / Weak */}
        <div className="space-y-4">
          <PaperCard className="p-5">
            <SectionLabel className="text-[12px]">Strong Areas</SectionLabel>
            <SketchDivider variant="dashed" className="my-2 opacity-40" />
            <div className="space-y-2 mt-2">
              {strong.length === 0 && (
                <p className="font-kalam text-sm text-ink-muted">No strong areas yet.</p>
              )}
              {strong.map((t) => (
                <div key={t.topic} className="flex items-center gap-2 font-architect text-sm text-ink">
                  <Check className="size-4 text-success shrink-0" /> {t.topic}
                </div>
              ))}
            </div>
          </PaperCard>

          <PaperCard className="p-5">
            <SectionLabel className="text-[12px]">Weak Areas</SectionLabel>
            <SketchDivider variant="dashed" className="my-2 opacity-40" />
            <div className="space-y-2 mt-2">
              {weak.length === 0 && (
                <p className="font-kalam text-sm text-ink-muted">No weak areas — great work!</p>
              )}
              {weak.map((t) => (
                <div key={t.topic} className="flex items-center gap-2 font-architect text-sm text-ink">
                  <CircleDot className="size-4 text-danger shrink-0" /> {t.topic}
                </div>
              ))}
            </div>
          </PaperCard>
        </div>
      </div>

      {/* Recommended revision */}
      <PaperCard className="p-5" surface="var(--color-lavender-soft, #f0eeff)">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="size-4 text-primary" />
          <PaperH3 className="text-[15px]">Recommended Revision for weak topics</PaperH3>
        </div>
        {recommendedRevisions.length > 0 ? (
          <MarkdownRenderer
            content={recommendedRevisions.map((rev) => `- ${rev}`).join("\n")}
            className="font-kalam text-sm text-ink-muted"
          />
        ) : (
          <p className="font-kalam text-sm text-ink-muted">
            {weak.length > 0
              ? `Generate targeted study material for ${weak.map((t) => t.topic).join(", ")}.`
              : "Generate study material to keep your knowledge sharp."}
          </p>
        )}

        <SketchDivider variant="dashed" className="my-4 opacity-40" />

        <div className="grid gap-2 sm:grid-cols-4">
          {revisionActions.map((a) => (
            <GhostButton
              key={a.label}
              onClick={() => handleRevisionAction(a.label)}
              size="sm"
              className="flex items-center justify-center gap-2 py-2.5"
            >
              <a.icon className="size-4" /> {a.label}
            </GhostButton>
          ))}
        </div>
      </PaperCard>

      {/* Questions review */}
      <PaperCard className="p-5">
        <SectionLabel className="text-[12px]">Questions Review</SectionLabel>
        <SketchDivider variant="dashed" className="my-3 opacity-40" />
        <div className="space-y-4">
          {review.map((r, i) => (
            <PaperPanel key={r.id} className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-architect text-sm text-ink-muted">Question {i + 1}</span>
                <PaperBadge
                  tone={r.correct ? "sage" : "brick"}
                  className="text-[10px]"
                >
                  {r.correct ? "Correct" : "Incorrect"}
                </PaperBadge>
              </div>
              <p className="font-reading text-[1.1rem] leading-snug text-ink">{r.prompt}</p>
              <SketchDivider variant="dashed" className="my-2 opacity-30" />
              <div className="space-y-1.5 font-architect text-sm">
                <div className="flex gap-2">
                  <span className="text-ink-muted">Your Answer:</span>
                  <span className={cn(r.correct ? "text-success" : "text-danger")}>
                    {r.given || "—"}
                  </span>
                </div>
                {!r.correct && (
                  <div className="flex gap-2">
                    <span className="text-ink-muted">Correct Answer:</span>
                    <span className="text-success">{r.expected}</span>
                  </div>
                )}
              </div>
            </PaperPanel>
          ))}
        </div>
      </PaperCard>
    </Page>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <PaperPanel className="px-3 py-1.5">
      <div className="font-architect text-sm font-semibold tabular-nums text-ink">{value}</div>
      <div className="font-kalam text-[10px] uppercase tracking-wider text-ink-muted">
        {label}
      </div>
    </PaperPanel>
  );
}
