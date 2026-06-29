import React from "react";
import { cn } from "../../ui/utils";

export interface StickyAnchorProps {
  children: React.ReactNode;
  color?: string;
  side?: "left" | "right";
  className?: string;
}

export function StickyAnchor({
  children,
  color = "var(--color-sticky)",
  side = "right",
  className,
}: StickyAnchorProps) {
  return (
    <div className={cn("inline-flex items-center gap-0", className)}>
      {side === "right" && (
        <svg width={24} height={2} className="shrink-0" aria-hidden>
          <line
            x1={0}
            y1={1}
            x2={24}
            y2={1}
            stroke="#b4ad9e"
            strokeWidth={1.5}
            strokeDasharray="3 3"
          />
        </svg>
      )}
      <div
        className="paper-texture relative shrink-0 px-2 py-1.5"
        style={{
          backgroundColor: color,
          boxShadow: "1px 2px 0 rgba(0,0,0,0.12)",
          borderRadius: "2px 2px 3px 3px",
          maxWidth: 180,
        }}
      >
        <div
          className="absolute bottom-0 right-0 h-3 w-3"
          style={{
            background:
              "linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.07) 50%, rgba(0,0,0,0.02) 70%)",
            borderBottomRightRadius: "3px",
          }}
        />
        <div className="relative z-[1] font-kalam text-[12px] text-ink leading-snug">{children}</div>
      </div>
      {side === "left" && (
        <svg width={24} height={2} className="shrink-0" aria-hidden>
          <line
            x1={0}
            y1={1}
            x2={24}
            y2={1}
            stroke="#b4ad9e"
            strokeWidth={1.5}
            strokeDasharray="3 3"
          />
        </svg>
      )}
    </div>
  );
}
