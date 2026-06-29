import { cn } from "../../ui/utils";
import { SketchBorder } from "../foundation/SketchBorder";

export interface SketchProgressProps {
  /** 0–100. */
  value: number;
  height?: number;
  /** Pencil-shading color. */
  color?: string;
  className?: string;
}

/**
 * A rough-outlined progress bar filled with a hand-shaded pencil texture.
 * The fill edge is intentionally a touch irregular.
 */
export function SketchProgress({ value, height = 16, color = "#7fa37b", className }: SketchProgressProps) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("relative w-full", className)} style={{ height }}>
      {/* fill */}
      <div
        className="absolute inset-y-[3px] left-[3px] overflow-hidden rounded-[5px]"
        style={{
          width: `calc(${pct}% - 6px)`,
          backgroundColor: color,
          // hand-drawn pencil hatching over the fill
          backgroundImage:
            "repeating-linear-gradient(48deg, rgba(0,0,0,0.10) 0 1px, transparent 1px 5px)," +
            "repeating-linear-gradient(-42deg, rgba(255,255,255,0.18) 0 1px, transparent 1px 6px)",
          // slightly uneven right edge
          clipPath: "polygon(0 0, 99% 2%, 100% 50%, 99% 98%, 0 100%)",
        }}
      />
      {/* rough outline on top */}
      <SketchBorder stroke="#3a3733" strokeWidth={1.6} radius={7} roughness={1.3} bleed={5} />
    </div>
  );
}
