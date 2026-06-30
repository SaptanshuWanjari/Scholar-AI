import { useEffect, useRef, useState } from "react";
import rough from "roughjs/bin/rough";
import { cn } from "@paper-ui/utils";

export interface SketchBorderProps {
  /** Hand-drawn stroke color. Concrete value only (no CSS var). Default ink. */
  stroke?: string;
  strokeWidth?: number;
  /** Solid fill color for the surface body. Concrete value only (no CSS var).
   *  Omit for a stroke-only outline (inner panels, chips). */
  fill?: string;
  fillStyle?: "solid" | "hachure" | "zigzag" | "cross-hatch";
  fillWeight?: number;
  hachureGap?: number;
  /** 0 = ruler-straight, ~1.2 = pleasant hand wobble. */
  roughness?: number;
  bowing?: number;
  /** Corner radius (px). Spec: 6–8px. */
  radius?: number;
  /** Hard offset shadow distance in px (0 = none). Drawn as drop-shadow on the SVG. */
  shadow?: number;
  shadowColor?: string;
  /** Padding around the drawn rect inside the SVG so stroke/shadow/wobble never clip. */
  bleed?: number;
  /** Stable seed so the stroke doesn't re-jitter on every resize. */
  seed?: number;
  className?: string;
}

let SEED = 1;

/**
 * Absolutely-positioned SVG that draws a rough.js rounded-rectangle — fill AND
 * stroke as one hand-drawn path — sized 1:1 to its positioned parent's border
 * box. Drop it as the first child of any `position: relative` element to give
 * that element a native hand-drawn surface (no CSS rounded-rect underneath).
 */
export function SketchBorder({
  stroke = "#222222",
  strokeWidth = 1.5,
  fill,
  fillStyle = "solid",
  fillWeight = 3,
  hachureGap = 6,
  roughness = 1.1,
  bowing = 1,
  radius = 7,
  shadow = 0,
  shadowColor = "rgba(0,0,0,0.18)",
  bleed = 8,
  seed,
  className,
}: SketchBorderProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const seedRef = useRef(seed ?? SEED++);
  const [size, setSize] = useState({ w: 0, h: 0 });

  // Track the parent element's BORDER box (includes padding) so the drawn
  // surface aligns with the element's outer edge and existing paddings work.
  useEffect(() => {
    const host = hostRef.current;
    const parent = host?.parentElement;
    if (!parent) return;
    const ro = new ResizeObserver((entries) => {
      const e = entries[0];
      const box = e.borderBoxSize && e.borderBoxSize[0];
      const w = box ? box.inlineSize : e.contentRect.width;
      const h = box ? box.blockSize : e.contentRect.height;
      setSize({ w: Math.round(w), h: Math.round(h) });
    });
    ro.observe(parent);
    const r = parent.getBoundingClientRect();
    setSize({ w: Math.round(r.width), h: Math.round(r.height) });
    return () => ro.disconnect();
  }, []);

  // Draw / redraw the rough shape (fill + stroke in one path).
  useEffect(() => {
    const svg = svgRef.current;
    const { w, h } = size;
    if (!svg || w < 2 || h < 2) return;

    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const rc = rough.svg(svg);
    // Rect occupies the parent's box exactly, offset by `bleed` inside the SVG.
    const x = bleed;
    const y = bleed;
    const iw = w;
    const ih = h;
    const r = Math.max(0, Math.min(radius, iw / 2, ih / 2));

    const d =
      `M${x + r},${y} L${x + iw - r},${y} Q${x + iw},${y} ${x + iw},${y + r} ` +
      `L${x + iw},${y + ih - r} Q${x + iw},${y + ih} ${x + iw - r},${y + ih} ` +
      `L${x + r},${y + ih} Q${x},${y + ih} ${x},${y + ih - r} ` +
      `L${x},${y + r} Q${x},${y} ${x + r},${y} Z`;

    // Scale bowing down for wide/tall shapes — at large sizes bowing=1 causes
    // visible drooping in the middle of edges that looks unintentional.
    const effectiveBowing = bowing * Math.min(1, 180 / Math.max(size.w, size.h, 180));

    const node = rc.path(d, {
      stroke,
      strokeWidth,
      roughness,
      bowing: effectiveBowing,
      seed: seedRef.current,
      ...(fill ? { fill, fillStyle, fillWeight, hachureGap } : {}),
    });
    svg.appendChild(node);
  }, [size, stroke, strokeWidth, fill, fillStyle, fillWeight, hachureGap, roughness, bowing, radius, bleed]);

  const W = size.w + bleed * 2;
  const H = size.h + bleed * 2;

  return (
    <div
      ref={hostRef}
      className={cn("pointer-events-none absolute", className)}
      style={{ inset: -bleed }}
      aria-hidden
    >
      <svg
        ref={svgRef}
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="absolute left-0 top-0 overflow-visible"
        style={shadow ? { filter: `drop-shadow(${shadow}px ${shadow}px 0 ${shadowColor})` } : undefined}
      />
    </div>
  );
}

/** Alias: a SketchBorder with a fill reads more naturally as a surface. */
export const SketchSurface = SketchBorder;
