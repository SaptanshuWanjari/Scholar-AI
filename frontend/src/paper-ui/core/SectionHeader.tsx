import React from "react";
import { cn } from "@/paper-ui/utils";
import { MarkerHighlight } from "@/paper-ui/core";

export interface SectionLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

/** Small uppercase eyebrow label in the neat hand font. */
export function SectionLabel({ children, className, ...props }: SectionLabelProps) {
  return (
    <span
      className={cn(
        "font-architect text-[1rem] font-medium uppercase tracking-[0.14em] text-ink-muted",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export interface SectionHeaderProps {
  title: React.ReactNode;
  /** Right-aligned action (e.g. "View all →"). */
  action?: React.ReactNode;
  /** Underline the title with a marker sweep. */
  marker?: boolean;
  markerColor?: string;
  className?: string;
}

/** Row with an uppercase section label and an optional trailing action. */
export function SectionHeader({ title, action, marker, markerColor, className }: SectionHeaderProps) {
  const label = <SectionLabel className="text-ink">{title}</SectionLabel>;
  return (
    <div className={cn("mb-3 flex items-center justify-between px-1", className)}>
      {marker ? <MarkerHighlight color={markerColor}>{label}</MarkerHighlight> : label}
      {action}
    </div>
  );
}
