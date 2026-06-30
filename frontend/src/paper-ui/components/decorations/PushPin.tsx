import { cn } from "@/paper-ui/utils";

export type PushPinPosition = "top-center" | "top-left" | "top-right" | "center" | "none";

export interface PushPinProps {
  size?: number;
  color?: string;
  position?: PushPinPosition;
  className?: string;
}

const PIN_PLACEMENT: Record<PushPinPosition, string> = {
  "top-center": "absolute -top-3 left-1/2 -translate-x-1/2 z-20",
  "top-left": "absolute -top-3 left-4 z-20",
  "top-right": "absolute -top-3 right-4 z-20",
  "center": "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20",
  "none": "",
};

/** A small hand-drawn push pin (replaces the emoji 📌). */
export function PushPin({ size = 26, color = "#b5685e", position = "top-center", className }: PushPinProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={cn("drop-shadow-[1px_2px_1px_rgba(0,0,0,0.18)]", PIN_PLACEMENT[position], className)}
      aria-hidden
    >
      {/* needle */}
      <path d="M16 18 L16 29" stroke="#3a3733" strokeWidth="1.6" strokeLinecap="round" />
      {/* pin head */}
      <ellipse cx="16" cy="11" rx="9" ry="8" fill={color} stroke="#3a3733" strokeWidth="1.6" />
      {/* highlight */}
      <ellipse cx="12.5" cy="8" rx="2.6" ry="2" fill="rgba(255,255,255,0.5)" />
      {/* collar */}
      <path d="M11 17 Q16 20 21 17" fill="none" stroke="#3a3733" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
