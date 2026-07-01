import React from "react";

/**
 * Props for the {@link VisuallyHidden} component.
 */
interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * When `true`, the hidden styles are merged onto the single child element
   * instead of wrapping it in a `<span>`. The child must be a valid React element;
   * otherwise it falls back to the wrapper span.
   */
  asChild?: boolean;
}

const visuallyHiddenStyles: React.CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0,0,0,0)",
  whiteSpace: "nowrap",
  borderWidth: 0,
};

/**
 * Hides content visually while keeping it accessible to screen readers.
 *
 * @description
 * Uses the standard clip-rect pattern (absolute positioning, 1px box, overflow hidden,
 * `clip: rect(0,0,0,0)`) so the content is invisible but still announced by assistive
 * technology. Set `asChild` to merge the hidden styles onto a single child element
 * without adding a wrapper node.
 *
 * @example
 * ```tsx
 * <VisuallyHidden>
 *   <h1>Page title for screen readers only</h1>
 * </VisuallyHidden>
 * ```
 *
 * @example
 * ```tsx
 * <VisuallyHidden asChild>
 *   <button>Hidden label on an icon button</button>
 * </VisuallyHidden>
 * ```
 *
 * @remarks
 * The clip-rect pattern is preferred over `display: none` and `visibility: hidden`
 * because browsers still expose the element in the accessibility tree. Keep content
 * short — the element still occupies a 1px layout box.
 */
export const VisuallyHidden = React.forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  function VisuallyHidden({ asChild = false, className, style, children, ...rest }, ref) {
    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{ className?: string; style?: React.CSSProperties; ref?: React.Ref<any> }>;
      return React.cloneElement(child, {
        className: [child.props.className, className].filter(Boolean).join(" "),
        style: { ...visuallyHiddenStyles, ...child.props.style, ...style },
      } as React.HTMLAttributes<HTMLElement>);
    }

    return (
      <span
        ref={ref}
        style={{ ...visuallyHiddenStyles, ...style }}
        {...rest}
      >
        {children}
      </span>
    );
  },
);

VisuallyHidden.displayName = "VisuallyHidden";
