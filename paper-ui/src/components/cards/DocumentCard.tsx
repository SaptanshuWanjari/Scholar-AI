import React from "react";
import { FileText, ExternalLink, Trash2 } from "lucide-react";
import { cn } from "@paper-ui/utils";
import { PaperCard } from "@paper-ui/core";
import { SectionLabel } from "@paper-ui/core";
import { PaperBadge } from "../badges/PaperBadge";
import type { IconTone } from "@paper-ui/core";

const TYPE_TONES: Record<string, IconTone> = {
  pdf: "brick",
  md: "sage",
  txt: "ink",
  text: "ink",
};

const TYPE_LABELS: Record<string, string> = {
  pdf: "PDF",
  md: "Markdown",
  txt: "Text",
  text: "Text",
};

export interface DocumentCardProps {
  title: string;
  course?: string;
  type?: "pdf" | "md" | "txt" | "text";
  pageCount?: number;
  fileSize?: string;
  dateAdded?: string;
  chunkCount?: number;
  tags?: string[];
  onOpen?: () => void;
  onDelete?: () => void;
  className?: string;
}

/** Document/source file card with folded corner and file metadata. */
export function DocumentCard({
  title,
  course,
  type = "pdf",
  pageCount,
  fileSize,
  dateAdded,
  chunkCount,
  tags,
  onOpen,
  onDelete,
  className,
}: DocumentCardProps) {
  const tone = TYPE_TONES[type] ?? "ink";
  const typeLabel = TYPE_LABELS[type] ?? type.toUpperCase();

  return (
    <PaperCard
      lift
      className={cn("overflow-visible px-5 pb-6 pt-5", className)}
    >

      <div className="mb-3 flex items-start gap-3">
        <span className="mt-0.5 shrink-0 text-ink-muted/60">
          <FileText size={22} strokeWidth={1.5} />
        </span>
        <div className="min-w-0 flex-1">
          {course && <SectionLabel>{course}</SectionLabel>}
          <h3 className="mt-0.5 line-clamp-2 font-caveat text-[22px] font-bold leading-snug text-ink">
            {title}
          </h3>
        </div>
      </div>

      {/* Type + metadata chips */}
      <div className="flex flex-wrap items-center gap-1.5">
        <PaperBadge tone={tone}>{typeLabel}</PaperBadge>
        {pageCount !== undefined && (
          <PaperBadge tone="ink">{pageCount} pages</PaperBadge>
        )}
        {chunkCount !== undefined && (
          <PaperBadge tone="ink">{chunkCount} chunks</PaperBadge>
        )}
        {fileSize && <PaperBadge tone="ink">{fileSize}</PaperBadge>}
      </div>

      {tags && tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <PaperBadge key={tag} tone="ink">
              {tag}
            </PaperBadge>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        {dateAdded && (
          <span className="font-kalam text-[12px] text-ink-muted/70">Added {dateAdded}</span>
        )}
        <div className="ml-auto flex items-center gap-2">
          {onDelete && (
            <button
              onClick={onDelete}
              aria-label="Delete document"
              className="text-ink-muted/50 transition-colors hover:text-danger"
            >
              <Trash2 size={15} strokeWidth={1.5} />
            </button>
          )}
          {onOpen && (
            <button
              onClick={onOpen}
              aria-label="Open document"
              className="text-ink-muted/60 transition-colors hover:text-ink"
            >
              <ExternalLink size={15} strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>
    </PaperCard>
  );
}
