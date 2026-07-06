import React from "react";
import { cn } from "@paper-ui/utils";
import { SketchBorder } from "@paper-ui/core";

const toneColors: Record<string, string> = {
  sage: "#7fa37b",
  ochre: "#b07a2e",
  sky: "#4a6f91",
  brick: "#a3544a",
};

const sizeMap = {
  sm: { h: "h-2", label: "text-xs", pct: "text-xs px-1.5 py-0.5", gap: "gap-1" },
  md: { h: "h-3", label: "text-sm", pct: "text-xs px-2 py-0.5", gap: "gap-1.5" },
  lg: { h: "h-4", label: "text-sm", pct: "text-sm px-2 py-1", gap: "gap-2" },
};

const hachureBg = (color: string): React.CSSProperties => ({
  backgroundColor: color,
  backgroundImage:
    "repeating-linear-gradient(45deg, rgba(255,255,255,0.15) 0 1.5px, transparent 1.5px 8px)",
});

export interface ProgressBarRootProps {
  variant?: "determinate" | "indeterminate";
  value?: number;
  size?: "sm" | "md" | "lg";
  tone?: "sage" | "ochre" | "sky" | "brick";
  className?: string;
  children?: React.ReactNode;
}

const ProgressBarRoot = React.forwardRef<HTMLDivElement, ProgressBarRootProps>(
  ({ variant = "determinate", value = 0, size = "md", tone = "sage", className, children }, ref) => {
    const s = sizeMap[size];
    const color = toneColors[tone];
    const clamped = Math.max(0, Math.min(100, value));

    return (
      <div ref={ref} className={cn("flex flex-col", s.gap, className)} role="progressbar" aria-valuenow={variant === "determinate" ? clamped : undefined} aria-valuemin={0} aria-valuemax={100}>
        <div className="flex items-center justify-between">
          {children}
        </div>
        <div className={cn("relative w-full", s.h)}>
          <SketchBorder stroke={color} fill="#f4f1ea" roughness={0.9} radius={4} strokeWidth={1.2} />
          <div className="absolute inset-0 overflow-hidden rounded-[4px]">
            {variant === "determinate" && (
              <div
                className={cn("h-full transition-[width] duration-500 ease-out rounded-[3px]", s.h)}
                style={{ width: `${clamped}%`, ...hachureBg(color) }}
              />
            )}
            {variant === "indeterminate" && (
              <div
                className={cn("h-full rounded-[3px] animate-slide-indeterminate", s.h)}
                style={{ width: "40%", ...hachureBg(color) }}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
);
ProgressBarRoot.displayName = "ProgressBar.Root";

export interface ProgressBarTrackProps {
  className?: string;
  children?: React.ReactNode;
}

function ProgressBarTrack({ className, children }: ProgressBarTrackProps) {
  return (
    <div className={cn("relative w-full h-3", className)}>
      <SketchBorder stroke="#d4cfc2" fill="#f4f1ea" roughness={0.8} radius={4} strokeWidth={1} />
      <div className="absolute inset-0 overflow-hidden rounded-[4px]">{children}</div>
    </div>
  );
}
ProgressBarTrack.displayName = "ProgressBar.Track";

export interface ProgressBarFillProps {
  value?: number;
  tone?: "sage" | "ochre" | "sky" | "brick";
  className?: string;
}

function ProgressBarFill({ value = 0, tone = "sage", className }: ProgressBarFillProps) {
  const color = toneColors[tone];
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div
      className={cn("h-full rounded-[3px] transition-[width] duration-500 ease-out", className)}
      style={{ width: `${clamped}%`, ...hachureBg(color) }}
    />
  );
}
ProgressBarFill.displayName = "ProgressBar.Fill";

export interface ProgressBarLabelProps {
  className?: string;
  children: React.ReactNode;
}

function ProgressBarLabel({ className, children }: ProgressBarLabelProps) {
  return (
    <span className={cn("font-kalam text-ink-muted", className)}>
      {children}
    </span>
  );
}
ProgressBarLabel.displayName = "ProgressBar.Label";

export interface ProgressBarPercentageProps {
  value?: number;
  tone?: "sage" | "ochre" | "sky" | "brick";
  size?: "sm" | "md" | "lg";
  className?: string;
}

function ProgressBarPercentage({ value = 0, tone = "sage", size = "md", className }: ProgressBarPercentageProps) {
  const color = toneColors[tone];
  const s = sizeMap[size];

  return (
    <span
      className={cn(
        "font-architect rounded-full border shrink-0",
        s.pct,
        className
      )}
      style={{ borderColor: color, color, backgroundColor: `${color}15` }}
    >
      {Math.round(value)}%
    </span>
  );
}
ProgressBarPercentage.displayName = "ProgressBar.Percentage";

export const ProgressBar = Object.assign(ProgressBarRoot, {
  Track: ProgressBarTrack,
  Fill: ProgressBarFill,
  Label: ProgressBarLabel,
  Percentage: ProgressBarPercentage,
});
