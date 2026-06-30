import React from "react";
import { cn } from "@/paper-ui/utils";

type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center";

export interface TapeProps {
  corner?: Corner;
  /** Rotation in degrees. Defaults to a deterministic value per corner (−8°..+8°). */
  rotate?: number;
  width?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

const DEFAULT_ROTATE: Record<Corner, number> = {
  "top-left": -7,
  "top-right": 6,
  "bottom-left": 5,
  "bottom-right": -6,
  "top-center": 2,
};

const PLACEMENT: Record<Corner, string> = {
  "top-left": "-top-2.5 -left-3",
  "top-right": "-top-2.5 -right-3",
  "bottom-left": "-bottom-2.5 -left-3",
  "bottom-right": "-bottom-2.5 -right-3",
  "top-center": "-top-2.5 left-1/2 -translate-x-1/2",
};

/** A strip of semi-transparent masking tape. Use sparingly. */
export function Tape({ corner = "top-left", rotate, width = 58, color = "var(--color-tape)", className, style }: TapeProps) {
  const deg = rotate ?? DEFAULT_ROTATE[corner];
  return (
    <span
      className={cn("pointer-events-none absolute z-20 block h-5 rounded-[2px]", PLACEMENT[corner], className)}
      style={{
        width,
        transform: `rotate(${deg}deg)`,
        backgroundColor: color,
        opacity: 0.82,
        boxShadow: "1px 1px 2px rgba(0,0,0,0.12)",
        backgroundImage:
          "repeating-linear-gradient(90deg, rgba(255,255,255,0.25) 0 2px, transparent 2px 6px)",
        borderLeft: "1px solid rgba(0,0,0,0.05)",
        borderRight: "1px solid rgba(0,0,0,0.05)",
        ...style,
      }}
      aria-hidden
    />
  );
}
