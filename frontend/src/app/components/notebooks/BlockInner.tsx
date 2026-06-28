import {
  BookPlus,
  Sparkles,
  Gauge,
  Workflow,
  Layers,
  ListChecks,
  Check,
} from "lucide-react";
import { cn } from "../ui/utils";
import { Badge } from "../ui/badge";
import { MarkdownRenderer } from "../MarkdownRenderer";
import { DiagramViewer } from "../DiagramViewer";
import type { NotebookBlock } from "../../lib/notebook-data";
import { artifactLabel } from "../../lib/serializers";
import { calloutMeta } from "./utils";

export function BlockInner({ block }: { block: NotebookBlock }) {
  switch (block.type) {
    case "heading":
      return block.level === 1 ? (
        <h1 className="mt-4 text-3xl">{block.text}</h1>
      ) : (
        <h2 className="mt-4">{block.text}</h2>
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
          <MarkdownRenderer content={block.text} />
        </>
      );
    case "callout": {
      const m = calloutMeta[block.tone];
      return (
        <div className={cn("flex gap-3 rounded-xl border p-4", m.cls)}>
          <m.icon className={cn("mt-0.5 size-5 shrink-0", m.iconCls)} />
          <div className="font-reading leading-relaxed">{block.text}</div>
        </div>
      );
    }
    case "code":
      return (
        <pre className="overflow-x-auto rounded-lg border border-border bg-secondary p-4">
          <code className="font-mono text-[13px] leading-relaxed text-foreground/90">
            {block.code}
          </code>
        </pre>
      );
    case "table":
      return (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-muted/60">
              <tr>
                {block.headers.map((h) => (
                  <th
                    key={h}
                    className="border-b border-border px-4 py-2.5 text-left font-semibold"
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
                      className="border-b border-border/60 px-4 py-2.5 text-foreground/80"
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
          <div className="flex items-center justify-between border-b border-violet/15 px-4 py-2.5">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet">
              <Sparkles className="size-3.5" /> Saved AI Answer
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Gauge className="size-3" /> {(block.confidence * 100).toFixed(0)}
              % · {block.sources} sources
            </span>
          </div>
          <div className="px-4 pb-3 pt-3">
            <div className="mb-2 font-reading text-base font-medium italic text-foreground">
              {block.question}
            </div>
            <MarkdownRenderer content={block.answer} />
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
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-medium">
              <Layers className="size-4 text-violet" /> {block.name}
            </span>
            <Badge variant="outline" className="text-xs text-muted-foreground">
              {block.count} cards
            </Badge>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {block.cards.map((c, i) => (
              <div
                key={i}
                className="rounded-lg border border-border bg-background/50 p-3"
              >
                <div className="font-reading text-sm leading-snug">
                  {c.front}
                </div>
                <div className="mt-2 border-t border-border pt-2 text-xs text-muted-foreground">
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
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
          <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-xl bg-success-soft text-success">
            <span className="font-display text-xl leading-none">{pct}%</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ListChecks className="size-4 text-success" /> {block.title}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Scored {block.score} of {block.total} · embedded quiz result
            </div>
          </div>
          <Check className="size-5 text-success" />
        </div>
      );
    }
    default:
      return null;
  }
}
