// @ts-nocheck
import { useState } from "react";
import { Plus, Trash2, Check } from "lucide-react";
import type { V2Block } from "../../../lib/notebook-v2.types";
import { useNotebookV2Store } from "../../../stores/useNotebookV2Store";

interface TableBlockProps {
  block: V2Block<"table">;
  pageId: string;
}

export function TableBlock({ block, pageId }: TableBlockProps) {
  const [isEditing, setIsEditing] = useState(block.content.headers.length === 0);
  const [headers, setHeaders] = useState(block.content.headers);
  const [rows, setRows] = useState(block.content.rows);
  const updateBlockContent = useNotebookV2Store((s) => s.updateBlockContent);

  const save = () => {
    updateBlockContent(pageId, block.id, { headers, rows });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="overflow-x-auto rounded-xl border border-tape bg-white/50 p-2 shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-sage/20">
            <tr>
              {headers.map((h, j) => (
                <th key={j} className="border-b border-tape p-0">
                  <input
                    className="w-full bg-transparent px-4 py-2.5 font-semibold text-ink outline-none placeholder:text-ink/30 focus:bg-sage/10"
                    value={h}
                    onChange={(e) => {
                      const next = [...headers];
                      next[j] = e.target.value;
                      setHeaders(next);
                    }}
                    placeholder={`Header ${j + 1}`}
                  />
                </th>
              ))}
              <th className="w-8 border-b border-tape p-1 text-center">
                <button
                  onClick={() => {
                    setHeaders([...headers, `Col ${headers.length + 1}`]);
                    setRows(rows.map(r => [...r, ""]));
                  }}
                  className="flex size-6 items-center justify-center rounded text-ink/40 hover:bg-black/5 hover:text-ink"
                  title="Add column"
                >
                  <Plus className="size-3.5" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} className="border-b border-tape/60 p-0">
                    <input
                      className="w-full bg-transparent px-4 py-2.5 text-ink/80 outline-none placeholder:text-ink/20 focus:bg-sage/5"
                      value={cell}
                      onChange={(e) => {
                        const next = [...rows];
                        next[i] = [...next[i]];
                        next[i][j] = e.target.value;
                        setRows(next);
                      }}
                      placeholder="..."
                    />
                  </td>
                ))}
                <td className="border-b border-tape/60 p-1 text-center">
                  <button
                    onClick={() => {
                      const next = [...rows];
                      next.splice(i, 1);
                      setRows(next);
                    }}
                    className="flex size-6 items-center justify-center rounded text-ink/40 hover:bg-brick/10 hover:text-brick"
                    title="Remove row"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={headers.length + 1} className="p-2">
                <button
                  onClick={() => {
                    setRows([...rows, new Array(headers.length).fill("")]);
                  }}
                  className="flex w-full items-center justify-center gap-1.5 rounded py-1.5 text-xs font-medium text-ink/50 hover:bg-black/5 hover:text-ink"
                >
                  <Plus className="size-3.5" /> Add Row
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div className="mt-3 flex justify-end gap-2 border-t border-tape pt-3">
          <button
            onClick={() => {
              setHeaders(block.content.headers);
              setRows(block.content.rows);
              setIsEditing(false);
            }}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-ink/60 hover:text-ink"
          >
            Cancel
          </button>
          <button
            onClick={save}
            className="flex items-center gap-1.5 rounded-lg bg-sage px-3 py-1.5 text-sm font-medium text-white hover:bg-sage/90"
          >
            <Check className="size-4" /> Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="group/table overflow-x-auto rounded-xl border border-tape relative cursor-pointer"
      onDoubleClick={() => setIsEditing(true)}
      title="Double-click to edit table"
    >
      <button
        onClick={() => setIsEditing(true)}
        className="absolute right-2 top-2 opacity-0 group-hover/table:opacity-100 rounded bg-white/80 px-2 py-1 text-xs font-medium text-ink/60 shadow-sm backdrop-blur hover:text-ink transition-all"
      >
        Edit Table
      </button>
      <table className="w-full border-collapse text-sm">
        <thead className="bg-sage/10">
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                className="border-b border-tape px-5 py-3 text-left font-semibold text-ink"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="transition-colors hover:bg-sage/5">
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className="border-b border-tape/60 px-5 py-3 text-ink/80"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
