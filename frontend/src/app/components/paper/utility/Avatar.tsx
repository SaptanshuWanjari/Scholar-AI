import React from "react";
import { cn } from "../../ui/utils";
import { SketchBorder } from "../foundation/SketchBorder";
import type { IconTone } from "../foundation/PaperIconCircle";

const TONE_FILLS: Record<IconTone, { fill: string; fg: string }> = {
  sage:     { fill: "#e7efe4", fg: "#3f7a4e" },
  ochre:    { fill: "#f4e7d2", fg: "#b07a2e" },
  sky:      { fill: "#e2eaf1", fg: "#4a6f91" },
  lavender: { fill: "#e9e9f5", fg: "#6f63a3" },
  brick:    { fill: "#f1ddda", fg: "#a3544a" },
  ink:      { fill: "#f0efed", fg: "#3a3733" },
};

const PRESET_SIZES = { xs: 24, sm: 32, md: 40, lg: 52, xl: 68 } as const;
type SizePreset = keyof typeof PRESET_SIZES;

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export interface AvatarProps {
  /** Image URL. Falls back to initials when absent or on error. */
  src?: string;
  /** Full name — used for initials fallback and alt text. */
  name?: string;
  size?: number | SizePreset;
  tone?: IconTone;
  /** Extra alt text override (defaults to `name`). */
  alt?: string;
  className?: string;
}

/**
 * Circular avatar with a rough-drawn border.
 * Shows the image if `src` is given; falls back to coloured initials derived
 * from `name`; ultimate fallback is an anonymous ink circle.
 */
export function Avatar({
  src,
  name,
  size = "md",
  tone = "ink",
  alt,
  className,
}: AvatarProps) {
  const [imgError, setImgError] = React.useState(false);
  const px = typeof size === "number" ? size : PRESET_SIZES[size];
  const t = TONE_FILLS[tone];
  const initials = name ? getInitials(name) : "";
  const showImage = src && !imgError;
  const fontSize = Math.round(px * 0.36);

  return (
    <span
      className={cn("relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full", className)}
      style={{ width: px, height: px }}
      aria-label={alt ?? name}
      role="img"
    >
      {/* Rough circular border (sits outside the overflow:hidden clip) */}
      <span className="absolute inset-0 z-[2] pointer-events-none">
        <SketchBorder
          stroke="rgba(0,0,0,0.18)"
          strokeWidth={1.4}
          radius={px / 2}
          roughness={0.9}
          bowing={0.7}
          bleed={3}
        />
      </span>

      {showImage ? (
        <img
          src={src}
          alt={alt ?? name ?? "avatar"}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span
          className="flex h-full w-full items-center justify-center font-architect font-medium select-none"
          style={{ background: t.fill, color: t.fg, fontSize }}
        >
          {initials || (
            <svg width={px * 0.45} height={px * 0.45} viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="12" cy="8" r="4" stroke={t.fg} strokeWidth="1.5" />
              <path d="M4 20 C4 15 20 15 20 20" stroke={t.fg} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </span>
      )}
    </span>
  );
}

// ─── AvatarGroup ─────────────────────────────────────────────────────────────

export interface AvatarGroupProps {
  avatars: Pick<AvatarProps, "src" | "name" | "tone">[];
  max?: number;
  size?: number | SizePreset;
  className?: string;
}

/** Overlapping stack of avatars with a +N overflow badge. */
export function AvatarGroup({ avatars, max = 4, size = "sm", className }: AvatarGroupProps) {
  const px = typeof size === "number" ? size : PRESET_SIZES[size];
  const shown = avatars.slice(0, max);
  const overflow = avatars.length - shown.length;
  const offset = Math.round(px * 0.35);

  return (
    <div
      className={cn("relative flex items-center", className)}
      style={{ height: px, minWidth: px + (shown.length - 1 + (overflow > 0 ? 1 : 0)) * offset }}
    >
      {shown.map((a, i) => (
        <span key={i} className="absolute" style={{ left: i * offset }}>
          <Avatar
            {...a}
            size={size}
            className="ring-2 ring-[#fffdf9]"
          />
        </span>
      ))}
      {overflow > 0 && (
        <span
          className="absolute inline-flex items-center justify-center rounded-full bg-[#f0efed] font-architect text-[11px] font-medium text-ink-muted ring-2 ring-[#fffdf9]"
          style={{ width: px, height: px, left: shown.length * offset, fontSize: Math.round(px * 0.3) }}
        >
          +{overflow}
        </span>
      )}
    </div>
  );
}
