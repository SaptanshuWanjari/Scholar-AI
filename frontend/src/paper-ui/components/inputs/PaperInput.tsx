import React, { useState } from "react";
import { cn } from "@/paper-ui/utils";
import { SketchBorder } from "@/paper-ui/core";
import { usePaperTheme } from "@/paper-ui/core";

// ─── PaperInput ───────────────────────────────────────────────────────────────

export interface PaperInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
}

export const PaperInput = React.forwardRef<HTMLInputElement, PaperInputProps>(
  function PaperInput(
    { label, icon, trailingIcon, error, hint, className, wrapperClassName, id, onFocus, onBlur, ...props },
    ref,
  ) {
    const [focused, setFocused] = useState(false);
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const t = usePaperTheme();

    return (
      <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
        {label && (
          <label htmlFor={inputId} className="font-architect text-ink-muted">
            {label}
          </label>
        )}
        <div className={cn("relative flex items-center gap-2 px-3 py-2", className)}>
          <SketchBorder
            fill={t.surface}
            stroke={error ? t.danger : focused ? t.ink : t.strokeSm}
            strokeWidth={focused ? 1.8 : 1.5}
            roughness={1.1}
            shadow={0}
          />
          {icon && (
            <span className="relative z-[1] shrink-0 text-ink-muted">{icon}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            onFocus={(e) => { setFocused(true); onFocus?.(e); }}
            onBlur={(e) => { setFocused(false); onBlur?.(e); }}
            className="relative z-[1] flex-1 border-none bg-transparent font-architect text-[1rem] text-ink placeholder:font-architect placeholder:text-ink-muted/60 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            {...props}
          />
          {trailingIcon && (
            <span className="relative z-[1] shrink-0 text-ink-muted">{trailingIcon}</span>
          )}
        </div>
        {error && (
          <p className="font-kalam text-[0.8rem] text-danger">{error}</p>
        )}
        {hint && !error && (
          <p className="font-kalam text-[0.8rem] text-ink-muted/70">{hint}</p>
        )}
      </div>
    );
  },
);

// ─── PaperTextarea ────────────────────────────────────────────────────────────

export interface PaperTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
}

export const PaperTextarea = React.forwardRef<HTMLTextAreaElement, PaperTextareaProps>(
  function PaperTextarea(
    { label, error, hint, className, wrapperClassName, id, rows = 4, onFocus, onBlur, ...props },
    ref,
  ) {
    const [focused, setFocused] = useState(false);
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const t = usePaperTheme();

    return (
      <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
        {label && (
          <label htmlFor={inputId} className="font-architect text-[0.87rem] text-ink-muted">
            {label}
          </label>
        )}
        <div className={cn("relative px-3 py-2", className)}>
          <SketchBorder
            fill={t.surface}
            stroke={error ? t.danger : focused ? t.ink : t.strokeSm}
            strokeWidth={focused ? 1.8 : 1.5}
            roughness={1.1}
            shadow={0}
          />
          <textarea
            ref={ref}
            id={inputId}
            rows={rows}
            onFocus={(e) => { setFocused(true); onFocus?.(e); }}
            onBlur={(e) => { setFocused(false); onBlur?.(e); }}
            className="relative z-[1] w-full resize-y border-none bg-transparent font-architect text-[1rem] leading-relaxed text-ink placeholder:font-architect placeholder:text-ink-muted/60 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            {...props}
          />
        </div>
        {error && (
          <p className="font-kalam text-[0.8rem] text-danger">{error}</p>
        )}
        {hint && !error && (
          <p className="font-kalam text-[0.8rem] text-ink-muted/70">{hint}</p>
        )}
      </div>
    );
  },
);
