import React from "react";
import { cn } from "@paper-ui/utils";
import { SketchBorder } from "@paper-ui/core";

export interface ShortcutKeyRootProps {
  keys: string[];
  className?: string;
  children?: React.ReactNode;
}

function ShortcutKeyRoot({ keys, className, children }: ShortcutKeyRootProps) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      {children ?? keys.map((k, i) => (
        <React.Fragment key={i}>
          {i > 0 && <ShortcutKeyPlus />}
          <ShortcutKeyKey label={k} />
        </React.Fragment>
      ))}
    </span>
  );
}
ShortcutKeyRoot.displayName = "ShortcutKey.Root";

interface ShortcutKeyKeyProps {
  label?: string;
  children?: React.ReactNode;
  className?: string;
}

function ShortcutKeyKey({ label, children, className }: ShortcutKeyKeyProps) {
  return (
    <kbd
      className={cn(
        "relative inline-flex items-center gap-0.5 rounded-[5px] px-1.5 py-0.5",
        "font-architect text-xs text-ink-muted",
        className,
      )}
    >
      <SketchBorder stroke="#bdb7a8" strokeWidth={1.2} radius={5} roughness={1.4} />
      <span className="relative z-[1]">{children ?? label}</span>
    </kbd>
  );
}
ShortcutKeyKey.displayName = "ShortcutKey.Key";

interface ShortcutKeyPlusProps {
  className?: string;
}

function ShortcutKeyPlus({ className }: ShortcutKeyPlusProps) {
  return (
    <span className={cn("select-none text-[10px] text-ink-muted/40 leading-none", className)}>
      +
    </span>
  );
}
ShortcutKeyPlus.displayName = "ShortcutKey.Plus";

export const ShortcutKey = Object.assign(ShortcutKeyRoot, {
  Key: ShortcutKeyKey,
  Plus: ShortcutKeyPlus,
});

export type { ShortcutKeyRootProps as ShortcutKeyProps };
