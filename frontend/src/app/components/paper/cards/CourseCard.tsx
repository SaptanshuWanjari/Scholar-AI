import React from "react";
import { BookOpen } from "lucide-react";
import { cn } from "../../ui/utils";
import { PaperCard } from "../foundation/Paper";
import { SectionLabel } from "../foundation/SectionHeader";
import { PaperIconCircle, type IconTone } from "../foundation/PaperIconCircle";
import { SketchProgress } from "../progress/SketchProgress";
import { PaperBadge } from "../badges/PaperBadge";
import { Tape } from "../decorations/Tape";
import { ArrowDoodle } from "../doodles";

export interface CourseCardProps {
  title: string;
  subject?: string;
  icon?: React.ReactNode;
  tone?: IconTone;
  progress?: number;
  documentCount?: number;
  lastStudied?: string;
  tags?: string[];
  onClick?: () => void;
  onContinue?: () => void;
  className?: string;
}

/** Medium course tile — icon, progress bar, tags and a continue link. */
export function CourseCard({
  title,
  subject = "Course",
  icon,
  tone = "sage",
  progress,
  documentCount,
  lastStudied,
  tags,
  onClick,
  onContinue,
  className,
}: CourseCardProps) {
  return (
    <PaperCard
      lift
      className={cn("overflow-visible px-5 pb-5 pt-6", onClick && "cursor-pointer", className)}
      onClick={onClick}
    >
      <Tape corner="top-left" width={30} rotate={-18} className="-top-1.5 left-2" />

      <div className="flex items-start gap-3">
        <PaperIconCircle tone={tone} size={44}>
          {icon ?? <BookOpen size={20} strokeWidth={1.6} />}
        </PaperIconCircle>
        <div className="min-w-0 flex-1">
          <SectionLabel>{subject}</SectionLabel>
          <h3 className="mt-0.5 truncate font-caveat text-[26px] font-bold leading-tight text-ink">
            {title}
          </h3>
        </div>
      </div>

      {progress !== undefined && (
        <div className="mt-4">
          <SketchProgress value={progress} />
          <div className="mt-1.5 flex items-center justify-between">
            <span className="font-kalam text-[12px] text-ink-muted">{progress}% complete</span>
            {documentCount !== undefined && (
              <span className="font-kalam text-[12px] text-ink-muted">
                {documentCount} doc{documentCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      )}

      {tags && tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <PaperBadge key={tag} tone="ink">
              {tag}
            </PaperBadge>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        {lastStudied && (
          <span className="font-kalam text-[12px] text-ink-muted/70">{lastStudied}</span>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onContinue?.(); }}
          className="ml-auto inline-flex items-center gap-1.5 font-architect text-[13px] text-ink transition-opacity hover:opacity-70"
        >
          Continue <ArrowDoodle size={14} />
        </button>
      </div>
    </PaperCard>
  );
}
