// @ts-nocheck
import { useState, useRef, useEffect } from "react";
import { BookPlus, Pencil } from "lucide-react";
import { cn } from "../../ui/utils";
import { MarkdownRenderer } from "../../MarkdownRenderer";
import { useNotebookV2Store } from "../../../stores/useNotebookV2Store";
import type { V2Block } from "../../../lib/notebook-v2.types";

export function TextBlock({ block, pageId }: { block: V2Block<"text">; pageId: string }) {
  const updateBlockContent = useNotebookV2Store((s) => s.updateBlockContent);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(block.content.text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = textareaRef.current.value.length;
      
      // Auto-resize
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [editing, draft]);

  const save = () => {
    updateBlockContent(pageId, block.id, { text: draft });
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      save();
    }
    if (e.key === "Escape") {
      setDraft(block.content.text);
      setEditing(false);
    }
  };

  if (editing) {
    return (
      <textarea
        ref={textareaRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={save}
        onKeyDown={handleKeyDown}
        className={cn(
          "w-full resize-none rounded border-none bg-paper/50 p-0 text-base leading-relaxed text-ink outline-none",
          "focus:ring-0",
        )}
        style={{ minHeight: "24px", overflow: "hidden" }}
      />
    );
  }

  return (
    <div 
      className="group/text cursor-text relative min-h-[28px]" 
      onClick={() => { setDraft(block.content.text); setEditing(true); }}
    >
      <Pencil className="absolute -left-6 top-1.5 size-3.5 text-pencil/0 transition-colors group-hover/text:text-pencil/40" />
      
      {block.content.source && (
        <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-tape bg-tape/30 px-2.5 py-0.5 text-[11px] font-medium text-pencil/70">
          <BookPlus className="size-3" /> Source: {block.content.source.type}
        </span>
      )}
      
      {!block.content.text && (
        <div className="text-pencil/40 italic">Start typing...</div>
      )}
      
      {block.content.text && (
        <MarkdownRenderer
          content={block.content.text}
          className="text-base leading-relaxed"
        />
      )}
    </div>
  );
}
