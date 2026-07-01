import { useEffect, useRef, useState } from "react";
import rough from "roughjs/bin/rough";
import { cn } from "@paper-ui/utils";

export interface SparklineProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
  showDot?: boolean;
  label?: string;
  className?: string;
}

export function Sparkline({
  data,
  color = "#7fa37b",
  width = 120,
  height = 32,
  showDot = false,
  label,
  className,
}: SparklineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [w, setW] = useState(width);

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
    if (!svg || w < 4 || data.length < 2) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const rc = rough.svg(svg);
    const pad = 2;
    const drawW = w - pad * 2;
    const drawH = height - pad * 2;
    const maxY = Math.max(...data, 1);
    const minY = Math.min(...data, 0);

    const n = data.length;
    const stepX = drawW / (n - 1);
    const points: [number, number][] = data.map((v, i) => [
      pad + stepX * i,
      pad + drawH - ((v - minY) / (maxY - minY || 1)) * drawH,
    ]);

    const node = rc.linearPath(points, {
      stroke: color,
      strokeWidth: 1.4,
      fill: "none",
      roughness: 0.7,
      seed: 42,
    });
    svg.appendChild(node);

    if (showDot && data.length > 0) {
      const lastPt = points[points.length - 1];
      const dot = rc.circle(lastPt[0] - 2.5, lastPt[1] - 2.5, 6, {
        stroke: color,
        strokeWidth: 1.2,
        fill: color,
        fillStyle: "solid",
        roughness: 0.5,
        seed: 200,
      });
      svg.appendChild(dot);
    }
  }, [w, data, color, height, showDot]);

  return (
    <div ref={containerRef} className={cn("w-full", className)}>
      <svg ref={svgRef} width={w} height={height} className="overflow-visible" aria-hidden />
      {label && (
        <p className="font-architect text-xs text-center text-muted-foreground mt-1">{label}</p>
      )}
    </div>
  );
}
