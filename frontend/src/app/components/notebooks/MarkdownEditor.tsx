import { useState, useRef } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListTodo,
  Quote,
  Link2,
  Table,
  Sigma,
  FileText,
  PenLine,
  Columns2,
  Eye,
  ChevronDown,
} from "lucide-react";
import { applyMarkdown, type MarkdownAction } from "../../lib/markdown-format";
import { MarkdownRenderer } from "../MarkdownRenderer";
import { cn } from "@/paper-ui/utils";

type Mode = "edit" | "split" | "preview";

const TEMPLATES = [
  {
    label: "Cornell Notes",
    content: "## Main Notes\n\n\n\n## Key Questions\n\n\n\n## Summary\n\n",
  },
  {
    label: "Summary",
    content: "## Summary\n\n\n\n## Key Points\n\n- \n- \n- \n\n## Takeaways\n\n",
  },
  {
    label: "Outline",
    content: "## Topic\n\n### Subtopic 1\n- Point\n\n### Subtopic 2\n- Point\n",
  },
];

const FORMAT_BUTTONS: [MarkdownAction, React.ElementType, string][] = [
  ["bold", Bold, "Bold"],
  ["italic", Italic, "Italic"],
  ["strikethrough", Strikethrough, "Strikethrough"],
  ["code", Code2, "Inline code"],
  ["h1", Heading1, "Heading 1"],
  ["h2", Heading2, "Heading 2"],
  ["h3", Heading3, "Heading 3"],
  ["ul", List, "Bullet list"],
  ["ol", ListOrdered, "Numbered list"],
  ["task", ListTodo, "Task list"],
  ["quote", Quote, "Quote"],
  ["link", Link2, "Link"],
  ["table", Table, "Table"],
];

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [mode, setMode] = useState<Mode>("split");
  const [templateOpen, setTemplateOpen] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const format = (action: MarkdownAction) => {
    if (!textRef.current) return;
    onChange(applyMarkdown(textRef.current, action));
  };

  const applyTemplate = (content: string) => {
    if (!value.trim()) {
      onChange(content);
    } else {
      const textarea = textRef.current;
      if (textarea) {
        const s = textarea.selectionStart;
        onChange(value.slice(0, s) + "\n" + content + value.slice(s));
      } else {
        onChange(value + "\n" + content);
      }
    }
    setTemplateOpen(false);
  };

  const showEdit = mode === "edit" || mode === "split";
  const showPreview = mode === "preview" || mode === "split";

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 rounded-lg border border-border bg-card/60 p-1">
        {FORMAT_BUTTONS.map(([action, Icon, label]) => (
          <button
            key={action}
            type="button"
            title={label}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => format(action)}
            className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <Icon className="size-3.5" />
          </button>
        ))}

        {/* Separator */}
        <div className="mx-1 h-4 w-px bg-border" />

        {/* Math button */}
        <button
          type="button"
          title="Math block (KaTeX)"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => format("math")}
          className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <Sigma className="size-3.5" />
        </button>

        {/* Templates dropdown */}
        <div className="relative">
          <button
            type="button"
            title="Insert template"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setTemplateOpen((o) => !o)}
            className="flex items-center gap-1 rounded px-1.5 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <FileText className="size-3.5" />
            <span>Template</span>
            <ChevronDown className="size-3" />
          </button>
          {templateOpen && (
            <div className="absolute left-0 top-full z-20 mt-1 min-w-[150px] rounded-lg border border-border bg-popover shadow-md">
              {TEMPLATES.map((t) => (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => applyTemplate(t.content)}
                  className="w-full px-3 py-2 text-left text-xs text-foreground hover:bg-accent transition-colors first:rounded-t-lg last:rounded-b-lg"
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mode toggle — pushed to right */}
        <div className="ml-auto flex gap-0.5">
          {(
            [
              ["edit", PenLine, "Edit only"],
              ["split", Columns2, "Split view"],
              ["preview", Eye, "Preview only"],
            ] as [Mode, React.ElementType, string][]
          ).map(([m, Icon, label]) => (
            <button
              key={m}
              type="button"
              title={label}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setMode(m)}
              className={cn(
                "rounded p-1.5 transition-colors",
                mode === m
                  ? "bg-violet-soft text-violet"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <Icon className="size-3.5" />
            </button>
          ))}
        </div>
      </div>

      {/* Content area */}
      <div className={cn("flex gap-2", mode === "split" && "min-h-[160px]")}>
        {showEdit && (
          <textarea
            ref={textRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write markdown…"
            autoFocus
            rows={mode === "split" ? 8 : 5}
            className={cn(
              "resize-y rounded-lg border border-border bg-input-background p-3 font-reading text-base leading-relaxed outline-none focus:border-violet",
              mode === "split" ? "w-1/2" : "w-full",
            )}
          />
        )}
        {showPreview && (
          <div
            className={cn(
              "overflow-y-auto rounded-lg border border-border bg-card/40 p-3",
              mode === "split" ? "w-1/2" : "w-full",
              mode === "split" && "min-h-[160px]",
              mode === "preview" && "min-h-[120px]",
            )}
          >
            {value.trim() ? (
              <MarkdownRenderer content={value} className="text-base leading-relaxed" />
            ) : (
              <p className="text-xs text-muted-foreground italic">Preview will appear here…</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
