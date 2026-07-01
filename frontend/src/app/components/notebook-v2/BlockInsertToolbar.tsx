import type { Doc } from "../../lib/blocksuite/api";
import { getNoteId } from "../../lib/blocksuite/collection";

const ITEMS = [
  { label: "Text",    icon: "T",   action: insertText },
  { label: "Heading", icon: "H",   action: insertHeading },
  { label: "Sticky",  icon: "□",   action: insertSticky },
  { label: "Diagram", icon: "⊘",  action: insertDiagram },
  { label: "Code",    icon: "</>", action: insertCode },
  { label: "Callout", icon: "!",   action: insertCallout },
  { label: "Divider", icon: "—",   action: insertDivider },
] as const;

function noteId(doc: Doc): string | null {
  try { return getNoteId(doc); } catch { return null; }
}

function insertText(doc: Doc) {
  const n = noteId(doc); if (!n) return;
  doc.addBlock("affine:paragraph", { text: new doc.Text("") } as never, n);
}
function insertHeading(doc: Doc) {
  const n = noteId(doc); if (!n) return;
  doc.addBlock("affine:paragraph", { type: "h2", text: new doc.Text("") } as never, n);
}
function insertSticky(doc: Doc) {
  const n = noteId(doc); if (!n) return;
  doc.addBlock("scholar:sticky-note" as never, { text: "", color: "yellow", pin: "push-pin", align: "inline" } as never, n);
}
function insertDiagram(doc: Doc) {
  const n = noteId(doc); if (!n) return;
  doc.addBlock("scholar:diagram" as never, { code: "graph TD;\n  A --> B" } as never, n);
}
function insertCode(doc: Doc) {
  const n = noteId(doc); if (!n) return;
  doc.addBlock("affine:code", { language: "", text: new doc.Text("") } as never, n);
}
function insertCallout(doc: Doc) {
  const n = noteId(doc); if (!n) return;
  doc.addBlock("scholar:callout" as never, { tone: "note", text: "" } as never, n);
}
function insertDivider(doc: Doc) {
  const n = noteId(doc); if (!n) return;
  doc.addBlock("affine:divider", {} as never, n);
}

export function BlockInsertToolbar({ doc }: { doc: Doc | null }) {
  if (!doc) return null;
  return (
    <div className="flex items-center justify-center gap-1 border-t border-ink/10 bg-paper/90 px-4 py-2 backdrop-blur-sm">
      {ITEMS.map(({ label, icon, action }) => (
        <button
          key={label}
          type="button"
          title={`Insert ${label}`}
          onClick={() => action(doc)}
          className="flex items-center gap-1.5 rounded px-3 py-1.5 text-xs text-ink/60 transition-colors hover:bg-ink/8 hover:text-ink/90 font-caveat"
        >
          <span className="text-sm leading-none">{icon}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
