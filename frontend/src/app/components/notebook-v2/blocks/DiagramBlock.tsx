import { useState } from "react";
import { Workflow, Check } from "lucide-react";
import { DiagramViewer } from "../../DiagramViewer";
import type { V2Block } from "../../../lib/notebook-v2.types";
import { useNotebookV2Store } from "../../../stores/useNotebookV2Store";
import { cn } from "../../ui/utils";

interface DiagramBlockProps {
  block: V2Block<"mermaid">;
  pageId: string;
}

const PRESETS = [
  ["graph TD\n    A[Start] --> B{Decision}\n    B -->|Yes| C[OK]\n    B -->|No| D[End]", "Graph"],
  ["sequenceDiagram\n    Alice->>+Bob: Hello\n    Bob-->>-Alice: Hi!", "Sequence"],
  ["classDiagram\n    Animal <|-- Duck\n    class Animal{\n      +int age\n      +mate()\n    }", "Class"],
  ["stateDiagram-v2\n    [*] --> Still\n    Still --> [*]", "State"],
  ['pie title Pets\n    "Dogs" : 386\n    "Cats" : 85', "Pie"],
];

export function DiagramBlock({ block, pageId }: DiagramBlockProps) {
  const [isEditing, setIsEditing] = useState(!block.content.code);
  const [code, setCode] = useState(block.content.code);
  const updateBlockContent = useNotebookV2Store((s) => s.updateBlockContent);

  const save = () => {
    updateBlockContent(pageId, block.id, { code });
    setIsEditing(false);
  };

  return (
    <div className="group/mermaid relative">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-pencil/60">
          <Workflow className="size-3.5" /> Diagram
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="opacity-0 group-hover/mermaid:opacity-100 rounded bg-paper px-2 py-1 text-xs font-medium text-ink/60 border border-tape shadow-sm hover:text-ink transition-all"
          >
            Edit Source
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3 rounded-xl border border-tape/60 bg-paper/50 p-4">
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map(([tpl, label]) => (
              <button
                key={label}
                onClick={() => setCode(tpl)}
                className="rounded-md border border-tape/40 bg-white/40 px-2.5 py-1 text-xs text-ink/70 transition-colors hover:bg-lavender/20 hover:text-lavender"
              >
                {label}
              </button>
            ))}
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Mermaid graph definition…"
            autoFocus
            rows={8}
            spellCheck={false}
            className="w-full resize-y rounded-lg border border-tape/50 bg-white/60 p-3 font-mono text-[14.5px] leading-relaxed text-ink/80 outline-none focus:border-lavender/50"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setCode(block.content.code);
                setIsEditing(false);
              }}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-ink/60 hover:text-ink"
            >
              Cancel
            </button>
            <button
              onClick={save}
              className="flex items-center gap-1.5 rounded-lg bg-lavender px-3 py-1.5 text-sm font-medium text-white hover:bg-lavender/90"
            >
              <Check className="size-4" /> Save
            </button>
          </div>
        </div>
      ) : (
        <div 
          onDoubleClick={() => setIsEditing(true)}
          className="cursor-pointer"
          title="Double-click to edit diagram source"
        >
          <DiagramViewer code={block.content.code} />
        </div>
      )}
    </div>
  );
}
