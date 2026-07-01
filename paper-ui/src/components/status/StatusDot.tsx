import React from "react";
import { cn } from "@paper-ui/utils";

export type StatusDotStatus = "online" | "offline" | "away" | "busy" | "idle";
export type StatusDotSize = "sm" | "md" | "lg";

const COLOR_MAP: Record<StatusDotStatus, string> = {
  online: "#3f7a4e",
  offline: "#a39e93",
  away: "#a3771f",
  busy: "#9f3a36",
  idle: "#4f4d7a",
};

const SIZE_MAP: Record<StatusDotSize, number> = {
  sm: 8,
  md: 12,
  lg: 16,
};

export interface StatusDotProps {
  status?: StatusDotStatus;
  size?: StatusDotSize;
  className?: string;
  pulse?: boolean;
}

export function StatusDot({
  status = "offline",
  size = "md",
  className,
  pulse,
}: StatusDotProps) {
  const px = SIZE_MAP[size];
  const color = COLOR_MAP[status];
  const r = px / 2 - 1;

  return (
    <span
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: px + 6, height: px + 6 }}
      role="status"
      aria-label={status}
    >
      <svg
        width={px + 6}
        height={px + 6}
        viewBox={`0 0 ${px + 6} ${px + 6}`}
        fill="none"
        aria-hidden
      >
        <circle
          cx={px / 2 + 1.5}
          cy={px / 2 + 1.5}
          r={r + 0.6}
          stroke="rgba(0,0,0,0.13)"
          strokeWidth={1.2}
          strokeLinecap="round"
        />
        <circle
          cx={px / 2 + 1.5}
          cy={px / 2 + 1.5}
          r={r}
          fill={color}
        />
      </svg>
      {(pulse || status === "online") && (
        <span
          className={cn(
            "absolute inset-0 rounded-full pointer-events-none",
            status === "online" && "animate-pulse"
          )}
        >
          <svg
            width={px + 6}
            height={px + 6}
            viewBox={`0 0 ${px + 6} ${px + 6}`}
            fill="none"
            aria-hidden
          >
            <circle
              cx={px / 2 + 1.5}
              cy={px / 2 + 1.5}
              r={r + 2.5}
              stroke={color}
              strokeWidth={0.8}
              strokeOpacity={0.3}
            />
          </svg>
        </span>
      )}
    </span>
  );
}
