import React from "react";
import { cn } from "@/paper-ui/utils";

export interface PaperTextureProps {
  className?: string;
  opacity?: number;
}

export function PaperTexture({ className, opacity = 0.4 }: PaperTextureProps) {
  return (
    <div 
      className={cn("pointer-events-none absolute inset-0 z-0 overflow-hidden mix-blend-multiply opacity-[var(--opacity)]", className)}
      style={{ '--opacity': opacity } as React.CSSProperties}
      aria-hidden
    >
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <filter id="paper-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" />
          <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.15 0" in="noise" result="coloredNoise" />
          <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="composite" />
        </filter>
        <rect width="100%" height="100%" filter="url(#paper-noise)" fill="#fdfcfa" />
      </svg>
    </div>
  );
}
