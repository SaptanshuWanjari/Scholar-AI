import React from "react";
import { cn } from "@paper-ui/utils";

/**
 * Props for the {@link LiveRegion} component.
 */
interface LiveRegionProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * When `true` (default), announcements are queued politely (do not interrupt
   * the current screen reader utterance). When `false`, `aria-live` is set to
   * `"assertive"`, interrupting the current utterance for urgent updates.
   */
  polite?: boolean;
  /**
   * When `true`, the entire content of the live region is read as a single
   * unit on any change, rather than only the changed portion.
   */
  atomic?: boolean;
}

/**
 * A visually hidden container whose content changes are announced by screen
 * readers via the ARIA live-region mechanism.
 *
 * @description
 * Uses `role="status"` with `aria-live="polite"` (default) so announcements
 * wait for the screen reader to finish speaking before reading. Set `polite`
 * to `false` for `aria-live="assertive"`, which interrupts the current
 * utterance — useful for error messages or critical alerts.
 *
 * The container is visually hidden by the `sr-only` utility. Every time the
 * content (`children`) changes, assistive technology re-reads the region.
 *
 * @example
 * ```tsx
 * <LiveRegion>
 *   {error ? `Error: ${error}` : ""}
 * </LiveRegion>
 * ```
 *
 * @example
 * ```tsx
 * <LiveRegion polite={false} atomic>
 *   Session expired. Redirecting...
 * </LiveRegion>
 * ```
 *
 * @remarks
 * For repeated announcements (e.g. "Item deleted", then again "Item deleted"),
 * use {@link Announcer} instead — its dual-region alternating pattern ensures
 * each call triggers a DOM mutation that screen readers detect as a change.
 */
export const LiveRegion = React.forwardRef<HTMLDivElement, LiveRegionProps>(
  function LiveRegion({ polite = true, atomic, className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        role="status"
        aria-live={polite ? "polite" : "assertive"}
        aria-atomic={atomic}
        className={cn("sr-only", className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

LiveRegion.displayName = "LiveRegion";
