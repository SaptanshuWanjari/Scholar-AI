import React from "react";
import { cn } from "@paper-ui/utils";
import { PaperCard } from "@paper-ui/core";
import { SectionLabel } from "@paper-ui/core";
import { SketchProgress } from "../progress/SketchProgress";

export interface ProgressSummaryProps {
  title: string;
  value: number;
  color?: string;
  leftStat: { label: string; value: string };
  rightStat: { label: string; value: string };
  badge?: React.ReactNode;
  className?: string;
}

export function ProgressSummary({
  title,
  value,
  color,
  leftStat,
  rightStat,
  badge,
  className,
}: ProgressSummaryProps) {
  return (
    <PaperCard shadow="sm" className={cn("p-4 flex flex-col gap-3", className)}>
      <div className="flex items-center justify-between">
        <SectionLabel>{title}</SectionLabel>
        {badge}
      </div>
      <SketchProgress value={value} color={color} />
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="font-caveat text-2xl leading-none">{leftStat.value}</span>
          <span className="font-architect text-xs text-muted-foreground">{leftStat.label}</span>
        </div>
        <div className="flex flex-col gap-0.5 items-end">
          <span className="font-caveat text-2xl leading-none">{rightStat.value}</span>
          <span className="font-architect text-xs text-muted-foreground">{rightStat.label}</span>
        </div>
      </div>
    </PaperCard>
  );
}
