import { cn } from "../../ui/utils";
import { SketchProgress } from "./SketchProgress";
import { SketchBorder } from "../foundation/SketchBorder";

export interface StageProgressProps {
  title: string;
  /** 0–100. */
  value: number;
  /** e.g. "4 / 6 concepts". */
  sublabel?: string;
  /** Bar fill color forwarded to SketchProgress. */
  color?: string;
  className?: string;
}

export function StageProgress({ title, value, sublabel, color = "#7fa37b", className }: StageProgressProps) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="font-architect text-[14px] text-ink">{title}</p>
        {/* Rough-outlined percentage chip */}
        <span className="relative inline-flex items-center px-2 py-0.5">
          <SketchBorder stroke="#3a3733" strokeWidth={1.2} radius={6} roughness={0.9} bleed={3} />
          <span className="relative z-[1] font-caveat text-[16px] font-bold leading-none text-ink">
            {Math.round(pct)}%
          </span>
        </span>
      </div>
      <SketchProgress value={pct} color={color} height={10} />
      {sublabel && <p className="font-architect text-xs text-ink-muted">{sublabel}</p>}
    </div>
  );
}
