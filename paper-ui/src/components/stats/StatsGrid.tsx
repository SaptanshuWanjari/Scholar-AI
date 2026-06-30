import { cn } from "@paper-ui/utils";
import type { IconTone } from "@paper-ui/core";
import { PaperPanel } from "@paper-ui/core";
import { StatNumber } from "./StatNumber";

export interface StatsGridItem {
  value: string | number;
  label: string;
  sublabel?: string;
  tone?: IconTone;
  trend?: "up" | "down" | "flat";
  trendLabel?: string;
}

export interface StatsGridProps {
  stats: StatsGridItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

const GRID_COLS: Record<2 | 3 | 4, string> = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
};

export function StatsGrid({ stats, columns = 3, className }: StatsGridProps) {
  return (
    <PaperPanel className={cn(className)}>
      <div className={cn("grid", GRID_COLS[columns])}>
        {stats.map((item, i) => {
          const isLastCol = (i + 1) % columns === 0;
          const isLastRow = i >= stats.length - (stats.length % columns || columns);
          return (
            <div
              key={i}
              className={cn(
                "p-4",
                !isLastCol && "border-r border-dashed border-[#cfc8b8]/90",
                !isLastRow && "border-b border-dashed border-[#cfc8b8]/90",
              )}
            >
              <StatNumber
                value={item.value}
                label={item.label}
                sublabel={item.sublabel}
                tone={item.tone}
                trend={item.trend}
                trendLabel={item.trendLabel}
              />
            </div>
          );
        })}
      </div>
    </PaperPanel>
  );
}
