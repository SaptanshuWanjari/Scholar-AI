import React, { createContext, useCallback, useContext, useEffect, useRef } from "react";
import { cn } from "@paper-ui/utils";

interface FocusScopeContextValue {
  trapped: boolean;
  autoFocus: boolean;
  restoreFocus: boolean;
}

const FocusScopeContext = createContext<FocusScopeContextValue>({
  trapped: true,
  autoFocus: false,
  restoreFocus: false,
});

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusableElements(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.hasAttribute("disabled") && el.offsetParent !== null,
  );
}

/**
 * Props for the {@link FocusScope} root component.
 */
interface FocusScopeRootProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * When `true` (default), Tab and Shift+Tab are trapped inside the scope.
   * Pressing Tab on the last focusable element cycles back to the first, and
   * Shift+Tab on the first cycles to the last.
   */
  trapped?: boolean;
  /**
   * When `true`, the first focusable element inside the scope receives focus
   * on mount.
   */
  autoFocus?: boolean;
  /**
   * When `true`, focus is returned to the previously active element when the
   * scope unmounts. Useful for dialogs and modals so the user lands back on
   * the trigger element.
   */
  restoreFocus?: boolean;
}

/**
 * Traps keyboard focus within a container, supporting Tab/Shift+Tab cycling,
 * auto-focus on mount, and focus restoration on unmount.
 *
 * @description
 * Wraps children in a `<div>` that listens for Tab keydown events and keeps
 * focus cycling between the first and last focusable elements. Used primarily
 * in dialogs, modals, and drawers to prevent the user from tabbing into
 * background content.
 *
 * `autoFocus` moves focus to the first focusable child on mount. `restoreFocus`
 * returns focus to the previously active element when the scope unmounts, so
 * the user lands back on the trigger button after closing a modal.
 *
 * @example
 * ```tsx
 * <FocusScope trapped autoFocus restoreFocus>
 *   <dialog open>
 *     <button>Cancel</button>
 *     <button>Confirm</button>
 *   </dialog>
 * </FocusScope>
 * ```
 *
 * @remarks
 * Focusable elements are selected by the selector `a[href], button, input,
 * textarea, select, [tabindex]:not([tabindex="-1"])`. Disabled elements and
 * those with zero offset dimensions are excluded from the cycle.
 */
function FocusScopeRoot({
  trapped = true,
  autoFocus = false,
  restoreFocus = false,
  className,
  children,
  onKeyDown,
  ...rest
}: FocusScopeRootProps) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousActiveElement.current = document.activeElement as HTMLElement | null;
    if (autoFocus && scopeRef.current) {
      const focusable = getFocusableElements(scopeRef.current);
      focusable[0]?.focus();
    }
    return () => {
      if (restoreFocus && previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [autoFocus, restoreFocus]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);
      if (!trapped || e.key !== "Tab" || !scopeRef.current) return;

      const focusable = getFocusableElements(scopeRef.current);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement;

      if (e.shiftKey) {
        if (current === first || !scopeRef.current.contains(current)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (current === last || !scopeRef.current.contains(current)) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [trapped, onKeyDown],
  );

  return (
    <FocusScopeContext.Provider value={{ trapped, autoFocus, restoreFocus }}>
      <div
        ref={scopeRef}
        className={cn(className)}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {children}
      </div>
    </FocusScopeContext.Provider>
  );
}

/**
 * Props for {@link FocusScope.Child}.
 */
interface FocusScopeChildProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * An individual focusable container within a {@link FocusScope} that
 * supports its own auto-focus behaviour.
 *
 * @description
 * Reads the parent `<FocusScope>` context and, when `autoFocus` is enabled,
 * focuses the first focusable element inside this child on mount. Useful
 * when the scope contains multiple panels or sections that each need
 * independent focus management.
 */
function FocusScopeChild({ className, children, ...rest }: FocusScopeChildProps) {
  const ctx = useContext(FocusScopeContext);
  const childRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ctx.autoFocus && childRef.current) {
      const focusable = getFocusableElements(childRef.current);
      focusable[0]?.focus();
    }
  }, [ctx.autoFocus]);

  return (
    <div ref={childRef} className={cn(className)} {...rest}>
      {children}
    </div>
  );
}

/**
 * Compound component for focus trapping and keyboard navigation.
 *
 * @description
 * `<FocusScope>` traps Tab and Shift+Tab within a container, making it ideal
 * for dialogs, modals, drawers, and any overlay that should not lose focus to
 * background content.
 *
 * `<FocusScope.Child>` provides per-section auto-focus within a scope.
 *
 * @example
 * ```tsx
 * <FocusScope trapped autoFocus restoreFocus>
 *   <FocusScope.Child>
 *     <button>First focusable</button>
 *   </FocusScope.Child>
 *   <input type="text" />
 *   <button>Last focusable</button>
 * </FocusScope>
 * ```
 *
 * @remarks
 * Focus restoration on unmount ensures the user returns to the element that
 * triggered the overlay — important for keyboard-only and screen-reader users.
 */
export const FocusScope = Object.assign(FocusScopeRoot, {
  Child: FocusScopeChild,
  displayName: "FocusScope",
  Child_displayName: "FocusScope.Child",
});
