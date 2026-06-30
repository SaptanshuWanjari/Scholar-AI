import React from "react";
import { cn } from "@paper-ui/utils";
import { SketchBorder, type SketchBorderProps } from "./SketchBorder";

type Shadow = "none" | "sm" | "md" | "lg";

/** Hard-offset shadow distance in px per level (drawn by the rough SVG). */
const SHADOW_PX: Record<Shadow, number> = { none: 0, sm: 2, md: 3, lg: 4 };

export interface PaperCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Surface fill color. Concrete value only (no CSS var). Defaults to warm card. */
  surface?: string;
  shadow?: Shadow;
  /** 2px lift on hover. */
  lift?: boolean;
  /** Paper fiber/noise overlay. */
  texture?: boolean;
  /** Props forwarded to the rough.js surface. Pass `null` to disable. */
  border?: Partial<SketchBorderProps> | null;
  /** Extra rotation in degrees (kept tiny; intentional imperfection). */
  rotate?: number;
}

/**
 * Base notebook surface: a single hand-drawn rough.js shape provides the warm
 * fill, the wobbly outline and a crisp hard-offset shadow. The wrapper itself
 * is transparent — no CSS rounded-rect or box-shadow underneath.
 */
export const PaperCard = React.forwardRef<HTMLDivElement, PaperCardProps>(function PaperCard(
  {
    children,
    className,
    surface = "#fffdf9",
    shadow = "md",
    lift = false,
    texture = true,
    border,
    rotate,
    style,
    ...props
  },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn("relative", texture && "paper-texture", lift && "paper-lift", className)}
      style={{ transform: rotate ? `rotate(${rotate}deg)` : undefined, ...style }}
      {...props}
    >
      {border !== null && <SketchBorder fill={surface} shadow={SHADOW_PX[shadow]} {...border} />}
      <div className="relative z-[1]">{children}</div>
    </div>
  );
});

/** A lighter inner surface (e.g. the "Next up" box) — stroke-only, no shadow. */
export const PaperPanel = React.forwardRef<HTMLDivElement, PaperCardProps>(function PaperPanel(
  { shadow = "none", surface, texture = false, border, ...props },
  ref,
) {
  // No surface given → draw a stroke-only outline (transparent body).
  const merged: Partial<SketchBorderProps> | null =
    border === null ? null : { stroke: "#9c9484", strokeWidth: 1.4, ...border };
  return (
    <PaperCard
      ref={ref}
      shadow={shadow}
      surface={surface ?? "transparent"}
      texture={texture}
      border={merged}
      {...props}
    />
  );
});
