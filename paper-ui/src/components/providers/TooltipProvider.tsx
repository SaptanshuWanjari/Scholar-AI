import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useId,
  useCallback,
  createElement,
  cloneElement,
  Children,
  isValidElement,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@paper-ui/utils";
import { SketchBorder } from "@paper-ui/core";

interface TooltipProviderContextValue {
  delayDuration: number;
  skipDelayDuration: number;
  activeTooltipId: string | null;
  setActiveTooltipId: (id: string | null) => void;
}

const TooltipProviderContext = createContext<TooltipProviderContextValue | null>(null);

interface TooltipContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tooltipId: string;
  triggerRef: React.RefObject<HTMLElement | null>;
}

const TooltipContext = createContext<TooltipContextValue | null>(null);

/**
 * Props for the TooltipProvider component.
 *
 * @description Controls the global delay behavior for all tooltips
 * within the provider's subtree.
 */
export interface TooltipProviderProps {
  delayDuration?: number;
  skipDelayDuration?: number;
  children: React.ReactNode;
}

interface Pos {
  top: number;
  left: number;
}

/**
 * Calculates the absolute position for the tooltip content relative to
 * the trigger element. Defaults to above-center with a viewport-aware
 * flip to below-center when there is not enough room above.
 *
 * @param triggerEl - The triggering DOM element.
 * @param contentEl - The tooltip content DOM element.
 * @returns `{ top, left }` pixel offsets relative to the document.
 */
function computeTooltipPos(triggerEl: HTMLElement, contentEl: HTMLElement): Pos {
  const rect = triggerEl.getBoundingClientRect();
  const w = contentEl.offsetWidth;
  const h = contentEl.offsetHeight;
  const gap = 8;

  const top = rect.top + window.scrollY - h - gap;
  let left = rect.left + window.scrollX + rect.width / 2 - w / 2;

  if (left < 8) left = 8;
  if (left + w > window.innerWidth - 8) left = window.innerWidth - w - 8;
  if (top < 8) {
    return {
      top: rect.bottom + window.scrollY + gap,
      left,
    };
  }

  return { top, left };
}

/**
 * Global provider for tooltip delay configuration and singleton
 * behavior.
 *
 * @description Wraps an app section and provides context that tooltip
 * sub-components consume. Gate-keeps the "one tooltip visible at a time"
 * singleton via the `activeTooltipId` state — opening a new tooltip
 * implicitly closes the currently-visible one.
 *
 * @example
 * ```tsx
 * <TooltipProvider delayDuration={400} skipDelayDuration={200}>
 *   <TooltipProvider.Tooltip>
 *     <TooltipProvider.Trigger>
 *       <button>Hover me</button>
 *     </TooltipProvider.Trigger>
 *     <TooltipProvider.Content>Helper text</TooltipProvider.Content>
 *   </TooltipProvider.Tooltip>
 * </TooltipProvider>
 * ```
 *
 * @param delayDuration - Hover delay before the tooltip appears (ms, default: `400`).
 * @param skipDelayDuration - Delay before a tooltip hides when moving between triggers (ms, default: `200`).
 * @param children - React subtree containing tooltip components.
 *
 * @see {@link useTooltipProvider}
 * @see {@link useTooltip}
 */
export function TooltipProvider({
  delayDuration = 400,
  skipDelayDuration = 200,
  children,
}: TooltipProviderProps) {
  const [activeTooltipId, setActiveTooltipId] = useState<string | null>(null);

  const ctx: TooltipProviderContextValue = {
    delayDuration,
    skipDelayDuration,
    activeTooltipId,
    setActiveTooltipId,
  };

  return createElement(
    TooltipProviderContext.Provider,
    { value: ctx },
    children,
  );
}
TooltipProvider.displayName = "TooltipProvider";

/**
 * Hook to access the top-level tooltip provider context (delay
 * durations and singleton active-tooltip tracking).
 *
 * @returns The TooltipProviderContextValue.
 * @throws If called outside a `<TooltipProvider>`.
 *
 * @see {@link TooltipProvider}
 */
function useTooltipProvider() {
  const ctx = useContext(TooltipProviderContext);
  if (!ctx) {
    throw new Error("Tooltip components must be used within a TooltipProvider");
  }
  return ctx;
}

/**
 * Props for a single tooltip unit (TooltipProvider.Tooltip).
 *
 * @description Can be controlled or uncontrolled. Omit `open`/`onOpenChange`
 * for automatic hover-based behavior.
 */
export interface TooltipProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

/**
 * Compound-component tooltip unit that wires Trigger + Content together.
 *
 * @description Provides the per-tooltip context (open state, tooltipId,
 * trigger ref) and participates in the singleton mechanism: only the
 * tooltip whose id matches `activeTooltipId` is visually rendered.
 *
 * @param open - Controlled open state (omit for hover-based uncontrolled).
 * @param onOpenChange - Controlled change handler.
 * @param children - `TooltipProvider.Trigger` and `TooltipProvider.Content`.
 */
function TooltipUnit({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  children,
}: TooltipProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const tooltipId = useId();
  const triggerRef = useRef<HTMLElement>(null);

  const { activeTooltipId, setActiveTooltipId } = useTooltipProvider();

  const onOpenChange = useCallback(
    (next: boolean) => {
      if (next) {
        setActiveTooltipId(tooltipId);
      } else if (activeTooltipId === tooltipId) {
        setActiveTooltipId(null);
      }
      if (!isControlled) setInternalOpen(next);
      controlledOnOpenChange?.(next);
    },
    [isControlled, controlledOnOpenChange, tooltipId, activeTooltipId, setActiveTooltipId],
  );

  const visible = open && activeTooltipId === tooltipId;

  const ctx: TooltipContextValue = {
    open: visible,
    onOpenChange,
    tooltipId,
    triggerRef,
  };

  return createElement(
    TooltipContext.Provider,
    { value: ctx },
    children,
  );
}
TooltipUnit.displayName = "TooltipProvider.Tooltip";

/**
 * Hook used by `TooltipProvider.Trigger` and `TooltipProvider.Content` to
 * access the per-tooltip context. Must be nested inside a `TooltipProvider.Tooltip`.
 *
 * @returns The TooltipContextValue.
 * @throws If called outside a `<TooltipProvider.Tooltip>`.
 *
 * @see {@link TooltipUnit}
 */
function useTooltip() {
  const ctx = useContext(TooltipContext);
  if (!ctx) {
    throw new Error("TooltipProvider.Tooltip sub-components must be used within TooltipProvider.Tooltip");
  }
  return ctx;
}

/**
 * Wraps a single child and attaches hover/focus event handlers that
 * show and hide the tooltip after the configured delays.
 *
 * @description Clones the child and adds `onMouseEnter`, `onMouseLeave`,
 * `onFocus`, and `onBlur` handlers. Also sets `aria-describedby` to the
 * tooltip's id so screen readers announce the tooltip content.
 *
 * Show uses `delayDuration`; hide uses `skipDelayDuration` for fast
 * transitions between adjacent tooltips.
 *
 * @param children - A single focusable/hoverable React element.
 */
function TooltipTrigger({ children }: { children: React.ReactNode }) {
  const { onOpenChange, tooltipId, triggerRef } = useTooltip();
  const { delayDuration, skipDelayDuration } = useTooltipProvider();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const show = useCallback(() => {
    clearTimer();
    timerRef.current = setTimeout(() => onOpenChange(true), delayDuration);
  }, [delayDuration, onOpenChange]);

  const hide = useCallback(() => {
    clearTimer();
    timerRef.current = setTimeout(() => onOpenChange(false), skipDelayDuration);
  }, [skipDelayDuration, onOpenChange]);

  useEffect(() => clearTimer, []);

  const child = Children.only(children);
  if (!isValidElement(child)) return null;

  return cloneElement(child as React.ReactElement<any>, {
    ref: triggerRef,
    onMouseEnter: (e: React.MouseEvent) => {
      (child as React.ReactElement<any>).props.onMouseEnter?.(e);
      show();
    },
    onMouseLeave: (e: React.MouseEvent) => {
      (child as React.ReactElement<any>).props.onMouseLeave?.(e);
      hide();
    },
    onFocus: (e: React.FocusEvent) => {
      (child as React.ReactElement<any>).props.onFocus?.(e);
      onOpenChange(true);
    },
    onBlur: (e: React.FocusEvent) => {
      (child as React.ReactElement<any>).props.onBlur?.(e);
      onOpenChange(false);
    },
    "aria-describedby": tooltipId,
  });
}
TooltipTrigger.displayName = "TooltipProvider.Trigger";

/**
 * Renders the tooltip bubble, portaled to `document.body`.
 *
 * @description Only rendered when the tooltip is open. Position is
 * computed via {@link computeTooltipPos} using the trigger's bounding
 * rect. Uses `role="tooltip"` and matches the `aria-describedby`
 * reference set on the trigger. Styled with {@link SketchBorder} for
 * the paper aesthetic. Non-interactive (`pointerEvents: "none"`).
 *
 * @param className - Additional CSS classes.
 * @param children - Tooltip text content.
 */
function TooltipContent({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  const { open, tooltipId, triggerRef } = useTooltip();
  const contentRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<Pos | null>(null);

  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => {
      const trigger = triggerRef.current;
      const content = contentRef.current;
      if (trigger && content) {
        setPos(computeTooltipPos(trigger, content));
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [open, triggerRef]);

  if (!open) return null;

  return createPortal(
    createElement("div", {
      ref: contentRef,
      role: "tooltip",
      id: tooltipId,
      className: cn("absolute", className),
      style: {
        top: pos?.top ?? -9999,
        left: pos?.left ?? -9999,
        zIndex: 11000,
        pointerEvents: "none",
      },
      ...rest,
      children: createElement(
        "div",
        { className: "relative px-3 py-1.5" },
        createElement(SketchBorder, {
          fill: "var(--paper-bg)",
          stroke: "var(--paper-stroke)",
          strokeWidth: 1.5,
          shadow: 3,
          radius: 6,
          roughness: 1.0,
          bleed: 5,
        }),
        createElement(
          "span",
          { className: "relative z-[1] font-architect text-sm text-[var(--paper-ink)]" },
          children,
        ),
      ),
    }),
    document.body,
  );
}
TooltipContent.displayName = "TooltipProvider.Content";

TooltipProvider.Tooltip = TooltipUnit;
TooltipProvider.Trigger = TooltipTrigger;
TooltipProvider.Content = TooltipContent;

export { useTooltip, useTooltipProvider };
