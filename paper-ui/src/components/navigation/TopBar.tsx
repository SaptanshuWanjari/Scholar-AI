import React from "react";
import { cn } from "@paper-ui/utils";

export interface TopBarProps {
  /** Left-aligned slot — typically Breadcrumbs or a page title. */
  start?: React.ReactNode;
  /** Right-aligned slot — typically search + icon buttons. */
  children?: React.ReactNode;
  className?: string;
}

/** Minimal header strip above the main content area. */
export function TopBar({ start, children, className }: TopBarProps) {
  return (
    <header
      className={cn("flex h-16 shrink-0 items-center gap-4 px-8", className)}
      style={{ borderBottom: "1.5px solid rgba(0,0,0,0.08)" }}
    >
      {start && <div className="flex flex-1 items-center">{start}</div>}
      <div className={cn("flex shrink-0 items-center gap-3", !start && "ml-auto")}>
        {children}
      </div>
    </header>
  );
}
