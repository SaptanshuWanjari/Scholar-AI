import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Network,
  BookOpen,
  Sparkles,
  Layers,
  ArrowRight,
  CheckCircle2,
  Milestone,
  Library,
  Settings,
} from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../../components/ui/button";
import { useOnboarding } from "../../context/OnboardingContext";
import { api, type LearningPath } from "../../lib/api";

function completeOnboarding(navigate: ReturnType<typeof useNavigate>, to = "/") {
  localStorage.setItem("scholar_onboarding_done", "1");
  navigate(to, { replace: true });
}

export function OnboardingReady() {
  const navigate = useNavigate();
  const { analysis } = useOnboarding();
  const [path, setPath] = useState<LearningPath | null>(null);

  useEffect(() => {
    if (!analysis) {
      navigate("/onboarding", { replace: true });
    }
  }, [analysis, navigate]);

  useEffect(() => {
    const pathId = new URLSearchParams(window.location.search).get("pathId");
    if (pathId) {
      api.getLearningPath(pathId).then(setPath).catch(console.error);
    }
  }, []);

  if (!analysis) return null;

  return (
    <div className="flex min-h-screen flex-col items-center bg-background px-6 py-16 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-4xl mt-8"
      >
        <div className="mb-10 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
            className="mx-auto mb-5 flex size-16 items-center justify-center rounded-xl bg-success-soft text-success"
          >
            <CheckCircle2 className="size-8" />
          </motion.div>
          <h2 className="text-3xl font-semibold tracking-tight">Welcome to your AI Study Workspace</h2>
          <p className="mt-2 text-muted-foreground">Your library has been analyzed and your learning path is ready.</p>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-6 mb-8">
          {[
            { label: "Documents", value: analysis.documents },
            { label: "Courses", value: analysis.courses?.length || 0 },
            { label: "Concepts", value: analysis.concepts?.length || 0 },
            { label: "Graph Nodes", value: (analysis.concepts?.length || 0) * 2 },
            { label: "Topics", value: analysis.topics?.length || 0 },
            { label: "Study Hrs", value: path?.overview?.estimatedHours ?? "~" },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl border border-border bg-card p-4 text-center">
              <div className="text-2xl font-semibold tabular-nums text-foreground">{value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>

        {/* Learning Path Preview */}
        {path && (
          <div className="rounded-2xl border border-border bg-card p-6 mb-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
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
                <div key={i} className="flex gap-4 items-start">
                  <div className="flex flex-col items-center mt-1">
                    <div className="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-medium">{i + 1}</div>
                    {i < Math.min(path.stages.length, 3) - 1 && <div className="w-px h-10 bg-border my-1" />}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{stage.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{stage.description}</p>
                    <div className="flex gap-2 mt-2">
                      {stage.concepts.slice(0, 3).map((c, j) => (
                        <span key={j} className="text-[10px] px-2 py-0.5 rounded-full bg-muted/50 border border-border text-muted-foreground">
                          {c.title}
                        </span>
                      ))}
                      {stage.concepts.length > 3 && <span className="text-[10px] text-muted-foreground">+{stage.concepts.length - 3}</span>}
                    </div>
                  </div>
                </div>
              ))}
              {path.stages.length > 3 && (
                <div className="text-center pt-2">
                  <span className="text-xs text-muted-foreground italic">+{path.stages.length - 3} more stages...</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="mb-10">
          <p className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Explore Workspace
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Browse Library", icon: Library, to: "/documents" },
              { label: "Knowledge Graph", icon: Network, to: "/knowledge" },
              { label: "Reading Mode", icon: BookOpen, to: "/reading" },
              { label: "Ask AI", icon: Sparkles, to: "/ask" },
              { label: "Flashcards", icon: Layers, to: "/flashcards" },
              { label: "Settings", icon: Settings, to: "/settings" },
            ].map(({ label, icon: Icon, to }) => (
              <button
                key={label}
                onClick={() => completeOnboarding(navigate, to)}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 text-left transition-colors hover:border-primary/40 hover:bg-accent/40"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Icon className="size-4" />
                </div>
                <span className="flex-1 truncate text-sm font-medium text-foreground">{label}</span>
                <ArrowRight className="size-3.5 text-muted-foreground shrink-0 opacity-50" />
              </button>
            ))}
          </div>
        </div>

        {/* Primary action */}
        <div className="flex justify-center pb-16">
          <Button
            size="lg"
            className="gap-2 bg-primary px-12 text-lg font-medium text-primary-foreground hover:bg-primary/90 shadow-lg"
            onClick={() => completeOnboarding(navigate, path ? `/learning-path/${path.id}` : "/learning-path")}
          >
            Enter Workspace
            <ArrowRight className="size-5" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
