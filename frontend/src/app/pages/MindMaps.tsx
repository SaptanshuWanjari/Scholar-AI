import { useEffect, useMemo, useRef, useState } from "react";
import { Network, Sparkles, Loader2, Trash2, ImageDown, FileDown } from "lucide-react";
import { exportNodeToPng, exportNodeToPdf } from "../lib/export";
import { GenerationSteps } from "../components/GenerationSteps";
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
import { api, type GeneratedMindmap } from "../lib/api";
import type { Course, DocumentItem } from "../lib/types";
import { useMindmapStore, ALL_COURSES } from "../stores/useMindmapStore";
import { toast } from "sonner";
import { cn } from "../components/ui/utils";
import { MindMapTree, parseMindmapText, countNodes } from "../components/MindMapTree";
import QualityBadge from "../components/QualityBadge";
import { AddToNotebookMenu } from "../components/AddToNotebookMenu";

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
      <div className="flex w-72 shrink-0 flex-col border-r border-border bg-card/40">
        <div className="border-b border-border px-4 py-3 text-sm font-medium">
          Mind Maps
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
              <div
                key={m.id}
                onClick={() => setActive(m)}
                className={cn(
                  "group flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-left transition-colors",
                  active?.id === m.id ? "bg-violet-soft" : "hover:bg-accent/40",
                )}
              >
                <div
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-lg",
                    active?.id === m.id ? "bg-primary text-white" : "bg-muted text-muted-foreground",
                  )}
                >
                  <Network className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{m.title}</div>
                  <div className="truncate text-xs text-muted-foreground">{m.course}</div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 shrink-0 text-muted-foreground opacity-0 hover:text-danger group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    void remove(m.id);
                  }}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main panel */}
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        {/* Generate controls */}
        <div className="flex flex-wrap items-center gap-2 border-b border-border bg-card/40 px-6 py-3">
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !loading) generate(); }}
            placeholder="Topic to map…"
            className="h-9 max-w-xs flex-1 bg-input-background"
            disabled={loading}
          />
          <Select value={course} onValueChange={setCourse} disabled={loading}>
            <SelectTrigger className="h-9 w-48 bg-input-background">
              <SelectValue placeholder="All courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_COURSES}>All courses</SelectItem>
              {courses.map((c) => (
                <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={document ?? "all"} onValueChange={(v) => setDocument(v === "all" ? null : v)} disabled={loading}>
            <SelectTrigger className="h-9 w-48 bg-input-background">
              <SelectValue placeholder="All documents" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All documents</SelectItem>
              {documents.filter(d => course !== ALL_COURSES ? d.course === course : true).map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" onClick={generate} disabled={loading} className="gap-1.5">
            {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
            {loading ? "Generating..." : "Generate"}
          </Button>
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
            <div className="sticky top-0 z-10 flex h-12 items-center gap-2 border-b border-border bg-background/80 px-6 backdrop-blur-xl">
              <Network className="size-4 text-primary" />
              <span className="text-sm font-medium">{active.title}</span>
              <Badge variant="outline" className="border-cyan/40 bg-cyan-soft text-cyan">
                {nodeCount} {nodeCount === 1 ? "node" : "nodes"}
              </Badge>
              <QualityBadge score={active.quality} />
              <div className="ml-auto flex items-center gap-1">
                <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => exportTree("png")} title="Export PNG">
                  <ImageDown className="size-3.5" /> PNG
                </Button>
                <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => exportTree("pdf")} title="Export PDF">
                  <FileDown className="size-3.5" /> PDF
                </Button>
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
                  <p className="mb-4 text-xs uppercase tracking-wide text-muted-foreground">
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
              <p className="text-sm font-medium text-foreground">No mind map selected</p>
              <p className="mt-1 text-sm">
                Enter a topic and press Generate, or select one from the sidebar.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
