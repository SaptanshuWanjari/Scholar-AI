import { cn } from "@/paper-ui/utils";
import { SketchBorder } from "@/paper-ui/core";

export interface HeatmapProps {
  data: Record<string, number>;
  maxValue?: number;
  cellSize?: number;
  gap?: number;
  color?: string;
  className?: string;
}

function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function Heatmap({
  data,
  maxValue,
  cellSize = 12,
  gap = 2,
  color = "#7fa37b",
  className,
}: HeatmapProps) {
  const resolvedMax =
    maxValue ?? Math.max(1, ...Object.values(data).filter((v) => typeof v === "number"));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startSunday = new Date(today);
  startSunday.setDate(today.getDate() - today.getDay() - 52 * 7);

  const cells: { key: string; col: number; row: number }[] = [];
  for (let col = 0; col < 52; col++) {
    for (let row = 0; row < 7; row++) {
      const d = new Date(startSunday);
      d.setDate(startSunday.getDate() + col * 7 + row);
      cells.push({ key: toDateKey(d), col, row });
    }
  }

  const gridW = 52 * cellSize + 51 * gap;
  const gridH = 7 * cellSize + 6 * gap;

  return (
    <div className={cn("relative inline-block", className)}>
      <SketchBorder stroke="#3a3733" strokeWidth={1.2} roughness={1.1} bleed={6} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(52, ${cellSize}px)`,
          gridTemplateRows: `repeat(7, ${cellSize}px)`,
          gap: `${gap}px`,
          width: gridW,
          height: gridH,
          position: "relative",
        }}
      >
        {cells.map(({ key, col, row }) => {
          const count = data[key] ?? 0;
          const opacity = count === 0 ? 0.08 : Math.min(1, count / resolvedMax);
          return (
            <div
              key={`${col}-${row}`}
              title={`${key}: ${count}`}
              style={{
                width: cellSize,
                height: cellSize,
                borderRadius: 2,
                backgroundColor: color,
                opacity,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
