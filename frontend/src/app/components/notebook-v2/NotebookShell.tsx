import { useCallback, useEffect, useState } from "react";
import { useNotebookV2Store } from "../../stores/useNotebookV2Store";
import { projectDocToFlat } from "../../lib/blocksuite/project-flat";
import { saveNotebookDoc } from "../../lib/blocksuite/notebookStore";
import { NotebookEdge } from "@/paper-ui/components/decorations";
import { BlockInsertToolbar } from "./BlockInsertToolbar";
import type { Doc } from "../../lib/blocksuite/api";

/**
 * Paper frame around a BlockSuite editor: spiral left edge, title strip,
 * outline sidebar, block-insert toolbar, reading-mode toggle, save button.
 */
export function NotebookShell({
  doc,
  editor,
}: {
  doc: Doc | null;
  editor: React.ReactNode;
}) {
  const notebookId = useNotebookV2Store((s) => s.notebookId);
  const title = useNotebookV2Store((s) => s.title);
  const subtitle = useNotebookV2Store((s) => s.subtitle);
  const sidebarOpen = useNotebookV2Store((s) => s.sidebarOpen);
  const readingMode = useNotebookV2Store((s) => s.readingMode);
  const toggleSidebar = useNotebookV2Store((s) => s.toggleSidebar);
  const setReadingMode = useNotebookV2Store((s) => s.setReadingMode);
  const outline = useNotebookV2Store((s) => s.outline);
  const setOutline = useNotebookV2Store((s) => s.setOutline);
  const [saving, setSaving] = useState(false);

  const handleSave = useCallback(async () => {
    if (!notebookId || !doc || saving) return;
    setSaving(true);
    try {
      await saveNotebookDoc(notebookId, doc);
    } catch {
      // best-effort
    } finally {
      setSaving(false);
    }
  }, [notebookId, doc, saving]);

  const [, force] = useState(0);
  useEffect(() => {
    if (!doc) return;
    const update = () => {
      const flat = projectDocToFlat(doc);
      setOutline(
        flat
          .map((b) => ({ blockId: String(b.id ?? ""), level: b.type === "heading" ? 1 : 0, text: String(b.text ?? ""), page: 0 }))
          .filter((e) => e.level > 0),
      );
      force((n) => n + 1);
    };
    update();
    const sub = doc.slots.blockUpdated.on(update);
    return () => sub.dispose();
  }, [doc, setOutline]);

  return (
    <div className="notebook-v2 relative flex h-full w-full overflow-hidden notebook-v2-desk">
      {/* Outline sidebar */}
      {sidebarOpen && (
        <aside className="w-56 shrink-0 overflow-y-auto border-r border-ink/10 bg-paper/90 p-4">
          <div className="mb-2 font-caveat text-xs uppercase tracking-widest text-ink/40">Outline</div>
          {outline.length === 0 ? (
            <p className="text-xs text-ink/30 font-caveat">No headings yet.</p>
          ) : (
            <ul className="space-y-1">
              {outline.map((e) => (
                <li key={e.blockId} className="truncate font-caveat text-sm text-ink/70">• {e.text}</li>
              ))}
            </ul>
          )}
        </aside>
      )}

      {/* Main notebook area */}
      <div className="relative flex min-w-0 flex-1 flex-col">

        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-ink/10 bg-paper/80 px-4 py-2 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <button type="button" onClick={toggleSidebar} className="rounded px-1.5 py-1 text-ink/50 hover:text-ink/80" aria-label="Toggle sidebar">
              ☰
            </button>
            <div>
              <div className="font-architect text-sm font-semibold text-ink/90">{title || "Untitled notebook"}</div>
              {subtitle && <div className="font-caveat text-[11px] text-ink/50">{subtitle}</div>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-caveat text-[11px] text-ink/40">{saving ? "Saving…" : ""}</span>
            <button type="button" onClick={handleSave} disabled={saving}
              className="rounded border border-ink/20 px-2 py-0.5 font-caveat text-xs text-ink/60 hover:bg-ink/5 disabled:opacity-40">
              Save
            </button>
            <button type="button" onClick={() => setReadingMode(!readingMode)}
              className="rounded border border-ink/20 px-2 py-0.5 font-caveat text-xs text-ink/60 hover:bg-ink/5">
              {readingMode ? "Edit" : "Reading"}
            </button>
          </div>
        </header>

        {/* Paper + editor scroll area */}
        <div className="flex min-h-0 flex-1 overflow-auto bg-[#e8e3d9]">

          {/* Spiral left binding */}
          <div className="sticky left-0 top-0 z-10 h-full shrink-0">
            <NotebookEdge className="h-full w-10" />
          </div>

          {/* Paper page */}
          <div className="mx-auto my-8 w-full max-w-3xl flex-1 rounded-md bg-paper shadow-md"
               style={{ minHeight: "calc(100vh - 120px)" }}>

            {/* Lined rules (::before) and margin (::after) are in notebook-v2.css via .notebook-v2-page */}
            <div className="notebook-v2-page h-full w-full">
              {editor}
            </div>
          </div>

          {/* Breathing room right */}
          <div className="w-10 shrink-0" />
        </div>

        {/* Bottom block-insert toolbar */}
        {!readingMode && <BlockInsertToolbar doc={doc} />}
      </div>
    </div>
  );
}
