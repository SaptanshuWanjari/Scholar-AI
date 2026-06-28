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
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
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
  const weakTopics = weak.map(t => t.topic);

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
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center gap-6 rounded-2xl border border-border bg-card p-6"
      >
        <div className="flex size-24 shrink-0 flex-col items-center justify-center rounded-2xl border border-border bg-background">
          <Trophy className="size-5 text-violet" />
          <span className="mt-1 font-display text-3xl leading-none">
            {pct}%
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <h1>Exam Complete</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            You answered {correct} of {total} correctly.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Stat label="Score" value={`${correct}/${total}`} />
            <Stat label="Percentage" value={`${pct}%`} />
            <Stat label="Difficulty" value={difficultyLabel} />
          </div>
        </div>
        <Button variant="outline" className="gap-2" onClick={onRestart}>
          <RotateCw className="size-4" /> New Exam
        </Button>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Topic Performance
          </h3>
          <div className="space-y-4">
            {topicPerformance.map((t) => (
              <div key={t.topic}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span>{t.topic}</span>
                  <span className="font-medium tabular-nums">{t.score}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${t.score}%` }}
                    transition={{ duration: 0.6 }}
                    className="h-full rounded-full"
                    style={{
                      backgroundColor:
                        t.score >= 70
                          ? "var(--success)"
                          : t.score >= 50
                            ? "var(--warning)"
                            : "var(--danger)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <h3 className="mb-3 mt-7 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Difficulty Analysis
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {difficultyAnalysis.map((d) => (
              <div
                key={d.level}
                className="rounded-xl border border-border bg-background/40 p-3 text-center"
              >
                <div className="font-display text-2xl leading-none">
                  {d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0}%
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {d.level}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {d.correct}/{d.total} correct
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Strong Areas
            </h3>
            <div className="space-y-2">
              {strong.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  No strong areas yet.
                </div>
              )}
              {strong.map((t) => (
                <div key={t.topic} className="flex items-center gap-2 text-sm">
                  <Check className="size-4 text-success" /> {t.topic}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Weak Areas
            </h3>
            <div className="space-y-2">
              {weak.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  No weak areas — great work!
                </div>
              )}
              {weak.map((t) => (
                <div key={t.topic} className="flex items-center gap-2 text-sm">
                  <CircleDot className="size-4 text-danger" /> {t.topic}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-violet/25 bg-violet-soft/40 p-5">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-violet" />
          <h3 className="text-sm font-semibold">
            Recommended Revision for weak topics
          </h3>
        </div>
        <div className="mt-3">
          {recommendedRevisions.length > 0 ? (
            <MarkdownRenderer
              content={recommendedRevisions.map((rev) => `- ${rev}`).join("\n")}
              className="font-sans text-sm text-muted-foreground"
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              {weak.length > 0
                ? `Generate targeted study material for ${weak.map((t) => t.topic).join(", ")}.`
                : "Generate study material to keep your knowledge sharp."}
            </p>
          )}
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          {revisionActions.map((a) => (
            <button
              key={a.label}
              onClick={() => handleRevisionAction(a.label)}
              className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card py-2.5 text-sm font-medium transition-colors hover:border-violet/50 hover:text-violet"
            >
              <a.icon className="size-4" /> {a.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Questions Review
        </h3>
        <div className="space-y-4">
          {review.map((r, i) => (
            <div key={r.id} className="rounded-xl border border-border bg-background/50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Question {i + 1}</span>
                <Badge
                  variant="outline"
                  className={cn("text-[10px]", r.correct ? "border-success/40 bg-success-soft text-success" : "border-danger/40 bg-danger-soft text-danger")}
                >
                  {r.correct ? "Correct" : "Incorrect"}
                </Badge>
              </div>
              <p className="font-reading text-[1.1rem] leading-snug">{r.prompt}</p>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex gap-2">
                  <span className="font-medium text-muted-foreground">Your Answer:</span>
                  <span className={cn(r.correct ? "text-success" : "text-danger")}>{r.given || "—"}</span>
                </div>
                {!r.correct && (
                  <div className="flex gap-2">
                    <span className="font-medium text-muted-foreground">Correct Answer:</span>
                    <span className="text-success">{r.expected}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Page>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background/50 px-3 py-1.5">
      <div className="text-sm font-semibold tabular-nums">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
