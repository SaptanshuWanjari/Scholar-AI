import { Component, useEffect, useState, type ReactNode } from "react";
import { Workflow, Copy, Check, Download, FileImage, Code2, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { DiagramViewer } from "../components/DiagramViewer";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { diagrams as mockDiagrams } from "../lib/mock-data";
import { api } from "../lib/api";
import type { Course, DiagramItem } from "../lib/types";
import { cn } from "../components/ui/utils";

const DIAGRAM_TYPES = [
  { value: "flowchart", label: "Flowchart" },
  { value: "decision_tree", label: "Decision tree" },
  { value: "concept_map", label: "Concept map" },
] as const;

export function Diagrams() {
  const [items, setItems] = useState<DiagramItem[]>(mockDiagrams);
  const [active, setActive] = useState<DiagramItem>(mockDiagrams[0]);
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);

  // Generate controls
  const [topic, setTopic] = useState("");
  const [course, setCourse] = useState<string>("none");
  const [type, setType] = useState<string>(DIAGRAM_TYPES[0].value);
  const [courses, setCourses] = useState<Course[]>([]);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api
      .listCourses()
      .then((cs) => {
        if (!cancelled) setCourses(cs);
      })
      .catch(() => {
        /* leave course selector with just "No course" */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const generate = async () => {
    const t = topic.trim();
    if (!t) {
      toast.error("Enter a topic to generate a diagram");
      return;
    }
    setGenerating(true);
    try {
      const result = await api.generateDiagram(t, course === "none" ? null : course, type);
      if (!result.grounded || !result.mermaid?.trim()) {
        toast.error(
          !result.grounded
            ? "Couldn't ground a diagram for that topic"
            : "The generated diagram was empty",
        );
        return;
      }
      const diagram: DiagramItem = {
        id: result.id,
        title: result.title,
        course: result.course,
        kind: result.kind,
        mermaid: result.mermaid,
      };
      setItems((prev) => [diagram, ...prev]);
      setActive(diagram);
      setShowCode(false);
      toast.success("Diagram generated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to generate diagram");
    } finally {
      setGenerating(false);
    }
  };

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
            {items.map((d) => (
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
        {/* Generate control */}
        <div className="flex flex-wrap items-center gap-2 border-b border-border bg-card/40 px-6 py-3">
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !generating) generate();
            }}
            placeholder="Topic, e.g. TCP handshake"
            className="h-9 max-w-xs flex-1 bg-input-background"
          />
          <Select value={course} onValueChange={setCourse}>
            <SelectTrigger className="h-9 w-44 bg-input-background">
              <SelectValue placeholder="No course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No course</SelectItem>
              {courses.map((c) => (
                <SelectItem key={c.id} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="h-9 w-44 bg-input-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DIAGRAM_TYPES.map((dt) => (
                <SelectItem key={dt.value} value={dt.value}>
                  {dt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" className="gap-1.5" onClick={generate} disabled={generating}>
            {generating ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Sparkles className="size-3.5" />
            )}
            {generating ? "Generating..." : "Generate diagram"}
          </Button>
        </div>

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
          <DiagramErrorBoundary key={active.id} code={active.mermaid}>
            <DiagramViewer code={active.mermaid} />
          </DiagramErrorBoundary>
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

/**
 * Catches synchronous render errors thrown from DiagramViewer (e.g. invalid
 * Mermaid that the viewer's internal try/catch doesn't absorb) so a bad
 * LLM-generated diagram never crashes the whole page. Resets when the code
 * (and thus the `key`) changes.
 */
class DiagramErrorBoundary extends Component<
  { code: string; children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { code: string; children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    toast.error("Couldn't render that diagram — the Mermaid syntax may be invalid");
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[400px] w-full flex-col items-center justify-center gap-4 rounded-lg border border-border bg-card p-8 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-danger/10 text-danger">
            <AlertCircle className="size-6" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Diagram Error</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              The mermaid syntax might be invalid. Try the code view or regenerate.
            </p>
          </div>
          <pre className="mt-2 w-full overflow-x-auto rounded-lg border border-border bg-secondary p-3 text-left text-[11px] font-mono text-danger">
            {this.props.code}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
