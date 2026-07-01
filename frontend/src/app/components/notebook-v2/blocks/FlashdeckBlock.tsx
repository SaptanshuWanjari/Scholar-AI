// @ts-nocheck
import { Layers, Play } from "lucide-react";
import { cn } from "../../ui/utils";
import type { V2Block } from "../../../lib/notebook-v2.types";

export function FlashdeckBlock({ block }: { block: V2Block<"flashdeck">; pageId: string }) {
  const { name, count } = block.content;

  return (
    <div className="group/fd flex w-full flex-col overflow-hidden rounded-xl border border-tape bg-paper shadow-sm transition-colors hover:border-lavender/40">
      <div className="flex items-center gap-3 border-b border-tape/50 bg-lavender/10 px-5 py-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-lavender/20 text-lavender">
          <Layers className="size-5" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <h3 className="truncate text-base font-semibold text-ink">{name || "Flashcard Deck"}</h3>
          <p className="text-sm text-pencil/70">{count} cards generated</p>
        </div>
        <button 
          className="flex h-9 items-center gap-2 rounded-full bg-lavender px-4 text-sm font-medium text-white transition-opacity hover:opacity-90"
          type="button"
        >
          <Play className="size-4 fill-white" /> Review
        </button>
      </div>
      <div className="flex gap-2 px-5 py-3">
        {block.content.cards?.slice(0, 3).map((c, i) => (
          <div key={i} className="flex h-16 flex-1 items-center justify-center rounded border border-tape/40 bg-paper/50 px-3 text-center text-xs text-ink/70">
            <span className="line-clamp-2">{c.front}</span>
          </div>
        ))}
        {count > 3 && (
          <div className="flex h-16 flex-1 items-center justify-center rounded border border-dashed border-tape/60 bg-paper/30 text-xs font-medium text-pencil/50">
            +{count - 3} more
          </div>
        )}
      </div>
    </div>
  );
}
