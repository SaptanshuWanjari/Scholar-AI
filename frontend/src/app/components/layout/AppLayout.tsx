import { useEffect } from "react";
import { Outlet } from "react-router";
import { AppSidebar } from "./AppSidebar";
import { Topbar } from "./Topbar";
import { CommandMenu } from "../CommandMenu";
import { TourAutoStart } from "../../guidance/components/TourAutoStart";
import { ScratchpadDrawer } from "../scratchpad/ScratchpadDrawer";
import { useScratchpadStore } from "../scratchpad/useScratchpadStore";
import { QuickSettingsPanel } from "../QuickSettingsPanel";
import { useAppearanceStore } from "../../stores/useAppearanceStore";
import { useUIStore } from "../../stores/useUIStore";

export function AppLayout() {
  const readingMode = useAppearanceStore((s) => s.readingMode);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '\\') {
        e.preventDefault();
        useScratchpadStore.getState().toggleDrawer();
        return;
      }

      if (e.ctrlKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        useUIStore.getState().toggleSidebar();
        return;
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {!readingMode && <AppSidebar />}
      <div className="flex min-w-0 flex-1 flex-col">
        {!readingMode && <Topbar />}
        <main className="min-h-0 flex-1 flex flex-col overflow-hidden">
          <Outlet />
        </main>
      </div>
      <CommandMenu />
      <TourAutoStart />
      <ScratchpadDrawer />
      <QuickSettingsPanel />
    </div>
  );
}
