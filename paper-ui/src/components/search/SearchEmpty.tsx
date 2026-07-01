import React from "react";
import { cn } from "@paper-ui/utils";
import { SketchBorder } from "@paper-ui/core";
import { PaperPanel } from "@paper-ui/core";
import { Search, HelpCircle } from "lucide-react";

export interface SearchEmptyProps {
  title?: string;
  description?: string;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
  className?: string;
}

function DoodleMagnifyingGlass() {
  return (
    <div className="relative" style={{ width: 72, height: 72 }}>
      <SketchBorder
        fill="#f0ede4"
        stroke="#b4ad9e"
        strokeWidth={1.3}
        radius={40}
        shadow={0}
      />
      <div className="relative z-[1] flex h-full w-full items-center justify-center">
        <div className="relative">
          <Search size={32} strokeWidth={1.5} className="text-ink-muted -rotate-12" />
          <HelpCircle
            size={13}
            strokeWidth={2}
            className="absolute -right-1 -top-1 text-ink-muted/50"
          />
        </div>
      </div>
    </div>
  );
}

export function SearchEmpty({
  title = "No results found",
  description = "Try adjusting your search terms or filters.",
  suggestions,
  onSuggestionClick,
  className,
}: SearchEmptyProps) {
  return (
    <PaperPanel className={cn(className)}>
      <div className="flex flex-col items-center py-12 px-6 text-center">
        <DoodleMagnifyingGlass />

        <h3 className="mt-5 font-architect text-[17px] text-ink">
          {title}
        </h3>

        {description && (
          <p className="font-kalam text-[14px] text-ink-muted mt-2 max-w-[300px]">
            {description}
          </p>
        )}

        {suggestions && suggestions.length > 0 && (
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => onSuggestionClick?.(suggestion)}
                className="relative inline-flex items-center rounded-[8px] px-3 py-1 font-kalam text-[12px] text-ink-muted transition-colors hover:text-ink"
              >
                <SketchBorder
                  fill="#fffdf9"
                  stroke="#c5bfb3"
                  strokeWidth={1}
                  roughness={1.2}
                  radius={8}
                  shadow={0}
                />
                <span className="relative z-[1]">{suggestion}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </PaperPanel>
  );
}
