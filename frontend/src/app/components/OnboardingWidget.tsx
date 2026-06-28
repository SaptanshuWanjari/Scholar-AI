import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Loader2,
  CheckCircle2,
  Network,
  BookOpen,
  Sparkles,
  Layers,
  ArrowRight,
  Milestone,
  Library,
  Settings,
  X,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
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
          setIsOpen(true); // Open automatically when ready
        })
        .catch((e) => {
          console.error(e);
          setErrorMsg(e instanceof Error ? e.message : "Analysis failed");
        });
    }
  }, [files, isActive, status, setAnalysis]);

  if (!isActive) return null;

  return (
    <>
      {/* Floating Circle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            {status === "uploading" || status === "analyzing" ? (
              <Loader2 className="size-6 animate-spin" />
            ) : status === "ready" ? (
              <CheckCircle2 className="size-6" />
            ) : errorMsg ? (
              <AlertCircle className="size-6" />
            ) : null}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expanded Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 px-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-border bg-card p-8 shadow-2xl"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-6 top-6 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-5" />
              </button>

              {status === "uploading" || status === "analyzing" ? (
                <div className="flex h-[40vh] flex-col items-center justify-center text-center">
                  <Loader2 className="mb-4 size-10 animate-spin text-primary" />
                  <h3 className="text-xl font-semibold">
                    {status === "uploading" ? "Ingesting Documents..." : "Analyzing Library..."}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    You can close this modal and continue using the app while we process in the background.
                  </p>
                </div>
              ) : errorMsg ? (
                <div className="flex h-[40vh] flex-col items-center justify-center text-center text-danger">
                  <AlertCircle className="mb-4 size-10" />
                  <h3 className="text-xl font-semibold">Something went wrong</h3>
                  <p className="mt-2 text-sm">{errorMsg}</p>
                </div>
              ) : status === "ready" && analysis ? (
                <div>
                  <div className="mb-8 text-center">
                    <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-xl bg-success-soft text-success">
                      <CheckCircle2 className="size-7" />
                    </div>
                    <h2 className="text-3xl font-semibold tracking-tight">Welcome to your AI Study Workspace</h2>
                    <p className="mt-2 text-muted-foreground">Your library has been analyzed and your learning path is ready.</p>
                  </div>

                  <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-6">
                    {[
                      { label: "Documents", value: analysis.documents },
                      { label: "Concepts", value: analysis.concepts?.length || 0 },
                      { label: "Graph Nodes", value: (analysis.concepts?.length || 0) * 2 },
                      { label: "Topics", value: analysis.topics?.length || 0 },
                      { label: "Study Hrs", value: path?.overview?.estimatedHours ?? "~" },
                    ].map(({ label, value }) => (
                      <div key={label} className="rounded-xl border border-border bg-background p-4 text-center">
                        <div className="text-2xl font-semibold tabular-nums text-foreground">{value}</div>
                        <div className="mt-1 text-xs text-muted-foreground">{label}</div>
                      </div>
                    ))}
                  </div>

                  {path && (
                    <div className="mb-8 rounded-2xl border border-border bg-background p-6 shadow-sm">
                      <div className="mb-6 flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Milestone className="size-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{path.title}</h3>
                          <p className="text-sm text-muted-foreground">Your personalized roadmap</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {path.stages.slice(0, 3).map((stage, i) => (
                          <div key={i} className="flex items-start gap-4">
                            <div className="mt-1 flex flex-col items-center">
                              <div className="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-medium">{i + 1}</div>
                              {i < Math.min(path.stages.length, 3) - 1 && <div className="my-1 h-10 w-px bg-border" />}
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">{stage.title}</h4>
                              <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{stage.summary}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-center pt-4">
                    <Button
                      size="lg"
                      className="gap-2 bg-primary px-12 text-lg font-medium text-primary-foreground shadow-lg hover:bg-primary/90"
                      onClick={() => {
                        setStatus("closed");
                        setIsOpen(false);
                        navigate(path ? `/learning-path/${path.id}` : "/learning-path");
                      }}
                    >
                      Enter Workspace
                      <ArrowRight className="size-5" />
                    </Button>
                  </div>
                </div>
              ) : null}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
