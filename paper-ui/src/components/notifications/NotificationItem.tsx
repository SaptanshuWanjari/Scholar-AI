import React from "react";
import { X } from "lucide-react";
import { cn } from "@paper-ui/utils";
import type { NotificationVariant } from "./Notification";

const VARIANT_DOT_COLORS: Record<NotificationVariant, string> = {
  info: "#4f4d7a",
  success: "#3f7a4e",
  warning: "#a3771f",
  error: "#9f3a36",
};

export interface NotificationItemData {
  id: string;
  variant: NotificationVariant;
  title: string;
  description?: string;
  timestamp?: string;
  read?: boolean;
}

export interface NotificationItemRootProps {
  notification: NotificationItemData;
  onClick?: () => void;
  onDismiss?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const NotificationItemRoot = React.forwardRef<
  HTMLDivElement,
  NotificationItemRootProps
>(function NotificationItemRoot(
  { notification, onClick, onDismiss, className, children },
  ref
) {
  return (
    <div
      ref={ref}
      onClick={onClick}
      className={cn(
        "relative group flex items-start gap-3 px-4 py-3 cursor-pointer",
        "transition-colors hover:bg-black/[0.03]",
        notification.read && "opacity-60",
        className
      )}
    >
      <div className="absolute bottom-0 left-4 right-4 h-px">
        <svg
          width="100%"
          height="2"
          className="translate-y-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <line
            x1="0"
            y1="0"
            x2="100%"
            y2="0"
            stroke="#c0b9ae"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeDasharray="4 3"
          />
        </svg>
      </div>
      {children ? (
        children
      ) : (
        <>
          <Dot notification={notification} />
          <Content notification={notification} />
          <Time notification={notification} />
        </>
      )}
      {onDismiss && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          className="ml-auto shrink-0 opacity-0 group-hover:opacity-100 text-ink-muted hover:text-[#262320] transition-all"
          aria-label="Dismiss"
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
});

export interface DotProps {
  notification: NotificationItemData;
  className?: string;
}

function Dot({ notification, className }: DotProps) {
  const color = VARIANT_DOT_COLORS[notification.variant];
  return (
    <div className={cn("mt-1.5 shrink-0", className)}>
      <svg width="10" height="10" viewBox="0 0 10 10">
        <circle
          cx="5"
          cy="5"
          r={notification.read ? 3 : 4.5}
          fill={notification.read ? "none" : color}
          stroke={color}
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}
Dot.displayName = "NotificationItem.Dot";

export interface ContentProps {
  notification: NotificationItemData;
  className?: string;
}

function Content({ notification, className }: ContentProps) {
  return (
    <div className={cn("flex-1 min-w-0", className)}>
      <p
        className={cn(
          "font-architect text-[13px] leading-snug truncate",
          notification.read ? "text-ink-muted" : "text-[#262320]"
        )}
      >
        {notification.title}
      </p>
      {notification.description && (
        <p className="font-kalam text-[11px] text-ink-muted mt-0.5 truncate leading-snug">
          {notification.description}
        </p>
      )}
    </div>
  );
}
Content.displayName = "NotificationItem.Content";

export interface TimeProps {
  notification: NotificationItemData;
  className?: string;
}

function Time({ notification, className }: TimeProps) {
  if (!notification.timestamp) return null;
  return (
    <span
      className={cn(
        "font-caveat text-[11px] text-ink-muted mt-1 shrink-0",
        className
      )}
    >
      {notification.timestamp}
    </span>
  );
}
Time.displayName = "NotificationItem.Time";

export const NotificationItem = Object.assign(NotificationItemRoot, {
  Dot,
  Content,
  Time,
});
