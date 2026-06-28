import { useCallback, useEffect, useMemo, useState } from "react";
import type { Node, Edge } from "@xyflow/react";
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
  Compass,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { cn } from "../../components/ui/utils";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { ScrollArea } from "../../components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
} from "../../components/ui/sheet";
import {
  savedViews,
  type ConceptData,
} from "../../lib/graph-data";
import { api, type KGSidebar } from "../../lib/api";
import { useKnowledgeBaseStore } from "../../stores/useKnowledgeBaseStore";
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
    rightCollapsed,
    searchQuery,
    activeCollection,
    course,
    activeFilters,
    setField,
    toggleFilter,
  } = useKnowledgeBaseStore();
  const activeFilterSet = useMemo(() => new Set(activeFilters), [activeFilters]);

  const setSelectedId = useCallback((v: string | null) => setField("selectedId", v), [setField]);
  const setDrawerConceptId = useCallback((v: string | null) => setField("drawerConceptId", v), [setField]);
  const setLeftCollapsed = useCallback((v: boolean) => setField("leftCollapsed", v), [setField]);
  const setRightCollapsed = useCallback((v: boolean) => setField("rightCollapsed", v), [setField]);
  const setSearchQuery = useCallback((v: string) => setField("searchQuery", v), [setField]);
  const setActiveCollection = useCallback((v: string | null) => setField("activeCollection", v), [setField]);
  const setCourse = useCallback((v: string | null) => setField("course", v), [setField]);

  const [graph, setGraph] = useState<{ nodes: Node<ConceptData>[]; edges: Edge[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [building, setBuilding] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);

  const [sidebar, setSidebar] = useState<KGSidebar>({
    collections: [],
    recentConcepts: [],
    sourceFilters: [],
  });

  const loadSidebar = useCallback(async (c: string | null) => {
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

  useEffect(() => {
    api.listCourses().then(setCourses).catch(() => {});
  }, []);

  const build = useCallback(async () => {
    setBuilding(true);
    toast.info("Building knowledge graph — this runs the LLM over your documents and may take a while…");
    try {
      const [{ concepts, edges }] = await Promise.all([
        api.buildKnowledgeGraph(course),
        api.buildDependencies(course).catch(() => null),
      ]);
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
            <Button variant="ghost" size="icon" className="size-7" onClick={() => setLeftCollapsed(true)}>
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
        {rightCollapsed && (
          <button
            onClick={() => setRightCollapsed(false)}
            className="absolute right-3 top-3 z-20 flex size-8 items-center justify-center rounded-full border border-border bg-card shadow-sm hover:bg-accent"
          >
            <PanelRightOpen className="size-4" />
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
            activeFilters={activeFilters}
            activeCollection={activeCollection}
            onNodeClick={(id) => setSelectedId(id === selectedId ? null : id)}
            onNodeDoubleClick={(id) => setDrawerConceptId(id)}
            onPaneClick={() => setSelectedId(null)}
          />
        )}

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

      {/* Right inspector */}
      <motion.aside
        data-tour="knowledge-inspector"
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

      {/* Concept drawer */}
      <Sheet open={!!drawerConceptId} onOpenChange={(o) => !o && setDrawerConceptId(null)}>
        <SheetContent side="right" className="w-[540px] max-w-full overflow-y-auto p-0 sm:max-w-[540px]">
          {drawerConceptId && (
            <ConceptDrawerContent
              key={drawerConceptId}
              conceptId={drawerConceptId}
              onClose={() => setDrawerConceptId(null)}
              onRefresh={() => Promise.all([loadGraph(course), loadSidebar(course)])}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
