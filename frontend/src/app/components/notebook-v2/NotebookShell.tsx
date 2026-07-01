import { useEffect, useState } from "react";
import { useNotebookV2Store } from "../../stores/useNotebookV2Store";
import { projectDocToFlat } from "../../../lib/blocksuite/project-flat";
import { NotebookSpiral } from "@/paper-ui/components/decorations";
import type { Doc } from "../../../lib/blocksuite/api";

/**
 * Paper frame around a BlockSuite editor: title strip, spiral binding,
 * outline sidebar (collapsible), reading-mode toggle. Recomputes the outline
 * from the doc on every block update.
 */
export function NotebookShell({
  doc,
  editor,
}: {
  doc: Doc | null;
  editor: React.ReactNode;
}) {
  const title = useNotebookV2Store((s) => s.title);
  const subtitle = useNotebookV2Store((s) => s.subtitle);
  const sidebarOpen = useNotebookV2Store((s) => s.sidebarOpen);
  const readingMode = useNotebookV2Store((s) => s.readingMode);
  const toggleSidebar = useNotebookV2Store((s) => s.toggleSidebar);
  const setReadingMode = useNotebookV2Store((s) => s.setReadingMode);
  const outline = useNotebookV2Store((s) => s.outline);
  const setOutline = useNotebookV2Store((s) => s.setOutline);

  // Force a re-render when the doc's slots fire so the outline refreshes.
  const [, force] = useState(0);
  useEffect(() => {
    if (!doc) return;
    const update = () => {
      const flat = projectDocToFlat(doc);
      setOutline(
        flat
          .map((b) => ({
            blockId: b.id ?? "",
            level: b.type === "heading" ? 1 : 0,
            text: String(b.text ?? ""),
            page: 0,
          }))
          .filter((e) => e.level > 0),
      );
      force((n) => n + 1);
    };
    update();
    const sub = doc.slots.blockUpdated.on(update);
    return () => sub.dispose();
  }, [doc, setOutline]);

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-paper">
      {sidebarOpen && (
        <aside className="w-64 shrink-0 overflow-y-auto border-r border-ink/10 bg-paper/80 p-4">
          <div className="mb-2 font-caveat text-sm uppercase tracking-wide text-ink/50">Outline</div>
          {outline.length === 0 ? (
            <p className="text-xs text-ink/40">No headings yet.</p>
          ) : (
            <ul className="space-y-1 text-sm text-ink/80">
              {outline.map((e) => (
                <li key={e.blockId} className="truncate">• {e.text}</li>
              ))}
            </ul>
          )}
        </aside>
      )}

      <div className="relative flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-ink/10 bg-paper/60 px-4 py-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleSidebar}
              className="rounded px-2 py-1 text-xs text-ink/60 hover:bg-ink/5"
              aria-label="Toggle sidebar"
            >
              ☰
            </button>
            <div>
              <div className="font-architect text-base text-ink/90">{title || "Untitled notebook"}</div>
              {subtitle && <div className="font-caveat text-xs text-ink/50">{subtitle}</div>}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setReadingMode(!readingMode)}
              className="rounded border border-ink/20 px-2 py-1 text-ink/70 hover:bg-ink/5"
            >
              {readingMode ? "Edit" : "Reading"}
            </button>
          </div>
        </header>

        <div className="relative flex min-h-0 flex-1 items-stretch justify-center overflow-auto">
          <NotebookSpiral className="sticky left-0 top-0 z-10 h-8 w-8 shrink-0 self-start" />
          <div className="min-w-0 flex-1">{editor}</div>
        </div>
      </div>
    </div>
  );
}
