import React from "react";
import { cn } from "../../ui/utils";
import { AppShell } from "./AppShell";

export interface DashboardLayoutProps {
  sidebar: React.ReactNode;
  topbar?: React.ReactNode;
  children: React.ReactNode;
  /** Max width of the scrollable content column. Default 1400. */
  maxWidth?: number | string;
}

/**
 * Full notebook app shell: fixed sidebar, optional top bar, scrollable
 * content well. Uses AppShell internally — do not nest inside another AppShell.
 */
export function DashboardLayout({ sidebar, topbar, children, maxWidth = 1400 }: DashboardLayoutProps) {
  return (
    <AppShell className="flex">
      {sidebar}
      <main className="relative z-[1] flex h-full min-w-0 flex-1 flex-col">
        {topbar}
        <div className="paper-scrollbar flex-1 overflow-y-auto px-6 py-8 md:px-10">
          <div
            className="mx-auto w-full"
            style={{ maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth }}
          >
            {children}
          </div>
        </div>
      </main>
    </AppShell>
  );
}

export interface ContentGridProps {
  children: React.ReactNode;
  className?: string;
}

/** 12-column content grid; right column collapses under it on tablet. */
export function ContentGrid({ children, className }: ContentGridProps) {
  return <div className={cn("grid grid-cols-1 gap-8 lg:grid-cols-12", className)}>{children}</div>;
}

export function ContentColumn({
  span = "main",
  children,
  className,
}: {
  span?: "main" | "side";
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-8",
        span === "main" ? "lg:col-span-8" : "lg:col-span-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
