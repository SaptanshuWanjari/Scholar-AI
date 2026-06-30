import { cn } from "@paper-ui/utils";

export interface IconProps {
  size?: number;
  color?: string;
  className?: string;
  strokeWidth?: number;
}

function svg(size: number, className?: string) {
  return {
    width: size,
    height: size,
    className: cn("shrink-0", className),
    fill: "none" as const,
    "aria-hidden": true,
  };
}

/** Hand-drawn document with fold and lines. */
export function DocumentIcon({ size = 22, color = "currentColor", strokeWidth = 1.8, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      <path d="M5 3 Q5 2 6 2 L15 2 Q16 2 16 3 L16 7 Q16 8 17 8 L21 8 Q22 8 22 9 L22 21 Q22 22 21 22 L6 22 Q5 22 5 21 Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 2 L16 7 Q16 8 17 8 L22 8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 12 L16 12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeOpacity="0.6" />
      <path d="M8 15.5 L14 15.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeOpacity="0.6" />
      <path d="M8 19 L12 19" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeOpacity="0.6" />
    </svg>
  );
}

/** Notebook page with spiral holes on the side. */
export function NotebookPageIcon({ size = 22, color = "currentColor", strokeWidth = 1.8, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      <path d="M7 3 Q6.5 3 6.5 3.5 L6.5 20.5 Q6.5 21 7 21 L18 21 Q19 21 19 20 L19 4 Q19 3 18 3 Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 6 L3 5.5 Q2.5 5.5 2.5 6 L2.5 18 Q2.5 18.5 3 18.5 L6.5 18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      {[8, 12, 16].map((y) => (
        <circle key={y} cx="5" cy={y} r="0.8" fill={color} stroke="none" />
      ))}
      <path d="M9 9 L16 9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeOpacity="0.6" />
      <path d="M9 12.5 L14 12.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeOpacity="0.6" />
      <path d="M9 16 L13 16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeOpacity="0.6" />
    </svg>
  );
}

/** Folder with tab and paper peeking out. */
export function FolderIcon({ size = 22, color = "currentColor", strokeWidth = 1.8, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      <path d="M2 7 Q2 6 3 6 L9 6 Q10 6 10.5 6.5 L11.5 8 Q12 8.5 12.5 8.5 L20 8.5 Q21 8.5 21 9.5 L21 19 Q21 20 20 20 L4 20 Q3 20 3 19 Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 14 Q16 13 18 14" stroke={color} strokeWidth={strokeWidth * 0.7} strokeLinecap="round" strokeOpacity="0.5" />
    </svg>
  );
}

/** Ribbon bookmark. */
export function BookmarkIcon({ size = 22, color = "currentColor", strokeWidth = 1.8, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      <path d="M5 2 Q5 1.5 5.5 1.5 L18.5 1.5 Q19 1.5 19 2 L19 21.5 Q19 22 18.5 21.5 L12 17 L5.5 21.5 Q5 22 5 21.5 Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Clipboard with checkmark. */
export function ClipboardIcon({ size = 22, color = "currentColor", strokeWidth = 1.8, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      <path d="M8 4 L7 4 Q6 4 6 5 L6 20 Q6 21 7 21 L17 21 Q18 21 18 20 L18 5 Q18 4 17 4 L16 4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 3.5 Q9 2.5 10 2.5 L14 2.5 Q15 2.5 15 3.5 L15 5.5 Q15 6 14.5 6 L9.5 6 Q9 6 9 5.5 Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 12 L11 14.5 L15 10" stroke={color} strokeWidth={strokeWidth * 0.85} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Rubber stamp with pad. */
export function StampIcon({ size = 22, color = "currentColor", strokeWidth = 1.8, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      <path d="M5 16 Q5 15 6 15 L18 15 Q19 15 19 16 L19 18 Q19 19 18 19 L6 19 Q5 19 5 18 Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 15 L7 11 Q7 10 8 10 L16 10 Q17 10 17 11 L17 15" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 13 L14 13" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M4 20 L20 20" stroke={color} strokeWidth={strokeWidth * 0.7} strokeLinecap="round" strokeOpacity="0.4" />
    </svg>
  );
}

/** Paper sheet with folded corner. */
export function PaperSheetIcon({ size = 22, color = "currentColor", strokeWidth = 1.8, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      <path d="M4 3 Q4 2 5 2 L16 2 Q17 2 17 3 L17 6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 6 L20 6 Q21 6 21 7 L21 21 Q21 22 20 22 L5 22 Q4 22 4 21 L4 17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 6 L17 8 Q17 9 18 9 L20 9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 12 L16 12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeOpacity="0.6" />
      <path d="M7 16 L13 16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeOpacity="0.6" />
    </svg>
  );
}

/** Envelope / mail icon. */
export function EnvelopeIcon({ size = 22, color = "currentColor", strokeWidth = 1.8, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      <path d="M3 6 Q3 5 4 5 L20 5 Q21 5 21 6 L21 18 Q21 19 20 19 L4 19 Q3 19 3 18 Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 6.5 L12 13 L21 6.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
