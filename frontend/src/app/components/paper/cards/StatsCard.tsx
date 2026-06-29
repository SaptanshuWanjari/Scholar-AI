import React, { useLayoutEffect, useRef, useState } from "react";
import { PaperIconCircle, type IconTone } from "../foundation/PaperIconCircle";

export interface StatsCardStat {
  icon: React.ReactNode;
  tone: IconTone;
  label: string;
  sublabel?: string;
  value: React.ReactNode;
}

export interface StatsCardProps {
  title: string;
  stats: StatsCardStat[];
  className?: string;
}

const SVG_W = 600;

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

/** Notebook-paper stats card — same dynamic SVG sizing as PaperSheetCard. */
export function StatsCard({ title, stats, className }: StatsCardProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [svgH, setSvgH] = useState(0);

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
      {/* SVG background — absolutely positioned, never participates in layout */}
      {svgH > 80 && (
        <svg
          viewBox={`0 0 ${SVG_W} ${svgH}`}
          width="100%"
          height="100%"
          style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}
          aria-hidden
        >
          <path
            d={makePaperPath(svgH)}
            fill="#FDFDF9"
            stroke="#3D3D3D"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path
            d={makeSecondaryPath(svgH)}
            fill="none"
            stroke="#3D3D3D"
            strokeWidth="1"
            strokeOpacity="0.45"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <polygon
            points={`543,${yFold + 1} 540,${yBot} 578,${yFold}`}
            fill="rgba(0,0,0,0.08)"
          />
          <path
            d={`M 578 ${yFold} L 540 ${yBot} L 540 ${yFold} Z`}
            fill="#F4F4F0"
            stroke="#3D3D3D"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      )}

      {/* HTML content — in normal flow; height drives svgH via ResizeObserver */}
      <div style={{ position: "relative", zIndex: 1, padding: "7% 10% 13%" }}>
        {/* Title */}
        <p
          style={{
            fontFamily: "'Architects Daughter', cursive",
            fontSize: "18px",
            fontWeight: "bold",
            letterSpacing: "2px",
            color: "#2c2c2c",
            textTransform: "uppercase",
            marginBottom: "4px",
          }}
        >
          {title}
        </p>
        {/* Rule under title */}
        <div
          style={{
            borderBottom: "1.5px dashed #d4d4d4",
            marginBottom: "8px",
          }}
        />

        {/* Stat rows */}
        {stats.map((stat, i) => (
          <div key={stat.label}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "10px 0" }}>
              <PaperIconCircle tone={stat.tone} size={40}>
                {stat.icon}
              </PaperIconCircle>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontFamily: "'Kalam', cursive",
                    fontSize: "20px",
                    fontWeight: 600,
                    color: "#2d2d2d",
                    lineHeight: 1.2,
                    margin: 0,
                  }}
                >
                  {stat.label}
                </p>
                {stat.sublabel && (
                  <p
                    style={{
                      fontFamily: "'Kalam', cursive",
                      fontSize: "15px",
                      color: "#555",
                      margin: 0,
                    }}
                  >
                    {stat.sublabel}
                  </p>
                )}
              </div>
              <span
                style={{
                  fontFamily: "'Caveat', cursive",
                  fontSize: "30px",
                  fontWeight: 700,
                  color: "#2d2d2d",
                  flexShrink: 0,
                }}
              >
                {stat.value}
              </span>
            </div>
            {i < stats.length - 1 && (
              <div style={{ borderBottom: "1.5px dashed #d4d4d4" }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
