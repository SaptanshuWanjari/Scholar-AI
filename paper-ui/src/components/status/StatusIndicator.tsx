import React from "react";
import { cn } from "@paper-ui/utils";
import { StatusDot, type StatusDotProps, type StatusDotStatus } from "./StatusDot";

/* ------------------------------------------------------------------ */
/* Root                                                                */
/* ------------------------------------------------------------------ */

export interface StatusIndicatorProps {
  status?: StatusDotStatus;
  label?: string;
  size?: StatusDotProps["size"];
  pulse?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const StatusIndicatorRoot = React.forwardRef<HTMLDivElement, StatusIndicatorProps>(
  ({ status = "offline", label, size = "md", pulse, className, children }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center gap-2", className)}
        role="status"
        aria-label={label ?? status}
      >
        {children ?? (
          <>
            <StatusDot status={status} size={size} pulse={pulse} />
            {label && (
              <span className="font-kalam text-[13px] text-ink-muted select-none">
                {label}
              </span>
            )}
          </>
        )}
      </div>
    );
  }
);
StatusIndicatorRoot.displayName = "StatusIndicator";

/* ------------------------------------------------------------------ */
/* Dot (re-export)                                                     */
/* ------------------------------------------------------------------ */

const StatusIndicatorDot: React.FC<StatusDotProps> = (props) => <StatusDot {...props} />;
StatusIndicatorDot.displayName = "StatusIndicator.Dot";

/* ------------------------------------------------------------------ */
/* Label                                                               */
/* ------------------------------------------------------------------ */

export interface StatusIndicatorLabelProps {
  children: React.ReactNode;
  className?: string;
}

const StatusIndicatorLabel: React.FC<StatusIndicatorLabelProps> = ({ children, className }) => (
  <span className={cn("font-kalam text-[13px] text-ink-muted select-none", className)}>
    {children}
  </span>
);
StatusIndicatorLabel.displayName = "StatusIndicator.Label";

/* ------------------------------------------------------------------ */
/* Pulse (animated ring overlay)                                       */
/* ------------------------------------------------------------------ */

export interface StatusIndicatorPulseProps {
  color?: string;
  size?: number;
  className?: string;
}

const StatusIndicatorPulse: React.FC<StatusIndicatorPulseProps> = ({
  color = "#3f7a4e",
  size = 20,
  className,
}) => (
  <span className={cn("absolute inset-0 animate-ping rounded-full pointer-events-none", className)}>
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" aria-hidden>
      <circle cx={size / 2} cy={size / 2} r={size / 2 - 2} stroke={color} strokeWidth={0.6} strokeOpacity={0.3} />
    </svg>
  </span>
);
StatusIndicatorPulse.displayName = "StatusIndicator.Pulse";

/* ------------------------------------------------------------------ */
/* Export                                                              */
/* ------------------------------------------------------------------ */

export const StatusIndicator = Object.assign(StatusIndicatorRoot, {
  Dot: StatusIndicatorDot,
  Label: StatusIndicatorLabel,
  Pulse: StatusIndicatorPulse,
});
