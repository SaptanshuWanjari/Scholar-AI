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
import { PaperTextarea } from "@/paper-ui/components/inputs";
import { IconButton, PaperButton } from "@/paper-ui/components/buttons";
import { PaperDropdown } from "@/paper-ui/components/dialogs";
import { PaperCard } from "@/paper-ui/core";

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
  };

  const showEdit = mode === "edit" || mode === "split";
  const showPreview = mode === "preview" || mode === "split";

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <PaperCard shadow="sm" surface="#f8f7f3" border={{ strokeWidth: 1, roughness: 1 }} className="p-2">
        <div className="flex flex-wrap w-full items-center gap-1.5 pb-1">
          {FORMAT_BUTTONS.map(([action, Icon, label]) => (
            <IconButton
              key={action}
              label={label}
              onClick={(e) => { e.preventDefault(); format(action); }}
            >
              <Icon className="size-4 shrink-0" />
            </IconButton>
          ))}

          {/* Separator */}
          <div className="mx-2 h-5 w-[2px] shrink-0 bg-ink-muted/20" />

          {/* Math button */}
          <IconButton
            label="Math block (KaTeX)"
            onClick={(e) => { e.preventDefault(); format("math"); }}
          >
            <Sigma className="size-4 shrink-0" />
          </IconButton>

          {/* Templates dropdown */}
          <div className="shrink-0">
            <PaperDropdown
              trigger={
                <button
                  title="Insert template"
                  className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 font-architect text-sm text-ink-muted hover:bg-ink/5 hover:text-ink transition-colors"
                >
                  <FileText className="size-4 shrink-0" />
                  <span>Template</span>
                  <ChevronDown className="size-3 shrink-0" />
                </button>
              }
              items={TEMPLATES.map((t) => ({
                key: t.label,
                label: t.label,
                onClick: () => applyTemplate(t.content)
              }))}
            />
          </div>

          {/* Mode toggle */}
          <div className="ml-auto flex shrink-0 gap-1 pl-4">
            {(
              [
                ["edit", PenLine, "Edit only"],
                ["split", Columns2, "Split view"],
                ["preview", Eye, "Preview only"],
              ] as [Mode, React.ElementType, string][]
            ).map(([m, Icon, label]) => (
              <button
                key={m}
                title={label}
                onClick={(e) => { e.preventDefault(); setMode(m); }}
                className={cn(
                  "rounded-lg p-2 transition-colors",
                  mode === m
                    ? "bg-violet-soft text-violet"
                    : "text-ink-muted hover:bg-ink/5 hover:text-ink",
                )}
              >
                <Icon className="size-4 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </PaperCard>

      {/* Content area */}
      <div className={cn("flex gap-4", mode === "split" && "min-h-[160px]")}>
        {showEdit && (
          <div className={cn("flex-1", mode === "split" ? "w-1/2" : "w-full")}>
            <PaperTextarea
              ref={textRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Write markdown…"
              autoFocus
              rows={mode === "split" ? 10 : 8}
            />
          </div>
        )}
        {showPreview && (
          <PaperCard 
            shadow="none" 
            surface="#fffdf9" 
            border={{ strokeWidth: 1, roughness: 1 }}
            className={cn(
              "overflow-y-auto p-4",
              mode === "split" ? "w-1/2" : "w-full flex-1",
              mode === "split" && "min-h-[160px]",
              mode === "preview" && "min-h-[120px]",
            )}
          >
            {value.trim() ? (
              <MarkdownRenderer content={value} className="font-kalam text-[17px] leading-relaxed" />
            ) : (
              <p className="font-architect text-sm text-ink-muted italic">Preview will appear here…</p>
            )}
          </PaperCard>
        )}
      </div>
    </div>
  );
}
