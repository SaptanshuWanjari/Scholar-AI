"use client";

import { useState, useRef } from "react";
import { PanelLeftClose, PanelLeft, Wand2, ScrollText, Sparkles, Quote } from "lucide-react";
import { toast } from "sonner";
import { cn } from "../ui/utils";
import { useNotebookV2Store } from "../../stores/useNotebookV2Store";
import { OutlineSidebar } from "./OutlineSidebar";
import { PageRenderer } from "./PageRenderer";
import { PageNavigation } from "./PageNavigation";
import { BlockToolbar } from "./BlockToolbar";
import { SelectionToolbar } from "../SelectionToolbar";
import { api } from "../../lib/api";

export function NotebookShell() {
  const notebook = useNotebookV2Store((s) => s.notebook);
  const activePageId = useNotebookV2Store((s) => s.activePageId);
  const addBlock = useNotebookV2Store((s) => s.addBlock);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [assisting, setAssisting] = useState(false);
  
  const contentRef = useRef<HTMLElement>(null);

  if (!notebook) {
    return (
      <div className="flex h-full items-center justify-center bg-paper text-ink/30">
        <p className="font-caveat text-lg">No notebook loaded.</p>
      </div>
    );
  }

  // Find active page index to determine left/right pages
  const activeIndex = notebook.pages.findIndex(p => p.id === activePageId);
  const isLeftPage = activeIndex % 2 === 0;
  
  // A 2-page spread shows an even page on the left, and an odd page on the right.
  // We'll calculate the base index (the even page index)
  const baseIndex = isLeftPage ? activeIndex : activeIndex - 1;
  const leftPageId = notebook.pages[baseIndex]?.id;
  const rightPageId = notebook.pages[baseIndex + 1]?.id;

  async function runAssist(action: "explain" | "summarize" | "improve", selected: string) {
    const sel = selected.trim();
    if (!sel || !activePageId || assisting) return;

    const labels: Record<typeof action, string> = {
      explain: "Explaining selection…",
      summarize: "Summarizing selection…",
      improve: "Improving selection…",
    };
    
    setAssisting(true);
    const toastId = toast.loading(labels[action]);
    
    try {
      const { text } = await api.notebookAssist(action, sel, notebook?.metadata.course ?? null);
      
      addBlock(activePageId, "ai-answer", {
        question: `${action[0].toUpperCase()}${action.slice(1)}: ${sel.slice(0, 80)}${sel.length > 80 ? "…" : ""}`,
        answer: text,
        confidence: 1,
        sources: 0,
      });
      
      toast.success("AI block added", { id: toastId });
    } catch (e: any) {
      toast.error(`AI assist failed: ${e.message}`, { id: toastId });
    } finally {
      setAssisting(false);
    }
  }

  const actions = [
    { label: "Explain", icon: Wand2, onSelect: (text: string) => runAssist("explain", text) },
    { label: "Summarize", icon: ScrollText, onSelect: (text: string) => runAssist("summarize", text) },
    { label: "Improve", icon: Sparkles, onSelect: (text: string) => runAssist("improve", text) },
    { label: "Cite", icon: Quote, onSelect: () => toast.success("Citation saved") },
  ];

  return (
    <div className="flex h-full overflow-hidden bg-paper">
      <aside
        className={cn(
          "shrink-0 transition-[width] duration-200 ease-in-out overflow-hidden z-20 border-r border-tape/20 bg-paper",
          sidebarOpen ? "w-[260px]" : "w-0",
        )}
      >
        <OutlineSidebar />
      </aside>

      <main ref={contentRef} className="relative flex flex-1 flex-col overflow-hidden notebook-v2-desk">
        <SelectionToolbar containerRef={contentRef} actions={actions} />
        
        <header className="flex items-start gap-3 px-6 py-4 z-10 shrink-0">
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            className="mt-1 text-ink/40 transition-colors hover:text-ink/80"
            title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
          >
            {sidebarOpen ? <PanelLeftClose className="size-5" /> : <PanelLeft className="size-5" />}
          </button>
          <div>
            <h1 className="font-architect text-2xl font-bold text-ink/90">{notebook.title}</h1>
            {notebook.subtitle && <p className="mt-0.5 font-caveat text-sm text-ink/60">{notebook.subtitle}</p>}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-8 pb-32">
          <div className="notebook-v2-spread mx-auto max-w-[1400px] flex justify-center items-stretch min-h-[70vh]">
            {/* Left Page */}
            {leftPageId ? (
              <div className="notebook-v2-page left-page flex-1 max-w-[650px] relative">
                <div className="notebook-v2-page-header">
                  <span className="font-caveat text-ink/40">Page {baseIndex + 1} of {notebook.pages.length}</span>
                </div>
                <PageRenderer pageId={leftPageId} />
              </div>
            ) : (
              <div className="flex-1 max-w-[650px]" /> /* Empty space if no left page */
            )}

            {/* Spiral Binding */}
            <div className="notebook-v2-spiral w-[32px] shrink-0 relative z-10" />

            {/* Right Page */}
            {rightPageId ? (
              <div className="notebook-v2-page right-page flex-1 max-w-[650px] relative">
                <div className="notebook-v2-page-header">
                  <span className="font-caveat text-ink/40">Page {baseIndex + 2} of {notebook.pages.length}</span>
                </div>
                <PageRenderer pageId={rightPageId} />
              </div>
            ) : (
               <div className="flex-1 max-w-[650px] opacity-0 pointer-events-none" />
            )}
          </div>
        </div>

        {activePageId && (
          <div className="pointer-events-none absolute bottom-16 left-0 right-0 flex justify-center z-30">
            <div className="pointer-events-auto">
              <BlockToolbar pageId={activePageId} />
            </div>
          </div>
        )}

        <div className="shrink-0 border-t border-tape/20 px-6 py-2 bg-paper/80 backdrop-blur z-30">
          <PageNavigation />
        </div>
      </main>
    </div>
  );
}
