import { useEffect, useRef, useState } from "react";
import {
  GraduationCap,
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
  Clock,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { cn } from "../../components/ui/utils";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Textarea } from "../../components/ui/textarea";
import { Page } from "../../components/Page";
import { formulaSheet, type ExamQuestion } from "../../lib/exam-data";
import { useExamStore } from "../../stores/useExamStore";

export function diffCls(d: string) {
  return d === "Easy"
    ? "border-success/40 bg-success-soft text-success"
    : d === "Medium"
      ? "border-warning/40 bg-warning-soft text-warning"
      : "border-danger/40 bg-danger-soft text-danger";
}

export function ExamSession() {
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

  const secsFromDeadline = () =>
    deadline ? Math.max(0, Math.ceil((deadline - Date.now()) / 1000)) : 0;
  const [secsLeft, setSecsLeft] = useState(secsFromDeadline);
  const submittedRef = useRef(false);

  const q = questions[idx];

  const submit = async () => {
    if (submittedRef.current || useExamStore.getState().submitting) return;
    submittedRef.current = true;
    await submitStore();
    if (useExamStore.getState().stage !== "results")
      submittedRef.current = false;
  };

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
    "7", "8", "9", "÷",
    "4", "5", "6", "×",
    "1", "2", "3", "−",
    "0", ".", "=", "+",
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
