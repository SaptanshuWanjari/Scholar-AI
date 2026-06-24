import { motion } from "motion/react";
import { AlertTriangle, CheckCircle2, Info, ShieldCheck } from "lucide-react";
import type { ConsistencyReport as Report } from "../lib/api";
import { Badge } from "./ui/badge";
import { cn } from "./ui/utils";

const ARTIFACT_LABELS: Record<string, string> = {
  notes: "Notes",
  flashcards: "Flashcards",
  quiz: "Quiz",
  mindmap: "Mind Map",
  diagram: "Diagram",
  difference: "Difference Table",
};

function coverageTone(pct: number): string {
  if (pct >= 80) return "text-success";
  if (pct >= 60) return "text-warning";
  return "text-danger";
}

function coverageBar(pct: number): string {
  if (pct >= 80) return "bg-success";
  if (pct >= 60) return "bg-warning";
  return "bg-danger";
}

function Chips({ items, tone }: { items: string[]; tone: string }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((c) => (
        <Badge key={c} variant="outline" className={cn("text-[11px] font-medium", tone)}>
          {c}
        </Badge>
      ))}
    </div>
  );
}

export function ConsistencyReport({ report }: { report: Report }) {
  const { canonicalConcepts, overallCoverage, artifacts } = report;

  if (!canonicalConcepts.length && !artifacts.length) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
        {report.recommendations[0] ??
          "No concepts could be extracted from the source material."}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Overall coverage */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <ShieldCheck className="size-4 text-primary" />
            Overall coverage
          </div>
          <span className={cn("text-2xl font-semibold tabular-nums", coverageTone(overallCoverage))}>
            {overallCoverage.toFixed(0)}%
          </span>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallCoverage}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={cn("h-full rounded-full", coverageBar(overallCoverage))}
          />
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Info className="size-3" />
          Analysis only — no artifacts were created or modified.
        </p>
      </div>

      {/* Per-artifact coverage */}
      <div className="space-y-3">
        {artifacts.map((a) => {
          const hasGaps = a.missing.length > 0 || a.weak.length > 0;
          const label = ARTIFACT_LABELS[a.artifact] ?? a.artifact;
          return (
            <div key={a.artifact} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {hasGaps ? (
                    <AlertTriangle className="size-4 text-warning" />
                  ) : (
                    <CheckCircle2 className="size-4 text-success" />
                  )}
                  <span className="text-sm font-medium text-foreground">{label}</span>
                </div>
                <span className={cn("text-sm font-semibold tabular-nums", coverageTone(a.coverage))}>
                  {a.coverage.toFixed(0)}%
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${a.coverage}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={cn("h-full rounded-full", coverageBar(a.coverage))}
                />
              </div>
              {a.missing.length > 0 && (
                <div className="mt-3">
                  <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-danger">
                    Missing
                  </div>
                  <Chips items={a.missing} tone="border-danger/40 bg-danger-soft text-danger" />
                </div>
              )}
              {a.weak.length > 0 && (
                <div className="mt-3">
                  <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-warning">
                    Weak coverage
                  </div>
                  <Chips items={a.weak} tone="border-warning/40 bg-warning-soft text-warning" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Under / over represented */}
      {(report.underrepresented.length > 0 || report.overrepresented.length > 0) && (
        <div className="grid gap-3 sm:grid-cols-2">
          {report.underrepresented.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Under-represented concepts
              </div>
              <Chips
                items={report.underrepresented}
                tone="border-warning/40 bg-warning-soft text-warning"
              />
            </div>
          )}
          {report.overrepresented.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Covered by every artifact
              </div>
              <Chips
                items={report.overrepresented}
                tone="border-success/40 bg-success-soft text-success"
              />
            </div>
          )}
        </div>
      )}

      {/* Recommendations */}
      {report.recommendations.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Recommendations
          </div>
          <ul className="space-y-2">
            {report.recommendations.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-violet-soft text-[11px] font-medium text-primary">
                  {i + 1}
                </span>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Canonical concept cloud */}
      {canonicalConcepts.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Canonical concepts ({canonicalConcepts.length}) — from source material
          </div>
          <Chips items={canonicalConcepts} tone="border-border text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
