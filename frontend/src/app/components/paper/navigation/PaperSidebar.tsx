import React from "react";
import { motion } from "motion/react";
import { PanelLeft, PanelLeftClose } from "lucide-react";
import { cn } from "../../ui/utils";
import { SketchBorder } from "../foundation/SketchBorder";
import { SketchDivider } from "../decorations/SketchDivider";

// ─────────────────────────────────────── types

export interface PaperNavItem {
  id: string;
  label: string;
  /** Any ReactNode — doodle icons, Lucide icons, SVGs. */
  icon: React.ReactNode;
  badge?: string | number;
}

export interface PaperNavGroup {
  id: string;
  /** Optional uppercase label rendered above the group when expanded. */
  label?: string;
  items: PaperNavItem[];
}

// ─────────────────────────────────────── SidebarItem

export interface PaperSidebarItemProps {
  item: PaperNavItem;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

/**
 * Single nav row. Active state renders a hand-drawn sticker (SketchBorder fill +
 * FoldedCorner) so the current page looks physically "pinned" to the sidebar.
 */
export function PaperSidebarItem({
  item,
  active = false,
  collapsed = false,
  onClick,
}: PaperSidebarItemProps) {
  return (
    <button
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex w-full items-center rounded-md overflow-visible",
        "transition-colors",
        collapsed ? "justify-center p-[10px]" : "gap-[11px] px-2 py-[9px]",
        !active && "hover:bg-black/[0.035]",
      )}
    >
      {/* Active sticker surface */}
      {active && (
        <>
          <SketchBorder
            fill="#fffefb"
            stroke="#c0b9ae"
            strokeWidth={1.4}
            roughness={1.5}
            bowing={0.5}
            radius={5}
            shadow={1}
            shadowColor="rgba(0,0,0,0.09)"
            bleed={3}
          />
        </>
      )}

      {/* Icon */}
      <span
        className={cn(
          "relative z-[1] flex shrink-0 items-center justify-center transition-colors",
          active ? "text-ink" : "text-ink-muted group-hover:text-ink",
        )}
      >
        {item.icon}
      </span>

      {/* Label — always in DOM; opacity transition matches the width animation */}
      <span
        className={cn(
          "relative z-[1] flex-1 min-w-0 truncate text-left font-architect text-[14px]",
          "transition-opacity duration-200",
          active ? "font-semibold text-ink" : "text-ink-muted group-hover:text-ink",
          collapsed ? "pointer-events-none opacity-0" : "opacity-100",
        )}
        aria-hidden={collapsed}
      >
        {item.label}
      </span>

      {/* Badge */}
      {item.badge !== undefined && !collapsed && (
        <span className="relative z-[1] ml-auto shrink-0 rounded-full bg-ink/[0.08] px-1.5 py-0.5 font-architect text-[10px] leading-none text-ink-muted transition-opacity duration-200">
          {item.badge}
        </span>
      )}
    </button>
  );
}

// ─────────────────────────────────────── CollapseButton

export interface PaperSidebarCollapseButtonProps {
  collapsed: boolean;
  onToggle: () => void;
  /** Extra classes — use to place this button anywhere outside the sidebar. */
  className?: string;
}

/**
 * Standalone collapse/expand trigger. Export separately so it can live in a
 * topbar, a drawer handle, or any other surface to control sidebar state.
 */
export function PaperSidebarCollapseButton({
  collapsed,
  onToggle,
  className,
}: PaperSidebarCollapseButtonProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      className={cn(
        "flex items-center justify-center rounded-md p-2",
        "text-ink-muted transition-colors hover:bg-black/[0.04] hover:text-ink",
        className,
      )}
    >
      {collapsed ? (
        <PanelLeft size={17} strokeWidth={1.8} />
      ) : (
        <PanelLeftClose size={17} strokeWidth={1.8} />
      )}
    </button>
  );
}

// ─────────────────────────────────────── Sidebar

export interface PaperSidebarProps {
  /** Nav groups. Single group with no label → flat item list. */
  groups: PaperNavGroup[];
  activeId?: string;
  onNavigate?: (id: string) => void;
  collapsed?: boolean;
  /** Called when the built-in footer collapse button is clicked. */
  onCollapse?: (collapsed: boolean) => void;
  /** Slot above the nav — logo, app title, search box, etc. */
  header?: React.ReactNode;
  /** Slot below the nav, above the collapse button — tips, user info, etc. */
  footer?: React.ReactNode;
  className?: string;
}

export function PaperSidebar({
  groups,
  activeId,
  onNavigate,
  collapsed = false,
  onCollapse,
  header,
  footer,
  className,
}: PaperSidebarProps) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 68 : 240 }}
      transition={{ type: "spring", stiffness: 340, damping: 36 }}
      className={cn(
        "relative z-20 flex h-full shrink-0 flex-col overflow-x-hidden",
        "border-r border-[rgba(0,0,0,0.08)] bg-sidebar",
        className,
      )}
    >
      {/* Header */}
      {header && (
        <div
          className={cn(
            "shrink-0 border-b border-[rgba(0,0,0,0.05)]",
            collapsed ? "flex justify-center px-3 py-4" : "px-4 py-4",
          )}
        >
          <div
            className={cn(
              "transition-opacity duration-200",
              collapsed ? "opacity-0 pointer-events-none" : "opacity-100",
            )}
          >
            {header}
          </div>
        </div>
      )}

      {/* Nav */}
      <nav
        className={cn(
          "flex-1 overflow-y-auto overflow-x-hidden paper-scrollbar py-2",
          collapsed ? "px-2" : "px-3",
        )}
      >
        {groups.map((group, gi) => (
          <div key={group.id} className={cn("mb-1", gi > 0 && "mt-2")}>
            {/* Group divider between groups */}
            {gi > 0 && (
              <div className="mb-2 px-2">
                <SketchDivider variant="wavy" />
              </div>
            )}
            {/* Group label */}
            {!collapsed && group.label && (
              <div
                className={cn(
                  "mb-1 px-3 pt-1 transition-opacity duration-200",
                  collapsed ? "opacity-0" : "opacity-100",
                )}
              >
                <span className="font-architect text-[10px] uppercase tracking-[0.14em] text-ink-muted/50">
                  {group.label}
                </span>
              </div>
            )}

            <div className="space-y-0.5">
              {group.items.map((item) => (
                <PaperSidebarItem
                  key={item.id}
                  item={item}
                  active={item.id === activeId}
                  collapsed={collapsed}
                  onClick={() => onNavigate?.(item.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div
        className={cn(
          "shrink-0 border-t border-[rgba(0,0,0,0.06)] py-2",
          collapsed ? "flex flex-col items-center gap-1 px-2" : "px-3",
        )}
      >
        {/* Optional footer slot */}
        {footer && (
          <div
            className={cn(
              "mb-1 transition-opacity duration-200",
              collapsed ? "opacity-0 pointer-events-none h-0 overflow-hidden" : "opacity-100",
            )}
          >
            {footer}
          </div>
        )}

        {/* Built-in collapse button */}
        <button
          onClick={() => onCollapse?.(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "flex items-center rounded-md text-ink-muted transition-colors hover:bg-black/[0.035] hover:text-ink",
            collapsed ? "justify-center p-2" : "w-full gap-3 px-3 py-2",
          )}
        >
          {collapsed ? (
            <PanelLeft size={17} strokeWidth={1.8} />
          ) : (
            <>
              <PanelLeftClose size={17} strokeWidth={1.8} />
              <span className="font-architect text-[13px]">Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
