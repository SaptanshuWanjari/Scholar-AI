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

/** Checkmark inside a circle. */
export function CheckCircleIcon({ size = 22, color = "currentColor", strokeWidth = 1.8, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      <circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth={strokeWidth} />
      <path d="M7.5 12 L10.5 15.5 L16.5 8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Analog clock face with hands. */
export function ClockIcon({ size = 22, color = "currentColor", strokeWidth = 1.8, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      <circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth={strokeWidth} />
      <path d="M12 5.5 L12 12 L16 14" stroke={color} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />
      <circle cx="12" cy="12" r="1" fill={color} stroke="none" />
    </svg>
  );
}

/** Target / bullseye. */
export function TargetIcon({ size = 22, color = "currentColor", strokeWidth = 1.8, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      <circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth={strokeWidth} />
      <circle cx="12" cy="12" r="5.5" stroke={color} strokeWidth={strokeWidth} />
      <circle cx="12" cy="12" r="2.5" stroke={color} strokeWidth={strokeWidth} />
      <path d="M12 0 L12 3" stroke={color} strokeWidth={strokeWidth * 0.7} strokeLinecap="round" strokeOpacity="0.4" />
      <path d="M12 21 L12 24" stroke={color} strokeWidth={strokeWidth * 0.7} strokeLinecap="round" strokeOpacity="0.4" />
      <path d="M0 12 L3 12" stroke={color} strokeWidth={strokeWidth * 0.7} strokeLinecap="round" strokeOpacity="0.4" />
      <path d="M21 12 L24 12" stroke={color} strokeWidth={strokeWidth * 0.7} strokeLinecap="round" strokeOpacity="0.4" />
    </svg>
  );
}

/** Flag / milestone. */
export function FlagIcon({ size = 22, color = "currentColor", strokeWidth = 1.8, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      <path d="M5 2 L5 22" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M5 3 Q5 2.5 5.5 2.5 L17.5 2.5 Q18 2.5 17.5 3 L17.5 12 Q18 12.5 17.5 12.5 L5.5 12.5 Q5 12.5 5 12 Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17.5 2.5 Q18 2.5 18 3 Q18 4 17.5 4 Q17 4 17.5 3" stroke={color} strokeWidth={strokeWidth * 0.5} strokeOpacity="0.3" />
    </svg>
  );
}

/** Simple bar chart. */
export function BarChartIcon({ size = 22, color = "currentColor", strokeWidth = 1.8, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      <path d="M4 20 L20 20" stroke={color} strokeWidth={strokeWidth * 0.7} strokeLinecap="round" />
      <path d="M7 12 L7 20" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M12 8 L12 20" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M17 14 L17 20" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M7 10 L7 14" stroke={color} strokeWidth={strokeWidth * 0.5} strokeLinecap="round" strokeOpacity="0.3" />
      <path d="M12 6 L12 10" stroke={color} strokeWidth={strokeWidth * 0.5} strokeLinecap="round" strokeOpacity="0.3" />
      <path d="M17 12 L17 16" stroke={color} strokeWidth={strokeWidth * 0.5} strokeLinecap="round" strokeOpacity="0.3" />
    </svg>
  );
}

/** Calendar page. */
export function CalendarIcon({ size = 22, color = "currentColor", strokeWidth = 1.8, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      <path d="M4 5 Q4 4 5 4 L19 4 Q20 4 20 5 L20 20 Q20 21 19 21 L5 21 Q4 21 4 20 Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 2 L8 6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M16 2 L16 6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M4 9 L20 9" stroke={color} strokeWidth={strokeWidth * 0.7} strokeLinecap="round" />
      <path d="M8 12 L10 12" stroke={color} strokeWidth={strokeWidth * 0.7} strokeLinecap="round" />
      <path d="M8 15 L11 15" stroke={color} strokeWidth={strokeWidth * 0.7} strokeLinecap="round" />
      <path d="M14 12 L16 12" stroke={color} strokeWidth={strokeWidth * 0.7} strokeLinecap="round" />
      <path d="M14 15 L17 15" stroke={color} strokeWidth={strokeWidth * 0.7} strokeLinecap="round" />
    </svg>
  );
}

/** Star rating icon. */
export function StarIcon({ size = 22, color = "currentColor", strokeWidth = 1.8, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      <path d="M12 2.5 L14.5 8.5 L20.5 9 L15.8 13 L17.5 19 L12 15.5 L6.5 19 L8.2 13 L3.5 9 L9.5 8.5 Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Timer / stopwatch. */
export function TimerIcon({ size = 22, color = "currentColor", strokeWidth = 1.8, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      <circle cx="12" cy="14" r="7.5" stroke={color} strokeWidth={strokeWidth} />
      <path d="M12 5.5 L12 2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M9 3 L15 3" stroke={color} strokeWidth={strokeWidth * 0.7} strokeLinecap="round" />
      <path d="M12 9.5 L12 14 L15 15.5" stroke={color} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />
    </svg>
  );
}
