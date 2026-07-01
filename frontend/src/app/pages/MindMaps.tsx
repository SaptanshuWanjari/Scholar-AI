import { useEffect, useMemo, useRef, useState } from "react";
import { Network, Sparkles, Loader2, Trash2, ImageDown, FileDown } from "lucide-react";
import { exportNodeToPng, exportNodeToPdf } from "../lib/export";
import { GenerationSteps } from "../components/GenerationSteps";
import { api, type GeneratedMindmap } from "../lib/api";
import type { Course, DocumentItem } from "../lib/types";
import { useMindmapStore, ALL_COURSES } from "../stores/useMindmapStore";
import { toast } from "sonner";
import { MindMapTree, parseMindmapText, countNodes } from "../components/MindMapTree";
import QualityBadge from "../components/QualityBadge";
import { AddToNotebookMenu } from "../components/AddToNotebookMenu";
import { PaperButton, GhostButton } from "@/paper-ui/components/buttons";
import { PaperBadge } from "@/paper-ui/components/badges";
import { PaperInput, PaperSelect } from "@/paper-ui/components/inputs";
import { ScrollArea } from "@/paper-ui/components/layout";
import { cn } from "@/paper-ui/utils";
import { SketchDivider } from "@/paper-ui/components/decorations";
import { PaperCard, PaperIconCircle } from "@/paper-ui/core";

export function MindMaps() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [items, setItems] = useState<GeneratedMindmap[]>([]);
  const [active, setActive] = useState<GeneratedMindmap | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  const { topic, course, document, loading, mindmap, setField, generate } = useMindmapStore();
  const setCourse = (v: string) => setField("course", v);
  const setDocument = (v: string | null) => setField("document", v);
  const setTopic = (v: string) => setField("topic", v);

  // Absorb a newly generated mindmap into the sidebar list and select it.
  useEffect(() => {
    if (!mindmap) return;
    setItems((prev) => (prev.some((m) => m.id === mindmap.id) ? prev : [mindmap, ...prev]));
    setActive(mindmap);
  }, [mindmap]);

  useEffect(() => {
    let cancelled = false;
    api
      .listCourses()
      .then((cs) => { if (!cancelled) setCourses(cs); })
      .catch(() => {});
    api.listDocuments().then((ds) => { if (!cancelled) setDocuments(ds); }).catch(() => {});
    api
      .listMindmaps()
      .then((ms) => {
        if (cancelled) return;
        setItems(ms);
        setActive((cur) => cur ?? ms[0] ?? null);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const remove = async (id: string) => {
    try {
      await api.deleteMindmap(id);
      const next = items.filter((m) => m.id !== id);
      setItems(next);
      if (active?.id === id) setActive(next[0] ?? null);
      toast.success("Mind map deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete mind map");
    }
  };

  const tree = useMemo(
    () => (active?.text ? parseMindmapText(active.text) : []),
    [active],
  );
  const nodeCount = useMemo(() => countNodes(tree), [tree]);

  const treeRef = useRef<HTMLDivElement>(null);
  const exportTree = async (kind: "png" | "pdf") => {
    if (!treeRef.current || !active) return;
    try {
      const name = active.title || "mindmap";
      if (kind === "png") await exportNodeToPng(treeRef.current, name);
      else await exportNodeToPdf(treeRef.current, name);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Export failed");
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="relative flex w-72 shrink-0 flex-col bg-card/40">
        {/* Hand-drawn vertical separator */}
        <svg className="absolute top-0 bottom-0 right-0 w-2 h-full z-10" preserveAspectRatio="none" aria-hidden>
          <path d="M1,0 Q3,20 0,40 T1,1000" fill="none" stroke="var(--color-pencil)" strokeWidth="1.2" strokeLinecap="round" vectorEffect="non-scaling-stroke" className="opacity-30" />
        </svg>
        <div className="relative px-4 py-3 font-caveat text-[20px] font-bold text-ink/90">
          Mind Maps
          <SketchDivider variant="wavy" className="absolute bottom-0 left-0 opacity-30" />
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-1 p-2">
            {loading && (
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
            {items.length === 0 && !loading && (
              <div className="px-3 py-8 text-center text-xs text-muted-foreground">
                No mind maps yet. Generate one to get started.
              </div>
            )}
            {items.map((m) => (
              <PaperCard
                key={m.id}
                onClick={() => setActive(m)}
                surface={active?.id === m.id ? "#fffdf9" : "transparent"}
                shadow={active?.id === m.id ? "sm" : "none"}
                border={active?.id === m.id ? undefined : null}
                className={cn(
                  "group flex w-full cursor-pointer items-center gap-3 p-3 text-left transition-all",
                  active?.id === m.id ? "" : "hover:bg-black/[0.02]"
                )}
              >
                <PaperIconCircle tone={active?.id === m.id ? "sky" : "ink"} size={36}>
                  <Network className="size-4" />
                </PaperIconCircle>
                <div className="min-w-0 flex-1 font-kalam">
                  <div className="truncate text-[14px] font-bold text-ink">{m.title}</div>
                  <div className="truncate text-[11px] text-ink-muted/80 font-architect">{m.course}</div>
                </div>
                <GhostButton
                  border={null}
                  className="size-7 min-h-0 p-0 shrink-0 text-ink-muted opacity-0 hover:text-danger group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    void remove(m.id);
                  }}
                >
                  <Trash2 className="size-3.5" />
                </GhostButton>
              </PaperCard>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main panel */}
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        {/* Generate controls */}
        <div className="relative flex flex-wrap items-center gap-2 bg-card/40 px-6 py-3">
          <SketchDivider variant="wavy" className="absolute bottom-0 left-0 opacity-30" />
          <PaperInput
            id="mindmap-topic-input"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !loading) generate(); }}
            placeholder="Topic to map…"
            className="max-w-xs flex-1"
            disabled={loading}
          />
          <PaperSelect
            value={course}
            onChange={setCourse}
            options={[
              { value: ALL_COURSES, label: "All courses" },
              ...courses.map((c) => ({ value: c.name, label: c.name })),
            ]}
            placeholder="All courses"
            wrapperClassName="w-48"
            disabled={loading}
          />
          <PaperSelect
            value={document ?? "all"}
            onChange={(v) => setDocument(v === "all" ? null : v)}
            options={[
              { value: "all", label: "All documents" },
              ...documents.filter(d => course !== ALL_COURSES ? d.course === course : true).map((d) => ({ value: d.id, label: d.title })),
            ]}
            placeholder="All documents"
            wrapperClassName="w-48"
            disabled={loading}
          />
          <PaperButton size="sm" onClick={generate} disabled={loading} className="gap-1.5">
            {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
            {loading ? "Generating..." : "Generate"}
          </PaperButton>
        </div>

        <GenerationSteps
          steps={["Searching your library", "Mapping concepts", "Building hierarchy", "Assembling tree"]}
          loading={loading}
          className="border-b border-border px-6 py-3"
          interval={2000}
        />

        {/* Tree viewer */}
        {active ? (
          <>
            <div className="sticky top-0 z-10 flex h-12 items-center gap-2 bg-background/80 px-6 backdrop-blur-xl">
              <SketchDivider variant="wavy" className="absolute bottom-0 left-0 opacity-30" />
              <div className="flex min-w-0 flex-1 items-center gap-2 font-kalam">
                <Network className="size-4 shrink-0 text-primary" />
                <span className="line-clamp-2 break-words text-[16px] font-bold text-ink" title={active.title}>{active.title}</span>
                <PaperBadge tone="sky" className="shrink-0">
                  {nodeCount} {nodeCount === 1 ? "node" : "nodes"}
                </PaperBadge>
                <QualityBadge score={active.quality} />
              </div>
              <div className="ml-auto flex items-center gap-1">
                <GhostButton size="sm" className="gap-1.5" onClick={() => exportTree("png")} title="Export PNG">
                  <ImageDown className="size-3.5" /> PNG
                </GhostButton>
                <GhostButton size="sm" className="gap-1.5" onClick={() => exportTree("pdf")} title="Export PDF">
                  <FileDown className="size-3.5" /> PDF
                </GhostButton>
                <AddToNotebookMenu
                  artifactType="mindmap"
                  content={{ title: active.title, text: active.text }}
                  sourceId={active.id}
                  course={active.course}
                />
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-6" ref={treeRef}>
                {active.course && (
                  <p className="mb-4 text-xs uppercase tracking-wider text-ink-muted/80 font-architect font-bold">
                    {active.course}
                  </p>
                )}
                <MindMapTree text={active.text} />
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center text-muted-foreground">
            <Network className="size-8 opacity-40" />
            <div>
              <p className="text-sm font-medium text-foreground">
                {items.length === 0 ? "No mind maps yet" : "No mind map selected"}
              </p>
              <p className="mt-1 text-sm max-w-sm mx-auto">
                {items.length === 0
                  ? "Generate one to get started mapping topics."
                  : "Enter a topic and press Generate, or select one from the sidebar."}
              </p>
            </div>
            {items.length === 0 && (
              <PaperButton 
                tone="paper"
                className="mt-2"
                onClick={() => window.document.getElementById("mindmap-topic-input")?.focus()}
              >
                Generate Mind Map
              </PaperButton>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
