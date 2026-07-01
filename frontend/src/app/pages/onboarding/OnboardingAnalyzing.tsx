import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  CheckCircle2,
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
import { PaperCard } from "@paper-ui/core";
import { PaperH2, PaperH5, PaperIconCircle } from "@paper-ui/core";
import { PaperBadge } from "@paper-ui/components/badges";
import { LoadingPaper } from "@paper-ui/components/feedback";

const PIPELINE_STEPS = [
  { label: "Extracting Text",           icon: FileText },
  { label: "Analyzing Structure",       icon: Layers },
  { label: "Detecting Topics",          icon: Tag },
  { label: "Indexing Library",          icon: Network },
  { label: "Extracting Concepts",       icon: Cpu },
  { label: "Generating Recommendations", icon: Database },
  { label: "Preparing Workspace",       icon: Sparkles },
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
      <div className="font-caveat text-[28px] font-semibold tabular-nums text-ink">{displayed}</div>
      <div className="mt-0.5 font-architect text-[11px] uppercase tracking-wide text-ink-muted">{label}</div>
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

  useEffect(() => {
    const check = async () => {
      const allDone = files.length > 0 && files.every((f) => f.status === "completed" || f.status === "failed");

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

        const path = await api.generateLearningPath({
          topic: topTopic,
          course: null,
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f5f0e8] px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-3xl"
      >
        <div className="mb-8 text-center">
          <PaperH2>Analyzing your library</PaperH2>
          <p className="mt-2 font-kalam text-[14px] text-ink-muted">
            ScholarAI is processing your documents and building your knowledge workspace.
          </p>
        </div>

        {errorMsg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <PaperCard surface="#fdf0ef" border={{ stroke: "#9f3a36", strokeWidth: 1.6 }} shadow="sm" className="p-4 text-center">
              <p className="font-architect text-[14px] text-[#9f3a36]">{errorMsg}</p>
              <button
                onClick={() => navigate("/onboarding")}
                className="mt-3 font-kalam text-[12px] text-[#9f3a36] underline underline-offset-2"
              >
                Go Back
              </button>
            </PaperCard>
          </motion.div>
        )}

        <div className="grid gap-6 md:grid-cols-[1fr_280px]">
          {/* Pipeline steps */}
          <PaperCard shadow="md" className="p-6">
            <PaperH5 className="mb-5">Processing Pipeline</PaperH5>
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
                    <PaperIconCircle
                      tone={state === "done" ? "sage" : state === "active" ? "lavender" : "ink"}
                      size={32}
                    >
                      {state === "done" ? (
                        <CheckCircle2 size={14} />
                      ) : state === "active" ? (
                        <LoadingPaper variant="spinner" size="sm" />
                      ) : (
                        <Circle size={14} />
                      )}
                    </PaperIconCircle>
                    <span
                      className={`font-architect text-[13px] transition-colors ${
                        state === "done"
                          ? "text-ink"
                          : state === "active"
                          ? "text-ink font-medium"
                          : "text-ink-muted/50"
                      }`}
                    >
                      {step.label}
                    </span>
                    {state === "active" && (
                      <Icon size={12} className="ml-auto text-ink-muted/60 animate-pulse" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </PaperCard>

          {/* Live discovery */}
          <div className="space-y-4">
            {/* Topics */}
            <PaperCard shadow="sm" className="p-5">
              <PaperH5 className="mb-3">Detected Topics</PaperH5>
              <div className="flex flex-wrap items-start content-start gap-1.5 min-h-[60px]">
                <AnimatePresence>
                  {(analysis?.topics ?? []).map((t) => (
                    <motion.span
                      key={t}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <PaperBadge tone="lavender">{t}</PaperBadge>
                    </motion.span>
                  ))}
                  {!analysis && (
                    <span className="font-kalam text-[12px] text-ink-muted/40">Scanning…</span>
                  )}
                </AnimatePresence>
              </div>
            </PaperCard>

            {/* Concepts */}
            <PaperCard shadow="sm" className="p-5">
              <PaperH5 className="mb-3">Detected Concepts</PaperH5>
              <div className="flex flex-wrap items-start content-start gap-1.5 min-h-[60px]">
                <AnimatePresence>
                  {(analysis?.concepts ?? []).map((c) => (
                    <motion.span
                      key={c}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <PaperBadge tone="ink">{c}</PaperBadge>
                    </motion.span>
                  ))}
                  {!analysis && (
                    <span className="font-kalam text-[12px] text-ink-muted/40">Extracting…</span>
                  )}
                </AnimatePresence>
              </div>
            </PaperCard>

            {/* Stats */}
            {analysis && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <PaperCard shadow="sm" className="p-5">
                  <div className="grid grid-cols-2 gap-4">
                    <StatCounter label="Documents" value={analysis.documents} />
                    <StatCounter label="Pages"     value={analysis.pages} />
                    <StatCounter label="Concepts"  value={analysis.concepts.length} />
                    <StatCounter label="Topics"    value={analysis.topics.length} />
                  </div>
                </PaperCard>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
