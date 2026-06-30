import React from "react";
import { cn } from "@paper-ui/utils";
import { PaperPanel } from "@paper-ui/core";
import type { MasteryLevel } from "./ConceptNode";

export interface KnowledgeGraphNodeProps {
  title: string;
  sourceCount?: number;
  timeEstimate?: string;
  mastery?: MasteryLevel;
  selected?: boolean;
  dimmed?: boolean;
  onClick?: () => void;
  className?: string;
}

const MASTERY_DOT: Record<MasteryLevel, string> = {
  mastered: "#3f7a4e",
  learning: "#b07a2e",
  weak: "#a3544a",
  unknown: "#9c9484",
};

export function KnowledgeGraphNode({
  title,
  sourceCount,
  timeEstimate,
  mastery = "unknown",
  selected = false,
  dimmed = false,
  onClick,
  className,
}: KnowledgeGraphNodeProps) {
  const dotColor = MASTERY_DOT[mastery];
  const hasMeta = sourceCount !== undefined || timeEstimate !== undefined;

  return (
    <PaperPanel
      border={selected ? { stroke: "#5b7fa6", strokeWidth: 2 } : undefined}
      className={cn(
        "px-3 py-2 min-w-[140px] max-w-[220px] transition-opacity",
        onClick && "cursor-pointer hover:shadow-sm",
        dimmed && "opacity-30",
        className,
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-2">
        <span
          className="mt-[5px] shrink-0 rounded-full"
          style={{ width: 8, height: 8, background: dotColor }}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <p className="font-caveat font-semibold text-[15px] text-ink leading-snug line-clamp-2">
            {title}
          </p>
          {hasMeta && (
            <p className="mt-0.5 font-kalam text-[11px] text-ink-muted leading-none">
              {[timeEstimate, sourceCount !== undefined && `${sourceCount} src`]
                .filter(Boolean)
                .join(" • ")}
            </p>
          )}
        </div>
      </div>
    </PaperPanel>
  );
}
