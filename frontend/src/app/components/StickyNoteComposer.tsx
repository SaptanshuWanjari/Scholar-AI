import { useRef, useEffect } from "react";
import { Bold, Italic, List, Sigma, Check, Loader2 } from "lucide-react";
import { cn } from "./ui/utils";
import { NOTE_CATEGORIES, NOTE_CATEGORY_LIST } from "../stores/useReadingNotesStore";
import type { NoteCategory } from "../lib/types";

export interface StickyNoteComposerProps {
  content: string;
  onChangeContent: (content: string) => void;
  category: string;
  onChangeCategory: (category: string) => void;
  onSave?: () => void;
  onCancel?: () => void;
  saving?: boolean;
  isEditing?: boolean;
  placeholder?: string;
  extraControls?: React.ReactNode;
  autoFocus?: boolean;
  hideActions?: boolean;
}

export function StickyNoteComposer({
  content,
  onChangeContent,
  category,
  onChangeCategory,
  onSave,
  onCancel,
  saving,
  isEditing,
  placeholder,
  extraControls,
  autoFocus,
  hideActions,
}: StickyNoteComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [autoFocus]);

  const insertMarkdown = (before: string, after: string = "") => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const safeContent = content || "";
    const sel = safeContent.substring(start, end);
    const newText = safeContent.substring(0, start) + before + sel + after + safeContent.substring(end);
    onChangeContent(newText);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  return (
    <div className={cn("rounded-xl border-2 border-dashed border-slate-300 dark:border-zinc-800 bg-white/40 dark:bg-black/20 p-3 shadow-sm relative transition-colors", isEditing ? "border-primary/50 bg-primary/5" : "")}>
      {isEditing && !hideActions && (
        <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
          EDITING
        </div>
      )}
      <div className="absolute -top-3 -left-3">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 -rotate-12"><path d="M13.22 19.03a1.4 1.4 0 0 0 1.98 0l6.77-6.77a1.4 1.4 0 0 0 0-1.98l-7.78-7.78a1.4 1.4 0 0 0-1.98 0L2.44 12.27a1.4 1.4 0 0 0 0 1.98z"/><path d="m9 16 3-3"/></svg>
      </div>
      
      {/* Markdown Toolbar */}
      <div className="flex items-center gap-1 mb-2 border-b border-slate-200/50 dark:border-zinc-800/50 pb-2">
        <button type="button" onClick={() => insertMarkdown("**", "**")} className="p-1 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded text-slate-500 dark:text-zinc-400" title="Bold"><Bold className="size-3.5" /></button>
        <button type="button" onClick={() => insertMarkdown("*", "*")} className="p-1 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded text-slate-500 dark:text-zinc-400" title="Italic"><Italic className="size-3.5" /></button>
        <button type="button" onClick={() => insertMarkdown("- ")} className="p-1 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded text-slate-500 dark:text-zinc-400" title="List"><List className="size-3.5" /></button>
        <button type="button" onClick={() => insertMarkdown("$$ ", " $$")} className="p-1 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded text-slate-500 dark:text-zinc-400" title="Equation"><Sigma className="size-3.5" /></button>
      </div>

      <textarea
        ref={textareaRef}
        value={content || ""}
        onChange={(e) => onChangeContent(e.target.value)}
        placeholder={placeholder || "Write a note..."}
        rows={4}
        className="w-full resize-none bg-transparent p-2 text-base font-kalam text-slate-700 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 outline-none focus:ring-0"
      />
      <div className="mt-2 flex flex-wrap items-center gap-3 border-t border-dashed border-slate-300 dark:border-zinc-800 pt-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-600 dark:text-zinc-400">Note Type:</span>
          <div className="flex flex-wrap gap-1.5">
            {NOTE_CATEGORY_LIST.map((cat) => {
              const m = NOTE_CATEGORIES[cat];
              const active = category?.toLowerCase() === m.label.toLowerCase();
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => onChangeCategory(m.label)}
                  title={m.label}
                  className={cn(
                    "flex items-center gap-1.5 rounded-sm border px-2 py-1 text-[11px] font-medium transition-colors bg-white dark:bg-zinc-900 shadow-sm",
                    active ? cn(m.chip, "border-opacity-50 ring-1 ring-black/10") : "border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800"
                  )}
                >
                  <m.icon className={cn("size-3.5", active ? m.dot : "text-slate-400")} /> {m.label}
                </button>
              );
            })}
          </div>
        </div>
        
        {extraControls && (
          <div className="ml-auto flex items-center gap-2">
            {extraControls}
          </div>
        )}
        
        {!hideActions && (
          <div className={cn("flex items-center gap-2 mt-2 relative z-10 pointer-events-auto", extraControls ? "w-full justify-end" : "ml-auto")}>
            {onCancel && (
              <button 
                type="button"
                className="h-8 rounded border border-slate-300 dark:border-zinc-800 px-3 text-xs font-medium text-slate-600 dark:text-zinc-400 shadow-sm hover:bg-slate-100 dark:hover:bg-zinc-800" 
                onClick={onCancel} 
              >
                Cancel
              </button>
            )}
            {onSave && (
              <button 
                type="button"
                className="h-8 rounded bg-primary px-3 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/90 flex items-center disabled:opacity-50" 
                onClick={onSave} 
                disabled={saving || !content.trim()}
              >
                {saving ? <Loader2 className="mr-1 size-3.5 animate-spin" /> : <Check className="mr-1 size-3.5" />}
                {isEditing ? "Save changes" : "Add note"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
