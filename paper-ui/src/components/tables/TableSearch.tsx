import React, { useRef } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@paper-ui/utils";

export interface TableSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function TableSearch({
  value,
  onChange,
  placeholder = "Filter...",
  className,
}: TableSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={cn("relative flex items-center", className)}>
      <Search
        size={14}
        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-muted/60 pointer-events-none"
      />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "h-8 pl-8 pr-8 rounded border border-[#e8e3d8] bg-paper font-architect text-[13px] text-ink",
          "placeholder:font-architect placeholder:text-ink-muted/50",
          "focus:outline-none focus:border-[#3a3733] focus:ring-1 focus:ring-[#3a3733]/10",
          "w-48",
        )}
      />
      {value && (
        <button
          onClick={() => {
            onChange("");
            inputRef.current?.focus();
          }}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 text-ink-muted/60 hover:text-ink transition-colors"
          aria-label="Clear search"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
}
