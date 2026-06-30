import React from "react";
import { cn } from "@/paper-ui/utils";
import { SketchBorder } from "@/paper-ui/core";

export interface CourseRowProps {
  /** Hex accent color for avatar tint + selection indicator. */
  color?: string;
  /** 1–2 chars shown in avatar circle. */
  initials?: string;
  title: string;
  /** Secondary line, e.g. "12 docs · 48 cards". */
  meta?: string;
  badge?: React.ReactNode;
  isSelected?: boolean;
  onClick?: () => void;
  /** Hover-revealed slot (rename / delete buttons, etc.). */
  actions?: React.ReactNode;
  className?: string;
}

export function CourseRow({
  color = "#7fa37b",
  initials = "?",
  title,
  meta,
  badge,
  isSelected,
  onClick,
  actions,
  className,
}: CourseRowProps) {
  return (
    <div
      className={cn(
        "group/course relative flex items-center gap-3 rounded-md px-3 py-3 transition-colors hover:bg-black/[0.025]",
        onClick && "cursor-pointer",
        className,
      )}
      onClick={onClick}
    >
      {/* Left selection accent */}
      {isSelected && (
        <div
          className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full"
          style={{ backgroundColor: color }}
        />
      )}

      {/* Color-tinted avatar */}
      <span
        className="relative inline-flex shrink-0 items-center justify-center"
        style={{ width: 36, height: 36, color }}
      >
        <SketchBorder
          fill={color + "26"}
          stroke={color + "59"}
          strokeWidth={1.2}
          radius={18}
          roughness={0.8}
          bowing={0.8}
          bleed={4}
        />
        <span className="relative z-[1] font-kalam text-sm font-bold">
          {initials.slice(0, 2).toUpperCase()}
        </span>
      </span>

      {/* Text block */}
      <div className="min-w-0 flex-1 leading-tight">
        <div className="flex items-center gap-2">
          <p className="truncate font-kalam text-[15px] font-bold text-ink">{title}</p>
          {badge && <span className="shrink-0">{badge}</span>}
        </div>
        {meta && <p className="font-architect text-xs text-ink-muted">{meta}</p>}
      </div>

      {/* Hover actions */}
      {actions && (
        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover/course:opacity-100">
          {actions}
        </div>
      )}
    </div>
  );
}
