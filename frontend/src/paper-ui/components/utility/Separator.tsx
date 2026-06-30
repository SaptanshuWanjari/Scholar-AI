import { cn } from "@/paper-ui/utils";

export interface SeparatorProps {
  /** Horizontal (default) or vertical for toolbar/inline use. */
  orientation?: "horizontal" | "vertical";
  className?: string;
}

/**
 * Thin CSS-only rule. Use inside toolbars, menus, or between inline elements
 * where rough.js overhead is unwanted. For section breaks prefer `Divider`.
 */
export function Separator({ orientation = "horizontal", className }: SeparatorProps) {
  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn("inline-block self-stretch w-px bg-black/[0.09] mx-1", className)}
      />
    );
  }
  return (
    <div
      role="separator"
      className={cn("h-px w-full bg-black/[0.07] my-1", className)}
    />
  );
}
