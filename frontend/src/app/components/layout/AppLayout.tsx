import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { AppSidebar } from "./AppSidebar";
import { Topbar } from "./Topbar";
import { CommandMenu } from "../CommandMenu";
import { navItems } from "../../lib/nav";

export function AppLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Skip if a text input is focused or any modifier (except Shift) is held.
      const tag = (e.target as HTMLElement)?.tagName;
      const editable = (e.target as HTMLElement)?.isContentEditable;
      if (tag === "INPUT" || tag === "TEXTAREA" || editable) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const pressed = e.key.toLowerCase();
      const match = navItems.find((item) => item.shortcut?.toLowerCase() === pressed);
      if (match) {
        e.preventDefault();
        navigate(match.to);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [navigate]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="min-h-0 flex-1 flex flex-col overflow-hidden">
          <Outlet />
        </main>
      </div>
      <CommandMenu />
    </div>
  );
}
