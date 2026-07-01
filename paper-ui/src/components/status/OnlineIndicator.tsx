import React from "react";
import { cn } from "@paper-ui/utils";

export type OnlineIndicatorSize = "sm" | "md" | "lg";

const SIZE_MAP: Record<OnlineIndicatorSize, { dot: number; ring: number }> = {
  sm: { dot: 8, ring: 14 },
  md: { dot: 12, ring: 20 },
  lg: { dot: 16, ring: 26 },
};

/* ------------------------------------------------------------------ */
/* Root                                                                */
/* ------------------------------------------------------------------ */

export interface OnlineIndicatorProps {
  label?: string;
  size?: OnlineIndicatorSize;
  className?: string;
  children?: React.ReactNode;
}

const OnlineIndicatorRoot = React.forwardRef<HTMLDivElement, OnlineIndicatorProps>(
  ({ label, size = "md", className, children }, ref) => {
    const s = SIZE_MAP[size];

    return (
      <div
        ref={ref}
        className={cn("relative inline-flex items-center gap-2", className)}
        role="status"
        aria-label={label ?? "Online"}
      >
        {children ?? (
          <span className="relative inline-flex shrink-0" style={{ width: s.ring, height: s.ring }}>
            <span className="absolute inset-0 animate-ping rounded-full opacity-40">
              <svg width={s.ring} height={s.ring} viewBox={`0 0 ${s.ring} ${s.ring}`} fill="none" aria-hidden>
                <circle cx={s.ring / 2} cy={s.ring / 2} r={s.ring / 2 - 1} stroke="#3f7a4e" strokeWidth={1.5} />
              </svg>
            </span>
            <span className="absolute inset-0 flex items-center justify-center">
              <svg width={s.dot + 4} height={s.dot + 4} viewBox={`0 0 ${s.dot + 4} ${s.dot + 4}`} fill="none" aria-hidden>
                <circle
                  cx={s.dot / 2 + 1}
                  cy={s.dot / 2 + 1}
                  r={s.dot / 2 + 0.5}
                  stroke="rgba(0,0,0,0.13)"
                  strokeWidth={1.1}
                />
                <circle cx={s.dot / 2 + 1} cy={s.dot / 2 + 1} r={s.dot / 2 - 0.5} fill="#3f7a4e" />
              </svg>
            </span>
          </span>
        )}
        {label && (
          <span className="font-kalam text-[13px] text-ink-muted select-none">{label}</span>
        )}
      </div>
    );
  }
);
OnlineIndicatorRoot.displayName = "OnlineIndicator";

/* ------------------------------------------------------------------ */
/* Dot                                                                 */
/* ------------------------------------------------------------------ */

export interface OnlineIndicatorDotProps {
  size?: OnlineIndicatorSize;
}

const OnlineIndicatorDot: React.FC<OnlineIndicatorDotProps> = ({ size = "md" }) => {
  const s = SIZE_MAP[size];

  return (
    <span className="relative inline-flex shrink-0" style={{ width: s.ring, height: s.ring }}>
      <span className="absolute inset-0 flex items-center justify-center">
        <svg width={s.dot + 4} height={s.dot + 4} viewBox={`0 0 ${s.dot + 4} ${s.dot + 4}`} fill="none" aria-hidden>
          <circle
            cx={s.dot / 2 + 1}
            cy={s.dot / 2 + 1}
            r={s.dot / 2 + 0.5}
            stroke="rgba(0,0,0,0.13)"
            strokeWidth={1.1}
          />
          <circle cx={s.dot / 2 + 1} cy={s.dot / 2 + 1} r={s.dot / 2 - 0.5} fill="#3f7a4e" />
        </svg>
      </span>
    </span>
  );
};
OnlineIndicatorDot.displayName = "OnlineIndicator.Dot";

/* ------------------------------------------------------------------ */
/* Label                                                               */
/* ------------------------------------------------------------------ */

export interface OnlineIndicatorLabelProps {
  children: React.ReactNode;
  className?: string;
}

const OnlineIndicatorLabel: React.FC<OnlineIndicatorLabelProps> = ({ children, className }) => (
  <span className={cn("font-kalam text-[13px] text-ink-muted select-none", className)}>{children}</span>
);
OnlineIndicatorLabel.displayName = "OnlineIndicator.Label";

/* ------------------------------------------------------------------ */
/* Export                                                              */
/* ------------------------------------------------------------------ */

export const OnlineIndicator = Object.assign(OnlineIndicatorRoot, {
  Dot: OnlineIndicatorDot,
  Label: OnlineIndicatorLabel,
});
