import React from "react";
import { cn } from "@paper-ui/utils";
import { PushPin } from "./PushPin";
import { Tape } from "./Tape";

export interface StickyNoteProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
  /** Tiny tilt, kept between −2° and +2°. */
  rotate?: number;
  color?: string;
  /** How it's pinned to the page. */
  pin?: "push-pin" | "tape" | "none";
}

/**
 * A pastel sticky note with a tiny paper curl and a hard shadow, pinned to
 * the page. Holds a small icon or short note.
 */
export function StickyNote({
  children,
  className,
  size = 84,
  rotate = -2,
  color = "var(--color-sticky)",
  pin = "push-pin",
  style,
  ...props
}: StickyNoteProps) {
  return (
    <div
      className={cn("group/sticky relative", className)}
      style={{ width: size, height: size, ["--rot" as string]: `${rotate}deg`, transform: `rotate(${rotate}deg)`, ...style }}
      {...props}
    >
      {pin === "push-pin" && (
        <div className="absolute -top-3 left-1/2 z-30 -translate-x-1/2">
          <PushPin size={22} />
        </div>
      )}
      {pin === "tape" && <Tape corner="top-center" width={42} />}

      <div
        className="paper-texture relative flex h-full w-full items-center justify-center"
        style={{
          backgroundColor: color,
          boxShadow: "2px 3px 0 rgba(0,0,0,0.14)",
          borderRadius: "2px 2px 3px 3px",
        }}
      >
        {/* paper curl, bottom-right */}
        <div
          className="absolute bottom-0 right-0 h-4 w-4"
          style={{
            background: "linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.02) 70%)",
            borderBottomRightRadius: "3px",
          }}
        />
        <div className="relative z-[1] text-ink">{children}</div>
      </div>
    </div>
  );
}
