import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import type { ReactBlockViewProps } from "../editor/ReactEmbedBlock";

mermaid.initialize({ startOnLoad: false, theme: "neutral" });

export function DiagramView({ model, doc }: ReactBlockViewProps<any>) {
  const [editing, setEditing] = useState(false);
  const [svg, setSvg] = useState("");
  const idRef = useRef(`d-${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    let alive = true;
    mermaid
      .render(idRef.current, model.code || "graph TD;A")
      .then((r) => alive && setSvg(r.svg))
      .catch(() => alive && setSvg(""));
    return () => {
      alive = false;
    };
  }, [model.code]);

  return (
    <div className="my-2 rounded-lg border border-tape/30 bg-paper/60 p-3">
      <div className="mb-2 flex justify-end">
        <button
          className="text-xs text-ink/50 hover:text-ink"
          onClick={() => setEditing((v) => !v)}
        >
          {editing ? "Preview" : "Edit"}
        </button>
      </div>
      {editing ? (
        <textarea
          className="w-full resize-y bg-transparent font-mono text-xs outline-none"
          defaultValue={model.code}
          rows={5}
          onBlur={(e) => doc.updateBlock(model, { code: e.currentTarget.value })}
        />
      ) : (
        <div dangerouslySetInnerHTML={{ __html: svg }} />
      )}
    </div>
  );
}
export default DiagramView;
