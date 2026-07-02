import React, { useLayoutEffect, useRef, useState } from "react";
import { usePaperTheme } from "@/paper-ui/core";

export interface PaperSheetCardProps {
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

// Fixed SVG coordinate width — height is computed from the measured outer div.
const SVG_W = 600;

function r(n: number) {
  return Math.round(n * 10) / 10;
}

/**
 * Main paper body path parameterised by H (total SVG height).
 * y fractions derived from the original 530-unit StatsCard layout.
 */
function makePaperPath(H: number): string {
  const yFold = Math.round(H * 0.84);
  const yBot  = Math.round(H * 0.96);
  return [
    "M 22 31",
    "C 150 26, 250 36, 350 30",
    "C 450 24, 520 35, 578 31",
    `C 584 ${r(H * 0.226)}, 572 ${r(H * 0.377)}, 579 ${r(H * 0.528)}`,
    `C 585 ${r(H * 0.679)}, 573 ${r(H * 0.792)}, 578 ${yFold}`,
    `L 540 ${yBot}`,
    `C 420 ${H - 25}, 300 ${H - 13}, 200 ${H - 20}`,
    `C 100 ${H - 26}, 50 ${H - 15}, 21 ${yBot}`,
    `C 15 ${r(H * 0.754)}, 28 ${r(H * 0.528)}, 20 ${r(H * 0.340)}`,
    `C 14 ${r(H * 0.189)}, 26 ${r(H * 0.094)}, 22 31 Z`,
  ].join(" ");
}

/** Secondary double-outline sketch path (same fractions). */
function makeSecondaryPath(H: number): string {
  const yFold = Math.round(H * 0.842);
  const yBot  = Math.round(H * 0.958);
  return [
    "M 20 33",
    "C 120 37, 250 25, 350 32",
    "C 450 38, 530 26, 579 32",
    `C 575 ${r(H * 0.245)}, 585 ${r(H * 0.415)}, 577 ${r(H * 0.566)}`,
    `C 572 ${r(H * 0.717)}, 583 ${r(H * 0.830)}, 578 ${yFold}`,
    `L 539 ${yBot}`,
    `C 400 ${H - 14}, 250 ${H - 26}, 150 ${H - 19}`,
    `C 80 ${H - 15}, 40 ${H - 24}, 20 ${yBot}`,
    `C 26 ${r(H * 0.717)}, 14 ${r(H * 0.472)}, 21 ${r(H * 0.283)}`,
    `C 25 ${r(H * 0.151)}, 17 ${r(H * 0.075)}, 20 33 Z`,
  ].join(" ");
}

/**
 * General-purpose SVG paper card — same hand-drawn style as StatsCard.
 *
 * How it's responsive to content:
 *   • The SVG is `position: absolute; inset: 0` so it never participates in flow.
 *   • The HTML content div IS in flow and determines the outer div's height.
 *   • useLayoutEffect measures width + height → computes svgH = (h/w)*600.
 *   • The paper body, fold, and secondary-outline paths are all parameterised by svgH.
 *   • Result: the hand-drawn paper always fits the content exactly, no matter the height.
 */
export function PaperSheetCard({ title, children, className }: PaperSheetCardProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [svgH, setSvgH] = useState(0);
  const t = usePaperTheme();

  // useLayoutEffect: fires before browser paint → no flash on first render.
  useLayoutEffect(() => {
    const el = outerRef.current;
    if (!el) return;

    const update = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width > 0 && height > 0) {
        setSvgH(Math.round((height / width) * SVG_W));
      }
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const yFold = Math.round(svgH * 0.84);
  const yBot  = Math.round(svgH * 0.96);

  return (
    <div
      ref={outerRef}
      className={className}
      style={{
        position: "relative",
        overflow: "visible",
        filter: "drop-shadow(3px 8px 12px rgba(0,0,0,0.28))",
      }}
    >
      {/* SVG background — absolutely fills the outer div, never affects layout */}
      {svgH > 80 && (
        <svg
          viewBox={`0 0 ${SVG_W} ${svgH}`}
          width="100%"
          height="100%"
          style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}
          aria-hidden
        >
          {/* Main paper body */}
          <path
            d={makePaperPath(svgH)}
            fill={t.surface}
            stroke={t.stroke}
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {/* Secondary sketch line — hand-drawn double-outline */}
          <path
            d={makeSecondaryPath(svgH)}
            fill="none"
            stroke={t.stroke}
            strokeWidth="1"
            strokeOpacity="0.45"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {/* Fold shadow */}
          <polygon
            points={`543,${yFold + 1} 540,${yBot} 578,${yFold}`}
            fill="rgba(0,0,0,0.08)"
          />
          {/* Folded flap */}
          <path
            d={`M 578 ${yFold} L 540 ${yBot} L 540 ${yFold} Z`}
            fill={t.panel}
            stroke={t.stroke}
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      )}

      {/* Content — in normal flow; its height drives the outer div and therefore svgH.
          Padding keeps content within the paper body at all container widths:
            horizontal 10% ≈ paper edge (3.7%) + internal margin
            top 7%         ≈ paper top wobble (~5%) + breathing room
            bottom 13%     ≈ fold area (~10%) + breathing room               */}
      <div style={{ position: "relative", zIndex: 1, padding: "7% 10% 13%" }}>
        {title && (
          <p
            style={{
              fontFamily: "'Architects Daughter', cursive",
              fontSize: "clamp(0.93rem, 2.5%, 1.33rem)",
              fontWeight: "bold",
              letterSpacing: "2px",
              color: t.ink,
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            {title}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
