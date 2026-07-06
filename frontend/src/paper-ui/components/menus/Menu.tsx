import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { Check, Circle, ChevronRight } from "lucide-react";
import { cn } from "@paper-ui/utils";
import { SketchBorder } from "@paper-ui/core";
import { SketchDivider } from "../decorations/SketchDivider";

/* -------------------------------------------------------------------------- */
/*  Context                                                                   */
/* -------------------------------------------------------------------------- */

interface MenuRootContext {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLDivElement | null>;
}

const MenuRootCtx = createContext<MenuRootContext | null>(null);

function useMenuRoot(): MenuRootContext | null {
  return useContext(MenuRootCtx);
}

/* -------------------------------------------------------------------------- */
/*  Shared panel wrapper                                                      */
/* -------------------------------------------------------------------------- */

interface MenuPanelProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

function MenuPanel({ children, className, style }: MenuPanelProps) {
  return (
    <div className={cn("min-w-[180px] relative", className)} style={style}>
      <div className="absolute inset-0 pointer-events-none -z-10">
        <SketchBorder
          fill="#fffdf9"
          stroke="#3a3733"
          strokeWidth={1.6}
          shadow={5}
          radius={8}
          bleed={6}
        />
      </div>
      <div className="relative z-[1] py-1.5">{children}</div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Root                                                                      */
/* -------------------------------------------------------------------------- */

export interface MenuRootProps {
  children?: React.ReactNode;
}

function MenuRootInner({ children }: MenuRootProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  return (
    <MenuRootCtx.Provider value={{ open, setOpen, triggerRef }}>
      {children}
    </MenuRootCtx.Provider>
  );
}
MenuRootInner.displayName = "MenuRoot";

/* -------------------------------------------------------------------------- */
/*  Trigger                                                                   */
/* -------------------------------------------------------------------------- */

export interface MenuTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

function MenuTriggerInner({ children, className, ...props }: MenuTriggerProps) {
  const ctx = useMenuRoot();
  if (!ctx) throw new Error("Menu.Trigger needs <Menu.Root> parent");

  return (
    <button
      type="button"
      ref={ctx.triggerRef as unknown as React.Ref<HTMLButtonElement>}
      onClick={() => ctx.setOpen(!ctx.open)}
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-sm",
        "font-architect text-[14px] text-ink",
        "hover:bg-black/[0.04] transition-colors select-none outline-none",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
MenuTriggerInner.displayName = "MenuTrigger";

/* -------------------------------------------------------------------------- */
/*  Content                                                                   */
/* -------------------------------------------------------------------------- */

export interface MenuContentProps {
  children?: React.ReactNode;
  className?: string;
}

function MenuContentInner({ children, className }: MenuContentProps) {
  const ctx = useMenuRoot();
  if (!ctx) throw new Error("Menu.Content needs <Menu.Root> parent");

  const [pos, setPos] = useState({ top: 0, left: 0 });
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ctx.open && ctx.triggerRef.current) {
      const rect = ctx.triggerRef.current.getBoundingClientRect();
      const vw = window.innerWidth;
      const panelW = 200;
      setPos({
        top: rect.bottom + 4,
        left: Math.min(rect.left, vw - panelW - 8),
      });
    }
  }, [ctx.open]);

  /* close on outside click + Escape */
  useEffect(() => {
    if (!ctx.open) return;
    const onMouseDown = (e: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(e.target as Node)
      ) {
        ctx.setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") ctx.setOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [ctx.open]);

  if (!ctx.open) return null;

  return createPortal(
    <div
      ref={contentRef}
      className={cn("fixed z-50", className)}
      style={{ top: pos.top, left: pos.left }}
    >
      <MenuPanel>{children}</MenuPanel>
    </div>,
    document.body,
  );
}
MenuContentInner.displayName = "MenuContent";

/* -------------------------------------------------------------------------- */
/*  Item                                                                      */
/* -------------------------------------------------------------------------- */

export interface MenuItemProps {
  children?: React.ReactNode;
  onSelect?: () => void;
  icon?: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  className?: string;
}

function MenuItemInner({
  children,
  onSelect,
  icon,
  danger,
  disabled,
  className,
}: MenuItemProps) {
  const ctx = useMenuRoot();

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        if (disabled) return;
        onSelect?.();
        ctx?.setOpen(false);
      }}
      className={cn(
        "flex w-full items-center gap-2.5 px-3 py-2 text-left",
        "font-architect text-[14px] transition-colors select-none outline-none",
        "rounded-sm",
        danger ? "text-[#9f3a36]" : "text-ink",
        disabled
          ? "cursor-not-allowed opacity-40"
          : "hover:bg-black/[0.04]",
        className,
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="flex-1 min-w-0">{children}</span>
    </button>
  );
}
MenuItemInner.displayName = "MenuItem";

/* -------------------------------------------------------------------------- */
/*  Checkbox                                                                  */
/* -------------------------------------------------------------------------- */

export interface MenuCheckboxProps {
  children?: React.ReactNode;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

function MenuCheckboxInner({
  children,
  checked = false,
  onChange,
}: MenuCheckboxProps) {
  const ctx = useMenuRoot();

  return (
    <button
      type="button"
      onClick={() => {
        onChange?.(!checked);
      }}
      className={cn(
        "relative flex w-full cursor-default select-none items-center",
        "rounded-sm py-2 pl-9 pr-3",
        "font-architect text-[14px] text-ink outline-none",
        "hover:bg-black/[0.04] transition-colors",
      )}
    >
      <span className="absolute left-3 flex h-3.5 w-3.5 items-center justify-center">
        {checked && <Check className="h-4 w-4" />}
      </span>
      {children}
    </button>
  );
}
MenuCheckboxInner.displayName = "MenuCheckbox";

/* -------------------------------------------------------------------------- */
/*  Radio                                                                     */
/* -------------------------------------------------------------------------- */

export interface MenuRadioProps {
  children?: React.ReactNode;
  value: string;
  group?: string;
  selected?: boolean;
  onSelect?: () => void;
}

function MenuRadioInner({
  children,
  selected,
  onSelect,
}: MenuRadioProps) {
  const ctx = useMenuRoot();

  return (
    <button
      type="button"
      onClick={() => {
        onSelect?.();
        ctx?.setOpen(false);
      }}
      className={cn(
        "relative flex w-full cursor-default select-none items-center",
        "rounded-sm py-2 pl-9 pr-3",
        "font-architect text-[14px] text-ink outline-none",
        "hover:bg-black/[0.04] transition-colors",
      )}
    >
      <span className="absolute left-3 flex h-3.5 w-3.5 items-center justify-center">
        {selected && <Circle className="h-2 w-2 fill-current" />}
      </span>
      {children}
    </button>
  );
}
MenuRadioInner.displayName = "MenuRadio";

/* -------------------------------------------------------------------------- */
/*  Label                                                                     */
/* -------------------------------------------------------------------------- */

export interface MenuLabelProps {
  children?: React.ReactNode;
}

function MenuLabelInner({ children }: MenuLabelProps) {
  return (
    <div className="px-3 py-2 font-caveat text-xs uppercase tracking-wider text-ink-muted/60">
      {children}
    </div>
  );
}
MenuLabelInner.displayName = "MenuLabel";

/* -------------------------------------------------------------------------- */
/*  Separator                                                                 */
/* -------------------------------------------------------------------------- */

function MenuSeparatorInner() {
  return (
    <div className="px-3 py-1">
      <SketchDivider variant="wavy" color="#d4cfc2" strokeWidth={1.2} />
    </div>
  );
}
MenuSeparatorInner.displayName = "MenuSeparator";

/* -------------------------------------------------------------------------- */
/*  Submenu                                                                   */
/* -------------------------------------------------------------------------- */

export interface MenuSubmenuProps {
  children?: React.ReactNode;
  label: string;
}

function MenuSubmenuInner({ children, label }: MenuSubmenuProps) {
  const [hover, setHover] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const measure = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPos({
        top: rect.top - 4,
        left: rect.right + 4,
      });
    }
  }, []);

  useEffect(() => {
    if (hover) measure();
  }, [hover, measure]);

  /* close submenu when mouse leaves both trigger and sub content */
  useEffect(() => {
    if (!hover) return;
    const handleMouse = (e: MouseEvent) => {
      const target = e.target as Node;
      const inTrigger = triggerRef.current?.contains(target);
      const inSub = subRef.current?.contains(target);
      if (!inTrigger && !inSub) setHover(false);
    };
    document.addEventListener("mousemove", handleMouse);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setHover(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousemove", handleMouse);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [hover]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onMouseEnter={() => setHover(true)}
        className={cn(
          "flex w-full items-center gap-2.5 px-3 py-2 text-left",
          "font-architect text-[14px] text-ink transition-colors",
          "rounded-sm select-none outline-none",
          "hover:bg-black/[0.04]",
        )}
      >
        <span className="flex-1 min-w-0">{label}</span>
        <ChevronRight className="h-4 w-4 shrink-0" />
      </button>
      {hover &&
        createPortal(
          <div
            ref={subRef}
            className="fixed z-50"
            style={{ top: pos.top, left: pos.left }}
          >
            <MenuPanel>{children}</MenuPanel>
          </div>,
          document.body,
        )}
    </>
  );
}
MenuSubmenuInner.displayName = "MenuSubmenu";

/* -------------------------------------------------------------------------- */
/*  Shortcut                                                                  */
/* -------------------------------------------------------------------------- */

export interface MenuShortcutProps {
  keys: string[];
}

function MenuShortcutInner({ keys }: MenuShortcutProps) {
  return (
    <div className="ml-auto flex shrink-0 items-center gap-0.5 pl-6">
      {keys.map((k, i) => (
        <kbd
          key={i}
          className={cn(
            "inline-flex h-5 min-w-[20px] items-center justify-center",
            "rounded px-1 font-architect text-[10px] text-ink-muted/60",
          )}
          style={{
            border: "1px solid rgba(0,0,0,0.12)",
            background: "rgba(0,0,0,0.035)",
          }}
        >
          {k}
        </kbd>
      ))}
    </div>
  );
}
MenuShortcutInner.displayName = "MenuShortcut";

/* -------------------------------------------------------------------------- */
/*  Standalone Menu (no Root — static content panel)                          */
/* -------------------------------------------------------------------------- */

export interface MenuProps {
  children?: React.ReactNode;
  className?: string;
}

function MenuInner({ children, className }: MenuProps) {
  return (
    <MenuPanel className={className}>
      {children}
    </MenuPanel>
  );
}
MenuInner.displayName = "Menu";

/* -------------------------------------------------------------------------- */
/*  Compound export                                                           */
/* -------------------------------------------------------------------------- */

export const Menu = Object.assign(MenuInner, {
  Root: MenuRootInner,
  Trigger: MenuTriggerInner,
  Content: MenuContentInner,
  Item: MenuItemInner,
  Checkbox: MenuCheckboxInner,
  Radio: MenuRadioInner,
  Label: MenuLabelInner,
  Separator: MenuSeparatorInner,
  Submenu: MenuSubmenuInner,
  Shortcut: MenuShortcutInner,
});

// All types exported via their interface declarations above
