import React from "react";
import { cn } from "@/paper-ui/utils";
import { PaperSheetBorder, type PaperSheetBorderProps } from "@/paper-ui/core";
import { SketchBorder, type SketchBorderProps } from "@/paper-ui/core";
import { Tape } from "../decorations/Tape";

type Tone = "dark" | "paper" | "green" | "red"

const TONES: Record<Tone, { fill: string; fg: string; stroke: string }> = {
  dark: { fill: "#262320", fg: "#fbf8f2", stroke: "#262320" },
  paper: { fill: "#fffdf9", fg: "#262320", stroke: "#2c2c2c" },
  green: { fill: "#e7efe4", fg: "#2f5d3a", stroke: "#3f7a4e" },
  red: { fill: "#fbeaea", fg: "#8b1e1e", stroke: "#c0392b" },
};

export interface PaperButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: Tone;
  size?: "sm" | "md" | "lg";
  /** Override sheet border props, or pass `null` to render with no background. */
  border?: Partial<PaperSheetBorderProps> | null;
}

const SIZES = {
  sm: "min-h-8 py-1 px-3 text-[14px]",
  md: "min-h-10 py-2 px-4 text-[15px]",
  lg: "min-h-11 py-2.5 px-6 text-[16px]",
};

/** Base hand-drawn button. Press lifts 1px up, active settles down. */
export const PaperButton = React.forwardRef<HTMLButtonElement, PaperButtonProps>(
  function PaperButton({ children, className, tone = "paper", size = "md", border, style, ...props }, ref) {
    const t = TONES[tone];
    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 font-architect",
          "transition-transform duration-150 hover:-translate-y-px active:translate-y-[1px]",
          SIZES[size],
          className,
        )}
        style={{ color: t.fg, ...style }}
        {...props}
      >
        {border !== null && (
          <PaperSheetBorder
            fill={t.fill}
            stroke={t.stroke}
            strokeWidth={1.8}
            shadow={2}
            {...border}
          />
        )}
        <span className="relative z-[1] inline-flex items-center gap-2">{children}</span>
      </button>
    );
  },
);

/** Paper-surfaced button — alias for PaperButton with paper tone. */
export const SketchButton = React.forwardRef<HTMLButtonElement, PaperButtonProps>(
  function SketchButton(props, ref) {
    return <PaperButton ref={ref} tone="paper" {...props} />;
  },
);

export interface StickyButtonProps extends PaperButtonProps {
  /** Show masking-tape strips on the two top corners. Default true. */
  taped?: boolean;
}

/** A taped-down button — the "Ask AI" / "Teach Me" treatment. */
export const StickyButton = React.forwardRef<HTMLButtonElement, StickyButtonProps>(
  function StickyButton({ children, taped = true, tone = "paper", className, ...props }, ref) {
    return (
      <span className="relative inline-block">
        {taped && (
          <>
            <Tape corner="top-left" width={34} rotate={-24} className="-top-2 left-1" />
            <Tape corner="top-right" width={34} rotate={24} className="-top-2 right-1" />
          </>
        )}
        <PaperButton ref={ref} tone={tone} size="lg" className={className} {...props}>
          {children}
        </PaperButton>
      </span>
    );
  },
);

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

/** Minimal icon button (bell, search, star). No paper sheet background. */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ children, className, label, ...props }, ref) {
    return (
      <button
        ref={ref}
        aria-label={label}
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-muted",
          "transition-colors hover:bg-black/5 hover:text-ink",
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

// ─── FloatingActionButton ─────────────────────────────────────────────────────
// FAB is circular — keeps SketchBorder (rough.js) which naturally draws circles.

const FAB_SIZES: Record<"sm" | "md" | "lg", number> = { sm: 40, md: 52, lg: 64 };

export interface FloatingActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  tone?: Tone;
  size?: "sm" | "md" | "lg";
  border?: Partial<SketchBorderProps> | null;
}

export const FloatingActionButton = React.forwardRef<HTMLButtonElement, FloatingActionButtonProps>(
  function FloatingActionButton(
    { children, label, tone = "dark", size = "md", border, className, style, ...props },
    ref,
  ) {
    const t = TONES[tone];
    const px = FAB_SIZES[size];
    return (
      <button
        ref={ref}
        aria-label={label}
        className={cn(
          "relative inline-flex items-center justify-center",
          "transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-px",
          className,
        )}
        style={{ width: px, height: px, color: t.fg, ...style }}
        {...props}
      >
        {border !== null && (
          <SketchBorder
            fill={t.fill}
            stroke={t.stroke}
            strokeWidth={1.8}
            radius={px / 2}
            shadow={3}
            roughness={0.9}
            bleed={8}
            {...border}
          />
        )}
        <span className="relative z-[1]">{children}</span>
      </button>
    );
  },
);

// ─── ChipButton ───────────────────────────────────────────────────────────────

export interface ChipButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  tone?: Tone;
  border?: Partial<PaperSheetBorderProps> | null;
}

export const ChipButton = React.forwardRef<HTMLButtonElement, ChipButtonProps>(
  function ChipButton({ children, selected = false, tone, border, className, style, ...props }, ref) {
    const resolvedTone: Tone = tone ?? (selected ? "dark" : "paper");
    const t = TONES[resolvedTone];
    return (
      <button
        ref={ref}
        aria-pressed={selected}
        className={cn(
          "relative inline-flex h-10 items-center gap-1.5 px-4 font-architect text-[15px]",
          "transition-transform duration-100 hover:-translate-y-px active:translate-y-px",
          className,
        )}
        style={{ color: t.fg, ...style }}
        {...props}
      >
        {border !== null && (
          <PaperSheetBorder
            fill={t.fill}
            stroke={t.stroke}
            strokeWidth={1.4}
            shadow={selected ? 1 : 0}
            {...border}
          />
        )}
        <span className="relative z-[1] inline-flex items-center gap-1.5">{children}</span>
      </button>
    );
  },
);

// ─── ToggleButton ─────────────────────────────────────────────────────────────

export interface ToggleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed: boolean;
  onPressedChange?: (next: boolean) => void;
  size?: "sm" | "md";
  border?: Partial<PaperSheetBorderProps> | null;
}

export const ToggleButton = React.forwardRef<HTMLButtonElement, ToggleButtonProps>(
  function ToggleButton(
    { children, pressed, onPressedChange, size = "md", border, className, style, onClick, ...props },
    ref,
  ) {
    const fill = pressed ? "#262320" : "#fffdf9";
    const fg = pressed ? "#fbf8f2" : "#262320";
    const shadow = pressed ? 0 : 2;
    const TOGGLE_SIZES = { sm: "h-8 px-3 text-[13px]", md: "h-10 px-4 text-[14px]" };
    return (
      <button
        ref={ref}
        aria-pressed={pressed}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 font-architect",
          "transition-transform duration-100",
          pressed ? "translate-y-px" : "hover:-translate-y-px",
          TOGGLE_SIZES[size],
          className,
        )}
        style={{ color: fg, ...style }}
        onClick={(e) => { onPressedChange?.(!pressed); onClick?.(e); }}
        {...props}
      >
        {border !== null && (
          <PaperSheetBorder
            fill={fill}
            stroke="#262320"
            strokeWidth={1.8}
            shadow={shadow}
            {...border}
          />
        )}
        <span className="relative z-[1] inline-flex items-center gap-2">{children}</span>
      </button>
    );
  },
);

// ─── GhostButton ──────────────────────────────────────────────────────────────

export const GhostButton = React.forwardRef<HTMLButtonElement, PaperButtonProps>(
  function GhostButton({ children, size = "md", border, className, style, ...props }, ref) {
    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 font-architect text-ink-muted",
          "transition-all duration-150 hover:-translate-y-px hover:text-ink active:translate-y-px",
          SIZES[size],
          className,
        )}
        style={style}
        {...props}
      >
        {border !== null && (
          <PaperSheetBorder
            fill="transparent"
            stroke="#c0b9ae"
            strokeWidth={1.4}
            shadow={0}
            {...border}
          />
        )}
        <span className="relative z-[1] inline-flex items-center gap-2">{children}</span>
      </button>
    );
  },
);
