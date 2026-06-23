import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  CheckCircle2,
  Loader2,
  Circle,
  FileText,
  Tag,
  Network,
  Cpu,
  Database,
  Layers,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { api } from "../../lib/api";
import { useOnboarding, type OnboardingAnalysis } from "../../context/OnboardingContext";

const PIPELINE_STEPS = [
  { label: "Extracting Text", icon: FileText },
  { label: "Analyzing Structure", icon: Layers },
  { label: "Detecting Topics", icon: Tag },
  { label: "Building Knowledge Graph", icon: Network },
  { label: "Generating Embeddings", icon: Cpu },
  { label: "Indexing Sources", icon: Database },
  { label: "Preparing Workspace", icon: Sparkles },
];

type StepState = "pending" | "active" | "done";

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!target) return;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.round(progress * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return value;
}

function StatCounter({ label, value }: { label: string; value: number }) {
  const displayed = useCountUp(value);
  return (
    <div className="text-center">
      <div className="text-2xl font-semibold tabular-nums text-foreground">{displayed}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

export function OnboardingAnalyzing() {
  const navigate = useNavigate();
  const { files, setAnalysis } = useOnboarding();

  const [stepStates, setStepStates] = useState<StepState[]>(
    PIPELINE_STEPS.map((_, i) => (i === 0 ? "active" : "pending")),
  );
  const [analysis, setLocalAnalysis] = useState<OnboardingAnalysis | null>(null);
  const completedRef = useRef(false);

  // Advance pipeline steps on a timer, gated by file completion
  useEffect(() => {
    const totalFiles = files.length || 1;
    const msPerStep = Math.max(800, (totalFiles * 3000) / PIPELINE_STEPS.length);

    let current = 0;
    const advance = () => {
      current += 1;
      if (current >= PIPELINE_STEPS.length) {
        setStepStates(PIPELINE_STEPS.map(() => "done"));
        return;
      }
      setStepStates((prev) =>
        prev.map((s, i) => {
          if (i < current) return "done";
          if (i === current) return "active";
          return "pending";
        }),
      );
      timerId = setTimeout(advance, msPerStep);
    };

    let timerId = setTimeout(advance, msPerStep);
    return () => clearTimeout(timerId);
  }, [files.length]);

  // Poll for all files completed, then fetch analysis
  useEffect(() => {
    const check = async () => {
      const allDone = files.length > 0 && files.every((f) => f.status === "completed" || f.status === "failed");
      if (!allDone || completedRef.current) return;
      completedRef.current = true;

      try {
        const result = await api.onboardingAnalysis();
        setLocalAnalysis(result);
        setAnalysis(result);
        setStepStates(PIPELINE_STEPS.map(() => "done"));
        setTimeout(() => navigate("/onboarding/ready"), 1800);
      } catch {
        setTimeout(() => navigate("/onboarding/ready"), 2000);
      }
    };

    const interval = setInterval(check, 800);
    return () => clearInterval(interval);
  }, [files, navigate, setAnalysis]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-3xl"
      >
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">Analyzing your library</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            ScholarAI is processing your documents and building your knowledge workspace.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_280px]">
          {/* Pipeline steps */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="mb-5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Processing Pipeline
            </p>
            <div className="space-y-3">
              {PIPELINE_STEPS.map((step, i) => {
                const state = stepStates[i];
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <div
                      className={`flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                        state === "done"
                          ? "bg-success-soft text-success"
                          : state === "active"
                          ? "bg-violet-soft text-primary"
                          : "bg-muted text-muted-foreground/40"
                      }`}
                    >
                      {state === "done" ? (
                        <CheckCircle2 className="size-4" />
                      ) : state === "active" ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Circle className="size-4" />
                      )}
                    </div>
                    <span
                      className={`text-sm transition-colors ${
                        state === "done"
                          ? "text-foreground"
                          : state === "active"
                          ? "font-medium text-foreground"
                          : "text-muted-foreground/50"
                      }`}
                    >
                      {step.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Live discovery */}
          <div className="space-y-4">
            {/* Topics */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Detected Topics
              </p>
              <div className="flex flex-wrap gap-1.5 min-h-[60px]">
                <AnimatePresence>
                  {(analysis?.topics ?? []).map((t) => (
                    <motion.span
                      key={t}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="rounded-full border border-primary/30 bg-violet-soft px-2.5 py-0.5 text-xs text-primary"
                    >
                      {t}
                    </motion.span>
                  ))}
                  {!analysis && (
                    <span className="text-xs text-muted-foreground/40">Scanning…</span>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Concepts */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Detected Concepts
              </p>
              <div className="flex flex-wrap gap-1.5 min-h-[60px]">
                <AnimatePresence>
                  {(analysis?.concepts ?? []).map((c) => (
                    <motion.span
                      key={c}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                    >
                      {c}
                    </motion.span>
                  ))}
                  {!analysis && (
                    <span className="text-xs text-muted-foreground/40">Extracting…</span>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Stats */}
            {analysis && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-5"
              >
                <StatCounter label="Documents" value={analysis.documents} />
                <StatCounter label="Pages" value={analysis.pages} />
                <StatCounter label="Concepts" value={analysis.concepts.length} />
                <StatCounter label="Sources" value={analysis.sources} />
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
