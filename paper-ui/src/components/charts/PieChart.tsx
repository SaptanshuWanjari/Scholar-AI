import { useEffect, useRef, useState } from "react";
import rough from "roughjs/bin/rough";
import { cn } from "@paper-ui/utils";

export interface PieChartProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
  donutHoleSize?: number;
  label?: string;
  className?: string;
}

function describeArc(cx: number, cy: number, radius: number, startAngle: number, endAngle: number): string {
  const x1 = cx + radius * Math.cos(startAngle);
  const y1 = cy + radius * Math.sin(startAngle);
  const x2 = cx + radius * Math.cos(endAngle);
  const y2 = cy + radius * Math.sin(endAngle);
  const large = endAngle - startAngle > Math.PI ? 1 : 0;
  return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2} Z`;
}

function describeDonutArc(
  cx: number, cy: number, outerR: number, innerR: number,
  startAngle: number, endAngle: number
): string {
  const ox1 = cx + outerR * Math.cos(startAngle);
  const oy1 = cy + outerR * Math.sin(startAngle);
  const ox2 = cx + outerR * Math.cos(endAngle);
  const oy2 = cy + outerR * Math.sin(endAngle);
  const ix1 = cx + innerR * Math.cos(startAngle);
  const iy1 = cy + innerR * Math.sin(startAngle);
  const ix2 = cx + innerR * Math.cos(endAngle);
  const iy2 = cy + innerR * Math.sin(endAngle);
  const large = endAngle - startAngle > Math.PI ? 1 : 0;
  return `M ${ox1} ${oy1} A ${outerR} ${outerR} 0 ${large} 1 ${ox2} ${oy2} L ${ix2} ${iy2} A ${innerR} ${innerR} 0 ${large} 0 ${ix1} ${iy1} Z`;
}

export function PieChart({
  data,
  size = 200,
  donutHoleSize = 0,
  label,
  className,
}: PieChartProps) {
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
    if (!svg || w < 4 || data.length === 0) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const rc = rough.svg(svg);
    const cx = w / 2;
    const cy = size / 2;
    const outerR = Math.min(w, size) / 2 - 10;
    const innerR = outerR * donutHoleSize;
    const total = data.reduce((sum, d) => sum + d.value, 0);

    let angle = -Math.PI / 2;
    data.forEach((d, i) => {
      const sliceAngle = (d.value / total) * Math.PI * 2;
      const endAngle = angle + sliceAngle;

      const pathStr = innerR > 0
        ? describeDonutArc(cx, cy, outerR, innerR, angle, endAngle)
        : describeArc(cx, cy, outerR, angle, endAngle);

      const slice = rc.path(pathStr, {
        stroke: d.color,
        strokeWidth: 1.2,
        fill: d.color,
        fillStyle: "hachure",
        roughness: 0.9,
        seed: i + 10,
        fillWeight: 1,
        hachureGap: 5,
      });
      svg.appendChild(slice);

      angle = endAngle;
    });
  }, [w, data, size, donutHoleSize]);

  return (
    <div ref={containerRef} className={cn("w-full", className)}>
      <svg ref={svgRef} width={w} height={size} className="overflow-visible" aria-hidden />
      {label && (
        <p className="font-architect text-xs text-center text-muted-foreground mt-1">{label}</p>
      )}
    </div>
  );
}
