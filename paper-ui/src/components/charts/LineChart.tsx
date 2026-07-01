import { useEffect, useRef, useState } from "react";
import rough from "roughjs/bin/rough";
import { cn } from "@paper-ui/utils";

export interface LineChartProps {
  data: { x: number | string; y: number }[];
  color?: string;
  strokeWidth?: number;
  width?: number;
  height?: number;
  showDots?: boolean;
  showGrid?: boolean;
  label?: string;
  className?: string;
}

export function LineChart({
  data,
  color = "#7fa37b",
  strokeWidth = 1.8,
  width = 300,
  height = 200,
  showDots = false,
  showGrid = false,
  label,
  className,
}: LineChartProps) {
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
    if (!svg || w < 4 || data.length === 0) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const rc = rough.svg(svg);
    const pad = { top: 20, right: 20, bottom: 30, left: 40 };
    const drawW = w - pad.left - pad.right;
    const drawH = height - pad.top - pad.bottom;
    const maxY = Math.max(...data.map((d) => d.y), 1);
    const minY = Math.min(...data.map((d) => d.y), 0);

    if (showGrid) {
      const gridLines = 4;
      for (let i = 0; i <= gridLines; i++) {
        const y = pad.top + (drawH / gridLines) * i;
        const gridNode = rc.line(pad.left, y, w - pad.right, y, {
          stroke: "#d4c5a9",
          strokeWidth: 0.5,
          roughness: 0.4,
          seed: i + 100,
        });
        svg.appendChild(gridNode);
      }
    }

    if (data.length >= 2) {
      const points: [number, number][] = data.map((d, i) => [
        pad.left + (drawW / (data.length - 1)) * i,
        pad.top + drawH - ((d.y - minY) / (maxY - minY || 1)) * drawH,
      ]);
      const lineNode = rc.linearPath(points, {
        stroke: color,
        strokeWidth,
        fill: "none",
        roughness: 0.9,
        seed: 42,
      });
      svg.appendChild(lineNode);
    }

    if (showDots) {
      data.forEach((d, i) => {
        const cx = pad.left + (drawW / (data.length - 1)) * i;
        const cy = pad.top + drawH - ((d.y - minY) / (maxY - minY || 1)) * drawH;
        const dot = rc.circle(cx - 2, cy - 2, 5, {
          stroke: color,
          strokeWidth: 1.2,
          fill: "#f4f1ea",
          fillStyle: "solid",
          roughness: 0.6,
          seed: i + 200,
        });
        svg.appendChild(dot);
      });
    }
  }, [w, data, color, strokeWidth, height, showDots, showGrid]);

  return (
    <div ref={containerRef} className={cn("w-full", className)}>
      <svg ref={svgRef} width={w} height={height} className="overflow-visible" aria-hidden />
      {label && (
        <p className="font-architect text-xs text-center text-muted-foreground mt-1">{label}</p>
      )}
    </div>
  );
}
