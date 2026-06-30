import React from "react";
import { cn } from "@paper-ui/utils";

export interface PageMarkerProps {
  size?: number;
  color?: string;
  corner?: "top-right" | "bottom-right" | "top-left" | "bottom-left";
  active?: boolean;
  onToggle?: () => void;
  className?: string;
}

const CORNER_STYLES: Record<
  NonNullable<PageMarkerProps["corner"]>,
  { top?: 0; bottom?: 0; left?: 0; right?: 0; clipPath: string }
> = {
  "top-right": {
    top: 0,
    right: 0,
    clipPath: "polygon(100% 0, 0 0, 100% 100%)",
  },
  "bottom-right": {
    bottom: 0,
    right: 0,
    clipPath: "polygon(100% 0, 0 100%, 100% 100%)",
  },
  "top-left": {
    top: 0,
    left: 0,
    clipPath: "polygon(0 0, 100% 0, 0 100%)",
  },
  "bottom-left": {
    bottom: 0,
    left: 0,
    clipPath: "polygon(0 0, 100% 100%, 0 100%)",
  },
};

export function PageMarker({
  size = 32,
  color = "#f6e27a",
  corner = "top-right",
  active = false,
  onToggle,
  className,
}: PageMarkerProps) {
  const pos = CORNER_STYLES[corner];
  return (
    <div
      role="button"
      aria-pressed={active}
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onToggle?.()}
      className={cn(
        "absolute cursor-pointer transition-opacity duration-150",
        !active && "opacity-30 hover:opacity-60",
        className,
      )}
      style={{
        width: size,
        height: size,
        top: pos.top,
        bottom: pos.bottom,
        left: pos.left,
        right: pos.right,
        backgroundColor: active ? color : "#b4ad9e",
        clipPath: pos.clipPath,
      }}
    />
  );
}
