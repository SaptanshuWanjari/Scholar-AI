import React from "react";
import { cn } from "@paper-ui/utils";
import { SketchBorder } from "@paper-ui/core";

export interface HighlightLabelProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
}

export function HighlightLabel({
  children,
  color = "#f6e27a",
  className,
}: HighlightLabelProps) {
  return (
    <span
      className={cn(
        "relative inline-flex items-center px-2.5",
        "font-architect text-[11px] text-ink",
        className,
      )}
      style={{ height: 20 }}
    >
      <SketchBorder
        fill={color}
        stroke="#262320"
        strokeWidth={1.2}
        radius={14}
        shadow={1}
        roughness={1.0}
        bleed={4}
      />
      <span className="relative z-[1]">{children}</span>
    </span>
  );
}
