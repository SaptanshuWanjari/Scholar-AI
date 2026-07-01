import { useEffect, useRef, useState } from "react";
import rough from "roughjs/bin/rough";
import { cn } from "@paper-ui/utils";

export interface AreaChartProps {
  data: { x: number | string; y: number }[];
  color?: string;
  fillColor?: string;
  width?: number;
  height?: number;
  showGrid?: boolean;
  label?: string;
  className?: string;
}

export function AreaChart({
  data,
  color = "#7fa37b",
  fillColor = "#b6d7a8",
  width = 300,
  height = 200,
  showGrid = false,
  label,
  className,
}: AreaChartProps) {
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
    const pad = { top: 20, right: 20, bottom: 30, left: 40 };
    const drawW = w - pad.left - pad.right;
    const drawH = height - pad.top - pad.bottom;
    const maxY = Math.max(...data.map((d) => d.y), 1);
    const minY = 0;
    const bottomY = pad.top + drawH;

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

    const points: [number, number][] = data.map((d, i) => [
      pad.left + (drawW / (data.length - 1)) * i,
      pad.top + drawH - ((d.y - minY) / (maxY - minY || 1)) * drawH,
    ]);

    const lineNode = rc.linearPath(points, {
      stroke: color,
      strokeWidth: 1.6,
      fill: "none",
      roughness: 0.9,
      seed: 42,
    });
    svg.appendChild(lineNode);

    const areaPoints: [number, number][] = [
      [pad.left, bottomY],
      ...points,
      [pad.left + drawW, bottomY],
    ];
    const areaNode = rc.linearPath(areaPoints, {
      stroke: "none",
      fill: fillColor,
      fillStyle: "hachure",
      roughness: 0.8,
      seed: 43,
      fillWeight: 1.2,
      hachureGap: 4,
    });
    svg.appendChild(areaNode);
  }, [w, data, color, fillColor, height, showGrid]);

  return (
    <div ref={containerRef} className={cn("w-full", className)}>
      <svg ref={svgRef} width={w} height={height} className="overflow-visible" aria-hidden />
      {label && (
        <p className="font-architect text-xs text-center text-muted-foreground mt-1">{label}</p>
      )}
    </div>
  );
}
