import React from "react";
import { cn } from "@paper-ui/utils";
import { SketchBorder } from "@paper-ui/core";
import { StatusDot, type StatusDotStatus, type StatusDotSize } from "./StatusDot";

export type { StatusDotStatus as PresenceStatus };

const PRESET_SIZES = { sm: 32, md: 44, lg: 60 } as const;
type SizePreset = keyof typeof PRESET_SIZES;

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/* ------------------------------------------------------------------ */
/* Root                                                                */
/* ------------------------------------------------------------------ */

export interface PresenceIndicatorProps {
  name: string;
  status?: StatusDotStatus;
  size?: SizePreset;
  src?: string;
  className?: string;
  children?: React.ReactNode;
}

const PresenceIndicatorRoot = React.forwardRef<HTMLDivElement, PresenceIndicatorProps>(
  ({ name, status = "offline", size = "md", src, className, children }, ref) => {
    const px = PRESET_SIZES[size];
    const dotSize: StatusDotSize = size === "sm" ? "sm" : size === "md" ? "md" : "lg";
    const [imgError, setImgError] = React.useState(false);
    const showImg = src && !imgError;

    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center gap-2.5", className)}
      >
        {children ?? (
          <>
            <span className="relative inline-flex shrink-0" style={{ width: px, height: px }}>
              <span
                className={cn(
                  "flex h-full w-full items-center justify-center rounded-full overflow-hidden",
                  "font-architect font-medium select-none",
                  "bg-[#f0efed] text-[#3a3733]"
                )}
                style={{ fontSize: Math.round(px * 0.36) }}
              >
                {showImg ? (
                  <img
                    src={src}
                    alt={name}
                    className="h-full w-full object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  getInitials(name) || (
                    <svg
                      width={px * 0.4}
                      height={px * 0.4}
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                    >
                      <circle cx="12" cy="8" r="4" stroke="#3a3733" strokeWidth="1.5" />
                      <path d="M4 20 C4 15 20 15 20 20" stroke="#3a3733" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  )
                )}
              </span>
              <span className="absolute inset-0 z-[2] pointer-events-none">
                <SketchBorder
                  stroke="rgba(0,0,0,0.16)"
                  strokeWidth={1.3}
                  radius={px / 2}
                  roughness={0.85}
                  bowing={0.6}
                  bleed={3}
                />
              </span>
              <span className="absolute -bottom-0.5 -right-0.5 z-[3]">
                <StatusDot status={status} size={dotSize} />
              </span>
            </span>
            <div className="flex flex-col">
              <span className="font-kalam text-[14px] text-[#3a3733] leading-tight">{name}</span>
              <span className="font-kalam text-[11px] text-ink-muted capitalize">{status}</span>
            </div>
          </>
        )}
      </div>
    );
  }
);
PresenceIndicatorRoot.displayName = "PresenceIndicator";

/* ------------------------------------------------------------------ */
/* Avatar (standalone)                                                 */
/* ------------------------------------------------------------------ */

export interface PresenceIndicatorAvatarProps {
  name: string;
  size?: SizePreset;
  src?: string;
  className?: string;
}

const PresenceIndicatorAvatar: React.FC<PresenceIndicatorAvatarProps> = ({
  name,
  size = "md",
  src,
  className,
}) => {
  const px = PRESET_SIZES[size];
  const [imgError, setImgError] = React.useState(false);
  const showImg = src && !imgError;

  return (
    <span className={cn("relative inline-flex shrink-0", className)} style={{ width: px, height: px }}>
      <span
        className="flex h-full w-full items-center justify-center rounded-full overflow-hidden font-architect font-medium select-none bg-[#f0efed] text-[#3a3733]"
        style={{ fontSize: Math.round(px * 0.36) }}
      >
        {showImg ? (
          <img
            src={src}
            alt={name}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          getInitials(name)
        )}
      </span>
      <span className="absolute inset-0 z-[2] pointer-events-none">
        <SketchBorder
          stroke="rgba(0,0,0,0.16)"
          strokeWidth={1.3}
          radius={px / 2}
          roughness={0.85}
          bowing={0.6}
          bleed={3}
        />
      </span>
    </span>
  );
};
PresenceIndicatorAvatar.displayName = "PresenceIndicator.Avatar";

/* ------------------------------------------------------------------ */
/* Badge                                                               */
/* ------------------------------------------------------------------ */

export interface PresenceIndicatorBadgeProps {
  status: StatusDotStatus;
  size?: SizePreset;
}

const PresenceIndicatorBadge: React.FC<PresenceIndicatorBadgeProps> = ({ status, size = "md" }) => {
  const dotSize: StatusDotSize = size === "sm" ? "sm" : size === "md" ? "md" : "lg";
  return <StatusDot status={status} size={dotSize} />;
};
PresenceIndicatorBadge.displayName = "PresenceIndicator.Badge";

/* ------------------------------------------------------------------ */
/* Label                                                               */
/* ------------------------------------------------------------------ */

export interface PresenceIndicatorLabelProps {
  children: React.ReactNode;
  className?: string;
}

const PresenceIndicatorLabel: React.FC<PresenceIndicatorLabelProps> = ({ children, className }) => (
  <span className={cn("font-kalam text-[14px] text-[#3a3733] leading-tight", className)}>
    {children}
  </span>
);
PresenceIndicatorLabel.displayName = "PresenceIndicator.Label";

/* ------------------------------------------------------------------ */
/* Export                                                              */
/* ------------------------------------------------------------------ */

export const PresenceIndicator = Object.assign(PresenceIndicatorRoot, {
  Avatar: PresenceIndicatorAvatar,
  Badge: PresenceIndicatorBadge,
  Label: PresenceIndicatorLabel,
});
