import React from "react";
import { cn } from "../../ui/utils";
import { CheckmarkDoodle } from "../doodles";

export interface StepProgressProps {
  steps: string[];
  /** 0-based index of the active step. All steps before it are done. */
  current: number;
  className?: string;
}

export function StepProgress({ steps, current, className }: StepProgressProps) {
  return (
    <div className={cn("flex w-full items-start", className)}>
      {steps.map((step, i) => {
        const isDone = i < current;
        const isActive = i === current;
        return (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center" style={{ minWidth: 56 }}>
              <span
                className="flex items-center justify-center rounded-full border"
                style={{
                  width: 26,
                  height: 26,
                  backgroundColor: isDone ? "#3f7a4e" : isActive ? "#3a3733" : "transparent",
                  borderColor: isDone ? "#3f7a4e" : isActive ? "#3a3733" : "#cfc8b8",
                  color: isDone || isActive ? "#fff" : "#9b9590",
                }}
              >
                {isDone ? (
                  <CheckmarkDoodle size={14} color="#fff" />
                ) : (
                  <span className="font-architect text-xs">{i + 1}</span>
                )}
              </span>
              <p
                className={cn(
                  "mt-1.5 max-w-[72px] text-center font-architect text-[11px] leading-tight",
                  isDone && "text-ink-muted",
                  isActive && "text-ink",
                  !isDone && !isActive && "text-ink-muted/60",
                )}
              >
                {step}
              </p>
            </div>

            {i < steps.length - 1 && (
              <div
                className={cn(
                  "mt-[13px] flex-1",
                  i < current ? "border-t border-[#3f7a4e]" : "border-t border-dashed border-[#cfc8b8]",
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
