// @ts-nocheck
import { useState, useRef, useEffect } from "react";
import { cn } from "../../ui/utils";
import { Badge } from "../../ui/badge";
import { useNotebookV2Store } from "../../../stores/useNotebookV2Store";
import type { V2Block } from "../../../lib/notebook-v2.types";

export function CodeBlock({ block, pageId }: { block: V2Block<"code">; pageId: string }) {
  const updateBlockContent = useNotebookV2Store((s) => s.updateBlockContent);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(block.content.code);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { lang, code } = block.content;

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = textareaRef.current.value.length;
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [editing, draft]);

  const save = () => {
    updateBlockContent(pageId, block.id, { code: draft });
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      save();
    }
    if (e.key === "Escape") {
      setDraft(code);
      setEditing(false);
    }
    // Allow tabs in textarea
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      setDraft(draft.substring(0, start) + "  " + draft.substring(end));
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div 
      className="relative cursor-text rounded-xl bg-ink/5 p-4 group/code"
      onClick={() => { if (!editing) { setDraft(code); setEditing(true); } }}
    >
      <Badge
        variant="outline"
        className="absolute right-3 top-3 border-tape/40 bg-paper/80 font-mono text-[10px] text-pencil/70"
      >
        {lang || "text"}
      </Badge>

      <div className="font-mono text-sm text-ink/80 pt-4 min-h-[40px]">
        {editing ? (
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={save}
            onKeyDown={handleKeyDown}
            className="w-full resize-none rounded border-none bg-transparent p-0 font-mono text-sm text-ink/80 outline-none focus:ring-0"
            style={{ minHeight: "40px", overflow: "hidden" }}
          />
        ) : (
          <pre className="whitespace-pre-wrap font-mono">
            {code ? code : <span className="text-ink/40 italic">Write code...</span>}
          </pre>
        )}
      </div>
    </div>
  );
}
