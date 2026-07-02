import React from "react";
import { cn } from "@/paper-ui/utils";
import { SketchBorder, type SketchBorderProps } from "@/paper-ui/core";
import { usePaperTheme } from "@/paper-ui/core";

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

export const PaperCard = React.forwardRef<HTMLDivElement, PaperCardProps>(function PaperCard(
  {
    children,
    className,
    surface,
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
  const t = usePaperTheme();
  const resolvedSurface = surface ?? t.surface;
  return (
    <div
      ref={ref}
      className={cn("relative", texture && "paper-texture", lift && "paper-lift", className)}
      style={{ transform: rotate ? `rotate(${rotate}deg)` : undefined, ...style }}
      {...props}
    >
      {border !== null && <SketchBorder fill={resolvedSurface} shadow={SHADOW_PX[shadow]} {...border} />}
      <div className="relative z-[1]">{children}</div>
    </div>
  );
});

/** A lighter inner surface (e.g. the "Next up" box) — stroke-only, no shadow. */
export const PaperPanel = React.forwardRef<HTMLDivElement, PaperCardProps>(function PaperPanel(
  { shadow = "none", surface, texture = false, border, ...props },
  ref,
) {
  const t = usePaperTheme();
  const merged: Partial<SketchBorderProps> | null =
    border === null ? null : { stroke: t.strokeSm, strokeWidth: 1.4, ...border };
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
