import { useEffect, useRef, useState } from "react";
import rough from "roughjs/bin/rough";
import { cn } from "@paper-ui/utils";

export interface BarChartProps {
  data: { label: string; value: number }[];
  color?: string;
  width?: number;
  height?: number;
  horizontal?: boolean;
  label?: string;
  className?: string;
}

export function BarChart({
  data,
  color = "#7fa37b",
  width = 300,
  height = 200,
  horizontal = false,
  label,
  className,
}: BarChartProps) {
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
    const maxVal = Math.max(...data.map((d) => d.value), 1);

    if (horizontal) {
      const pad = { top: 10, right: 20, bottom: 10, left: 40 };
      const drawH = height - pad.top - pad.bottom;
      const barH = Math.max(4, (drawH - 8 * (data.length - 1)) / data.length);
      const maxBarW = w - pad.left - pad.right;

      data.forEach((d, i) => {
        const barW = Math.max(4, (d.value / maxVal) * maxBarW);
        const y = pad.top + i * (barH + 8);
        const barNode = rc.rectangle(pad.left, y, barW, barH, {
          stroke: color,
          strokeWidth: 1.2,
          fill: color,
          fillStyle: "solid",
          roughness: 0.8,
          seed: i + 1,
        });
        svg.appendChild(barNode);
      });
    } else {
      const pad = { top: 10, right: 20, bottom: 30, left: 10 };
      const drawW = w - pad.left - pad.right;
      const drawH = height - pad.top - pad.bottom;
      const barW = Math.max(4, (drawW - 8 * (data.length - 1)) / data.length);

      data.forEach((d, i) => {
        const barH = Math.max(2, (d.value / maxVal) * drawH);
        const x = pad.left + i * (barW + 8);
        const y = pad.top + drawH - barH;
        const barNode = rc.rectangle(x, y, barW, barH, {
          stroke: color,
          strokeWidth: 1.2,
          fill: color,
          fillStyle: "solid",
          roughness: 0.8,
          seed: i + 1,
        });
        svg.appendChild(barNode);
      });
    }
  }, [w, data, color, height, horizontal]);

  return (
    <div ref={containerRef} className={cn("w-full", className)}>
      <svg ref={svgRef} width={w} height={height} className="overflow-visible" aria-hidden />
      {label && (
        <p className="font-architect text-xs text-center text-muted-foreground mt-1">{label}</p>
      )}
    </div>
  );
}
