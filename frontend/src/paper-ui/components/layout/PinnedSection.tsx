import React from "react";
import { cn } from "@/paper-ui/utils";
import { Tape } from "../decorations/Tape";
import { PushPin } from "../decorations/PushPin";
import { SectionLabel } from "@/paper-ui/core";

export interface PinnedSectionProps {
  /** Section heading text. */
  title: React.ReactNode;
  /** How the heading is fastened to the page. Default "tape". */
  pin?: "tape" | "push-pin" | "none";
  /** Optional right-aligned action (e.g. "View all →"). */
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * A page section whose heading is physically pinned or taped to the surface —
 * the stationery version of a `<section>` + `SectionHeader`.
 *
 * Used for content groupings that should feel deliberately placed rather than
 * automatically generated.
 */
export function PinnedSection({ title, pin = "tape", action, children, className }: PinnedSectionProps) {
  return (
    <section className={cn("relative", className)}>
      <div className="mb-4 flex items-end justify-between">
        <div className="relative inline-block">
          {pin === "tape" && (
            <Tape
              corner="top-center"
              width={48}
              rotate={-4}
              className="-top-3 left-1/2 -translate-x-1/2"
            />
          )}
          {pin === "push-pin" && (
            <div className="absolute -top-4 left-1/2 z-30 -translate-x-1/2">
              <PushPin size={20} />
            </div>
          )}
          <div className={cn(pin !== "none" && "pt-1.5")}>
            <SectionLabel className="text-ink">{title}</SectionLabel>
          </div>
        </div>
        {action && <div>{action}</div>}
      </div>
      {children}
    </section>
  );
}
