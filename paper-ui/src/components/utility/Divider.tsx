import React from "react";
import { cn } from "@paper-ui/utils";
import { SketchDivider } from "../decorations/SketchDivider";

export interface DividerProps {
  /** Visual style of the line. "line" = plain CSS, others use the rough SVG. */
  variant?: "wavy" | "straight" | "dashed" | "line";
  /** Orientation — vertical renders a thin column separator. */
  orientation?: "horizontal" | "vertical";
  /** Optional text label centred in the divider. */
  label?: string;
  color?: string;
  className?: string;
}

/**
 * Semantic page/section divider.
 *
 * Horizontal with no label → full-width SketchDivider.
 * Horizontal with label   → ── label ── layout.
 * Vertical                → thin inline separator for toolbars / lists.
 */
export function Divider({
  variant = "wavy",
  orientation = "horizontal",
  label,
  color = "#9c9484",
  className,
}: DividerProps) {
  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn("inline-block self-stretch", className)}
        style={{ width: 1, background: color }}
      />
    );
  }

  if (label) {
    return (
      <div
        role="separator"
        className={cn("flex items-center gap-3", className)}
      >
        <div className="min-w-[24px] flex-1">
          {variant === "line" ? (
            <div style={{ height: 1, background: color }} />
          ) : (
            <SketchDivider variant={variant === "dashed" ? "dashed" : variant === "straight" ? "straight" : "wavy"} color={color} />
          )}
        </div>
        <span className="shrink-0 font-architect text-[11px] uppercase tracking-[0.12em] text-ink-muted/60">
          {label}
        </span>
        <div className="min-w-[24px] flex-1">
          {variant === "line" ? (
            <div style={{ height: 1, background: color }} />
          ) : (
            <SketchDivider variant={variant === "dashed" ? "dashed" : variant === "straight" ? "straight" : "wavy"} color={color} />
          )}
        </div>
      </div>
    );
  }

  if (variant === "line") {
    return (
      <div
        role="separator"
        className={cn("w-full", className)}
        style={{ height: 1, background: color }}
      />
    );
  }

  return (
    <div role="separator" className={cn(className)}>
      <SketchDivider
        variant={variant === "dashed" ? "dashed" : variant === "straight" ? "straight" : "wavy"}
        color={color}
      />
    </div>
  );
}
