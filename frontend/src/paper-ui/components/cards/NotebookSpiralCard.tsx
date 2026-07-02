import React, { useLayoutEffect, useRef, useState } from "react";
import { usePaperTheme } from "@/paper-ui/core";

export interface NotebookSpiralCardProps {
  title?: string;
  children?: React.ReactNode;
  spiralCount?: number;
  className?: string;
}

const SVG_W = 600;

// Spiral rings translated to TY in SVG coords:
//   wire top  (ring y=−5)  → SVG y=17  — above paper (paper top min ≈ y=24)
//   hole      (ring y=15)  → SVG y=37  — inside paper (paper top max ≈ y=36)
//   wire base (ring y=20)  → SVG y=42  — covered by paper fill
const TY = 22;

function r(n: number) {
  return Math.round(n * 10) / 10;
}

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
 * Notebook card with spiral wire binding — same hand-drawn SVG style as StatsCard.
 * Content-responsive via the same pattern as PaperSheetCard:
 *   • SVG is position:absolute (background only, never affects layout)
 *   • HTML content div is in normal flow → drives outer div height
 *   • useLayoutEffect measures width+height → svgH = (h/w)*600
 *   • Paper paths + fold + ring positions are all parameterised by svgH
 */
export function NotebookSpiralCard({
  title,
  children,
  spiralCount = 10,
  className,
}: NotebookSpiralCardProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [svgH, setSvgH] = useState(0);
  const t = usePaperTheme();

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

  const ringXs = Array.from({ length: spiralCount }, (_, i) =>
    Math.round(60 + i * (480 / Math.max(spiralCount - 1, 1))),
  );

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
      {/* SVG background — absolutely positioned, never participates in layout */}
      {svgH > 80 && (
        <svg
          viewBox={`0 0 ${SVG_W} ${svgH}`}
          width="100%"
          height="100%"
          style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}
          aria-hidden
        >
          {/* ── 1. Wire loops (drawn behind paper body) ────────────────────── */}
          {ringXs.map((cx, i) => (
            <g key={i} transform={`translate(${cx}, ${TY})`}>
              <path
                d="M -3 16 C -4 0, -2 -5, 0 -5 C 2 -5, 4 0, 3 16 C 2 20, -2 20, -3 16 Z"
                fill="none"
                stroke="#2e2e2e"
                strokeWidth="2.4"
                strokeLinejoin="round"
              />
              <path
                d="M -1 15 C -1.5 2, -0.5 -3, 0 -3 C 0.5 -3, 1.5 2, 1 15"
                fill="none"
                stroke="#888"
                strokeWidth="0.9"
                strokeLinecap="round"
              />
            </g>
          ))}

          {/* ── 2. Paper body (covers lower half of wire loops) ────────────── */}
          <path
            d={makePaperPath(svgH)}
            fill={t.surface}
            stroke={t.stroke}
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path
            d={makeSecondaryPath(svgH)}
            fill="none"
            stroke={t.stroke}
            strokeWidth="1"
            strokeOpacity="0.45"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* ── 3. Punched holes drawn on top of paper ─────────────────────── */}
          {ringXs.map((cx, i) => (
            <ellipse key={i} cx={cx} cy={TY + 15} rx="4.5" ry="6" fill="#252525" />
          ))}

          {/* ── 4. Dog-ear fold ────────────────────────────────────────────── */}
          <polygon
            points={`543,${yFold + 1} 540,${yBot} 578,${yFold}`}
            fill="rgba(0,0,0,0.08)"
          />
          <path
            d={`M 578 ${yFold} L 540 ${yBot} L 540 ${yFold} Z`}
            fill={t.panel}
            stroke={t.stroke}
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      )}

      {/* HTML content — in normal flow; height drives svgH via ResizeObserver.
          paddingTop 12%: clears spiral ring bottom (~7% of W) + breathing room.
          paddingBottom 13%: clears fold area (~10% of W) + breathing room.      */}
      <div style={{ position: "relative", zIndex: 1, padding: "12% 10% 13%" }}>
        {title && (
          <p
            style={{
              fontFamily: "'Architects Daughter', cursive",
              fontSize: "1.2rem",
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
