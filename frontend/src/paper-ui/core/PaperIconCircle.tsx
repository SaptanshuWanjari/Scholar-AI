import React from "react";
import { cn } from "@/paper-ui/utils";
import { SketchBorder } from "@/paper-ui/core";

export type IconTone = "sage" | "ochre" | "sky" | "lavender" | "brick" | "ink";

// Concrete hex — rough.js SVG attributes cannot resolve CSS vars.
const TONES: Record<IconTone, { fill: string; fg: string; stroke: string }> = {
  sage:     { fill: "#e7efe4", fg: "#3f7a4e", stroke: "rgba(63,122,78,0.35)" },
  ochre:    { fill: "#f4e7d2", fg: "#b07a2e", stroke: "rgba(176,122,46,0.35)" },
  sky:      { fill: "#e2eaf1", fg: "#4a6f91", stroke: "rgba(74,111,145,0.35)" },
  lavender: { fill: "#e9e9f5", fg: "#6f63a3", stroke: "rgba(111,99,163,0.35)" },
  brick:    { fill: "#f1ddda", fg: "#a3544a", stroke: "rgba(163,84,74,0.35)" },
  ink:      { fill: "#f0efed", fg: "#3a3733", stroke: "rgba(0,0,0,0.18)" },
};

export interface PaperIconCircleProps {
  children: React.ReactNode;
  tone?: IconTone;
  size?: number;
  className?: string;
}

/**
 * Soft tinted chip for icons. Rough.js draws fill + wobbly outline as one path;
 * no CSS border or box-shadow underneath.
 */
export function PaperIconCircle({ children, tone = "ink", size = 36, className }: PaperIconCircleProps) {
  const t = TONES[tone];
  return (
    <span
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: size, height: size, color: t.fg }}
    >
      <SketchBorder
        fill={t.fill}
        stroke={t.stroke}
        strokeWidth={1.2}
        radius={size / 2}
        roughness={0.8}
        bowing={0.8}
        bleed={4}
      />
      <span className="relative z-[1]">{children}</span>
    </span>
  );
}
