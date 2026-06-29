import React from "react";
import { cn } from "../../ui/utils";

type SplitRatio = "1/2" | "1/3" | "2/3" | "3/5" | "2/5";

const GRID_COLS: Record<SplitRatio, string> = {
  "1/2": "1fr 1fr",
  "1/3": "1fr 2fr",
  "2/3": "2fr 1fr",
  "3/5": "3fr 2fr",
  "2/5": "2fr 3fr",
};

export interface SplitLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
  /** Column width ratio. Default "1/2" (equal halves). */
  ratio?: SplitRatio;
  /** Gap between panels in Tailwind spacing units (×4 px). Default 6 = 24px. */
  gap?: number;
  /** Which panel(s) scroll independently. Default "both". */
  scrollable?: "both" | "left" | "right" | "neither";
  className?: string;
}

/**
 * Two-panel horizontal split — for reading, flashcard, or study-mode views.
 * Pure layout; use inside DashboardLayout's content well or AppShell directly.
 *
 * Collapses to a single column below lg breakpoint.
 */
export function SplitLayout({
  left,
  right,
  ratio = "1/2",
  gap = 6,
  scrollable = "both",
  className,
}: SplitLayoutProps) {
  return (
    <div
      className={cn("h-full grid-cols-1 lg:grid", className)}
      style={{ gridTemplateColumns: GRID_COLS[ratio], gap: `${gap * 4}px` }}
    >
      <div
        className={cn(
          "h-full",
          (scrollable === "both" || scrollable === "left") && "paper-scrollbar overflow-y-auto",
        )}
      >
        {left}
      </div>
      <div
        className={cn(
          "h-full",
          (scrollable === "both" || scrollable === "right") && "paper-scrollbar overflow-y-auto",
        )}
      >
        {right}
      </div>
    </div>
  );
}
