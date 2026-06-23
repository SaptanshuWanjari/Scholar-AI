import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeMouseHandler,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  SlidersHorizontal,
  Tag,
  History,
  Bookmark,
  Sparkles,
  FileText,
  Layers,
  ListChecks,
  Workflow,
  Network,
  Notebook,
  BookOpen,
  Quote,
  Gauge,
  Compass,
  X,
  ExternalLink,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { cn } from "../components/ui/utils";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ScrollArea } from "../components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../components/ui/sheet";
import { ConceptNode } from "../components/ConceptNode";
import {
  savedViews,
  type ConceptData,
} from "../lib/graph-data";
import { useNavigate } from "react-router";
import { api, type KGGraph, type KGSidebar, type ConceptInspector } from "../lib/api";
import { MarkdownRenderer } from "../components/MarkdownRenderer";
import { useConceptActionStore } from "../stores/useConceptActionStore";
import { useKnowledgeBaseStore } from "../stores/useKnowledgeBaseStore";
import type { Course } from "../lib/types";

// stable node type map — must be outside component
const nodeTypes = { concept: ConceptNode };

// edge styling reused for every backend edge (mirrors the previous mock styling)
const edgeBase = {
  type: "smoothstep" as const,
  style: { stroke: "#c8c2b5", strokeWidth: 1.5 },
  labelStyle: { fontSize: 9, fill: "#79736a", fontFamily: "Inter, sans-serif" },
  labelBgStyle: { fill: "#f6f5f1", fillOpacity: 0.9 },
  labelBgPadding: [3, 2] as [number, number],
  labelBgBorderRadius: 3,
};

// ─── deterministic layout ─────────────────────────────────────────────────────
// The backend provides no x/y. We sort nodes so larger/more-referenced concepts
// sit toward the center, then place them on concentric rings: the single most
// important node is the hub at the origin, the rest fan out on rings whose
// capacity grows with radius. This is stable (no randomness) so the graph looks
// the same on every load.

const SIZE_WEIGHT: Record<ConceptData["size"], number> = {
  large: 3,
  medium: 2,
  small: 1,
};

function layoutGraph(graph: KGGraph): {
  nodes: Node<ConceptData>[];
  edges: Edge[];
} {
  // Most "important" first (size, then refCount) so hubs end up central.
  const ordered = [...graph.nodes].sort((a, b) => {
    const w = SIZE_WEIGHT[b.size] - SIZE_WEIGHT[a.size];
    if (w !== 0) return w;
    return b.refCount - a.refCount;
  });

  const CENTER = { x: 560, y: 360 };
  const RING_GAP = 230;

  const nodes: Node<ConceptData>[] = ordered.map((n, i) => {
    const data: ConceptData = {
      label: n.label,
      description: n.description,
      size: n.size,
      refCount: n.refCount,
      sourceCount: n.sourceCount,
      // ConceptData.cluster is a narrow union; the backend cluster is a free
      // string, so coerce it (it is only used as a tag, not switched on here).
      cluster: n.cluster as ConceptData["cluster"],
    };

    if (i === 0) {
      return { id: n.id, type: "concept", position: { ...CENTER }, data };
    }

    // ring index grows as we run out of room on inner rings:
    // ring r (1-based) holds up to 6*r slots.
    let idx = i - 1;
    let ring = 1;
    while (idx >= 6 * ring) {
      idx -= 6 * ring;
      ring += 1;
    }
    const slots = 6 * ring;
    // offset alternate rings so nodes don't line up radially
    const angle = (idx / slots) * 2 * Math.PI + (ring % 2 ? 0 : Math.PI / slots);
    const radius = ring * RING_GAP;

    return {
      id: n.id,
      type: "concept",
      position: {
        x: CENTER.x + radius * Math.cos(angle),
        y: CENTER.y + radius * Math.sin(angle),
      },
      data,
    };
  });

  const edges: Edge[] = graph.edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.label,
    ...edgeBase,
  }));

  return { nodes, edges };
}

// ─── main page ───────────────────────────────────────────────────────────────

export function KnowledgeBase() {
  // Exploration/session state lives in a global store so the research session
  // (selected concept, search, collection/filters, course, panel layout)
  // survives navigating away from this page and back.
  const {
    selectedId,
    drawerConceptId,
    leftCollapsed,
    rightCollapsed,
    searchQuery,
    activeCollection,
    course,
    activeFilters,
    setField,
    toggleFilter,
  } = useKnowledgeBaseStore();
  // Component still works with a Set for membership checks; derive it locally
  // from the serializable array kept in the store.
  const activeFilterSet = useMemo(() => new Set(activeFilters), [activeFilters]);

  const setSelectedId = useCallback((v: string | null) => setField("selectedId", v), [setField]);
  const setDrawerConceptId = useCallback((v: string | null) => setField("drawerConceptId", v), [setField]);
  const setLeftCollapsed = useCallback((v: boolean) => setField("leftCollapsed", v), [setField]);
  const setRightCollapsed = useCallback((v: boolean) => setField("rightCollapsed", v), [setField]);
  const setSearchQuery = useCallback((v: string) => setField("searchQuery", v), [setField]);
  const setActiveCollection = useCallback((v: string | null) => setField("activeCollection", v), [setField]);
  const setCourse = useCallback((v: string | null) => setField("course", v), [setField]);

  // graph state — re-fetched on mount, so it stays local (not in the store)
  const [graph, setGraph] = useState<{ nodes: Node<ConceptData>[]; edges: Edge[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [building, setBuilding] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);

  // explorer side-panel data loaded from the backend
  const [sidebar, setSidebar] = useState<KGSidebar>({
    collections: [],
    recentConcepts: [],
    sourceFilters: [],
  });

  const loadSidebar = useCallback(async (c: string | null) => {
    try {
      const s = await api.getKnowledgeSidebar(c);
      setSidebar(s);
      // Seed "all source-type filters enabled" only on a fresh session. If the
      // user already picked filters before navigating away, the store holds
      // them and we must NOT overwrite them on remount.
      const { initializedFilters } = useKnowledgeBaseStore.getState();
      if (!initializedFilters) {
        setField("activeFilters", s.sourceFilters);
        setField("initializedFilters", true);
      }
    } catch {
      // side-panel is non-critical — fall back to empty state
      setSidebar({ collections: [], recentConcepts: [], sourceFilters: [] });
    }
  }, [setField]);

  const loadGraph = useCallback(async (c: string | null) => {
    setLoading(true);
    try {
      const g = await api.getKnowledgeGraph(c);
      setGraph(layoutGraph(g));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load knowledge graph");
      setGraph({ nodes: [], edges: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGraph(course);
    loadSidebar(course);
  }, [course, loadGraph, loadSidebar]);

  // load courses once for the optional filter
  useEffect(() => {
    api.listCourses().then(setCourses).catch(() => {
      /* filter is optional — ignore failures */
    });
  }, []);

  const build = useCallback(async () => {
    setBuilding(true);
    toast.info("Building knowledge graph — this runs the LLM over your documents and may take a while…");
    try {
      const { concepts, edges } = await api.buildKnowledgeGraph(course);
      toast.success(`Knowledge graph built — ${concepts} concepts, ${edges} relationships.`);
      await Promise.all([loadGraph(course), loadSidebar(course)]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to build knowledge graph");
    } finally {
      setBuilding(false);
    }
  }, [course, loadGraph, loadSidebar]);

  const isEmpty = !!graph && graph.nodes.length === 0;

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── Left panel ── */}
      <motion.aside
        animate={{ width: leftCollapsed ? 0 : 280 }}
        transition={{ type: "spring", stiffness: 340, damping: 36 }}
        className="relative z-10 hidden shrink-0 flex-col overflow-hidden border-r border-border bg-card/50 lg:flex"
      >
        <div className="flex h-full w-[280px] flex-col overflow-hidden">
          {/* header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Compass className="size-3.5" /> Knowledge Explorer
            </div>
            <Button variant="ghost" size="icon" className="size-7" onClick={() => setLeftCollapsed(true)}>
              <PanelLeftClose className="size-4" />
            </Button>
          </div>

          {/* search */}
          <div className="border-b border-border p-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search concepts…"
                className="h-8 bg-input-background pl-8 text-xs"
              />
            </div>
          </div>

          <ScrollArea className="min-h-0 flex-1">
            {/* course filter (real) */}
            {courses.length > 0 && (
              <SideSection label="Course" icon={Bookmark}>
                <div className="space-y-0.5">
                  <button
                    onClick={() => setCourse(null)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-sm transition-colors",
                      course === null ? "bg-violet-soft text-violet" : "text-foreground/80 hover:bg-accent/50",
                    )}
                  >
                    <span>All courses</span>
                  </button>
                  {courses.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCourse(c.name === course ? null : c.name)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-sm transition-colors",
                        course === c.name ? "bg-violet-soft text-violet" : "text-foreground/80 hover:bg-accent/50",
                      )}
                    >
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </SideSection>
            )}

            {/* source filters (from backend) */}
            {sidebar.sourceFilters.length > 0 && (
              <SideSection label="Source Type" icon={SlidersHorizontal}>
                <div className="space-y-1">
                  {sidebar.sourceFilters.map((f) => (
                    <label key={f} className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1 text-sm text-foreground/80 hover:bg-accent/50">
                      <input
                        type="checkbox"
                        checked={activeFilterSet.has(f)}
                        onChange={() => toggleFilter(f)}
                        className="accent-violet"
                      />
                      {f}
                    </label>
                  ))}
                </div>
              </SideSection>
            )}

            {/* collections (from backend, concepts grouped by cluster) */}
            <SideSection label="Collections" icon={Bookmark}>
              {sidebar.collections.length === 0 ? (
                <p className="px-1 text-xs text-muted-foreground">
                  Build the graph to group concepts into collections.
                </p>
              ) : (
                <div className="space-y-0.5">
                  {sidebar.collections.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setActiveCollection(c.id === activeCollection ? null : c.id)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-sm transition-colors",
                        activeCollection === c.id ? "bg-violet-soft text-violet" : "text-foreground/80 hover:bg-accent/50",
                      )}
                    >
                      <span>{c.label}</span>
                      <span className="text-xs text-muted-foreground">{c.count}</span>
                    </button>
                  ))}
                </div>
              )}
            </SideSection>

            {/* recent (from backend) */}
            <SideSection label="Recent Concepts" icon={History}>
              {sidebar.recentConcepts.length === 0 ? (
                <p className="px-1 text-xs text-muted-foreground">
                  No concepts extracted yet.
                </p>
              ) : (
                <div className="flex flex-wrap gap-1.5 px-1">
                  {sidebar.recentConcepts.map((c) => (
                    <button
                      key={c}
                      className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] text-foreground/70 transition-colors hover:border-violet/40 hover:text-violet"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </SideSection>

            {/* saved views (mock-only) */}
            <SideSection label="Saved Views" icon={Tag}>
              {savedViews.map((v) => (
                <button
                  key={v.id}
                  className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-foreground/80 hover:bg-accent/50"
                >
                  <v.icon className="size-4 text-muted-foreground" />
                  <span>{v.label}</span>
                </button>
              ))}
            </SideSection>
          </ScrollArea>
        </div>
      </motion.aside>

      {/* ── Center canvas ── */}
      <div className="relative min-w-0 flex-1">
        {/* panel re-open buttons */}
        {leftCollapsed && (
          <button
            onClick={() => setLeftCollapsed(false)}
            className="absolute left-3 top-3 z-20 flex size-8 items-center justify-center rounded-full border border-border bg-card shadow-sm hover:bg-accent"
          >
            <PanelLeftOpen className="size-4" />
          </button>
        )}
        {rightCollapsed && (
          <button
            onClick={() => setRightCollapsed(false)}
            className="absolute right-3 top-3 z-20 flex size-8 items-center justify-center rounded-full border border-border bg-card shadow-sm hover:bg-accent"
          >
            <PanelRightOpen className="size-4" />
          </button>
        )}

        {/* Rebuild action for non-empty graphs */}
        {graph && !isEmpty && !loading && (
          <div className="absolute right-3 top-3 z-20">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 bg-card shadow-sm"
              onClick={build}
              disabled={building}
            >
              {building ? <Loader2 className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />}
              {building ? "Rebuilding…" : "Rebuild"}
            </Button>
          </div>
        )}

        {loading ? (
          <GraphLoading />
        ) : isEmpty ? (
          <GraphEmpty onBuild={build} building={building} />
        ) : (
          <GraphCanvas
            nodes={graph!.nodes}
            edges={graph!.edges}
            selectedId={selectedId}
            searchQuery={searchQuery}
            onNodeClick={(id) => setSelectedId(id === selectedId ? null : id)}
            onNodeDoubleClick={(id) => setDrawerConceptId(id)}
            onPaneClick={() => setSelectedId(null)}
          />
        )}

        {/* Bottom canvas legend */}
        {!loading && !isEmpty && (
          <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2">
            <div className="flex items-center gap-4 rounded-full border border-border bg-card/80 px-4 py-2 text-[11px] text-muted-foreground backdrop-blur">
              <LegendDot cls="size-4 border-2 border-foreground bg-card" label="Large (hub)" />
              <LegendDot cls="size-3 border border-foreground/60 bg-card" label="Medium" />
              <LegendDot cls="size-2.5 border border-foreground/40 bg-card" label="Small (rare)" />
              <span className="h-3 w-px bg-border" />
              <span className="flex items-center gap-1">Click to inspect · Double-click for details</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Right inspector ── */}
      <motion.aside
        animate={{ width: rightCollapsed ? 0 : 320 }}
        transition={{ type: "spring", stiffness: 340, damping: 36 }}
        className="relative z-10 hidden shrink-0 flex-col overflow-hidden border-l border-border bg-card/50 xl:flex"
      >
        <div className="flex h-full w-[320px] flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Inspector</span>
            <Button variant="ghost" size="icon" className="size-7" onClick={() => setRightCollapsed(true)}>
              <PanelRightClose className="size-4" />
            </Button>
          </div>
          <ScrollArea className="min-h-0 flex-1">
            {selectedId ? (
              <InspectorContent
                key={selectedId}
                conceptId={selectedId}
                onOpenDrawer={() => setDrawerConceptId(selectedId)}
              />
            ) : (
              <EmptyInspector />
            )}
          </ScrollArea>
        </div>
      </motion.aside>

      {/* ── Concept drawer (Sheet) ── */}
      <Sheet open={!!drawerConceptId} onOpenChange={(o) => !o && setDrawerConceptId(null)}>
        <SheetContent side="right" className="w-[540px] max-w-full overflow-y-auto p-0 sm:max-w-[540px]">
          {drawerConceptId && (
            <ConceptDrawerContent key={drawerConceptId} conceptId={drawerConceptId} onClose={() => setDrawerConceptId(null)} />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

// ─── data hook ────────────────────────────────────────────────────────────────

function useConcept(conceptId: string) {
  const [concept, setConcept] = useState<ConceptInspector | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setConcept(null);
    api
      .getConcept(conceptId)
      .then((c) => {
        if (!cancelled) setConcept(c);
      })
      .catch((err) => {
        if (!cancelled) {
          toast.error(err instanceof Error ? err.message : "Failed to load concept");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [conceptId]);

  return { concept, loading };
}

// ─── graph states ─────────────────────────────────────────────────────────────

function GraphLoading() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 bg-background text-muted-foreground">
      <Loader2 className="size-6 animate-spin text-violet" />
      <span className="text-sm">Loading knowledge graph…</span>
    </div>
  );
}

function GraphEmpty({ onBuild, building }: { onBuild: () => void; building: boolean }) {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-background px-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground">
        <Network className="size-7" />
      </div>
      <h3 className="mt-5 text-lg font-semibold">No knowledge graph yet</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        Build your knowledge graph to discover how concepts across your indexed documents
        connect. This runs the LLM over your documents and may take a while.
      </p>
      <Button className="mt-6 gap-2" onClick={onBuild} disabled={building}>
        {building ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
        {building ? "Building knowledge graph…" : "Build knowledge graph"}
      </Button>
      {building && (
        <p className="mt-3 text-xs text-muted-foreground">
          Extracting concepts and relationships — this can take a minute or two.
        </p>
      )}
    </div>
  );
}

// ─── graph canvas ─────────────────────────────────────────────────────────────

function GraphCanvas({
  nodes: sourceNodes,
  edges: sourceEdges,
  selectedId,
  searchQuery,
  onNodeClick,
  onNodeDoubleClick,
  onPaneClick,
}: {
  nodes: Node<ConceptData>[];
  edges: Edge[];
  selectedId: string | null;
  searchQuery: string;
  onNodeClick: (id: string) => void;
  onNodeDoubleClick: (id: string) => void;
  onPaneClick: () => void;
}) {
  const q = searchQuery.toLowerCase().trim();

  const styledNodes = useMemo(
    () =>
      sourceNodes.map((n) => ({
        ...n,
        selected: n.id === selectedId,
        style:
          q && !n.data.label.toLowerCase().includes(q)
            ? { opacity: 0.25, transition: "opacity 0.2s" }
            : { opacity: 1, transition: "opacity 0.2s" },
      })),
    [sourceNodes, selectedId, q],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(styledNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(sourceEdges);

  // keep ReactFlow's internal state in sync when graph/selection/search change
  useEffect(() => {
    setNodes(styledNodes);
  }, [styledNodes, setNodes]);
  useEffect(() => {
    setEdges(sourceEdges);
  }, [sourceEdges, setEdges]);

  const handleNodeClick: NodeMouseHandler = useCallback(
    (_, node) => onNodeClick(node.id),
    [onNodeClick],
  );
  const handleDblClick: NodeMouseHandler = useCallback(
    (_, node) => onNodeDoubleClick(node.id),
    [onNodeDoubleClick],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      onNodeClick={handleNodeClick}
      onNodeDoubleClick={handleDblClick}
      onPaneClick={onPaneClick}
      fitView
      fitViewOptions={{ padding: 0.22 }}
      proOptions={{ hideAttribution: true }}
      minZoom={0.3}
      maxZoom={3}
      className="bg-background"
      defaultEdgeOptions={{
        type: "smoothstep",
        style: { stroke: "#c8c2b5", strokeWidth: 1.5 },
      }}
    >
      <Background variant={BackgroundVariant.Dots} gap={28} size={1} color="#ddd8cc" />
      <Controls
        showInteractive={false}
        className="!border-border !bg-card [&_button]:!border-border [&_button]:!bg-card [&_button]:!fill-foreground [&_button:hover]:!bg-accent"
      />
    </ReactFlow>
  );
}

// ─── inspector content ────────────────────────────────────────────────────────

function InspectorContent({
  conceptId,
  onOpenDrawer,
}: {
  conceptId: string;
  onOpenDrawer: () => void;
}) {
  const { concept, loading } = useConcept(conceptId);
  const navigate = useNavigate();
  const [discoveries, setDiscoveries] = useState<string[] | null>(null);
  const [discovering, setDiscovering] = useState(false);
  // AI-action state lives in a global store so an in-flight action and its
  // result panel survive navigating away from the Knowledge page and back.
  const { running, runningConceptId, result, resultConceptId, clearResult, runAction } =
    useConceptActionStore();
  const showResult = result && resultConceptId === conceptId;

  const onDiscover = useCallback(async () => {
    setDiscovering(true);
    try {
      const list = await api.discoverConcepts(conceptId);
      setDiscoveries(list);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to discover related concepts");
    } finally {
      setDiscovering(false);
    }
  }, [conceptId]);

  if (loading || !concept) {
    return (
      <div className="flex flex-col items-center gap-3 px-6 pt-20 text-muted-foreground">
        <Loader2 className="size-5 animate-spin text-violet" />
        <span className="text-sm">Loading concept…</span>
      </div>
    );
  }

  const ri = concept.referencedIn ?? {};
  const refInRows = [
    { label: "Documents", icon: FileText, count: ri.documents ?? 0 },
    { label: "Notebook Notes", icon: Notebook, count: ri.notes ?? 0 },
    { label: "Flashcards", icon: Layers, count: ri.flashcards ?? 0 },
    { label: "Quizzes", icon: ListChecks, count: ri.quizzes ?? 0 },
    { label: "Saved Answers", icon: Sparkles, count: ri.answers ?? 0 },
    { label: "Diagrams", icon: Workflow, count: ri.diagrams ?? 0 },
  ];

  const aiActions = [
    { label: "Explain Concept", icon: Sparkles },
    { label: "Generate Summary", icon: FileText },
    { label: "Generate Flashcards", icon: Layers },
    { label: "Generate Quiz", icon: ListChecks },
    { label: "Generate Diagram", icon: Workflow },
    { label: "Generate Mind Map", icon: Network },
    { label: "Add To Notebook", icon: Notebook },
  ];

  return (
    <div className="space-y-0 divide-y divide-border">
      {/* Concept header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display text-2xl leading-tight">{concept.name}</h2>
          <Button variant="outline" size="sm" className="shrink-0 gap-1.5" onClick={onOpenDrawer}>
            <ExternalLink className="size-3.5" /> Full page
          </Button>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{concept.description}</p>

        <div className="mt-4 flex gap-3">
          <div className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-center">
            <div className="font-display text-2xl leading-none">{(concept.confidence * 100).toFixed(0)}%</div>
            <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">Confidence</div>
          </div>
          <div className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-center">
            <div className="font-display text-2xl leading-none">{concept.refCount}</div>
            <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">References</div>
          </div>
          <div className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-center">
            <div className="font-display text-2xl leading-none">{concept.sourceCount}</div>
            <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">Sources</div>
          </div>
        </div>
      </div>

      {/* Related concepts */}
      <div className="p-4">
        <InspectorBlock title="Related Concepts">
          <div className="flex flex-wrap gap-1.5">
            {concept.relatedConcepts.map((c) => (
              <span key={c} className="cursor-pointer rounded-full border border-border bg-card px-2.5 py-1 text-[11px] text-foreground/80 hover:border-violet/40 hover:text-violet">
                {c}
              </span>
            ))}
          </div>
        </InspectorBlock>
      </div>

      {/* Referenced in */}
      <div className="p-4">
        <InspectorBlock title="Referenced In">
          <div className="space-y-1">
            {refInRows.map((r) => (
              <div key={r.label} className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-accent/50">
                <span className="flex items-center gap-2 text-sm text-foreground/80">
                  <r.icon className="size-3.5 text-muted-foreground" /> {r.label}
                </span>
                <Badge variant="outline" className="text-xs">{r.count}</Badge>
              </div>
            ))}
          </div>
        </InspectorBlock>
      </div>

      {/* Citations */}
      <div className="p-4">
        <InspectorBlock title="Source Citations">
          <div className="space-y-2">
            {concept.citations.map((c, i) => (
              <div key={i} className="rounded-lg border border-border bg-card px-3 py-2">
                <div className="flex items-start gap-2">
                  <Quote className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">{c.source}</div>
                    <div className="text-[11px] text-muted-foreground">{c.detail}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </InspectorBlock>
      </div>

      {/* Generated assets */}
      <div className="p-4">
        <InspectorBlock title="Generated Assets">
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Open Flashcards", icon: Layers, to: "/flashcards" },
              { label: "Open Quiz", icon: ListChecks, to: "/quiz" },
              { label: "Open Diagram", icon: Workflow, to: "/diagrams" },
              { label: "Open Mind Map", icon: Network, to: "/mindmaps" },
              { label: "Open Notebook", icon: Notebook, to: "/notebooks" },
            ].map((a) => (
              <button
                key={a.label}
                onClick={() => navigate(a.to)}
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-2 text-[12px] font-medium text-foreground/80 transition-colors hover:border-violet/40 hover:text-violet"
              >
                <a.icon className="size-3.5" /> {a.label}
              </button>
            ))}
          </div>
        </InspectorBlock>
      </div>

      {/* AI Actions */}
      <div className="p-4">
        <InspectorBlock title="AI Actions">
          <div className="space-y-1">
            {aiActions.map((a) => {
              const isRunning = running === a.label && runningConceptId === conceptId;
              return (
                <button
                  key={a.label}
                  onClick={() => concept && runAction(concept, conceptId, a.label, navigate)}
                  disabled={running !== null}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-foreground/80 transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50"
                >
                  {isRunning ? (
                    <Loader2 className="size-4 animate-spin text-violet" />
                  ) : (
                    <a.icon className="size-4 text-violet" />
                  )}
                  {isRunning ? `${a.label}…` : a.label}
                </button>
              );
            })}
          </div>
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 overflow-hidden rounded-lg border border-border bg-card"
              >
                <div className="flex items-center justify-between border-b border-border px-3 py-2">
                  <span className="text-xs font-medium">{result!.title}</span>
                  <button onClick={clearResult} className="text-muted-foreground hover:text-foreground">
                    <X className="size-3.5" />
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto p-3">
                  {result!.mono ? (
                    <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-foreground/80">{result!.body}</pre>
                  ) : (
                    <MarkdownRenderer content={result!.body} />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </InspectorBlock>
      </div>

      {/* Semantic discovery */}
      <div className="p-4">
        <Button
          onClick={onDiscover}
          variant="outline"
          disabled={discovering}
          className="w-full gap-2 border-violet/30 text-violet hover:bg-violet-soft"
        >
          {discovering ? <Loader2 className="size-4 animate-spin" /> : <Compass className="size-4" />}
          {discovering ? "Discovering…" : "Discover Related Concepts"}
        </Button>
        <AnimatePresence>
          {discoveries && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 overflow-hidden"
            >
              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <Sparkles className="size-3 text-violet" /> AI Suggestions
              </div>
              {discoveries.length === 0 ? (
                <p className="mt-2 text-xs text-muted-foreground">No related concepts found.</p>
              ) : (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {discoveries.map((d) => (
                    <button
                      key={d}
                      className="rounded-full border border-violet/30 bg-violet-soft px-2.5 py-1 text-[11px] text-violet"
                    >
                      + {d}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function EmptyInspector() {
  return (
    <div className="flex flex-col items-center px-6 pt-20 text-center">
      <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground">
        <Network className="size-6" />
      </div>
      <h3 className="mt-4 text-base font-semibold">Explore your knowledge base</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Click any concept in the graph to inspect its sources, references, and generated assets.
      </p>
      <Button
        variant="outline"
        className="mt-6 gap-2"
        onClick={() => toast.info("Browsing all concepts…")}
      >
        <Compass className="size-4" /> Browse Concepts
      </Button>
      <div className="mt-8 w-full rounded-xl border border-border bg-card p-4 text-left">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">How it works</div>
        <p className="mt-2 text-xs leading-relaxed text-foreground/80">
          ScholarAI automatically discovers relationships between concepts across your documents, notes, flashcards, quizzes and AI answers — building your personal knowledge graph.
        </p>
      </div>
    </div>
  );
}

// ─── concept drawer ───────────────────────────────────────────────────────────

function ConceptDrawerContent({ conceptId, onClose }: { conceptId: string; onClose: () => void }) {
  const { concept, loading } = useConcept(conceptId);
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  const addToNotebook = async () => {
    if (!concept || adding) return;
    setAdding(true);
    try {
      const ex = await api.ask(`Explain the concept: ${concept.name}`);
      const nb = await api.createNotebook(concept.name);
      await api.updateNotebook(nb.id, {
        blocks: [
          { type: "heading", level: 1, text: concept.name },
          { type: "ai-answer", question: `Explain ${concept.name}`, answer: ex.content, confidence: 1, sources: 0 },
        ],
      });
      toast.success("Added to notebook", { action: { label: "Open", onClick: () => navigate("/notebooks") } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add to notebook");
    } finally {
      setAdding(false);
    }
  };

  if (loading || !concept) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="size-6 animate-spin text-violet" />
        <span className="text-sm">Loading concept…</span>
      </div>
    );
  }

  const ri = concept.referencedIn ?? {};
  const refInRows = [
    { label: "Documents", icon: FileText, count: ri.documents ?? 0 },
    { label: "Notes", icon: Notebook, count: ri.notes ?? 0 },
    { label: "Flashcards", icon: Layers, count: ri.flashcards ?? 0 },
    { label: "Quizzes", icon: ListChecks, count: ri.quizzes ?? 0 },
    { label: "Answers", icon: Sparkles, count: ri.answers ?? 0 },
    { label: "Diagrams", icon: Workflow, count: ri.diagrams ?? 0 },
  ];

  return (
    <div className="flex h-full flex-col">
      {/* Drawer header */}
      <SheetHeader className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] text-muted-foreground">Concept</Badge>
              <Badge variant="outline" className="border-success/40 bg-success-soft text-[10px] text-success">
                <Gauge className="mr-1 size-2.5" /> {(concept.confidence * 100).toFixed(0)}%
              </Badge>
            </div>
            <SheetTitle className="mt-1 font-display text-2xl">{concept.name}</SheetTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="size-4" /></Button>
        </div>
      </SheetHeader>

      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-8 px-6 py-6">
          {/* Definition */}
          <DrawerBlock title="Definition">
            <p className="font-reading text-[16px] leading-relaxed text-foreground/90">{concept.definition}</p>
          </DrawerBlock>

          {/* AI Summary */}
          <DrawerBlock title="AI Summary">
            <div className="rounded-xl border border-violet/25 bg-violet-soft/40 p-4">
              <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-violet">
                <Sparkles className="size-3" /> ScholarAI
              </div>
              <p className="font-reading text-[15px] leading-relaxed text-foreground/90">{concept.aiSummary}</p>
            </div>
          </DrawerBlock>

          {/* Source References */}
          <DrawerBlock title="Source References">
            <div className="space-y-2">
              {concept.citations.map((c, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-3">
                  <Quote className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">{c.source}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{c.detail}</div>
                  </div>
                  <ExternalLink className="ml-auto size-3.5 shrink-0 text-muted-foreground" />
                </div>
              ))}
            </div>
          </DrawerBlock>

          {/* Related Concepts */}
          <DrawerBlock title="Related Concepts">
            <div className="flex flex-wrap gap-2">
              {concept.relatedConcepts.map((c) => (
                <span key={c} className="cursor-pointer rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground/80 hover:border-violet/40 hover:text-violet">
                  {c}
                </span>
              ))}
            </div>
          </DrawerBlock>

          {/* Referenced In */}
          <DrawerBlock title="Referenced In">
            <div className="grid grid-cols-2 gap-2">
              {refInRows.map((r) => (
                <div key={r.label} className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
                  <r.icon className="size-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <div className="font-display text-lg leading-none">{r.count}</div>
                    <div className="text-[10px] text-muted-foreground">{r.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </DrawerBlock>

          {/* Generated Assets */}
          <DrawerBlock title="Generated Assets">
            <div className="space-y-1">
              {[
                { label: "Open Flashcard Deck", icon: Layers, onClick: () => navigate("/flashcards") },
                { label: "Open Quiz", icon: ListChecks, onClick: () => navigate("/quiz") },
                { label: "Open Diagram", icon: Workflow, onClick: () => navigate("/diagrams") },
                { label: "Open Mind Map", icon: Network, onClick: () => navigate("/mindmaps") },
                { label: "Add To Notebook", icon: Notebook, onClick: addToNotebook },
                { label: "View in Reading Mode", icon: BookOpen, onClick: () => navigate("/reading") },
              ].map((a) => (
                <button
                  key={a.label}
                  onClick={a.onClick}
                  disabled={a.label === "Add To Notebook" && adding}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground/80 transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50"
                >
                  {a.label === "Add To Notebook" && adding ? (
                    <Loader2 className="size-4 animate-spin text-violet" />
                  ) : (
                    <a.icon className="size-4 text-violet" />
                  )}
                  {a.label}
                  <ExternalLink className="ml-auto size-3.5 text-muted-foreground" />
                </button>
              ))}
            </div>
          </DrawerBlock>

          {/* Recent Activity */}
          <DrawerBlock title="Recent Activity">
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between py-1">
                <span>Generated flashcard deck</span><span>2h ago</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Saved AI answer</span><span>Yesterday</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Added to Notebook</span><span>3d ago</span>
              </div>
            </div>
          </DrawerBlock>
        </div>
      </ScrollArea>
    </div>
  );
}

// ─── small shared components ──────────────────────────────────────────────────

function SideSection({ label, icon: Icon, children }: { label: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="border-b border-border px-3 py-3">
      <div className="mb-1.5 flex items-center gap-1.5 px-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="size-3" /> {label}
      </div>
      {children}
    </div>
  );
}

function InspectorBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
      {children}
    </div>
  );
}

function DrawerBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
      {children}
    </div>
  );
}

function LegendDot({ cls, label }: { cls: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn("shrink-0 rounded-full", cls)} />
      {label}
    </span>
  );
}
