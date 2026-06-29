import React from "react";
import { cn } from "../../ui/utils";
import { ShortcutKey } from "../inputs/SketchSearch";

export interface KeyboardHintProps {
  /** Each string is one key cap (e.g. ["⌘", "K"] or ["Ctrl", "Shift", "P"]). */
  keys: string[];
  /** Short description shown after the key caps, e.g. "to search". */
  label?: string;
  className?: string;
}

/**
 * Inline keyboard shortcut hint — renders each key inside a `ShortcutKey`
 * chip, joined by `+` separators, with an optional text label after.
 *
 * @example
 *   <KeyboardHint keys={["⌘", "K"]} label="to open" />
 *   → ⌘ + K  to open
 */
export function KeyboardHint({ keys, label, className }: KeyboardHintProps) {
  return (
    <span className={cn("inline-flex items-center gap-1 font-architect text-[12px] text-ink-muted/70", className)}>
      {keys.map((k, i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <span className="select-none text-[10px] text-ink-muted/40">+</span>
          )}
          <ShortcutKey>{k}</ShortcutKey>
        </React.Fragment>
      ))}
      {label && (
        <span className="ml-1 text-ink-muted/55">{label}</span>
      )}
    </span>
  );
}
