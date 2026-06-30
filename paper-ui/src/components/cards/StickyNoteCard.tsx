import React from "react";
import { cn } from "@paper-ui/utils";
import { PushPin } from "../decorations/PushPin";
import { Tape } from "../decorations/Tape";
import { PaperBadge } from "../badges/PaperBadge";

// Pastel sticky-note palette
const COLORS = {
  yellow: "#fef3a3",
  pink:   "#fce4e4",
  blue:   "#ddeeff",
  green:  "#dcf0d8",
  orange: "#fde9c9",
  purple: "#ede5f7",
} as const;

type StickyColor = keyof typeof COLORS;
type PinStyle = "push-pin" | "tape" | "none";

export interface StickyNoteCardProps {
  children: React.ReactNode;
  title?: string;
  color?: StickyColor;
  rotate?: number;
  pin?: PinStyle;
  tags?: string[];
  footer?: React.ReactNode;
  className?: string;
}

/**
 * Full-size sticky note card — solid pastel fill, hard-offset shadow, paper
 * texture. Larger than the `StickyNote` decoration; meant to hold real content.
 */
export function StickyNoteCard({
  children,
  title,
  color = "yellow",
  rotate = 0,
  pin = "push-pin",
  tags,
  footer,
  className,
}: StickyNoteCardProps) {
  const bg = COLORS[color];

  return (
    <div
      className={cn("relative", className)}
      style={{
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
      }}
    >
      {pin === "push-pin" && (
        <div className="absolute -top-4 left-1/2 z-30 -translate-x-1/2">
          <PushPin size={24} />
        </div>
      )}
      {pin === "tape" && (
        <Tape corner="top-center" width={56} rotate={-3} className="-top-3 left-1/2 -translate-x-1/2" />
      )}

      {/* Card body — CSS shadow, no rough border (intentional sticky-note look) */}
      <div
        className="paper-texture relative overflow-hidden rounded-sm px-5 pb-5 pt-6"
        style={{
          backgroundColor: bg,
          boxShadow: "3px 4px 0 rgba(0,0,0,0.13), 5px 7px 0 rgba(0,0,0,0.06)",
        }}
      >
        {/* Top colored stripe (like a sticky-note adhesive band) */}
        <div
          className="pointer-events-none absolute left-0 right-0 top-0 h-2"
          style={{ backgroundColor: `color-mix(in srgb, ${bg} 60%, #b8a090 40%)` }}
          aria-hidden
        />
        {/* Paper-curl bottom-right */}
        <div
          className="pointer-events-none absolute bottom-0 right-0 h-5 w-5"
          style={{
            background:
              "linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.07) 50%, rgba(0,0,0,0.02) 70%)",
            borderBottomRightRadius: "2px",
          }}
          aria-hidden
        />

        <div className="relative z-[1]">
          {title && (
            <h4 className="mb-2 font-caveat text-[20px] font-bold text-ink/90">{title}</h4>
          )}
          <div className="font-kalam text-[14px] leading-relaxed text-ink/85">{children}</div>

          {tags && tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <PaperBadge key={tag} tone="ink">
                  {tag}
                </PaperBadge>
              ))}
            </div>
          )}

          {footer && (
            <div className="mt-3 border-t border-black/[0.06] pt-3 font-kalam text-[12px] text-ink/60">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
