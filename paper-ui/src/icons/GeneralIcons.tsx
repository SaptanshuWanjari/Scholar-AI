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

/** House. */
export function HomeIcon({ size = 22, color = "currentColor", strokeWidth = 1.8, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      <path d="M3 10.5 L12 3 L21 10.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 9 L5 20 Q5 21 6 21 L9 21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M15 21 L18 21 Q19 21 19 20 L19 9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M10 21 L10 15 Q10 14 11 14 L13 14 Q14 14 14 15 L14 21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Single user silhouette. */
export function UserIcon({ size = 22, color = "currentColor", strokeWidth = 1.8, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      <circle cx="12" cy="7.5" r="5" stroke={color} strokeWidth={strokeWidth} />
      <path d="M3 21 Q3 15.5 12 15.5 Q21 15.5 21 21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

/** Bell / notification. */
export function BellIcon({ size = 22, color = "currentColor", strokeWidth = 1.8, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      <path d="M6 16 Q5 16 5 15 Q5 14 6.5 13 Q7 10 8.5 8 Q9.5 5.5 12 5 Q14.5 5.5 15.5 8 Q17 10 17.5 13 Q19 14 19 15 Q19 16 18 16 Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 16 Q9 18 12 18 Q15 18 15 16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M12 4 L12 5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

/** Heart. */
export function HeartIcon({ size = 22, color = "currentColor", strokeWidth = 1.8, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      <path d="M12 20 Q5 14 4 9.5 Q3 5 7 4 Q10 3 12 7 Q14 3 17 4 Q21 5 20 9.5 Q19 14 12 20 Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Pencil / edit. */
export function EditIcon({ size = 22, color = "currentColor", strokeWidth = 1.8, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      <path d="M4 20 L6 16 L16 6 L20 10 L10 20 Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 8 L18 12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M4 20 L2 22" stroke={color} strokeWidth={strokeWidth * 0.7} strokeLinecap="round" />
    </svg>
  );
}

/** Trash / delete. */
export function TrashIcon({ size = 22, color = "currentColor", strokeWidth = 1.8, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      <path d="M4 6 L20 6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M8 6 L8 4 Q8 3 9 3 L15 3 Q16 3 16 4 L16 6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 6 L7.5 20 Q7.5 21 8.5 21 L15.5 21 Q16.5 21 16.5 20 L18 6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 9 L10 18" stroke={color} strokeWidth={strokeWidth * 0.7} strokeLinecap="round" />
      <path d="M14 9 L14 18" stroke={color} strokeWidth={strokeWidth * 0.7} strokeLinecap="round" />
    </svg>
  );
}

/** Download arrow. */
export function DownloadIcon({ size = 22, color = "currentColor", strokeWidth = 1.8, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      <path d="M12 3 L12 15" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M7 10 L12 15 L17 10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 17 L4 20 Q4 21 5 21 L19 21 Q20 21 20 20 L20 17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Upload arrow. */
export function UploadIcon({ size = 22, color = "currentColor", strokeWidth = 1.8, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      <path d="M12 15 L12 3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M7 8 L12 3 L17 8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 17 L4 20 Q4 21 5 21 L19 21 Q20 21 20 20 L20 17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Refresh / rotate. */
export function RefreshIcon({ size = 22, color = "currentColor", strokeWidth = 1.8, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      <path d="M17 4 L21 8 L17 12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 16 Q3 10.5 7 7 Q11 3.5 17 5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M21 8 Q21 13.5 17 17 Q13 20.5 7 19" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

/** Lock / secure. */
export function LockIcon({ size = 22, color = "currentColor", strokeWidth = 1.8, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      <path d="M7 11 L7 8 Q7 4.5 12 4.5 Q17 4.5 17 8 L17 11" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 11 Q5 10 6 10 L18 10 Q19 10 19 11 L19 20 Q19 21 18 21 L6 21 Q5 21 5 20 Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="15.5" r="1.2" fill={color} stroke="none" />
      <path d="M12 16.5 L12 18.5" stroke={color} strokeWidth={strokeWidth * 0.7} strokeLinecap="round" />
    </svg>
  );
}

/** Two users. */
export function UsersIcon({ size = 22, color = "currentColor", strokeWidth = 1.8, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...svg(size, className)}>
      <circle cx="8" cy="6" r="4" stroke={color} strokeWidth={strokeWidth} />
      <path d="M2 20 Q2 15.5 8 15.5 Q11 15.5 12.5 16.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <circle cx="16" cy="8" r="3.5" stroke={color} strokeWidth={strokeWidth} />
      <path d="M12.5 16.5 Q14 15.5 16.5 15.5 Q21 15.5 22 20" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}
