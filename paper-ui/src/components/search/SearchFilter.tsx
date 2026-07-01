import React from "react";
import { X } from "lucide-react";
import { cn } from "@paper-ui/utils";
import { SketchBorder } from "@paper-ui/core";

export interface SearchFilterOption {
  id: string;
  label: string;
}

export interface SearchFilterProps {
  filters: SearchFilterOption[];
  activeFilters: string[];
  onToggle: (id: string) => void;
  onClear?: () => void;
  className?: string;
}

export function SearchFilter({
  filters,
  activeFilters,
  onToggle,
  onClear,
  className,
}: SearchFilterProps) {
  if (filters.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {filters.map((filter) => {
        const isActive = activeFilters.includes(filter.id);
        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => onToggle(filter.id)}
            className={cn(
              "relative inline-flex items-center gap-1 rounded-[10px] px-3 py-1",
              "font-architect text-[13px] transition-colors",
              isActive ? "text-[#2c2c2c]" : "text-ink-muted/70",
            )}
          >
            <SketchBorder
              fill={isActive ? "#f0ede4" : "#fffdf9"}
              stroke={isActive ? "#262320" : "#b4ad9e"}
              strokeWidth={isActive ? 1.6 : 1.2}
              roughness={1.3}
              shadow={0}
              radius={10}
            />
            <span className="relative z-[1]">{filter.label}</span>
            {isActive && (
              <span className="relative z-[1] ml-0.5">
                <X size={11} />
              </span>
            )}
          </button>
        );
      })}
      {activeFilters.length > 0 && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="font-kalam text-[12px] text-ink-muted/60 underline underline-offset-2 transition-colors hover:text-ink"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
