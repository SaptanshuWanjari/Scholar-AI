import React from "react";
import { cn } from "@paper-ui/utils";
import { SketchBorder } from "@paper-ui/core";

type Theme = "light" | "dark";

export interface ThemeToggleRootProps {
  theme?: Theme;
  onToggle?: (theme: Theme) => void;
  size?: "sm" | "md";
  className?: string;
}

const SIZE_DIMS = {
  sm: { w: 48, h: 24, icon: 14, pill: 16, offset: 4 },
  md: { w: 60, h: 28, icon: 18, pill: 20, offset: 5 },
};

function ThemeToggleRoot({
  theme = "light",
  onToggle,
  size = "md",
  className,
}: ThemeToggleRootProps) {
  const [internalTheme, setInternalTheme] = React.useState<Theme>(theme);
  const current = onToggle ? theme : internalTheme;
  const dims = SIZE_DIMS[size];
  const isDark = current === "dark";
  const pillLeft = isDark ? dims.w - dims.pill - dims.offset : dims.offset;

  const handleToggle = () => {
    const next: Theme = current === "light" ? "dark" : "light";
    setInternalTheme(next);
    onToggle?.(next);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={cn("relative inline-flex items-center overflow-hidden rounded-full", className)}
      style={{ width: dims.w, height: dims.h }}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <SketchBorder
        fill={isDark ? "#262320" : "#fffdf9"}
        stroke={isDark ? "#4a4540" : "#bdb7a8"}
        strokeWidth={1.3}
        radius={dims.h / 2}
        roughness={1.1}
      />

      {/* Icon inside pill */}
      <span
        className="absolute top-1/2 -translate-y-1/2 z-[2] transition-all duration-300"
        style={{ left: pillLeft + dims.pill / 2 - dims.icon / 2 }}
      >
        {isDark ? (
          <ThemeToggleMoon size={dims.icon} />
        ) : (
          <ThemeToggleSun size={dims.icon} />
        )}
      </span>

      {/* Sliding pill */}
      <span
        className="absolute top-1/2 -translate-y-1/2 z-[1] transition-all duration-300"
        style={{ left: pillLeft, width: dims.pill, height: dims.pill }}
      >
        <span
          className="block w-full h-full rounded-full"
          style={{ background: isDark ? "#3a3733" : "#f4f1ea" }}
        >
          <SketchBorder
            stroke={isDark ? "#5a5550" : "#c5bdaa"}
            strokeWidth={1}
            radius={dims.pill / 2}
            roughness={1.2}
          />
        </span>
      </span>

      {/* Track decorations */}
      {isDark && (
        <>
          {[25, 55, 80].map((pct) => (
            <span
              key={pct}
              className="absolute top-1/2 -translate-y-1/2 w-0.5 h-0.5 rounded-full bg-[#fffdf9]/30"
              style={{ left: `${pct}%` }}
            />
          ))}
        </>
      )}
    </button>
  );
}
ThemeToggleRoot.displayName = "ThemeToggle.Root";

interface ThemeToggleSunProps {
  size?: number;
  className?: string;
}

function ThemeToggleSun({ size = 14, className }: ThemeToggleSunProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      fill="none"
      aria-hidden
    >
      <circle cx="12" cy="12" r="5" stroke="#c9954f" strokeWidth="2" />
      {[
        "M12 2.5 L12 4.5",
        "M12 19.5 L12 21.5",
        "M2.5 12 L4.5 12",
        "M19.5 12 L21.5 12",
        "M5.3 5.3 L6.7 6.7",
        "M17.3 17.3 L18.7 18.7",
        "M5.3 18.7 L6.7 17.3",
        "M17.3 6.7 L18.7 5.3",
      ].map((d) => (
        <path key={d} d={d} stroke="#c9954f" strokeWidth="1.5" strokeLinecap="round" />
      ))}
    </svg>
  );
}
ThemeToggleSun.displayName = "ThemeToggle.Sun";

interface ThemeToggleMoonProps {
  size?: number;
  className?: string;
}

function ThemeToggleMoon({ size = 14, className }: ThemeToggleMoonProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      fill="none"
      aria-hidden
    >
      <path
        d="M21 12.8 C20 17 16 20.5 11.5 20.5 C6 20.5 3 17.5 3 13 C3 8.5 7 4.5 11.5 4 C11.5 4 7 6 8 11 C8.5 14 13 14 16 12 C18 11 21 11 21 12.8 Z"
        stroke="#c8c0b0"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
ThemeToggleMoon.displayName = "ThemeToggle.Moon";

interface ThemeToggleTrackProps {
  children?: React.ReactNode;
  className?: string;
}

function ThemeToggleTrack({ children, className }: ThemeToggleTrackProps) {
  return (
    <span className={cn("relative inline-flex items-center rounded-full px-1", className)}>
      {children}
    </span>
  );
}
ThemeToggleTrack.displayName = "ThemeToggle.Track";

export const ThemeToggle = Object.assign(ThemeToggleRoot, {
  Sun: ThemeToggleSun,
  Moon: ThemeToggleMoon,
  Track: ThemeToggleTrack,
});

export type { ThemeToggleRootProps as ThemeToggleProps, Theme as ThemeToggleTheme };
