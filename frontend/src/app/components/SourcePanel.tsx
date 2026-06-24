import { FileText, ScanLine, Table, Image as ImageIcon, Workflow, Type } from "lucide-react";
import { motion } from "motion/react";
import type { Source, SourceType } from "../lib/types";
import { cn } from "./ui/utils";
import { ScrollArea } from "./ui/scroll-area";

interface SourcePanelProps {
  sources: Source[];
  activeId?: string | null;
  onSelect?: (id: string) => void;
}

function scoreColor(score: number) {
  if (score >= 0.9) return "var(--success)";
  if (score >= 0.8) return "var(--cyan)";
  if (score >= 0.7) return "var(--warning)";
  return "var(--muted-foreground)";
}

const TYPE_META: Record<SourceType, { label: string; Icon: typeof Type }> = {
  text: { label: "Text", Icon: Type },
  ocr: { label: "OCR", Icon: ScanLine },
  table: { label: "Table", Icon: Table },
  image: { label: "Image", Icon: ImageIcon },
  diagram: { label: "Diagram", Icon: Workflow },
};

function SourceTypeBadge({ type }: { type: SourceType }) {
  const { label, Icon } = TYPE_META[type] ?? TYPE_META.text;
  return (
    <span className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
      <Icon className="size-3" />
      {label}
    </span>
  );
}

export function SourcePanel({ sources, activeId, onSelect }: SourcePanelProps) {
  return (
    <div className="flex h-full flex-col border-r border-border bg-card/40">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium">Sources</span>
        </div>
        <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {sources.length}
        </span>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-3">
          {sources.length === 0 && (
            <p className="px-2 py-8 text-center text-sm text-muted-foreground">
              Retrieved sources will appear here once you ask a question.
            </p>
          )}
          {sources.map((s, i) => (
            <motion.button
              key={s.id}
              id={`source-${i + 1}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onSelect?.(s.id)}
              className={cn(
                "w-full scroll-mt-4 rounded-lg border p-3 text-left transition-colors",
                activeId === s.id
                  ? "border-primary/60 bg-violet-soft"
                  : "border-border bg-card hover:border-ring/40 hover:bg-accent/40",
              )}
            >
              <div className="flex items-start gap-2">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-md border border-primary/40 bg-violet-soft font-mono text-[10px] font-medium text-primary">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{s.title}</div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <SourceTypeBadge type={s.sourceType ?? "text"} />
                    <span>
                      {s.course} · p.{s.page}
                    </span>
                  </div>
                </div>
              </div>
              {s.imageUrl && (s.sourceType === "image" || s.sourceType === "diagram") && (
                <img
                  src={s.imageUrl}
                  alt={s.snippet}
                  loading="lazy"
                  className="mt-2 max-h-32 w-full rounded-md border border-border object-contain bg-muted/40"
                />
              )}
              <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                {s.snippet}
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${s.similarity * 100}%`,
                      backgroundColor: scoreColor(s.similarity),
                    }}
                  />
                </div>
                <span
                  className="font-mono text-[11px] font-medium"
                  style={{ color: scoreColor(s.similarity) }}
                >
                  {(s.similarity * 100).toFixed(0)}%
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
