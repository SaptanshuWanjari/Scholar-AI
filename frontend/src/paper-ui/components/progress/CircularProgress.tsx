import { useEffect, useRef } from "react";
import rough from "roughjs/bin/rough";
import { cn } from "@/paper-ui/utils";
import { usePaperTheme } from "@/paper-ui/core";

export interface CircularProgressProps {
  /** 0–100. */
  value: number;
  size?: number;
  strokeWidth?: number;
  /** Arc fill color (concrete hex). */
  color?: string;
  /** Small label below the SVG. */
  label?: string;
  className?: string;
}

export function CircularProgress({
  value,
  size = 80,
  strokeWidth = 8,
  color,
  label,
  className,
}: CircularProgressProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const t = usePaperTheme();
  const pct = Math.max(0, Math.min(100, value));
  const baseFontSize = Math.max(12, Math.round(size * 0.22));
  const fontSize = `calc(${baseFontSize}px * ${t.fontScale})`;
  const arcColor = color || t.success;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const rc = rough.svg(svg);
    const cx = size / 2;
    const cy = size / 2;
    const r = (size - strokeWidth * 2) / 2;

    // Track ring (full circle)
    const track = rc.arc(cx, cy, r * 2, r * 2, 0, Math.PI * 2, false, {
      stroke: "rgba(0,0,0,0.10)",
      strokeWidth: strokeWidth - 2,
      roughness: 0.4,
      bowing: 0.2,
    });
    svg.appendChild(track);

    // Fill arc (start at top, clockwise)
    if (pct > 0) {
      const startAngle = -Math.PI / 2;
      const endAngle = startAngle + (pct / 100) * Math.PI * 2 - (pct >= 100 ? 0.01 : 0);
      const fill = rc.arc(cx, cy, r * 2, r * 2, startAngle, endAngle, false, {
        stroke: arcColor,
        strokeWidth,
        roughness: 0.4,
        bowing: 0.2,
        seed: 1,
      });
      svg.appendChild(fill);
    }
  }, [pct, size, strokeWidth, arcColor]);

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg ref={svgRef} width={size} height={size} viewBox={`0 0 ${size} ${size}`} />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="font-caveat font-bold leading-none text-ink" style={{ fontSize }}>
            {Math.round(pct)}%
          </span>
        </div>
      </div>
      {label && <p className="mt-1 font-architect text-xs text-ink-muted">{label}</p>}
    </div>
  );
}
