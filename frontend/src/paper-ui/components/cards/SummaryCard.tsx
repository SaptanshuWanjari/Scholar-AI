import React from "react";
import { FileText, Globe, BookOpen } from "lucide-react";
import { cn } from "@/paper-ui/utils";
import { PaperCard, PaperPanel } from "@/paper-ui/core";
import { SectionLabel } from "@/paper-ui/core";
import { PaperBadge } from "../badges/PaperBadge";
import { MarkerHighlight } from "../decorations/MarkerHighlight";
import { ArrowDoodle } from "../doodles";
import type { IconTone } from "@/paper-ui/core";

const SOURCE_ICONS: Record<string, React.ReactNode> = {
  document: <FileText size={13} strokeWidth={1.5} />,
  web:      <Globe size={13} strokeWidth={1.5} />,
  notebook: <BookOpen size={13} strokeWidth={1.5} />,
};

export interface SummaryCardProps {
  title: string;
  summary: string;
  source?: string;
  sourceType?: "document" | "web" | "notebook";
  tags?: string[];
  tone?: IconTone;
  highlightTitle?: boolean;
  onExpand?: () => void;
  className?: string;
}

/**
 * Content summary card — highlighted title, body text excerpt, source chip,
 * and optional expand action.
 */
export function SummaryCard({
  title,
  summary,
  source,
  sourceType = "document",
  tags,
  highlightTitle = false,
  onExpand,
  className,
}: SummaryCardProps) {
  const titleEl = (
    <h3 className="font-caveat text-[23px] font-bold leading-tight text-ink">
      {title}
    </h3>
  );

  return (
    <PaperCard className={cn("px-5 pb-5 pt-5", className)}>
      <SectionLabel>Summary</SectionLabel>
      <div className="mt-1">
        {highlightTitle ? (
          <MarkerHighlight>{titleEl}</MarkerHighlight>
        ) : (
          titleEl
        )}
      </div>

      <p className="mt-3 font-kalam text-[14px] leading-relaxed text-ink-muted/85 line-clamp-4">
        {summary}
      </p>

      {tags && tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <PaperBadge key={tag} tone="ink">
              {tag}
            </PaperBadge>
          ))}
        </div>
      )}

      {(source || onExpand) && (
        <div className="mt-3 flex items-center justify-between">
          {source && (
            <PaperPanel className="inline-flex items-center gap-1.5 px-2.5 py-1">
              <span className="text-ink-muted/60">
                {SOURCE_ICONS[sourceType] ?? SOURCE_ICONS.document}
              </span>
              <span className="font-architect text-[12px] text-ink-muted/80 max-w-[180px] truncate">
                {source}
              </span>
            </PaperPanel>
          )}
          {onExpand && (
            <button
              onClick={onExpand}
              className="ml-auto inline-flex items-center gap-1 font-architect text-[13px] text-ink-muted transition-opacity hover:opacity-70"
            >
              Read more <ArrowDoodle size={14} />
            </button>
          )}
        </div>
      )}
    </PaperCard>
  );
}
