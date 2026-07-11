import { useEffect, useState } from "react";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "./ui/utils";
import { PaperPanel } from "@paper-ui/core";

interface Props {
  steps: string[];
  loading: boolean;
  /** ms between step advances while loading. Defaults to 1800. */
  interval?: number;
  className?: string;
}

type StepState = "pending" | "active" | "done";

/**
 * Animated step-progress for AI generation flows.
 * Steps advance on a timer while `loading` is true, then all snap to done.
 */
export function GenerationSteps({ steps, loading, interval = 1800, className }: Props) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!loading) {
      setCurrent(steps.length);
      return;
    }
    setCurrent(0);
    let idx = 0;
    const tick = setInterval(() => {
      idx += 1;
      // Stop one before the last step — last step completes when loading finishes
      if (idx < steps.length - 1) {
        setCurrent(idx);
      } else {
        clearInterval(tick);
      }
    }, interval);
    return () => clearInterval(tick);
  }, [loading, steps.length, interval]);

  const stateOf = (i: number): StepState => {
    if (!loading) return "done";
    if (i < current) return "done";
    if (i === current) return "active";
    return "pending";
  };

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25 }}
          className={cn("overflow-hidden", className)}
        >
          <PaperPanel className="px-4 py-3">
            <div className="space-y-2">
              {steps.map((label, i) => {
                const state = stateOf(i);
                return (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-2.5"
                  >
                    <span
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-full transition-colors",
                        state === "done" && "text-success",
                        state === "active" && "text-primary",
                        state === "pending" && "text-muted-foreground/30",
                      )}
                    >
                      {state === "done" ? (
                        <CheckCircle2 className="size-4" />
                      ) : state === "active" ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Circle className="size-4" />
                      )}
                    </span>
                    <span
                      className={cn(
                        "font-kalam text-sm transition-colors",
                        state === "done" && "text-foreground",
                        state === "active" && "font-medium text-foreground",
                        state === "pending" && "text-muted-foreground/40",
                      )}
                    >
                      {label}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </PaperPanel>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
