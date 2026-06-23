import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { GraduationCap, PanelLeftClose, PanelLeft, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { navItems } from "../../lib/nav";
// Removed mock courses import
import { useUIStore } from "../../stores/useUIStore";
import { cn } from "../ui/utils";
import { api } from "../../lib/api";
import type { Course } from "../../lib/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../ui/tooltip";

const groupLabels: Record<string, string> = {
  main: "Library",
  workspace: "Workspace",
  study: "Study Tools",
  system: "System",
};

export function AppSidebar() {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggle = useUIStore((s) => s.toggleSidebar);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    let cancelled = false;
    api
      .listCourses()
      .then((cs) => {
        if (!cancelled) setCourses(cs);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const groups = ["main", "workspace", "study", "system"] as const;

  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 280 }}
      transition={{ type: "spring", stiffness: 320, damping: 34 }}
      className="relative z-20 flex h-full flex-col border-r border-sidebar-border bg-sidebar"
    >
      {/* Brand */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <GraduationCap className="size-5" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="truncate font-display text-[17px] font-medium tracking-tight text-foreground">
              ScholarAI
            </div>
            <div className="truncate text-[11px] uppercase tracking-wider text-muted-foreground">
              Study Library
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {groups.map((group) => (
          <div key={group} className="mb-5">
            {!collapsed && (
              <div className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                {groupLabels[group]}
              </div>
            )}
            <div className="space-y-1">
              {navItems
                .filter((i) => i.group === group)
                .map((item) => {
                  const link = (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === "/"}
                      className={({ isActive }) =>
                        cn(
                          "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                          collapsed && "justify-center px-0",
                          isActive
                            ? "bg-sidebar-accent text-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <motion.span
                              layoutId="active-pill"
                              className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-violet"
                            />
                          )}
                          <item.icon
                            className={cn(
                              "size-[18px] shrink-0",
                              isActive ? "text-violet" : "text-muted-foreground group-hover:text-foreground",
                            )}
                          />
                          {!collapsed && <span className="truncate">{item.label}</span>}
                          {!collapsed && item.shortcut && (
                            <kbd className="ml-auto hidden rounded border border-border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground group-hover:inline-block">
                              {item.shortcut}
                            </kbd>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                  return collapsed ? (
                    <Tooltip key={item.to} delayDuration={0}>
                      <TooltipTrigger asChild>{link}</TooltipTrigger>
                      <TooltipContent side="right">{item.label}</TooltipContent>
                    </Tooltip>
                  ) : (
                    link
                  );
                })}
            </div>
          </div>
        ))}

        {!collapsed && (
          <div className="mb-2">
            <div className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
              Courses
            </div>
            <div className="space-y-1">
              {courses.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent/60"
                >
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: c.color }}
                  />
                  <span className="truncate">{c.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{c.documents}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3">
        {!collapsed && (
          <div className="mb-3 rounded-lg border border-border bg-muted/50 p-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Sparkles className="size-3.5 text-violet" /> Quick tip
            </div>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Press <kbd className="rounded border border-border bg-card px-1 font-mono">⌘K</kbd> to
              search anything instantly.
            </p>
          </div>
        )}
        <button
          onClick={toggle}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-foreground",
            collapsed && "justify-center px-0",
          )}
        >
          {collapsed ? <PanelLeft className="size-[18px]" /> : <PanelLeftClose className="size-[18px]" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </motion.aside>
  );
}
