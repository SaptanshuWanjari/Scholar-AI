import { useCallback, useMemo, useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  useNodesState,
  useEdgesState,
  type NodeMouseHandler,
  useReactFlow,
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
  ChevronsLeft,
  X,
  ExternalLink,
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
  conceptNodes,
  conceptEdges,
  explorerCollections,
  recentConcepts,
  savedViews,
  sourceFilters,
  relatedDiscoveries,
  getInspector,
} from "../lib/graph-data";

// stable node type map — must be outside component
const nodeTypes = { concept: ConceptNode };

// ─── main page ───────────────────────────────────────────────────────────────

export function KnowledgeBase() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drawerConceptId, setDrawerConceptId] = useState<string | null>(null);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set(sourceFilters));
  const [discoveries, setDiscoveries] = useState<string[] | null>(null);

  const toggleFilter = (f: string) => {
    setActiveFilters((prev) => {
      const n = new Set(prev);
      n.has(f) ? n.delete(f) : n.add(f);
      return n;
    });
  };

  const discover = () => {
    const key = selectedId ?? "rag";
    const list = relatedDiscoveries[key] ?? relatedDiscoveries.rag;
    setDiscoveries(list);
  };

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
            {/* source filters */}
            <SideSection label="Source Type" icon={SlidersHorizontal}>
              <div className="space-y-1">
                {sourceFilters.map((f) => (
                  <label key={f} className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1 text-sm text-foreground/80 hover:bg-accent/50">
                    <input
                      type="checkbox"
                      checked={activeFilters.has(f)}
                      onChange={() => toggleFilter(f)}
                      className="accent-violet"
                    />
                    {f}
                  </label>
                ))}
              </div>
            </SideSection>

            {/* collections */}
            <SideSection label="Collections" icon={Bookmark}>
              <div className="space-y-0.5">
                {explorerCollections.map((c) => (
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
            </SideSection>

            {/* recent */}
            <SideSection label="Recent Concepts" icon={History}>
              <div className="flex flex-wrap gap-1.5 px-1">
                {recentConcepts.map((c) => (
                  <button
                    key={c}
                    className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] text-foreground/70 transition-colors hover:border-violet/40 hover:text-violet"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </SideSection>

            {/* saved views */}
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

        <GraphCanvas
          selectedId={selectedId}
          searchQuery={searchQuery}
          onNodeClick={(id) => setSelectedId(id === selectedId ? null : id)}
          onNodeDoubleClick={(id) => setDrawerConceptId(id)}
          onPaneClick={() => { setSelectedId(null); setDiscoveries(null); }}
        />

        {/* Bottom canvas legend */}
        <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2">
          <div className="flex items-center gap-4 rounded-full border border-border bg-card/80 px-4 py-2 text-[11px] text-muted-foreground backdrop-blur">
            <LegendDot cls="size-4 border-2 border-foreground bg-card" label="Large (hub)" />
            <LegendDot cls="size-3 border border-foreground/60 bg-card" label="Medium" />
            <LegendDot cls="size-2.5 border border-foreground/40 bg-card" label="Small (rare)" />
            <span className="h-3 w-px bg-border" />
            <span className="flex items-center gap-1">Click to inspect · Double-click for details</span>
          </div>
        </div>
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
                conceptId={selectedId}
                discoveries={discoveries}
                onDiscover={discover}
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
            <ConceptDrawerContent conceptId={drawerConceptId} onClose={() => setDrawerConceptId(null)} />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

// ─── graph canvas ─────────────────────────────────────────────────────────────

function GraphCanvas({
  selectedId,
  searchQuery,
  onNodeClick,
  onNodeDoubleClick,
  onPaneClick,
}: {
  selectedId: string | null;
  searchQuery: string;
  onNodeClick: (id: string) => void;
  onNodeDoubleClick: (id: string) => void;
  onPaneClick: () => void;
}) {
  const q = searchQuery.toLowerCase().trim();

  const baseNodes = useMemo(
    () =>
      conceptNodes.map((n) => ({
        ...n,
        selected: n.id === selectedId,
        style:
          q && !n.data.label.toLowerCase().includes(q)
            ? { opacity: 0.25, transition: "opacity 0.2s" }
            : { opacity: 1, transition: "opacity 0.2s" },
      })),
    [selectedId, q],
  );

  const [nodes, , onNodesChange] = useNodesState(baseNodes);
  const [edges, , onEdgesChange] = useEdgesState(conceptEdges);

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
  discoveries,
  onDiscover,
  onOpenDrawer,
}: {
  conceptId: string;
  discoveries: string[] | null;
  onDiscover: () => void;
  onOpenDrawer: () => void;
}) {
  const concept = getInspector(conceptId);

  const refInRows = [
    { label: "Documents", icon: FileText, count: concept.referencedIn.documents },
    { label: "Notebook Notes", icon: Notebook, count: concept.referencedIn.notes },
    { label: "Flashcards", icon: Layers, count: concept.referencedIn.flashcards },
    { label: "Quizzes", icon: ListChecks, count: concept.referencedIn.quizzes },
    { label: "Saved Answers", icon: Sparkles, count: concept.referencedIn.answers },
    { label: "Diagrams", icon: Workflow, count: concept.referencedIn.diagrams },
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
              { label: "Open Flashcards", icon: Layers },
              { label: "Open Quiz", icon: ListChecks },
              { label: "Open Diagram", icon: Workflow },
              { label: "Open Mind Map", icon: Network },
              { label: "Open Notebook", icon: Notebook },
            ].map((a) => (
              <button
                key={a.label}
                onClick={() => toast.success(`Opening ${a.label}…`)}
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
            {aiActions.map((a) => (
              <button
                key={a.label}
                onClick={() => toast.success(`${a.label}…`)}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
              >
                <a.icon className="size-4 text-violet" /> {a.label}
              </button>
            ))}
          </div>
        </InspectorBlock>
      </div>

      {/* Semantic discovery */}
      <div className="p-4">
        <Button
          onClick={onDiscover}
          variant="outline"
          className="w-full gap-2 border-violet/30 text-violet hover:bg-violet-soft"
        >
          <Compass className="size-4" /> Discover Related Concepts
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
  const concept = getInspector(conceptId);

  const refInRows = [
    { label: "Documents", icon: FileText, count: concept.referencedIn.documents },
    { label: "Notes", icon: Notebook, count: concept.referencedIn.notes },
    { label: "Flashcards", icon: Layers, count: concept.referencedIn.flashcards },
    { label: "Quizzes", icon: ListChecks, count: concept.referencedIn.quizzes },
    { label: "Answers", icon: Sparkles, count: concept.referencedIn.answers },
    { label: "Diagrams", icon: Workflow, count: concept.referencedIn.diagrams },
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
                { label: "Open Flashcard Deck", icon: Layers },
                { label: "Open Quiz", icon: ListChecks },
                { label: "Open Diagram", icon: Workflow },
                { label: "Open Mind Map", icon: Network },
                { label: "Add To Notebook", icon: Notebook },
                { label: "View in Reading Mode", icon: BookOpen },
              ].map((a) => (
                <button
                  key={a.label}
                  onClick={() => toast.success(`Opening ${a.label}…`)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
                >
                  <a.icon className="size-4 text-violet" /> {a.label}
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
