import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  createElement,
} from "react";
import { createPortal } from "react-dom";

interface OverlayContextValue {
  mountOverlay: () => { zIndex: number; unmount: () => void };
}

const OverlayContext = createContext<OverlayContextValue | null>(null);

const VIEWPORT_ID = "paper-overlay-viewport";

let bodyScrollLockCount = 0;

/**
 * Increments the body scroll-lock counter and applies `overflow: hidden`
 * on the first active overlay. Uses a module-level counter so nested
 * overlays (e.g. dialog inside a dialog) share the same scroll-lock
 * without prematurely restoring scrolling.
 */
function lockBodyScroll() {
  bodyScrollLockCount++;
  if (bodyScrollLockCount === 1) {
    document.body.style.overflow = "hidden";
  }
}

/**
 * Decrements the body scroll-lock counter and removes `overflow: hidden`
 * when no overlays remain mounted.
 */
function unlockBodyScroll() {
  bodyScrollLockCount = Math.max(0, bodyScrollLockCount - 1);
  if (bodyScrollLockCount === 0) {
    document.body.style.overflow = "";
  }
}

/**
 * Props for the OverlayProvider component.
 */
export interface OverlayProviderProps {
  children: React.ReactNode;
}

/**
 * Manages z-index stacking and body scroll-lock for overlays.
 *
 * @description Provides a {@link useOverlay | `useOverlay`} hook that
 * components (dialogs, tooltips, toasts) call to register as an overlay.
 * Each registration receives a monotonically increasing z-index and
 * triggers a module-level body scroll lock.
 *
 * The provider also injects a {@link OverlayProvider.Viewport} portal
 * into `document.body` that acts as the mounting target for overlays
 * via {@link getOverlayViewport}.
 *
 * @example
 * ```tsx
 * <OverlayProvider>
 *   <App />
 * </OverlayProvider>
 * ```
 *
 * @param children - React subtree that may contain overlay-consuming components.
 *
 * @see {@link useOverlay}
 * @see {@link getOverlayViewport}
 */
export function OverlayProvider({ children }: OverlayProviderProps) {
  const counterRef = useRef(0);
  const zIndexRef = useRef(9990);
  const mountCountRef = useRef(0);

  const mountOverlay = useCallback(() => {
    const id = counterRef.current++;
    const z = zIndexRef.current++;
    mountCountRef.current++;
    lockBodyScroll();
    const unmount = () => {
      mountCountRef.current--;
      unlockBodyScroll();
    };
    return { zIndex: z, unmount };
  }, []);

  useEffect(() => {
    return () => {
      while (mountCountRef.current > 0) {
        unlockBodyScroll();
        mountCountRef.current--;
      }
    };
  }, []);

  return createElement(
    OverlayContext.Provider,
    { value: { mountOverlay } },
    children,
  );
}
OverlayProvider.displayName = "OverlayProvider";

/**
 * Internal portal that creates a fixed full-screen container (`id="paper-overlay-viewport"`)
 * on `document.body`. It has `pointerEvents: "none"` so it does not block
 * interaction; individual overlays re-enable pointer-events on their own
 * content. Overlays are portaled into this container by the
 * {@link useOverlay} hook and {@link getOverlayViewport} helper.
 */
function OverlayViewport() {
  if (typeof document === "undefined") return null;

  return createPortal(
    createElement("div", {
      id: VIEWPORT_ID,
      style: {
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9990,
      },
    }),
    document.body,
  );
}
OverlayViewport.displayName = "OverlayProvider.Viewport";

OverlayProvider.Viewport = OverlayViewport;

/**
 * Registers the calling component as an overlay and returns its z-index
 * and the overlay viewport element.
 *
 * @description On mount, acquires a z-index from the central counter and
 * locks body scroll. On unmount, releases the z-index and unlocks scroll.
 * Must be used within an `<OverlayProvider>`.
 *
 * @returns `{ zIndex, viewportEl }` — the assigned stacking index and the
 *          DOM element where the overlay should be portaled.
 *
 * @see {@link OverlayProvider}
 * @see {@link getOverlayViewport}
 */
export function useOverlay() {
  const ctx = useContext(OverlayContext);
  if (!ctx) {
    throw new Error("useOverlay must be used within an OverlayProvider");
  }
  const overlayRef = useRef<{ zIndex: number; unmount: () => void } | null>(null);
  const viewportEl = typeof document !== "undefined" ? document.getElementById(VIEWPORT_ID) : null;

  useEffect(() => {
    overlayRef.current = ctx.mountOverlay();
    return () => {
      overlayRef.current?.unmount();
    };
  }, [ctx]);

  return {
    zIndex: overlayRef.current?.zIndex ?? 10000,
    viewportEl,
  };
}

/**
 * Returns the overlay viewport DOM element by its id
 * (`"paper-overlay-viewport"`). Safe to call during SSR (returns `null`).
 *
 * @returns The viewport element or `null` if not yet rendered or during SSR.
 *
 * @see {@link OverlayProvider}
 */
export function getOverlayViewport(): HTMLElement | null {
  if (typeof document === "undefined") return null;
  return document.getElementById(VIEWPORT_ID);
}
