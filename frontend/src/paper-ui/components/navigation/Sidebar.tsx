import React from "react";
import { GraduationCap, type LucideIcon } from "lucide-react";
import { cn } from "@/paper-ui/utils";
import { SketchBorder } from "@/paper-ui/core";
import { SketchDivider } from "../decorations/SketchDivider";

export interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

/** A nav row. Active state is a soft yellow marker swash, not a rectangle. */
export function SidebarItem({ icon: Icon, label, active, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors",
        active ? "text-ink" : "text-ink-muted hover:bg-black/[0.035]",
      )}
    >
      {active && (
        <svg
          className="pointer-events-none absolute inset-x-1 inset-y-1 -z-0 h-[calc(100%-8px)] w-[calc(100%-8px)] overflow-visible"
          viewBox="0 0 100 32"
          preserveAspectRatio="none"
          style={{ transformOrigin: "left center", animation: "paper-marker-sweep 0.4s ease-out both" }}
          aria-hidden
        >
          <path
            d="M4,17 Q30,9 60,13 T97,12"
            fill="none"
            stroke="#f6e27a"
            strokeWidth={20}
            strokeLinecap="round"
            opacity={0.7}
          />
        </svg>
      )}
      <Icon
        size={18}
        strokeWidth={active ? 2.4 : 2}
        className={cn("relative z-[1] shrink-0", active ? "text-ink" : "text-ink-muted")}
      />
      <span className={cn("relative z-[1] font-architect text-[15px]", active && "font-medium")}>{label}</span>
    </button>
  );
}

export function SidebarDivider() {
  return (
    <div className="my-3 px-3">
      <SketchDivider variant="wavy" />
    </div>
  );
}

export interface SidebarHeaderProps {
  title: string;
  subtitle?: string;
}

export function SidebarHeader({ title, subtitle }: SidebarHeaderProps) {
  return (
    <div className="leading-tight">
      <h2 className="font-caveat text-[42px] font-bold leading-none text-ink">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-1 font-architect text-xs text-ink-muted">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export interface SidebarGroupProps {
  /** Optional uppercase label shown above the group. */
  label?: string;
  children: React.ReactNode;
  className?: string;
}

/** Groups sidebar items under a small section label. */
export function SidebarGroup({ label, children, className }: SidebarGroupProps) {
  return (
    <div className={cn("mb-1", className)}>
      {label && (
        <div className="select-none px-4 pb-1 pt-4">
          <span className="font-architect text-[10.5px] uppercase tracking-[0.14em] text-ink-muted/55">
            {label}
          </span>
        </div>
      )}
      {children}
    </div>
  );
}

export interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}

/** The notebook-margin sidebar shell. */
export function Sidebar({ children, className }: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex h-full w-64 shrink-0 flex-col overflow-y-auto  paper-scrollbar",
        className,
      )}
      style={{ borderRight: "1.5px solid #c8c0b0" }}
    >
      {children}
    </aside>
  );
}
