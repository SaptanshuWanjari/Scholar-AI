import { useCallback, useState, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Node, Edge } from "@xyflow/react";
import type { ConceptData } from "../../lib/graph-data";
import { toast } from "@/app/lib/toast";
import { PaperButton, GhostButton } from "@paper-ui/components/buttons";
import { Pill } from "@paper-ui/components/badges";
import { PaperBadge } from "@paper-ui/components/badges";
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
      <div className="flex flex-col items-center gap-3 px-6 pt-20 text-ink-muted">
        <Loader2 className="size-5 animate-spin text-[#6f63a3]" />
        <span className="font-kalam text-sm">Loading concept…</span>
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
    <div className="space-y-0 divide-y divide-[#e8e3d8]">
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-architect text-2xl leading-tight text-ink">{concept.name}</h2>
          <GhostButton size="sm" onClick={onOpenDrawer}>
            <ExternalLink className="size-3.5" /> Full page
          </GhostButton>
        </div>
        <p className="mt-2 font-kalam text-sm leading-relaxed text-ink-muted">{concept.description}</p>

        {/* Stats */}
        <div className="mt-4 flex gap-3">
          <div className="flex-1 rounded border border-[#e8e3d8] bg-[#f9f6f0] px-3 py-2 text-center">
            <div className="font-architect text-2xl leading-none text-ink">{(concept.confidence * 100).toFixed(0)}%</div>
            <div className="mt-1 font-architect text-[10px] uppercase tracking-wider text-ink-muted">Confidence</div>
          </div>
          <div className="flex-1 rounded border border-[#e8e3d8] bg-[#f9f6f0] px-3 py-2 text-center">
            <div className="font-architect text-2xl leading-none text-ink">{concept.refCount}</div>
            <div className="mt-1 font-architect text-[10px] uppercase tracking-wider text-ink-muted">References</div>
          </div>
          <div className="flex-1 rounded border border-[#e8e3d8] bg-[#f9f6f0] px-3 py-2 text-center">
            <div className="font-architect text-2xl leading-none text-ink">{concept.sourceCount}</div>
            <div className="mt-1 font-architect text-[10px] uppercase tracking-wider text-ink-muted">Sources</div>
          </div>
        </div>
      </div>

      <DependencyInspector conceptName={concept.name} />

      {/* Related concepts */}
      <div className="p-4">
        <InspectorBlock title="Related Concepts">
          <div className="flex flex-wrap gap-1.5">
            {concept.relatedConcepts.map((c) => (
              <Pill key={c} tone="lavender">
                {c}
              </Pill>
            ))}
          </div>
        </InspectorBlock>
      </div>

      {/* Connected nodes */}
      {connectedNodes.length > 0 && (
        <div className="p-4">
          <InspectorBlock title="Connected Concepts">
            <div className="flex flex-wrap gap-1.5">
              {connectedNodes.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setField("selectedId", n.id)}
                  className="font-architect"
                >
                  <Pill tone="sky">{n.data.label}</Pill>
                </button>
              ))}
            </div>
          </InspectorBlock>
        </div>
      )}

      {/* Referenced in */}
      <div className="p-4">
        <InspectorBlock title="Referenced In">
          <div className="space-y-1">
            {refInRows.map((r) => (
              <div key={r.label} className="flex items-center justify-between rounded px-2 py-1.5 hover:bg-black/5">
                <span className="flex items-center gap-2 font-architect text-sm text-ink-muted">
                  <r.icon className="size-3.5 text-ink-muted" /> {r.label}
                </span>
                <PaperBadge tone="ink">{r.count}</PaperBadge>
              </div>
            ))}
          </div>
        </InspectorBlock>
      </div>

      {/* Source citations */}
      <div className="p-4">
        <InspectorBlock title="Source Citations">
          <div className="space-y-2">
            {concept.citations.map((c, i) => (
              <div key={i} className="rounded border border-[#e8e3d8] bg-[#f9f6f0] px-3 py-2">
                <div className="flex items-start gap-2">
                  <Quote className="mt-0.5 size-3.5 shrink-0 text-ink-muted" />
                  <div>
                    <div className="font-architect text-sm text-ink">{c.source}</div>
                    <div className="font-kalam text-[11px] text-ink-muted">{c.detail}</div>
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
              <GhostButton
                key={a.label}
                size="sm"
                onClick={() => navigate(a.to)}
                className="justify-start"
              >
                <a.icon className="size-3.5" /> {a.label}
              </GhostButton>
            ))}
          </div>
        </InspectorBlock>
      </div>

      {/* AI actions */}
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
                  className="flex w-full items-center gap-2.5 rounded px-2.5 py-2 font-architect text-sm text-ink-muted transition-colors hover:bg-black/5 hover:text-ink disabled:opacity-50"
                >
                  {isRunning ? (
                    <Loader2 className="size-4 animate-spin text-[#6f63a3]" />
                  ) : (
                    <a.icon className="size-4 text-[#6f63a3]" />
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
                className="mt-3 overflow-hidden rounded border border-[#e8e3d8] bg-[#f9f6f0]"
              >
                <div className="flex items-center justify-between border-b border-[#e8e3d8] px-3 py-2">
                  <span className="font-architect text-xs text-ink">{result!.title}</span>
                  <button onClick={clearResult} className="text-ink-muted hover:text-ink">
                    <X className="size-3.5" />
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto p-3">
                  {result!.mono ? (
                    <pre className="whitespace-pre-wrap font-kalam text-xs leading-relaxed text-ink/80">{result!.body}</pre>
                  ) : (
                    <MarkdownRenderer content={result!.body} />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </InspectorBlock>
      </div>

      {/* Discover */}
      <div className="p-4">
        <PaperButton
          tone={discovering ? "paper" : "dark"}
          onClick={onDiscover}
          disabled={discovering}
          className="w-full"
        >
          {discovering ? <Loader2 className="size-4 animate-spin" /> : <Compass className="size-4" />}
          {discovering ? "Discovering…" : "Discover Related Concepts"}
        </PaperButton>
        <AnimatePresence>
          {discoveries && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 overflow-hidden"
            >
              <div className="flex items-center gap-1.5">
                <Sparkles className="size-3 text-[#6f63a3]" />
                <span className="font-architect text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                  AI Suggestions
                </span>
              </div>
              {discoveries.length === 0 ? (
                <p className="mt-2 font-kalam text-xs text-ink-muted">No related concepts found.</p>
              ) : (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {discoveries.map((d) => (
                    <Pill key={d} tone="lavender">
                      + {d}
                    </Pill>
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
