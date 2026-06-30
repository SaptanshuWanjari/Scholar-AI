import React from "react";
import { cn } from "@paper-ui/utils";
import { SketchBorder } from "@paper-ui/core";
import type { IconTone } from "@paper-ui/core";

const TONES: Record<IconTone, { fill: string; fg: string; stroke: string }> = {
  sage:     { fill: "#e7efe4", fg: "#3f7a4e", stroke: "rgba(63,122,78,0.3)" },
  ochre:    { fill: "#f4e7d2", fg: "#b07a2e", stroke: "rgba(176,122,46,0.3)" },
  sky:      { fill: "#e2eaf1", fg: "#4a6f91", stroke: "rgba(74,111,145,0.3)" },
  lavender: { fill: "#e9e9f5", fg: "#6f63a3", stroke: "rgba(111,99,163,0.3)" },
  brick:    { fill: "#f1ddda", fg: "#a3544a", stroke: "rgba(163,84,74,0.3)" },
  ink:      { fill: "#f0efed", fg: "#3a3733", stroke: "rgba(0,0,0,0.15)" },
};

export interface IconWrapperProps {
  children: React.ReactNode;
  size?: number;
  /** Container shape. "none" renders no border/background — just the icon. */
  shape?: "circle" | "square" | "none";
  /** Tone preset — sets fill + fg + stroke automatically. */
  tone?: IconTone;
  /** Override fill color (concrete hex only). */
  fill?: string;
  /** Override stroke color. */
  stroke?: string;
  roughness?: number;
  className?: string;
}

/**
 * Flexible icon container. Use `PaperIconCircle` for the standard tinted
 * circle; use `IconWrapper` when you need a square, a different size, a
 * custom color, or no container at all.
 */
export function IconWrapper({
  children,
  size = 36,
  shape = "circle",
  tone,
  fill,
  stroke,
  roughness = 0.85,
  className,
}: IconWrapperProps) {
  if (shape === "none") {
    return (
      <span
        className={cn("inline-flex shrink-0 items-center justify-center", className)}
        style={{ width: size, height: size, color: tone ? TONES[tone].fg : "currentColor" }}
      >
        {children}
      </span>
    );
  }

  const resolvedFill   = fill   ?? (tone ? TONES[tone].fill   : "#f0efed");
  const resolvedStroke = stroke ?? (tone ? TONES[tone].stroke  : "rgba(0,0,0,0.15)");
  const resolvedFg     =           tone ? TONES[tone].fg      : "currentColor";
  const radius = shape === "circle" ? size / 2 : 6;

  return (
    <span
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: size, height: size, color: resolvedFg }}
    >
      <SketchBorder
        fill={resolvedFill}
        stroke={resolvedStroke}
        strokeWidth={1.3}
        radius={radius}
        roughness={roughness}
        bowing={0.8}
        bleed={4}
      />
      <span className="relative z-[1]">{children}</span>
    </span>
  );
}
