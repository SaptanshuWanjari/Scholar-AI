import React from "react";
import { cn } from "@/paper-ui/utils";
import { PaperCard, PaperPanel } from "@/paper-ui/core";
import type { MasteryLevel } from "./ConceptNode";

export interface KnowledgeNodeProps {
  title: string;
  summary?: string;
  mastery?: MasteryLevel;
  tags?: React.ReactNode[];
  stats?: { label: string; value: string }[];
  actions?: React.ReactNode;
  className?: string;
}

const MASTERY_DOT: Record<Exclude<MasteryLevel, "unknown">, string> = {
  mastered: "#3f7a4e",
  learning: "#b07a2e",
  weak: "#a3544a",
};

export function KnowledgeNode({
  title,
  summary,
  mastery,
  tags,
  stats,
  actions,
  className,
}: KnowledgeNodeProps) {
  const dotColor = mastery && mastery !== "unknown" ? MASTERY_DOT[mastery] : null;

  return (
    <PaperCard shadow="md" className={cn("px-5 py-4", className)}>
      <div className="flex items-center gap-2">
        {dotColor && (
          <span
            className="shrink-0 rounded-full"
            style={{ width: 8, height: 8, backgroundColor: dotColor }}
          />
        )}
        <h3 className="font-caveat text-3xl font-bold text-ink leading-tight">{title}</h3>
      </div>

      {summary && (
        <p className="font-kalam text-sm text-ink-muted mt-2">{summary}</p>
      )}

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">{tags}</div>
      )}

      {stats && stats.length > 0 && (
        <div className="flex gap-3 mt-4">
          {stats.map((s, i) => (
            <PaperPanel
              key={i}
              className="px-3 py-1.5"
              border={{ stroke: "#cfc8b8", strokeWidth: 1.2, roughness: 1.1 }}
            >
              <span className="font-caveat text-xl text-ink">{s.value}</span>
              <p className="font-architect text-[10px] uppercase tracking-wide text-ink-muted leading-none mt-0.5">
                {s.label}
              </p>
            </PaperPanel>
          ))}
        </div>
      )}

      {actions && (
        <div className="mt-4 pt-3 border-t border-dashed border-border/50">
          {actions}
        </div>
      )}
    </PaperCard>
  );
}
