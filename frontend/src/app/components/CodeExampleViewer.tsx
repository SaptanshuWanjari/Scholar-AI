import { X, Clock, HardDrive, AlertTriangle, Info, BookOpen } from "lucide-react";
import type { CodeExample } from "../lib/types";
import { Button } from "./ui/button";

export function CodeExampleViewer({
  example,
  onClose,
}: {
  example: CodeExample;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="relative flex w-full max-w-4xl max-h-[90vh] flex-col rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4 bg-muted/20">
          <div>
            <h2 className="text-xl font-bold">{example.title}</h2>
            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
              <span className="font-mono bg-accent px-2 py-0.5 rounded-md">{example.language}</span>
              <span>•</span>
              <span>{example.topic}</span>
              <span>•</span>
              <span className="text-amber-500 font-medium">{example.difficulty}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          <div className="space-y-4">
            {example.purpose && (
              <div>
                <h3 className="text-sm font-semibold mb-1 flex items-center gap-2"><Info className="size-4" /> Purpose</h3>
                <p className="text-sm text-muted-foreground">{example.purpose}</p>
              </div>
            )}
            {example.explanation && (
              <div>
                <h3 className="text-sm font-semibold mb-1">Explanation</h3>
                <p className="text-sm text-foreground">{example.explanation}</p>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border bg-zinc-950 p-4 overflow-x-auto">
            <pre className="text-sm font-mono text-zinc-50">
              <code>{example.code}</code>
            </pre>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {example.inputs && (
              <div className="p-3 rounded-xl bg-accent/50 border border-border">
                <h4 className="text-xs font-semibold uppercase tracking-wider mb-1 text-muted-foreground">Inputs</h4>
                <p className="text-sm">{example.inputs}</p>
              </div>
            )}
            {example.outputs && (
              <div className="p-3 rounded-xl bg-accent/50 border border-border">
                <h4 className="text-xs font-semibold uppercase tracking-wider mb-1 text-muted-foreground">Outputs</h4>
                <p className="text-sm">{example.outputs}</p>
              </div>
            )}
            {example.time_complexity && (
              <div className="p-3 rounded-xl bg-accent/50 border border-border flex items-center gap-3">
                <Clock className="size-5 text-muted-foreground" />
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Time</h4>
                  <p className="text-sm font-mono">{example.time_complexity}</p>
                </div>
              </div>
            )}
            {example.space_complexity && (
              <div className="p-3 rounded-xl bg-accent/50 border border-border flex items-center gap-3">
                <HardDrive className="size-5 text-muted-foreground" />
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Space</h4>
                  <p className="text-sm font-mono">{example.space_complexity}</p>
                </div>
              </div>
            )}
          </div>

          {example.common_mistakes && (
            <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5">
              <h3 className="text-sm font-semibold text-destructive flex items-center gap-2 mb-2">
                <AlertTriangle className="size-4" /> Common Mistakes
              </h3>
              <p className="text-sm text-foreground">{example.common_mistakes}</p>
            </div>
          )}

          <div className="pt-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <BookOpen className="size-4" />
              <span>Extracted from <strong>{example.course}</strong>, Page {example.page_number}</span>
            </div>
            {/* The actual original document could be linked here if we load the document title from the API */}
          </div>
        </div>
      </div>
    </div>
  );
}
