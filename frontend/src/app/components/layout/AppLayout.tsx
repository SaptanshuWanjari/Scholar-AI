import { useEffect } from "react";
import { Outlet } from "react-router";
import { AlertTriangle, X } from "lucide-react";
import { AppSidebar } from "./AppSidebar";
import { Topbar } from "./Topbar";
import { CommandMenu } from "../CommandMenu";
import { TourAutoStart } from "../../guidance/components/TourAutoStart";
import { ScratchpadDrawer } from "../scratchpad/ScratchpadDrawer";
import { useScratchpadStore } from "../scratchpad/useScratchpadStore";
import { QuickSettingsPanel } from "../QuickSettingsPanel";
import { useAppearanceStore } from "../../stores/useAppearanceStore";
import { useUIStore } from "../../stores/useUIStore";
import { useEmbeddingStore } from "../../stores/useEmbeddingStore";
import { SketchBorder } from "@/paper-ui/core";
import { PaperButton } from "@paper-ui/components/buttons";
import { api } from "../../lib/api";

function EmbeddingBanner() {
  const { mismatch, dismissed, reindexing, estimatedReindexTime, fetch, dismiss, setReindexing } = useEmbeddingStore();

  if (!mismatch || dismissed) return null;

  const handleReindex = async () => {
    setReindexing(true);
    try {
      await api.reindexAll();
      await fetch();
    } catch {
      // silent
    } finally {
      setReindexing(false);
    }
  };

  return (
    <div className="relative mx-4 mt-1">
      <SketchBorder fill="#fef7e6" stroke="#b07a2e" strokeWidth={1.5} radius={8} shadow={2} bleed={6} />
      <div className="relative z-[1] flex items-center gap-3 px-4 py-3">
        <AlertTriangle size={16} color="#b07a2e" className="shrink-0" />
        <p className="flex-1 font-kalam text-[14px] text-ink">
          Library needs re-indexing — the embedding model changed.
          {estimatedReindexTime && (
            <span className="text-ink-muted ml-1">({estimatedReindexTime})</span>
          )}
        </p>
        <PaperButton tone="dark" size="sm" onClick={handleReindex} disabled={reindexing}>
          {reindexing ? "Re-indexing…" : "Re-index"}
        </PaperButton>
        <button onClick={dismiss} className="text-ink-muted hover:text-ink ml-1 shrink-0 transition-colors">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

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

  useEffect(() => {
    useEmbeddingStore.getState().fetch();
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {!readingMode && <AppSidebar />}
      <div className="flex min-w-0 flex-1 flex-col">
        {!readingMode && <Topbar />}
        {!readingMode && <EmbeddingBanner />}
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
