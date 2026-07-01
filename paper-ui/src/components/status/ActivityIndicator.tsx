import React from "react";
import { cn } from "@paper-ui/utils";

export type ActivityType = "typing" | "active" | "idle";

const ACTIVITY_LABELS: Record<ActivityType, string> = {
  typing: "typing…",
  active: "active now",
  idle: "idle",
};

/* ------------------------------------------------------------------ */
/* Root                                                                */
/* ------------------------------------------------------------------ */

export interface ActivityIndicatorProps {
  activity?: ActivityType;
  label?: string;
  className?: string;
  children?: React.ReactNode;
}

const ActivityIndicatorRoot = React.forwardRef<HTMLDivElement, ActivityIndicatorProps>(
  ({ activity = "active", label, className, children }, ref) => {
    const displayLabel = label ?? ACTIVITY_LABELS[activity];

    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center gap-1.5", className)}
        role="status"
        aria-label={displayLabel}
      >
        {children ?? (
          <>
            <ActivityIndicatorDots activity={activity} />
            <span className="font-kalam text-[13px] text-ink-muted select-none">{displayLabel}</span>
          </>
        )}
      </div>
    );
  }
);
ActivityIndicatorRoot.displayName = "ActivityIndicator";

/* ------------------------------------------------------------------ */
/* Dots animated                                                       */
/* ------------------------------------------------------------------ */

const DOT_DELAYS: Record<ActivityType, number[]> = {
  typing: [0, 150, 300],
  active: [0, 250, 500],
  idle: [0, 0, 0],
};

const DOT_COLORS: Record<ActivityType, string> = {
  typing: "#3a3733",
  active: "#3f7a4e",
  idle: "#a39e93",
};

export interface ActivityIndicatorDotsProps {
  activity?: ActivityType;
  size?: "sm" | "md";
  className?: string;
}

function ActivityIndicatorDots({
  activity = "active",
  size = "md",
  className,
}: ActivityIndicatorDotsProps) {
  const delays = DOT_DELAYS[activity];
  const color = DOT_COLORS[activity];
  const dotSize = size === "sm" ? "w-[5px] h-[5px]" : "w-[7px] h-[7px]";
  const isIdle = activity === "idle";

  return (
    <span className={cn("inline-flex items-center gap-1", className)} aria-hidden>
      {delays.map((delay, i) => (
        <span
          key={i}
          className={cn(
            "rounded-full inline-block",
            dotSize,
            isIdle ? "" : "animate-bounce"
          )}
          style={{
            backgroundColor: color,
            animationDelay: `${delay}ms`,
            animationDuration: isIdle ? "0s" : activity === "typing" ? "0.6s" : "0.8s",
          }}
        />
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Label                                                               */
/* ------------------------------------------------------------------ */

export interface ActivityIndicatorLabelProps {
  children: React.ReactNode;
  className?: string;
}

const ActivityIndicatorLabel: React.FC<ActivityIndicatorLabelProps> = ({ children, className }) => (
  <span className={cn("font-kalam text-[13px] text-ink-muted select-none", className)}>{children}</span>
);
ActivityIndicatorLabel.displayName = "ActivityIndicator.Label";

/* ------------------------------------------------------------------ */
/* Export                                                              */
/* ------------------------------------------------------------------ */

export const ActivityIndicator = Object.assign(ActivityIndicatorRoot, {
  Dots: ActivityIndicatorDots,
  Label: ActivityIndicatorLabel,
});
