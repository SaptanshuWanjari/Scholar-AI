import React from "react";
import { cn } from "@paper-ui/utils";
import { PaperCard, SketchSurface } from "@paper-ui/core";
import { Tape } from "../decorations";

export type DataEmptyStateVariant = "sketch" | "dashed" | "tape";

export interface DataEmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  variant?: DataEmptyStateVariant;
  className?: string;
}

export function DataEmptyState({
  title,
  description,
  icon,
  action,
  variant = "sketch",
  className,
}: DataEmptyStateProps) {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
      {icon && <div className="text-ink-muted/50 mb-2">{icon}</div>}
      <h3 className="font-caveat text-3xl font-bold text-ink">{title}</h3>
      {description && (
        <p className="font-kalam text-lg text-ink-muted max-w-sm">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );

  if (variant === "dashed") {
    return (
      <div
        className={cn(
          "relative rounded-xl border-2 border-dashed border-ink-muted/30 bg-paper-surface/50 p-6",
          className
        )}
      >
        {content}
      </div>
    );
  }

  if (variant === "tape") {
    return (
      <PaperCard className={cn("relative p-6", className)}>
        <Tape corner="top-center" width={100} />
        {content}
      </PaperCard>
    );
  }

  // sketch variant
  return (
    <div className={cn("relative p-6", className)}>
      <SketchSurface />
      <div className="relative z-10">{content}</div>
    </div>
  );
}
