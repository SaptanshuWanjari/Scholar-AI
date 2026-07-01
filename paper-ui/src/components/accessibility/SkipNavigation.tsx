import React from "react";
import { cn } from "@paper-ui/utils";
import { SketchBorder } from "@paper-ui/core";

/**
 * Props for the {@link SkipNavigation} component.
 */
interface SkipNavigationProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * The target element ID to jump to. Defaults to `"#main-content"`.
   */
  href?: string;
  /**
   * Link text displayed when focused. Defaults to `"Skip to main content"`.
   */
  children?: React.ReactNode;
}

/**
 * A hidden-until-focused "skip to main content" link for keyboard and
 * screen-reader users.
 *
 * @description
 * Renders a link that is visually hidden (`sr-only`) by default. When the user
 * presses Tab, it becomes visible as a fixed-position banner in the top-left
 * corner (`focus:not-sr-only focus:fixed focus:top-3 focus:left-3`). On focus,
 * a `<SketchBorder>` doodle ring appears around the link, matching the
 * paper/sketch aesthetic.
 *
 * Pressing Enter jumps focus to the element matching `href` (default
 * `#main-content`), letting users bypass repetitive navigation landmarks.
 *
 * @example
 * ```tsx
 * <SkipNavigation href="#main-content" />
 * ```
 *
 * @example
 * ```tsx
 * <SkipNavigation href="#app-root">
 *   Skip to app
 * </SkipNavigation>
 * ```
 *
 * @remarks
 * Place this as the first focusable element inside `<body>` so it is the
 * first thing a keyboard user reaches. The target element must have a
 * matching `id` attribute and be focusable (or use `tabIndex={-1}`).
 */
export const SkipNavigation = React.forwardRef<HTMLAnchorElement, SkipNavigationProps>(
  function SkipNavigation(
    { href = "#main-content", className, children = "Skip to main content", ...rest },
    ref,
  ) {
    return (
      <a
        ref={ref}
        href={href}
        className={cn(
          "sr-only",
          "focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[99999]",
          "focus:bg-[var(--paper-surface)] focus:rounded-lg focus:px-4 focus:py-2 focus:shadow-lg",
          "focus:font-architect focus:text-[var(--paper-ink)]",
          className,
        )}
        {...rest}
      >
        <span className="skip-nav-bg pointer-events-none absolute inset-0" aria-hidden>
          <style>
            {`
              a:focus .skip-nav-border { display: block; }
              .skip-nav-border { display: none; }
            `}
          </style>
          <span className="skip-nav-border">
            <SketchBorder
              stroke="var(--paper-stroke)"
              strokeWidth={1.8}
              fill="transparent"
              roughness={0.9}
              radius={8}
              bleed={6}
              seed={7}
            />
          </span>
        </span>
        <span className="relative z-[1]">{children}</span>
      </a>
    );
  },
);

SkipNavigation.displayName = "SkipNavigation";
