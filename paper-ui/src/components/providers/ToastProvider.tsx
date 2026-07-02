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
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  X,
} from "lucide-react";
import { cn } from "@paper-ui/utils";
import { SketchBorder } from "@paper-ui/core";
import { getOverlayViewport } from "./OverlayProvider.tsx";

/**
 * Variant determines the toast's color scheme and icon.
 *
 * - `"default"` — neutral styling, no icon.
 * - `"success"` — green fill/stroke, check-circle icon.
 * - `"error"` — red fill/stroke, x-circle icon.
 * - `"warning"` — yellow fill/stroke, alert-triangle icon.
 */
export type ToastVariant = "default" | "success" | "error" | "warning";

/**
 * Options passed to `addToast()` to create a new toast notification.
 *
 * @description The `id` field allows consumers to provide a stable
 * identifier for deduplication or programmatic dismissal. When omitted
 * an auto-generated id is used.
 */
export interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  durationMs?: number;
  id?: string;
}

interface ToastEntry {
  id: string;
  title?: string;
  description?: string;
  variant: ToastVariant;
  durationMs: number;
  createdAt: number;
}

interface ToastProviderContextValue {
  addToast: (toast: ToastOptions) => string;
  removeToast: (id: string) => void;
  toasts: ToastEntry[];
}

const ToastProviderContext = createContext<ToastProviderContextValue | null>(null);

interface ToastContextValue {
  toast: ToastEntry;
  onClose: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const VARIANT_CONFIG: Record<ToastVariant, { fill: string; stroke: string; icon: React.ReactNode }> = {
  default: { fill: "#fffdf9", stroke: "#3a3733", icon: null as unknown as React.ReactNode },
  success: { fill: "#edf5ea", stroke: "#3f7a4e", icon: createElement(CheckCircle2, { size: 32, color: "#3f7a4e" }) },
  error: { fill: "#fdf0ef", stroke: "#9f3a36", icon: createElement(XCircle, { size: 32, color: "#9f3a36" }) },
  warning: { fill: "#fefce8", stroke: "#8a6d00", icon: createElement(AlertTriangle, { size: 32, color: "#8a6d00" }) },
};

/**
 * Props for the ToastProvider component.
 */
export interface ToastProviderProps {
  children: React.ReactNode;
  defaultDurationMs?: number;
}

/**
 * Global toast notification provider with imperative API, auto-dismiss,
 * and queue management.
 *
 * @description Manages a first-in, last-out stack of toast notifications.
 * Toasts are auto-dismissed after `durationMs` (set per-toast or via
 * the provider's `defaultDurationMs`). Set `durationMs: 0` for a
 * persistent toast that must be manually dismissed.
 *
 * The {@link useToast} hook exposes a single `addToast` function to
 * imperatively fire toasts from anywhere inside the provider tree.
 *
 * The {@link ToastProvider.Viewport} sub-component renders the active
 * toasts inside the OverlayProvider's viewport so they float above all
 * page content.
 *
 * @example
 * ```tsx
 * <ToastProvider defaultDurationMs={4000}>
 *   <App />
 *   <ToastProvider.Viewport position="bottom-right" />
 * </ToastProvider>
 * ```
 *
 * ```tsx
 * // Inside any descendant component:
 * const { addToast } = useToast();
 * addToast({ title: "Saved", variant: "success" });
 * ```
 *
 * @param defaultDurationMs - Fallback auto-dismiss time in ms (default: `5000`). 0 = never auto-dismiss.
 * @param children - React subtree that may fire toasts.
 *
 * @see {@link useToast}
 * @see {@link ToastOptions}
 */
export function ToastProvider({
  children,
  defaultDurationMs = 5000,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const counterRef = useRef(0);

  const removeToast = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: ToastOptions): string => {
      const id = toast.id ?? `toast-${counterRef.current++}-${Date.now()}`;
      const durationMs = toast.durationMs ?? defaultDurationMs;
      const entry: ToastEntry = {
        id,
        title: toast.title,
        description: toast.description,
        variant: toast.variant ?? "default",
        durationMs,
        createdAt: Date.now(),
      };

      setToasts((prev) => [...prev, entry]);

      if (durationMs > 0) {
        const timer = setTimeout(() => removeToast(id), durationMs);
        timersRef.current.set(id, timer);
      }

      return id;
    },
    [defaultDurationMs, removeToast],
  );

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current.clear();
    };
  }, []);

  const ctx: ToastProviderContextValue = { addToast, removeToast, toasts };

  return createElement(
    ToastProviderContext.Provider,
    { value: ctx },
    children,
  );
}
ToastProvider.displayName = "ToastProvider";

/**
 * Imperative hook to fire toast notifications from anywhere within a
 * `<ToastProvider>`.
 *
 * @description Returns `{ addToast }`. Call `addToast(options)` to push
 * a new toast onto the queue; it returns the toast's id for later
 * programmatic dismissal via `removeToast` (accessible if you hold a
 * ref to the internal functions or bind them separately).
 *
 * @example
 * ```tsx
 * const { addToast } = useToast();
 * addToast({ title: "Copied!", variant: "success", durationMs: 2000 });
 * ```
 *
 * @returns An object with the `addToast` method.
 * @throws If called outside a `<ToastProvider>`.
 *
 * @see {@link ToastProvider}
 * @see {@link ToastOptions}
 */
export function useToast(): { addToast: (toast: ToastOptions) => string; removeToast: (id: string) => void } {
  const ctx = useContext(ToastProviderContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return { addToast: ctx.addToast, removeToast: ctx.removeToast };
}

/**
 * Internal hook for ToastProvider sub-components to access the
 * provider-level toast state (toast list, add/remove).
 *
 * @throws If called outside a `<ToastProvider>`.
 */
function useToastContext() {
  const ctx = useContext(ToastProviderContext);
  if (!ctx) {
    throw new Error("ToastProvider sub-components must be used within a ToastProvider");
  }
  return ctx;
}

/**
 * Internal hook for per-toast sub-components (`ToastTitle`,
 * `ToastDescription`, `ToastClose`) to access the individual toast
 * entry and its `onClose` callback.
 *
 * @throws If called outside a `<ToastProvider.Toast>`.
 */
function useSingleToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("ToastProvider.Toast sub-components must be used within a ToastProvider.Toast");
  }
  return ctx;
}

/**
 * Props for the ToastViewport sub-component.
 *
 * @description Controls where the toast stack appears on screen.
 */
export interface ToastViewportProps {
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  className?: string;
}

const POSITION_CLASSES: Record<string, string> = {
  "bottom-right": "fixed bottom-6 right-6",
  "bottom-left": "fixed bottom-6 left-6",
  "top-right": "fixed top-6 right-6",
  "top-left": "fixed top-6 left-6",
};

/**
 * Renders all active toasts in a positioned stack, portaled into
 * the overlay viewport.
 *
 * @description Maps over the internal toast queue and renders a
 * {@link ToastUnit} for each entry. Uses {@link getOverlayViewport} (or
 * falls back to `document.body`) so toasts float at the correct
 * z-index level above dialogs but below tooltips.
 *
 * @param position - Screen corner for the toast stack (default: `"bottom-right"`).
 * @param className - Additional CSS classes for the viewport container.
 */
function ToastViewport({
  position = "bottom-right",
  className,
}: ToastViewportProps) {
  const { toasts, removeToast } = useToastContext();
  const viewportEl = typeof document !== "undefined" ? getOverlayViewport() : null;
  const target = viewportEl ?? document.body;

  const viewport = createElement("div", {
    className: cn(
      "z-[10000] flex flex-col gap-6 pointer-events-auto w-[480px] max-w-[calc(100vw-2rem)]",
      POSITION_CLASSES[position],
      className,
    ),
    children: toasts.map((toast) =>
      createElement(ToastUnit, {
        key: toast.id,
        toast,
        onClose: () => removeToast(toast.id),
      }),
    ),
  });

  return createPortal(viewport, target);
}
ToastViewport.displayName = "ToastProvider.Viewport";

/**
 * Props for the internal ToastUnit component (rendered once per active toast).
 */
export interface ToastUnitProps {
  toast: ToastEntry;
  onClose: () => void;
  className?: string;
}

/**
 * Renders a single toast card with variant-aware styling, icon, title,
 * description, and close button.
 *
 * @description Provides a per-toast {@link ToastContext} so child
 * sub-components ({@link ToastTitle}, {@link ToastDescription},
 * {@link ToastClose}) can access the individual toast data.
 *
 * @param toast - The toast entry data.
 * @param onClose - Callback that removes this toast from the queue.
 * @param className - Additional CSS classes for the toast card.
 */
function ToastUnit({ toast, onClose, className }: ToastUnitProps) {
  const config = VARIANT_CONFIG[toast.variant];

  const ctx: ToastContextValue = { toast, onClose };

  return createElement(
    ToastContext.Provider,
    { value: ctx },
    createElement("div", {
      className: cn("relative flex items-center gap-3 px-4 py-3.5", className),
      children: [
        createElement(SketchBorder, {
          key: "border",
          fill: config.fill,
          stroke: config.stroke,
          strokeWidth: 1.5,
          radius: 7,
          shadow: 4,
          bleed: 6,
        }),
        config.icon &&
          createElement(
            "div",
            { key: "icon", className: "relative z-[1] shrink-0" },
            config.icon,
          ),
        createElement(
          "div",
          { key: "body", className: "relative z-[1] flex-1 min-w-0" },
          createElement(ToastTitle),
          createElement(ToastDescription),
        ),
        createElement(
          "div",
          { key: "actions", className: "relative z-[1] flex items-center gap-2 shrink-0" },
          createElement(ToastClose),
        ),
      ],
    }),
  );
}
ToastUnit.displayName = "ToastProvider.Toast";

/**
 * Renders the toast title. Falls back to `toast.title` when no children
 * are provided. Hidden when the toast entry has no title.
 *
 * @param className - Additional CSS classes.
 * @param children - Custom title content (overrides `toast.title`).
 */
function ToastTitle({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  const { toast } = useSingleToast();
  if (!toast.title) return null;
  return createElement("div", {
    className: cn("font-caveat font-bold text-[var(--paper-ink)] text-[30px]", className),
    ...rest,
    children: children ?? toast.title,
  });
}
ToastTitle.displayName = "ToastProvider.ToastTitle";

/**
 * Renders the toast description. Falls back to `toast.description` when
 * no children are provided. Hidden when the toast entry has no description.
 *
 * @param className - Additional CSS classes.
 * @param children - Custom description content (overrides `toast.description`).
 */
function ToastDescription({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  const { toast } = useSingleToast();
  if (!toast.description) return null;
  return createElement("div", {
    className: cn(
      "font-architect text-lg text-[var(--paper-ink-muted)] leading-snug",
      toast.title && "mt-0.5",
      className,
    ),
    ...rest,
    children: children ?? toast.description,
  });
}
ToastDescription.displayName = "ToastProvider.ToastDescription";

/**
 * Renders an action button inside a toast (e.g. "Undo", "Retry").
 *
 * @description Accepts all standard `<button>` HTML attributes plus an
 * optional `altText` for the `aria-label`. Styled as a bordered pill
 * matching the paper theme.
 *
 * @param className - Additional CSS classes.
 * @param children - Button label/content.
 * @param altText - Accessible label for the button.
 */
function ToastAction({
  className,
  children,
  altText,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { altText?: string }) {
  return createElement("button", {
    type: "button",
    "aria-label": altText,
    className: cn(
      "inline-flex items-center justify-center px-2 py-1 text-xs font-architect",
      "border border-[var(--paper-stroke)] rounded bg-[var(--paper-bg)]",
      "text-[var(--paper-ink)] hover:bg-[var(--paper-surface)] transition-colors",
      className,
    ),
    ...rest,
    children,
  });
}
ToastAction.displayName = "ToastProvider.ToastAction";

/**
 * Renders a dismiss ("X") button for the toast. Calls `onClose` on
 * click. Includes `aria-label="Dismiss"` for accessibility.
 *
 * @param className - Additional CSS classes.
 * @param children - Custom close element (replaces the default X icon).
 */
function ToastClose({
  className,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { onClose } = useSingleToast();
  return createElement("button", {
    type: "button",
    "aria-label": "Dismiss",
    onClick: onClose,
    className: cn(
      "text-[var(--paper-ink-muted)] hover:text-[var(--paper-ink)] transition-colors",
      className,
    ),
    ...rest,
    children: children ?? createElement(X, { size: 28 }),
  });
}
ToastClose.displayName = "ToastProvider.ToastClose";

ToastProvider.Viewport = ToastViewport;
ToastProvider.Toast = ToastUnit;
ToastProvider.ToastTitle = ToastTitle;
ToastProvider.ToastDescription = ToastDescription;
ToastProvider.ToastAction = ToastAction;
ToastProvider.ToastClose = ToastClose;
