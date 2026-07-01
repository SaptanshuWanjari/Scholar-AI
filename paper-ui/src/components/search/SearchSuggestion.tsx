import React from "react";
import { cn } from "@paper-ui/utils";
import { SketchBorder } from "@paper-ui/core";
import { Search } from "lucide-react";
import { ShortcutKey } from "./SearchBar";

export interface SearchSuggestionItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  shortcut?: string;
}

export interface SearchSuggestionProps {
  suggestions: SearchSuggestionItem[];
  onSelect: (item: SearchSuggestionItem) => void;
  visible?: boolean;
  highlightIndex?: number;
  className?: string;
}

export function SearchSuggestion({
  suggestions,
  onSelect,
  visible = true,
  highlightIndex = -1,
  className,
}: SearchSuggestionProps) {
  if (!visible || suggestions.length === 0) return null;

  return (
    <div
      className={cn("relative overflow-hidden rounded-[8px] p-1", className)}
      role="listbox"
    >
      <SketchBorder
        fill="#fffdf9"
        stroke="#b4ad9e"
        strokeWidth={1.2}
        roughness={1.2}
        radius={8}
        shadow={0}
      />
      <div className="relative z-[1] flex flex-col">
        {suggestions.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            role="option"
            aria-selected={idx === highlightIndex}
            onClick={() => onSelect(item)}
            className={cn(
              "flex items-center gap-2.5 rounded-[4px] px-3 py-2 text-left transition-colors",
              idx === highlightIndex
                ? "bg-[#e8e4da]"
                : "hover:bg-[#f0ede4]",
            )}
          >
            <span className="shrink-0 text-ink-muted">
              {item.icon ?? <Search size={14} />}
            </span>
            <div className="min-w-0 flex-1">
              <div className="font-architect text-[13px] text-ink truncate">
                {item.label}
              </div>
              {item.description && (
                <div className="font-kalam text-[11px] text-ink-muted/70 truncate">
                  {item.description}
                </div>
              )}
            </div>
            {item.shortcut && (
              <ShortcutKey>
                <span className="text-[11px]">{item.shortcut}</span>
              </ShortcutKey>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
