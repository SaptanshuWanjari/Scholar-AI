import { cn } from "@/paper-ui/utils";
import type { IconTone } from "@/paper-ui/core";

const STAMP_TONES: Record<IconTone, { stroke: string; fill: string }> = {
  sage:     { stroke: "#3f7a4e", fill: "rgba(63,122,78,0.07)" },
  ochre:    { stroke: "#b07a2e", fill: "rgba(176,122,46,0.07)" },
  sky:      { stroke: "#4a6f91", fill: "rgba(74,111,145,0.07)" },
  lavender: { stroke: "#6f63a3", fill: "rgba(111,99,163,0.07)" },
  brick:    { stroke: "#a3544a", fill: "rgba(163,84,74,0.07)" },
  ink:      { stroke: "#3a3733", fill: "rgba(0,0,0,0.05)" },
};

const SIZES = {
  sm: { vw: 64, vh: 30, fontSize: 9, letterSpacing: "0.09em" },
  md: { vw: 84, vh: 38, fontSize: 11, letterSpacing: "0.09em" },
  lg: { vw: 114, vh: 48, fontSize: 14, letterSpacing: "0.09em" },
} as const;

// Baked hand-jitter paths — each traces a slightly wobbly closed rect
// that fits within the viewBox with 2px bleed on each side.
const BORDER_PATHS = {
  sm: "M 3,2 Q 32,1 61,3 Q 63,3 63,5 Q 64,14 62,24 Q 62,27 59,28 Q 31,29 4,27 Q 1,27 1,24 Q 0,14 2,5 Q 2,2 3,2 Z",
  md: "M 3,2 Q 42,1 81,3 Q 83,3 83,6 Q 85,19 82,32 Q 82,36 79,36 Q 42,38 4,36 Q 1,36 1,32 Q -1,19 2,6 Q 2,2 3,2 Z",
  lg: "M 3,2 Q 57,1 111,3 Q 113,3 113,6 Q 115,25 112,43 Q 112,46 109,46 Q 57,48 4,46 Q 1,46 1,43 Q -1,25 2,6 Q 2,2 3,2 Z",
};

export type PaperStampPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center" | "none";

export interface PaperStampProps {
  label: string;
  tone?: IconTone;
  /** Rotation in degrees. */
  rotate?: number;
  size?: "sm" | "md" | "lg";
  position?: PaperStampPosition;
  className?: string;
}

const STAMP_PLACEMENT: Record<PaperStampPosition, string> = {
  "top-left": "absolute top-4 left-4 z-10",
  "top-right": "absolute top-4 right-4 z-10",
  "bottom-left": "absolute bottom-4 left-4 z-10",
  "bottom-right": "absolute bottom-4 right-4 z-10",
  "center": "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10",
  "none": "",
};

/** A rotatable rubber-stamp face with a hand-jittered border. */
export function PaperStamp({
  label,
  tone = "brick",
  rotate = -8,
  size = "md",
  position = "none",
  className,
}: PaperStampProps) {
  const { stroke, fill } = STAMP_TONES[tone];
  const { vw, vh, fontSize, letterSpacing } = SIZES[size];

  return (
    <svg
      width={vw}
      height={vh}
      viewBox={`0 0 ${vw} ${vh}`}
      className={cn("pointer-events-none select-none", STAMP_PLACEMENT[position], className)}
      style={{ transform: `rotate(${rotate}deg)` }}
      aria-hidden
    >
      {/* Hand-jittered border */}
      <path d={BORDER_PATHS[size]} fill={fill} stroke={stroke} strokeWidth="1.8" strokeLinejoin="round" />
      {/* Label */}
      <text
        x={vw / 2}
        y={vh / 2 + fontSize * 0.38}
        textAnchor="middle"
        fill={stroke}
        fontSize={fontSize}
        fontWeight="700"
        fontFamily="inherit"
        className="font-architect"
        style={{ letterSpacing, textTransform: "uppercase" }}
      >
        {label}
      </text>
    </svg>
  );
}
