import React from "react";
import { cn } from "../../ui/utils";

export interface PaperGridProps {
  children: React.ReactNode;
  /** Minimum card width before wrapping (px). Default 260. */
  minCardWidth?: number;
  /** Gap in Tailwind spacing units (×4 px). Default 6 = 24px. */
  gap?: number;
  className?: string;
}

/**
 * Auto-responsive card grid. Fills available width with as many columns as
 * fit, then wraps — no explicit column count needed. Good for courses,
 * flashcard decks, document galleries.
 */
export function PaperGrid({ children, minCardWidth = 260, gap = 6, className }: PaperGridProps) {
  return (
    <div
      className={cn("grid", className)}
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${minCardWidth}px, 1fr))`,
        gap: `${gap * 4}px`,
      }}
    >
      {children}
    </div>
  );
}

export interface NotebookGridProps extends PaperGridProps {
  /**
   * Apply a tiny alternating tilt to each card so they look like papers
   * spread across a desk (±0.4°). Default true.
   */
  stagger?: boolean;
}

/** PaperGrid with per-card micro-rotation — papers casually spread out. */
export function NotebookGrid({ children, stagger = true, className, ...props }: NotebookGridProps) {
  const ROTS = [-0.4, 0.3, -0.2, 0.4, -0.3, 0.2];

  const items = stagger
    ? React.Children.map(children, (child, i) => (
        <div key={i} style={{ transform: `rotate(${ROTS[i % ROTS.length]}deg)` }}>
          {child}
        </div>
      ))
    : children;

  return (
    <PaperGrid className={cn("notebook-grid", className)} {...props}>
      {items}
    </PaperGrid>
  );
}
