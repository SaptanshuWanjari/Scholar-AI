import { useEffect, useState } from "react";
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
} from "lucide-react";
import { GenerationSteps } from "../components/GenerationSteps";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Page } from "../components/Page";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { api } from "../lib/api";
import type { Quiz, QuizQuestion, Course } from "../lib/types";
import { cn } from "../components/ui/utils";
import { useQuizStore } from "../stores/useQuizStore";
import type { Difficulty } from "../stores/useQuizStore";

const difficulties: Difficulty[] = ["Easy", "Medium", "Hard"];

const diffColor: Record<Quiz["difficulty"], string> = {
  Easy: "border-success/40 bg-success-soft text-success",
  Medium: "border-warning/40 bg-warning-soft text-warning",
  Hard: "border-danger/40 bg-danger-soft text-danger",
};

export function QuizPage() {
  // Flow state lives in the store so it survives page navigation.
  const stage = useQuizStore((s) => s.stage);
  const active = useQuizStore((s) => s.active);
  const answers = useQuizStore((s) => s.answers);
  const start = useQuizStore((s) => s.start);
  const submit = useQuizStore((s) => s.submit);
  const backToBuilder = useQuizStore((s) => s.backToBuilder);

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
      await api.saveQuiz({
        title: quiz.title,
        course: quiz.course && quiz.course !== "all" ? quiz.course : null,
        difficulty: quiz.difficulty,
        questions: quiz.questions,
      });
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
          onStart={start}
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
  const difficulty = useQuizStore((s) => s.difficulty);
  const loading = useQuizStore((s) => s.generating);
  const setField = useQuizStore((s) => s.setField);
  const generate = useQuizStore((s) => s.generate);

  const setTopic = (v: string) => setField("topic", v);
  const setCourse = (v: string) => setField("course", v);
  const setDifficulty = (v: Difficulty) => setField("difficulty", v);

  // Course list is cheap to refetch — keep it local.
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    api.listCourses().then(setCourses).catch(() => setCourses([]));
  }, []);

  return (
    <>
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2">
          <Settings2 className="size-4 text-primary" />
          <h3>Quiz builder</h3>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Generate a quiz from your materials or pick a saved one below.
        </p>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-48">
            <label className="mb-1.5 block text-xs text-muted-foreground">Topic</label>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") generate();
              }}
              placeholder="e.g. Neural networks"
              className="bg-input-background"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-muted-foreground">Course</label>
            <Select value={course} onValueChange={setCourse}>
              <SelectTrigger className="w-44 bg-input-background">
                <SelectValue placeholder="All courses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All courses</SelectItem>
                {courses.map((c) => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-muted-foreground">Difficulty</label>
            <div className="flex gap-2">
              {difficulties.map((d) => (
                <Badge
                  key={d}
                  variant="outline"
                  onClick={() => setDifficulty(d)}
                  className={cn(
                    "cursor-pointer py-1.5",
                    difficulty === d
                      ? diffColor[d]
                      : "border-border text-muted-foreground hover:border-ring/40",
                  )}
                >
                  {d}
                </Badge>
              ))}
            </div>
          </div>
          <Button
            onClick={generate}
            disabled={loading || !topic.trim()}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Generating…
              </>
            ) : (
              <>
                <ListChecks className="size-4" /> Generate quiz
              </>
            )}
          </Button>
        </div>
        <GenerationSteps
          steps={["Searching your library", "Selecting relevant sources", "Writing questions", "Validating answers"]}
          loading={loading}
          className="mt-4"
        />
      </div>

      {loadingSaved ? (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card p-8 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading saved quizzes…
        </div>
      ) : saved.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
          <div className="mx-auto flex size-10 items-center justify-center rounded-lg bg-violet-soft text-primary">
            <ListChecks className="size-5" />
          </div>
          <h4 className="mt-3">No saved quizzes yet</h4>
          <p className="mt-1 text-sm text-muted-foreground">
            Generate a quiz above and save it to find it here later.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {saved.map((q) => (
            <motion.div key={q.id} whileHover={{ y: -2 }} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between">
                <div className="flex size-10 items-center justify-center rounded-lg bg-violet-soft text-primary">
                  <ListChecks className="size-5" />
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={diffColor[q.difficulty]}>
                    {q.difficulty}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(q.id)}
                    aria-label="Delete quiz"
                    className="size-8 text-muted-foreground hover:text-danger"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
              <h4 className="mt-3">{q.title}</h4>
              <div className="mt-1 text-sm text-muted-foreground">{q.course}</div>
              <div className="mt-1 text-xs text-muted-foreground">{q.questions.length} questions</div>
              <Button onClick={() => onStart(q)} className="mt-4 w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Play className="size-4" /> Start quiz
              </Button>
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
  const q = quiz.questions[idx];
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

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-5 flex items-center gap-3">
        <Progress value={progress} className="h-1.5 flex-1" />
        <span className="text-xs text-muted-foreground">
          {idx + 1} / {quiz.questions.length}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={onSave}
          disabled={saving}
          className="gap-1.5"
        >
          {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
          Save quiz
        </Button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <Badge variant="outline" className="text-[10px] uppercase">
            {q.type === "mcq" ? "Multiple choice" : q.type === "truefalse" ? "True / False" : "Short answer"}
          </Badge>
          <h3 className="mt-3 text-lg leading-relaxed">{q.prompt}</h3>

          <div className="mt-5 space-y-2">
            {q.type === "short" ? (
              <Input
                value={selected ?? ""}
                onChange={(e) => answer(q.id, e.target.value)}
                placeholder="Type your answer…"
                className="bg-input-background"
              />
            ) : (
              q.options?.map((opt) => (
                <button
                  key={opt}
                  onClick={() => choose(opt)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border p-3.5 text-left text-sm transition-colors",
                    selected === opt
                      ? "border-primary bg-violet-soft"
                      : "border-border bg-background/40 hover:border-ring/40",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-5 items-center justify-center rounded-full border text-[10px]",
                      selected === opt ? "border-primary bg-primary text-white" : "border-border",
                    )}
                  >
                    {selected === opt && <Check className="size-3" />}
                  </span>
                  {opt}
                </button>
              ))
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-5 flex justify-end">
        <Button
          onClick={advance}
          disabled={!canAdvance}
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {idx === quiz.questions.length - 1 ? "Finish" : "Next"} <ChevronRight className="size-4" />
        </Button>
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
        className="rounded-2xl border border-border bg-card p-8 text-center"
      >
        <div className="mx-auto flex size-14 items-center justify-center rounded-xl border border-border bg-card text-violet">
          <Trophy className="size-7" />
        </div>
        <h1 className="mt-4 text-4xl font-semibold">{pct}%</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          You answered {correct} of {total} correctly
        </p>
        <div className="mt-5 flex justify-center gap-2">
          <Button variant="outline" onClick={onBack}>Back to quizzes</Button>
          <Button variant="outline" onClick={onSave} disabled={saving} className="gap-2">
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />} Save quiz
          </Button>
          <Button onClick={onRetry} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <RotateCw className="size-4" /> Retry
          </Button>
        </div>
      </motion.div>

      <div className="space-y-3">
        {quiz.questions.map((q: QuizQuestion, i) => {
          const userAns = answers[q.id] ?? "—";
          const isCorrect = userAns.trim().toLowerCase() === q.answer.toLowerCase();
          return (
            <div key={q.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full",
                    isCorrect ? "bg-success-soft text-success" : "bg-danger-soft text-danger",
                  )}
                >
                  {isCorrect ? <Check className="size-3.5" /> : <X className="size-3.5" />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">
                    {i + 1}. {q.prompt}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Your answer: <span className={isCorrect ? "text-success" : "text-danger"}>{userAns}</span>
                    {!isCorrect && <> · Correct: <span className="text-success">{q.answer}</span></>}
                  </div>
                  {q.explanation.trim() && (
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{q.explanation}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
