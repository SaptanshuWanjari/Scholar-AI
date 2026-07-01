import React from "react";
import { Clock, X, Trash2 } from "lucide-react";
import { cn } from "@paper-ui/utils";
import { SketchBorder } from "@paper-ui/core";

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp?: string;
}

export interface SearchHistoryProps {
  items: SearchHistoryItem[];
  onSelect: (item: SearchHistoryItem) => void;
  onRemove: (id: string) => void;
  onClear?: () => void;
  maxItems?: number;
  className?: string;
}

export function SearchHistory({
  items,
  onSelect,
  onRemove,
  onClear,
  maxItems,
  className,
}: SearchHistoryProps) {
  const visibleItems = maxItems ? items.slice(0, maxItems) : items;

  if (items.length === 0) return null;

  return (
    <div className={cn("relative overflow-hidden rounded-[8px]", className)}>
      <SketchBorder
        fill="#fffdf9"
        stroke="#b4ad9e"
        strokeWidth={1.2}
        roughness={1.2}
        radius={8}
        shadow={0}
      />
      <div className="relative z-[1]">
        <div className="flex items-center gap-2 border-b border-[#d4cec4]/50 px-3 py-2">
          <Clock size={13} className="text-ink-muted" />
          <span className="font-architect text-[11px] uppercase tracking-wider text-ink-muted">
            Recent searches
          </span>
        </div>
        {visibleItems.length > 0 && (
          <ul className="flex flex-col">
            {visibleItems.map((item) => (
              <li
                key={item.id}
                className="group flex items-center"
              >
                <button
                  type="button"
                  onClick={() => onSelect(item)}
                  className="flex flex-1 items-center gap-2.5 px-3 py-2 text-left hover:bg-[#f0ede4]"
                >
                  <Clock size={12} className="shrink-0 text-ink-muted/60" />
                  <span className="min-w-0 flex-1 truncate font-architect text-[13px] text-ink">
                    {item.query}
                  </span>
                  {item.timestamp && (
                    <span className="shrink-0 font-kalam text-[10px] text-ink-muted/60">
                      {item.timestamp}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(item.id);
                  }}
                  className="shrink-0 px-2 py-2 text-ink-muted/40 opacity-0 transition-opacity hover:text-ink group-hover:opacity-100"
                  aria-label={`Remove "${item.query}"`}
                >
                  <X size={12} />
                </button>
              </li>
            ))}
          </ul>
        )}
        {onClear && items.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="flex w-full items-center gap-1.5 border-t border-[#d4cec4]/50 px-3 py-2 font-kalam text-[11px] text-ink-muted/60 transition-colors hover:text-ink hover:bg-[#f0ede4]"
          >
            <Trash2 size={11} />
            Clear history
          </button>
        )}
      </div>
    </div>
  );
}
