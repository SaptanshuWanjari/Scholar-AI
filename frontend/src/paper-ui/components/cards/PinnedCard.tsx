import React from "react";
import { cn } from "@/paper-ui/utils";
import { PaperCard } from "@/paper-ui/core";
import { SectionLabel } from "@/paper-ui/core";
import { PushPin } from "../decorations/PushPin";
import { Tape } from "../decorations/Tape";

type PinStyle = "push-pin" | "tape";

export interface PinnedCardProps {
  children: React.ReactNode;
  title?: string;
  pinStyle?: PinStyle;
  /** Subtle tilt (-3° to +3° feels natural). */
  rotate?: number;
  className?: string;
}

/**
 * Generic pinnable container. Sits slightly tilted on the page, held by a
 * push-pin or strip of tape. Wrap any content inside.
 */
export function PinnedCard({
  children,
  title,
  pinStyle = "push-pin",
  rotate = 0,
  className,
}: PinnedCardProps) {
  return (
    <div
      className={cn("relative", className)}
      style={{ transform: rotate ? `rotate(${rotate}deg)` : undefined }}
    >
      {pinStyle === "push-pin" && (
        <div className="absolute -top-4 left-1/2 z-30 -translate-x-1/2">
          <PushPin size={26} />
        </div>
      )}
      {pinStyle === "tape" && (
        <Tape corner="top-center" width={52} rotate={-4} className="-top-3 left-1/2 -translate-x-1/2" />
      )}

      <PaperCard shadow="md" className="overflow-visible px-5 pb-5 pt-6">
        {title && (
          <SectionLabel className="mb-3 block">{title}</SectionLabel>
        )}
        {children}
      </PaperCard>
    </div>
  );
}
