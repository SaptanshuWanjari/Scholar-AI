import React from "react";
import { cn } from "@paper-ui/utils";

const sizeMap = {
  sm: { dot: 5, gap: "gap-1", container: "gap-2" },
  md: { dot: 7, gap: "gap-1.5", container: "gap-2.5" },
  lg: { dot: 9, gap: "gap-2", container: "gap-3" },
};

const colorMap: Record<string, string> = {
  ink: "#3a3733",
  sage: "#7fa37b",
  ochre: "#b07a2e",
  sky: "#4a6f91",
  brick: "#a3544a",
};

export interface SpinnerRootProps {
  variant?: "bounce" | "spin" | "pulse" | "scribble";
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
  children?: React.ReactNode;
}

const SpinnerRoot = React.forwardRef<HTMLDivElement, SpinnerRootProps>(
  ({ variant = "bounce", size = "md", color = "ink", className, children }, ref) => {
    const ink = colorMap[color] ?? color;
    const s = sizeMap[size];

    return (
      <div
        ref={ref}
        role="status"
        aria-label="Loading"
        className={cn("flex flex-col items-center", s.container, className)}
      >
        {variant === "bounce" && (
          <div className={cn("flex items-center", s.gap)}>
            {[0, 120, 240].map((delay, i) => (
              <svg
                key={i}
                width={s.dot}
                height={s.dot}
                viewBox="0 0 12 12"
                className="animate-bounce"
                style={{ animationDelay: `${delay}ms` }}
                aria-hidden
              >
                <circle
                  cx="6" cy="6" r="4.5"
                  stroke={ink} strokeWidth="1.5" fill="none"
                  strokeLinecap="round"
                />
              </svg>
            ))}
          </div>
        )}

        {variant === "spin" && (
          <svg
            width={s.dot * 4}
            height={s.dot * 4}
            viewBox="0 0 32 32"
            className="animate-spin"
            aria-hidden
          >
            <circle
              cx="16" cy="16" r="12"
              stroke={ink} strokeWidth="2" fill="none"
              strokeLinecap="round"
              strokeDasharray="60 15"
              style={{ strokeDashoffset: 0 }}
            />
          </svg>
        )}

        {variant === "pulse" && (
          <svg
            width={s.dot * 4}
            height={s.dot * 4}
            viewBox="0 0 32 32"
            className="animate-pulse"
            aria-hidden
          >
            <circle
              cx="16" cy="16" r="11"
              stroke={ink} strokeWidth="2.6" fill="none"
              strokeLinecap="round"
            />
          </svg>
        )}

        {variant === "scribble" && (
          <svg
            width={s.dot * 4}
            height={s.dot * 4}
            viewBox="0 0 32 32"
            className="animate-spin"
            aria-hidden
          >
            <path
              d="M16 4 C13 3 7 5 5 12 C3 19 9 26 16 27 C23 28 28 22 28 16 C28 10 23 5 16 5"
              stroke={ink} strokeWidth="2" fill="none"
              strokeLinecap="round"
              strokeDasharray="68 68"
              style={{ strokeDashoffset: 0 }}
            />
          </svg>
        )}

        {children}
      </div>
    );
  }
);
SpinnerRoot.displayName = "Spinner.Root";

export interface SpinnerDotProps {
  color?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function SpinnerDot({ color = "ink", size = "md", className }: SpinnerDotProps) {
  const ink = colorMap[color] ?? color;
  const r = sizeMap[size].dot;
  return (
    <svg
      width={r} height={r}
      viewBox="0 0 12 12"
      className={className}
      aria-hidden
    >
      <circle
        cx="6" cy="6" r="4.5"
        stroke={ink} strokeWidth="1.5" fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
SpinnerDot.displayName = "Spinner.Dot";

export interface SpinnerLabelProps {
  className?: string;
  children: React.ReactNode;
}

function SpinnerLabel({ className, children }: SpinnerLabelProps) {
  return (
    <span className={cn("font-kalam text-[13px] text-ink-muted", className)}>
      {children}
    </span>
  );
}
SpinnerLabel.displayName = "Spinner.Label";

export const Spinner = Object.assign(SpinnerRoot, {
  Dot: SpinnerDot,
  Label: SpinnerLabel,
});
