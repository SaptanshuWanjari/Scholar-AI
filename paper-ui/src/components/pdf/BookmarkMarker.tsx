import React from "react";
import { cn } from "@paper-ui/utils";

export interface BookmarkMarkerProps {
  color?: string;
  label?: string;
  width?: number;
  height?: number;
  offset?: number;
  className?: string;
}

export function BookmarkMarker({
  color = "#c8e6c9",
  label,
  width = 24,
  height = 56,
  offset = 24,
  className,
}: BookmarkMarkerProps) {
  return (
    <div
      className={cn("paper-texture absolute top-0 z-10", className)}
      style={{
        left: offset,
        width,
        height,
        backgroundColor: color,
        clipPath: "polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)",
        boxShadow: "1px 2px 0 rgba(0,0,0,0.12)",
      }}
    >
      {label && (
        <span
          className="absolute inset-0 flex items-center justify-center font-architect text-[10px] text-ink"
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            paddingBottom: height * 0.2,
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
