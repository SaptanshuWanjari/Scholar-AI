import React from "react";
import { cn } from "../../ui/utils";

export interface ConceptRowProps {
  title: string;
  description?: string;
  /** Mastery dot, status icon, or any leading indicator. */
  indicator?: React.ReactNode;
  /** Difficulty or status badge — right-aligned. */
  badge?: React.ReactNode;
  /** Right-aligned meta: time estimate, prereq count, etc. */
  meta?: string;
  /** Revealed on hover below the row (flex-wrap of action buttons). */
  actions?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function ConceptRow({ title, description, indicator, badge, meta, actions, onClick, className }: ConceptRowProps) {
  return (
    <div
      className={cn(
        "group/concept rounded-md px-4 py-3 transition-colors hover:bg-black/[0.025]",
        onClick && "cursor-pointer",
        className,
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {indicator && <div className="mt-1 shrink-0">{indicator}</div>}

        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate font-kalam text-[15px] font-bold text-ink">{title}</p>
          {description && (
            <p className="mt-0.5 line-clamp-2 font-kalam text-[13px] text-ink-muted">{description}</p>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1">
          {badge && <span>{badge}</span>}
          {meta && <span className="font-architect text-xs text-ink-muted">{meta}</span>}
        </div>
      </div>

      {actions && (
        <div className="mt-2 flex flex-wrap items-center gap-2 opacity-0 transition-opacity group-hover/concept:opacity-100">
          {actions}
        </div>
      )}
    </div>
  );
}
