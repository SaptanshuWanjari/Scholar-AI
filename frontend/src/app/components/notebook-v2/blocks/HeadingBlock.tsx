// @ts-nocheck
/**
 * HeadingBlock — Editable heading (h1 / h2 / h3).
 *
 * Click to edit inline via contentEditable.
 * Blur or Enter saves via store.
 * Uses font-caveat for handwritten feel.
 */

import { useRef, useState, useEffect } from "react";
import { cn } from "../../ui/utils";
import { useNotebookV2Store } from "../../../stores/useNotebookV2Store";
import type { V2Block } from "../../../lib/notebook-v2.types";

interface HeadingBlockProps {
  block: V2Block<"heading">;
  pageId: string;
}

const levelStyles: Record<1 | 2 | 3, string> = {
  1: "text-4xl font-bold mt-2 mb-1",
  2: "text-2xl font-semibold mt-1.5",
  3: "text-xl font-semibold mt-1",
};

export function HeadingBlock({ block, pageId }: HeadingBlockProps) {
  const updateBlockContent = useNotebookV2Store((s) => s.updateBlockContent);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(block.content.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const save = () => {
    if (draft.trim()) {
      updateBlockContent(pageId, block.id, { text: draft.trim() });
    } else {
      setDraft(block.content.text);
    }
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { e.preventDefault(); save(); }
    if (e.key === "Escape") { setDraft(block.content.text); setEditing(false); }
  };

  const Tag = (`h${block.content.level}` as "h1" | "h2" | "h3");
  const level = block.content.level;

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={save}
        onKeyDown={handleKeyDown}
        className={cn(
          "w-full border-b-2 border-sky/40 bg-transparent font-caveat text-ink outline-none",
          levelStyles[level],
        )}
      />
    );
  }

  return (
    <Tag
      onClick={() => { setDraft(block.content.text); setEditing(true); }}
      className={cn(
        "cursor-text font-caveat text-ink transition-colors hover:text-ink/80",
        levelStyles[level],
      )}
    >
      {block.content.text}
    </Tag>
  );
}
