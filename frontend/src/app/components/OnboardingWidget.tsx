import { useEffect, useState } from "react";
import { toast } from "@/app/lib/toast";
import { useNavigate } from "react-router";
import {
  CheckCircle2,
  Milestone,
  AlertCircle,
  X,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PaperButton, FloatingActionButton, IconButton } from "@paper-ui/components/buttons";
import { PaperCard, PaperH2, PaperH3, PaperIconCircle, PaperH5 } from "@paper-ui/core";
import { LoadingPaper } from "@paper-ui/components/feedback";
import { ArrowDoodle } from "@paper-ui/components/doodles";
import { useOnboarding } from "../context/OnboardingContext";
import { api, type LearningPath } from "../lib/api";

export default function OnboardingWidget() {
  const navigate = useNavigate();
  const { files, analysis, setAnalysis } = useOnboarding();

  const [status, setStatus] = useState<"idle" | "uploading" | "analyzing" | "ready" | "closed">("idle");
  const [path, setPath] = useState<LearningPath | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isActive = files.length > 0 && status !== "closed";

  useEffect(() => {
    if (files.length > 0 && status === "idle") {
      setStatus("uploading");
    }
  }, [files, status]);

  useEffect(() => {
    if (!isActive) return;

    const allDone = files.length > 0 && files.every((f) => f.status === "completed" || f.status === "failed");

    if (allDone && status === "uploading") {
      const allFailed = files.every((f) => f.status === "failed");
      if (allFailed) {
        setErrorMsg("Ingestion failed. Please check documents.");
        return;
      }

      setStatus("analyzing");

      api.onboardingAnalysis()
        .then((result) => {
          setAnalysis(result);
          if (result.documents === 0) throw new Error("No documents indexed.");
          const topTopic = result.topics.length > 0 ? result.topics[0] : "Comprehensive Roadmap";
          return api.generateLearningPath({ topic: topTopic, course: null, ragMode: "fallback" });
        })
        .then((p) => {
          setPath(p);
          setStatus("ready");
          setIsOpen(true);
        })
        .catch((e) => {
          toast.error(e instanceof Error ? e.message : "Analysis failed");
          setErrorMsg(e instanceof Error ? e.message : "Analysis failed");
        });
    }
  }, [files, isActive, status, setAnalysis]);

  if (!isActive) return null;

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <FloatingActionButton
              label={status === "ready" ? "View analysis results" : "View import progress"}
              tone="dark"
              size="md"
              onClick={() => setIsOpen(true)}
            >
              {status === "uploading" || status === "analyzing" ? (
                <LoadingPaper variant="spinner" size="sm" className="text-white" />
              ) : status === "ready" ? (
                <CheckCircle2 size={22} />
              ) : errorMsg ? (
                <AlertCircle size={22} />
              ) : null}
            </FloatingActionButton>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-[2px]">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto"
            >
              <PaperCard shadow="lg" className="p-8">
                {/* Close button */}
                <div className="absolute right-6 top-6 z-10">
                  <IconButton label="Close" onClick={() => setIsOpen(false)}>
                    <X size={18} />
                  </IconButton>
                </div>

                {/* Loading state */}
                {(status === "uploading" || status === "analyzing") && !errorMsg && (
                  <div className="flex h-[40vh] flex-col items-center justify-center text-center">
                    <LoadingPaper variant="dots" size="lg" />
                    <PaperH3 className="mt-6">
                      {status === "uploading" ? "Ingesting Documents…" : "Analyzing Library…"}
                    </PaperH3>
                    <p className="mt-2 font-kalam  text-ink-muted max-w-sm">
                      You can close this and continue using the app while we process in the background.
                    </p>
                  </div>
                )}

                {/* Error state */}
                {errorMsg && (
                  <div className="flex h-[40vh] flex-col items-center justify-center text-center">
                    <PaperIconCircle tone="brick" size={48}>
                      <AlertCircle size={22} />
                    </PaperIconCircle>
                    <PaperH3 className="mt-4">Something went wrong</PaperH3>
                    <p className="mt-2 font-kalam text-[13px] text-ink-muted">{errorMsg}</p>
                  </div>
                )}

                {/* Ready state */}
                {status === "ready" && analysis && (
                  <div>
                    <div className="mb-8 text-center">
                      <div className="mx-auto mb-5 inline-flex">
                        <PaperIconCircle tone="sage" size={56}>
                          <CheckCircle2 size={26} />
                        </PaperIconCircle>
                      </div>
                      <PaperH2>Welcome to your AI Study Workspace</PaperH2>
                      <p className="mt-2 font-kalam text-[14px] text-ink-muted">
                        Your library has been analyzed and your learning path is ready.
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-5">
                      {[
                        { label: "Documents",  value: analysis.documents },
                        { label: "Concepts",   value: analysis.concepts?.length || 0 },
                        { label: "Graph Nodes", value: (analysis.concepts?.length || 0) * 2 },
                        { label: "Topics",     value: analysis.topics?.length || 0 },
                        { label: "Study Hrs",  value: path?.overview?.estimatedHours ?? "~" },
                      ].map(({ label, value }) => (
                        <PaperCard key={label} shadow="sm" className="p-4 text-center">
                          <div className="font-caveat text-[26px] font-semibold tabular-nums text-ink">{value}</div>
                          <div className="mt-1 font-architect text-[11px] uppercase tracking-wide text-ink-muted">{label}</div>
                        </PaperCard>
                      ))}
                    </div>

                    {/* Learning path preview */}
                    {path && (
                      <PaperCard shadow="sm" className="mb-8 p-6">
                        <div className="mb-6 flex items-center gap-3">
                          <PaperIconCircle tone="lavender" size={40}>
                            <Milestone size={18} />
                          </PaperIconCircle>
                          <div>
                            <PaperH3>{path.title}</PaperH3>
                            <p className="font-kalam text-[12px] text-ink-muted">Your personalized roadmap</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {path.stages.slice(0, 3).map((stage, i) => (
                            <div key={i} className="flex items-start gap-4">
                              <div className="mt-1 flex flex-col items-center">
                                <span className="flex size-6 items-center justify-center rounded-full bg-[#e8e3d8] font-architect text-[11px] text-ink">
                                  {i + 1}
                                </span>
                                {i < Math.min(path.stages.length, 3) - 1 && (
                                  <div className="my-1 h-10 w-px bg-[#d4cfc2]" />
                                )}
                              </div>
                              <div>
                                <p className="font-architect text-[14px] text-ink">{stage.title}</p>
                                <p className="mt-1 line-clamp-1 font-kalam text-[12px] text-ink-muted">{stage.summary}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </PaperCard>
                    )}

                    <div className="flex justify-center pt-4">
                      <PaperButton
                        tone="dark"
                        size="lg"
                        onClick={() => {
                          setStatus("closed");
                          setIsOpen(false);
                          navigate(path ? `/learning-path/${path.id}` : "/learning-path");
                        }}
                      >
                        Enter Workspace
                        <ArrowDoodle size={20} color="#fbf8f2" />
                      </PaperButton>
                    </div>
                  </div>
                )}
              </PaperCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
