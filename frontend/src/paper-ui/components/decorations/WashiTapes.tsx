import { useId } from "react";
import { cn } from "@/paper-ui/utils";

export interface WashiTapeProps {
  /** Rendered pixel width. Height is derived from the fixed 320:80 aspect ratio. */
  width?: number;
  /** Override the tape's default fill color with any CSS color. */
  color?: string;
  className?: string;
}

// ViewBox: 0 0 320 80
// Fold/tab area  : y  0 – 20   (gives tabs real room to breathe)
// Tape body      : y 20 – 66
// Shadow zone    : y 66 – 80
const VW = 320;
const VH = 80;

function tapeH(w: number) {
  return Math.round((w * VH) / VW);
}

const FILTER = "drop-shadow(0px 2px 4px rgba(0,0,0,0.22))";

// ─── Inline fasteners ─────────────────────────────────────────────────────────

function Pin({ x, y, color = "#b5685e" }: { x: number; y: number; color?: string }) {
  return (
    <g>
      {/* shaft */}
      <line x1={x} y1={y + 3} x2={x} y2={y + 18} stroke="#3a3733" strokeWidth="1.6" strokeLinecap="round" />
      {/* head */}
      <ellipse cx={x} cy={y - 8} rx="9" ry="8" fill={color} stroke="#3a3733" strokeWidth="1.4" />
      {/* highlight */}
      <ellipse cx={x - 3.5} cy={y - 11} rx="2.5" ry="2" fill="rgba(255,255,255,0.45)" />
      {/* collar */}
      <path d={`M${x - 6},${y} Q${x},${y + 4} ${x + 6},${y}`} fill="none" stroke="#3a3733" strokeWidth="1.2" strokeLinecap="round" />
    </g>
  );
}

function Clip({ x, y, color = "#c9a84c" }: { x: number; y: number; color?: string }) {
  // gem-clip; x,y is the top-left of the clip body
  return (
    <g transform={`translate(${x},${y})`}>
      <path
        d="M 2,32 L 2,9 Q 2,1 7,1 Q 13,1 13,9 L 13,24 Q 13,32 9,32 Q 6,32 6,24 L 6,9 Q 6,5 7,5 Q 9,5 9,9 L 9,24 Q 9,28 11,32"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

function Bow({ x, y, color = "#c9a84c" }: { x: number; y: number; color?: string }) {
  // bow centred at (x,y) with wings extending ~18px out, tails hanging ~18px down
  return (
    <g>
      {/* left wing */}
      <path
        d={`M${x},${y} Q${x - 10},${y - 12} ${x - 18},${y - 7} Q${x - 24},${y - 2} ${x - 16},${y + 7} Q${x - 9},${y + 9} ${x},${y}`}
        fill={color}
        stroke="#3a3733"
        strokeWidth="1.2"
      />
      {/* right wing */}
      <path
        d={`M${x},${y} Q${x + 10},${y - 12} ${x + 18},${y - 7} Q${x + 24},${y - 2} ${x + 16},${y + 7} Q${x + 9},${y + 9} ${x},${y}`}
        fill={color}
        stroke="#3a3733"
        strokeWidth="1.2"
      />
      {/* tails */}
      <path d={`M${x},${y} Q${x - 4},${y + 10} ${x - 6},${y + 18}`} fill="none" stroke="#3a3733" strokeWidth="1.3" strokeLinecap="round" />
      <path d={`M${x},${y} Q${x + 4},${y + 10} ${x + 6},${y + 18}`} fill="none" stroke="#3a3733" strokeWidth="1.3" strokeLinecap="round" />
      {/* centre knot */}
      <ellipse cx={x} cy={y} rx="3.5" ry="2.8" fill={color} stroke="#3a3733" strokeWidth="1.2" />
    </g>
  );
}

// ─── Edge-path helpers ────────────────────────────────────────────────────────
// All paths assume tape body y=20..66 (height=46) and typical x range 10..310.
// Use Q bezier curves so tears read as organic ripped paper rather than zigzags.

/** Gentle organic right-side tear — returns a path segment (no M/H prefix). */
function gentleRightTear() {
  // starts at top-right ~x=300 y=20, ends ~x=304 y=66
  return [
    "Q 308,25 302,31",
    "Q 296,37 306,43",
    "Q 314,49 304,55",
    "Q 296,61 307,66",
  ].join(" ");
}

/** Dramatic right-side tear for TapeZag. */
function dramaticRightTear() {
  return [
    "Q 320,27 306,34",
    "Q 292,41 316,49",
    "Q 330,56 308,63",
    "L 308,66",
  ].join(" ");
}

/** Dramatic left-side tear — from bottom-left going UP to y=20. */
function dramaticLeftTear() {
  // starts at H 12 y=66, goes up to x=12 y=20
  return [
    "L 18,66",
    "Q 4,60 18,53",
    "Q 30,46 8,39",
    "Q 0,32 14,25",
    "L 12,20",
  ].join(" ");
}

/** Moderate left-side tear (TapeStarry left, TapePin crumpled). */
function moderateLeftTear() {
  return [
    "L 18,66",
    "Q 6,60 14,54",
    "Q 22,48 8,42",
    "Q 2,36 14,30",
    "Q 22,25 10,20",
  ].join(" ");
}

// ─── 1. TapeCrease ────────────────────────────────────────────────────────────
// Cream · two fold tabs top-left · gentle right tear · dashed centre · eyelets

export function TapeCrease({ width = 280, color, className }: WashiTapeProps) {
  const h = tapeH(width);
  const fill = color ?? "#f5f0e6";
  const tabFill = color ? "rgba(255,255,255,0.7)" : "#fdfaf2";
  return (
    <svg
      width={width}
      height={h}
      viewBox={`0 0 ${VW} ${VH}`}
      overflow="visible"
      className={cn(className)}
      style={{ filter: FILTER }}
      aria-hidden
    >
      {/* Main body — gentle right tear */}
      <path
        d={`M 10,20 H 300 ${gentleRightTear()} H 10 Z`}
        fill={fill}
      />
      {/* Fold tab 1 — large, clearly visible */}
      <path
        d="M 24,20 Q 32,8 42,4 Q 50,2 56,12 Q 58,16 58,20"
        fill={tabFill}
        stroke="#b8a880"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="24" y1="20" x2="58" y2="20" stroke="#c8b890" strokeWidth="0.8" />
      {/* Fold tab 2 */}
      <path
        d="M 70,20 Q 78,8 88,4 Q 96,2 102,12 Q 104,16 104,20"
        fill={tabFill}
        stroke="#b8a880"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="70" y1="20" x2="104" y2="20" stroke="#c8b890" strokeWidth="0.8" />
      {/* Dashed centre line */}
      <line x1="18" y1="43" x2="290" y2="43" stroke="#c0a880" strokeWidth="1.1" strokeDasharray="6 4" strokeLinecap="round" />
      {/* Eyelets */}
      <circle cx="240" cy="43" r="5" fill="none" stroke="#b0a078" strokeWidth="1.4" />
      <circle cx="266" cy="43" r="5" fill="none" stroke="#b0a078" strokeWidth="1.4" />
      {/* Bottom depth */}
      <path d="M 10,62 H 307 V 66 H 10 Z" fill="rgba(0,0,0,0.05)" />
    </svg>
  );
}

// ─── 2. TapeRibbon ────────────────────────────────────────────────────────────
// Golden yellow · smooth straight edges · ribbon bows at both top corners

export function TapeRibbon({ width = 280, color, className }: WashiTapeProps) {
  const h = tapeH(width);
  const id = useId().replace(/[^a-zA-Z0-9]/g, "r");
  const fill = color ?? `url(#${id}g)`;
  return (
    <svg
      width={width}
      height={h}
      viewBox={`0 0 ${VW} ${VH}`}
      overflow="visible"
      className={cn(className)}
      style={{ filter: FILTER }}
      aria-hidden
    >
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f7e060" />
          <stop offset="50%" stopColor="#f0d060" />
          <stop offset="100%" stopColor="#e4b830" />
        </linearGradient>
      </defs>
      {/* Body */}
      <rect x="10" y="20" width="300" height="46" fill={fill} />
      {/* Bottom depth */}
      <rect x="10" y="60" width="300" height="6" fill="rgba(0,0,0,0.07)" />
      {/* Left bow — large, centred on top-left corner */}
      <Bow x={28} y={20} />
      {/* Right bow */}
      <Bow x={292} y={20} />
    </svg>
  );
}

// ─── 3. TapeGraph ─────────────────────────────────────────────────────────────
// Blue grid · corner fold tabs both ends · right half fades to translucent

export function TapeGraph({ width = 280, color, className }: WashiTapeProps) {
  const h = tapeH(width);
  const id = useId().replace(/[^a-zA-Z0-9]/g, "g");
  const baseFill = color ?? "#cee0f2";
  const tabFill = color ? "rgba(255,255,255,0.7)" : "#e8f2ff";
  return (
    <svg
      width={width}
      height={h}
      viewBox={`0 0 ${VW} ${VH}`}
      overflow="visible"
      className={cn(className)}
      style={{ filter: FILTER }}
      aria-hidden
    >
      <defs>
        <pattern id={`${id}p`} x="0" y="20" width="18" height="18" patternUnits="userSpaceOnUse">
          <path d="M 18,0 L 0,0 0,18" fill="none" stroke="#6898c8" strokeWidth="0.8" />
        </pattern>
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="55%" stopOpacity="0" stopColor="white" />
          <stop offset="100%" stopOpacity="0.7" stopColor="white" />
        </linearGradient>
      </defs>
      {/* Base fill */}
      <rect x="14" y="20" width="292" height="46" fill={baseFill} />
      {/* Grid (only when no custom color) */}
      {!color && <rect x="14" y="20" width="292" height="46" fill={`url(#${id}p)`} />}
      {/* Right-fade */}
      <rect x="14" y="20" width="292" height="46" fill={`url(#${id}f)`} />
      {/* Bottom depth */}
      <rect x="14" y="60" width="292" height="6" fill="rgba(0,0,0,0.05)" />
      {/* Left corner fold tab */}
      <path
        d="M 22,20 Q 30,8 42,4 Q 52,1 58,12 Q 60,16 60,20"
        fill={tabFill}
        stroke="#88b0d0"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line x1="22" y1="20" x2="60" y2="20" stroke="#88b0d0" strokeWidth="0.9" />
      {/* Right corner fold tab */}
      <path
        d="M 260,20 Q 262,16 264,12 Q 270,1 280,4 Q 292,8 298,20"
        fill={tabFill}
        stroke="#88b0d0"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line x1="260" y1="20" x2="298" y2="20" stroke="#88b0d0" strokeWidth="0.9" />
    </svg>
  );
}

// ─── 4. TapePin ───────────────────────────────────────────────────────────────
// Cream · heavily crumpled left edge (large Q curves) · eyelet · brown push-pin

export function TapePin({ width = 280, color, className }: WashiTapeProps) {
  const h = tapeH(width);
  const fill = color ?? "#f5f0e6";
  return (
    <svg
      width={width}
      height={h}
      viewBox={`0 0 ${VW} ${VH}`}
      overflow="visible"
      className={cn(className)}
      style={{ filter: FILTER }}
      aria-hidden
    >
      {/* Body — crumpled left edge (large amplitude Q curves), gentle right edge */}
      <path
        d={`M 10,20 H 300 ${gentleRightTear()} H 18 ${moderateLeftTear()} Z`}
        fill={fill}
      />
      {/* Crumple shadow creases on the left end */}
      <path d="M 16,28 Q 22,32 14,36" stroke="#c0b090" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M 12,38 Q 20,42 12,46" stroke="#c0b090" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.7" />
      {/* Eyelet in body centre-right */}
      <circle cx="218" cy="43" r="5" fill="none" stroke="#b0a078" strokeWidth="1.4" />
      {/* Bottom depth */}
      <path d="M 18,62 H 300 V 66 H 18 Z" fill="rgba(0,0,0,0.05)" />
      {/* Push-pin */}
      <Pin x={26} y={20} color="#b5685e" />
    </svg>
  );
}

// ─── 5. TapeZag ───────────────────────────────────────────────────────────────
// Golden yellow · DRAMATIC torn zigzag on BOTH ends · gold paperclip

export function TapeZag({ width = 280, color, className }: WashiTapeProps) {
  const h = tapeH(width);
  const id = useId().replace(/[^a-zA-Z0-9]/g, "z");
  const fill = color ?? `url(#${id}g)`;
  return (
    <svg
      width={width}
      height={h}
      viewBox={`0 0 ${VW} ${VH}`}
      overflow="visible"
      className={cn(className)}
      style={{ filter: FILTER }}
      aria-hidden
    >
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f5dc50" />
          <stop offset="50%" stopColor="#ecc830" />
          <stop offset="100%" stopColor="#e0b820" />
        </linearGradient>
      </defs>
      {/* Body — dramatic tears both ends */}
      <path
        d={`M 12,20 H 308 ${dramaticRightTear()} H 16 ${dramaticLeftTear()} Z`}
        fill={fill}
      />
      {/* Bottom depth */}
      <path d="M 16,61 H 308 V 66 H 16 Z" fill="rgba(0,0,0,0.08)" />
      {/* Paperclip */}
      <Clip x={10} y={4} color="#c9a84c" />
    </svg>
  );
}

// ─── 6. TapeWorn ──────────────────────────────────────────────────────────────
// Aged tan · dog-ear diagonal fold on left (left edge is a diagonal from y=42 to x=40,y=20)

export function TapeWorn({ width = 280, color, className }: WashiTapeProps) {
  const h = tapeH(width);
  const fill = color ?? "#d4b896";
  const foldShadow = color ? "rgba(0,0,0,0.22)" : "#b89268";
  return (
    <svg
      width={width}
      height={h}
      viewBox={`0 0 ${VW} ${VH}`}
      overflow="visible"
      className={cn(className)}
      style={{ filter: FILTER }}
      aria-hidden
    >
      {/* Dog-ear under-flap (darker — the back of the folded corner) */}
      <path d="M 10,20 L 42,20 L 10,48 Z" fill={foldShadow} opacity="0.75" />
      {/* Main body — diagonal left edge starting at fold point */}
      <path d="M 10,48 Q 26,34 42,20 H 308 V 66 H 10 Z" fill={fill} />
      {/* Subtle fibre grain lines */}
      <path d="M 50,30 Q 160,28 270,30" stroke="rgba(0,0,0,0.07)" strokeWidth="1" fill="none" />
      <path d="M 50,43 Q 170,41 280,43" stroke="rgba(0,0,0,0.06)" strokeWidth="1" fill="none" />
      <path d="M 50,55 Q 150,53 260,55" stroke="rgba(0,0,0,0.07)" strokeWidth="1" fill="none" />
      {/* Bottom depth */}
      <path d="M 10,62 H 308 V 66 H 10 Z" fill="rgba(0,0,0,0.07)" />
    </svg>
  );
}

// ─── 7. TapeStitch ────────────────────────────────────────────────────────────
// Aged cream · small left fold tab · dramatically torn right end · dashed stitch · eyelet

export function TapeStitch({ width = 280, color, className }: WashiTapeProps) {
  const h = tapeH(width);
  const fill = color ?? "#f2ede0";
  const tabFill = color ? "rgba(255,255,255,0.7)" : "#fdfaf2";
  return (
    <svg
      width={width}
      height={h}
      viewBox={`0 0 ${VW} ${VH}`}
      overflow="visible"
      className={cn(className)}
      style={{ filter: FILTER }}
      aria-hidden
    >
      {/* Body — dramatic torn right edge */}
      <path
        d={`M 10,20 H 300 ${dramaticRightTear()} H 10 Z`}
        fill={fill}
      />
      {/* Left fold tab (single, smaller than TapeCrease) */}
      <path
        d="M 20,20 Q 28,9 38,6 Q 46,4 50,14 Q 52,17 52,20"
        fill={tabFill}
        stroke="#b8a880"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <line x1="20" y1="20" x2="52" y2="20" stroke="#c8b890" strokeWidth="0.8" />
      {/* Dashed stitch centre line */}
      <line x1="18" y1="43" x2="290" y2="43" stroke="#a89878" strokeWidth="1.2" strokeDasharray="8 5" strokeLinecap="round" />
      {/* Eyelet — lower left */}
      <circle cx="48" cy="56" r="5" fill="none" stroke="#a89878" strokeWidth="1.4" />
      {/* Bottom depth */}
      <path d="M 10,62 H 308 V 66 H 10 Z" fill="rgba(0,0,0,0.05)" />
    </svg>
  );
}

// ─── 8. TapeStarry ────────────────────────────────────────────────────────────
// Blue gradient · torn both ends · larger sparkle stars · gold paperclip

export function TapeStarry({ width = 280, color, className }: WashiTapeProps) {
  const h = tapeH(width);
  const id = useId().replace(/[^a-zA-Z0-9]/g, "s");
  const fill = color ?? `url(#${id}g)`;

  // 4-pointed sparkle star — helper
  function star(x: number, y: number, s: number) {
    const i = s * 0.22; // inner pinch radius
    return `M${x},${y - s} L${x + i},${y - i} L${x + s},${y} L${x + i},${y + i} L${x},${y + s} L${x - i},${y + i} L${x - s},${y} L${x - i},${y - i} Z`;
  }

  const stars: [number, number, number][] = [
    [54, 32, 7], [106, 48, 5], [158, 28, 8], [210, 50, 5.5], [258, 34, 7], [298, 48, 5],
  ];

  return (
    <svg
      width={width}
      height={h}
      viewBox={`0 0 ${VW} ${VH}`}
      overflow="visible"
      className={cn(className)}
      style={{ filter: FILTER }}
      aria-hidden
    >
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a8c4de" />
          <stop offset="45%" stopColor="#c4def4" />
          <stop offset="100%" stopColor="#9cbcd8" />
        </linearGradient>
      </defs>
      {/* Body — torn both ends */}
      <path
        d={`M 12,20 H 308 ${dramaticRightTear()} H 16 ${moderateLeftTear()} Z`}
        fill={fill}
      />
      {/* Sparkle stars */}
      {stars.map(([x, y, s], i) => (
        <path key={i} d={star(x, y, s)} fill={color ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.92)"} />
      ))}
      {/* Bottom depth */}
      <path d="M 16,61 H 308 V 66 H 16 Z" fill="rgba(0,0,50,0.08)" />
      {/* Paperclip */}
      <Clip x={10} y={4} color="#c9a84c" />
    </svg>
  );
}

// ─── 9. TapeScribble ──────────────────────────────────────────────────────────
// White tape · angled left fold (like a label end) · red scribble lines · green pin top-right

export function TapeScribble({ width = 280, color, className }: WashiTapeProps) {
  const h = tapeH(width);
  const fill = color ?? "#f8f7f5";
  return (
    <svg
      width={width}
      height={h}
      viewBox={`0 0 ${VW} ${VH}`}
      overflow="visible"
      className={cn(className)}
      style={{ filter: FILTER }}
      aria-hidden
    >
      {/* Left under-flap of the fold (slightly darker) */}
      <path d="M 10,20 L 44,20 L 10,50 Z" fill="rgba(0,0,0,0.1)" />
      {/* Main body — diagonal left start from fold point, straight right edge */}
      <path d="M 10,50 Q 28,36 44,20 H 308 V 66 H 10 Z" fill={fill} />
      {/* Crease shadow line at the fold */}
      <line x1="44" y1="20" x2="10" y2="50" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
      {/* Red scribble lines */}
      <path
        d="M 54,52 Q 84,42 114,52 Q 144,62 174,52 Q 204,42 234,52 Q 264,62 294,52"
        fill="none"
        stroke="#c85050"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M 58,60 Q 88,52 118,60 Q 148,66 178,60 Q 208,52 242,60"
        fill="none"
        stroke="#c85050"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeOpacity="0.45"
      />
      {/* Bottom depth */}
      <rect x="44" y="62" width="264" height="4" fill="rgba(0,0,0,0.04)" />
      {/* Green push-pin — top-right */}
      <Pin x={294} y={20} color="#5a8a72" />
    </svg>
  );
}
