import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import type { Node, Edge } from "@xyflow/react";
import {
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  SlidersHorizontal,
  History,
  Bookmark,
  Compass,
  Loader2,
  RefreshCw,
  Network,
  GraduationCap,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "@/app/lib/toast";
import { cn } from "../../components/ui/utils";
import { type ConceptData } from "../../lib/graph-data";
import { api, type KGSidebar } from "../../lib/api";
import { useKnowledgeBaseStore } from "../../stores/useKnowledgeBaseStore";
import {
  PaperButton,
  IconButton,
} from "@paper-ui/components/buttons";
import { PaperInput } from "@paper-ui/components/inputs";
import { PaperCheckbox } from "@paper-ui/components/inputs";
import { PaperSlider } from "@paper-ui/components/inputs";
import { ScrollArea } from "@paper-ui/components/layout";
import { Pill } from "@paper-ui/components/badges";
import { PaperDrawer } from "@paper-ui/components/dialogs";
import { SectionLabel } from "@paper-ui/core";
import type { Course } from "../../lib/types";
import { GraphLoading } from "./GraphLoading";
import { GraphEmpty } from "./GraphEmpty";
import { GraphCanvas } from "./GraphCanvas";
import { ConceptDrawerContent } from "./ConceptDrawerContent";
import { SideSection } from "./shared";
import { layoutGraph } from "./layoutGraph";

const MASTERY_STATUSES = [
  "Unknown",
  "Learning",
  "Weak",
  "Needs Revision",
  "Mastered",
] as const;

const MASTERY_DOT: Record<string, string> = {
  Mastered: "#22c55e",
  Learning: "#f59e0b",
  Weak: "#ef4444",
  "Needs Revision": "#f97316",
  Unknown: "#9c9484",
};

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

  const [searchParams, setSearchParams] = useSearchParams();

  // Open concept drawer when navigated here with ?conceptId=<id>
  useEffect(() => {
    const id = searchParams.get("conceptId");
    if (id) {
      setField("drawerConceptId", id);
      setField("selectedId", id);
      setSearchParams({}, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        className="relative z-10 hidden shrink-0 flex-col overflow-hidden border-r border-[#e8e3d8] bg-[#f9f6f0] lg:flex"
      >
        <div className="flex h-full w-[280px] flex-col overflow-hidden">
          {/* Sidebar header */}
          <div className="flex items-center justify-between border-b border-[#e8e3d8] px-4 py-3">
            <div className="flex items-center gap-2">
              <Compass className="size-3.5 text-ink-muted" />
              <SectionLabel className="text-[10px]">Knowledge Explorer</SectionLabel>
            </div>
            <IconButton
              label="Collapse sidebar"
              className="size-7"
              onClick={() => setLeftCollapsed(true)}
            >
              <PanelLeftClose className="size-4" />
            </IconButton>
          </div>

          {/* Search */}
          <div className="border-b border-[#e8e3d8] p-3">
            <PaperInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts…"
              icon={<Search className="size-3.5" />}
            />
          </div>

          <ScrollArea className="min-h-0 flex-1">
            {/* Course filter */}
            {courses.length > 0 && (
              <SideSection label="Course" icon={Bookmark}>
                <div className="space-y-0.5">
                  <button
                    onClick={() => setCourse(null)}
                    className={cn(
                      "flex w-full items-center justify-between rounded px-2.5 py-1.5 font-architect text-sm transition-colors",
                      course === null
                        ? "bg-[#e7efe4] text-[#2f5d3a]"
                        : "text-ink-muted hover:bg-black/5",
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
                        "flex w-full items-center justify-between rounded px-2.5 py-1.5 font-architect text-sm transition-colors",
                        course === c.name
                          ? "bg-[#e7efe4] text-[#2f5d3a]"
                          : "text-ink-muted hover:bg-black/5",
                      )}
                    >
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </SideSection>
            )}

            {/* Source type filter */}
            {sidebar.sourceFilters.length > 0 && (
              <SideSection label="Source Type" icon={SlidersHorizontal}>
                <div className="space-y-1">
                  {sidebar.sourceFilters.map((f) => (
                    <PaperCheckbox
                      key={f}
                      label={f}
                      checked={activeFilterSet.has(f)}
                      onChange={() => toggleFilter(f)}
                      className="px-2.5 py-1"
                    />
                  ))}
                </div>
              </SideSection>
            )}

            {/* Mastery filter */}
            <SideSection label="Mastery" icon={GraduationCap}>
              <div className="space-y-1">
                {MASTERY_STATUSES.map((s) => (
                  <label
                    key={s}
                    className="flex cursor-pointer items-center gap-2.5 rounded px-2.5 py-1 hover:bg-black/5"
                  >
                    <PaperCheckbox
                      checked={masteryFilterSet.has(s)}
                      onChange={() => toggleMasteryFilter(s)}
                    />
                    <span
                      className="inline-block size-2 flex-shrink-0 rounded-full"
                      style={{ backgroundColor: MASTERY_DOT[s] }}
                    />
                    <span className="font-architect text-sm text-ink">{s}</span>
                  </label>
                ))}
              </div>
            </SideSection>

            {/* Degree of separation */}
            {selectedId && (
              <SideSection label="Degree of Separation" icon={Network}>
                <div className="px-2 py-1">
                  <PaperSlider
                    min={1}
                    max={4}
                    step={1}
                    value={degreeOfSeparation === "all" ? 4 : degreeOfSeparation}
                    onChange={(val) => {
                      setDegreeOfSeparation(val === 4 ? "all" : val);
                    }}
                    showValue
                    formatValue={(v) =>
                      v === 4 ? "All concepts" : `${v} degrees`
                    }
                  />
                </div>
              </SideSection>
            )}

            {/* Collections */}
            <SideSection label="Collections" icon={Bookmark}>
              {sidebar.collections.length === 0 ? (
                <p className="px-1 font-kalam text-xs text-ink-muted">
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
                        "flex w-full items-center justify-between rounded px-2.5 py-1.5 font-architect text-sm transition-colors",
                        activeCollection === c.id
                          ? "bg-[#e7efe4] text-[#2f5d3a]"
                          : "text-ink-muted hover:bg-black/5",
                      )}
                    >
                      <span>{c.label}</span>
                      <span className="font-kalam text-xs text-ink-muted">
                        {c.count}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </SideSection>

            {/* Recent concepts */}
            <SideSection label="Recent Concepts" icon={History}>
              {sidebar.recentConcepts.length === 0 ? (
                <p className="px-1 font-kalam text-xs text-ink-muted">
                  No concepts extracted yet.
                </p>
              ) : (
                <div className="flex flex-wrap gap-1.5 px-1">
                  {sidebar.recentConcepts.map((c) => (
                    <Pill key={c} tone="ink">
                      {c}
                    </Pill>
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
            className="absolute left-3 top-3 z-20 flex size-8 items-center justify-center rounded-full border border-[#e8e3d8] bg-[#f9f6f0] shadow-sm hover:bg-black/5"
          >
            <PanelLeftOpen className="size-4 text-ink-muted" />
          </button>
        )}

        {graph && !isEmpty && !loading && (
          <div className="absolute right-3 top-3 z-20">
            <PaperButton
              size="sm"
              onClick={build}
              disabled={building}
            >
              {building ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <RefreshCw className="size-3.5" />
              )}
              {building ? "Rebuilding…" : "Rebuild"}
            </PaperButton>
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
      </div>

      {/* Concept drawer — using PaperDrawer */}
      <PaperDrawer
        open={!!drawerConceptId}
        onClose={() => setDrawerConceptId(null)}
        side="right"
        width={540}
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
      </PaperDrawer>
    </div>
  );
}
