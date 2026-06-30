import { cn } from "@/paper-ui/utils";

export interface DoodleProps {
  size?: number;
  color?: string;
  className?: string;
  strokeWidth?: number;
}

function svgProps(size: number, className?: string) {
  return {
    width: size,
    height: size,
    className: cn("shrink-0", className),
    fill: "none" as const,
    "aria-hidden": true,
  };
}

/** Smiling sun — sits beside the greeting. */
export function SunDoodle({ size = 44, color = "#3a3733", strokeWidth = 2.4, className }: DoodleProps) {
  return (
    <svg viewBox="0 0 100 100" {...svgProps(size, className)}>
      <circle cx="50" cy="50" r="22" stroke={color} strokeWidth={strokeWidth} />
      <path d="M41 47 Q44 43 47 47 M53 47 Q56 43 59 47" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M43 56 Q50 64 58 56" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      {[
        "M50 6 L50 18",
        "M50 82 L50 94",
        "M6 50 L18 50",
        "M82 50 L94 50",
        "M19 19 L27 27",
        "M73 73 L81 81",
        "M19 81 L27 73",
        "M73 27 L81 19",
      ].map((d) => (
        <path key={d} d={d} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      ))}
    </svg>
  );
}

/** Hand-drawn arrow, points right by default. */
export function ArrowDoodle({ size = 18, color = "currentColor", strokeWidth = 2, className }: DoodleProps) {
  return (
    <svg viewBox="0 0 24 24" {...svgProps(size, className)}>
      <path d="M3 12 Q12 11 20 12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M15 7 L21 12 L15 17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Signpost — used inside the "next up" sticky note. */
export function SignpostDoodle({ size = 30, color = "#3a3733", strokeWidth = 2, className }: DoodleProps) {
  return (
    <svg viewBox="0 0 32 32" {...svgProps(size, className)}>
      <path d="M16 5 L16 28" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M6 9 L20 9 L23 12 L20 15 L6 15 Z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
      <path d="M26 17 L12 17 L9 20 L12 23 L26 23 Z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
    </svg>
  );
}

/** Five-point hand-drawn star (outline). */
export function StarDoodle({ size = 20, color = "currentColor", strokeWidth = 1.6, className }: DoodleProps & { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" {...svgProps(size, className)}>
      <path
        d="M12 3 L14.4 9 L20.5 9.4 L15.8 13.4 L17.4 19.5 L12 16 L6.6 19.5 L8.2 13.4 L3.5 9.4 L9.6 9 Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Filled star variant for active/favourited rows. */
export function StarDoodleFilled({ size = 20, color = "#c9954f", className }: DoodleProps) {
  return (
    <svg viewBox="0 0 24 24" {...svgProps(size, className)} fill={color}>
      <path
        d="M12 3 L14.4 9 L20.5 9.4 L15.8 13.4 L17.4 19.5 L12 16 L6.6 19.5 L8.2 13.4 L3.5 9.4 L9.6 9 Z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Hand-drawn checkmark inside a circle. */
export function CheckmarkDoodle({ size = 18, color = "#3f7a4e", strokeWidth = 2, className }: DoodleProps) {
  return (
    <svg viewBox="0 0 24 24" {...svgProps(size, className)}>
      <circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth={1.6} />
      <path d="M7.5 12.5 L10.5 15.5 L16.5 8.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── New doodles ──────────────────────────────────────────────────────────────

/** Four-pointed sparkle star with two small satellite dots. */
export function SparkleDoodle({ size = 22, color = "currentColor", strokeWidth = 1.8, className }: DoodleProps) {
  return (
    <svg viewBox="0 0 24 24" {...svgProps(size, className)}>
      {/* main 4-pointed star */}
      <path
        d="M12 2 C11.6 5.8 11.4 8.2 12 10.5 C12.6 8.2 12.4 5.8 12 2 Z"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M12 13.5 C11.6 15.8 11.4 18.2 12 22 C12.6 18.2 12.4 15.8 12 13.5 Z"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M2 12 C5.8 11.6 8.2 11.4 10.5 12 C8.2 12.6 5.8 12.4 2 12 Z"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M13.5 12 C15.8 11.6 18.2 11.4 22 12 C18.2 12.6 15.8 12.4 13.5 12 Z"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      />
      {/* satellite dots */}
      <circle cx="19.5" cy="4.5" r="1.2" fill={color} />
      <circle cx="5" cy="19" r="0.9" fill={color} />
    </svg>
  );
}

/** Ribbon bookmark — rectangle with V-notch at the bottom. */
export function BookmarkDoodle({ size = 20, color = "currentColor", strokeWidth = 1.8, className }: DoodleProps) {
  return (
    <svg viewBox="0 0 24 24" {...svgProps(size, className)}>
      <path
        d="M6 3 Q5.5 3 5.5 3.5 L5.5 21 L12 17 L18.5 21 L18.5 3.5 Q18.5 3 18 3 Z"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

/** Classic paper airplane pointing upper-right. */
export function PaperPlaneDoodle({ size = 22, color = "currentColor", strokeWidth = 1.8, className }: DoodleProps) {
  return (
    <svg viewBox="0 0 24 24" {...svgProps(size, className)}>
      {/* outer body */}
      <path
        d="M3 20.5 L21.5 3.5 L16 20.5 L10.5 14 Z"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      />
      {/* fold crease */}
      <path
        d="M10.5 14 L16 20.5"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
      />
      {/* tail detail */}
      <path
        d="M3 20.5 Q6 17 10.5 14"
        stroke={color} strokeWidth={strokeWidth * 0.7} strokeLinecap="round"
        strokeDasharray="1.5 2"
      />
    </svg>
  );
}

/** Tilted pencil with visible tip and eraser cap. */
export function PencilDoodle({ size = 22, color = "currentColor", strokeWidth = 1.8, className }: DoodleProps) {
  return (
    <svg viewBox="0 0 24 24" {...svgProps(size, className)}>
      {/* body */}
      <path
        d="M5 19 L15.5 4 L19.5 7 L9 22 Z"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      />
      {/* eraser cap band */}
      <path
        d="M14.5 4.8 L18.5 7.8"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
      />
      {/* wood / tip triangle */}
      <path
        d="M5 19 L9 22 L8 17.5 Z"
        stroke={color} strokeWidth={strokeWidth * 0.85} strokeLinecap="round" strokeLinejoin="round"
      />
      {/* center body line */}
      <path
        d="M7 17 Q11 11 15 5.5"
        stroke={color} strokeWidth={strokeWidth * 0.55} strokeLinecap="round" strokeOpacity="0.5"
      />
    </svg>
  );
}

/** Horizontal strip of translucent tape. */
export function TapeDoodle({ size = 28, color = "currentColor", strokeWidth = 1.6, className }: DoodleProps) {
  return (
    <svg viewBox="0 0 32 14" width={size} height={Math.round(size * 14 / 32)}
      className={cn("shrink-0", className)} fill="none" aria-hidden>
      {/* outer shape — pill */}
      <path
        d="M7 2 Q2 2 2 7 Q2 12 7 12 L25 12 Q30 12 30 7 Q30 2 25 2 Z"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      />
      {/* cross-hatch lines suggesting translucency */}
      <path
        d="M8 4 L8 10 M12 4 L12 10 M16 4 L16 10 M20 4 L20 10 M24 4 L24 10"
        stroke={color} strokeWidth={0.7} strokeLinecap="round" strokeOpacity="0.35"
      />
    </svg>
  );
}

/** Push-pin viewed from the front — circular head + shaft. */
export function PushPinDoodle({ size = 20, color = "currentColor", strokeWidth = 1.8, className }: DoodleProps) {
  return (
    <svg viewBox="0 0 24 24" {...svgProps(size, className)}>
      {/* head circle */}
      <circle cx="12" cy="8" r="5.5" stroke={color} strokeWidth={strokeWidth} />
      {/* inner highlight ring */}
      <circle cx="10.5" cy="6.5" r="1.5" stroke={color} strokeWidth={0.9} strokeOpacity="0.4" />
      {/* shaft */}
      <path
        d="M12 13.5 Q11.5 17 12 21"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
      />
      {/* wing flanges */}
      <path
        d="M8 9.5 Q5 11 4.5 13"
        stroke={color} strokeWidth={strokeWidth * 0.8} strokeLinecap="round"
      />
      <path
        d="M16 9.5 Q19 11 19.5 13"
        stroke={color} strokeWidth={strokeWidth * 0.8} strokeLinecap="round"
      />
    </svg>
  );
}

/** Puffy three-bump cloud. */
export function CloudDoodle({ size = 26, color = "currentColor", strokeWidth = 1.8, className }: DoodleProps) {
  return (
    <svg viewBox="0 0 28 20" width={size} height={Math.round(size * 20 / 28)}
      className={cn("shrink-0", className)} fill="none" aria-hidden>
      <path
        d="M6 16 Q3 16 3 13.5 Q3 11 5.5 11 Q5 8.5 7.5 7.5 Q8.5 4.5 12 4.5 Q15 4.5 16 7 Q18.5 6.5 19.5 8.5 Q22.5 8.5 22.5 11.5 Q22.5 14 20.5 14.5 Q21 16 19 16 Z"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

/** Stylised two-hemisphere brain. */
export function BrainDoodle({ size = 24, color = "currentColor", strokeWidth = 1.7, className }: DoodleProps) {
  return (
    <svg viewBox="0 0 24 24" {...svgProps(size, className)}>
      {/* left hemisphere */}
      <path
        d="M12 5.5 C8.5 3.5 3 5.5 3 10.5 C3 16 7 21 12 21"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
      />
      {/* right hemisphere */}
      <path
        d="M12 5.5 C15.5 3.5 21 5.5 21 10.5 C21 16 17 21 12 21"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
      />
      {/* centre division */}
      <path
        d="M12 5.5 Q11.5 13 12 21"
        stroke={color} strokeWidth={strokeWidth * 0.7} strokeLinecap="round" strokeOpacity="0.5"
      />
      {/* left squiggle folds */}
      <path
        d="M7 10 Q5.5 9 6.5 12 Q5.5 14 7 13.5"
        stroke={color} strokeWidth={strokeWidth * 0.75} strokeLinecap="round"
      />
      {/* right squiggle folds */}
      <path
        d="M17 10 Q18.5 9 17.5 12 Q18.5 14 17 13.5"
        stroke={color} strokeWidth={strokeWidth * 0.75} strokeLinecap="round"
      />
    </svg>
  );
}

/** Classic lightbulb with filament. */
export function LightbulbDoodle({ size = 22, color = "currentColor", strokeWidth = 1.8, className }: DoodleProps) {
  return (
    <svg viewBox="0 0 24 24" {...svgProps(size, className)}>
      {/* bulb globe */}
      <path
        d="M8.5 17 Q3 14.5 3 9.5 Q3 3 12 3 Q21 3 21 9.5 Q21 14.5 15.5 17 Z"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      />
      {/* base bands */}
      <path
        d="M8.5 17 L8.5 19 L15.5 19 L15.5 17"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M9 19 L9 21 L15 21 L15 19"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      />
      {/* filament */}
      <path
        d="M10 15 Q11 12 10.5 10 Q12 8.5 13.5 10 Q13 12 14 15"
        stroke={color} strokeWidth={strokeWidth * 0.75} strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

/** Drafting compass with a partial arc being drawn. */
export function CompassDoodle({ size = 24, color = "currentColor", strokeWidth = 1.8, className }: DoodleProps) {
  return (
    <svg viewBox="0 0 24 24" {...svgProps(size, className)}>
      {/* pivot */}
      <circle cx="12" cy="5" r="2" stroke={color} strokeWidth={strokeWidth} />
      {/* left leg */}
      <path
        d="M11 6.8 Q8 11 6.5 19"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
      />
      {/* right leg (pencil side) */}
      <path
        d="M13 6.8 Q16 11 17.5 19"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
      />
      {/* pencil tip on right leg */}
      <path
        d="M16.5 17.5 L17.5 19 L18.5 17.5"
        stroke={color} strokeWidth={strokeWidth * 0.85} strokeLinecap="round" strokeLinejoin="round"
      />
      {/* arc being drawn */}
      <path
        d="M6.5 19 Q12 22.5 17.5 19"
        stroke={color} strokeWidth={strokeWidth * 0.7} strokeLinecap="round" strokeDasharray="1.5 2"
      />
      {/* hinge crossbar */}
      <path
        d="M9.5 10.5 L14.5 10.5"
        stroke={color} strokeWidth={strokeWidth * 0.8} strokeLinecap="round"
      />
    </svg>
  );
}
