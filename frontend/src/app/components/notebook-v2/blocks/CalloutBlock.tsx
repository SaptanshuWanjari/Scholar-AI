// @ts-nocheck
import { useState, useRef, useEffect } from "react";
import { Info, Lightbulb, TriangleAlert, type LucideIcon } from "lucide-react";
import { cn } from "../../ui/utils";
import { useNotebookV2Store } from "../../../stores/useNotebookV2Store";
import type { V2Block } from "../../../lib/notebook-v2.types";

const toneMeta: Record<string, { icon: LucideIcon; container: string; iconCls: string }> = {
  note: { icon: Info, container: "border-tape bg-sage/10", iconCls: "text-sage" },
  insight: { icon: Lightbulb, container: "border-lavender/30 bg-lavender/10", iconCls: "text-lavender" },
  warning: { icon: TriangleAlert, container: "border-ochre/30 bg-ochre/10", iconCls: "text-ochre" },
};

export function CalloutBlock({ block, pageId }: { block: V2Block<"callout">; pageId: string }) {
  const updateBlockContent = useNotebookV2Store((s) => s.updateBlockContent);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(block.content.text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { tone, text } = block.content;
  const meta = toneMeta[tone] ?? toneMeta.note;
  const Icon = meta.icon;

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = textareaRef.current.value.length;
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
      setDraft(text);
      setEditing(false);
    }
  };

  return (
    <div 
      className={cn("flex gap-4 rounded-xl border p-5 cursor-text", meta.container)}
      onClick={() => { if (!editing) { setDraft(text); setEditing(true); } }}
    >
      <Icon className={cn("mt-0.5 size-6 shrink-0", meta.iconCls)} />
      <div className="flex-1 font-reading text-base leading-relaxed text-ink/90 min-h-[24px]">
        {editing ? (
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={save}
            onKeyDown={handleKeyDown}
            className="w-full resize-none rounded border-none bg-transparent p-0 text-base leading-relaxed text-ink outline-none focus:ring-0"
            style={{ minHeight: "24px", overflow: "hidden" }}
          />
        ) : (
          text ? text : <span className="text-ink/40 italic">Add a note...</span>
        )}
      </div>
    </div>
  );
}
