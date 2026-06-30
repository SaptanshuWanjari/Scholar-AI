import React from "react";
import { cn } from "@/paper-ui/utils";
import { SketchBorder } from "@/paper-ui/core";

export interface TopBarProps {
  /** Left-aligned slot — typically Breadcrumbs or a page title. */
  start?: React.ReactNode;
  /** Right-aligned slot — typically search + icon buttons. */
  children?: React.ReactNode;
  className?: string;
}

/** Paper-themed header strip. Renders as a floating paper island. */
export function TopBar({ start, children, className }: TopBarProps) {
  return (
    <div className={cn("px-4 py-3 w-full", className)}>
      <header className="relative flex h-16 w-full shrink-0 items-center px-6">
        <SketchBorder
          fill="var(--color-paper-card, #fffdf9)"
          stroke="var(--color-border, #e4e0d6)"
          strokeWidth={1.5}
          roughness={1.2}
          bowing={0.5}
          radius={8}
          shadow={3}
          shadowColor="rgba(0,0,0,0.06)"
          bleed={3}
        />
        
        <div className="relative z-[1] flex w-full items-center gap-4">
          {start && <div className="flex flex-1 items-center font-architect text-ink">{start}</div>}
          <div className={cn("flex shrink-0 items-center gap-3", !start && "ml-auto")}>
            {children}
          </div>
        </div>
      </header>
    </div>
  );
}
