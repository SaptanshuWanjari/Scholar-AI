import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Network,
  BookOpen,
  Sparkles,
  Notebook,
  Layers,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
} from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";
import { useOnboarding } from "../../context/OnboardingContext";

const STARTING_POINTS = [
  { icon: Network, label: "Explore Knowledge Graph", to: "/knowledge" },
  { icon: BookOpen, label: "Open Reading Mode", to: "/reading" },
  { icon: Sparkles, label: "Ask Your Library", to: "/ask" },
  { icon: Notebook, label: "Create Notebook", to: "/notebooks" },
  { icon: Layers, label: "Generate Flashcards", to: "/flashcards" },
];

function completeOnboarding(navigate: ReturnType<typeof useNavigate>, to = "/") {
  localStorage.setItem("scholar_onboarding_done", "1");
  navigate(to, { replace: true });
}

export function OnboardingReady() {
  const navigate = useNavigate();
  const { analysis } = useOnboarding();
  const [modalOpen, setModalOpen] = useState(true);

  const docs = analysis?.documents ?? 0;
  const topics = analysis?.topics ?? [];
  const concepts = analysis?.concepts ?? [];
  const collections = topics.slice(0, 5);

  useEffect(() => {
    if (!analysis) {
      // Arrived directly (e.g. refresh) — send to hero
      navigate("/onboarding", { replace: true });
    }
  }, [analysis, navigate]);

  if (!analysis) return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-16">
      {/* Welcome modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap className="size-5" />
            </div>
            <DialogTitle className="text-xl">Library Ready</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              ScholarAI analyzed your documents and created an initial knowledge workspace.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 space-y-4">
            {topics.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Detected Topics
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {topics.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-primary/30 bg-violet-soft px-2.5 py-0.5 text-xs text-primary"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Generated
              </p>
              <div className="space-y-1">
                {["Knowledge Graph", "Source Index", "Collections", "Notebook Structure"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="size-3.5 text-success" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Button
            className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => setModalOpen(false)}
          >
            Continue
          </Button>
        </DialogContent>
      </Dialog>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl"
      >
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
            className="mx-auto mb-4 flex size-14 items-center justify-center rounded-xl bg-success-soft text-success"
          >
            <CheckCircle2 className="size-7" />
          </motion.div>
          <h2 className="text-2xl font-semibold tracking-tight">Your workspace is ready.</h2>
        </div>

        {/* Summary card */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="mb-4 text-sm font-medium text-muted-foreground">Library Summary</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Documents Imported", value: docs },
              { label: "Detected Topics", value: topics.length },
              { label: "Detected Concepts", value: concepts.length },
              { label: "Collections", value: collections.length },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-semibold tabular-nums text-foreground">{value}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>

          {/* Collections */}
          {collections.length > 0 && (
            <div className="mt-5 border-t border-border pt-5">
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Auto-generated Collections
              </p>
              <div className="flex flex-wrap gap-2">
                {collections.map((c) => (
                  <span
                    key={c}
                    className="rounded-lg border border-border bg-muted px-3 py-1 text-sm text-foreground"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Suggested starting points */}
        <div className="mt-6">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Suggested Starting Points
          </p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {STARTING_POINTS.map(({ icon: Icon, label, to }, i) => (
              <motion.button
                key={label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                onClick={() => completeOnboarding(navigate, to)}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/40 hover:bg-accent/40"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Icon className="size-4" />
                </div>
                <span className="flex-1 text-sm text-foreground">{label}</span>
                <ArrowRight className="size-3.5 text-muted-foreground" />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Primary action */}
        <div className="mt-8 flex justify-center">
          <Button
            size="lg"
            className="gap-2 bg-primary px-10 text-primary-foreground hover:bg-primary/90"
            onClick={() => completeOnboarding(navigate)}
          >
            Open Workspace
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
