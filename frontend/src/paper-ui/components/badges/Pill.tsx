import React from "react";
import { X } from "lucide-react";
import { PaperBadge } from "./PaperBadge";
import type { IconTone } from "@/paper-ui/core";

export interface PillProps {
  children: React.ReactNode;
  tone?: IconTone;
  /** Renders a filled 6px circle. Overridden by `icon` if both are provided. */
  dot?: string;
  /** Left slot — takes precedence over `dot`. */
  icon?: React.ReactNode;
  /** Renders a × button on the right. */
  onRemove?: () => void;
  className?: string;
}

export function Pill({ children, tone = "ink", dot, icon, onRemove, className }: PillProps) {
  const leading = icon ?? (dot ? (
    <span
      aria-hidden
      style={{
        display: "inline-block",
        width: 6,
        height: 6,
        borderRadius: "50%",
        backgroundColor: dot,
        flexShrink: 0,
      }}
    />
  ) : null);

  return (
    <PaperBadge tone={tone} className={className}>
      {leading}
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          aria-label="Remove"
          className="-mr-0.5 ml-0.5 transition-opacity hover:opacity-60"
          style={{ color: "inherit", lineHeight: 1 }}
        >
          <X size={10} strokeWidth={2.5} />
        </button>
      )}
    </PaperBadge>
  );
}
