import React from "react";
import { cn } from "@paper-ui/utils";

export interface PaperShadowProps {
  className?: string;
  variant?: "soft" | "hard" | "sketch";
}

export function PaperShadow({ className, variant = "soft" }: PaperShadowProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 -z-10",
        variant === "soft" && "shadow-[4px_4px_16px_rgba(0,0,0,0.1),_1px_1px_4px_rgba(0,0,0,0.05)]",
        variant === "hard" && "translate-x-[6px] translate-y-[6px] bg-[#dcd7cb]",
        variant === "sketch" && "translate-x-1 translate-y-1 bg-[#e8e4d9] [mask-image:url('data:image/svg+xml;utf8,<svg viewBox=\"0 0 100 100\" preserveAspectRatio=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M0 0 L100 0 L100 100 L0 100 Z\" fill=\"black\" stroke=\"black\" stroke-width=\"4\" stroke-dasharray=\"12 4 6 2 8 4\" vector-effect=\"non-scaling-stroke\"/></svg>')]",
        className
      )}
      aria-hidden
    />
  );
}
