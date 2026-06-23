import { useState } from "react";
import { Workflow, Copy, Check, Download, FileImage, Code2 } from "lucide-react";
import { toast } from "sonner";
import { DiagramViewer } from "../components/DiagramViewer";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ScrollArea } from "../components/ui/scroll-area";
import { diagrams } from "../lib/mock-data";
import { cn } from "../components/ui/utils";

export function Diagrams() {
  const [active, setActive] = useState(diagrams[0]);
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(active.mermaid);
    setCopied(true);
    toast.success("Mermaid copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex h-full">
      {/* Diagram list */}
      <div className="flex w-72 shrink-0 flex-col border-r border-border bg-card/40">
        <div className="border-b border-border px-4 py-3 text-sm font-medium">
          Diagrams
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-1 p-2">
            {diagrams.map((d) => (
              <button
                key={d.id}
                onClick={() => setActive(d)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors",
                  active.id === d.id ? "bg-violet-soft" : "hover:bg-accent/40",
                )}
              >
                <div
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-lg",
                    active.id === d.id ? "bg-primary text-white" : "bg-muted text-muted-foreground",
                  )}
                >
                  <Workflow className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{d.title}</div>
                  <div className="truncate text-xs text-muted-foreground">{d.kind}</div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Preview */}
      <div className="min-w-0 flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 flex h-12 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{active.title}</span>
            <Badge variant="outline" className="border-cyan/40 bg-cyan-soft text-cyan">
              {active.kind}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => setShowCode((s) => !s)}>
              <Code2 className="size-3.5" /> {showCode ? "Hide" : "Show"} code
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={copy}>
              {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
              Copy Mermaid
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.success("Exported as SVG")}>
              <Download className="size-3.5" /> SVG
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.success("Exported as PNG")}>
              <FileImage className="size-3.5" /> PNG
            </Button>
          </div>
        </div>

        <div className="space-y-4 p-6">
          <DiagramViewer code={active.mermaid} />
          {showCode && (
            <pre className="overflow-x-auto rounded-lg border border-border bg-secondary p-4 font-mono text-[13px] text-foreground/80">
              {active.mermaid}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
