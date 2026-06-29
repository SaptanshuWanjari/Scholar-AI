import { useEffect, useRef, useState } from "react";
import rough from "roughjs/bin/rough";
import { cn } from "../../ui/utils";

export type MiniChartVariant = "bar" | "line";

export interface MiniChartProps {
  data: number[];
  variant?: MiniChartVariant;
  color?: string;
  height?: number;
  label?: string;
  className?: string;
}

export function MiniChart({
  data,
  variant = "bar",
  color = "#7fa37b",
  height = 48,
  label,
  className,
}: MiniChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver((entries) => {
      const e = entries[0];
      const box = e.borderBoxSize?.[0];
      setWidth(Math.round(box ? box.inlineSize : e.contentRect.width));
    });
    ro.observe(container);
    setWidth(Math.round(container.getBoundingClientRect().width));
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || width < 4 || data.length === 0) return;

    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const rc = rough.svg(svg);
    const max = Math.max(...data, 1);
    const pad = 4;
    const drawH = height - pad * 2;

    if (variant === "bar") {
      const n = data.length;
      const totalGap = pad * (n + 1);
      const barW = Math.max(2, (width - totalGap) / n);
      data.forEach((v, i) => {
        const barH = Math.max(2, (v / max) * drawH);
        const x = pad + i * (barW + pad);
        const y = pad + drawH - barH;
        const node = rc.rectangle(x, y, barW, barH, {
          stroke: color,
          strokeWidth: 1.2,
          fill: color,
          fillStyle: "solid",
          roughness: 0.9,
          seed: i + 1,
        });
        svg.appendChild(node);
      });
    } else {
      if (data.length < 2) return;
      const n = data.length;
      const stepX = (width - pad * 2) / (n - 1);
      const points: [number, number][] = data.map((v, i) => [
        pad + i * stepX,
        pad + drawH - (v / max) * drawH,
      ]);
      const node = rc.linearPath(points, {
        stroke: color,
        strokeWidth: 1.6,
        fill: "none",
        roughness: 0.8,
        seed: 42,
      });
      svg.appendChild(node);
    }
  }, [width, data, variant, color, height]);

  return (
    <div ref={containerRef} className={cn("w-full", className)}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="overflow-visible"
        aria-hidden
      />
      {label && (
        <p className="font-architect text-xs text-center text-muted-foreground mt-1">{label}</p>
      )}
    </div>
  );
}
