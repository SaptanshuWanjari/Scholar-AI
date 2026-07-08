import { Component, useEffect, useState, type ReactNode } from "react";
import useSWR from "swr";
import { Workflow, Copy, Check, Download, FileImage, FileDown, Code2, Sparkles, Loader2, AlertCircle, Trash2, ChevronDown } from "lucide-react";
import { GenerationSteps } from "../components/GenerationSteps";
import { toast } from "@/app/lib/toast";
import { DiagramViewer } from "../components/DiagramViewer";
import QualityBadge from "../components/QualityBadge";
import { AddToNotebookMenu } from "../components/AddToNotebookMenu";
import { api } from "../lib/api";
import { exportNodeToPdf } from "../lib/export";
import type { DiagramItem } from "../lib/types";
import { useDiagramGenStore } from "../stores/useDiagramGenStore";
import { PaperButton, GhostButton } from "@/paper-ui/components/buttons";
import { PaperBadge } from "@/paper-ui/components/badges";
import { PaperInput, PaperSelect } from "@/paper-ui/components/inputs";
import { ScrollArea } from "@/paper-ui/components/layout";
import { PaperDropdown } from "@/paper-ui/components/dialogs";
import { cn } from "@/paper-ui/utils";
import { SketchDivider } from "@/paper-ui/components/decorations";
import { PaperCard, PaperIconCircle } from "@/paper-ui/core";

const DIAGRAM_TYPES = [
  { value: "flowchart", label: "Flowchart" },
  { value: "decision_tree", label: "Decision tree" },
  { value: "concept_map", label: "Concept map" },
  { value: "plantuml", label: "PlantUML" },
] as const;

export function Diagrams() {
  const [active, setActiveState] = useState<DiagramItem | null>(null);
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);

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
  const { data: courses = [] } = useSWR("courses", () => api.listCourses());
  const { data: documents = [] } = useSWR("documents", () => api.listDocuments());
  const { data: items = [], mutate: mutateItems } = useSWR("diagrams", () => api.listDiagrams());

  useEffect(() => {
    const storedId = useDiagramGenStore.getState().activeId;
    setActiveState((cur) => cur ?? items.find((d) => d.id === storedId) ?? items[0] ?? null);
  }, [items]);

  useEffect(() => {
    if (!generated) return;
    mutateItems((prev) => (prev?.some((d) => d.id === generated.id) ? prev : [generated, ...(prev ?? [])]), false);
    setActive(generated);
    setShowCode(false);
  }, [generated, mutateItems]);

  const remove = async (id: string) => {
    try {
      await api.deleteDiagram(id);
      const next = items.filter((d) => d.id !== id);
      mutateItems(next, false);
      if (active?.id === id) setActive(next[0] ?? null);
      toast.success("Diagram deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete diagram");
    }
  };

  const copy = () => {
    if (!active) return;
    navigator.clipboard.writeText(active.syntax);
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
      <div className="relative flex w-72 shrink-0 flex-col bg-card/40">
        {/* Hand-drawn vertical separator */}
        <svg className="absolute top-0 bottom-0 right-0 w-2 h-full z-10" preserveAspectRatio="none" aria-hidden>
          <path d="M1,0 Q3,20 0,40 T1,1000" fill="none" stroke="var(--color-pencil)" strokeWidth="1.2" strokeLinecap="round" vectorEffect="non-scaling-stroke" className="opacity-30" />
        </svg>
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
              <div className="px-3 py-8 text-center font-kalam text-sm text-ink-muted">
                No diagrams yet. Generate one to get started.
              </div>
            )}
            {items.map((d) => (
              <PaperCard
                key={d.id}
                onClick={() => setActive(d)}
                surface={active?.id === d.id ? "#fffdf9" : "transparent"}
                shadow={active?.id === d.id ? "sm" : "none"}
                border={active?.id === d.id ? undefined : null}
                className={cn(
                  "group flex w-full cursor-pointer items-center gap-3 p-3 text-left transition-all",
                  active?.id === d.id ? "" : "hover:bg-black/[0.02]"
                )}
              >
                <PaperIconCircle tone={active?.id === d.id ? "sky" : "ink"} size={36}>
                  <Workflow className="size-4" />
                </PaperIconCircle>
                <div className="min-w-0 flex-1 font-kalam">
                  <div className="truncate text-[14px] font-bold text-ink">{d.title}</div>
                  <div className="truncate text-[11px] text-ink-muted/80 font-architect">{d.kind}</div>
                </div>
                <GhostButton
                  border={null}
                  className="size-7 min-h-0 p-0 shrink-0 text-ink-muted opacity-0 hover:text-danger group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    void remove(d.id);
                  }}
                >
                  <Trash2 className="size-3.5" />
                </GhostButton>
              </PaperCard>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Preview */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Generate control */}
        <div className="relative flex flex-nowrap items-center gap-2 bg-card/40 px-6 py-3">
          <SketchDivider variant="wavy" className="absolute bottom-0 left-0 opacity-30" />
          <PaperInput
            id="diagram-topic-input"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !generating) generate();
            }}
            placeholder="Topic..."
            className="min-w-[120px] max-w-[180px] flex-1"
          />
          <PaperSelect
            value={course}
            onChange={setCourse}
            options={[
              { value: "none", label: "No course" },
              ...courses.map((c) => ({ value: c.name, label: c.name })),
            ]}
            placeholder="No course"
            wrapperClassName="w-28 shrink-0"
          />
          <PaperSelect
            value={docId ?? "all"}
            onChange={(v) => setDocument(v === "all" ? null : v)}
            options={[
              { value: "all", label: "All documents" },
              ...documents.filter(d => course !== "none" ? d.course === course : true).map((d) => ({ value: d.id, label: d.title })),
            ]}
            placeholder="All documents"
            wrapperClassName="w-32 shrink-0"
          />
          <PaperSelect
            value={type}
            onChange={setType}
            options={DIAGRAM_TYPES.map(dt => ({ value: dt.value, label: dt.label }))}
            wrapperClassName="w-28 shrink-0"
          />
          <PaperButton className="gap-1.5 shrink-0" onClick={generate} disabled={generating}>
            {generating ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Sparkles className="size-3.5" />
            )}
            {generating ? "Generating..." : "Generate"}
          </PaperButton>
        </div>
        <GenerationSteps
          steps={["Searching your library", "Analyzing relationships", "Building diagram structure", "Rendering Mermaid"]}
          loading={generating}
          className="border-b border-border px-6 py-3"
          interval={2200}
        />

        {active ? (
          <>
            <div className="relative flex h-12 shrink-0 items-center justify-between bg-background/80 px-6 backdrop-blur-xl">
              <SketchDivider variant="wavy" className="absolute bottom-0 left-0 opacity-30" />
              <div className="flex min-w-0 flex-1 items-center gap-2 font-kalam">
                <span className="line-clamp-2 break-words text-[16px] font-bold text-ink" title={active.title}>{active.title}</span>
                <PaperBadge tone="sky" className="shrink-0">
                  {active.kind}
                </PaperBadge>
                <QualityBadge score={active.quality} />
              </div>
              <div className="flex items-center gap-2">
                <GhostButton size="sm" className="gap-1.5" onClick={() => setShowCode((s) => !s)}>
                  <Code2 className="size-3.5" /> {showCode ? "Hide" : "Show"} code
                </GhostButton>
                <PaperButton tone="paper" size="sm" className="gap-1.5" onClick={copy}>
                  {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
                  {active.kind === "PlantUML" ? "Copy PlantUML" : "Copy Mermaid"}
                </PaperButton>
                <AddToNotebookMenu
                  artifactType="diagram"
                  content={{ title: active.title, syntax: active.syntax }}
                  sourceId={active.id}
                  course={active.course}
                />

                <PaperDropdown
                  trigger={
                    <PaperButton tone="paper" size="sm" className="gap-1.5">
                      <Download className="size-3.5" /> Export <ChevronDown className="size-3.5" />
                    </PaperButton>
                  }
                  items={[
                    { key: "svg", icon: <Download className="size-3.5" />, label: "Export as SVG", onClick: exportSvg },
                    { key: "png", icon: <FileImage className="size-3.5" />, label: "Export as PNG", onClick: exportPng },
                    { key: "pdf", icon: <FileDown className="size-3.5" />, label: "Export as PDF", onClick: exportPdf },
                  ]}
                  placement="bottom-right"
                />
              </div>
            </div>

            <div className="relative flex min-h-0 flex-1 flex-col" id="diagram-container">
              <div className="min-h-0 flex-1 relative">
                <DiagramErrorBoundary key={active.id} code={active.syntax} kind={active.kind}>
                  <DiagramViewer code={active.syntax} flush title={active.title || "diagram"} kind={active.kind} />
                </DiagramErrorBoundary>
              </div>
              {showCode && (
                <div className="absolute bottom-4 left-4 z-20">
                  <pre className="max-h-64 max-w-2xl overflow-auto rounded-lg border border-border bg-secondary/95 p-4 font-mono text-[13px] text-foreground/80 shadow-lg backdrop-blur">
                    {active.syntax}
                  </pre>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center">
            <PaperIconCircle tone="lavender" size={48}>
              <Workflow className="size-6" />
            </PaperIconCircle>
            <div className="font-kalam text-[18px] font-bold text-ink">
              {items.length === 0 ? "No diagrams yet" : "No diagram selected"}
            </div>
            <div className="font-architect text-[17px] text-ink-muted">
              {items.length === 0 
                ? "Generate one to get started visualizing concepts." 
                : "Select a diagram from the sidebar or generate a new one."}
            </div>
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
