import React, { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@paper-ui/utils";
import { SketchBorder } from "@paper-ui/core";

export interface ShortcutKeyProps {
  children: React.ReactNode;
  className?: string;
}

/** A small keyboard-shortcut badge (e.g. ⌘K). */
export function ShortcutKey({ children, className }: ShortcutKeyProps) {
  return (
    <kbd
      className={cn(
        "relative inline-flex items-center gap-0.5 rounded-[5px] px-1.5 py-0.5",
        "font-architect text-xs text-ink-muted",
        className,
      )}
    >
      <SketchBorder stroke="#bdb7a8" strokeWidth={1.2} radius={5} roughness={1.4} />
      <span className="relative z-[1]">{children}</span>
    </kbd>
  );
}

export interface SketchSearchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  shortcut?: React.ReactNode;
  width?: number | string;
}

/** Search field with a rough border that darkens on focus + a ⌘K badge. */
export function SketchSearch({
  placeholder = "Search or jump to...",
  shortcut = (
    <ShortcutKey>
      <span className="text-[13px]">⌘</span>K
    </ShortcutKey>
  ),
  width = 340,
  className,
  ...props
}: SketchSearchProps) {
  const [focused, setFocused] = useState(false);
  return (
    <div
      className={cn("relative flex min-w-0 items-center gap-2 overflow-hidden px-3 py-2", className)}
      style={{ width }}
    >
      <SketchBorder
        fill="#fffdf9"
        stroke={focused ? "#262320" : "#b4ad9e"}
        strokeWidth={focused ? 1.8 : 1.5}
        roughness={1.1}
        shadow={0}
      />
      <Search size={17} className="relative z-[1] shrink-0 text-ink-muted" />
      <input
        {...props}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
        placeholder={placeholder}
        className="relative z-[1] min-w-0 flex-1 border-none bg-transparent font-architect text-[15px] text-ink placeholder:font-architect placeholder:text-ink-muted/70 focus:outline-none"
      />
      <div className="relative z-[1] shrink-0">{shortcut}</div>
    </div>
  );
}
