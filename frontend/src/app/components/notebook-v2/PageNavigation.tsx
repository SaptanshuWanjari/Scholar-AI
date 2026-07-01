"use client";

import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../ui/utils";
import { useNotebookV2Store } from "../../stores/useNotebookV2Store";

/**
 * PageNavigation — bottom navigation bar.
 * "← Previous" | "Page X of Y" | "Next →"
 */
export function PageNavigation() {
  const notebook = useNotebookV2Store((s) => s.notebook);
  const activePageId = useNotebookV2Store((s) => s.activePageId);
  const setActivePage = useNotebookV2Store((s) => s.setActivePage);
  const addPage = useNotebookV2Store((s) => s.addPage);

  if (!notebook || !activePageId) return null;

  const pages = notebook.pages;
  const currentIndex = pages.findIndex((p) => p.id === activePageId);
  const currentPage = pages[currentIndex];
  const isFirst = currentIndex <= 0;
  const isLast = currentIndex >= pages.length - 1;

  function goPrev() {
    if (!isFirst) setActivePage(pages[currentIndex - 1].id);
  }
  function goNext() {
    if (!isLast) setActivePage(pages[currentIndex + 1].id);
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-lg border border-tape/20",
        "bg-paper/80 px-4 py-2 backdrop-blur",
      )}
    >
      {/* Previous */}
      <Button
        variant="ghost"
        size="sm"
        disabled={isFirst}
        onClick={goPrev}
        className="gap-1 text-ink/60"
      >
        <ChevronLeft className="size-4" />
        Previous
      </Button>

      {/* Center — page info */}
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-xs text-ink/40">
          Page {currentIndex + 1} of {pages.length}
        </span>
        {currentPage && (
          <span className="font-caveat text-sm text-ink/70">
            {currentPage.title}
          </span>
        )}
      </div>

      {/* Right — Next + Add */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          disabled={isLast}
          onClick={goNext}
          className="gap-1 text-ink/60"
        >
          Next
          <ChevronRight className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => addPage()}
          className="size-7 text-ink/40 hover:text-ink/70"
          title="Add page"
        >
          <Plus className="size-4" />
        </Button>
      </div>
    </div>
  );
}
