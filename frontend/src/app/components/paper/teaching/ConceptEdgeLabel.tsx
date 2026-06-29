import React from "react";
import { cn } from "../../ui/utils";

export type RelationType =
  | "covers"
  | "requires"
  | "uses"
  | "related"
  | "introduces"
  | "prerequisite";

export interface ConceptEdgeLabelProps {
  label: string;
  relation?: RelationType;
  className?: string;
}

const RELATION_STYLE: Record<RelationType, { bg: string; color: string; border: string }> = {
  covers:       { bg: "var(--color-sage-soft)",     color: "#3f7a4e", border: "#a8c4a2" },
  requires:     { bg: "var(--color-ochre-soft)",    color: "#b07a2e", border: "#c9a878" },
  uses:         { bg: "var(--color-sky-soft)",      color: "#4a6f91", border: "#97b6cd" },
  related:      { bg: "rgba(0,0,0,0.05)",           color: "#79736a", border: "#c5bfb4" },
  introduces:   { bg: "var(--color-lavender-soft)", color: "#6f63a3", border: "#b0accf" },
  prerequisite: { bg: "var(--color-brick-soft)",    color: "#a3544a", border: "#c9938e" },
};

const FALLBACK = { bg: "rgba(0,0,0,0.05)", color: "#79736a", border: "#c5bfb4" };

export function ConceptEdgeLabel({ label, relation, className }: ConceptEdgeLabelProps) {
  const s = relation ? (RELATION_STYLE[relation] ?? FALLBACK) : FALLBACK;
  return (
    <span
      className={cn(
        "inline-block px-2 py-0.5 rounded-full font-kalam text-[11px] leading-snug select-none border border-dashed",
        className,
      )}
      style={{ backgroundColor: s.bg, color: s.color, borderColor: s.border }}
    >
      {label}
    </span>
  );
}
