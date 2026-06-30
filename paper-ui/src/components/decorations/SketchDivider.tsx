import { cn } from "@paper-ui/utils";

export interface SketchDividerProps {
  /** Visual weight. */
  color?: string;
  strokeWidth?: number;
  /** "dashed" gives a pencil-dash separator; "wavy" a hand-drawn line. */
  variant?: "wavy" | "straight" | "dashed";
  className?: string;
}

/** A hand-drawn divider — never a flat <hr>. */
export function SketchDivider({
  color = "var(--color-pencil)",
  strokeWidth = 1.5,
  variant = "wavy",
  className,
}: SketchDividerProps) {
  if (variant === "dashed") {
    return (
      <div
        className={cn("w-full", className)}
        style={{ borderTop: `${strokeWidth}px dashed ${color}` }}
        aria-hidden
      />
    );
  }
  const d = variant === "straight" ? "M1,5 Q50,4 99,5" : "M1,6 Q20,2 40,5 T80,5 T99,4";
  return (
    <svg
      className={cn("h-2.5 w-full overflow-visible", className)}
      viewBox="0 0 100 10"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path d={d} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}
