import React, { useState } from "react";
import { Info, CheckCircle2, AlertTriangle, XCircle, X } from "lucide-react";
import { cn } from "@paper-ui/utils";
import { SketchBorder } from "@paper-ui/core";
import { SketchButton } from "@paper-ui/components/buttons";

export type AnnouncementVariant = "info" | "success" | "warning" | "announcement";

const VARIANT_CONFIG: Record<
  AnnouncementVariant,
  { fill: string; stroke: string; icon: React.ReactNode }
> = {
  info: {
    fill: "#f2f1f8",
    stroke: "#4f4d7a",
    icon: <Info size={16} color="#4f4d7a" />,
  },
  success: {
    fill: "#edf5ea",
    stroke: "#3f7a4e",
    icon: <CheckCircle2 size={16} color="#3f7a4e" />,
  },
  warning: {
    fill: "#fef9ee",
    stroke: "#a3771f",
    icon: <AlertTriangle size={16} color="#a3771f" />,
  },
  announcement: {
    fill: "#fffdf9",
    stroke: "#4f4d7a",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        className="shrink-0"
      >
        <path
          d="M5 12 Q3 7 5 3 Q9 4 12 7 Q15 4 19 3 Q21 7 19 12 Q21 17 19 21 Q15 20 12 17 Q9 20 5 21 Q3 17 5 12 Z"
          stroke="#4f4d7a"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="3" stroke="#4f4d7a" strokeWidth="1.2" />
      </svg>
    ),
  },
};

export interface AnnouncementRootProps {
  variant?: AnnouncementVariant;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  children?: React.ReactNode;
  className?: string;
}

const AnnouncementRoot = React.forwardRef<HTMLDivElement, AnnouncementRootProps>(
  function AnnouncementRoot(
    {
      variant = "info",
      message,
      dismissible = true,
      onDismiss,
      children,
      className,
    },
    ref
  ) {
    const [dismissed, setDismissed] = useState(false);
    const config = VARIANT_CONFIG[variant];

    if (dismissed) return null;

    const handleDismiss = () => {
      setDismissed(true);
      onDismiss?.();
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full overflow-hidden transition-all duration-300",
          className
        )}
      >
        <SketchBorder
          fill={config.fill}
          stroke={config.stroke}
          strokeWidth={1.5}
          roughness={1.1}
          shadow={2}
          radius={6}
          bleed={6}
        />
        <div className="relative z-[1] flex items-center gap-3 px-4 py-3">
          <div className="shrink-0">{config.icon}</div>
          <p className="font-kalam text-[14px] text-[#262320] flex-1 leading-snug">
            {message}
          </p>
          {dismissible && (
            <button
              onClick={handleDismiss}
              className="shrink-0 text-ink-muted hover:text-[#262320] transition-colors"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          )}
        </div>
        {children && <div className="relative z-[1]">{children}</div>}
      </div>
    );
  }
);

export interface AnnouncementIconProps {
  children: React.ReactNode;
  className?: string;
}

function AnnouncementIcon({ children, className }: AnnouncementIconProps) {
  return <div className={cn("shrink-0", className)}>{children}</div>;
}
AnnouncementIcon.displayName = "Announcement.Icon";

export interface AnnouncementMessageProps {
  children: React.ReactNode;
  className?: string;
}

function AnnouncementMessage({
  children,
  className,
}: AnnouncementMessageProps) {
  return (
    <p className={cn("font-kalam text-[14px] text-[#262320] flex-1 leading-snug", className)}>
      {children}
    </p>
  );
}
AnnouncementMessage.displayName = "Announcement.Message";

export interface AnnouncementActionProps {
  label: string;
  onClick?: () => void;
  className?: string;
}

function AnnouncementAction({
  label,
  onClick,
  className,
}: AnnouncementActionProps) {
  return (
    <div className={cn("relative z-[1] px-4 pb-3", className)}>
      <SketchButton size="sm" onClick={onClick}>
        {label}
      </SketchButton>
    </div>
  );
}
AnnouncementAction.displayName = "Announcement.Action";

export interface AnnouncementDismissProps {
  onDismiss?: () => void;
}

function AnnouncementDismiss({ onDismiss }: AnnouncementDismissProps) {
  if (!onDismiss) return null;
  return (
    <button
      onClick={onDismiss}
      className="shrink-0 text-ink-muted hover:text-[#262320] transition-colors"
      aria-label="Dismiss"
    >
      <X size={14} />
    </button>
  );
}
AnnouncementDismiss.displayName = "Announcement.Dismiss";

export const Announcement = Object.assign(AnnouncementRoot, {
  Icon: AnnouncementIcon,
  Message: AnnouncementMessage,
  Action: AnnouncementAction,
  Dismiss: AnnouncementDismiss,
});
