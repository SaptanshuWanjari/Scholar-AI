import React from "react";
import { cn } from "@paper-ui/utils";
import { SketchBorder } from "@paper-ui/core";

/**
 * Props for the {@link FocusRing} root wrapper.
 */
interface FocusRingRootProps extends React.HTMLAttributes<HTMLSpanElement> {}

function FocusRingRoot({ className, children, ...rest }: FocusRingRootProps) {
  return (
    <span className={cn("relative inline-block", className)} {...rest}>
      {children}
    </span>
  );
}

/**
 * Props for {@link FocusRing.Target}.
 */
interface FocusRingTargetProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Tab index for keyboard navigation. Useful when the target contains
   * interactive children that need to be included in the tab order.
   */
  tabIndex?: number;
}

function FocusRingTarget({ className, children, tabIndex, ...rest }: FocusRingTargetProps) {
  return (
    <span
      data-focus-ring-target
      className={cn("relative inline-block", className)}
      tabIndex={tabIndex}
      {...rest}
    >
      {children}
      <style>
        {`
          [data-focus-ring-target]:focus-within > .focus-ring {
            opacity: 1;
          }
        `}
      </style>
      <span className="focus-ring pointer-events-none absolute inset-0 z-[2] opacity-0 transition-opacity duration-150" aria-hidden>
        <SketchBorder
          stroke="var(--paper-accent)"
          strokeWidth={2.5}
          fill="transparent"
          roughness={0.6}
          radius={8}
          bleed={6}
          seed={42}
        />
      </span>
    </span>
  );
}

/**
 * Draws a doodle-style ring around a focusable element when it or any child
 * receives focus.
 *
 * @description
 * Wraps children in a relative container and uses `:focus-within` to reveal a
 * `<SketchBorder>` overlay. The ring appears whenever focus is inside the
 * target — including when a child button, link, or input is focused.
 * The ring is a hand-drawn SVG border with configurable roughness, matching
 * the paper/sketch aesthetic.
 *
 * @example
 * ```tsx
 * <FocusRing>
 *   <FocusRing.Target tabIndex={0}>
 *     <button>Click me</button>
 *   </FocusRing.Target>
 * </FocusRing>
 * ```
 *
 * @remarks
 * The ring is always rendered in the DOM but hidden via `opacity: 0` until
 * `:focus-within` triggers `opacity: 1`. This avoids layout shifts when focus
 * enters or leaves. Use `tabIndex` on `<FocusRing.Target>` for non-interactive
 * containers that should still show a focus ring.
 */
export const FocusRing = Object.assign(FocusRingRoot, {
  Target: FocusRingTarget,
  displayName: "FocusRing",
  Target_displayName: "FocusRing.Target",
});
