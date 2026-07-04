import React from "react";
import { cn } from "@/paper-ui/utils";
import { PaperPanel } from "@/paper-ui/core";

export type MasteryLevel = "mastered" | "learning" | "weak" | "unknown";

export interface ConceptNodeProps {
  title: string;
  description?: string;
  mastery?: MasteryLevel;
  badge?: React.ReactNode;
  meta?: string;
  actions?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const MASTERY_COLOR: Record<Exclude<MasteryLevel, "unknown">, string> = {
  mastered: "#3f7a4e",
  learning: "#b07a2e",
  weak: "#a3544a",
};

function AccentLine({ mastery }: { mastery: MasteryLevel }) {
  if (mastery === "unknown") return null;
  const color = MASTERY_COLOR[mastery];
  // SVG is stretched via preserveAspectRatio="none"; viewBox 0 0 6 100 maps
  // to the full height of the parent. Path is drawn in viewBox units.
  return (
    <svg
      width={6}
      height="100%"
      viewBox="0 0 6 100"
      preserveAspectRatio="none"
      className="absolute left-2 top-0 pointer-events-none"
      aria-hidden
    >
      <path
        d="M3,4 Q2,33 3,50 Q4,67 3,96"
        stroke={color}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function ConceptNode({
  title,
  description,
  mastery = "unknown",
  badge,
  meta,
  actions,
  onClick,
  className,
}: ConceptNodeProps) {
  return (
    <PaperPanel
      className={cn(
        "group relative pl-8 pr-4 py-3",
        onClick && "cursor-pointer",
        className,
      )}
      onClick={onClick}
    >
      <AccentLine mastery={mastery} />

      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-kalam font-bold text-[15px] text-ink leading-snug">{title}</p>
          {description && (
            <p className="font-kalam text-sm text-ink-muted mt-0.5 line-clamp-2">{description}</p>
          )}
        </div>

        <div className="flex flex-col items-end gap-1.5 shrink-0">
          {actions && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              {actions}
            </div>
          )}
          {badge}
          {meta && (
            <span className="font-architect text-xs text-ink-muted">{meta}</span>
          )}
        </div>
      </div>
    </PaperPanel>
  );
}
