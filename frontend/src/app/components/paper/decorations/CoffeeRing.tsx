import { cn } from "../../ui/utils";

export interface CoffeeRingProps {
  size?: number;
  rotate?: number;
  opacity?: number;
  className?: string;
}

/** A coffee-ring stain — two offset concentric ellipses with a drip channel. */
export function CoffeeRing({ size = 64, rotate, opacity = 0.18, className }: CoffeeRingProps) {
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
      className={cn("pointer-events-none", className)}
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
