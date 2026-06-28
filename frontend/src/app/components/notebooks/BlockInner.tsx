import {
  BookPlus,
  Sparkles,
  Gauge,
  Workflow,
  Layers,
  ListChecks,
  Check,
  PencilRuler,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router";
import { cn } from "../ui/utils";
import { Badge } from "../ui/badge";
import { MarkdownRenderer } from "../MarkdownRenderer";
import { DiagramViewer } from "../DiagramViewer";
import type { NotebookBlock } from "../../lib/notebook-data";
import { artifactLabel } from "../../lib/serializers";
import { calloutMeta } from "./utils";

export function BlockInner({ block }: { block: NotebookBlock }) {
  const navigate = useNavigate();
  switch (block.type) {
    case "heading":
      return block.level === 1 ? (
        <h1 className="mt-6 text-4xl font-bold">{block.text}</h1>
      ) : (
        <h2 className="mt-5 text-2xl font-semibold">{block.text}</h2>
      );
    case "text":
      return (
        <>
          {block.source && (
            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
              <BookPlus className="size-3" /> Source:{" "}
              {artifactLabel(block.source.type)}
            </span>
          )}
          <MarkdownRenderer content={block.text} className="text-[18px] leading-relaxed" />
        </>
      );
    case "callout": {
      const m = calloutMeta[block.tone];
      return (
        <div className={cn("flex gap-4 rounded-xl border p-5", m.cls)}>
          <m.icon className={cn("mt-0.5 size-6 shrink-0", m.iconCls)} />
          <div className="font-reading text-[18px] leading-relaxed">{block.text}</div>
        </div>
      );
    }
    case "code":
      return (
        <pre className="overflow-x-auto rounded-lg border border-border bg-secondary p-5">
          <code className="font-mono text-[14.5px] leading-relaxed text-foreground/90">
            {block.code}
          </code>
        </pre>
      );
    case "table":
      return (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full border-collapse text-base">
            <thead className="bg-muted/60">
              <tr>
                {block.headers.map((h) => (
                  <th
                    key={h}
                    className="border-b border-border px-5 py-3 text-left font-semibold"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className="border-b border-border/60 px-5 py-3 text-foreground/80"
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
    case "ai-answer":
      return (
        <div className="overflow-hidden rounded-xl border border-violet/25 bg-violet-soft/40">
          <div className="flex items-center justify-between border-b border-violet/15 px-5 py-3.5">
            <span className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-violet">
              <Sparkles className="size-4" /> Saved AI Answer
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Gauge className="size-3.5" /> {(block.confidence * 100).toFixed(0)}
              % · {block.sources} sources
            </span>
          </div>
          <div className="px-5 pb-4 pt-4">
            <div className="mb-3 font-reading text-lg font-medium italic text-foreground">
              {block.question}
            </div>
            <MarkdownRenderer content={block.answer} className="text-[18px] leading-relaxed" />
          </div>
        </div>
      );
    case "mermaid":
      return (
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Workflow className="size-3.5" /> Diagram
          </div>
          <DiagramViewer code={block.code} />
        </div>
      );
    case "flashdeck":
      return (
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2.5 text-base font-semibold">
              <Layers className="size-5 text-violet" /> {block.name}
            </span>
            <Badge variant="outline" className="text-xs text-muted-foreground px-2.5 py-0.5">
              {block.count} cards
            </Badge>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {block.cards.map((c, i) => (
              <div
                key={i}
                className="rounded-lg border border-border bg-background/50 p-4"
              >
                <div className="font-reading text-base leading-snug font-medium">
                  {c.front}
                </div>
                <div className="mt-2.5 border-t border-border pt-2 text-xs text-muted-foreground">
                  {c.back}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    case "quiz-results": {
      const pct = Math.round((block.score / block.total) * 100);
      return (
        <div className="flex items-center gap-5 rounded-xl border border-border bg-card p-5">
          <div className="flex size-16 shrink-0 flex-col items-center justify-center rounded-xl bg-success-soft text-success">
            <span className="font-display text-2xl leading-none">{pct}%</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5 text-base font-semibold">
              <ListChecks className="size-5 text-success" /> {block.title}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              Scored {block.score} of {block.total} · embedded quiz result
            </div>
          </div>
          <Check className="size-6 text-success" />
        </div>
      );
    }
    case "whiteboard":
      // Static read-only snapshot — clicking opens the live whiteboard editor.
      // A snapshot (not a live canvas) keeps notebooks lightweight.
      return (
        <button
          type="button"
          onClick={() => navigate(`/whiteboards/${block.whiteboardId}`)}
          className="group/wb block w-full overflow-hidden rounded-xl border border-border bg-card text-left transition-colors hover:border-violet/40"
        >
          <div className="flex aspect-video items-center justify-center overflow-hidden border-b border-border bg-muted/30">
            {block.thumbnail ? (
              <img src={block.thumbnail} alt="" className="h-full w-full object-contain" />
            ) : (
              <PencilRuler className="size-10 text-muted-foreground/40" />
            )}
          </div>
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <span className="flex min-w-0 items-center gap-2.5 text-base font-semibold">
              <PencilRuler className="size-5 shrink-0 text-violet" />
              <span className="truncate">{block.title || "Whiteboard"}</span>
            </span>
            <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground group-hover/wb:text-violet">
              Open <ExternalLink className="size-3.5" />
            </span>
          </div>
        </button>
      );
    default:
      return null;
  }
}
