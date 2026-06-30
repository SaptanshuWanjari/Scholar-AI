import React, { useEffect, useRef } from "react";
import rough from "roughjs/bin/rough";
import { cn } from "@paper-ui/utils";

const CIRCLE_D = 18;
const BLEED = 4;
const SEED = 401;

interface RadioSvgProps {
  selected: boolean;
  focused: boolean;
  disabled?: boolean;
}

function RadioSvg({ selected, focused, disabled }: RadioSvgProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const S = CIRCLE_D + BLEED * 2;
  const cx = BLEED + CIRCLE_D / 2;
  const cy = BLEED + CIRCLE_D / 2;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const rc = rough.svg(svg);

    const outerFill = disabled
      ? "#e8e3db"
      : selected
        ? "#262320"
        : "#fffdf9";
    const outerStroke = disabled
      ? "#c4bdb0"
      : selected || focused
        ? "#262320"
        : "#b4ad9e";

    svg.appendChild(
      rc.circle(cx, cy, CIRCLE_D, {
        fill: outerFill,
        fillStyle: "solid",
        stroke: outerStroke,
        strokeWidth: selected || focused ? 1.8 : 1.5,
        roughness: 1.1,
        seed: SEED,
      }),
    );

    if (selected) {
      // Inner dot
      svg.appendChild(
        rc.circle(cx, cy, CIRCLE_D * 0.38, {
          fill: disabled ? "#b4ad9e" : "#fffdf9",
          fillStyle: "solid",
          stroke: "none",
          strokeWidth: 0,
          roughness: 0.7,
          seed: SEED + 1,
        }),
      );
    }
  }, [selected, focused, disabled, cx, cy]);

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

// ─── PaperRadio ───────────────────────────────────────────────────────────────

export interface PaperRadioProps {
  value: string;
  selectedValue?: string;
  onChange?: (value: string) => void;
  label?: React.ReactNode;
  description?: string;
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;
}

export function PaperRadio({
  value,
  selectedValue,
  onChange,
  label,
  description,
  disabled,
  name,
  id,
  className,
}: PaperRadioProps) {
  const [focused, setFocused] = React.useState(false);
  const isSelected = selectedValue === value;
  const generatedId = React.useId();
  const inputId = id ?? generatedId;

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
        <RadioSvg selected={isSelected} focused={focused} disabled={disabled} />
        <input
          type="radio"
          id={inputId}
          name={name}
          value={value}
          checked={isSelected}
          onChange={() => onChange?.(value)}
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

// ─── PaperRadioGroup ──────────────────────────────────────────────────────────

export interface RadioOption {
  value: string;
  label: React.ReactNode;
  description?: string;
  disabled?: boolean;
}

export interface PaperRadioGroupProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  options: RadioOption[];
  name?: string;
  label?: string;
  orientation?: "vertical" | "horizontal";
  className?: string;
}

export function PaperRadioGroup({
  value,
  defaultValue,
  onChange,
  options,
  name,
  label,
  orientation = "vertical",
  className,
}: PaperRadioGroupProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue ?? "");
  const current = isControlled ? (value as string) : internal;
  const generatedName = React.useId();
  const groupName = name ?? generatedName;

  const pick = (val: string) => {
    if (!isControlled) setInternal(val);
    onChange?.(val);
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
          <PaperRadio
            key={opt.value}
            value={opt.value}
            selectedValue={current}
            onChange={pick}
            label={opt.label}
            description={opt.description}
            disabled={opt.disabled}
            name={groupName}
          />
        ))}
      </div>
    </fieldset>
  );
}
