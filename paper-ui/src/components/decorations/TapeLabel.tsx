import React from "react";
import { cn } from "@paper-ui/utils";
import { PushPin } from "./PushPin";
import { PaperClip } from "./PaperClip";

export type TapeLabelColor = "cream" | "yellow" | "sky" | "tan" | "white";
export type TapeLabelPattern = "plain" | "grid" | "sparkle" | "scribble";
export type TapeLabelFastener = "none" | "push-pin" | "push-pin-green" | "clip" | "bow";

export interface TapeLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Preset color name or any CSS color string (e.g. "#a8c4de", "hsl(200,40%,70%)"). */
  color?: TapeLabelColor | (string & {});
  pattern?: TapeLabelPattern;
  fastener?: TapeLabelFastener;
  /** Which side the fastener appears on (ignored for "bow", which always appears at both corners). */
  fastenerSide?: "left" | "right";
}

const SURFACE: Record<TapeLabelColor, string> = {
  cream:  "#f5f0e6",
  yellow: "#f0d060",
  sky:    "#c4d8ea",
  tan:    "#d4b896",
  white:  "#f8f7f5",
};

const GRADIENT: Partial<Record<TapeLabelColor, string>> = {
  yellow: "linear-gradient(135deg, #f7e060 0%, #f0d060 45%, #e8c840 100%)",
  sky:    "linear-gradient(135deg, #c8dcee 0%, #b0c8e0 50%, #cce0f2 100%)",
};

const SHADOW_COLOR: Record<TapeLabelColor, string> = {
  cream:  "rgba(100,80,40,0.16)",
  yellow: "rgba(140,100,10,0.20)",
  sky:    "rgba(50,90,130,0.16)",
  tan:    "rgba(100,70,30,0.20)",
  white:  "rgba(0,0,0,0.12)",
};

const TAB_COLOR: Record<TapeLabelColor, string> = {
  cream:  "#fdf8f2",
  yellow: "#fdf0a0",
  sky:    "#ddeef8",
  tan:    "#eddec4",
  white:  "#ffffff",
};

// Clean top/bottom edges, torn zigzag on left and right ends.
const TORN_CLIP =
  "polygon(0% 0%, 100% 0%, 100% 8%, 97% 18%, 100% 28%, 96% 38%, 100% 48%, 97% 58%, 100% 68%, 96% 78%, 100% 88%, 97% 100%, 0% 100%, 0% 88%, 4% 78%, 0% 68%, 3% 58%, 0% 48%, 4% 38%, 0% 28%, 3% 18%, 0% 8%)";

// ─── Pattern overlays ──────────────────────────────────────────────────────────

function GridPattern() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage:
          "linear-gradient(rgba(70,100,140,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(70,100,140,0.22) 1px, transparent 1px)",
        backgroundSize: "18px 18px",
      }}
    />
  );
}

function SparklePattern() {
  const pts: [number, number, number][] = [
    [32, 14, 5], [78, 30, 3.5], [122, 12, 4.5], [162, 32, 5], [196, 17, 3.5],
  ];
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 w-full h-full"
      viewBox="0 0 220 50"
      preserveAspectRatio="xMidYMid meet"
    >
      {pts.map(([x, y, s], i) => (
        <path
          key={i}
          d={`M${x},${y - s} L${x + s * 0.28},${y - s * 0.28} L${x + s},${y} L${x + s * 0.28},${y + s * 0.28} L${x},${y + s} L${x - s * 0.28},${y + s * 0.28} L${x - s},${y} L${x - s * 0.28},${y - s * 0.28} Z`}
          fill="rgba(255,255,255,0.88)"
        />
      ))}
    </svg>
  );
}

function ScribblePattern() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 w-full h-full"
      viewBox="0 0 200 50"
      preserveAspectRatio="none"
    >
      <path
        d="M 5,34 Q 25,24 45,34 Q 65,44 85,34 Q 105,24 125,34 Q 145,44 165,34 Q 185,24 200,34"
        fill="none"
        stroke="#c85050"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M 10,42 Q 30,34 50,42 Q 70,48 90,42 Q 110,34 130,42 Q 150,48 170,42 Q 190,34 200,42"
        fill="none"
        stroke="#c85050"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeOpacity="0.5"
      />
    </svg>
  );
}

// ─── Fastener sub-components ───────────────────────────────────────────────────

function TapeBow() {
  return (
    <svg width="24" height="22" viewBox="0 0 24 22" fill="none" aria-hidden>
      {/* left wing */}
      <path
        d="M12 11 Q7 4 3 8 Q0 11 5 14 Q8 16 12 11"
        fill="#c9a84c"
        stroke="#3a3733"
        strokeWidth="1.1"
      />
      {/* right wing */}
      <path
        d="M12 11 Q17 4 21 8 Q24 11 19 14 Q16 16 12 11"
        fill="#c9a84c"
        stroke="#3a3733"
        strokeWidth="1.1"
      />
      {/* tails */}
      <path d="M12 11 Q9 16 8 21"  stroke="#3a3733" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M12 11 Q15 16 16 21" stroke="#3a3733" strokeWidth="1.3" strokeLinecap="round" />
      {/* center knot */}
      <ellipse cx="12" cy="11" rx="2.4" ry="2" fill="#c9a84c" stroke="#3a3733" strokeWidth="1.1" />
    </svg>
  );
}

function CornerTab({ side, color }: { side: "left" | "right"; color: string }) {
  const left = side === "left";
  return (
    <svg
      aria-hidden
      width="18"
      height="16"
      viewBox="0 0 18 16"
      className={cn(
        "pointer-events-none absolute -top-3 z-10",
        left ? "left-1" : "right-1",
      )}
    >
      <path
        d={left ? "M 0,16 L 16,16 L 16,0 Z" : "M 18,16 L 2,16 L 2,0 Z"}
        fill={color}
        stroke="rgba(0,0,0,0.14)"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

/** A doodle-style torn paper label / washi-tape banner. */
export function TapeLabel({
  color = "cream",
  pattern = "plain",
  fastener = "none",
  fastenerSide = "left",
  children,
  className,
  style,
  ...props
}: TapeLabelProps) {
  const preset = color as TapeLabelColor;
  // Falls back gracefully when `color` is a custom CSS string (not a preset key).
  const surface = SURFACE[preset] ?? color;
  const gradient = GRADIENT[preset];
  const shadow = SHADOW_COLOR[preset] ?? "rgba(0,0,0,0.14)";
  const isLeft = fastenerSide === "left";

  return (
    <div className={cn("relative w-full", className)} style={style} {...props}>

      {/* Tape body — clip-path draws the torn edges */}
      <div style={{ filter: `drop-shadow(1px 3px 2px ${shadow})` }}>
        <div
          className="relative w-full px-8 py-2.5"
          style={{
            backgroundColor: surface,
            backgroundImage: gradient,
            clipPath: TORN_CLIP,
            minHeight: 44,
          }}
        >
          {pattern === "grid"     && <GridPattern />}
          {pattern === "sparkle"  && <SparklePattern />}
          {pattern === "scribble" && <ScribblePattern />}

          {/* depth gradient at bottom edge */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 inset-x-0 h-2"
            style={{ background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.07))" }}
          />

          <div className="relative z-10">{children}</div>
        </div>
      </div>

      {/* Bow — always at both top corners */}
      {fastener === "bow" && (
        <>
          <div className="pointer-events-none absolute z-20 -top-1 left-2">
            <TapeBow />
          </div>
          <div className="pointer-events-none absolute z-20 -top-1 right-2">
            <TapeBow />
          </div>
        </>
      )}

      {/* Push-pin */}
      {(fastener === "push-pin" || fastener === "push-pin-green") && (
        <div
          className={cn(
            "pointer-events-none absolute z-20 -top-1",
            isLeft ? "left-2" : "right-2",
          )}
        >
          <PushPin
            size={22}
            color={fastener === "push-pin-green" ? "#5a8a72" : "#b5685e"}
          />
        </div>
      )}

      {/* Paper clip */}
      {fastener === "clip" && (
        <div
          className={cn(
            "pointer-events-none absolute z-20 -top-2",
            isLeft ? "left-4" : "right-4",
          )}
        >
          <PaperClip size={28} color="#c9a84c" />
        </div>
      )}
    </div>
  );
}
