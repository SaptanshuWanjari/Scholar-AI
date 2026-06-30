import React, { useEffect, useRef } from "react";
import rough from "roughjs/bin/rough";
import { cn } from "@paper-ui/utils";

const TRACK_W = 42;
const TRACK_H = 24;
const KNOB_D = 16;
const BLEED = 6;
const SEED = 301;

interface SwitchSvgProps {
  checked: boolean;
  focused: boolean;
  disabled?: boolean;
}

function buildPillPath(x: number, y: number, w: number, h: number): string {
  const r = h / 2;
  return (
    `M${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} ` +
    `Q${x + w},${y + h} ${x + w - r},${y + h} ` +
    `L${x + r},${y + h} Q${x},${y + h} ${x},${y + r} ` +
    `Q${x},${y} ${x + r},${y} Z`
  );
}

function SwitchSvg({ checked, focused, disabled }: SwitchSvgProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const W = TRACK_W + BLEED * 2;
  const H = TRACK_H + BLEED * 2;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const rc = rough.svg(svg);

    // Track fill
    const trackFill = disabled
      ? "#d4cfc2"
      : checked
        ? "#262320"
        : "#fffdf9";
    const trackStroke = disabled
      ? "#c4bdb0"
      : checked
        ? "#262320"
        : focused
          ? "#262320"
          : "#b4ad9e";

    const pillPath = buildPillPath(BLEED, BLEED, TRACK_W, TRACK_H);

    svg.appendChild(
      rc.path(pillPath, {
        fill: trackFill,
        fillStyle: "solid",
        stroke: trackStroke,
        strokeWidth: 1.6,
        roughness: 1.0,
        seed: SEED,
      }),
    );

    // Knob circle
    const cx = checked
      ? BLEED + TRACK_W - TRACK_H / 2
      : BLEED + TRACK_H / 2;
    const cy = BLEED + TRACK_H / 2;
    const knobFill = disabled ? "#b4ad9e" : checked ? "#fffdf9" : "#c4bdb0";
    const knobStroke = disabled ? "#a09890" : checked ? "#fffdf9" : "#9a9287";

    svg.appendChild(
      rc.circle(cx, cy, KNOB_D, {
        fill: knobFill,
        fillStyle: "solid",
        stroke: knobStroke,
        strokeWidth: 1.2,
        roughness: 0.8,
        seed: SEED + 1,
      }),
    );
  }, [checked, focused, disabled]);

  return (
    <svg
      ref={svgRef}
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      className="pointer-events-none shrink-0"
      aria-hidden
    />
  );
}

// ─── PaperSwitch ──────────────────────────────────────────────────────────────

export interface PaperSwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: string;
  labelPosition?: "left" | "right";
  disabled?: boolean;
  id?: string;
  name?: string;
  className?: string;
}

export function PaperSwitch({
  checked,
  defaultChecked,
  onChange,
  label,
  description,
  labelPosition = "right",
  disabled,
  id,
  name,
  className,
}: PaperSwitchProps) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState(defaultChecked ?? false);
  const [focused, setFocused] = React.useState(false);
  const isChecked = isControlled ? (checked as boolean) : internal;

  const generatedId = React.useId();
  const inputId = id ?? generatedId;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInternal(e.target.checked);
    onChange?.(e.target.checked);
  };

  const labelEl = (label || description) && (
    <div className="min-w-0">
      {label && (
        <div className="font-architect text-[14px] leading-tight text-ink">
          {label}
        </div>
      )}
      {description && (
        <div className="mt-0.5 font-kalam text-[12px] text-ink-muted/75">
          {description}
        </div>
      )}
    </div>
  );

  return (
    <label
      htmlFor={inputId}
      className={cn(
        "inline-flex cursor-pointer items-center gap-3",
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      {labelPosition === "left" && labelEl}
      <div className="relative shrink-0">
        <SwitchSvg checked={isChecked} focused={focused} disabled={disabled} />
        <input
          type="checkbox"
          role="switch"
          id={inputId}
          name={name}
          checked={isChecked}
          onChange={handleChange}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-checked={isChecked}
          className="absolute inset-0 cursor-pointer opacity-0"
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      {labelPosition === "right" && labelEl}
    </label>
  );
}
