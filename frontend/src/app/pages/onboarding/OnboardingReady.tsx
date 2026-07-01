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
import { PaperButton } from "@paper-ui/components/buttons";
import { PaperCard, PaperH2, PaperH3, PaperIconCircle, PaperH5 } from "@paper-ui/core";
import { ArrowDoodle } from "@paper-ui/components/doodles";
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

  const stats = [
    { label: "Documents",  value: analysis.documents },
    { label: "Courses",    value: analysis.topics?.length || 0 },
    { label: "Concepts",   value: analysis.concepts?.length || 0 },
    { label: "Graph Nodes", value: (analysis.concepts?.length || 0) * 2 },
    { label: "Topics",     value: analysis.topics?.length || 0 },
    { label: "Study Hrs",  value: path?.overview?.estimatedHours ?? "~" },
  ];

  const quickLinks = [
    { label: "Browse Library",   icon: Library,  to: "/documents" },
    { label: "Knowledge Graph",  icon: Network,  to: "/knowledge" },
    { label: "Reading Mode",     icon: BookOpen, to: "/reading" },
    { label: "Ask AI",           icon: Sparkles, to: "/ask" },
    { label: "Flashcards",       icon: Layers,   to: "/flashcards" },
    { label: "Settings",         icon: Settings, to: "/settings" },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#f5f0e8] px-6 py-16 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-4xl mt-8"
      >
        {/* Hero */}
        <div className="mb-10 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
            className="mx-auto mb-5 inline-flex"
          >
            <PaperIconCircle tone="sage" size={64}>
              <CheckCircle2 size={30} />
            </PaperIconCircle>
          </motion.div>
          <PaperH2>Welcome to your AI Study Workspace</PaperH2>
          <p className="mt-2 font-kalam text-[14px] text-ink-muted">
            Your library has been analyzed and your learning path is ready.
          </p>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-6 mb-8">
          {stats.map(({ label, value }) => (
            <PaperCard key={label} shadow="sm" className="p-4 text-center">
              <div className="font-caveat text-[26px] font-semibold tabular-nums text-ink">{value}</div>
              <div className="mt-1 font-architect text-[11px] uppercase tracking-wide text-ink-muted">{label}</div>
            </PaperCard>
          ))}
        </div>

        {/* Learning Path Preview */}
        {path && (
          <PaperCard shadow="md" className="p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
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
                <div key={i} className="flex gap-4 items-start">
                  <div className="flex flex-col items-center mt-1">
                    <span className="flex size-6 items-center justify-center rounded-full bg-[#e8e3d8] font-architect text-[11px] text-ink">
                      {i + 1}
                    </span>
                    {i < Math.min(path.stages.length, 3) - 1 && (
                      <div className="w-px h-10 bg-[#d4cfc2] my-1" />
                    )}
                  </div>
                  <div>
                    <p className="font-architect text-[14px] text-ink">{stage.title}</p>
                    <p className="font-kalam text-[12px] text-ink-muted mt-1 line-clamp-1">{stage.summary}</p>
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {stage.concepts.slice(0, 3).map((c, j) => (
                        <span
                          key={j}
                          className="font-architect text-[10px] px-2 py-0.5 rounded-full bg-[#f0efed] border border-[#e0dad0] text-ink-muted"
                        >
                          {c.title}
                        </span>
                      ))}
                      {stage.concepts.length > 3 && (
                        <span className="font-architect text-[10px] text-ink-muted">
                          +{stage.concepts.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {path.stages.length > 3 && (
                <div className="text-center pt-2">
                  <span className="font-kalam text-[12px] text-ink-muted italic">
                    +{path.stages.length - 3} more stages…
                  </span>
                </div>
              )}
            </div>
          </PaperCard>
        )}

        {/* Quick Links */}
        <div className="mb-10">
          <PaperH5 className="mb-4">Explore Workspace</PaperH5>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {quickLinks.map(({ label, icon: Icon, to }) => (
              <button
                key={label}
                onClick={() => completeOnboarding(navigate, to)}
                className="group"
              >
                <PaperCard shadow="sm" lift className="p-3 text-left">
                  <div className="flex items-center gap-3">
                    <PaperIconCircle tone="ink" size={32}>
                      <Icon size={14} />
                    </PaperIconCircle>
                    <span className="flex-1 font-architect text-[13px] text-ink truncate">{label}</span>
                    <ArrowRight size={13} className="text-ink-muted/50 shrink-0" />
                  </div>
                </PaperCard>
              </button>
            ))}
          </div>
        </div>

        {/* Primary action */}
        <div className="flex justify-center pb-16">
          <PaperButton
            tone="dark"
            size="lg"
            onClick={() => completeOnboarding(navigate, path ? `/learning-path/${path.id}` : "/learning-path")}
          >
            Enter Workspace
            <ArrowDoodle size={20} color="#fbf8f2" />
          </PaperButton>
        </div>
      </motion.div>
    </div>
  );
}
