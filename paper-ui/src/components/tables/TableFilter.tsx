import React, { useState, useRef, useEffect } from "react";
import { Filter } from "lucide-react";
import { cn } from "@paper-ui/utils";
import { SketchBorder } from "@paper-ui/core";

export interface TableFilterProps {
  label: string;
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}

export function TableFilter({
  label,
  children,
  active = false,
  className,
}: TableFilterProps) {
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

  return (
    <div ref={ref} className={cn("relative inline-block", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "inline-flex items-center gap-1.5 px-2 py-1 rounded font-architect text-[13px] transition-colors",
          "border border-[#e8e3d8] bg-paper hover:bg-paper-surface/40",
          active && "text-[#3a3733] border-[#3a3733]/40 bg-paper-surface/50",
          !active && "text-ink-muted",
        )}
      >
        <Filter
          size={13}
          className={cn(
            active ? "text-[#3a3733]" : "text-ink-muted",
          )}
          {...(active ? { fill: "#3a3733", fillOpacity: 0.15 } : {})}
        />
        <span>{label}</span>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 z-50 min-w-[180px]">
          <SketchBorder
            fill="#fffdf9"
            stroke="#3a3733"
            strokeWidth={1.5}
            radius={6}
            shadow={3}
            roughness={1.1}
            bleed={6}
          />
          <div className="relative z-[1] p-3">{children}</div>
        </div>
      )}
    </div>
  );
}
