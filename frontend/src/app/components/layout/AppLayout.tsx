import { Outlet } from "react-router";
import { AppSidebar } from "./AppSidebar";
import { Topbar } from "./Topbar";
import { CommandMenu } from "../CommandMenu";

export function AppLayout() {
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
