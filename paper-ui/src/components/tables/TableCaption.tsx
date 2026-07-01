import React from "react";
import { cn } from "@paper-ui/utils";

export interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {
  side?: "top" | "bottom";
  children: React.ReactNode;
}

export function TableCaption({
  side = "bottom",
  children,
  className,
  ...props
}: TableCaptionProps) {
  return (
    <caption
      className={cn(
        "font-caveat text-sm text-ink-muted/70 py-2",
        side === "bottom" && "caption-bottom",
        side === "top" && "caption-top",
        className,
      )}
      {...props}
    >
      {children}
    </caption>
  );
}
