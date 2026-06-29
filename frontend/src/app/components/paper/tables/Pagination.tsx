import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "../../ui/utils";
import { SketchBorder } from "../foundation/SketchBorder";

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showEdges?: boolean;
  className?: string;
}

function getPageNumbers(page: number, totalPages: number): (number | "…")[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (page <= 3) {
    return [1, 2, 3, 4, "…", totalPages];
  }

  if (page >= totalPages - 2) {
    return [1, "…", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "…", page - 1, page, page + 1, "…", totalPages];
}

interface PageButtonProps {
  pageNum: number;
  current: boolean;
  onClick: () => void;
}

function PageButton({ pageNum, current, onClick }: PageButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-current={current ? "page" : undefined}
      className={cn(
        "relative inline-flex h-8 w-8 items-center justify-center font-architect text-[13px]",
        "transition-transform duration-100",
        current ? "text-[#fbf8f2]" : "text-ink hover:-translate-y-px",
      )}
    >
      <SketchBorder
        fill={current ? "#262320" : "#fffdf9"}
        stroke="#3a3733"
        strokeWidth={1.3}
        radius={6}
        shadow={current ? 1 : 0}
        roughness={1.1}
        bleed={5}
      />
      <span className="relative z-[1]">{pageNum}</span>
    </button>
  );
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  showEdges = false,
  className,
}: PaginationProps) {
  const pages = getPageNumbers(page, totalPages);

  const navButtonClass = cn(
    "inline-flex h-8 w-8 items-center justify-center text-ink-muted",
    "transition-colors hover:text-ink disabled:pointer-events-none disabled:opacity-30",
  );

  return (
    <div className={cn("flex items-center gap-1", className)} role="navigation" aria-label="Pagination">
      {showEdges && (
        <button
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          aria-label="First page"
          className={navButtonClass}
        >
          <ChevronsLeft size={16} strokeWidth={1.6} />
        </button>
      )}

      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className={navButtonClass}
      >
        <ChevronLeft size={16} strokeWidth={1.6} />
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="inline-flex h-8 w-8 items-center justify-center font-architect text-[13px] text-ink-muted">
            …
          </span>
        ) : (
          <PageButton key={p} pageNum={p} current={p === page} onClick={() => onPageChange(p)} />
        ),
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
        className={navButtonClass}
      >
        <ChevronRight size={16} strokeWidth={1.6} />
      </button>

      {showEdges && (
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
          aria-label="Last page"
          className={navButtonClass}
        >
          <ChevronsRight size={16} strokeWidth={1.6} />
        </button>
      )}
    </div>
  );
}
