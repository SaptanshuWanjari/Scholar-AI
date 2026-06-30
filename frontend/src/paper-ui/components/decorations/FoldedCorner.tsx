import { cn } from "@/paper-ui/utils";

export type FoldedCornerPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export interface FoldedCornerProps {
  /** Width × height of the dog-ear triangle. Defaults to 38×40. */
  size?: number;
  position?: FoldedCornerPosition;
  className?: string;
}

const PLACEMENT: Record<FoldedCornerPosition, string> = {
  "top-left": "top-0 left-0 -scale-y-100 -scale-x-100",
  "top-right": "top-0 right-0 -scale-y-100",
  "bottom-left": "bottom-0 left-0 -scale-x-100",
  "bottom-right": "bottom-0 right-0",
};

/**
 * Dog-ear fold. Three layers:
 *   1. Shadow sliver cast at the bend line (behind the flap)
 *   2. Lifted flap (lighter paper back, dark ink outline)
 *
 * Matches the reference design: shadow polygon + flap path with stroke.
 * The parent card must have `overflow-visible` or the fold will clip.
 */
export function FoldedCorner({ size = 38, position = "bottom-right", className }: FoldedCornerProps) {
  const w = size;
  const h = Math.round(size * (40 / 38)); // keep 38:40 ratio

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 38 40"
      className={cn("pointer-events-none absolute z-[2]", PLACEMENT[position], className)}
      aria-hidden
    >
      {/* Shadow sliver — thin triangle behind the fold crease for depth */}
      <path d="M 3 1 L 0 40 L 38 0 Z" fill="rgba(0,0,0,0.07)" />
      {/* Lifted flap — lighter than paper body, ink outline */}
      <path
        d="M 38 0 L 0 40 L 0 0 Z"
        fill="#F0EFE9"
        stroke="#3a3733"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
