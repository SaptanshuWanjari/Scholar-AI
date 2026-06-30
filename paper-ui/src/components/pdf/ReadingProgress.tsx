import React from "react";
import { cn } from "@paper-ui/utils";

export interface ReadingProgressProps {
  value: number;
  orientation?: "vertical" | "horizontal";
  height?: number;
  width?: number;
  color?: string;
  label?: boolean;
  className?: string;
}

export function ReadingProgress({
  value,
  orientation = "horizontal",
  height = 6,
  width = 6,
  color = "#7fa37b",
  label = false,
  className,
}: ReadingProgressProps) {
  const pct = Math.max(0, Math.min(100, value));

  if (orientation === "vertical") {
    return (
      <div
        className={cn("relative flex flex-col items-center gap-1", className)}
        style={{ width: width + 4 }}
      >
        <div
          className="relative w-full overflow-hidden rounded-full"
          style={{
            flex: 1,
            minHeight: 80,
            backgroundColor: "rgba(180,173,158,0.25)",
          }}
        >
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: `${pct}%`,
              backgroundColor: color,
              backgroundImage:
                "repeating-linear-gradient(48deg, rgba(0,0,0,0.08) 0 1px, transparent 1px 4px)",
              borderRadius: "999px 999px 0 0",
              transition: "height 0.3s ease",
            }}
          />
        </div>
        {label && (
          <span className="font-architect text-[10px] text-ink-muted">{pct}%</span>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className="relative flex-1 overflow-hidden rounded-full"
        style={{
          height,
          backgroundColor: "rgba(180,173,158,0.25)",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            backgroundColor: color,
            backgroundImage:
              "repeating-linear-gradient(48deg, rgba(0,0,0,0.08) 0 1px, transparent 1px 4px)",
            borderRadius: "999px",
            transition: "width 0.3s ease",
          }}
        />
      </div>
      {label && (
        <span className="font-architect text-[10px] text-ink-muted shrink-0">{pct}%</span>
      )}
    </div>
  );
}
