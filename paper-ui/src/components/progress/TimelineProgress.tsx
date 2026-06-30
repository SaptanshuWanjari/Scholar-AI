import { cn } from "@paper-ui/utils";
import { SketchProgress } from "./SketchProgress";

export interface TimelineProgressStage {
  label: string;
  sublabel?: string;
  /** 0–100. Renders a mini SketchProgress bar when provided. */
  percent?: number;
  status?: "done" | "active" | "pending";
}

export interface TimelineProgressProps {
  stages: TimelineProgressStage[];
  className?: string;
}

const DOT_COLOR: Record<"done" | "active" | "pending", { bg: string; border: string }> = {
  done:    { bg: "#3f7a4e", border: "#3f7a4e" },
  active:  { bg: "#3a3733", border: "#3a3733" },
  pending: { bg: "transparent", border: "#9b9590" },
};

const BAR_COLOR: Record<"done" | "active" | "pending", string> = {
  done:    "#7fa37b",
  active:  "#7fa37b",
  pending: "#cfc8b8",
};

export function TimelineProgress({ stages, className }: TimelineProgressProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      {stages.map((stage, i) => {
        const status = stage.status ?? "pending";
        const dot = DOT_COLOR[status];
        const isLast = i === stages.length - 1;
        return (
          <div key={i} className="flex gap-3">
            {/* Dot + vertical connector */}
            <div className="flex flex-col items-center">
              <span
                className="mt-0.5 shrink-0 rounded-full border"
                style={{ width: 10, height: 10, backgroundColor: dot.bg, borderColor: dot.border }}
              />
              {!isLast && (
                <div className="mt-1 flex-1 border-l border-dashed border-[#cfc8b8]" style={{ minHeight: 24 }} />
              )}
            </div>

            {/* Stage content */}
            <div className={cn("min-w-0 flex-1 pb-4 leading-tight", isLast && "pb-0")}>
              <p
                className={cn(
                  "font-kalam text-[14px]",
                  status === "done" && "text-ink-muted line-through",
                  status === "active" && "font-bold text-ink",
                  status === "pending" && "text-ink-muted",
                )}
              >
                {stage.label}
              </p>
              {stage.sublabel && (
                <p className="font-architect text-xs text-ink-muted">{stage.sublabel}</p>
              )}
              {stage.percent !== undefined && (
                <div className="mt-1.5">
                  <SketchProgress value={stage.percent} height={8} color={BAR_COLOR[status]} />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
