"use client";

import {
  Type,
  Heading,
  StickyNote,
  Code,
  Table2,
  Workflow,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
import { cn } from "../ui/utils";
import { useNotebookV2Store } from "../../stores/useNotebookV2Store";
import type { V2BlockType, BlockPayloads } from "../../lib/notebook-v2.types";

// ── Block presets ───────────────────────────────
// Each entry: [icon, label, blockType, defaultContent]

type BlockPreset = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  type: V2BlockType;
  content: BlockPayloads[V2BlockType];
};

const PRESETS: BlockPreset[] = [
  {
    icon: Type,
    label: "Text",
    type: "text",
    content: { text: "" },
  },
  {
    icon: Heading,
    label: "Heading",
    type: "heading",
    content: { level: 2, text: "New Heading" },
  },
  {
    icon: StickyNote,
    label: "Callout",
    type: "callout",
    content: { tone: "note", text: "" },
  },
  {
    icon: Code,
    label: "Code",
    type: "code",
    content: { lang: "javascript", code: "" },
  },
  {
    icon: Table2,
    label: "Table",
    type: "table",
    content: { headers: ["Column 1", "Column 2"], rows: [["", ""]] },
  },
  {
    icon: Workflow,
    label: "Diagram",
    type: "mermaid",
    content: { code: "graph TD\n  A --> B" },
  },
  {
    icon: ImageIcon,
    label: "Image",
    type: "image",
    content: { url: "", alt: "Image" },
  },
  {
    icon: Sparkles,
    label: "AI Answer",
    type: "ai-answer",
    content: { question: "", answer: "", confidence: 0, sources: 0 },
  },
];

interface BlockToolbarProps {
  pageId: string;
}

/**
 * BlockToolbar — floating "Add Block" bar pinned at bottom.
 * One icon button per block type; clicking adds block to active page.
 */
export function BlockToolbar({ pageId }: BlockToolbarProps) {
  const addBlock = useNotebookV2Store((s) => s.addBlock);

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-xl border border-tape/20",
        "bg-paper/90 px-3 py-2 shadow-md backdrop-blur",
      )}
    >
      {PRESETS.map((preset) => {
        const Icon = preset.icon;
        return (
          <button
            key={preset.type}
            onClick={() => addBlock(pageId, preset.type, preset.content as never)}
            title={`Add ${preset.label}`}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-lg px-2.5 py-1.5",
              "text-ink/50 transition-colors hover:bg-sage/20 hover:text-ink/80",
            )}
          >
            <Icon className="size-4" />
            <span className="text-[10px] leading-none">{preset.label}</span>
          </button>
        );
      })}
    </div>
  );
}
