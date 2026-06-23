import { FileText } from "lucide-react";
import { motion } from "motion/react";
import type { Source } from "../lib/types";
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
                  <div className="text-xs text-muted-foreground">
                    {s.course} · p.{s.page}
                  </div>
                </div>
              </div>
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
