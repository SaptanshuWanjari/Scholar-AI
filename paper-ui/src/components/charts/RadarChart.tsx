import { useEffect, useRef, useState } from "react";
import rough from "roughjs/bin/rough";
import { cn } from "@paper-ui/utils";

export interface RadarChartProps {
  data: { axis: string; value: number }[];
  maxValue?: number;
  size?: number;
  color?: string;
  fillColor?: string;
  label?: string;
  className?: string;
}

function polarToCart(cx: number, cy: number, r: number, angle: number): [number, number] {
  return [cx + r * Math.cos(angle - Math.PI / 2), cy + r * Math.sin(angle - Math.PI / 2)];
}

export function RadarChart({
  data,
  maxValue: maxValProp,
  size = 220,
  color = "#7fa37b",
  fillColor = "#b6d7a8",
  label,
  className,
}: RadarChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [w, setW] = useState(size);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver((entries) => {
      const e = entries[0];
      const box = e.borderBoxSize?.[0];
      setW(Math.round(box ? box.inlineSize : e.contentRect.width));
    });
    ro.observe(container);
    setW(Math.round(container.getBoundingClientRect().width));
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || w < 4 || data.length < 3) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const rc = rough.svg(svg);
    const cx = w / 2;
    const cy = size / 2;
    const radius = Math.min(w, size) / 2 - 30;
    const n = data.length;
    const maxVal = maxValProp ?? Math.max(...data.map((d) => d.value), 1);
    const angleStep = (Math.PI * 2) / n;

    for (let level = 1; level <= 4; level++) {
      const r = (radius / 4) * level;
      const gridPoints: [number, number][] = [];
      for (let i = 0; i <= n; i++) {
        const a = angleStep * i;
        const pt = polarToCart(cx, cy, r, a);
        gridPoints.push(pt);
      }
      const gridNode = rc.linearPath(gridPoints, {
        stroke: "#d4c5a9",
        strokeWidth: 0.6,
        fill: "none",
        roughness: 0.5,
        seed: level + 50,
      });
      svg.appendChild(gridNode);
    }

    for (let i = 0; i < n; i++) {
      const a = angleStep * i;
      const end = polarToCart(cx, cy, radius, a);
      const axisNode = rc.line(cx, cy, end[0], end[1], {
        stroke: "#c4b99a",
        strokeWidth: 0.6,
        roughness: 0.4,
        seed: i + 80,
      });
      svg.appendChild(axisNode);
    }

    const dataPoints: [number, number][] = data.map((d, i) => {
      const r = (d.value / maxVal) * radius;
      return polarToCart(cx, cy, r, angleStep * i);
    });
    dataPoints.push(dataPoints[0]);

    const dataNode = rc.linearPath(dataPoints, {
      stroke: color,
      strokeWidth: 1.6,
      fill: fillColor,
      fillStyle: "hachure",
      roughness: 0.8,
      seed: 42,
      fillWeight: 1,
      hachureGap: 4,
    });
    svg.appendChild(dataNode);
  }, [w, data, size, color, fillColor, maxValProp]);

  return (
    <div ref={containerRef} className={cn("w-full", className)}>
      <svg ref={svgRef} width={w} height={size} className="overflow-visible" aria-hidden />
      {label && (
        <p className="font-architect text-xs text-center text-muted-foreground mt-1">{label}</p>
      )}
    </div>
  );
}
