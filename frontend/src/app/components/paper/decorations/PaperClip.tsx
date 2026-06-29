import { cn } from "../../ui/utils";

export interface PaperClipProps {
  size?: number;
  color?: string;
  className?: string;
}

/** A Gem-style paperclip — two nested wire loops, open at the bottom. */
export function PaperClip({ size = 28, color = "#8a8a8a", className }: PaperClipProps) {
  // viewBox 0 0 14 38 — narrow and tall, open at the bottom
  const scale = size / 38;
  const w = Math.round(14 * scale);
  const h = size;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 14 38"
      className={cn("drop-shadow-[0px_1px_1px_rgba(0,0,0,0.15)]", className)}
      aria-hidden
    >
      {/* Outer loop: up left side → over top → down right side → bridge to inner */}
      <path
        d="M 2,38 L 2,10 Q 2,1 7,1 Q 13,1 13,10 L 13,30 Q 13,38 8.5,38 Q 6,38 6,30 L 6,10 Q 6,4 7,4 Q 9,4 9,10 L 9,30 Q 9,36 11,38"
        fill="none"
        stroke={color}
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Specular highlight on the outer left wire */}
      <path
        d="M 2.6,12 L 2.6,32"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="0.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
