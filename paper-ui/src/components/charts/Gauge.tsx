import { useEffect, useRef, useState } from "react";
import rough from "roughjs/bin/rough";
import { cn } from "@paper-ui/utils";

export interface GaugeProps {
  value: number;
  min?: number;
  max?: number;
  size?: number;
  color?: string;
  label?: string;
  className?: string;
}

export function Gauge({
  value,
  min = 0,
  max = 100,
  size = 160,
  color = "#7fa37b",
  label,
  className,
}: GaugeProps) {
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
    if (!svg || w < 4) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const rc = rough.svg(svg);
    const cx = w / 2;
    const cy = size * 0.7;
    const radius = Math.min(w, size * 1.2) / 2 - 5;
    const strokeW = 12;
    const innerR = radius - strokeW;

    const startAngle = Math.PI * 0.75;
    const endAngle = Math.PI * 2.25;
    const totalAngle = endAngle - startAngle;
    const ratio = Math.max(0, Math.min(1, (value - min) / (max - min)));
    const fillAngle = startAngle + totalAngle * ratio;

    const bgPathSegments = 40;
    for (let i = 0; i < bgPathSegments; i++) {
      const a1 = startAngle + (totalAngle / bgPathSegments) * i;
      const a2 = startAngle + (totalAngle / bgPathSegments) * (i + 0.5);
      const x1 = cx + innerR * Math.cos(a1);
      const y1 = cy + innerR * Math.sin(a1);
      const x2 = cx + innerR * Math.cos(a2);
      const y2 = cy + innerR * Math.sin(a2);
      const seg = rc.line(x1, y1, x2, y2, {
        stroke: "#d4c5a9",
        strokeWidth: strokeW * 0.8,
        roughness: 0.7,
        seed: i + 300,
      });
      svg.appendChild(seg);
    }

    const fillSegments = Math.ceil(bgPathSegments * ratio);
    for (let i = 0; i < fillSegments; i++) {
      const a1 = startAngle + (totalAngle / bgPathSegments) * i;
      const a2 = startAngle + (totalAngle / bgPathSegments) * (i + 0.5);
      const x1 = cx + innerR * Math.cos(a1);
      const y1 = cy + innerR * Math.sin(a1);
      const x2 = cx + innerR * Math.cos(a2);
      const y2 = cy + innerR * Math.sin(a2);
      const seg = rc.line(x1, y1, x2, y2, {
        stroke: color,
        strokeWidth: strokeW * 0.8,
        roughness: 0.7,
        seed: i + 400,
      });
      svg.appendChild(seg);
    }

    const needleAngle = fillAngle;
    const needleLen = innerR * 0.85;
    const nx = cx + needleLen * Math.cos(needleAngle);
    const ny = cy + needleLen * Math.sin(needleAngle);
    const needleNode = rc.line(cx, cy, nx, ny, {
      stroke: "#c95f5f",
      strokeWidth: 2,
      roughness: 0.5,
      seed: 99,
    });
    svg.appendChild(needleNode);

    const pivotNode = rc.circle(cx - 3, cy - 3, 7, {
      stroke: "#c95f5f",
      strokeWidth: 1.5,
      fill: "#f4f1ea",
      fillStyle: "solid",
      roughness: 0.4,
      seed: 101,
    });
    svg.appendChild(pivotNode);
  }, [w, value, min, max, size, color]);

  return (
    <div ref={containerRef} className={cn("w-full relative", className)}>
      <svg ref={svgRef} width={w} height={size} className="overflow-visible" aria-hidden />
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 font-kalam text-sm">
        {value}
      </div>
      {label && (
        <p className="font-architect text-xs text-center text-muted-foreground mt-1">{label}</p>
      )}
    </div>
  );
}
