import { useState } from "react";
import {
  Check,
  Plus,
  Trash2,
} from "lucide-react";
import type { NotebookBlock } from "../../lib/notebook-data";
import { cn } from "@/paper-ui/utils";
import { PaperInput, PaperTextarea } from "@/paper-ui/components/inputs";
import { PaperButton } from "@/paper-ui/components/buttons";
import { PaperTable, TableHeader, PaperTh, TableRow, PaperTd } from "@/paper-ui/components/tables";
import { PaperCard } from "@/paper-ui/core";
import { MarkdownEditor } from "./MarkdownEditor";
import { StickyNoteComposer } from "../StickyNoteComposer";
import { parseNotes } from "./utils";

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
    <PaperCard surface="#fffdf9" shadow="sm" border={{ strokeWidth: 1.4, roughness: 1.1, stroke: "#a78bfa" }}>
      <div className="space-y-4 p-5">
        {draft.type === "heading" && (
          <>
            <div className="flex gap-1.5">
              {[1, 2].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => field({ level: lvl })}
                  className={cn(
                    "rounded-md border px-2.5 py-1 font-architect text-xs",
                    d.level === lvl
                      ? "border-violet bg-violet-soft text-violet"
                      : "border-ink-muted/30 text-ink-muted",
                  )}
                >
                  H{lvl}
                </button>
              ))}
            </div>
            <PaperInput
              value={d.text}
              onChange={(e) => field({ text: e.target.value })}
              placeholder="Heading text"
              autoFocus
            />
          </>
        )}

        {draft.type === "text" && draft.source?.type !== "reading" && (
          <MarkdownEditor
            value={d.text}
            onChange={(val) => field({ text: val })}
          />
        )}

        {draft.type === "text" && draft.source?.type === "reading" && (
          <div className="space-y-4">
            {parseNotes(d.text).map((note, idx, arr) => (
              <div key={idx} className="mt-2">
                <StickyNoteComposer
                  content={note.content}
                  onChangeContent={(newContent) => {
                    const footer = note.raw.match(/\s*(?:—|–|-)\s*(.+?),\s*p\.(\d+)\s*(?:#\S+)?\s*$/);
                    const footerStr = footer ? footer[0].trim() : "";
                    const newRaw = footerStr ? `[ ${note.category}] ${newContent}\n\n${footerStr}` : `[ ${note.category}] ${newContent}`;
                    
                    const newArr = [...arr];
                    newArr[idx] = { ...note, content: newContent, raw: newRaw };
                    field({ text: newArr.map(n => n.raw).join("\n\n") });
                  }}
                  category={note.category}
                  onChangeCategory={(newCat) => {
                    const footer = note.raw.match(/\s*(?:—|–|-)\s*(.+?),\s*p\.(\d+)\s*(?:#\S+)?\s*$/);
                    const footerStr = footer ? footer[0].trim() : "";
                    const newRaw = footerStr ? `[ ${newCat}] ${note.content}\n\n${footerStr}` : `[ ${newCat}] ${note.content}`;
                    
                    const newArr = [...arr];
                    newArr[idx] = { ...note, category: newCat, raw: newRaw };
                    field({ text: newArr.map(n => n.raw).join("\n\n") });
                  }}
                  isEditing={true}
                  hideActions={true}
                />
              </div>
            ))}
          </div>
        )}

        {draft.type === "callout" && (
          <>
            <div className="flex gap-1.5">
              {(["note", "insight", "warning"] as const).map((tone) => (
                <button
                  key={tone}
                  onClick={() => field({ tone })}
                  className={cn(
                    "rounded-md border px-2.5 py-1 font-architect text-xs capitalize",
                    d.tone === tone
                      ? "border-violet bg-violet-soft text-violet"
                      : "border-ink-muted/30 text-ink-muted",
                  )}
                >
                  {tone}
                </button>
              ))}
            </div>
            <PaperTextarea
              value={d.text}
              onChange={(e) => field({ text: e.target.value })}
              placeholder="Callout text"
              rows={3}
              wrapperClassName="w-full"
            />
          </>
        )}

        {draft.type === "code" && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <PaperInput
                value={d.lang}
                onChange={(e) => field({ lang: e.target.value })}
                placeholder="Language (e.g. python)"
                wrapperClassName="max-w-[150px]"
              />
              <div className="flex gap-1">
                {["python", "typescript", "sql", "rust", "go"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => field({ lang })}
                    className={cn(
                      "rounded-md border px-2 py-1 font-architect text-[11px] font-medium uppercase tracking-wider transition-colors",
                      d.lang === lang
                        ? "border-violet bg-violet-soft text-violet"
                        : "border-ink-muted/30 text-ink-muted hover:bg-ink/5 hover:text-ink",
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
              className="w-full resize-y rounded-lg border border-ink-muted/30 bg-ink/[0.02] p-3 font-mono text-[14.5px] leading-relaxed outline-none focus:border-violet"
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
                  className="rounded-md border border-ink-muted/30 px-2.5 py-1 font-architect text-xs text-ink-muted transition-colors hover:bg-ink/5 hover:text-ink"
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
              className="w-full resize-y rounded-lg border border-ink-muted/30 bg-ink/[0.02] p-3 font-mono text-[14.5px] leading-relaxed outline-none focus:border-violet"
            />
          </div>
        )}

        {draft.type === "table" && (
          <div className="space-y-2">
            <PaperTable>
              <TableHeader>
                <tr>
                  {d.headers.map((h: string, j: number) => (
                    <th key={j} className="border-b border-ink-muted/20 p-0">
                      <input
                        className="w-full bg-transparent px-4 py-2.5 font-architect text-[13px] text-ink-muted uppercase tracking-wide outline-none focus:bg-ink/[0.03]"
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
                  <th className="w-8 border-b border-ink-muted/20 p-1 text-center">
                    <button
                      onClick={() => {
                        field({
                          headers: [...d.headers, `Col ${d.headers.length + 1}`],
                          rows: d.rows.map((r: string[]) => [...r, ""]),
                        });
                      }}
                      className="flex size-6 items-center justify-center rounded text-ink-muted hover:bg-ink/5 hover:text-ink"
                      title="Add column"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </th>
                </tr>
              </TableHeader>
              <tbody>
                {d.rows.map((row: string[], i: number) => (
                  <TableRow key={i} index={i}>
                    {row.map((cell: string, j: number) => (
                      <td key={j} className="border-b border-ink-muted/10 p-0">
                        <input
                          className="w-full bg-transparent px-4 py-2.5 font-kalam text-[14px] text-ink/80 outline-none focus:bg-ink/[0.03]"
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
                    <td className="border-b border-ink-muted/10 p-1 text-center">
                      <button
                        onClick={() => {
                          const next = [...d.rows];
                          next.splice(i, 1);
                          field({ rows: next });
                        }}
                        className="flex size-6 items-center justify-center rounded text-ink-muted hover:bg-red-50 hover:text-brick"
                        title="Remove row"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </td>
                  </TableRow>
                ))}
                <tr>
                  <td colSpan={d.headers.length + 1} className="p-1">
                    <button
                      onClick={() => {
                        field({
                          rows: [...d.rows, new Array(d.headers.length).fill("")],
                        });
                      }}
                      className="flex w-full items-center justify-center gap-1.5 rounded py-2 font-architect text-xs font-medium text-ink-muted hover:bg-ink/5 hover:text-ink"
                    >
                      <Plus className="size-3.5" /> Add Row
                    </button>
                  </td>
                </tr>
              </tbody>
            </PaperTable>
          </div>
        )}

        {draft.type === "ai-answer" && (
          <>
            <PaperInput
              value={d.question}
              onChange={(e) => field({ question: e.target.value })}
              placeholder="Question / prompt"
              autoFocus
            />
            <PaperTextarea
              value={d.answer}
              onChange={(e) => field({ answer: e.target.value })}
              placeholder="Answer (markdown)"
              rows={5}
            />
          </>
        )}

        {draft.type === "image" && (
          <div className="space-y-4">
            <div className="flex justify-center bg-ink/[0.02] rounded-lg p-2 border border-ink-muted/15">
              <img src={d.url} alt={d.alt || "Preview"} className="max-h-[300px] object-contain rounded" />
            </div>
            <PaperInput
              label="Alt text / Description"
              value={d.alt || ""}
              onChange={(e) => field({ alt: e.target.value })}
              placeholder="Describe the image..."
              autoFocus
            />
          </div>
        )}

        <div className="flex justify-end gap-2">
          <PaperButton tone="paper" size="sm" onClick={onCancel}>
            Cancel
          </PaperButton>
          <PaperButton tone="dark" size="sm" onClick={() => onSave(draft)}>
            <Check className="mr-1.5 size-3.5" /> Save
          </PaperButton>
        </div>
      </div>
    </PaperCard>
  );
}
