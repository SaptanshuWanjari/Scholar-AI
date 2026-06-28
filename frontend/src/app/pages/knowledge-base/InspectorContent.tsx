import { useCallback, useState, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Node, Edge } from "@xyflow/react";
import type { ConceptData } from "../../lib/graph-data";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { DependencyInspector } from "../../components/DependencyInspector";
import { MarkdownRenderer } from "../../components/MarkdownRenderer";
import { useConceptActionStore } from "../../stores/useConceptActionStore";
import { api } from "../../lib/api";
import { useNavigate } from "react-router";
import { useKnowledgeBaseStore } from "../../stores/useKnowledgeBaseStore";
import { useConcept } from "./useConcept";
import { InspectorBlock } from "./shared";
import {
  Sparkles,
  FileText,
  Layers,
  ListChecks,
  Workflow,
  Network,
  Notebook,
  Quote,
  ExternalLink,
  Compass,
  Loader2,
  X,
} from "lucide-react";

export function InspectorContent({
  conceptId,
  graph,
  onOpenDrawer,
}: {
  conceptId: string;
  graph?: { nodes: Node<ConceptData>[]; edges: Edge[] } | null;
  onOpenDrawer: () => void;
}) {
  const { setField } = useKnowledgeBaseStore();
  const { concept, loading } = useConcept(conceptId);
  const navigate = useNavigate();
  const [discoveries, setDiscoveries] = useState<string[] | null>(null);
  const [discovering, setDiscovering] = useState(false);
  const { running, runningConceptId, result, resultConceptId, clearResult, runAction } =
    useConceptActionStore();
  const showResult = result && resultConceptId === conceptId;

  const connectedNodes = useMemo(() => {
    if (!graph) return [];
    const connectedIds = new Set<string>();
    for (const e of graph.edges) {
      if (e.source === conceptId) connectedIds.add(e.target);
      if (e.target === conceptId) connectedIds.add(e.source);
    }
    return graph.nodes.filter(n => connectedIds.has(n.id));
  }, [graph, conceptId]);

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

      <DependencyInspector conceptName={concept.name} />

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

      {connectedNodes.length > 0 && (
        <div className="p-4">
          <InspectorBlock title="Connected Concepts">
            <div className="flex flex-wrap gap-1.5">
              {connectedNodes.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setField("selectedId", n.id)}
                  className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] text-foreground/80 transition-colors hover:border-violet/40 hover:text-violet"
                >
                  {n.data.label}
                </button>
              ))}
            </div>
          </InspectorBlock>
        </div>
      )}

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
