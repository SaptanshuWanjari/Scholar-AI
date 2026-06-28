import { useCallback, useEffect, useMemo, useState } from "react";
import type { Node, Edge } from "@xyflow/react";
import {
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  SlidersHorizontal,
  Tag,
  History,
  Bookmark,
  Sparkles,
  Compass,
  Loader2,
  RefreshCw,
  Network,
  GraduationCap,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { cn } from "../../components/ui/utils";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Sheet, SheetContent } from "../../components/ui/sheet";
import { savedViews, type ConceptData } from "../../lib/graph-data";
import { api, type KGSidebar } from "../../lib/api";
import { useKnowledgeBaseStore } from "../../stores/useKnowledgeBaseStore";

const MASTERY_STATUSES = ["Unknown", "Learning", "Weak", "Needs Revision", "Mastered"] as const;
const MASTERY_DOT: Record<string, string> = {
  Mastered: "bg-green-500",
  Learning: "bg-amber-400",
  Weak: "bg-red-500",
  "Needs Revision": "bg-orange-400",
  Unknown: "bg-border",
};
import type { Course } from "../../lib/types";
import { GraphLoading } from "./GraphLoading";
import { GraphEmpty } from "./GraphEmpty";
import { GraphCanvas } from "./GraphCanvas";
import { EmptyInspector } from "./EmptyInspector";
import { InspectorContent } from "./InspectorContent";
import { ConceptDrawerContent } from "./ConceptDrawerContent";
import { SideSection, LegendDot } from "./shared";
import { layoutGraph } from "./layoutGraph";

export function KnowledgeBase() {
  const {
    selectedId,
    drawerConceptId,
    leftCollapsed,
    searchQuery,
    activeCollection,
    course,
    activeFilters,
    masteryFilters,
    degreeOfSeparation,
    setField,
    toggleFilter,
    toggleMasteryFilter,
  } = useKnowledgeBaseStore();
  const activeFilterSet = useMemo(
    () => new Set(activeFilters),
    [activeFilters],
  );
  const masteryFilterSet = useMemo(
    () => new Set(masteryFilters),
    [masteryFilters],
  );

  const setSelectedId = useCallback(
    (v: string | null) => setField("selectedId", v),
    [setField],
  );
  const setDrawerConceptId = useCallback(
    (v: string | null) => setField("drawerConceptId", v),
    [setField],
  );
  const setLeftCollapsed = useCallback(
    (v: boolean) => setField("leftCollapsed", v),
    [setField],
  );
  const setSearchQuery = useCallback(
    (v: string) => setField("searchQuery", v),
    [setField],
  );
  const setActiveCollection = useCallback(
    (v: string | null) => setField("activeCollection", v),
    [setField],
  );
  const setCourse = useCallback(
    (v: string | null) => setField("course", v),
    [setField],
  );
  const setDegreeOfSeparation = useCallback(
    (v: number | "all") => setField("degreeOfSeparation", v),
    [setField],
  );

  const [graph, setGraph] = useState<{
    nodes: Node<ConceptData>[];
    edges: Edge[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [building, setBuilding] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);

  const [sidebar, setSidebar] = useState<KGSidebar>({
    collections: [],
    recentConcepts: [],
    sourceFilters: [],
  });

  const loadSidebar = useCallback(
    async (c: string | null) => {
      try {
        const s = await api.getKnowledgeSidebar(c);
        setSidebar(s);
        const { initializedFilters } = useKnowledgeBaseStore.getState();
        if (!initializedFilters) {
          setField("activeFilters", s.sourceFilters);
          setField("initializedFilters", true);
        }
      } catch {
        setSidebar({ collections: [], recentConcepts: [], sourceFilters: [] });
      }
    },
    [setField],
  );

  const loadGraph = useCallback(async (c: string | null) => {
    setLoading(true);
    try {
      const g = await api.getKnowledgeGraph(c);
      setGraph(layoutGraph(g));
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to load knowledge graph",
      );
      setGraph({ nodes: [], edges: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGraph(course);
    loadSidebar(course);
  }, [course, loadGraph, loadSidebar]);

  useEffect(() => {
    api
      .listCourses()
      .then(setCourses)
      .catch(() => { });
  }, []);

  const build = useCallback(async () => {
    setBuilding(true);
    toast.info(
      "Building knowledge graph — this runs the LLM over your documents and may take a while…",
    );
    try {
      const [{ concepts, edges }] = await Promise.all([
        api.buildKnowledgeGraph(course),
        api.buildDependencies(course).catch(() => null),
      ]);
      toast.success(
        `Knowledge graph built — ${concepts} concepts, ${edges} relationships.`,
      );
      await Promise.all([loadGraph(course), loadSidebar(course)]);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to build knowledge graph",
      );
    } finally {
      setBuilding(false);
    }
  }, [course, loadGraph, loadSidebar]);

  const distances = useMemo(() => {
    if (!graph || !selectedId || degreeOfSeparation === "all") return null;

    const dists: Record<string, number> = { [selectedId]: 0 };
    const queue = [selectedId];

    const adj: Record<string, string[]> = {};
    for (const e of graph.edges) {
      if (!adj[e.source]) adj[e.source] = [];
      if (!adj[e.target]) adj[e.target] = [];
      adj[e.source].push(e.target);
      adj[e.target].push(e.source);
    }

    while (queue.length > 0) {
      const cur = queue.shift()!;
      const d = dists[cur];

      if (d >= (degreeOfSeparation as number)) continue;

      for (const nxt of adj[cur] || []) {
        if (dists[nxt] === undefined) {
          dists[nxt] = d + 1;
          queue.push(nxt);
        }
      }
    }
    return dists;
  }, [graph, selectedId, degreeOfSeparation]);

  const isEmpty = !!graph && graph.nodes.length === 0;

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left panel */}
      <motion.aside
        data-tour="knowledge-sidebar"
        animate={{ width: leftCollapsed ? 0 : 280 }}
        transition={{ type: "spring", stiffness: 340, damping: 36 }}
        className="relative z-10 hidden shrink-0 flex-col overflow-hidden border-r border-border bg-card/50 lg:flex"
      >
        <div className="flex h-full w-[280px] flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Compass className="size-3.5" /> Knowledge Explorer
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={() => setLeftCollapsed(true)}
            >
              <PanelLeftClose className="size-4" />
            </Button>
          </div>

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
            {courses.length > 0 && (
              <SideSection label="Course" icon={Bookmark}>
                <div className="space-y-0.5">
                  <button
                    onClick={() => setCourse(null)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-sm transition-colors",
                      course === null
                        ? "bg-violet-soft text-violet"
                        : "text-foreground/80 hover:bg-accent/50",
                    )}
                  >
                    <span>All courses</span>
                  </button>
                  {courses.map((c) => (
                    <button
                      key={c.id}
                      onClick={() =>
                        setCourse(c.name === course ? null : c.name)
                      }
                      className={cn(
                        "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-sm transition-colors",
                        course === c.name
                          ? "bg-violet-soft text-violet"
                          : "text-foreground/80 hover:bg-accent/50",
                      )}
                    >
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </SideSection>
            )}

            {sidebar.sourceFilters.length > 0 && (
              <SideSection label="Source Type" icon={SlidersHorizontal}>
                <div className="space-y-1">
                  {sidebar.sourceFilters.map((f) => (
                    <label
                      key={f}
                      className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1 text-sm text-foreground/80 hover:bg-accent/50"
                    >
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

            <SideSection label="Mastery" icon={GraduationCap}>
              <div className="space-y-1">
                {MASTERY_STATUSES.map((s) => (
                  <label
                    key={s}
                    className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1 text-sm text-foreground/80 hover:bg-accent/50"
                  >
                    <input
                      type="checkbox"
                      checked={masteryFilterSet.has(s)}
                      onChange={() => toggleMasteryFilter(s)}
                      className="accent-violet"
                    />
                    <span className={cn("inline-block size-2 rounded-full flex-shrink-0", MASTERY_DOT[s])} />
                    {s}
                  </label>
                ))}
              </div>
            </SideSection>

            {selectedId && (
              <SideSection label="Degree of Separation" icon={Network}>
                <div className="px-2 py-1">
                  <input
                    type="range"
                    min="1"
                    max="4"
                    step="1"
                    value={
                      degreeOfSeparation === "all" ? 4 : degreeOfSeparation
                    }
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setDegreeOfSeparation(val === 4 ? "all" : val);
                    }}
                    className="w-full accent-violet"
                  />
                  <div className="mt-1 text-center text-xs text-muted-foreground">
                    {degreeOfSeparation === "all"
                      ? "All concepts"
                      : `Within ${degreeOfSeparation} degrees`}
                  </div>
                </div>
              </SideSection>
            )}

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
                      onClick={() =>
                        setActiveCollection(
                          c.id === activeCollection ? null : c.id,
                        )
                      }
                      className={cn(
                        "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-sm transition-colors",
                        activeCollection === c.id
                          ? "bg-violet-soft text-violet"
                          : "text-foreground/80 hover:bg-accent/50",
                      )}
                    >
                      <span>{c.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {c.count}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </SideSection>

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
          </ScrollArea>
        </div>
      </motion.aside>

      {/* Center canvas */}
      <div data-tour="knowledge-graph" className="relative min-w-0 flex-1">
        {leftCollapsed && (
          <button
            onClick={() => setLeftCollapsed(false)}
            className="absolute left-3 top-3 z-20 flex size-8 items-center justify-center rounded-full border border-border bg-card shadow-sm hover:bg-accent"
          >
            <PanelLeftOpen className="size-4" />
          </button>
        )}

        {graph && !isEmpty && !loading && (
          <div className="absolute right-3 top-3 z-20">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 bg-card shadow-sm"
              onClick={build}
              disabled={building}
            >
              {building ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <RefreshCw className="size-3.5" />
              )}
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
            activeFilters={activeFilters}
            masteryFilters={masteryFilters}
            activeCollection={activeCollection}
            degreeOfSeparation={degreeOfSeparation}
            distances={distances}
            onNodeClick={(id) => {
              const newId = id === selectedId ? null : id;
              setSelectedId(newId);
              if (newId) setDrawerConceptId(newId);
            }}
            onNodeDoubleClick={(id) => setDrawerConceptId(id)}
            onPaneClick={() => setSelectedId(null)}
          />
        )}

        {!loading && !isEmpty && (
          <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2">
            <div className="flex items-center gap-4 rounded-full border border-border bg-card/80 px-4 py-2 text-[11px] text-muted-foreground backdrop-blur">
              <span className="flex items-center gap-1">
                Click to inspect · Double-click for details
              </span>
              <span className="text-border">|</span>
              {MASTERY_STATUSES.map((s) => (
                <span key={s} className="flex items-center gap-1">
                  <span className={cn("inline-block size-1.5 rounded-full flex-shrink-0", MASTERY_DOT[s])} />
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Concept drawer */}
      <Sheet
        open={!!drawerConceptId}
        onOpenChange={(o) => !o && setDrawerConceptId(null)}
      >
        <SheetContent
          side="right"
          className="w-[540px] max-w-full overflow-hidden p-0 sm:max-w-[540px]"
        >
          {drawerConceptId && (
            <ConceptDrawerContent
              key={drawerConceptId}
              conceptId={drawerConceptId}
              onClose={() => setDrawerConceptId(null)}
              onRefresh={() =>
                Promise.all([loadGraph(course), loadSidebar(course)])
              }
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
