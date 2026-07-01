// @ts-nocheck
"use client";

import { Plus, FileText, ChevronRight } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "../ui/utils";
import { useNotebookV2Store } from "../../stores/useNotebookV2Store";
import type { V2Block } from "../../lib/notebook-v2.types";

/**
 * Extract heading blocks from a block list.
 */
function extractHeadings(blocks: V2Block[]) {
  return blocks
    .filter((b): b is V2Block<"heading"> => b.type === "heading")
    .map((b) => ({
      blockId: b.id,
      level: b.content.level,
      text: b.content.text,
    }));
}

/**
 * OutlineSidebar — auto-generated Table of Contents.
 * Lists pages with their heading blocks indented by level.
 */
export function OutlineSidebar() {
  const notebook = useNotebookV2Store((s) => s.notebook);
  const activePageId = useNotebookV2Store((s) => s.activePageId);
  const setActivePage = useNotebookV2Store((s) => s.setActivePage);
  const addPage = useNotebookV2Store((s) => s.addPage);

  if (!notebook) return null;

  return (
    <div className="flex h-full flex-col border-r border-tape/30 bg-paper/50">
      {/* Header */}
      <div className="border-b border-tape/20 px-4 py-3">
        <h2 className="font-caveat text-lg font-semibold text-ink/70">
          Outline
        </h2>
      </div>

      {/* Scrollable page list */}
      <ScrollArea className="flex-1">
        <nav className="space-y-0.5 p-2">
          {notebook.pages.map((page) => {
            const isActive = page.id === activePageId;
            const headings = extractHeadings(page.blocks);

            return (
              <div key={page.id}>
                {/* Page title */}
                <button
                  onClick={() => setActivePage(page.id)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                    isActive
                      ? "bg-lavender/30 font-medium text-ink"
                      : "text-ink/60 hover:bg-lavender/10 hover:text-ink",
                  )}
                >
                  <FileText className="size-3.5 shrink-0" />
                  <span className="truncate">{page.title}</span>
                </button>

                {/* Headings under this page */}
                {headings.length > 0 && (
                  <div className="ml-3 border-l border-tape/20 pl-2">
                    {headings.map((h) => (
                      <button
                        key={h.blockId}
                        onClick={() => setActivePage(page.id)}
                        className={cn(
                          "flex w-full items-center gap-1.5 rounded-sm px-1.5 py-1 text-left text-xs text-ink/50",
                          "hover:text-ink/80 transition-colors",
                          h.level === 1 && "font-medium",
                          h.level === 2 && "ml-2",
                          h.level === 3 && "ml-4",
                        )}
                      >
                        <ChevronRight className="size-2.5 shrink-0 opacity-40" />
                        <span className="truncate">{h.text}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Add page */}
      <div className="border-t border-tape/20 p-2">
        <button
          onClick={() => addPage()}
          className={cn(
            "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm",
            "text-ink/50 transition-colors hover:bg-sage/20 hover:text-ink/70",
          )}
        >
          <Plus className="size-3.5" />
          New Page
        </button>
      </div>
    </div>
  );
}
