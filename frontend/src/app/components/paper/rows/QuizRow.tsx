import React from "react";
import { cn } from "../../ui/utils";

export interface QuizRowProps {
  title: string;
  /** e.g. "12 questions". */
  count?: string;
  /** Difficulty or category badge. */
  badge?: React.ReactNode;
  /** Score rendered large in font-caveat. */
  score?: string;
  /** Hover-revealed slot (open, delete, etc.). */
  actions?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function QuizRow({ title, count, badge, score, actions, onClick, className }: QuizRowProps) {
  return (
    <div
      className={cn(
        "group/quiz flex items-center gap-4 rounded-md px-4 py-3 transition-colors hover:bg-black/[0.025]",
        onClick && "cursor-pointer",
        className,
      )}
      onClick={onClick}
    >
      <div className="min-w-0 flex-1 leading-tight">
        <p className="truncate font-kalam text-[15px] font-bold text-ink">{title}</p>
        <div className="mt-0.5 flex items-center gap-2">
          {count && <span className="font-architect text-xs text-ink-muted">{count}</span>}
          {badge && <span className="shrink-0">{badge}</span>}
        </div>
      </div>

      {score !== undefined && (
        <span className="shrink-0 font-caveat text-[28px] font-bold leading-none text-ink">
          {score}
        </span>
      )}

      {actions && (
        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover/quiz:opacity-100">
          {actions}
        </div>
      )}
    </div>
  );
}
