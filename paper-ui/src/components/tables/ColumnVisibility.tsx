import React, { useState, useRef, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@paper-ui/utils";
import { SketchBorder } from "@paper-ui/core";

export interface ColumnVisibilityProps {
  columns: string[];
  visible: Set<string> | Record<string, boolean>;
  onChange: (col: string) => void;
  className?: string;
}

function isVisible(
  visible: Set<string> | Record<string, boolean>,
  col: string,
): boolean {
  if (visible instanceof Set) return visible.has(col);
  return visible[col] !== false;
}

export function ColumnVisibility({
  columns,
  visible,
  onChange,
  className,
}: ColumnVisibilityProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const hiddenCount = columns.filter((c) => !isVisible(visible, c)).length;

  return (
    <div ref={ref} className={cn("relative inline-block", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "inline-flex items-center gap-1.5 h-8 px-3 rounded font-architect text-[13px] transition-colors",
          "border border-[#e8e3d8] bg-paper hover:bg-paper-surface/40",
          hiddenCount > 0 ? "text-[#3a3733]" : "text-ink-muted",
        )}
      >
        {hiddenCount > 0 ? (
          <EyeOff size={13} className="text-[#3a3733]" />
        ) : (
          <Eye size={13} className="text-ink-muted" />
        )}
        <span>Columns{hiddenCount > 0 ? ` (${hiddenCount})` : ""}</span>
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-1.5 z-50 min-w-[160px]">
          <SketchBorder
            fill="#fffdf9"
            stroke="#3a3733"
            strokeWidth={1.5}
            radius={6}
            shadow={3}
            roughness={1.1}
            bleed={6}
          />
          <div className="relative z-[1] p-2">
            {columns.map((col) => {
              const checked = isVisible(visible, col);
              return (
                <label
                  key={col}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors hover:bg-black/[0.03]",
                    "font-architect text-[13px] text-ink select-none",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onChange(col)}
                    className="sr-only"
                  />
                  {checked ? (
                    <Eye size={14} className="text-[#3a3733] shrink-0" />
                  ) : (
                    <EyeOff size={14} className="text-ink-muted shrink-0" />
                  )}
                  <span className={checked ? "" : "text-ink-muted/60"}>
                    {col}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
