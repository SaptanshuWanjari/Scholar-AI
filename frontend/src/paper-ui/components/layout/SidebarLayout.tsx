import React from "react";
import { cn } from "@/paper-ui/utils";
import { AppShell } from "./AppShell";

export interface SidebarLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  /** Width of the sidebar panel. Default 256 (matches navigation Sidebar w-64). */
  sidebarWidth?: number | string;
  /** Extra classes on the main content area. */
  className?: string;
}

/**
 * Generic sidebar + scrollable content. No top-bar slot — use DashboardLayout
 * when you need both. Good for settings pages, course detail, reading mode.
 *
 * Uses AppShell internally — do not nest inside another AppShell.
 */
export function SidebarLayout({ sidebar, children, sidebarWidth = 256, className }: SidebarLayoutProps) {
  return (
    <AppShell className="flex">
      <aside
        className="paper-scrollbar flex h-full shrink-0 flex-col overflow-y-auto"
        style={{ width: typeof sidebarWidth === "number" ? `${sidebarWidth}px` : sidebarWidth }}
      >
        {sidebar}
      </aside>
      <div className={cn("paper-scrollbar relative flex-1 overflow-y-auto", className)}>
        {children}
      </div>
    </AppShell>
  );
}
