// @ts-nocheck
"use client";

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "../ui/utils";
import type { StickyNoteData } from "../../lib/notebook-v2.types";
import { useNotebookV2Store } from "../../stores/useNotebookV2Store";

// ── Color map ───────────────────────────────────
const COLOR_MAP: Record<StickyNoteData["color"], string> = {
  yellow: "#fdf3b8",
  pink: "#ffe4e6",
  green: "#d1fae5",
  blue: "#e0f2fe",
  purple: "#f3e8ff",
};

/**
 * Derive a stable small rotation from the note id hash.
 * Range: -2deg to 2deg.
 */
function rotationFromId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  // Normalize to [-2, 2]
  return ((Math.abs(hash) % 400) / 100) - 2;
}

interface StickyNoteProps {
  note: StickyNoteData;
  pageId: string;
  blockId: string;
}

/**
 * StickyNote — small colored card attached to a block.
 * Double-click to edit; hover to reveal delete button.
 * Uses font-kalam for handwritten feel + tape strip on top.
 */
export function StickyNote({ note, pageId, blockId }: StickyNoteProps) {
  const updateStickyNote = useNotebookV2Store((s) => s.updateStickyNote);
  const deleteStickyNote = useNotebookV2Store((s) => s.deleteStickyNote);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(note.text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const rotation = rotationFromId(note.id);
  const bg = COLOR_MAP[note.color] ?? COLOR_MAP.yellow;

  // Auto-focus textarea when entering edit mode
  useEffect(() => {
    if (editing) textareaRef.current?.focus();
  }, [editing]);

  function commitEdit() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== note.text) {
      updateStickyNote(pageId, blockId, note.id, trimmed);
    }
    setEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      commitEdit();
    }
    if (e.key === "Escape") {
      setDraft(note.text);
      setEditing(false);
    }
  }

  return (
    <div
      className={cn(
        "group/sticky relative w-40 rounded-sm shadow-md transition-transform hover:scale-105",
        "font-kalam text-sm leading-snug select-none",
      )}
      style={{
        backgroundColor: bg,
        transform: `rotate(${rotation}deg)`,
      }}
      onDoubleClick={() => {
        setDraft(note.text);
        setEditing(true);
      }}
    >
      {/* Tape strip */}
      <div className="mx-auto h-3 w-12 rounded-b-sm bg-tape/60" />

      {/* Delete button — visible on hover */}
      <button
        onClick={() => deleteStickyNote(pageId, blockId, note.id)}
        className={cn(
          "absolute -right-1.5 -top-1.5 z-10 flex size-5 items-center justify-center",
          "rounded-full bg-brick/80 text-white opacity-0 transition-opacity",
          "group-hover/sticky:opacity-100 hover:bg-brick",
        )}
        aria-label="Delete sticky note"
      >
        <X className="size-3" />
      </button>

      {/* Content */}
      <div className="px-2 pb-2 pt-1">
        {editing ? (
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleKeyDown}
            className="w-full resize-none bg-transparent text-sm outline-none"
            rows={3}
          />
        ) : (
          <p className="whitespace-pre-wrap text-ink/80">
            {note.text || "Double-click to edit…"}
          </p>
        )}
      </div>
    </div>
  );
}
