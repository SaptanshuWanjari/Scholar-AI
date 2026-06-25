import { useEffect } from "react";
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
import { useOnboarding } from "../../context/OnboardingContext";

function completeOnboarding(navigate: ReturnType<typeof useNavigate>, to = "/") {
  localStorage.setItem("scholar_onboarding_done", "1");
  navigate(to, { replace: true });
}

export function OnboardingReady() {
  const navigate = useNavigate();
  const { analysis } = useOnboarding();

  useEffect(() => {
    if (!analysis) {
      navigate("/onboarding", { replace: true });
    }
  }, [analysis, navigate]);

  if (!analysis) return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-16">


      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-3xl"
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
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
            {[
              { label: "Documents", value: analysis.documents },
              { label: "Courses", value: analysis.courses?.length || 0 },
              { label: "Concepts", value: analysis.concepts?.length || 0 },
              { label: "Algorithms", value: analysis.stats?.algorithms || 0 },
              { label: "Tables", value: analysis.stats?.tables || 0 },
              { label: "Diagrams", value: analysis.stats?.diagrams || 0 },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-semibold tabular-nums text-foreground">{value}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>


          {/* Detailed Analysis (Focus Areas and Concepts) */}
          {(analysis?.courses?.length > 0 || analysis?.concepts?.length > 0) && (
            <div className="mt-6 border-t border-border pt-6 grid gap-6 sm:grid-cols-2">
              {analysis?.courses?.length > 0 && (
                <div>
                  <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Detected Focus Areas
                  </p>
                  <ul className="space-y-1.5 text-sm list-inside list-disc text-foreground">
                    {analysis.courses.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
              {analysis?.concepts?.length > 0 && (
                <div>
                  <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Core Concepts
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.concepts.slice(0, 10).map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-primary/30 bg-violet-soft px-2.5 py-1 text-[11px] font-medium text-primary"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Collections */}
          {analysis?.collections?.length > 0 && (
            <div className="mt-5 border-t border-border pt-5">
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Suggested Collections
              </p>
              <div className="flex flex-wrap gap-2">
                {analysis.collections.map((c) => (
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
            Recommended First Steps
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {analysis?.actions?.map(({ type, label }, i) => (
              <motion.button
                key={`${type}-${label}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                onClick={() => completeOnboarding(navigate, "/")}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/40 hover:bg-accent/40"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  {type === "Read" ? <BookOpen className="size-4" /> : type === "Teach Me" ? <GraduationCap className="size-4" /> : type === "Review" ? <CheckCircle2 className="size-4" /> : <Network className="size-4" />}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground uppercase">{type}</p>
                    <span className="block truncate text-sm font-medium text-foreground">{label}</span>
                </div>
                <ArrowRight className="size-3.5 text-muted-foreground shrink-0" />
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
