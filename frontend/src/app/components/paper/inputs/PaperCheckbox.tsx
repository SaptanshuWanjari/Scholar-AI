import React, { useEffect, useRef } from "react";
import rough from "roughjs/bin/rough";
import { cn } from "../../ui/utils";

const BOX = 17;
const BLEED = 4;
const SEED = 201;

interface CheckboxSvgProps {
  checked: boolean;
  focused: boolean;
  disabled?: boolean;
}

function CheckboxSvg({ checked, focused, disabled }: CheckboxSvgProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const S = BOX + BLEED * 2;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const rc = rough.svg(svg);
    const fill = checked ? (disabled ? "#a09890" : "#262320") : "#fffdf9";
    const stroke = disabled
      ? "#c4bdb0"
      : checked || focused
        ? "#262320"
        : "#b4ad9e";
    const sw = checked || focused ? 1.8 : 1.5;

    // Rounded-rectangle outline (same path formula as SketchBorder)
    const r = 3;
    const x = BLEED, y = BLEED, w = BOX, h = BOX;
    const d =
      `M${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} ` +
      `L${x + w},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} ` +
      `L${x + r},${y + h} Q${x},${y + h} ${x},${y + h - r} ` +
      `L${x},${y + r} Q${x},${y} ${x + r},${y} Z`;

    svg.appendChild(
      rc.path(d, {
        fill,
        fillStyle: "solid",
        stroke,
        strokeWidth: sw,
        roughness: 1.1,
        seed: SEED,
      }),
    );

    if (checked) {
      // Checkmark: left-to-midpoint-to-upper-right V shape
      const ck =
        `M${x + 3},${y + 9} L${x + 7},${y + 13} L${x + 14},${y + 4}`;
      svg.appendChild(
        rc.path(ck, {
          stroke: "#fffdf9",
          strokeWidth: 2,
          roughness: 1.3,
          fill: "none",
          seed: SEED + 1,
        }),
      );
    }
  }, [checked, focused, disabled]);

  return (
    <svg
      ref={svgRef}
      width={S}
      height={S}
      viewBox={`0 0 ${S} ${S}`}
      className="pointer-events-none shrink-0"
      aria-hidden
    />
  );
}

// ─── PaperCheckbox ────────────────────────────────────────────────────────────

export interface PaperCheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  value?: string;
  className?: string;
}

export function PaperCheckbox({
  checked,
  defaultChecked,
  onChange,
  label,
  description,
  disabled,
  id,
  name,
  value,
  className,
}: PaperCheckboxProps) {
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

  return (
    <label
      htmlFor={inputId}
      className={cn(
        "inline-flex cursor-pointer items-start gap-2.5",
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      <div className="relative mt-0.5 shrink-0">
        <CheckboxSvg checked={isChecked} focused={focused} disabled={disabled} />
        <input
          type="checkbox"
          id={inputId}
          name={name}
          value={value}
          checked={isChecked}
          onChange={handleChange}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="absolute inset-0 cursor-pointer opacity-0"
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      {(label || description) && (
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
      )}
    </label>
  );
}

// ─── PaperCheckboxGroup ───────────────────────────────────────────────────────

export interface CheckboxGroupOption {
  value: string;
  label: React.ReactNode;
  description?: string;
  disabled?: boolean;
}

export interface PaperCheckboxGroupProps {
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  options: CheckboxGroupOption[];
  label?: string;
  orientation?: "vertical" | "horizontal";
  className?: string;
}

export function PaperCheckboxGroup({
  value,
  defaultValue,
  onChange,
  options,
  label,
  orientation = "vertical",
  className,
}: PaperCheckboxGroupProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState<string[]>(defaultValue ?? []);
  const current = isControlled ? (value as string[]) : internal;

  const toggle = (val: string) => {
    const next = current.includes(val)
      ? current.filter((v) => v !== val)
      : [...current, val];
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  return (
    <fieldset className={cn("flex flex-col gap-2", className)}>
      {label && (
        <legend className="mb-1 font-architect text-[13px] text-ink-muted">
          {label}
        </legend>
      )}
      <div
        className={cn(
          "flex gap-3",
          orientation === "vertical" ? "flex-col" : "flex-row flex-wrap",
        )}
      >
        {options.map((opt) => (
          <PaperCheckbox
            key={opt.value}
            checked={current.includes(opt.value)}
            onChange={() => toggle(opt.value)}
            label={opt.label}
            description={opt.description}
            disabled={opt.disabled}
          />
        ))}
      </div>
    </fieldset>
  );
}
