import { useEffect, useRef, useState } from "react";
import {
  ListChecks,
  Play,
  ChevronRight,
  Check,
  X,
  RotateCw,
  Trophy,
  Settings2,
  Loader2,
  Save,
  Trash2,
  Clock,
  Sparkles,
  BookPlus,
} from "lucide-react";
import { GenerationSteps } from "../components/GenerationSteps";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "@/app/lib/toast";
import { Page } from "../components/Page";
import QualityBadge from "../components/QualityBadge";
import { AddToNotebookMenu } from "../components/AddToNotebookMenu";
import { PaperButton, GhostButton, ChipButton } from "@/paper-ui/components/buttons";
import { DifficultyBadge, PaperBadge } from "@/paper-ui/components/badges";
import { SketchProgress } from "@/paper-ui/components/progress";
import { PaperInput, PaperTextarea, PaperSelect } from "@/paper-ui/components/inputs";
import { EmptyState } from "@/paper-ui/components/feedback";
import { PaperPanel, SketchBorder } from "@/paper-ui/core";
import { api } from "../lib/api";
import type { Quiz, QuizQuestion, Course, DocumentItem } from "../lib/types";
import { cn } from "../components/ui/utils";
import { useQuizStore } from "../stores/useQuizStore";
import type { Difficulty } from "../stores/useQuizStore";

const difficulties: Difficulty[] = ["Easy", "Medium", "Hard"];

export function QuizPage() {
  // Flow state lives in the store so it survives page navigation.
  const stage = useQuizStore((s) => s.stage);
  const active = useQuizStore((s) => s.active);
  const answers = useQuizStore((s) => s.answers);
  const start = useQuizStore((s) => s.start);
  const submit = useQuizStore((s) => s.submit);
  const backToBuilder = useQuizStore((s) => s.backToBuilder);

  const restoreSession = useQuizStore((s) => s.restoreSession);
  const [pendingRestore, setPendingRestore] = useState<Quiz | null>(null);

  // Page-only ephemeral data that's cheap to refetch stays local.
  const [saved, setSaved] = useState<Quiz[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [saving, setSaving] = useState(false);

  const refreshSaved = () =>
    api
      .listSavedQuizzes()
      .then(setSaved)
      .catch(() => setSaved([]))
      .finally(() => setLoadingSaved(false));

  useEffect(() => {
    refreshSaved();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveQuiz = async (quiz: Quiz) => {
    if (saving) return;
    setSaving(true);
    try {
      const saved = await api.saveQuiz({
        title: quiz.title,
        course: quiz.course && quiz.course !== "all" ? quiz.course : null,
        difficulty: quiz.difficulty,
        questions: quiz.questions,
        quality: quiz.quality,
      });
      if (Object.keys(answers).length > 0) {
        api.submitQuiz(saved.id, answers).catch(() => {});
      }
      await refreshSaved();
      toast.success("Quiz saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save quiz");
    } finally {
      setSaving(false);
    }
  };

  const deleteQuiz = async (id: string) => {
    try {
      await api.deleteQuiz(id);
      setSaved((s) => s.filter((q) => q.id !== id));
      toast.success("Quiz deleted");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete quiz");
    }
  };

  return (
    <Page className="space-y-6">
      {stage === "builder" && (
        <Builder
          onStart={(q) => {
            if (q.session_answers && Object.keys(q.session_answers).length > 0) {
              setPendingRestore(q);
            } else {
              start(q);
            }
          }}
          saved={saved}
          loadingSaved={loadingSaved}
          onDelete={deleteQuiz}
        />
      )}
      {stage === "player" && active && (
        <Player
          quiz={active}
          onFinish={(a) => submit(a)}
          onSave={() => saveQuiz(active)}
          saving={saving}
        />
      )}
      {stage === "results" && active && (
        <Results
          quiz={active}
          answers={answers}
          onRetry={() => start(active)}
          onBack={backToBuilder}
          onSave={() => saveQuiz(active)}
          saving={saving}
        />
      )}
      {pendingRestore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <PaperPanel className="w-80 p-5">
            <p className="font-architect text-[16px] text-ink">Resume in-progress exam?</p>
            <p className="mt-1 font-kalam text-[14px] text-ink-muted">
              You have {Object.keys(pendingRestore.session_answers ?? {}).length} answer
              {Object.keys(pendingRestore.session_answers ?? {}).length !== 1 ? "s" : ""} saved
              {pendingRestore.session_started_at
                ? ` from ${new Date(pendingRestore.session_started_at).toLocaleString()}`
                : ""}.
            </p>
            <div className="mt-4 flex gap-2">
              <PaperButton
                tone="dark"
                className="flex-1"
                onClick={() => {
                  restoreSession(pendingRestore);
                  setPendingRestore(null);
                }}
              >
                Resume
              </PaperButton>
              <GhostButton
                className="flex-1"
                onClick={() => {
                  api.clearQuizSession(pendingRestore.id).catch(() => {});
                  start(pendingRestore);
                  setPendingRestore(null);
                }}
              >
                Start fresh
              </GhostButton>
            </div>
          </PaperPanel>
        </div>
      )}
    </Page>
  );
}

function Builder({
  onStart,
  saved,
  loadingSaved,
  onDelete,
}: {
  onStart: (q: Quiz) => void;
  saved: Quiz[];
  loadingSaved: boolean;
  onDelete: (id: string) => void;
}) {
  // Builder inputs + the in-flight generation flag live in the store so the
  // selections survive navigation and a running generation keeps going.
  const topic = useQuizStore((s) => s.topic);
  const course = useQuizStore((s) => s.course);
  const document = useQuizStore((s) => s.document);
  const difficulty = useQuizStore((s) => s.difficulty);
  const timeLimit = useQuizStore((s) => s.timeLimit);
  const loading = useQuizStore((s) => s.generating);
  const setField = useQuizStore((s) => s.setField);
  const generate = useQuizStore((s) => s.generate);

  const setTopic = (v: string) => setField("topic", v);
  const setCourse = (v: string) => setField("course", v);
  const setDocument = (v: string | null) => setField("document", v);
  const setDifficulty = (v: Difficulty) => setField("difficulty", v);

  // Course list is cheap to refetch — keep it local.
  const [courses, setCourses] = useState<Course[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  useEffect(() => {
    api.listCourses().then(setCourses).catch(() => setCourses([]));
    api.listDocuments().then(setDocuments).catch(() => setDocuments([]));
  }, []);

  return (
    <>
      <PaperPanel className="p-5 z-10">
        <div className="flex items-center gap-2">
          <Settings2 className="size-4 text-ink-muted" />
          <h3 className="font-architect  text-ink">Quiz builder</h3>
        </div>
        <p className="mt-1 font-kalam  text-ink-muted">
          Generate a quiz from your materials or pick a saved one below.
        </p>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-48">
            <PaperInput
              id="quiz-topic-input"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") generate();
              }}
              label="Topic"
              placeholder="e.g. Neural networks"
            />
          </div>
          <PaperSelect
            label="Course"
            value={course}
            onChange={setCourse}
            options={[
              { value: "all", label: "All courses" },
              ...courses.map((c) => ({ value: c.name, label: c.name })),
            ]}
            placeholder="All courses"
            wrapperClassName="w-44"
          />
          <PaperSelect
            label="Document"
            value={document ?? "all"}
            onChange={(v) => setDocument(v === "all" ? null : v)}
            options={[
              { value: "all", label: "All documents" },
              ...documents.filter(d => course !== "all" ? d.course === course : true).map((d) => ({ value: d.id, label: d.title })),
            ]}
            placeholder="All documents"
            wrapperClassName="w-44"
          />
          <div>
            <label className="mb-1.5 block font-architect text-[13px] text-ink-muted">Difficulty</label>
            <div className="flex gap-2">
              {difficulties.map((d) => (
                <ChipButton
                  key={d}
                  selected={difficulty === d}
                  onClick={() => setDifficulty(d)}
                >
                  {d}
                </ChipButton>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block font-architect text-[13px] text-ink-muted">Time limit</label>
            <div className="flex gap-2">
              {([null, 15, 20, 30, 60] as (number | null)[]).map((t) => (
                <ChipButton
                  key={t ?? "none"}
                  selected={timeLimit === t}
                  onClick={() => setField("timeLimit", t)}
                >
                  {t === null ? "No limit" : `${t}m`}
                </ChipButton>
              ))}
            </div>
          </div>
          <PaperButton
            tone="dark"
            onClick={generate}
            disabled={loading || !topic.trim()}
          >
            {loading ? (
              <><Loader2 className="size-4 animate-spin" /> Generating…</>
            ) : (
              <><ListChecks className="size-4" /> Generate quiz</>
            )}
          </PaperButton>
        </div>
        <GenerationSteps
          steps={["Searching your library", "Selecting relevant sources", "Writing questions", "Validating answers"]}
          loading={loading}
          className="mt-4"
        />
      </PaperPanel>

      {loadingSaved ? (
        <PaperPanel className="flex items-center justify-center gap-2 p-8 font-kalam text-sm text-ink-muted">
          <Loader2 className="size-4 animate-spin" /> Loading saved quizzes…
        </PaperPanel>
      ) : saved.length === 0 ? (
        <EmptyState
          icon={<ListChecks className="size-6 text-ink-muted" />}
          title="No saved quizzes yet"
          description="Take a quiz on any topic. Start with a topic from your documents."
          action={
            <PaperButton
              tone="dark"
              size="sm"
              onClick={() => window.document.getElementById("quiz-topic-input")?.focus()}
            >
              <Sparkles className="size-4" /> Generate Quiz
            </PaperButton>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {saved.map((q) => (
            <motion.div
              key={q.id}
              whileHover={{ y: -3 }}
              className="relative"
              style={{ filter: "drop-shadow(1px 4px 8px rgba(0,0,0,0.14))" }}
            >
              <SketchBorder fill="#fffdf9" stroke="#9c9484" strokeWidth={1.6} roughness={1.1} shadow={0} />
              <div className="relative z-[1] p-5">
                <div className="flex items-start justify-between">
                  <div className="flex size-10 items-center justify-center">
                    <ListChecks className="size-5 text-ink-muted" />
                  </div>
                  <div className="flex items-center gap-2">
                    <DifficultyBadge difficulty={q.difficulty} />
                    <button
                      onClick={() => onDelete(q.id)}
                      aria-label="Delete quiz"
                      className="flex size-8 items-center justify-center rounded-md text-ink-muted hover:text-red-600 hover:bg-red-100"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
                <h4 className="mt-3 font-architect text-[15px] text-ink">{q.title}</h4>
                <div className="mt-1 font-kalam text-sm text-ink-muted">{q.course}</div>
                <div className="mt-1 font-kalam text-xs text-ink-muted">{q.questions.length} questions</div>
                <PaperButton tone="dark" className="mt-4 w-full py-4" size="lg" onClick={() => onStart(q)}>
                  <Play className="size-4" /> Start quiz
                </PaperButton>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
}

function Player({
  quiz,
  onFinish,
  onSave,
  saving,
}: {
  quiz: Quiz;
  onFinish: (a: Record<string, string>) => void;
  onSave: () => void;
  saving: boolean;
}) {
  // Position + answers live in the store so they survive navigation.
  const idx = useQuizStore((s) => s.idx);
  const answers = useQuizStore((s) => s.answers);
  const goTo = useQuizStore((s) => s.goTo);
  const answer = useQuizStore((s) => s.answer);
  const deadline = useQuizStore((s) => s.deadline);
  const q = quiz.questions[idx];

  // Timer — mirrors the Exam session countdown pattern.
  const secsFromDeadline = () =>
    deadline ? Math.max(0, Math.ceil((deadline - Date.now()) / 1000)) : 0;
  const [secsLeft, setSecsLeft] = useState(secsFromDeadline);
  const autoSubmittedRef = useRef(false);

  useEffect(() => {
    if (!deadline) return;
    const tick = () => {
      const left = secsFromDeadline();
      setSecsLeft(left);
      if (left <= 0 && !autoSubmittedRef.current) {
        autoSubmittedRef.current = true;
        toast.warning("Time's up — submitting quiz");
        onFinish(useQuizStore.getState().answers);
      }
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deadline]);
  const progress = ((idx + 1) / quiz.questions.length) * 100;
  const selected = answers[q.id];

  const choose = (value: string) => answer(q.id, value);

  const advance = () => {
    if (idx === quiz.questions.length - 1) {
      onFinish(answers);
    } else {
      goTo(idx + 1);
    }
  };

  const canAdvance =
    q.type === "short" ? (selected ?? "").trim().length > 0 : !!selected;

  const mm = String(Math.floor(secsLeft / 60)).padStart(2, "0");
  const ss = String(secsLeft % 60).padStart(2, "0");
  const low = secsLeft < 60;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-5 flex items-center gap-3">
        <SketchProgress value={progress} height={12} className="flex-1" />
        <span className="font-kalam text-xs text-ink-muted">
          {idx + 1} / {quiz.questions.length}
        </span>
        <QualityBadge score={quiz.quality} />
        {deadline && (
          <div
            className={cn(
              "flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-sm tabular-nums",
              low
                ? "border-red-300 bg-red-50 text-red-700"
                : "border-[#c8c0b0] bg-[#fffdf9]",
            )}
          >
            <Clock className="size-4" /> {mm}:{ss}
          </div>
        )}
        <GhostButton
          size="sm"
          onClick={onSave}
          disabled={saving}
        >
          {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
          Save quiz
        </GhostButton>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="relative"
          style={{ filter: "drop-shadow(2px 5px 10px rgba(0,0,0,0.14))" }}
        >
          <SketchBorder fill="#fffdf9" stroke="#9c9484" strokeWidth={1.6} roughness={1.1} shadow={0} />
          <div className="relative z-[1] p-6">
            <PaperBadge tone="ink" className="text-[10px] uppercase">
              {q.type === "mcq" ? "Multiple choice" : q.type === "truefalse" ? "True / False" : "Short answer"}
            </PaperBadge>
            <h3 className="mt-3 font-architect text-[18px] leading-relaxed text-ink">{q.prompt}</h3>

            <div className="mt-5 space-y-2">
              {q.type === "short" ? (
                <PaperTextarea
                  value={selected ?? ""}
                  onChange={(e) => answer(q.id, e.target.value)}
                  placeholder="Type your answer…"
                  rows={4}
                />
              ) : (
                q.options?.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => choose(opt)}
                    className="group relative flex w-full items-center gap-3 p-3.5 text-left transition-all duration-100 hover:-translate-y-px"
                    style={{ filter: "drop-shadow(1px 2px 4px rgba(0,0,0,0.06))" }}
                  >
                    <SketchBorder
                      fill={selected === opt ? "#f3f8f0" : "#fffdf9"}
                      stroke={selected === opt ? "#4a7a5c" : "#9c9484"}
                      strokeWidth={selected === opt ? 1.8 : 1.4}
                      roughness={1.1}
                      shadow={0}
                    />
                    <span
                      className={cn(
                        "relative z-[1] flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px] transition-colors",
                        selected === opt
                          ? "border-[#4a7a5c] bg-[#4a7a5c] text-white"
                          : "border-[#b4ad9e] bg-[#fffdf9]",
                      )}
                    >
                      {selected === opt && <Check className="size-3" />}
                    </span>
                    <span className="relative z-[1] font-architect text-[14px] text-ink">{opt}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-5 flex justify-end">
        <PaperButton
          tone="dark"
          onClick={advance}
          disabled={!canAdvance}
        >
          {idx === quiz.questions.length - 1 ? "Finish" : "Next"} <ChevronRight className="size-4" />
        </PaperButton>
      </div>
    </div>
  );
}

function Results({
  quiz,
  answers,
  onRetry,
  onBack,
  onSave,
  saving,
}: {
  quiz: Quiz;
  answers: Record<string, string>;
  onRetry: () => void;
  onBack: () => void;
  onSave: () => void;
  saving: boolean;
}) {
  const correct = quiz.questions.filter(
    (q) => answers[q.id]?.trim().toLowerCase() === q.answer.toLowerCase(),
  ).length;
  const total = quiz.questions.length;
  const pct = Math.round((correct / total) * 100);

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative"
        style={{ filter: "drop-shadow(2px 6px 12px rgba(0,0,0,0.18))" }}
      >
        <SketchBorder fill="#fffdf9" stroke="#9c9484" strokeWidth={1.8} roughness={1.1} shadow={0} />
        <div className="relative z-[1] p-8 text-center">
          <div className="mx-auto flex size-14 items-center justify-center">
            <Trophy className="size-7 text-ink-muted" />
          </div>
          <h1 className="mt-4 font-architect text-4xl text-ink">{pct}%</h1>
          <p className="mt-1 font-kalam text-sm text-ink-muted">
            You answered {correct} of {total} correctly
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <GhostButton onClick={onBack}>Back to quizzes</GhostButton>
            <GhostButton onClick={onSave} disabled={saving}>
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />} Save quiz
            </GhostButton>
            <PaperButton tone="dark" onClick={onRetry}>
              <RotateCw className="size-4" /> Retry
            </PaperButton>
            {correct < total && (
              <AddToNotebookMenu
                artifactType="quiz"
                content={{
                  title: `${quiz.title} — Review`,
                  questions: quiz.questions
                    .filter((q) => (answers[q.id] ?? "").trim().toLowerCase() !== q.answer.toLowerCase())
                    .map((q) => ({ prompt: q.prompt, answer: q.answer, explanation: q.explanation })),
                }}
                sourceId={quiz.id}
                course={quiz.course}
                trigger={
                  <GhostButton size="sm">
                    <BookPlus className="size-4" /> Save mistakes
                  </GhostButton>
                }
              />
            )}
          </div>
        </div>
      </motion.div>

      <div className="space-y-3">
        {quiz.questions.map((q: QuizQuestion, i) => {
          const userAns = answers[q.id] ?? "—";
          const isCorrect = userAns.trim().toLowerCase() === q.answer.toLowerCase();
          return (
            <div
              key={q.id}
              className="relative"
              style={{ filter: "drop-shadow(1px 3px 6px rgba(0,0,0,0.10))" }}
            >
              <SketchBorder
                fill={isCorrect ? "#f3f8f0" : "#fdf5f4"}
                stroke={isCorrect ? "#4a7a5c" : "#9f3a36"}
                strokeWidth={1.4}
                roughness={1.1}
                shadow={0}
              />
              <div className="relative z-[1] p-4">
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full",
                      isCorrect ? "bg-[#e8f5e4] text-[#4a7a5c]" : "bg-[#fae9e8] text-[#9f3a36]",
                    )}
                  >
                    {isCorrect ? <Check className="size-3.5" /> : <X className="size-3.5" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-architect text-[14px] text-ink">
                      {i + 1}. {q.prompt}
                    </div>
                    <div className="mt-1 font-kalam text-xs text-ink-muted">
                      Your answer: <span className={isCorrect ? "text-[#4a7a5c]" : "text-[#9f3a36]"}>{userAns}</span>
                      {!isCorrect && <> · Correct: <span className="text-[#4a7a5c]">{q.answer}</span></>}
                    </div>
                    {q.explanation.trim() && (
                      <p className="mt-2 font-kalam text-xs leading-relaxed text-ink-muted">{q.explanation}</p>
                    )}
                    {!isCorrect && (
                      <div className="mt-2">
                        <AddToNotebookMenu
                          artifactType="quiz"
                          content={{ prompt: q.prompt, answer: q.answer, explanation: q.explanation }}
                          sourceId={`${quiz.id}-${q.id}`}
                          course={quiz.course}
                          trigger={
                            <button className="flex size-7 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-black/5">
                              <BookPlus className="size-3.5" />
                            </button>
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
