import React from "react";
import { Brain, BookOpen, FileText, Map, ListChecks, ExternalLink } from "lucide-react";
import { cn } from "../../ui/utils";
import { PaperCard } from "../foundation/Paper";
import { SectionLabel } from "../foundation/SectionHeader";
import { PaperBadge } from "../badges/PaperBadge";
import { FoldedCorner } from "../decorations/FoldedCorner";
import type { IconTone } from "../foundation/PaperIconCircle";

type ArtifactType = "quiz" | "flashcard" | "notes" | "summary" | "mindmap";

const TYPE_META: Record<
  ArtifactType,
  { label: string; tone: IconTone; Icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }
> = {
  quiz:      { label: "Quiz",          tone: "brick",    Icon: ListChecks },
  flashcard: { label: "Flashcard Set", tone: "sky",      Icon: BookOpen },
  notes:     { label: "Notes",         tone: "ochre",    Icon: FileText },
  summary:   { label: "Summary",       tone: "lavender", Icon: FileText },
  mindmap:   { label: "Mind Map",      tone: "sage",     Icon: Map },
};

export interface ArtifactCardProps {
  title: string;
  type: ArtifactType;
  course?: string;
  count?: number;
  countUnit?: string;
  createdAt?: string;
  onOpen?: () => void;
  className?: string;
}

/**
 * AI-generated artifact card (quiz, flashcard set, notes, summary, mind map).
 * Folded corner echoes the "generated document" metaphor.
 */
export function ArtifactCard({
  title,
  type,
  course,
  count,
  countUnit,
  createdAt,
  onOpen,
  className,
}: ArtifactCardProps) {
  const meta = TYPE_META[type];
  const Icon = meta.Icon;

  return (
    <PaperCard
      lift
      className={cn(
        "overflow-visible px-5 pb-5 pt-5",
        onOpen && "cursor-pointer",
        className,
      )}
      onClick={onOpen}
    >
      <FoldedCorner size={28} />

      <div className="mb-3 flex items-start justify-between gap-2">
        <PaperBadge tone={meta.tone}>
          <Icon size={11} strokeWidth={1.6} />
          {meta.label}
        </PaperBadge>
        {onOpen && (
          <ExternalLink
            size={14}
            strokeWidth={1.4}
            className="shrink-0 text-ink-muted/40 transition-colors hover:text-ink-muted"
            onClick={(e) => { e.stopPropagation(); onOpen(); }}
          />
        )}
      </div>

      <h3 className="font-caveat text-[22px] font-bold leading-snug text-ink line-clamp-2">
        {title}
      </h3>

      <div className="mt-3 flex items-center gap-3">
        {count !== undefined && (
          <span className="font-kalam text-[13px] text-ink-muted/80">
            {count} {countUnit ?? "items"}
          </span>
        )}
        {course && (
          <>
            {count !== undefined && (
              <span className="text-ink-muted/40 font-kalam text-[13px]">·</span>
            )}
            <span className="font-architect text-[11px] uppercase tracking-wide text-ink-muted/60">
              {course}
            </span>
          </>
        )}
      </div>

      {createdAt && (
        <p className="mt-1.5 font-kalam text-[11px] text-ink-muted/50">{createdAt}</p>
      )}
    </PaperCard>
  );
}
