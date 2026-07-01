/**
 * WhiteboardBlock — Static thumbnail of a whiteboard.
 *
 * Click navigates to the live whiteboard editor.
 * Mirrors the existing BlockInner whiteboard pattern.
 */

import { PencilRuler, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router";
import type { V2Block } from "../../../lib/notebook-v2.types";

interface WhiteboardBlockProps {
  block: V2Block<"whiteboard">;
  pageId: string;
}

export function WhiteboardBlock({ block }: WhiteboardBlockProps) {
  const navigate = useNavigate();
  const { whiteboardId, title, thumbnail } = block.content;

  return (
    <button
      type="button"
      onClick={() => navigate(`/whiteboards/${whiteboardId}`)}
      className="group/wb block w-full overflow-hidden rounded-xl border border-tape bg-paper text-left transition-colors hover:border-lavender/40"
    >
      {/* Thumbnail area */}
      <div className="flex aspect-video items-center justify-center overflow-hidden border-b border-tape bg-sage/10">
        {thumbnail ? (
          <img src={thumbnail} alt="" className="h-full w-full object-contain" />
        ) : (
          <PencilRuler className="size-10 text-pencil/30" />
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <span className="flex min-w-0 items-center gap-2.5 text-base font-semibold text-ink">
          <PencilRuler className="size-5 shrink-0 text-lavender" />
          <span className="truncate">{title || "Whiteboard"}</span>
        </span>
        <span className="flex shrink-0 items-center gap-1.5 text-xs text-pencil/50 group-hover/wb:text-lavender">
          Open <ExternalLink className="size-3.5" />
        </span>
      </div>
    </button>
  );
}
