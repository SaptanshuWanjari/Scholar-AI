import React from "react";
import { cn } from "@paper-ui/utils";
import { PaperIconCircle, type IconTone } from "@paper-ui/core";

export interface ArtifactRowProps {
  icon: React.ReactNode;
  tone?: IconTone;
  title: string;
  /** Type label pill — caller supplies a PaperBadge or any ReactNode. */
  badge?: React.ReactNode;
  date?: string;
  /** Hover-revealed slot (view button, delete, etc.). */
  actions?: React.ReactNode;
  className?: string;
}

export function ArtifactRow({
  icon,
  tone = "ink",
  title,
  badge,
  date,
  actions,
  className,
}: ArtifactRowProps) {
  return (
    <div
      className={cn(
        "group/artifact flex items-center gap-3 rounded-md px-4 py-3 transition-colors hover:bg-black/[0.025]",
        className,
      )}
    >
      <PaperIconCircle tone={tone} size={32}>
        {icon}
      </PaperIconCircle>

      <div className="min-w-0 flex-1 leading-tight">
        <p className="truncate font-kalam text-[15px] font-bold text-ink">{title}</p>
        {badge && <div className="mt-0.5">{badge}</div>}
      </div>

      <div className="flex shrink-0 items-center gap-4">
        {date && (
          <span className="font-architect text-[13px] text-ink-muted">{date}</span>
        )}
        {actions && (
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover/artifact:opacity-100">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
