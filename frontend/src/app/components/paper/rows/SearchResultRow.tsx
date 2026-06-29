import React from "react";
import { cn } from "../../ui/utils";

export interface SearchResultRowProps {
  title: string;
  /** Course, category, or type label pill. */
  badge?: React.ReactNode;
  /** Pre-highlighted snippet — caller owns the highlight markup. */
  snippet?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function SearchResultRow({ title, badge, snippet, onClick, className }: SearchResultRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-md px-4 py-3 text-left transition-colors hover:bg-black/[0.025]",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="truncate font-kalam text-[15px] font-bold text-ink">{title}</p>
        {badge && <span className="shrink-0">{badge}</span>}
      </div>
      {snippet && (
        <p className="mt-1 font-kalam text-[13px] leading-relaxed text-ink-muted">{snippet}</p>
      )}
    </button>
  );
}
