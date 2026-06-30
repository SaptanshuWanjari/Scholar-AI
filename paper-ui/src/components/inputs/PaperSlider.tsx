import React, { useCallback, useEffect, useRef, useState } from "react";
import rough from "roughjs/bin/rough";
import { cn } from "@paper-ui/utils";

const THUMB_D = 16;
const SVG_H = 28;
const TRACK_Y = SVG_H / 2;
const SEED = 501;

// Horizontal padding so the thumb circle never clips at the edges.
const H_BLEED = THUMB_D / 2 + 3;

interface SliderSvgProps {
  pct: number; // 0–1 fraction of range
  focused: boolean;
  disabled?: boolean;
  width: number;
}

function SliderSvg({ pct, focused, disabled, width }: SliderSvgProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || width < 2) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const rc = rough.svg(svg);
    const trackLeft = H_BLEED;
    const trackRight = width - H_BLEED;
    const thumbX = trackLeft + pct * (trackRight - trackLeft);

    // Background track
    svg.appendChild(
      rc.line(trackLeft, TRACK_Y, trackRight, TRACK_Y, {
        stroke: "#d4cfc2",
        strokeWidth: 2.5,
        roughness: 1.4,
        seed: SEED,
      }),
    );

    // Filled track (left of thumb)
    if (thumbX > trackLeft + 1) {
      svg.appendChild(
        rc.line(trackLeft, TRACK_Y, thumbX, TRACK_Y, {
          stroke: disabled ? "#a09890" : "#262320",
          strokeWidth: 2.5,
          roughness: 1.2,
          seed: SEED + 1,
        }),
      );
    }

    // Thumb circle
    svg.appendChild(
      rc.circle(thumbX, TRACK_Y, THUMB_D, {
        fill: disabled ? "#b4ad9e" : "#262320",
        fillStyle: "solid",
        stroke: disabled ? "#a09890" : focused ? "#262320" : "#3a3733",
        strokeWidth: focused ? 2 : 1.6,
        roughness: 0.8,
        seed: SEED + 2,
      }),
    );
  }, [pct, focused, disabled, width]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={SVG_H}
      viewBox={`0 0 ${width} ${SVG_H}`}
      className="pointer-events-none"
      aria-hidden
    />
  );
}

// ─── PaperSlider ──────────────────────────────────────────────────────────────

export interface PaperSliderProps {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  formatValue?: (v: number) => string;
  disabled?: boolean;
  id?: string;
  name?: string;
  className?: string;
  wrapperClassName?: string;
}

export function PaperSlider({
  value,
  defaultValue = 0,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = false,
  formatValue,
  disabled,
  id,
  name,
  className,
  wrapperClassName,
}: PaperSliderProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const current = isControlled ? (value as number) : internal;

  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  const generatedId = React.useId();
  const inputId = id ?? generatedId;

  // Track container width via ResizeObserver
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const box = entry.borderBoxSize?.[0];
      const w = box ? box.inlineSize : entry.contentRect.width;
      setWidth(Math.round(w));
    });
    ro.observe(el);
    setWidth(Math.round(el.getBoundingClientRect().width));
    return () => ro.disconnect();
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = Number(e.target.value);
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  const pct = max > min ? (current - min) / (max - min) : 0;
  const displayValue = formatValue ? formatValue(current) : String(current);

  return (
    <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <label htmlFor={inputId} className="font-architect text-[13px] text-ink-muted">
              {label}
            </label>
          )}
          {showValue && (
            <span className="font-architect text-[13px] text-ink">
              {displayValue}
            </span>
          )}
        </div>
      )}
      <div
        ref={containerRef}
        className={cn("relative", disabled && "opacity-50", className)}
      >
        {width > 0 && (
          <SliderSvg pct={pct} focused={focused} disabled={disabled} width={width} />
        )}
        <input
          type="range"
          id={inputId}
          name={name}
          min={min}
          max={max}
          step={step}
          value={current}
          onChange={handleChange}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={current}
          aria-valuetext={displayValue}
        />
      </div>
    </div>
  );
}
