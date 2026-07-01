import React from "react";
import { cn } from "@paper-ui/utils";
import { SketchBorder } from "@paper-ui/core";
import { SketchButton } from "@paper-ui/components/buttons";
import { NotificationItem, type NotificationItemData } from "./NotificationItem";

export interface NotificationCenterRootProps {
  notifications: NotificationItemData[];
  onDismiss?: (id: string) => void;
  onMarkAllRead?: () => void;
  onViewAll?: () => void;
  maxItems?: number;
  position?: "fixed" | "inline";
  className?: string;
  children?: React.ReactNode;
}

const NotificationCenterRoot = React.forwardRef<
  HTMLDivElement,
  NotificationCenterRootProps
>(function NotificationCenterRoot(
  {
    notifications,
    onDismiss,
    onMarkAllRead,
    onViewAll,
    maxItems = 10,
    position = "inline",
    className,
    children,
  },
  ref
) {
  const displayed = notifications.slice(0, maxItems);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const positionClasses =
    position === "fixed"
      ? "fixed right-6 top-20 z-[65] w-[380px] max-h-[520px]"
      : "w-full max-w-[420px]";

  return (
    <div
      ref={ref}
      className={cn("relative flex flex-col bg-[#fffdf9]", positionClasses, className)}
    >
      <SketchBorder
        fill="#fffdf9"
        stroke="#3a3733"
        strokeWidth={1.5}
        roughness={1.2}
        shadow={5}
        radius={8}
        bleed={6}
      />
      <div className="relative z-[1] flex flex-col h-full max-h-[520px]">
        {children ?? (
          <>
            <Header
              unreadCount={unreadCount}
              onMarkAllRead={onMarkAllRead}
            />
            <List
              notifications={displayed}
              onDismiss={onDismiss}
            />
            {displayed.length === 0 && <Empty />}
            {notifications.length > maxItems && (
              <Footer onViewAll={onViewAll} />
            )}
          </>
        )}
      </div>
    </div>
  );
});

export interface HeaderProps {
  unreadCount: number;
  onMarkAllRead?: () => void;
  className?: string;
}

function Header({ unreadCount, onMarkAllRead, className }: HeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-4 py-3 border-b border-dashed border-[#d4cfc4]",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <h3 className="font-architect text-[16px] text-[#262320]">
          Notifications
        </h3>
        {unreadCount > 0 && (
          <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-[#262320]">
            <span className="font-architect text-[11px] text-[#fbf8f2] leading-none">
              {unreadCount}
            </span>
          </span>
        )}
      </div>
      {onMarkAllRead && unreadCount > 0 && (
        <button
          onClick={onMarkAllRead}
          className="font-architect text-[12px] text-ink-muted hover:text-ink transition-colors underline decoration-dotted underline-offset-2"
        >
          Mark all read
        </button>
      )}
    </div>
  );
}
Header.displayName = "NotificationCenter.Header";

export interface ListProps {
  notifications: NotificationItemData[];
  onDismiss?: (id: string) => void;
  className?: string;
}

function List({ notifications, onDismiss, className }: ListProps) {
  return (
    <div className={cn("flex-1 overflow-y-auto", className)}>
      {notifications.map((n) => (
        <NotificationItem.Root
          key={n.id}
          notification={n}
          onDismiss={onDismiss ? () => onDismiss(n.id) : undefined}
        />
      ))}
    </div>
  );
}
List.displayName = "NotificationCenter.List";

export interface EmptyProps {
  className?: string;
}

function Empty({ className }: EmptyProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-6 text-center",
        className
      )}
    >
      <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        className="mb-4"
      >
        <path
          d="M12 36 L52 36 Q56 36 56 40 L56 48 Q56 52 52 52 L12 52 Q8 52 8 48 L8 40 Q8 36 12 36 Z"
          stroke="#b4ad9e"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 36 L24 20 L40 20 L48 36"
          stroke="#b4ad9e"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M28 44 L36 44"
          stroke="#d4cfc4"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <circle cx="48" cy="16" r="7" stroke="#c0b9ae" strokeWidth="1.3" />
        <path
          d="M46 14 L50 14 M48 12 L48 16"
          stroke="#c0b9ae"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
      <p className="font-architect text-[15px] text-ink-muted">
        No notifications yet
      </p>
      <p className="font-kalam text-[12px] text-ink-muted mt-1">
        We'll notify you when something happens
      </p>
    </div>
  );
}
Empty.displayName = "NotificationCenter.Empty";

export interface FooterProps {
  onViewAll?: () => void;
  className?: string;
}

function Footer({ onViewAll, className }: FooterProps) {
  return (
    <div
      className={cn(
        "px-4 py-3 border-t border-dashed border-[#d4cfc4] text-center",
        className
      )}
    >
      <button
        onClick={onViewAll}
        className="font-architect text-[13px] text-ink-muted hover:text-ink transition-colors underline decoration-dotted underline-offset-2"
      >
        View all notifications
      </button>
    </div>
  );
}
Footer.displayName = "NotificationCenter.Footer";

export const NotificationCenter = Object.assign(NotificationCenterRoot, {
  Header,
  List,
  Empty,
  Footer,
});
