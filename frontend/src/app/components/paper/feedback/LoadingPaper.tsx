import React from "react";
import { cn } from "../../ui/utils";

export interface LoadingPaperProps {
  variant?: "dots" | "lines" | "spinner";
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

const dotSizeMap: Record<"sm" | "md" | "lg", string> = {
  sm: "w-[6px] h-[6px]",
  md: "w-[8px] h-[8px]",
  lg: "w-[10px] h-[10px]",
};

const spinnerSizeMap: Record<"sm" | "md" | "lg", string> = {
  sm: "w-[20px] h-[20px]",
  md: "w-[28px] h-[28px]",
  lg: "w-[36px] h-[36px]",
};

const lineWidths = ["w-12", "w-16", "w-8", "w-14", "w-10"];

export function LoadingPaper({
  variant = "dots",
  size = "md",
  label,
  className,
}: LoadingPaperProps) {
  return (
    <div className={cn("flex flex-col items-center", className)}>
      {variant === "dots" && (
        <div className="flex items-center gap-1.5">
          {[0, 150, 300].map((delay, i) => (
            <div
              key={i}
              className={cn(
                "rounded-full bg-[#3a3733] animate-bounce",
                dotSizeMap[size]
              )}
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
      )}

      {variant === "lines" && (
        <div className="flex flex-col gap-2">
          {lineWidths.map((width, i) => (
            <div
              key={i}
              className={cn("h-1.5 rounded-full bg-[#d4cfc2] animate-pulse", width)}
            />
          ))}
        </div>
      )}

      {variant === "spinner" && (
        <div
          className={cn(
            "border-2 border-[#3a3733] rounded-full border-t-transparent animate-spin",
            spinnerSizeMap[size]
          )}
        />
      )}

      {label && (
        <span className="font-kalam text-[13px] text-ink-muted mt-2">{label}</span>
      )}
    </div>
  );
}
