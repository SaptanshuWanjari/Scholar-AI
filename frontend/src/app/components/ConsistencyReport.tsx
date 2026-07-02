import { useState } from "react";
import { motion } from "motion/react";
import { AlertTriangle, CheckCircle2, Info, Loader2, ShieldCheck, Wand2 } from "lucide-react";
import type { ConsistencyReport as Report } from "../lib/api";
import { cn } from "./ui/utils";
import { PaperBadge } from "@paper-ui/components/badges";
import { PaperButton } from "@paper-ui/components/buttons";
import { EmptyState } from "@paper-ui/components/feedback";
import { PaperCard, PaperPanel, SectionHeader, SectionLabel, type IconTone } from "@paper-ui/core";

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

function Chips({ items, tone }: { items: string[]; tone: IconTone }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((c) => (
        <PaperBadge key={c} tone={tone} className="text-[11px]">
          {c}
        </PaperBadge>
      ))}
    </div>
  );
}

interface ConsistencyReportProps {
  report: Report;
  course?: string;
  onApply?: (artifactType: string, concepts: string[]) => Promise<void>;
}

function ApplyButton({ onClick }: { onClick: () => Promise<void> }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      await onClick();
      setDone(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PaperButton
      onClick={() => void handleClick()}
      disabled={loading || done}
      tone={done ? "green" : "paper"}
      size="sm"
      className={cn("shrink-0 gap-1.5", done && "cursor-default")}
    >
      {loading ? (
        <Loader2 className="size-3 animate-spin" />
      ) : done ? (
        <CheckCircle2 className="size-3" />
      ) : (
        <Wand2 className="size-3" />
      )}
      {done ? "Applied" : "Apply"}
    </PaperButton>
  );
}

export function ConsistencyReport({ report, onApply }: ConsistencyReportProps) {
  const { canonicalConcepts, overallCoverage, artifacts } = report;

  if (!canonicalConcepts.length && !artifacts.length) {
    return (
      <EmptyState
        title="No concepts could be extracted"
        description={
          report.recommendations[0] ?? "No concepts could be extracted from the source material."
        }
        icon={<ShieldCheck className="size-6 text-ink-muted/50" />}
      />
    );
  }

  return (
    <div className="space-y-5">
      <PaperCard shadow="sm" className="p-5">
        <div className="flex items-center justify-between gap-4">
          <SectionHeader title="Overall coverage" />
          <span className={cn("text-2xl font-semibold tabular-nums", coverageTone(overallCoverage))}>
            {overallCoverage.toFixed(0)}%
          </span>
        </div>
        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallCoverage}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={cn("h-full rounded-full", coverageBar(overallCoverage))}
          />
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-[11px] text-ink-muted">
          <Info className="size-3" />
          Analysis only — no artifacts were created or modified.
        </p>
      </PaperCard>

      <div className="space-y-3">
        {artifacts.map((a) => {
          const hasGaps = a.missing.length > 0 || a.weak.length > 0;
          const label = ARTIFACT_LABELS[a.artifact] ?? a.artifact;
          return (
            <PaperPanel key={a.artifact} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {hasGaps ? (
                    <AlertTriangle className="size-4 text-warning" />
                  ) : (
                    <CheckCircle2 className="size-4 text-success" />
                  )}
                  <span className="text-sm font-medium text-ink">{label}</span>
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
                  <SectionLabel className="mb-1.5 block text-danger">Missing</SectionLabel>
                  <Chips items={a.missing} tone="brick" />
                </div>
              )}
              {a.weak.length > 0 && (
                <div className="mt-3">
                  <SectionLabel className="mb-1.5 block text-warning">Weak coverage</SectionLabel>
                  <Chips items={a.weak} tone="ochre" />
                </div>
              )}
            </PaperPanel>
          );
        })}
      </div>

      {(report.underrepresented.length > 0 || report.overrepresented.length > 0) && (
        <div className="grid gap-3 sm:grid-cols-2">
          {report.underrepresented.length > 0 && (
            <PaperPanel className="p-4">
              <SectionLabel className="mb-2 block">Under-represented concepts</SectionLabel>
              <Chips items={report.underrepresented} tone="ochre" />
            </PaperPanel>
          )}
          {report.overrepresented.length > 0 && (
            <PaperPanel className="p-4">
              <SectionLabel className="mb-2 block">Covered by every artifact</SectionLabel>
              <Chips items={report.overrepresented} tone="sage" />
            </PaperPanel>
          )}
        </div>
      )}

      {report.recommendations.length > 0 && (
        <PaperCard shadow="sm" className="p-4">
          <SectionLabel className="mb-2.5 block">Recommendations</SectionLabel>
          <ul className="space-y-2">
            {report.recommendations.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-ink/90">
                <PaperBadge tone="lavender" className="min-w-5 justify-center px-0 text-[11px]">
                  {i + 1}
                </PaperBadge>
                {r}
              </li>
            ))}
          </ul>
        </PaperCard>
      )}

      {report.suggestions && report.suggestions.length > 0 && (
        <PaperCard shadow="sm" className="p-4">
          <SectionLabel className="mb-2.5 block">Suggested fixes</SectionLabel>
          <div className="space-y-3">
            {report.suggestions.map((s, i) => (
              <PaperPanel key={i} className="flex items-start justify-between gap-3 p-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-ink">{s.label}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-ink-muted">{s.issue}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {s.concepts.slice(0, 4).map((c) => (
                      <PaperBadge key={c} tone="ink" className="text-[10px]">
                        {c}
                      </PaperBadge>
                    ))}
                    {s.concepts.length > 4 && (
                      <PaperBadge tone="ink" className="text-[10px] opacity-70">
                        +{s.concepts.length - 4} more
                      </PaperBadge>
                    )}
                  </div>
                </div>
                {onApply && (
                  <ApplyButton onClick={() => onApply(s.artifactType, s.concepts)} />
                )}
              </PaperPanel>
            ))}
          </div>
        </PaperCard>
      )}

      {canonicalConcepts.length > 0 && (
        <PaperCard shadow="sm" className="p-4">
          <SectionLabel className="mb-2 block">Canonical concepts ({canonicalConcepts.length})</SectionLabel>
          <Chips items={canonicalConcepts} tone="ink" />
        </PaperCard>
      )}
    </div>
  );
}
