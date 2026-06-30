import { useEffect, useRef, useState } from "react";
import { cn } from "@paper-ui/utils";

export interface PaperSheetBorderProps {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  /** Drop-shadow distance in px (0 = none). */
  shadow?: number;
  shadowColor?: string;
  /** Show a bottom-right dog-ear fold (card style). Default false. */
  fold?: boolean;
  className?: string;
}

// All paths live in a 600-unit wide coordinate space.
// Height (H) is computed from the measured element's aspect ratio: H = (h/w)*600.
// This makes the paths scale naturally to any button or card size.
const SVG_W = 600;

function rnd(n: number) {
  return Math.round(n * 10) / 10;
}

/**
 * Main paper outline.
 * Top/bottom use two cubic segments each for a gentle organic wobble.
 * Left/right each use one cubic with control points at 30 % and 60 % of H
 * so they bow slightly inward/outward regardless of aspect ratio.
 */
function makeOutline(H: number, fold: boolean): string {
  const yBot = H - 15;
  if (!fold) {
    return [
      "M 22 18",
      "C 180 11, 360 23, 520 13",
      "C 548 10, 566 17, 578 16",
      `C 586 ${rnd(H * 0.30)}, 574 ${rnd(H * 0.62)}, 580 ${yBot}`,
      `C 430 ${H - 8}, 260 ${H - 21}, 110 ${H - 12}`,
      `C 65 ${H - 8}, 38 ${H - 19}, 20 ${yBot}`,
      `C 14 ${rnd(H * 0.62)}, 26 ${rnd(H * 0.30)}, 22 18 Z`,
    ].join(" ");
  }
  // Fold variant: right edge terminates at yFold, fold triangle below
  const yFold = H - Math.max(40, Math.round(H * 0.11));
  return [
    "M 22 18",
    "C 180 11, 360 23, 520 13",
    "C 548 10, 566 17, 578 16",
    `C 586 ${rnd(H * 0.30)}, 574 ${rnd(H * 0.62)}, 580 ${yFold}`,
    `L 542 ${yBot}`,
    `C 400 ${H - 8}, 240 ${H - 21}, 110 ${H - 12}`,
    `C 65 ${H - 8}, 38 ${H - 19}, 20 ${yBot}`,
    `C 14 ${rnd(H * 0.62)}, 26 ${rnd(H * 0.30)}, 22 18 Z`,
  ].join(" ");
}

/**
 * Secondary sketch line — slightly offset from the main outline, drawn with
 * ~40 % opacity to give the double-outline hand-drawn look.
 */
function makeSecondary(H: number, fold: boolean): string {
  const yBot = H - 17;
  if (!fold) {
    return [
      "M 20 21",
      "C 160 14, 360 26, 530 15",
      "C 555 12, 572 20, 582 18",
      `C 590 ${rnd(H * 0.28)}, 576 ${rnd(H * 0.64)}, 582 ${yBot}`,
      `C 440 ${H - 11}, 260 ${H - 24}, 100 ${H - 15}`,
      `C 58 ${H - 11}, 34 ${H - 22}, 18 ${yBot}`,
      `C 11 ${rnd(H * 0.64)}, 23 ${rnd(H * 0.28)}, 20 21 Z`,
    ].join(" ");
  }
  const yFold = H - Math.max(40, Math.round(H * 0.11));
  return [
    "M 20 21",
    "C 160 14, 360 26, 530 15",
    "C 555 12, 572 20, 582 18",
    `C 590 ${rnd(H * 0.28)}, 576 ${rnd(H * 0.64)}, 582 ${yFold}`,
    `L 540 ${yBot}`,
    `C 420 ${H - 11}, 260 ${H - 24}, 100 ${H - 15}`,
    `C 58 ${H - 11}, 34 ${H - 22}, 18 ${yBot}`,
    `C 11 ${rnd(H * 0.64)}, 23 ${rnd(H * 0.28)}, 20 21 Z`,
  ].join(" ");
}

/**
 * Absolutely-positioned paper-sheet SVG border — the same hand-crafted outline
 * style as `PaperSheetCard` but usable as a drop-in background for any element.
 *
 * Drop it as the first child of any `position: relative` element.
 * The SVG fills 100 % × 100 % of the parent and never affects layout.
 */
export function PaperSheetBorder({
  fill = "#fffdf9",
  stroke = "#3D3D3D",
  strokeWidth = 2,
  shadow = 2,
  shadowColor = "rgba(0,0,0,0.18)",
  fold = false,
  className,
}: PaperSheetBorderProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const host = hostRef.current;
    const parent = host?.parentElement;
    if (!parent) return;
    const ro = new ResizeObserver((entries) => {
      const e = entries[0];
      const box = e.borderBoxSize?.[0];
      setSize({
        w: Math.round(box ? box.inlineSize : e.contentRect.width),
        h: Math.round(box ? box.blockSize  : e.contentRect.height),
      });
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    setSize({ w: Math.round(rect.width), h: Math.round(rect.height) });
    return () => ro.disconnect();
  }, []);

  const { w, h } = size;

  if (w < 4 || h < 4) {
    return (
      <div
        ref={hostRef}
        className={cn("pointer-events-none absolute inset-0", className)}
        aria-hidden
      />
    );
  }

  const svgH = Math.round((h / w) * SVG_W);
  const yFold = svgH - Math.max(40, Math.round(svgH * 0.11));
  const yBot  = svgH - 15;

  return (
    <div
      ref={hostRef}
      className={cn("pointer-events-none absolute inset-0", className)}
      aria-hidden
    >
      <svg
        viewBox={`0 0 ${SVG_W} ${svgH}`}
        width="100%"
        height="100%"
        style={{
          position: "absolute",
          inset: 0,
          overflow: "visible",
          filter: shadow
            ? `drop-shadow(${shadow}px ${Math.round(shadow * 1.5)}px ${shadow * 3}px ${shadowColor})`
            : undefined,
        }}
      >
        {/* Main paper body */}
        <path
          d={makeOutline(svgH, fold)}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Secondary double-outline — the hand-drawn "second pass" look */}
        <path
          d={makeSecondary(svgH, fold)}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth * 0.45}
          strokeOpacity={0.38}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Fold triangle — only when fold=true */}
        {fold && (
          <>
            <polygon
              points={`545,${yFold + 1} 542,${yBot} 580,${yFold}`}
              fill="rgba(0,0,0,0.07)"
            />
            <path
              d={`M 580 ${yFold} L 542 ${yBot} L 542 ${yFold} Z`}
              fill="#F4F4F0"
              stroke={stroke}
              strokeWidth={strokeWidth * 0.75}
              strokeLinejoin="round"
            />
          </>
        )}
      </svg>
    </div>
  );
}
