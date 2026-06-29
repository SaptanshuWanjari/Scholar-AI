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

export interface ParsedNote {
  category: string;
  content: string;
  docTitle: string;
  pageNum: string;
  raw: string;
  docId?: string;
  noteId?: string;
}

export function parseNotes(text: string | undefined): ParsedNote[] {
  if (!text) return [];
  const cleanText = text.replace(/(?:^|\n)[ \t]*>[ \t]*/g, "\n").replace(/^\n/, "");
  const parts = cleanText.split(/(?:^|\n\n+)(?=\s*\[)/).filter((p) => p.trim().length > 0);
  return parts.map((part) => {
    let categoryRaw = "General";
    let content = part;
    let docTitle = "";
    let pageNum = "";

    const catMatch = content.match(/^\s*\[\s*(?:[^\s\]]+\s+)?([^\]]+?)\s*\]\s*/);
    if (catMatch) {
      categoryRaw = catMatch[1];
      content = content.substring(catMatch[0].length);
    }

    const footerMatch = content.match(/\s*(?:—|–|-)\s*(.+?),\s*p\.(\d+)\s*(?:#(\S+))?\s*$/);
    if (footerMatch) {
      docTitle = footerMatch[1].trim();
      pageNum = footerMatch[2];
      const hash = footerMatch[3];
      let docId: string | undefined;
      let noteId: string | undefined;
      if (hash) {
        const m = hash.match(/^(?:doc)?(\d+)-n(\d+)$/);
        if (m) {
          docId = m[1];
          noteId = m[2];
        } else {
          const dashIdx = hash.lastIndexOf("-p");
          docId = dashIdx > 0 ? hash.substring(hash.startsWith("doc") ? 3 : 0, dashIdx) : undefined;
        }
      }
      content = content.substring(0, content.length - footerMatch[0].length);
      return {
        category: categoryRaw.trim(),
        content: content.trim(),
        docTitle,
        pageNum,
        raw: part.trim(),
        docId,
        noteId,
      };
    }

    return {
      category: categoryRaw.trim(),
      content: content.trim(),
      docTitle,
      pageNum,
      raw: part.trim(),
    };
  });
}

export function blockLabel(block: NotebookBlock): string {
  switch (block.type) {
    case "heading":
      return block.text || "Heading";
    case "text":
    case "callout": {
      let txt = block.text ?? "";
      if (block.type === "text" && block.source?.type === "reading") {
        const notes = parseNotes(txt);
        if (notes.length > 0) {
          const cat = notes[0].category;
          const firstLine = notes[0].content.split("\n")[0] || "";
          return `[${cat}] ${firstLine.slice(0, 40)}`;
        }
      }
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

export function getBlockText(block: NotebookBlock): string {
  if ("text" in block) return (block as any).text as string;
  return "";
}

export function getBlockSource(block: NotebookBlock): { type: string; id: string } | undefined {
  return "source" in block ? (block as any).source as { type: string; id: string } | undefined : undefined;
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
