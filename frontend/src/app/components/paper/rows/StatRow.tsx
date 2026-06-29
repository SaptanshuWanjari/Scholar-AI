import React from "react";
import { cn } from "../../ui/utils";
import { PaperIconCircle, type IconTone } from "../foundation/PaperIconCircle";
import { SketchDivider } from "../decorations/SketchDivider";

export interface StatRowProps {
  icon: React.ReactNode;
  tone: IconTone;
  label: string;
  sublabel?: string;
  value: React.ReactNode;
  /** Dashed pencil separator below the row. */
  divider?: boolean;
}

/** A single statistic line: tinted icon, handwritten label, big number. */
export function StatRow({ icon, tone, label, sublabel, value, divider = true }: StatRowProps) {
  return (
    <div>
      <div className="flex items-center justify-between py-1">
        <div className="flex items-center gap-3">
          <PaperIconCircle tone={tone} size={36}>
            {icon}
          </PaperIconCircle>
          <div className="leading-tight">
            <div className="font-architect text-[15px] text-ink">{label}</div>
            {sublabel && <div className="font-kalam text-xs text-ink-muted">{sublabel}</div>}
          </div>
        </div>
        <span className={cn("font-caveat text-[32px] font-bold leading-none text-ink")}>{value}</span>
      </div>
      {divider && <SketchDivider variant="dashed" className="mt-3" />}
    </div>
  );
}
