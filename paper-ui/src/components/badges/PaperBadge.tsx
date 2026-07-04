import React from "react";
import { cn } from "@paper-ui/utils";
import type { IconTone } from "@paper-ui/core";

const TONES: Record<IconTone, { bg: string; fg: string }> = {
  sage: { bg: "var(--color-sage-soft)", fg: "#3f7a4e" },
  ochre: { bg: "var(--color-ochre-soft)", fg: "#b07a2e" },
  sky: { bg: "var(--color-sky-soft)", fg: "#4a6f91" },
  lavender: { bg: "var(--color-lavender-soft)", fg: "#6f63a3" },
  brick: { bg: "var(--color-brick-soft)", fg: "#a3544a" },
  ink: { bg: "rgba(0,0,0,0.08)", fg: "#3a3733" },
};

export interface PaperBadgeProps {
  children: React.ReactNode;
  tone?: IconTone;
  className?: string;
}

/** Small handwritten tag/pill. */
export function PaperBadge({
  children,
  tone = "ink",
  className,
}: PaperBadgeProps) {

  const t = TONES[tone as keyof typeof TONES] ?? TONES.ink;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-architect text-xs",
        className,
      )}
      style={{
        backgroundColor: t.bg,
        color: t.fg,
      }}
    >
      {children}
    </span>
  );
}
