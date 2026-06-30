import { cn } from "@paper-ui/utils";

export type CoffeeRingPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center" | "none";

export interface CoffeeRingProps {
  size?: number;
  rotate?: number;
  opacity?: number;
  position?: CoffeeRingPosition;
  className?: string;
}

const RING_PLACEMENT: Record<CoffeeRingPosition, string> = {
  "top-left": "absolute -top-4 -left-4 z-10",
  "top-right": "absolute -top-4 -right-4 z-10",
  "bottom-left": "absolute -bottom-8 -left-8 z-10",
  "bottom-right": "absolute -bottom-8 -right-8 z-10",
  "center": "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10",
  "none": "",
};

/** A coffee-ring stain — two offset concentric ellipses with a drip channel. */
export function CoffeeRing({ size = 64, rotate, opacity = 0.18, position = "none", className }: CoffeeRingProps) {
  const cx = size / 2;
  const cy = size / 2;
  // Slightly non-circular for an organic feel
  const orx = size * 0.46;
  const ory = size * 0.43;
  const irx = orx * 0.71;
  const iry = ory * 0.71;
  // Inner ring shifted slightly down-right
  const ox = size * 0.025;
  const oy = size * 0.02;
  const sw = size * 0.055; // stroke width scales with size

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={cn("pointer-events-none", RING_PLACEMENT[position], className)}
      style={{
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        opacity,
      }}
      aria-hidden
    >
      {/* Outer ring */}
      <ellipse
        cx={cx}
        cy={cy}
        rx={orx}
        ry={ory}
        fill="none"
        stroke="#7b4a2a"
        strokeWidth={sw}
      />
      {/* Inner ring — slightly offset, thinner */}
      <ellipse
        cx={cx + ox}
        cy={cy + oy}
        rx={irx}
        ry={iry}
        fill="none"
        stroke="#7b4a2a"
        strokeWidth={sw * 0.65}
      />
      {/* Drip channel — small broken arc at the bottom */}
      <path
        d={`M ${cx - orx * 0.18} ${cy + ory} Q ${cx} ${cy + ory + size * 0.055} ${cx + orx * 0.18} ${cy + ory}`}
        fill="none"
        stroke="#7b4a2a"
        strokeWidth={sw * 0.5}
        strokeLinecap="round"
        opacity={0.6}
      />
    </svg>
  );
}
