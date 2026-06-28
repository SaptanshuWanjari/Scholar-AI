import { Component, useEffect, useState, type ReactNode } from "react";
import { Workflow, Copy, Check, Download, FileImage, FileDown, Code2, Sparkles, Loader2, AlertCircle, Trash2, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../components/ui/dropdown-menu";
import { GenerationSteps } from "../components/GenerationSteps";
import { toast } from "sonner";
import { DiagramViewer } from "../components/DiagramViewer";
import QualityBadge from "../components/QualityBadge";
import { AddToNotebookMenu } from "../components/AddToNotebookMenu";
import { Button, buttonVariants } from "../components/ui/button";
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
import { api } from "../lib/api";
import { exportNodeToPdf } from "../lib/export";
import type { Course, DiagramItem, DocumentItem } from "../lib/types";
import { useDiagramGenStore } from "../stores/useDiagramGenStore";
import { cn } from "../components/ui/utils";

const DIAGRAM_TYPES = [
  { value: "flowchart", label: "Flowchart" },
  { value: "decision_tree", label: "Decision tree" },
  { value: "concept_map", label: "Concept map" },
  { value: "plantuml", label: "PlantUML" },
] as const;

export function Diagrams() {
  const [items, setItems] = useState<DiagramItem[]>([]);
  const [active, setActiveState] = useState<DiagramItem | null>(null);
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  // Generation state lives in a global store so an in-flight generation keeps
  // running (and shows a pending item) when navigating away and back.
  const { topic, course, document: docId, type, generating, generated, setField, generate } = useDiagramGenStore();
  const setTopic = (v: string) => setField("topic", v);
  const setCourse = (v: string) => setField("course", v);
  const setDocument = (v: string | null) => setField("document", v);
  const setType = (v: string) => setField("type", v);

  // Selecting a diagram also records its id in the store, so the viewer
  // restores the same diagram after navigating away and back.
  const setActive = (d: DiagramItem | null) => {
    setActiveState(d);
    setField("activeId", d?.id ?? null);
  };

  // Absorb the latest generated diagram into the list + select it. Runs on
  // mount too, so a diagram generated while the page was unmounted shows up.
  useEffect(() => {
    if (!generated) return;
    setItems((prev) => (prev.some((d) => d.id === generated.id) ? prev : [generated, ...prev]));
    setActive(generated);
    setShowCode(false);
  }, [generated]);

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
    api.listDocuments().then((ds) => { if (!cancelled) setDocuments(ds); }).catch(() => {});
    api
      .listDiagrams()
      .then((ds) => {
        if (cancelled) return;
        setItems(ds);
        // Restore the previously-open diagram by id; fall back to the first.
        const storedId = useDiagramGenStore.getState().activeId;
        setActiveState((cur) => cur ?? ds.find((d) => d.id === storedId) ?? ds[0] ?? null);
      })
      .catch(() => {
        /* empty library */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const remove = async (id: string) => {
    try {
      await api.deleteDiagram(id);
      const next = items.filter((d) => d.id !== id);
      setItems(next);
      if (active?.id === id) setActive(next[0] ?? null);
      toast.success("Diagram deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete diagram");
    }
  };

  const copy = () => {
    if (!active) return;
    navigator.clipboard.writeText(active.mermaid);
    setCopied(true);
    toast.success("Mermaid copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  const exportSvg = () => {
    const svg = document.querySelector("#diagram-container svg");
    if (!svg) {
      toast.error("Diagram not found");
      return;
    }
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${active?.title || "diagram"}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Exported as SVG");
  };

  const exportPng = () => {
    const svg = document.querySelector("#diagram-container svg") as SVGElement;
    if (!svg) {
      toast.error("Diagram not found");
      return;
    }
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const rect = svg.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    if (ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.scale(2, 2);
    }
    const img = new Image();
    img.onload = () => {
      ctx?.drawImage(img, 0, 0, rect.width, rect.height);
      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = `${active?.title || "diagram"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Exported as PNG");
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const exportPdf = async () => {
    const svg = document.querySelector("#diagram-container svg") as HTMLElement;
    if (!svg) {
      toast.error("Diagram not found");
      return;
    }
    const nodeToExport = svg.parentElement || svg;
    try {
      await exportNodeToPdf(nodeToExport, active?.title || "diagram");
      toast.success("Exported as PDF");
    } catch (err) {
      toast.error("Failed to export as PDF");
    }
  };

  return (
    <div className="flex h-full">
      {/* Diagram list */}
      <div className="flex w-72 shrink-0 flex-col border-r border-border bg-card/40">
        <div className="border-b border-border px-4 py-3 text-sm font-medium">
          Diagrams
        </div>
        <ScrollArea className="flex-1 [&>[data-radix-scroll-area-viewport]>div]:!block">
          <div className="space-y-1 p-2 w-full">
            {generating && (
              <div className="flex w-full items-center gap-3 rounded-lg border border-dashed border-violet/40 bg-violet-soft/40 p-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-violet">
                  <Loader2 className="size-4 animate-spin" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{topic.trim() || "Generating…"}</div>
                  <div className="truncate text-xs text-muted-foreground">Generating…</div>
                </div>
              </div>
            )}
            {items.length === 0 && !generating && (
              <div className="px-3 py-8 text-center text-xs text-muted-foreground">
                No diagrams yet. Generate one to get started.
              </div>
            )}
            {items.map((d) => (
              <div
                key={d.id}
                onClick={() => setActive(d)}
                className={cn(
                  "group flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-left transition-colors",
                  active?.id === d.id ? "bg-violet-soft" : "hover:bg-accent/40",
                )}
              >
                <div
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-lg",
                    active?.id === d.id ? "bg-primary text-white" : "bg-muted text-muted-foreground",
                  )}
                >
                  <Workflow className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{d.title}</div>
                  <div className="truncate text-xs text-muted-foreground">{d.kind}</div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 shrink-0 text-muted-foreground opacity-0 hover:text-danger group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    void remove(d.id);
                  }}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Preview */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
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
          <Select value={docId ?? "all"} onValueChange={(v) => setDocument(v === "all" ? null : v)}>
            <SelectTrigger className="h-9 w-44 bg-input-background">
              <SelectValue placeholder="All documents" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All documents</SelectItem>
              {documents.filter(d => course !== "none" ? d.course === course : true).map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.title}
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
        <GenerationSteps
          steps={["Searching your library", "Analyzing relationships", "Building diagram structure", "Rendering Mermaid"]}
          loading={generating}
          className="border-b border-border px-6 py-3"
          interval={2200}
        />

        {active ? (
          <>
            <div className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-xl">
              <div className="flex min-w-0 flex-1 items-start gap-2">
                <span className="line-clamp-2 break-words text-sm font-medium" title={active.title}>{active.title}</span>
                <Badge variant="outline" className="shrink-0 border-cyan/40 bg-cyan-soft text-cyan">
                  {active.kind}
                </Badge>
                <QualityBadge score={active.quality} />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => setShowCode((s) => !s)}>
                  <Code2 className="size-3.5" /> {showCode ? "Hide" : "Show"} code
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5" onClick={copy}>
                  {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
                  {active.kind === "PlantUML" ? "Copy PlantUML" : "Copy Mermaid"}
                </Button>
                <AddToNotebookMenu
                  artifactType="diagram"
                  content={{ title: active.title, mermaid: active.mermaid }}
                  sourceId={active.id}
                  course={active.course}
                />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5 cursor-pointer")}>
                      <Download className="size-3.5" /> Export <ChevronDown className="size-3.5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={exportSvg}>
                      <Download className="size-3.5" /> Export as SVG
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={exportPng}>
                      <FileImage className="size-3.5" /> Export as PNG
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={exportPdf}>
                      <FileDown className="size-3.5" /> Export as PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="relative flex min-h-0 flex-1 flex-col" id="diagram-container">
              <div className="min-h-0 flex-1 relative">
                <DiagramErrorBoundary key={active.id} code={active.mermaid} kind={active.kind}>
                  <DiagramViewer code={active.mermaid} flush title={active.title || "diagram"} kind={active.kind} />
                </DiagramErrorBoundary>
              </div>
              {showCode && (
                <div className="absolute bottom-4 left-4 z-20">
                  <pre className="max-h-64 max-w-2xl overflow-auto rounded-lg border border-border bg-secondary/95 p-4 font-mono text-[13px] text-foreground/80 shadow-lg backdrop-blur">
                    {active.mermaid}
                  </pre>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex h-[60vh] flex-col items-center justify-center gap-3 text-center text-muted-foreground">
            <div className="flex size-12 items-center justify-center rounded-xl bg-violet-soft text-primary">
              <Workflow className="size-6" />
            </div>
            <div className="text-sm">No diagram selected — generate one above.</div>
          </div>
        )}
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
  { code: string; kind?: string; children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { code: string; kind?: string; children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    const label = this.props.kind === "PlantUML" ? "PlantUML" : "Mermaid";
    toast.error(`Couldn't render that diagram — the ${label} syntax may be invalid`);
  }

  render() {
    if (this.state.hasError) {
      const label = this.props.kind === "PlantUML" ? "PlantUML" : "Mermaid";
      return (
        <div className="flex min-h-[400px] w-full flex-col items-center justify-center gap-4 rounded-lg border border-border bg-card p-8 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-danger/10 text-danger">
            <AlertCircle className="size-6" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Diagram Error</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              The {label} syntax might be invalid. Try the code view or regenerate.
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
