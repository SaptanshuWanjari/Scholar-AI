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
  { label: "Clustering Courses", icon: Network },
  { label: "Extracting Concepts", icon: Cpu },
  { label: "Generating Recommendations", icon: Database },
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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const completedRef = useRef(false);

  // Poll for all files completed, then fetch analysis
  useEffect(() => {
    const check = async () => {
      const allDone = files.length > 0 && files.every((f) => f.status === "completed" || f.status === "failed");
      
      // Update UI steps based on upload progress
      if (!allDone) {
        setStepStates((prev) => prev.map((s, i) => (i === 0 ? "done" : i === 1 ? "active" : "pending")));
        return;
      }
      
      if (completedRef.current) return;
      completedRef.current = true;

      const allFailed = files.every((f) => f.status === "failed");
      if (allFailed) {
        setErrorMsg("Ingestion failed for all files. Please check your documents and try again.");
        setStepStates(PIPELINE_STEPS.map(() => "pending"));
        return;
      }

      setStepStates((prev) => prev.map((s, i) => (i <= 1 ? "done" : i === 2 ? "active" : "pending")));

      // Simulate step 2, 3, 4 animating while waiting for analysis
      let simStep = 2;
      const simTimer = setInterval(() => {
        if (simStep < 4) {
          simStep++;
          setStepStates((prev) => prev.map((s, i) => (i < simStep ? "done" : i === simStep ? "active" : "pending")));
        }
      }, 1500);

      try {
        const result = await api.onboardingAnalysis();
        clearInterval(simTimer);
        setLocalAnalysis(result);
        setAnalysis(result);

        if (result.documents === 0) {
            throw new Error("Analysis completed but no documents were indexed.");
        }

        setStepStates((prev) => prev.map((s, i) => (i <= 4 ? "done" : i === 5 ? "active" : "pending")));

        const topTopic = result.topics.length > 0 ? result.topics[0] : "Comprehensive Roadmap";
        const topCourse = result.courses.length > 0 ? result.courses[0] : null;

        const path = await api.generateLearningPath({
          topic: topTopic,
          course: topCourse,
          ragMode: "fallback",
        });

        setStepStates(PIPELINE_STEPS.map(() => "done"));
        setTimeout(() => navigate(`/onboarding/ready?pathId=${path.id}`), 1500);
      } catch (e) {
        clearInterval(simTimer);
        console.error(e);
        setErrorMsg(e instanceof Error ? e.message : "Failed to analyze library. The AI might be unavailable.");
        setStepStates(PIPELINE_STEPS.map((s, i) => (i <= 4 ? "done" : "pending")));
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

        {errorMsg && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 rounded-xl border border-danger/40 bg-danger-soft p-4 text-center">
            <p className="text-sm font-medium text-danger">{errorMsg}</p>
            <button onClick={() => navigate("/onboarding")} className="mt-3 text-xs font-semibold text-danger underline underline-offset-2">
              Go Back
            </button>
          </motion.div>
        )}

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
              <div className="flex flex-wrap items-start content-start gap-1.5 min-h-[60px]">
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
              <div className="flex flex-wrap items-start content-start gap-1.5 min-h-[60px]">
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
                <StatCounter label="Courses" value={analysis.courses.length} />
                <StatCounter label="Concepts" value={analysis.concepts.length} />
                <StatCounter label="Topics" value={analysis.topics.length} />
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
