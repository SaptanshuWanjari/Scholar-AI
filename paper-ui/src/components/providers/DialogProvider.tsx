import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useId,
  useCallback,
  createElement,
  cloneElement,
  Children,
  isValidElement,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@paper-ui/utils";
import { SketchBorder } from "@paper-ui/core";
import { useOverlay } from "./OverlayProvider.tsx";

interface DialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  labelId: string;
  descriptionId: string;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentRef: React.MutableRefObject<HTMLDivElement | null>;
  contentId: string;
  overlayRef: React.MutableRefObject<{ zIndex: number; viewportEl: HTMLElement | null } | null>;
  closeOnBackdrop: boolean;
}

const DialogContext = createContext<DialogContextValue | null>(null);

/**
 * Props for the DialogProvider component.
 *
 * @description Can operate in controlled or uncontrolled mode. When
 * `open`/`onOpenChange` are omitted the dialog manages its own state
 * internally.
 */
export interface DialogProviderProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnBackdrop?: boolean;
  children: React.ReactNode;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Traps Tab/Shift+Tab focus cycling within a container element.
 *
 * @param container - The DOM element to constrain focus within.
 * @param e - The keyboard event to intercept.
 */
function trapFocus(container: HTMLElement, e: KeyboardEvent) {
  if (e.key !== "Tab") return;
  const focusable = container.querySelectorAll<HTMLElement>(FOCUSABLE);
  if (focusable.length === 0) {
    e.preventDefault();
    return;
  }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

/**
 * Moves focus to the first focusable element inside a container, or the
 * container itself if none are focusable.
 *
 * @param container - The DOM element to search for focusable children.
 */
function focusFirst(container: HTMLElement) {
  const focusable = container.querySelector<HTMLElement>(FOCUSABLE);
  if (focusable) {
    focusable.focus();
  } else {
    container.focus();
  }
}

/**
 * Compound-component dialog with focus trap, Escape-to-close, and
 * `aria-modal` behavior.
 *
 * @description Implements an accessible modal dialog using the compound
 * component pattern. Sub-components (`DialogProvider.Trigger`, `.Portal`,
 * `.Overlay`, `.Content`, `.Title`, `.Description`, `.Close`) compose
 * together and share internal state via React context.
 *
 * When open, focus is trapped inside the content, the Escape key closes
 * the dialog, and scroll is locked via the OverlayProvider. The backdrop
 * click-to-dismiss behavior is controlled by `closeOnBackdrop`.
 *
 * @example
 * ```tsx
 * <DialogProvider>
 *   <DialogProvider.Trigger>
 *     <button>Open</button>
 *   </DialogProvider.Trigger>
 *   <DialogProvider.Portal>
 *     <DialogProvider.Overlay />
 *     <DialogProvider.Content>
 *       <DialogProvider.Title>Title</DialogProvider.Title>
 *       <DialogProvider.Description>Description.</DialogProvider.Description>
 *       <DialogProvider.Close />
 *     </DialogProvider.Content>
 *   </DialogProvider.Portal>
 * </DialogProvider>
 * ```
 *
 * @param open - Controlled open state (omit for uncontrolled).
 * @param onOpenChange - Controlled change handler.
 * @param closeOnBackdrop - Whether clicking the backdrop closes the dialog (default: `true`).
 * @param children - Compound sub-components that compose the dialog.
 *
 * @see {@link OverlayProvider} for z-index and scroll-lock behavior.
 */
export function DialogProvider({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  closeOnBackdrop = true,
  children,
}: DialogProviderProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const triggerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<{ zIndex: number; viewportEl: HTMLElement | null } | null>(null);

  const labelId = useId();
  const descriptionId = useId();
  const contentId = useId();

  const onOpenChange = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      controlledOnOpenChange?.(next);
    },
    [isControlled, controlledOnOpenChange],
  );

  useEffect(() => {
    if (!open) {
      triggerRef.current?.focus();
      return;
    }

    const content = contentRef.current;
    if (content) {
      const raf = requestAnimationFrame(() => focusFirst(content));
      return () => cancelAnimationFrame(raf);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
        return;
      }
      const content = contentRef.current;
      if (content) trapFocus(content, e);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onOpenChange]);

  const ctx: DialogContextValue = {
    open,
    onOpenChange,
    labelId,
    descriptionId,
    triggerRef,
    contentRef,
    contentId,
    overlayRef,
    closeOnBackdrop,
  };

  return createElement(
    DialogContext.Provider,
    { value: ctx },
    children,
  );
}
DialogProvider.displayName = "DialogProvider";

/**
 * Internal hook used by all `DialogProvider.*` sub-components to access
 * the shared dialog state. Throws if called outside a DialogProvider.
 *
 * @returns The current DialogContextValue.
 * @throws If called outside a `<DialogProvider>`.
 */
function useDialogContext() {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    throw new Error("DialogProvider sub-components must be used within a DialogProvider");
  }
  return ctx;
}

/**
 * Wraps a single child element and turns it into the dialog opener.
 *
 * @description Clones the child, injecting `onClick`, `aria-haspopup="dialog"`,
 * and `aria-controls` that reference the content. On click, it calls
 * `onOpenChange(true)`.
 *
 * @param children - A single focusable React element (e.g. a `<button>`).
 */
function DialogTrigger({ children }: { children: React.ReactNode }) {
  const { onOpenChange, triggerRef, contentId } = useDialogContext();

  const child = Children.only(children);
  if (!isValidElement(child)) return null;

  return cloneElement(child as React.ReactElement<any>, {
    ref: triggerRef,
    onClick: (e: React.MouseEvent) => {
      (child as React.ReactElement<any>).props.onClick?.(e);
      onOpenChange(true);
    },
    "aria-haspopup": "dialog" as const,
    "aria-expanded": undefined,
    "aria-controls": contentId,
  });
}
DialogTrigger.displayName = "DialogProvider.Trigger";

/**
 * Conditionally renders children into the overlay viewport (or
 * `document.body`) only when the dialog is open.
 *
 * @description Uses {@link useOverlay} to register the dialog and obtain
 * a dedicated z-index. Portals via `createPortal` into the overlay
 * viewport so the dialog renders above all page content.
 *
 * @param children - Overlay and Content sub-components (rendered only when open).
 */
function DialogPortal({ children }: { children: React.ReactNode }) {
  const { open } = useDialogContext();
  if (!open) return null;
  return createElement(DialogPortalInner, { children });
}
DialogPortal.displayName = "DialogProvider.Portal";

/**
 * Inner component that performs the actual portal creation. Separated
 * so the `useOverlay` hook is only called when the dialog is open.
 */
function DialogPortalInner({ children }: { children: React.ReactNode }) {
  const { overlayRef } = useDialogContext();
  const { zIndex, viewportEl } = useOverlay();

  overlayRef.current = { zIndex, viewportEl };
  const target = viewportEl ?? document.body;
  return createPortal(children, target);
}

/**
 * Semi-transparent backdrop behind the dialog content.
 *
 * @description Covers the full viewport (`fixed inset-0`) with a
 * black overlay (`bg-black/40`) and a subtle blur. By default, clicking
 * the backdrop fires `onOpenChange(false)` — this is controlled by
 * the parent's `closeOnBackdrop` prop.
 *
 * @param className - Additional CSS classes.
 */
function DialogOverlay({ className }: { className?: string }) {
  const { onOpenChange, overlayRef, closeOnBackdrop } = useDialogContext();
  const zIndex = overlayRef.current?.zIndex ?? 10000;

  return createElement("div", {
    className: cn(
      "fixed inset-0 flex items-center justify-center pointer-events-auto",
      className,
    ),
    style: { zIndex },
    onMouseDown: (e: React.MouseEvent) => {
      if (closeOnBackdrop && e.target === e.currentTarget) {
        onOpenChange(false);
      }
    },
    children: createElement(
      "div",
      { className: "absolute inset-0 bg-black/40 backdrop-blur-[2px]" },
    ),
  });
}
DialogOverlay.displayName = "DialogProvider.Overlay";

/**
 * The main dialog panel with sketch-border styling.
 *
 * @description Renders a `<div role="dialog" aria-modal>` with
 * `aria-labelledby` and `aria-describedby` wired to the title and
 * description IDs. Sits above the overlay (z-index + 1). Uses
 * {@link SketchBorder} for the hand-drawn paper aesthetic.
 *
 * @param className - Additional CSS classes.
 * @param children - Dialog body content (Title, Description, Close, custom elements).
 */
function DialogContent({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  const { labelId, descriptionId, contentId, contentRef, overlayRef } = useDialogContext();
  const zIndex = (overlayRef.current?.zIndex ?? 10000) + 1;

  return createElement("div", {
    ref: (node: HTMLDivElement | null) => {
      contentRef.current = node;
    },
    role: "dialog",
    "aria-modal": true,
    "aria-labelledby": labelId,
    "aria-describedby": descriptionId,
    id: contentId,
    tabIndex: -1,
    className: cn("relative outline-none w-full max-w-md", className),
    style: { zIndex },
    ...rest,
    children: [
      createElement(
        "div",
        { key: "border", className: "absolute inset-0" },
        createElement(SketchBorder, {
          fill: "#fffdf9",
          stroke: "#3a3733",
          strokeWidth: 1.8,
          shadow: 5,
          radius: 9,
          roughness: 1.0,
          bleed: 7,
        }),
      ),
      createElement(
        "div",
        { key: "inner", className: "relative z-[1] p-6" },
        children,
      ),
    ],
  });
}
DialogContent.displayName = "DialogProvider.Content";

/**
 * Renders the dialog's accessible heading (`<h2>`).
 *
 * @description Its `id` is automatically linked via `aria-labelledby`
 * on the dialog content. Uses the `caveat` font for a handwritten look.
 *
 * @param className - Additional CSS classes.
 * @param children - The heading text.
 */
function DialogTitle({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLHeadingElement>) {
  const { labelId } = useDialogContext();
  return createElement("h2", {
    id: labelId,
    className: cn("font-caveat text-xl font-bold text-[var(--paper-ink)]", className),
    ...rest,
    children,
  });
}
DialogTitle.displayName = "DialogProvider.Title";

/**
 * Renders the dialog's accessible description (`<p>`).
 *
 * @description Its `id` is automatically linked via `aria-describedby`
 * on the dialog content. Uses the `architect` font for body text.
 *
 * @param className - Additional CSS classes.
 * @param children - The description text.
 */
function DialogDescription({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLParagraphElement>) {
  const { descriptionId } = useDialogContext();
  return createElement("p", {
    id: descriptionId,
    className: cn("font-architect text-sm text-[var(--paper-ink-muted)] leading-relaxed mt-2", className),
    ...rest,
    children,
  });
}
DialogDescription.displayName = "DialogProvider.Description";

/**
 * Renders a close button positioned at the top-right corner of the
 * dialog content.
 *
 * @description Calls `onOpenChange(false)` on click. Renders an `X`
 * icon from `lucide-react` when no custom children are provided.
 * Accessibility: includes `aria-label="Close"`.
 *
 * @param className - Additional CSS classes.
 * @param children - Optional custom close element (replaces the default X icon).
 */
function DialogClose({
  className,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { onOpenChange } = useDialogContext();
  return createElement("button", {
    type: "button",
    "aria-label": "Close",
    onClick: () => onOpenChange(false),
    className: cn(
      "absolute top-3 right-3 z-[2] inline-flex h-7 w-7 items-center justify-center",
      "text-[var(--paper-ink-muted)] hover:text-[var(--paper-ink)] transition-colors",
      "font-architect",
      className,
    ),
    ...rest,
    children: children ?? createElement(X, { size: 16 }),
  });
}
DialogClose.displayName = "DialogProvider.Close";

DialogProvider.Trigger = DialogTrigger;
DialogProvider.Portal = DialogPortal;
DialogProvider.Overlay = DialogOverlay;
DialogProvider.Content = DialogContent;
DialogProvider.Title = DialogTitle;
DialogProvider.Description = DialogDescription;
DialogProvider.Close = DialogClose;

export { useDialogContext };
