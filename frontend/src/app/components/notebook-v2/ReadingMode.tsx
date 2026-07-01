import { useNotebookV2Store } from "../../stores/useNotebookV2Store";
import { projectDocToFlat, type FlatBlock } from "../../lib/blocksuite/project-flat";
import { NotebookSpiral } from "@/paper-ui/components/decorations";
import type { Doc } from "../../lib/blocksuite/api";

function splitPages(flat: FlatBlock[]): FlatBlock[][] {
  const pages: FlatBlock[][] = [[]];
  for (const b of flat) {
    if (b.type === "page-break") pages.push([]);
    else pages[pages.length - 1].push(b);
  }
  return pages;
}

function ReadingBlock({ b }: { b: FlatBlock }) {
  if (b.type === "heading") return <h2 className="font-architect text-xl text-ink/90">{String(b.text)}</h2>;
  if (b.type === "callout") return <div className="rounded border border-sky/40 bg-sky/10 p-2 text-sm">{String(b.text)}</div>;
  if (b.type === "code") return <pre className="rounded bg-ink/5 p-2 text-xs">{String(b.code)}</pre>;
  return <p className="text-sm text-ink/80">{String(b.text ?? "")}</p>;
}

function Sheet({ blocks, page }: { blocks: FlatBlock[]; page: number }) {
  return (
    <div className="relative min-h-[70vh] flex-1 rounded-md bg-paper p-8 shadow-sm">
      <div className="mb-2 font-caveat text-xs text-ink/40">Page {page}</div>
      <div className="space-y-2">{blocks.map((b, i) => <ReadingBlock key={i} b={b} />)}</div>
    </div>
  );
}

export function ReadingMode({ doc }: { doc: Doc }) {
  const spreadIndex = useNotebookV2Store((s) => s.spreadIndex);
  const pages = splitPages(projectDocToFlat(doc));
  const left = spreadIndex * 2;
  return (
    <div className="mx-auto flex max-w-[1400px] items-stretch justify-center gap-0">
      <Sheet blocks={pages[left] ?? []} page={left + 1} />
      <NotebookSpiral className="w-8 shrink-0" />
      {pages[left + 1] && <Sheet blocks={pages[left + 1]} page={left + 2} />}
    </div>
  );
}
