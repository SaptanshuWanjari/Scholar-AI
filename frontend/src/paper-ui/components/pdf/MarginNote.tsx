import React from "react";
import { cn } from "@/paper-ui/utils";

export interface MarginNoteProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "left" | "right";
  label?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export function MarginNote({
  side = "left",
  label,
  className,
  children,
  style,
  ...props
}: MarginNoteProps) {
  return (
    <div
      className={cn("relative flex flex-col gap-1", className)}
      style={{
        maxWidth: 160,
        transform: side === "left" ? "rotate(-0.5deg)" : "rotate(0.7deg)",
        borderLeft: side === "left" ? "2px solid #3a3733" : undefined,
        borderRight: side === "right" ? "2px solid #3a3733" : undefined,
        paddingLeft: side === "left" ? 8 : 0,
        paddingRight: side === "right" ? 8 : 0,
        ...style,
      }}
      {...props}
    >
      {label && (
        <div className="font-architect text-[10px] text-ink-muted uppercase tracking-wide">
          {label}
        </div>
      )}
      <div className="font-kalam text-[13px] text-ink leading-snug">{children}</div>
    </div>
  );
}
