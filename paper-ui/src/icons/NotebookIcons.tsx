import { cn } from "@paper-ui/utils";
import type { IconProps } from "./PaperIcons";

function svg(size: number, className?: string) {
  return {
    width: size,
    height: size,
    className: cn("shrink-0", className),
    fill: "none" as const,
    "aria-hidden": true,
  };
}

/** Spiral-bound notebook. */
export function NotebookIcon({ size = 22, color = "currentColor", strokeWidth = 1.8, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      <path d="M4 4 Q4 3 5 3 L19 3 Q20 3 20 4 L20 20 Q20 21 19 21 L5 21 Q4 21 4 20 Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 6.5 L2 7 M4 10 L2 10.5 M4 13.5 L2 14 M4 17 L2 17.5" stroke={color} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />
      <path d="M7 7.5 L15 7.5" stroke={color} strokeWidth={strokeWidth * 0.75} strokeLinecap="round" strokeOpacity="0.5" />
      <path d="M7 11 L13 11" stroke={color} strokeWidth={strokeWidth * 0.75} strokeLinecap="round" strokeOpacity="0.5" />
      <path d="M7 14.5 L14 14.5" stroke={color} strokeWidth={strokeWidth * 0.75} strokeLinecap="round" strokeOpacity="0.5" />
      <path d="M7 18 L12 18" stroke={color} strokeWidth={strokeWidth * 0.75} strokeLinecap="round" strokeOpacity="0.5" />
    </svg>
  );
}

/** Spiral binding (used standalone). */
export function SpiralIcon({ size = 22, color = "currentColor", strokeWidth = 1.8, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      {[4, 8, 12, 16, 20].map((y) => (
        <path key={y} d={`M8 ${y} Q6 ${y - 1} 6 ${y} Q6 ${y + 1} 8 ${y}`} stroke={color} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" fill="none" />
      ))}
      <path d="M3 3 L10 3 L10 21 L3 21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Tabbed divider page. */
export function TabDividerIcon({ size = 22, color = "currentColor", strokeWidth = 1.8, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      <path d="M3 4 Q3 3 4 3 L16 3 Q17 3 17 4 L17 7 L19 7 Q19.5 7 19.5 7.5 L19.5 9 Q19.5 9.5 19 9.5 L17 9.5 L17 20 Q17 21 16 21 L4 21 Q3 21 3 20 Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 8 L14 8" stroke={color} strokeWidth={strokeWidth * 0.7} strokeLinecap="round" strokeOpacity="0.5" />
      <path d="M6 12 L12 12" stroke={color} strokeWidth={strokeWidth * 0.7} strokeLinecap="round" strokeOpacity="0.5" />
      <path d="M6 16 L13 16" stroke={color} strokeWidth={strokeWidth * 0.7} strokeLinecap="round" strokeOpacity="0.5" />
    </svg>
  );
}

/** Sticky note. */
export function StickyNoteIcon({ size = 22, color = "currentColor", strokeWidth = 1.8, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      <path d="M4 4 Q4 3 5 3 L15 3 Q16 3 16 4 L16 8 Q16 9 17 9 L20 9 Q21 9 21 10 L21 20 Q21 21 20 21 L5 21 Q4 21 4 20 Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 3 L16 8 Q16 9 17 9 L21 9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 11 L14 11" stroke={color} strokeWidth={strokeWidth * 0.7} strokeLinecap="round" strokeOpacity="0.5" />
      <path d="M7 14.5 L12 14.5" stroke={color} strokeWidth={strokeWidth * 0.7} strokeLinecap="round" strokeOpacity="0.5" />
      <path d="M7 18 L11 18" stroke={color} strokeWidth={strokeWidth * 0.7} strokeLinecap="round" strokeOpacity="0.5" />
    </svg>
  );
}

/** Push pin. */
export function PushPinIcon({ size = 22, color = "currentColor", strokeWidth = 1.8, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      <circle cx="12" cy="7" r="5" stroke={color} strokeWidth={strokeWidth} />
      <circle cx="10.5" cy="5.5" r="1.2" stroke={color} strokeWidth={strokeWidth * 0.6} strokeOpacity="0.4" />
      <path d="M12 12 Q11.5 15 12 18.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M8 10.5 Q5.5 12 5 14" stroke={color} strokeWidth={strokeWidth * 0.75} strokeLinecap="round" />
      <path d="M16 10.5 Q18.5 12 19 14" stroke={color} strokeWidth={strokeWidth * 0.75} strokeLinecap="round" />
    </svg>
  );
}

/** Tape strip. */
export function TapeIcon({ size = 22, color = "currentColor", strokeWidth = 1.8, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 12" width={size} height={Math.round(size * 0.5)} className={cn("shrink-0", className)} fill="none" aria-hidden>
      <path d="M5 2 Q2 2 2 6 Q2 10 5 10 L19 10 Q22 10 22 6 Q22 2 19 2 Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      {[6, 10, 14, 18].map((x) => (
        <path key={x} d={`M${x} 3.5 L${x} 8.5`} stroke={color} strokeWidth={0.6} strokeLinecap="round" strokeOpacity="0.3" />
      ))}
    </svg>
  );
}

/** Highlighter pen. */
export function HighlighterIcon({ size = 22, color = "currentColor", strokeWidth = 1.8, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      <path d="M6 15 L3 21 L9 19 Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 14 L13 5 Q13.5 4 14.5 4 L19.5 4 Q20.5 4 21 4.5 L21 9.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 18 L14 4" stroke={color} strokeWidth={strokeWidth * 0.7} strokeLinecap="round" strokeOpacity="0.4" />
      <path d="M21 4.5 L9 15.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M10 19 L19 12" stroke={color} strokeWidth={strokeWidth * 0.7} strokeLinecap="round" strokeOpacity="0.5" />
    </svg>
  );
}
