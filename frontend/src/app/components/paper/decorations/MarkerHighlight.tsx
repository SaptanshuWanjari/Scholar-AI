import React from "react";
import { cn } from "../../ui/utils";

export interface MarkerHighlightProps {
  children: React.ReactNode;
  /** Highlighter color. */
  color?: string;
  /** Stroke thickness in px. */
  thickness?: number;
  /** Animate the sweep in on mount. */
  animate?: boolean;
  className?: string;
}

/**
 * A hand-drawn highlighter sweep under inline text — not a full-width rule.
 * Sits behind the baseline so the ink stays readable.
 */
export function MarkerHighlight({
  children,
  color = "#f6e27a",
  thickness = 9,
  animate = false,
  className,
}: MarkerHighlightProps) {
  return (
    <span className={cn("relative inline-block", className)}>
      <span className="relative z-[1]">{children}</span>
      <svg
        className="absolute left-0 z-0 w-full overflow-visible"
        style={{
          bottom: -2,
          height: thickness,
          transformOrigin: "left center",
          animation: animate ? "paper-marker-sweep 0.5s ease-out both" : undefined,
        }}
        viewBox="0 0 100 12"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M1,7 Q26,3 52,6 T99,6"
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          opacity={0.85}
        />
      </svg>
    </span>
  );
}
