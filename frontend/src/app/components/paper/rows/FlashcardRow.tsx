import React from "react";
import { cn } from "../../ui/utils";

export interface FlashcardRowProps {
  /** Primary text (question / front). */
  front: string;
  /** Secondary text (answer / back). */
  back: string;
  /** Card type chip — caller supplies a PaperBadge or any ReactNode. */
  badge?: React.ReactNode;
  /** Right-side meta: deck name, due date, etc. */
  meta?: string;
  /** Hover-revealed slot (delete, add-to-notebook, etc.). */
  actions?: React.ReactNode;
  className?: string;
}

export function FlashcardRow({
  front,
  back,
  badge,
  meta,
  actions,
  className,
}: FlashcardRowProps) {
  return (
    <div
      className={cn(
        "group/flashcard flex items-center gap-4 rounded-md px-4 py-3 transition-colors hover:bg-black/[0.025]",
        className,
      )}
    >
      {badge && <div className="shrink-0">{badge}</div>}

      <div className="min-w-0 flex-1 leading-tight">
        <p className="truncate font-kalam text-[15px] font-bold text-ink">{front}</p>
        <p className="truncate font-kalam text-[13px] text-ink-muted">{back}</p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {meta && (
          <span className="font-architect text-[13px] text-ink-muted">{meta}</span>
        )}
        {actions && (
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover/flashcard:opacity-100">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
