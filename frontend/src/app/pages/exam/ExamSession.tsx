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
import { toast } from "@/app/lib/toast";
import { cn } from "../../components/ui/utils";
import { PaperButton, GhostButton, IconButton, ChipButton } from "@paper-ui/components/buttons";
import { PaperBadge } from "@paper-ui/components/badges";
import { PaperTextarea } from "@paper-ui/components/inputs";
import { SketchProgress } from "@paper-ui/components/progress";
import { SectionLabel, PaperPanel } from "@paper-ui/core";
import { SketchDivider } from "@paper-ui/components/decorations";
import { formulaSheet, type ExamQuestion } from "../../lib/exam-data";
import { useExamStore } from "../../stores/useExamStore";

export function diffCls(d: string) {
  return d === "Easy"
    ? "border-success/40 bg-success-soft text-success"
    : d === "Medium"
      ? "border-warning/40 bg-warning-soft text-warning"
      : "border-danger/40 bg-danger-soft text-danger";
}

const DIFF_TONE = (d: string): "sage" | "ochre" | "brick" => {
  if (d === "Easy") return "sage";
  if (d === "Medium") return "ochre";
  return "brick";
};

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
      {/* Top bar */}
      <div className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-5">
        <PaperIconRow>
          <GraduationCap className="size-4 text-primary" />
        </PaperIconRow>
        <span className="font-architect text-[14px] text-ink">
          Mock Exam — {difficultyLabel}
        </span>

        {/* Progress bar */}
        <div className="ml-4 hidden items-center gap-3 sm:flex flex-1 max-w-xs">
          <SketchProgress
            value={(answeredCount / questions.length) * 100}
            height={10}
            color="#7fa37b"
            className="flex-1"
          />
          <span className="font-kalam text-xs text-ink-muted shrink-0">
            {answeredCount}/{questions.length} answered
          </span>
        </div>

        {/* Timer */}
        <div
          className={cn(
            "ml-auto flex items-center gap-1.5 font-mono text-[13px] tabular-nums px-3 py-1.5 rounded-lg border",
            low
              ? "border-danger/40 bg-danger-soft text-danger"
              : "border-border bg-card",
          )}
        >
          <Clock className="size-3.5" /> {mm}:{ss}
        </div>

        <IconButton
          label={panelOpen ? "Close tools panel" : "Open tools panel"}
          onClick={() => setPanelOpen((o) => !o)}
        >
          {panelOpen ? (
            <PanelRightClose className="size-4" />
          ) : (
            <PanelRightOpen className="size-4" />
          )}
        </IconButton>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Left nav sidebar */}
        <aside className="hidden w-[200px] shrink-0 flex-col overflow-y-auto border-r border-border bg-card/40 px-3 py-4 md:flex">
          <SectionLabel className="mb-3 px-1 text-[11px]">Questions</SectionLabel>
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
                    "relative flex aspect-square items-center justify-center rounded-md border font-architect text-xs transition-colors",
                    isCurrent && "border-primary bg-primary/10 text-primary font-bold",
                    !isCurrent && isAnswered && "border-success/40 bg-success-soft text-success",
                    !isCurrent && isSkipped && "border-warning/40 bg-warning-soft text-warning",
                    !isCurrent && !isAnswered && !isSkipped && "border-border bg-card text-ink-muted hover:border-ink-muted/40",
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

          <SketchDivider variant="dashed" className="my-4 opacity-40" />

          <div className="space-y-1.5 font-kalam text-[11px] text-ink-muted">
            <Legend cls="bg-success-soft border-success/40 border" label="Answered" />
            <Legend cls="bg-warning-soft border-warning/40 border" label="Skipped" />
            <Legend cls="bg-primary/10 border-primary border" label="Current" />
            <Legend cls="bg-card border-border border" label="Unseen" />
          </div>
        </aside>

        {/* Main question area */}
        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-2xl px-8 py-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-kalam text-sm text-ink-muted">
                  Question {idx + 1}
                </span>
                <PaperBadge tone="ink" className="text-[10px]">
                  {q.topic}
                </PaperBadge>
                <PaperBadge tone={DIFF_TONE(q.difficulty)} className="text-[10px]">
                  {q.difficulty}
                </PaperBadge>
              </div>
              <GhostButton
                size="sm"
                className={cn("gap-1.5 text-xs", isFlagged(q.id) && "text-danger")}
                onClick={toggleFlag}
              >
                <Flag
                  className={cn("size-3.5", isFlagged(q.id) && "fill-danger")}
                />
                {isFlagged(q.id) ? "Flagged" : "Flag"}
              </GhostButton>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={q.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.18 }}
              >
                <h2 className="mt-4 font-reading text-[1.6rem] leading-snug text-ink">
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

            <SketchDivider variant="wavy" className="mt-8 mb-5" />

            <div className="flex items-center justify-between">
              <PaperButton
                tone="paper"
                disabled={idx === 0}
                onClick={() => goto(idx - 1)}
                className="gap-1.5"
              >
                <ChevronLeft className="size-4" /> Previous
              </PaperButton>
              {idx === questions.length - 1 ? (
                <PaperButton
                  tone="dark"
                  onClick={submit}
                  disabled={submitting}
                  className="gap-1.5"
                >
                  {submitting ? (
                    <><Loader2 className="size-4 animate-spin" /> Submitting…</>
                  ) : (
                    <><Check className="size-4" /> Submit Exam</>
                  )}
                </PaperButton>
              ) : (
                <PaperButton
                  tone="dark"
                  onClick={() => goto(idx + 1)}
                  className="gap-1.5"
                >
                  Next <ChevronRight className="size-4" />
                </PaperButton>
              )}
            </div>
          </div>
        </main>

        {/* Right tools panel */}
        <AnimatePresence>
          {panelOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="shrink-0 overflow-hidden border-l border-border bg-card/40"
            >
              <div className="w-[300px] space-y-5 overflow-y-auto px-4 py-4">
                <PanelBlock title="Formula Sheet" icon={Sigma}>
                  {formulaSheet.map((f) => (
                    <PaperPanel key={f.name} className="px-3 py-2">
                      <div className="font-kalam text-[11px] text-ink-muted">
                        {f.name}
                      </div>
                      <div className="mt-0.5 font-mono text-sm text-ink">
                        {f.formula}
                      </div>
                    </PaperPanel>
                  ))}
                </PanelBlock>

                <SketchDivider variant="dashed" className="opacity-40" />

                <PanelBlock title="Reference Notes" icon={NotebookPen}>
                  <p className="font-kalam text-sm leading-relaxed text-ink/80">
                    Self-attention lets each token weigh all others; scaling by
                    √dₖ stabilizes gradients.
                  </p>
                </PanelBlock>

                <SketchDivider variant="dashed" className="opacity-40" />

                <PanelBlock title="Calculator" icon={CalcIcon}>
                  <MiniCalculator />
                </PanelBlock>

                <SketchDivider variant="dashed" className="opacity-40" />

                <PanelBlock title="Exam Settings" icon={Settings2}>
                  <p className="font-kalam text-sm text-ink-muted">
                    Font size, high contrast and timer visibility.
                  </p>
                </PanelBlock>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── AnswerArea ───────────────────────────────────────────────────────────────

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
      <PaperTextarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        rows={8}
        placeholder="Write your answer…"
        className="font-reading"
      />
    );
  if (q.type === "short")
    return (
      <PaperTextarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        placeholder="Type a short answer…"
        className="font-reading"
      />
    );
  return (
    <div className="space-y-2">
      {q.options?.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl border p-3.5 text-left font-architect text-sm transition-colors",
            value === opt
              ? "border-primary/60 bg-primary/8 text-primary"
              : "border-border bg-card text-ink hover:border-ink-muted/40",
          )}
        >
          <span
            className={cn(
              "flex size-5 shrink-0 items-center justify-center rounded-full border font-architect",
              value === opt
                ? "border-primary bg-primary text-white"
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

// ─── MiniCalculator ───────────────────────────────────────────────────────────

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
    <PaperPanel className="p-2">
      <div className="mb-2 px-3 py-2 text-right font-mono text-lg tabular-nums text-ink">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-1">
        <ChipButton
          onClick={clear}
          className="col-span-4 justify-center"
          selected={false}
        >
          Clear
        </ChipButton>
        {keys.map((k) => {
          const isOp = ["÷", "×", "−", "+", "="].includes(k);
          return (
            <ChipButton
              key={k}
              selected={isOp}
              onClick={() =>
                k === "="
                  ? equals()
                  : isOp
                    ? chooseOp(k)
                    : k === "."
                      ? dot()
                      : inputDigit(k)
              }
              className="justify-center py-2"
            >
              {k}
            </ChipButton>
          );
        })}
      </div>
    </PaperPanel>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Legend({ cls, label }: { cls: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn("size-3 rounded", cls)} /> {label}
    </div>
  );
}

function PaperIconRow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center justify-center size-7 rounded-full bg-lavender-soft text-primary shrink-0">
      {children}
    </span>
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
      <div className="mb-2 flex items-center gap-1.5">
        <Icon className="size-3.5 text-ink-muted" />
        <SectionLabel className="text-[11px]">{title}</SectionLabel>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
