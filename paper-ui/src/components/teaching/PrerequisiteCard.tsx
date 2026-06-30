import React from "react";
import { cn } from "@paper-ui/utils";
import { PaperPanel } from "@paper-ui/core";
import { CheckmarkDoodle } from "../doodles";
import type { MasteryLevel } from "./ConceptNode";

export interface PrerequisiteItem {
  title: string;
  mastery?: MasteryLevel;
  done?: boolean;
}

export interface PrerequisiteCardProps {
  items: PrerequisiteItem[];
  title?: string;
  className?: string;
}

const MASTERY_BG: Record<Exclude<MasteryLevel, "unknown">, string> = {
  mastered: "bg-[#3f7a4e]",
  learning: "bg-[#b07a2e]",
  weak: "bg-[#a3544a]",
};

function ItemDot({ mastery, done }: { mastery?: MasteryLevel; done?: boolean }) {
  if (done) {
    return (
      <span
        className="shrink-0 rounded-full bg-[#3f7a4e]"
        style={{ width: 8, height: 8 }}
      />
    );
  }
  const bgClass =
    mastery && mastery !== "unknown" ? MASTERY_BG[mastery] : "bg-muted";
  return (
    <span
      className={cn("shrink-0 rounded-full", bgClass)}
      style={{ width: 8, height: 8 }}
    />
  );
}

export function PrerequisiteCard({
  items,
  title = "Prerequisites",
  className,
}: PrerequisiteCardProps) {
  return (
    <PaperPanel className={cn("px-4 py-3", className)}>
      <p className="font-architect text-[11px] uppercase tracking-wider text-ink-muted mb-2">
        {title}
      </p>

      {items.length === 0 ? (
        <p className="font-kalam text-sm text-ink-muted/60 py-2">No prerequisites</p>
      ) : (
        <ul>
          {items.map((item, i) => (
            <li
              key={i}
              className="flex items-center gap-2 py-1.5 border-b border-dashed border-border/40 last:border-0"
            >
              <ItemDot mastery={item.mastery} done={item.done} />
              <span
                className={cn(
                  "font-kalam text-sm flex-1",
                  item.done && "line-through text-ink-muted/60",
                )}
              >
                {item.title}
              </span>
              {item.done && (
                <CheckmarkDoodle size={14} color="#3f7a4e" />
              )}
            </li>
          ))}
        </ul>
      )}
    </PaperPanel>
  );
}
