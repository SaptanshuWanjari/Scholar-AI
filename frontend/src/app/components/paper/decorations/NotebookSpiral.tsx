import { cn } from "../../ui/utils";

export interface NotebookSpiralProps {
  /** Number of rings across the top. */
  count?: number;
  className?: string;
}

/**
 * One wire ring: dark punched-hole ellipse, wire loop with depth, highlight.
 * Mirrors the reference design exactly (hole → loop → inner specular).
 */
function Ring() {
  return (
    // viewBox "-6 -8 12 32" captures the full ring: x ∈ [-6,6], y ∈ [-8,24]
    <svg width="14" height="32" viewBox="-6 -8 12 32" overflow="visible">
      {/* Punched hole (drawn first — sits behind the wire) */}
      <ellipse cx="0" cy="15" rx="4.5" ry="6" fill="#252525" />
      {/* Wire loop */}
      <path
        d="M -3 16 C -4 0, -2 -5, 0 -5 C 2 -5, 4 0, 3 16 C 2 20, -2 20, -3 16 Z"
        fill="none"
        stroke="#2e2e2e"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      {/* Inner specular highlight on the wire */}
      <path
        d="M -1 15 C -1.5 2, -0.5 -3, 0 -3 C 0.5 -3, 1.5 2, 1 15"
        fill="none"
        stroke="#888"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Top spiral binding — detailed wire rings that straddle the card's top edge. */
export function NotebookSpiral({ count = 14, className }: NotebookSpiralProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute -top-3 left-5 right-5 z-20 flex justify-between",
        className,
      )}
      aria-hidden
    >
      {Array.from({ length: count }).map((_, i) => (
        <Ring key={i} />
      ))}
    </div>
  );
}
