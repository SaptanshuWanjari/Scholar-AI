import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import { navItems } from "../../lib/nav";
import { useUIStore } from "../../stores/useUIStore";
import { KNOWN_PLUGINS } from "../../plugins/registry";
import { usePluginStore } from "../../plugins/usePluginStore";
import { PaperSidebar } from "@paper-ui/components/navigation";
import type { PaperNavGroup } from "@paper-ui/components/navigation";

const groupLabels: Record<string, string> = {
  main: "Library",
  workspace: "Workspace",
  study: "Study Tools",
  system: "System",
};

export function AppSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggle = useUIStore((s) => s.toggleSidebar);
  const isEnabled = usePluginStore((s) => s.isEnabled);

  const allNavItems = useMemo(() => {
    const pluginItems = KNOWN_PLUGINS.filter((p) => isEnabled(p.id)).flatMap(
      (p) => p.navItems ?? [],
    );
    return [...navItems, ...pluginItems];
  }, [isEnabled]);

  const groups: PaperNavGroup[] = useMemo(
    () =>
      ["main", "workspace", "study", "system"].map((g) => ({
        id: g,
        label: groupLabels[g],
        items: allNavItems
          .filter((i) => i.group === g)
          .map((i) => ({
            id: i.to,
            label: i.label,
            icon: <i.icon size={18} />,
          })),
      })),
    [allNavItems],
  );

  return (
    <PaperSidebar
      groups={groups}
      activeId={pathname}
      onNavigate={navigate}
      collapsed={collapsed}
      onCollapse={() => toggle()}
      header={
        <div className={`flex items-center ${collapsed ? "justify-center w-full" : "gap-3"}`}>
          <div
            className={`relative flex ${collapsed ? "h-10 w-10" : "h-12 w-12"} -rotate-3 items-center justify-center shrink-0`}
            style={{ color: "#fbf8f2" }}
          >
            <span className="relative z-[1] flex items-center justify-center w-full h-full">
              <img
                src="/output.png"
                alt="ScholarAI"
                className={`w-full h-full object-contain ${collapsed ? "scale-[1.1]" : "scale-[1.2]"}`}
              />
            </span>
          </div>
          <div className={`leading-tight min-w-0 ${collapsed ? "hidden" : "block"}`}>
            <div className="truncate font-caveat text-2xl font-bold text-ink">
              ScholarAI
            </div>
            <div className="truncate font-architect text-xs text-ink-muted">
              Study Library
            </div>
          </div>
        </div>
      }
    />
  );
}
