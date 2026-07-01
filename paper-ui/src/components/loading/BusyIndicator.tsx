import React from "react";
import { cn } from "@paper-ui/utils";

const sizeMap = {
  xs: { dim: 10, stroke: 1.2, font: "text-[10px]", gap: "gap-1" },
  sm: { dim: 14, stroke: 1.5, font: "text-[11px]", gap: "gap-1" },
  md: { dim: 18, stroke: 1.8, font: "text-xs", gap: "gap-1.5" },
};

const colorMap: Record<string, string> = {
  ink: "#3a3733",
  sage: "#7fa37b",
  ochre: "#b07a2e",
  sky: "#4a6f91",
  brick: "#a3544a",
};

export interface BusyIndicatorProps {
  variant?: "spin" | "pulse" | "dots";
  size?: "xs" | "sm" | "md";
  color?: string;
  label?: string;
  className?: string;
}

export function BusyIndicator({
  variant = "spin",
  size = "sm",
  color = "ink",
  label,
  className,
}: BusyIndicatorProps) {
  const ink = colorMap[color] ?? color;
  const s = sizeMap[size];

  return (
    <span
      role="status"
      aria-label={label ?? "Loading"}
      className={cn("inline-flex items-center", s.gap, className)}
    >
      {variant === "spin" && (
        <svg
          width={s.dim} height={s.dim}
          viewBox="0 0 24 24"
          className="animate-spin shrink-0"
          aria-hidden
        >
          <circle
            cx="12" cy="12" r="9"
            stroke={ink} strokeWidth={s.stroke} fill="none"
            strokeLinecap="round"
            strokeDasharray="40 15"
          />
        </svg>
      )}

      {variant === "pulse" && (
        <svg
          width={s.dim} height={s.dim}
          viewBox="0 0 24 24"
          className="animate-pulse shrink-0"
          aria-hidden
        >
          <circle
            cx="12" cy="12" r="9"
            stroke={ink} strokeWidth={s.stroke} fill="none"
            strokeLinecap="round"
          />
        </svg>
      )}

      {variant === "dots" && (
        <span className={cn("flex items-center", s.gap)}>
          {[0, 100, 200].map((delay, i) => (
            <svg
              key={i}
              width={s.dim / 2} height={s.dim / 2}
              viewBox="0 0 12 12"
              className="animate-bounce shrink-0"
              style={{ animationDelay: `${delay}ms` }}
              aria-hidden
            >
              <circle
                cx="6" cy="6" r="4"
                stroke={ink} strokeWidth={s.stroke + 0.3} fill="none"
                strokeLinecap="round"
              />
            </svg>
          ))}
        </span>
      )}

      {label && (
        <span className={cn("font-kalam text-ink-muted leading-none", s.font)}>
          {label}
        </span>
      )}
    </span>
  );
}
