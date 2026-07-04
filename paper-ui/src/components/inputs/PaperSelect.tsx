import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@paper-ui/utils";
import { SketchBorder } from "@paper-ui/core";

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface PaperSelectProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  className?: string;
  wrapperClassName?: string;
}

export function PaperSelect({
  value,
  defaultValue,
  onChange,
  options,
  placeholder = "Select an option…",
  label,
  error,
  hint,
  disabled = false,
  className,
  wrapperClassName,
}: PaperSelectProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue ?? "");
  const current = isControlled ? (value as string) : internal;

  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const generatedId = React.useId();

  const selected = options.find((o) => o.value === current);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  const pick = (val: string) => {
    if (!isControlled) setInternal(val);
    onChange?.(val);
    setOpen(false);
  };

  return (
    <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
      {label && (
        <label htmlFor={generatedId} className="font-architect text-[19px] text-ink-muted">
          {label}
        </label>
      )}

      <div ref={wrapRef} className="relative">
        {/* Trigger */}
        <button
          id={generatedId}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => !disabled && setOpen((o) => !o)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={cn(
            "relative flex w-full items-center justify-between gap-2 px-3 py-2 text-left",
            "font-architect text-[15px]",
            "transition-opacity",
            disabled && "cursor-not-allowed opacity-50",
            className,
          )}
        >
          <SketchBorder
            fill="#fffdf9"
            stroke={error ? "#9f3a36" : open || focused ? "#262320" : "#9c9484"}
            strokeWidth={open || focused ? 1.8 : 1.5}
            roughness={1.1}
            shadow={0}
          />
          <span className={cn("relative z-[1] flex-1 truncate", !selected && "text-ink-muted/60")}>
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown
            size={16}
            className={cn(
              "relative z-[1] shrink-0 text-ink-muted transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1.5">
            <div className="relative">
              <SketchBorder
                fill="#fffdf9"
                stroke="#3a3733"
                strokeWidth={1.6}
                roughness={1.0}
                shadow={4}
                shadowColor="rgba(0,0,0,0.18)"
              />
              <div
                role="listbox"
                className="relative z-[1] max-h-52 overflow-y-auto py-1.5"
                style={{ scrollbarWidth: "thin", scrollbarColor: "#d4cfc2 transparent" }}
              >
                {options.length === 0 ? (
                  <p className="px-4 py-3 font-kalam text-[13px] text-ink-muted/60">
                    No options
                  </p>
                ) : (
                  options.map((opt) => {
                    const isSelected = opt.value === current;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => pick(opt.value)}
                        className={cn(
                          "flex w-full items-center gap-2 px-3 py-2.5 text-left",
                          "font-architect text-[14px] text-ink transition-colors",
                          isSelected
                            ? "bg-black/[0.05]"
                            : "hover:bg-black/[0.03]",
                        )}
                      >
                        {opt.icon && (
                          <span className="shrink-0 text-ink-muted/80">{opt.icon}</span>
                        )}
                        <span className="flex-1 truncate">{opt.label}</span>
                        {isSelected && (
                          <Check size={13} className="shrink-0 text-ink-muted" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {error && <p className="font-kalam text-[12px] text-danger">{error}</p>}
      {hint && !error && (
        <p className="font-kalam text-[12px] text-ink-muted/70">{hint}</p>
      )}
    </div>
  );
}
