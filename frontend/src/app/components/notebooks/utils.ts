import { BookOpen, FileText, Layers, ScrollText, Lightbulb, Info, TriangleAlert } from "lucide-react";
import type { NotebookBlock } from "../../lib/notebook-data";

export const NOTEBOOK_ICONS = [
  BookOpen,
  FileText,
  Layers,
  ScrollText,
  Lightbulb,
] as const;

export function iconFor(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return NOTEBOOK_ICONS[h % NOTEBOOK_ICONS.length];
}

export const calloutMeta: Record<
  string,
  { icon: typeof Info; cls: string; iconCls: string }
> = {
  note: {
    icon: Info,
    cls: "border-border bg-muted/50 text-foreground",
    iconCls: "text-muted-foreground",
  },
  insight: {
    icon: Lightbulb,
    cls: "border-violet/30 bg-violet-soft text-foreground",
    iconCls: "text-violet",
  },
  warning: {
    icon: TriangleAlert,
    cls: "border-warning/30 bg-warning-soft text-foreground",
    iconCls: "text-warning",
  },
};

export function blockLabel(block: NotebookBlock): string {
  switch (block.type) {
    case "heading":
      return block.text || "Heading";
    case "text":
    case "callout": {
      const txt = block.text ?? "";
      const h = txt.match(/^\s*#{1,6}\s+(.+)$/m);
      if (h) return h[1].trim();
      const first = txt
        .split("\n")
        .map((s) => s.trim())
        .find(Boolean);
      return (first ?? "").replace(/[#*`_>]/g, "").slice(0, 60) || "Text";
    }
    case "ai-answer":
      return block.question || "AI Answer";
    case "code":
      return `Code · ${block.lang || "text"}`;
    case "mermaid":
      return "Diagram";
    case "table":
      return block.headers?.filter(Boolean).join(" / ") || "Table";
    case "flashdeck":
      return block.name || "Flashcard deck";
    case "quiz-results":
      return block.title || "Quiz results";
    case "whiteboard":
      return block.title || "Whiteboard";
    default:
      return "Block";
  }
}

export function blockOutlineLevel(block: NotebookBlock): number {
  if (block.type === "heading") return block.level === 1 ? 0 : 1;
  if (
    (block.type === "text" || block.type === "callout") &&
    /^\s*#{1,6}\s+/m.test(block.text ?? "")
  ) {
    return 1;
  }
  return 2;
}

export const EDITABLE_TYPES = new Set([
  "heading",
  "text",
  "callout",
  "code",
  "mermaid",
  "ai-answer",
  "table",
]);
