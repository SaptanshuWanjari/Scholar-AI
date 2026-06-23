import { useEffect, useMemo, useRef, useState } from "react";
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
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { cn } from "../components/ui/utils";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Page } from "../components/Page";
import {
  examQuestions,
  topicPerformance,
  difficultyAnalysis,
  sourceMaterials,
  formulaSheet,
  type ExamQuestion,
} from "../lib/exam-data";

type Stage = "builder" | "session" | "results";

const QUESTION_TYPES = ["MCQ", "True / False", "Short Answer", "Long Answer", "Diagram", "Mixed"];
const DIFFICULTIES = ["Easy", "Medium", "Hard", "Adaptive"];
const COVERAGE = ["Entire Course", "Selected Topics", "Weak Topics Only", "Recent Documents"];

export function Exam() {
  const [stage, setStage] = useState<Stage>("builder");
  const [minutes, setMinutes] = useState(20);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  if (stage === "builder")
    return (
      <Builder
        minutes={minutes}
        setMinutes={setMinutes}
        onGenerate={() => {
          setAnswers({});
          setStage("session");
        }}
      />
    );
  if (stage === "session")
    return (
      <Session
        minutes={minutes}
        answers={answers}
        setAnswers={setAnswers}
        onSubmit={() => setStage("results")}
      />
    );
  return <Results answers={answers} onRestart={() => setStage("builder")} />;
}

/* ---------------- Builder ---------------- */

function Builder({
  minutes,
  setMinutes,
  onGenerate,
}: {
  minutes: number;
  setMinutes: (n: number) => void;
  onGenerate: () => void;
}) {
  const [sources, setSources] = useState<string[]>([sourceMaterials[0]]);
  const [difficulty, setDifficulty] = useState("Adaptive");
  const [types, setTypes] = useState<string[]>(["MCQ", "True / False", "Short Answer"]);
  const [coverage, setCoverage] = useState("Entire Course");

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

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

      <div className="space-y-5">
        <Field icon={FileStack} title="Source Material" desc="Choose what the exam draws from">
          <div className="flex flex-wrap gap-2">
            {sourceMaterials.map((s) => (
              <Chip key={s} active={sources.includes(s)} onClick={() => toggle(sources, setSources, s)}>
                {s}
              </Chip>
            ))}
          </div>
        </Field>

        <Field icon={SlidersHorizontal} title="Difficulty">
          <Segmented options={DIFFICULTIES} value={difficulty} onChange={setDifficulty} />
        </Field>

        <Field icon={ListChecks} title="Question Types">
          <div className="flex flex-wrap gap-2">
            {QUESTION_TYPES.map((t) => (
              <Chip key={t} active={types.includes(t)} onClick={() => toggle(types, setTypes, t)}>
                {t}
              </Chip>
            ))}
          </div>
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field icon={Clock} title="Time Limit">
            <Segmented
              options={["15", "20", "30", "60"]}
              value={String(minutes)}
              onChange={(v) => setMinutes(Number(v))}
              suffix="min"
            />
          </Field>
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
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{examQuestions.length} questions</span> ·{" "}
            {difficulty} · {minutes} min · {coverage}
          </div>
          <Button
            onClick={onGenerate}
            disabled={sources.length === 0 || types.length === 0}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Sparkles className="size-4" /> Generate Mock Exam
          </Button>
        </div>
      </div>
    </Page>
  );
}

/* ---------------- Session ---------------- */

function Session({
  minutes,
  answers,
  setAnswers,
  onSubmit,
}: {
  minutes: number;
  answers: Record<string, string>;
  setAnswers: (a: Record<string, string>) => void;
  onSubmit: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [visited, setVisited] = useState<Set<string>>(new Set([examQuestions[0].id]));
  const [secsLeft, setSecsLeft] = useState(minutes * 60);
  const [panelOpen, setPanelOpen] = useState(false);
  const submittedRef = useRef(false);

  const q = examQuestions[idx];

  useEffect(() => {
    const t = setInterval(() => {
      setSecsLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          if (!submittedRef.current) {
            submittedRef.current = true;
            toast.warning("Time's up — submitting exam");
            onSubmit();
          }
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [onSubmit]);

  const goto = (i: number) => {
    setIdx(i);
    setVisited((v) => new Set(v).add(examQuestions[i].id));
  };

  const setAnswer = (val: string) => setAnswers({ ...answers, [q.id]: val });
  const toggleFlag = () => {
    setFlagged((f) => {
      const n = new Set(f);
      n.has(q.id) ? n.delete(q.id) : n.add(q.id);
      return n;
    });
  };

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
          <span className="text-sm font-medium">ML Mock Exam — Adaptive</span>
        </div>
        <div className="ml-4 hidden items-center gap-2 sm:flex">
          <div className="h-1.5 w-40 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-violet" style={{ width: `${(answeredCount / examQuestions.length) * 100}%` }} />
          </div>
          <span className="text-xs text-muted-foreground">
            {answeredCount}/{examQuestions.length} answered
          </span>
        </div>
        <div
          className={cn(
            "ml-auto flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-sm tabular-nums",
            low ? "border-danger/40 bg-danger-soft text-danger" : "border-border bg-card",
          )}
        >
          <Clock className="size-4" /> {mm}:{ss}
        </div>
        <Button variant="outline" size="icon" className="size-9" onClick={() => setPanelOpen((o) => !o)}>
          {panelOpen ? <PanelRightClose className="size-4" /> : <PanelRightOpen className="size-4" />}
        </Button>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Navigator */}
        <aside className="hidden w-[200px] shrink-0 flex-col overflow-y-auto border-r border-border bg-card/40 p-4 md:flex">
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Questions
          </div>
          <div className="grid grid-cols-4 gap-2">
            {examQuestions.map((eq, i) => {
              const isCurrent = i === idx;
              const isAnswered = !!answers[eq.id];
              const isFlagged = flagged.has(eq.id);
              const isSkipped = visited.has(eq.id) && !isAnswered && !isCurrent;
              return (
                <button
                  key={eq.id}
                  onClick={() => goto(i)}
                  className={cn(
                    "relative flex aspect-square items-center justify-center rounded-md border text-xs font-medium transition-colors",
                    isCurrent && "border-violet bg-violet text-white",
                    !isCurrent && isAnswered && "border-success/40 bg-success-soft text-success",
                    !isCurrent && isSkipped && "border-warning/40 bg-warning-soft text-warning",
                    !isCurrent && !isAnswered && !isSkipped && "border-border bg-card text-muted-foreground hover:border-ring/40",
                  )}
                >
                  {i + 1}
                  {isFlagged && <Flag className="absolute -right-1 -top-1 size-3 fill-danger text-danger" />}
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
                <span className="text-sm text-muted-foreground">Question {idx + 1}</span>
                <Badge variant="outline" className="text-[10px] text-muted-foreground">{q.topic}</Badge>
                <Badge variant="outline" className={cn("text-[10px]", diffCls(q.difficulty))}>
                  {q.difficulty}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className={cn("gap-1.5 text-xs", flagged.has(q.id) && "text-danger")}
                onClick={toggleFlag}
              >
                <Flag className={cn("size-3.5", flagged.has(q.id) && "fill-danger")} />
                {flagged.has(q.id) ? "Flagged" : "Flag"}
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
                <h2 className="mt-4 font-reading text-[1.6rem] leading-snug">{q.prompt}</h2>
                <div className="mt-6">
                  <AnswerArea q={q} value={answers[q.id]} onChange={setAnswer} />
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
              <Button variant="outline" className="gap-1.5" disabled={idx === 0} onClick={() => goto(idx - 1)}>
                <ChevronLeft className="size-4" /> Previous
              </Button>
              {idx === examQuestions.length - 1 ? (
                <Button
                  onClick={() => {
                    submittedRef.current = true;
                    onSubmit();
                  }}
                  className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Check className="size-4" /> Submit Exam
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
                    <div key={f.name} className="rounded-lg border border-border bg-card px-3 py-2">
                      <div className="text-[11px] text-muted-foreground">{f.name}</div>
                      <div className="mt-0.5 font-mono text-sm">{f.formula}</div>
                    </div>
                  ))}
                </PanelBlock>
                <PanelBlock title="Reference Notes" icon={NotebookPen}>
                  <p className="font-reading text-sm leading-relaxed text-foreground/80">
                    Self-attention lets each token weigh all others; scaling by √dₖ stabilizes gradients.
                  </p>
                </PanelBlock>
                <PanelBlock title="Calculator" icon={CalcIcon}>
                  <MiniCalculator />
                </PanelBlock>
                <PanelBlock title="Exam Settings" icon={Settings2}>
                  <div className="text-sm text-muted-foreground">Font size, high contrast and timer visibility.</div>
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
      <Input
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type a short answer…"
        className="bg-input-background"
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
            value === opt ? "border-violet bg-violet-soft" : "border-border bg-card hover:border-ring/40",
          )}
        >
          <span
            className={cn(
              "flex size-5 items-center justify-center rounded-full border",
              value === opt ? "border-violet bg-violet text-white" : "border-border",
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
    o === "+" ? a + b : o === "−" ? a - b : o === "×" ? a * b : b === 0 ? NaN : a / b;
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

  const keys = ["7", "8", "9", "÷", "4", "5", "6", "×", "1", "2", "3", "−", "0", ".", "=", "+"];
  return (
    <div className="rounded-lg border border-border bg-card p-2">
      <div className="mb-2 rounded-md bg-secondary px-3 py-2 text-right font-mono text-lg tabular-nums">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-1">
        <button onClick={clear} className="col-span-4 rounded-md border border-border py-1.5 text-xs text-muted-foreground hover:bg-accent">
          Clear
        </button>
        {keys.map((k) => {
          const isOp = ["÷", "×", "−", "+", "="].includes(k);
          return (
            <button
              key={k}
              onClick={() =>
                k === "=" ? equals() : isOp ? chooseOp(k) : k === "." ? dot() : inputDigit(k)
              }
              className={cn(
                "rounded-md py-2 text-sm font-medium transition-colors",
                isOp ? "bg-violet-soft text-violet hover:bg-violet hover:text-white" : "bg-secondary hover:bg-accent",
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

function Results({ answers, onRestart }: { answers: Record<string, string>; onRestart: () => void }) {
  const navTo = useRef<HTMLDivElement>(null);
  void navTo;
  const { correct, total, pct } = useMemo(() => {
    let c = 0;
    examQuestions.forEach((q) => {
      const a = answers[q.id]?.trim().toLowerCase();
      if (!a) return;
      if (q.answer) {
        if (a === q.answer.toLowerCase()) c++;
      } else {
        c++; // open-ended: credit attempt for demo
      }
    });
    const t = examQuestions.length;
    return { correct: c, total: t, pct: Math.round((c / t) * 100) };
  }, [answers]);

  const weak = topicPerformance.filter((t) => t.score < 70);
  const strong = topicPerformance.filter((t) => t.score >= 70);

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
          <span className="mt-1 font-display text-3xl leading-none">{pct}%</span>
        </div>
        <div className="min-w-0 flex-1">
          <h1>Exam Complete</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            You answered {correct} of {total} correctly.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Stat label="Score" value={`${correct}/${total}`} />
            <Stat label="Percentage" value={`${pct}%`} />
            <Stat label="Time Taken" value="17:42" />
            <Stat label="Difficulty" value="Adaptive" />
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
                    style={{ backgroundColor: t.score >= 70 ? "var(--success)" : t.score >= 50 ? "var(--warning)" : "var(--danger)" }}
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
              <div key={d.level} className="rounded-xl border border-border bg-background/40 p-3 text-center">
                <div className="font-display text-2xl leading-none">
                  {Math.round((d.correct / d.total) * 100)}%
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{d.level}</div>
                <div className="text-[11px] text-muted-foreground">{d.correct}/{d.total} correct</div>
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
          <h3 className="text-sm font-semibold">Recommended Revision for weak topics</h3>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Generate targeted study material for Optimization and Activation Functions.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          {revisionActions.map((a) => (
            <button
              key={a.label}
              onClick={() => toast.success(`Generating ${a.label}…`)}
              className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card py-2.5 text-sm font-medium transition-colors hover:border-violet/50 hover:text-violet"
            >
              <a.icon className="size-4" /> {a.label}
            </button>
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
}: {
  icon: typeof FileStack;
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="size-4 text-muted-foreground" />
        <span className="text-sm font-medium">{title}</span>
        {desc && <span className="text-xs text-muted-foreground">· {desc}</span>}
      </div>
      {children}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm transition-colors",
        active ? "border-violet bg-violet-soft text-violet" : "border-border bg-card text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
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
            value === o ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
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

function PanelBlock({ title, icon: Icon, children }: { title: string; icon: typeof Sigma; children: React.ReactNode }) {
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
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
