import { useState } from "react";
import {
  Check,
  Plus,
  Trash2,
} from "lucide-react";
import type { NotebookBlock } from "../../lib/notebook-data";
import { cn } from "../ui/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { MarkdownEditor } from "./MarkdownEditor";

export function BlockEditor({
  block,
  onSave,
  onCancel,
}: {
  block: NotebookBlock;
  onSave: (patch: Partial<NotebookBlock>) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<NotebookBlock>(block);
  const d = draft as any;

  const field = (patch: Record<string, unknown>) =>
    setDraft({ ...d, ...patch } as NotebookBlock);

  return (
    <div className="space-y-4 rounded-xl border border-violet/40 bg-card/60 p-5">
      {draft.type === "heading" && (
        <>
          <div className="flex gap-1.5">
            {[1, 2].map((lvl) => (
              <button
                key={lvl}
                onClick={() => field({ level: lvl })}
                className={cn(
                  "rounded-md border px-2.5 py-1 text-xs",
                  d.level === lvl
                    ? "border-violet bg-violet-soft text-violet"
                    : "border-border text-muted-foreground",
                )}
              >
                H{lvl}
              </button>
            ))}
          </div>
          <Input
            value={d.text}
            onChange={(e) => field({ text: e.target.value })}
            placeholder="Heading text"
            autoFocus
          />
        </>
      )}

      {draft.type === "text" && (
        <MarkdownEditor
          value={d.text}
          onChange={(val) => field({ text: val })}
        />
      )}

      {draft.type === "callout" && (
        <>
          <div className="flex gap-1.5">
            {(["note", "insight", "warning"] as const).map((tone) => (
              <button
                key={tone}
                onClick={() => field({ tone })}
                className={cn(
                  "rounded-md border px-2.5 py-1 text-xs capitalize",
                  d.tone === tone
                    ? "border-violet bg-violet-soft text-violet"
                    : "border-border text-muted-foreground",
                )}
              >
                {tone}
              </button>
            ))}
          </div>
          <textarea
            value={d.text}
            onChange={(e) => field({ text: e.target.value })}
            placeholder="Callout text"
            autoFocus
            rows={3}
            className="w-full resize-y rounded-lg border border-border bg-input-background p-3 text-base outline-none focus:border-violet"
          />
        </>
      )}

      {draft.type === "code" && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Input
              value={d.lang}
              onChange={(e) => field({ lang: e.target.value })}
              placeholder="Language (e.g. python)"
              className="h-8 max-w-[150px] text-xs"
            />
            <div className="flex gap-1">
              {["python", "typescript", "sql", "rust", "go"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => field({ lang })}
                  className={cn(
                    "rounded-md border px-2 py-1 text-[11px] font-medium uppercase tracking-wider transition-colors",
                    d.lang === lang
                      ? "border-violet bg-violet-soft text-violet"
                      : "border-border text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={d.code}
            onChange={(e) => field({ code: e.target.value })}
            placeholder="Code…"
            autoFocus
            rows={6}
            spellCheck={false}
            className="w-full resize-y rounded-lg border border-border bg-secondary p-3 font-mono text-[14.5px] leading-relaxed outline-none focus:border-violet"
          />
        </div>
      )}

      {draft.type === "mermaid" && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {[
              [
                "graph TD\n    A[Start] --> B{Decision}\n    B -->|Yes| C[OK]\n    B -->|No| D[End]",
                "Graph",
              ],
              [
                "sequenceDiagram\n    Alice->>+Bob: Hello\n    Bob-->>-Alice: Hi!",
                "Sequence",
              ],
              [
                "classDiagram\n    Animal <|-- Duck\n    class Animal{\n      +int age\n      +mate()\n    }",
                "Class",
              ],
              [
                "stateDiagram-v2\n    [*] --> Still\n    Still --> [*]",
                "State",
              ],
              ['pie title Pets\n    "Dogs" : 386\n    "Cats" : 85', "Pie"],
            ].map(([tpl, label]) => (
              <button
                key={label}
                onClick={() => field({ code: tpl })}
                className="rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {label}
              </button>
            ))}
          </div>
          <textarea
            value={d.code}
            onChange={(e) => field({ code: e.target.value })}
            placeholder="Mermaid graph definition…"
            autoFocus
            rows={6}
            spellCheck={false}
            className="w-full resize-y rounded-lg border border-border bg-secondary p-3 font-mono text-[14.5px] leading-relaxed outline-none focus:border-violet"
          />
        </div>
      )}

      {draft.type === "table" && (
        <div className="overflow-x-auto rounded-xl border border-border bg-card/50">
          <table className="w-full border-collapse text-base">
            <thead className="bg-muted/60">
              <tr>
                {d.headers.map((h: string, j: number) => (
                  <th key={j} className="border-b border-border p-0">
                    <input
                      className="w-full bg-transparent px-4 py-2.5 font-semibold outline-none focus:bg-accent/20"
                      value={h}
                      onChange={(e) => {
                        const next = [...d.headers];
                        next[j] = e.target.value;
                        field({ headers: next });
                      }}
                      placeholder={`Header ${j + 1}`}
                    />
                  </th>
                ))}
                <th className="w-8 border-b border-border p-1 text-center">
                  <button
                    onClick={() => {
                      field({
                        headers: [...d.headers, `Col ${d.headers.length + 1}`],
                        rows: d.rows.map((r: string[]) => [...r, ""]),
                      });
                    }}
                    className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground"
                    title="Add column"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {d.rows.map((row: string[], i: number) => (
                <tr key={i}>
                  {row.map((cell: string, j: number) => (
                    <td key={j} className="border-b border-border/60 p-0">
                      <input
                        className="w-full bg-transparent px-4 py-2.5 text-foreground/80 outline-none focus:bg-accent/20"
                        value={cell}
                        onChange={(e) => {
                          const next = [...d.rows];
                          next[i] = [...next[i]];
                          next[i][j] = e.target.value;
                          field({ rows: next });
                        }}
                        placeholder="..."
                      />
                    </td>
                  ))}
                  <td className="border-b border-border/60 p-1 text-center">
                    <button
                      onClick={() => {
                        const next = [...d.rows];
                        next.splice(i, 1);
                        field({ rows: next });
                      }}
                      className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      title="Remove row"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={d.headers.length + 1} className="p-1">
                  <button
                    onClick={() => {
                      field({
                        rows: [...d.rows, new Array(d.headers.length).fill("")],
                      });
                    }}
                    className="flex w-full items-center justify-center gap-1.5 rounded py-2 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    <Plus className="size-3.5" /> Add Row
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {draft.type === "ai-answer" && (
        <>
          <Input
            onChange={(e) => field({ question: e.target.value })}
            placeholder="Question / prompt"
            autoFocus
          />
          <textarea
            value={d.answer}
            onChange={(e) => field({ answer: e.target.value })}
            placeholder="Answer (markdown)"
            rows={5}
            className="w-full resize-y rounded-lg border border-border bg-input-background p-3 text-base leading-relaxed outline-none focus:border-violet"
          />
        </>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" onClick={() => onSave(draft)}>
          <Check className="mr-1.5 size-3.5" /> Save
        </Button>
      </div>
    </div>
  );
}
