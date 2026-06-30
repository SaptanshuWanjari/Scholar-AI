import { cn } from "@paper-ui/utils";
import type { IconProps } from "./PaperIcons";

function svg(size: number, className?: string) {
  return {
    width: size,
    height: size,
    className: cn("shrink-0", className),
    fill: "none" as const,
    "aria-hidden": true,
  };
}

/** Chevron pointing down. */
export function ChevronDownIcon({ size = 18, color = "currentColor", strokeWidth = 2, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      <path d="M6 9 L12 15 L18 9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Chevron pointing up. */
export function ChevronUpIcon({ size = 18, color = "currentColor", strokeWidth = 2, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      <path d="M18 15 L12 9 L6 15" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Chevron pointing left. */
export function ChevronLeftIcon({ size = 18, color = "currentColor", strokeWidth = 2, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      <path d="M15 6 L9 12 L15 18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Chevron pointing right. */
export function ChevronRightIcon({ size = 18, color = "currentColor", strokeWidth = 2, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      <path d="M9 6 L15 12 L9 18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Hamburger menu. */
export function MenuIcon({ size = 18, color = "currentColor", strokeWidth = 2, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      <path d="M4 6 L20 6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M4 12 L20 12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M4 18 L20 18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

/** Close / X. */
export function CloseIcon({ size = 18, color = "currentColor", strokeWidth = 2, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      <path d="M6 6 L18 18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M18 6 L6 18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

/** Search magnifier. */
export function SearchIcon({ size = 18, color = "currentColor", strokeWidth = 2, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      <circle cx="10.5" cy="10.5" r="7" stroke={color} strokeWidth={strokeWidth} />
      <path d="M16 16 L21 21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

/** Plus. */
export function PlusIcon({ size = 18, color = "currentColor", strokeWidth = 2, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      <path d="M12 5 L12 19" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M5 12 L19 12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

/** Minus. */
export function MinusIcon({ size = 18, color = "currentColor", strokeWidth = 2, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      <path d="M5 12 L19 12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

/** External link arrow. */
export function ExternalLinkIcon({ size = 18, color = "currentColor", strokeWidth = 2, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      <path d="M18 6 L10 14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M13 6 L18 6 L18 11" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 14 L15 19 Q15 20 14 20 L5 20 Q4 20 4 19 L4 10 Q4 9 5 9 L10 9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Info circle. */
export function InfoIcon({ size = 18, color = "currentColor", strokeWidth = 2, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      <circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth={strokeWidth} />
      <path d="M12 11 L12 17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <circle cx="12" cy="8" r="0.8" fill={color} stroke="none" />
    </svg>
  );
}

/** Alert triangle. */
export function AlertTriangleIcon({ size = 18, color = "currentColor", strokeWidth = 2, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      <path d="M12 3.5 Q12.5 3 13 3.5 L21.5 19.5 Q22 20 21.5 20.5 L12 20.5 Q11.5 20.5 11.5 20 L3 19.5 Q2.5 19 3 18.5 Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 9 L12 14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <circle cx="12" cy="16.5" r="0.7" fill={color} stroke="none" />
    </svg>
  );
}

/** Help circle with question mark. */
export function HelpCircleIcon({ size = 18, color = "currentColor", strokeWidth = 2, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      <circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth={strokeWidth} />
      <path d="M9.5 9.5 Q9.5 7.5 12 7.5 Q14.5 7.5 14.5 9.5 Q14.5 11 12.5 12 Q11 12.5 11 14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <circle cx="11.5" cy="16.5" r="0.7" fill={color} stroke="none" />
    </svg>
  );
}

/** Settings / gear. */
export function SettingsIcon({ size = 18, color = "currentColor", strokeWidth = 2, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      <circle cx="12" cy="12" r="3.5" stroke={color} strokeWidth={strokeWidth} />
      <path d="M12 1.5 L12 4.5" stroke={color} strokeWidth={strokeWidth * 0.7} strokeLinecap="round" />
      <path d="M12 19.5 L12 22.5" stroke={color} strokeWidth={strokeWidth * 0.7} strokeLinecap="round" />
      <path d="M1.5 12 L4.5 12" stroke={color} strokeWidth={strokeWidth * 0.7} strokeLinecap="round" />
      <path d="M19.5 12 L22.5 12" stroke={color} strokeWidth={strokeWidth * 0.7} strokeLinecap="round" />
      <path d="M4 4 L6 6" stroke={color} strokeWidth={strokeWidth * 0.7} strokeLinecap="round" />
      <path d="M18 18 L20 20" stroke={color} strokeWidth={strokeWidth * 0.7} strokeLinecap="round" />
      <path d="M20 4 L18 6" stroke={color} strokeWidth={strokeWidth * 0.7} strokeLinecap="round" />
      <path d="M6 18 L4 20" stroke={color} strokeWidth={strokeWidth * 0.7} strokeLinecap="round" />
    </svg>
  );
}
