import { cn } from "../../ui/utils";
import { SketchProgress } from "./SketchProgress";

export interface LearningProgressProps {
  /** 0–100 fed into SketchProgress bar. */
  value: number;
  /** Left count label, e.g. "12 concepts". */
  done?: string;
  /** Right total label, e.g. "20 concepts". */
  total?: string;
  /** Eyebrow heading above the bar. */
  label?: string;
  /** Secondary line under the heading. */
  sublabel?: string;
  /** Bar fill color forwarded to SketchProgress. */
  color?: string;
  className?: string;
}

export function LearningProgress({ value, done, total, label, sublabel, color, className }: LearningProgressProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="leading-tight">
          <p className="font-architect text-[13px] font-medium uppercase tracking-[0.14em] text-ink-muted">
            {label}
          </p>
          {sublabel && <p className="font-kalam text-xs text-ink-muted">{sublabel}</p>}
        </div>
      )}
      <SketchProgress value={value} color={color} />
      {(done || total) && (
        <div className="flex items-center justify-between">
          {done ? (
            <span className="font-architect text-[13px] text-ink">{done}</span>
          ) : (
            <span />
          )}
          {total && <span className="font-architect text-[13px] text-ink-muted">{total}</span>}
        </div>
      )}
    </div>
  );
}
