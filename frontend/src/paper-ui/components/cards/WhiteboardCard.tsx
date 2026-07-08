import React from "react";
import { PencilRuler, Clock, Archive, Trash2, Undo, Sparkles } from "lucide-react";
import { cn } from "@/paper-ui/utils";
import { PaperCard } from "@/paper-ui/core";

export interface WhiteboardCardProps {
  title: string;
  course?: string | null;
  thumbnail?: string | null;
  source?: string;
  updated?: string;
  revisions?: number;
  status?: string;
  deletedAt?: string;
  onClick?: () => void;
  onArchive?: () => void;
  onRestore?: () => void;
  onMoveToBin?: () => void;
  onDeletePermanently?: () => void;
  className?: string;
}

const SOURCE_LABEL: Record<string, string> = {
  manual: "Manual",
  ai: "AI",
  imported: "Imported",
  selection: "From reading",
};

export function WhiteboardCard({
  title,
  course,
  thumbnail,
  source = "manual",
  updated,
  revisions = 0,
  status,
  deletedAt,
  onClick,
  onArchive,
  onRestore,
  onMoveToBin,
  onDeletePermanently,
  className,
}: WhiteboardCardProps) {
  const showActions = onArchive || onRestore || onMoveToBin || onDeletePermanently;

  const getAutoDeleteDays = () => {
    if (!deletedAt) return 0;
    const elapsedMs = Date.now() - new Date(deletedAt).getTime();
    const elapsedDays = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
    return Math.max(0, 10 - elapsedDays);
  };

  return (
    <PaperCard
      lift
      className={cn(
        "group relative flex flex-col overflow-hidden p-0",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {/* Thumbnail Aspect Video */}
      <div className="flex aspect-video items-center justify-center overflow-hidden border-b border-border bg-muted/30 rounded-t-lg">
        {thumbnail ? (
          <img src={thumbnail} alt="" className="h-full w-full object-contain" />
        ) : (
          <PencilRuler className="size-8 text-ink-muted/30" />
        )}
      </div>

      {/* Card Info */}
      <div className="flex flex-1 flex-col gap-1 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate font-caveat text-[22px] font-bold leading-snug text-ink">
            {title}
          </h3>
          
          {showActions && (
            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 shrink-0">
              {onArchive && (
                <button
                  title="Archive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onArchive();
                  }}
                  className="rounded-md p-1 text-ink-muted hover:bg-ink-muted/10 hover:text-ink"
                >
                  <Archive className="size-3.5" />
                </button>
              )}
              {onRestore && (
                <button
                  title="Restore"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRestore();
                  }}
                  className="rounded-md p-1 text-ink-muted hover:bg-ink-muted/10 hover:text-ink"
                >
                  <Undo className="size-3.5" />
                </button>
              )}
              {onMoveToBin && (
                <button
                  title="Move to Bin"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveToBin();
                  }}
                  className="rounded-md p-1 text-ink-muted hover:bg-danger/10 hover:text-danger"
                >
                  <Trash2 className="size-3.5" />
                </button>
              )}
              {onDeletePermanently && (
                <button
                  title="Delete Permanently"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeletePermanently();
                  }}
                  className="rounded-md p-1 text-ink-muted hover:bg-danger/10 hover:text-danger"
                >
                  <Trash2 className="size-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Course and Source Badge */}
        <div className="flex items-center gap-2 text-xs font-architect text-ink-muted/60">
          {course && <span className="truncate">{course}</span>}
          {source !== "manual" && (
            <span className="inline-flex items-center gap-1 rounded bg-violet/10 px-1.5 py-0.5 text-violet">
              {source === "ai" && <Sparkles className="size-2.5" />}
              {SOURCE_LABEL[source] ?? source}
            </span>
          )}
        </div>

        {/* Updated / Revisions details */}
        <div className="mt-auto flex items-center gap-1 pt-1.5 text-xs font-architect text-ink-muted/60">
          {updated && (
            <>
              <Clock className="size-3 text-ink-muted/50" />
              <span>{updated}</span>
            </>
          )}
          {revisions > 0 && (
            <span className="ml-auto font-kalam text-[14px] text-ink-muted/50">
              {revisions} rev
            </span>
          )}
        </div>

        {/* Binned delete notice */}
        {status === "binned" && deletedAt && (
          <div className="mt-1 font-kalam text-[11px] font-bold text-danger">
            Auto-deletes in {getAutoDeleteDays()} days
          </div>
        )}
      </div>
    </PaperCard>
  );
}
