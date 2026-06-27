import { useEffect, useRef, useState } from "react";
import {
  GraduationCap,
  FileStack,
  SlidersHorizontal,
  ListChecks,
  Clock,
  Layers3,
  Flag,
  ChevronLeft,
  ChevronRight,
  Check,
  PanelRightOpen,
  PanelRightClose,
  Sigma,
  NotebookPen,
  Calculator as CalcIcon,
  Settings2,
  Trophy,
  Sparkles,
  Network,
  RotateCw,
  CircleDot,
  Loader2,
} from "lucide-react";
import { GenerationSteps } from "../components/GenerationSteps";
import { MarkdownRenderer } from "../components/MarkdownRenderer";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { cn } from "../components/ui/utils";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Page } from "../components/Page";
import { api, type ExamResult } from "../lib/api";
import type { Course, DocumentItem } from "../lib/types";
import { formulaSheet, type ExamQuestion } from "../lib/exam-data";
import { useExamStore } from "../stores/useExamStore";
import { useNavigate } from "react-router";
import { useFlashcardGenStore } from "../stores/useFlashcardGenStore";
import { useQuizStore } from "../stores/useQuizStore";
import { useRevisionStore } from "../stores/useRevisionStore";
import { useMindmapStore } from "../stores/useMindmapStore";

const DIFFICULTIES = ["Easy", "Medium", "Hard", "Adaptive"];
const COVERAGE = [
  "Entire Course",
  "Selected Topics",
  "Weak Topics Only",
  "Recent Documents",
];

export function Exam() {
  const stage = useExamStore((s) => s.stage);

  if (stage === "builder") return <Builder />;
  if (stage === "session") return <Session />;
  return <Results />;
}

/* ---------------- Builder ---------------- */

function Builder() {
  const topic = useExamStore((s) => s.topic);
  const course = useExamStore((s) => s.course);
  const difficulty = useExamStore((s) => s.difficulty);
  const count = useExamStore((s) => s.count);
  const minutes = useExamStore((s) => s.minutes);
  const coverage = useExamStore((s) => s.coverage);
  const types = useExamStore((s) => s.types);
  const generating = useExamStore((s) => s.generating);
  const setField = useExamStore((s) => s.setField);
  const generate = useExamStore((s) => s.generate);

  const [courses, setCourses] = useState<Course[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  const setTopic = (v: string) => setField("topic", v);
  const setCourse = (v: string) => setField("course", v);
  const document = useExamStore((s) => s.document);
  const setDocument = (v: string | null) => setField("document", v);
  const setDifficulty = (v: string) => setField("difficulty", v);
  const setCount = (v: number) => setField("count", v);
  const setMinutes = (v: number) => setField("minutes", v);
  const setCoverage = (v: string) => setField("coverage", v);
  const setTypes = (v: string[]) => setField("types", v);

  const TYPE_OPTIONS = [
    { label: "MCQ", value: "mcq" },
    { label: "True/False", value: "truefalse" },
    { label: "Short Answer", value: "short" },
    { label: "Long Answer", value: "long" },
  ];

  useEffect(() => {
    let active = true;
    api
      .listCourses()
      .then((cs) => {
        if (active) setCourses(cs);
      })
      .catch(() => {
      });
    api.listDocuments().then((ds) => { if (active) setDocuments(ds); }).catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return (
    <Page className="max-w-3xl">
      <div className="mb-8 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl border border-border bg-card text-violet">
          <GraduationCap className="size-6" />
        </div>
        <h1 className="mt-4">Configure Mock Exam</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Generate a realistic exam from your uploaded materials.
        </p>
      </div>

      <div className="space-y-5" data-tour="exam-setup">
        <Field
          icon={ListChecks}
          title="Topic"
          desc="What should the exam focus on?"
        >
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Transformers, backpropagation…"
            className="bg-input-background"
          />
        </Field>

        <Field
          icon={FileStack}
          title="Source Material"
          desc="Choose the course the exam draws from"
          tourId="exam-source"
        >
          <Select value={course} onValueChange={setCourse}>
            <SelectTrigger className="w-full bg-input-background">
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
          <Select value={document ?? "all"} onValueChange={(v) => setDocument(v === "all" ? null : v)}>
            <SelectTrigger className="w-full bg-input-background mt-2">
              <SelectValue placeholder="All documents" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All documents</SelectItem>
              {documents.filter(d => course !== "all" ? d.course === course : true).map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field icon={SlidersHorizontal} title="Difficulty">
          <Segmented
            options={DIFFICULTIES}
            value={difficulty}
            onChange={setDifficulty}
          />
        </Field>

        <Field icon={ListChecks} title="Question Types" desc="Select formats to include">
          <MultiSegmented
            options={TYPE_OPTIONS}
            values={types}
            onChange={(v) => {
               if (v.length > 0) setTypes(v);
            }}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field icon={ListChecks} title="Questions">
            <Segmented
              options={["5", "8", "10", "15"]}
              value={String(count)}
              onChange={(v) => setCount(Number(v))}
            />
          </Field>
          <Field icon={Clock} title="Time Limit">
            <Segmented
              options={["15", "20", "30", "60"]}
              value={String(minutes)}
              onChange={(v) => setMinutes(Number(v))}
              suffix="min"
            />
          </Field>
        </div>

        <Field icon={Layers3} title="Coverage">
          <select
            value={coverage}
            onChange={(e) => setCoverage(e.target.value)}
            className="h-9 w-full rounded-md border border-border bg-input-background px-3 text-sm outline-none focus:border-ring"
          >
            {COVERAGE.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>

        <div
          className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
          data-tour="exam-generate"
        >
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {count} questions
            </span>{" "}
            · {difficulty} · {minutes} min · {coverage}
          </div>
          <Button
            onClick={generate}
            disabled={generating}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {generating ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Generating…
              </>
            ) : (
              <>
                <Sparkles className="size-4" /> Generate Mock Exam
              </>
            )}
          </Button>
        </div>
        <GenerationSteps
          steps={[
            "Searching your library",
            "Drafting questions",
            "Calibrating difficulty",
            "Formatting exam",
          ]}
          loading={generating}
          interval={2500}
        />
      </div>
    </Page>
  );
}

/* ---------------- Session ---------------- */

function Session() {
  // Session state lives in the store so it survives navigation away and back.
  const questions = useExamStore((s) => s.questions);
  const difficultyLabel = useExamStore((s) => s.difficultyLabel);
  const answers = useExamStore((s) => s.answers);
  const idx = useExamStore((s) => s.idx);
  const flagged = useExamStore((s) => s.flagged);
  const visited = useExamStore((s) => s.visited);
  const deadline = useExamStore((s) => s.deadline);
  const submitting = useExamStore((s) => s.submitting);
  const answer = useExamStore((s) => s.answer);
  const toggleFlagStore = useExamStore((s) => s.toggleFlag);
  const gotoStore = useExamStore((s) => s.goto);
  const submitStore = useExamStore((s) => s.submit);

  const [panelOpen, setPanelOpen] = useState(false);

  // Derive seconds-left from the absolute store `deadline` so the countdown
  // always reflects real elapsed time, even after leaving and returning to /exam.
  const secsFromDeadline = () =>
    deadline ? Math.max(0, Math.ceil((deadline - Date.now()) / 1000)) : 0;
  const [secsLeft, setSecsLeft] = useState(secsFromDeadline);
  const submittedRef = useRef(false);

  const q = questions[idx];

  const submit = async () => {
    if (submittedRef.current || useExamStore.getState().submitting) return;
    submittedRef.current = true;
    await submitStore();
    // submitStore clears `submitting` (and stays on this stage) on failure; allow retry.
    if (useExamStore.getState().stage !== "results")
      submittedRef.current = false;
  };

  // Local interval reads the store `deadline` each tick; the store remains the
  // source of truth, so the timer resumes correctly after navigation.
  useEffect(() => {
    const tick = () => {
      const left = secsFromDeadline();
      setSecsLeft(left);
      if (left <= 0 && !submittedRef.current) {
        toast.warning("Time's up — submitting exam");
        void submit();
      }
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deadline]);

  const goto = (i: number) => gotoStore(i);
  const setAnswer = (val: string) => answer(q.id, val);
  const toggleFlag = () => toggleFlagStore(q.id);

  const isFlagged = (id: string) => flagged.includes(id);
  const isVisited = (id: string) => visited.includes(id);

  const answeredCount = Object.values(answers).filter(Boolean).length;
  const mm = String(Math.floor(secsLeft / 60)).padStart(2, "0");
  const ss = String(secsLeft % 60).padStart(2, "0");
  const low = secsLeft < 60;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex h-14 shrink-0 items-center gap-4 border-b border-border px-6">
        <div className="flex items-center gap-2">
          <GraduationCap className="size-4 text-violet" />
          <span className="text-sm font-medium">
            Mock Exam — {difficultyLabel}
          </span>
        </div>
        <div className="ml-4 hidden items-center gap-2 sm:flex">
          <div className="h-1.5 w-40 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-violet"
              style={{ width: `${(answeredCount / questions.length) * 100}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground">
            {answeredCount}/{questions.length} answered
          </span>
        </div>
        <div
          className={cn(
            "ml-auto flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-sm tabular-nums",
            low
              ? "border-danger/40 bg-danger-soft text-danger"
              : "border-border bg-card",
          )}
        >
          <Clock className="size-4" /> {mm}:{ss}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="size-9"
          onClick={() => setPanelOpen((o) => !o)}
        >
          {panelOpen ? (
            <PanelRightClose className="size-4" />
          ) : (
            <PanelRightOpen className="size-4" />
          )}
        </Button>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Navigator */}
        <aside className="hidden w-[200px] shrink-0 flex-col overflow-y-auto border-r border-border bg-card/40 p-4 md:flex">
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Questions
          </div>
          <div className="grid grid-cols-4 gap-2">
            {questions.map((eq, i) => {
              const isCurrent = i === idx;
              const isAnswered = !!answers[eq.id];
              const flaggedHere = isFlagged(eq.id);
              const isSkipped = isVisited(eq.id) && !isAnswered && !isCurrent;
              return (
                <button
                  key={eq.id}
                  onClick={() => goto(i)}
                  className={cn(
                    "relative flex aspect-square items-center justify-center rounded-md border text-xs font-medium transition-colors",
                    isCurrent && "border-violet bg-violet text-white",
                    !isCurrent &&
                    isAnswered &&
                    "border-success/40 bg-success-soft text-success",
                    !isCurrent &&
                    isSkipped &&
                    "border-warning/40 bg-warning-soft text-warning",
                    !isCurrent &&
                    !isAnswered &&
                    !isSkipped &&
                    "border-border bg-card text-muted-foreground hover:border-ring/40",
                  )}
                >
                  {i + 1}
                  {flaggedHere && (
                    <Flag className="absolute -right-1 -top-1 size-3 fill-danger text-danger" />
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-5 space-y-1.5 text-[11px] text-muted-foreground">
            <Legend cls="bg-success-soft border-success/40" label="Answered" />
            <Legend cls="bg-warning-soft border-warning/40" label="Skipped" />
            <Legend cls="bg-violet border-violet" label="Current" />
            <Legend cls="bg-card border-border" label="Unseen" />
          </div>
        </aside>

        {/* Question area */}
        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-2xl px-8 py-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Question {idx + 1}
                </span>
                <Badge
                  variant="outline"
                  className="text-[10px] text-muted-foreground"
                >
                  {q.topic}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn("text-[10px]", diffCls(q.difficulty))}
                >
                  {q.difficulty}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "gap-1.5 text-xs",
                  isFlagged(q.id) && "text-danger",
                )}
                onClick={toggleFlag}
              >
                <Flag
                  className={cn("size-3.5", isFlagged(q.id) && "fill-danger")}
                />
                {isFlagged(q.id) ? "Flagged" : "Flag"}
              </Button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={q.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.18 }}
              >
                <h2 className="mt-4 font-reading text-[1.6rem] leading-snug">
                  {q.prompt}
                </h2>
                <div className="mt-6">
                  <AnswerArea
                    q={q}
                    value={answers[q.id]}
                    onChange={setAnswer}
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
              <Button
                variant="outline"
                className="gap-1.5"
                disabled={idx === 0}
                onClick={() => goto(idx - 1)}
              >
                <ChevronLeft className="size-4" /> Previous
              </Button>
              {idx === questions.length - 1 ? (
                <Button
                  onClick={submit}
                  disabled={submitting}
                  className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> Submitting…
                    </>
                  ) : (
                    <>
                      <Check className="size-4" /> Submit Exam
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={() => goto(idx + 1)}
                  className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Next <ChevronRight className="size-4" />
                </Button>
              )}
            </div>
          </div>
        </main>

        {/* Right panel */}
        <AnimatePresence>
          {panelOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="shrink-0 overflow-hidden border-l border-border bg-card/40"
            >
              <div className="w-[300px] space-y-5 overflow-y-auto p-4">
                <PanelBlock title="Formula Sheet" icon={Sigma}>
                  {formulaSheet.map((f) => (
                    <div
                      key={f.name}
                      className="rounded-lg border border-border bg-card px-3 py-2"
                    >
                      <div className="text-[11px] text-muted-foreground">
                        {f.name}
                      </div>
                      <div className="mt-0.5 font-mono text-sm">
                        {f.formula}
                      </div>
                    </div>
                  ))}
                </PanelBlock>
                <PanelBlock title="Reference Notes" icon={NotebookPen}>
                  <p className="font-reading text-sm leading-relaxed text-foreground/80">
                    Self-attention lets each token weigh all others; scaling by
                    √dₖ stabilizes gradients.
                  </p>
                </PanelBlock>
                <PanelBlock title="Calculator" icon={CalcIcon}>
                  <MiniCalculator />
                </PanelBlock>
                <PanelBlock title="Exam Settings" icon={Settings2}>
                  <div className="text-sm text-muted-foreground">
                    Font size, high contrast and timer visibility.
                  </div>
                </PanelBlock>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function AnswerArea({
  q,
  value,
  onChange,
}: {
  q: ExamQuestion;
  value?: string;
  onChange: (v: string) => void;
}) {
  if (q.type === "long")
    return (
      <Textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        rows={8}
        placeholder="Write your answer…"
        className="resize-none bg-input-background font-reading"
      />
    );
  if (q.type === "short")
    return (
      <Textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        placeholder="Type a short answer…"
        className="resize-none bg-input-background font-reading"
      />
    );
  return (
    <div className="space-y-2">
      {q.options?.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl border p-3.5 text-left text-sm transition-colors",
            value === opt
              ? "border-violet bg-violet-soft"
              : "border-border bg-card hover:border-ring/40",
          )}
        >
          <span
            className={cn(
              "flex size-5 items-center justify-center rounded-full border",
              value === opt
                ? "border-violet bg-violet text-white"
                : "border-border",
            )}
          >
            {value === opt && <Check className="size-3" />}
          </span>
          {opt}
        </button>
      ))}
    </div>
  );
}

function MiniCalculator() {
  const [display, setDisplay] = useState("0");
  const [acc, setAcc] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [fresh, setFresh] = useState(true);

  const inputDigit = (d: string) => {
    setDisplay((cur) => (fresh || cur === "0" ? d : cur + d));
    setFresh(false);
  };
  const dot = () => {
    setDisplay((cur) => (fresh ? "0." : cur.includes(".") ? cur : cur + "."));
    setFresh(false);
  };
  const compute = (a: number, b: number, o: string) =>
    o === "+"
      ? a + b
      : o === "−"
        ? a - b
        : o === "×"
          ? a * b
          : b === 0
            ? NaN
            : a / b;
  const chooseOp = (o: string) => {
    const cur = parseFloat(display);
    if (acc !== null && op && !fresh) {
      const r = compute(acc, cur, op);
      setAcc(r);
      setDisplay(String(r));
    } else {
      setAcc(cur);
    }
    setOp(o);
    setFresh(true);
  };
  const equals = () => {
    if (acc !== null && op) {
      const r = compute(acc, parseFloat(display), op);
      setDisplay(Number.isNaN(r) ? "Error" : String(r));
      setAcc(null);
      setOp(null);
      setFresh(true);
    }
  };
  const clear = () => {
    setDisplay("0");
    setAcc(null);
    setOp(null);
    setFresh(true);
  };

  const keys = [
    "7",
    "8",
    "9",
    "÷",
    "4",
    "5",
    "6",
    "×",
    "1",
    "2",
    "3",
    "−",
    "0",
    ".",
    "=",
    "+",
  ];
  return (
    <div className="rounded-lg border border-border bg-card p-2">
      <div className="mb-2 rounded-md bg-secondary px-3 py-2 text-right font-mono text-lg tabular-nums">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-1">
        <button
          onClick={clear}
          className="col-span-4 rounded-md border border-border py-1.5 text-xs text-muted-foreground hover:bg-accent"
        >
          Clear
        </button>
        {keys.map((k) => {
          const isOp = ["÷", "×", "−", "+", "="].includes(k);
          return (
            <button
              key={k}
              onClick={() =>
                k === "="
                  ? equals()
                  : isOp
                    ? chooseOp(k)
                    : k === "."
                      ? dot()
                      : inputDigit(k)
              }
              className={cn(
                "rounded-md py-2 text-sm font-medium transition-colors",
                isOp
                  ? "bg-violet-soft text-violet hover:bg-violet hover:text-white"
                  : "bg-secondary hover:bg-accent",
              )}
            >
              {k}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Results ---------------- */

function Results() {
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
      useFlashcardGenStore.getState().setTopic(combinedTopic);
      useFlashcardGenStore.getState().setCourse(examCourse);
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
      {/* Score hero */}
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
        {/* Topic performance */}
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

        {/* Strong / weak */}
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

      {/* Recommended revision */}
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

      {/* Questions Review */}
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

/* ---------------- Shared bits ---------------- */

function diffCls(d: string) {
  return d === "Easy"
    ? "border-success/40 bg-success-soft text-success"
    : d === "Medium"
      ? "border-warning/40 bg-warning-soft text-warning"
      : "border-danger/40 bg-danger-soft text-danger";
}

function Field({
  icon: Icon,
  title,
  desc,
  children,
  tourId,
}: {
  icon: typeof FileStack;
  title: string;
  desc?: string;
  children: React.ReactNode;
  tourId?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4" data-tour={tourId}>
      <div className="mb-3 flex items-center gap-2">
        <Icon className="size-4 text-muted-foreground" />
        <span className="text-sm font-medium">{title}</span>
        {desc && (
          <span className="text-xs text-muted-foreground">· {desc}</span>
        )}
      </div>
      {children}
    </div>
  );
}

function Segmented({
  options,
  value,
  onChange,
  suffix,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
}) {
  return (
    <div className="flex rounded-lg border border-border bg-card p-0.5">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={cn(
            "flex-1 rounded-md py-1.5 text-sm font-medium transition-colors",
            value === o
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o}
          {suffix ? ` ${suffix}` : ""}
        </button>
      ))}
    </div>
  );
}

function Legend({ cls, label }: { cls: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn("size-3 rounded border", cls)} /> {label}
    </div>
  );
}

function PanelBlock({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof Sigma;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="size-3" /> {title}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
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

export function MultiSegmented({
  options,
  values,
  onChange,
}: {
  options: { label: string; value: string }[];
  values: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 rounded-lg border border-border bg-card p-0.5">
      {options.map((o) => {
        const active = values.includes(o.value);
        return (
          <button
            key={o.value}
            onClick={() =>
              onChange(
                active
                  ? values.filter((v) => v !== o.value)
                  : [...values, o.value],
              )
            }
            className={cn(
              "flex-1 rounded-md py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
