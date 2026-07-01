import React from "react";
import { Info, CheckCircle2, AlertTriangle, XCircle, X } from "lucide-react";
import { cn } from "@paper-ui/utils";
import { SketchBorder } from "@paper-ui/core";
import { SketchButton } from "@paper-ui/components/buttons";

export type NotificationVariant = "info" | "success" | "warning" | "error";

const VARIANT_CONFIG: Record<
  NotificationVariant,
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
  error: {
    fill: "#fdf0ef",
    stroke: "#9f3a36",
    icon: <XCircle size={16} color="#9f3a36" />,
  },
};

export interface NotificationRootProps {
  variant?: NotificationVariant;
  read?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const NotificationRoot = React.forwardRef<HTMLDivElement, NotificationRootProps>(
  function NotificationRoot(
    { variant = "info", read = false, className, children },
    ref
  ) {
    const config = VARIANT_CONFIG[variant];
    return (
      <div
        ref={ref}
        className={cn(
          "relative px-4 py-3.5",
          read && "opacity-70",
          className
        )}
      >
        <SketchBorder
          fill={config.fill}
          stroke={config.stroke}
          strokeWidth={1.5}
          roughness={1.2}
          shadow={3}
          radius={7}
          bleed={6}
        />
        <div className="relative z-[1]">{children}</div>
      </div>
    );
  }
);

export interface NotificationIconProps {
  icon?: React.ReactNode;
  variant?: NotificationVariant;
}

function NotificationIcon({ icon, variant = "info" }: NotificationIconProps) {
  const config = VARIANT_CONFIG[variant];
  return (
    <div className="mt-[1px] shrink-0">{icon ?? config.icon}</div>
  );
}
NotificationIcon.displayName = "Notification.Icon";

export interface NotificationTitleProps {
  children: React.ReactNode;
  className?: string;
}

function NotificationTitle({ children, className }: NotificationTitleProps) {
  return (
    <p
      className={cn(
        "font-architect text-[14px] text-[#262320] leading-snug",
        className
      )}
    >
      {children}
    </p>
  );
}
NotificationTitle.displayName = "Notification.Title";

export interface NotificationDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

function NotificationDescription({
  children,
  className,
}: NotificationDescriptionProps) {
  return (
    <p
      className={cn(
        "font-kalam text-[12px] text-ink-muted mt-0.5 leading-snug",
        className
      )}
    >
      {children}
    </p>
  );
}
NotificationDescription.displayName = "Notification.Description";

export interface NotificationActionProps {
  label: string;
  onClick?: () => void;
  className?: string;
}

function NotificationAction({
  label,
  onClick,
  className,
}: NotificationActionProps) {
  return (
    <div className={cn("mt-2", className)}>
      <SketchButton size="sm" onClick={onClick}>
        {label}
      </SketchButton>
    </div>
  );
}
NotificationAction.displayName = "Notification.Action";

export interface NotificationDismissProps {
  onDismiss?: () => void;
}

function NotificationDismiss({ onDismiss }: NotificationDismissProps) {
  if (!onDismiss) return null;
  return (
    <button
      onClick={onDismiss}
      className="absolute top-2.5 right-3 z-[2] text-ink-muted hover:text-[#262320] transition-colors"
      aria-label="Dismiss"
    >
      <X size={14} />
    </button>
  );
}
NotificationDismiss.displayName = "Notification.Dismiss";

export interface NotificationTimestampProps {
  children: React.ReactNode;
  className?: string;
}

function NotificationTimestamp({
  children,
  className,
}: NotificationTimestampProps) {
  return (
    <span
      className={cn(
        "font-caveat text-[11px] text-ink-muted mt-1 block",
        className
      )}
    >
      {children}
    </span>
  );
}
NotificationTimestamp.displayName = "Notification.Timestamp";

export const Notification = Object.assign(NotificationRoot, {
  Icon: NotificationIcon,
  Title: NotificationTitle,
  Description: NotificationDescription,
  Action: NotificationAction,
  Dismiss: NotificationDismiss,
  Timestamp: NotificationTimestamp,
});
