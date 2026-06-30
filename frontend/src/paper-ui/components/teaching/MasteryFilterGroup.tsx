import React from "react";
import { cn } from "@/paper-ui/utils";
import type { MasteryLevel } from "./ConceptNode";

export interface MasteryFilterItem {
  level: MasteryLevel | "all";
  label: string;
  count?: number;
  active: boolean;
}

export interface MasteryFilterGroupProps {
  items: MasteryFilterItem[];
  onChange?: (level: MasteryLevel | "all", active: boolean) => void;
  className?: string;
}

const LEVEL_COLOR: Record<MasteryLevel | "all", string> = {
  all:      "#9c9484",
  mastered: "#3f7a4e",
  learning: "#b07a2e",
  weak:     "#a3544a",
  unknown:  "#9c9484",
};

export function MasteryFilterGroup({ items, onChange, className }: MasteryFilterGroupProps) {
  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      {items.map((item) => (
        <button
          key={item.level}
          type="button"
          onClick={() => onChange?.(item.level, !item.active)}
          className={cn(
            "flex items-center gap-2 rounded px-2 py-1 text-left transition-colors",
            "hover:bg-ink/5",
            item.active ? "opacity-100" : "opacity-40",
          )}
        >
          <span
            className="shrink-0 rounded-full"
            style={{
              width: 10,
              height: 10,
              background: LEVEL_COLOR[item.level],
            }}
            aria-hidden
          />
          <span className="font-kalam text-[13px] text-ink flex-1">{item.label}</span>
          {item.count !== undefined && (
            <span className="font-kalam text-[11px] text-ink-muted">{item.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}
