import { useState } from "react";
import { toast } from "@/app/lib/toast";
import { PaperButton, GhostButton } from "@paper-ui/components/buttons";
import { PaperBadge, Pill } from "@paper-ui/components/badges";
import { PaperInput } from "@paper-ui/components/inputs";
import { ScrollArea } from "@paper-ui/components/layout";
import { SectionLabel } from "@paper-ui/core";
import { api } from "../../lib/api";
import { useNavigate } from "react-router";
import { useConcept } from "./useConcept";
import { DrawerBlock } from "./shared";
import {
  X,
  Gauge,
  Sparkles,
  Quote,
  ExternalLink,
  Layers,
  ListChecks,
  Workflow,
  Network,
  Notebook,
  BookOpen,
  Search,
  Loader2,
  GitMerge,
  FileText,
} from "lucide-react";

export function ConceptDrawerContent({
  conceptId,
  onClose,
  onRefresh,
}: {
  conceptId: string;
  onClose: () => void;
  onRefresh?: () => void;
}) {
  const { concept, loading } = useConcept(conceptId);
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  const [mergeQuery, setMergeQuery] = useState("");
  const [allConcepts, setAllConcepts] = useState<{ id: string; name: string }[]>([]);
  const [conceptsLoaded, setConceptsLoaded] = useState(false);
  const [selectedMerge, setSelectedMerge] = useState<{ id: string; name: string } | null>(null);
  const [merging, setMerging] = useState(false);

  const ensureConceptsLoaded = async () => {
    if (conceptsLoaded) return;
    try {
      const g = await api.getKnowledgeGraph(null);
      setAllConcepts(g.nodes.map((n) => ({ id: n.id, name: n.label })));
      setConceptsLoaded(true);
    } catch {
      // non-critical
    }
  };

  const mergeCandidates = mergeQuery.trim().length < 1
    ? []
    : allConcepts.filter(
        (c) =>
          c.id !== conceptId &&
          c.name.toLowerCase().includes(mergeQuery.toLowerCase()),
      ).slice(0, 8);

  const handleMerge = async () => {
    if (!selectedMerge || merging) return;
    setMerging(true);
    try {
      await api.mergeConcepts(Number(conceptId), Number(selectedMerge.id));
      toast.success(`Merged "${selectedMerge.name}" into "${concept?.name ?? conceptId}"`);
      onRefresh?.();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to merge concepts");
    } finally {
      setMerging(false);
    }
  };

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
      <div className="flex h-full flex-col items-center justify-center gap-3 text-ink-muted">
        <Loader2 className="size-6 animate-spin text-[#6f63a3]" />
        <span className="font-kalam text-sm">Loading concept…</span>
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
      {/* Header */}
      <div className="shrink-0 border-b border-[#e8e3d8] px-6 py-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <PaperBadge tone="ink">Concept</PaperBadge>
              <PaperBadge tone="sage">
                <Gauge className="size-2.5" /> {(concept.confidence * 100).toFixed(0)}%
              </PaperBadge>
            </div>
            <h2 className="mt-1 font-architect text-2xl text-ink">{concept.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-7 w-7 items-center justify-center text-ink-muted transition-colors hover:text-ink"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-8 px-6 py-6">

          {/* Definition */}
          <DrawerBlock title="Definition">
            <p className="font-kalam text-[16px] leading-relaxed text-ink/90">{concept.definition}</p>
          </DrawerBlock>

          {/* AI Summary */}
          <DrawerBlock title="AI Summary">
            <div className="rounded border border-[#d4c9f0] bg-[#f0eefa] p-4">
              <div className="mb-2 flex items-center gap-1.5">
                <Sparkles className="size-3 text-[#6f63a3]" />
                <SectionLabel className="text-[10px] text-[#6f63a3]">ScholarAI</SectionLabel>
              </div>
              <p className="font-kalam text-[15px] leading-relaxed text-ink/90">{concept.aiSummary}</p>
            </div>
          </DrawerBlock>

          {/* Source references */}
          {concept.citations && concept.citations.length > 0 && (
            <DrawerBlock title="Source References">
              <div className="space-y-2">
                {concept.citations.map((c, i) => (
                  <div key={i} className="flex items-start gap-3 rounded border border-[#e8e3d8] bg-[#f9f6f0] px-4 py-3">
                    <Quote className="mt-0.5 size-4 shrink-0 text-ink-muted" />
                    <div>
                      <div className="font-architect text-sm text-ink">{c.source}</div>
                      <div className="mt-0.5 font-kalam text-xs text-ink-muted">{c.detail}</div>
                    </div>
                    <ExternalLink className="ml-auto size-3.5 shrink-0 text-ink-muted" />
                  </div>
                ))}
              </div>
            </DrawerBlock>
          )}

          {/* Related concepts */}
          <DrawerBlock title="Related Concepts">
            <div className="flex flex-wrap gap-2">
              {concept.relatedConcepts.map((c) => (
                <Pill key={c} tone="lavender">
                  {c}
                </Pill>
              ))}
            </div>
          </DrawerBlock>

          {/* Referenced in */}
          <DrawerBlock title="Referenced In">
            <div className="grid grid-cols-2 gap-2">
              {refInRows.map((r) => (
                <div key={r.label} className="flex items-center gap-3 rounded border border-[#e8e3d8] bg-[#f9f6f0] px-3 py-2.5">
                  <r.icon className="size-4 shrink-0 text-ink-muted" />
                  <div className="min-w-0">
                    <div className="font-architect text-lg leading-none text-ink">{r.count}</div>
                    <div className="font-kalam text-[10px] text-ink-muted">{r.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </DrawerBlock>

          {/* Generated assets */}
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
                  className="flex w-full items-center gap-3 rounded px-3 py-2.5 font-architect text-sm text-ink-muted transition-colors hover:bg-black/5 hover:text-ink disabled:opacity-50"
                >
                  {a.label === "Add To Notebook" && adding ? (
                    <Loader2 className="size-4 animate-spin text-[#6f63a3]" />
                  ) : (
                    <a.icon className="size-4 text-[#6f63a3]" />
                  )}
                  {a.label}
                  <ExternalLink className="ml-auto size-3.5 text-ink-muted" />
                </button>
              ))}
            </div>
          </DrawerBlock>

          {/* Recent activity */}
          <DrawerBlock title="Recent Activity">
            <div className="space-y-2 font-kalam text-sm text-ink-muted">
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

          {/* Merge concept */}
          <DrawerBlock title="Merge Concept">
            <p className="mb-3 font-kalam text-xs text-ink-muted">
              Merge another concept into this one. The other concept is deleted and its connections are transferred here.
            </p>
            <div className="space-y-3">
              <PaperInput
                value={mergeQuery}
                onChange={(e) => {
                  setMergeQuery(e.target.value);
                  if (selectedMerge) setSelectedMerge(null);
                }}
                onFocus={ensureConceptsLoaded}
                placeholder="Search concept to merge in…"
                icon={<Search className="size-3.5" />}
              />

              {mergeCandidates.length > 0 && !selectedMerge && (
                <div className="flex flex-wrap gap-1.5">
                  {mergeCandidates.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedMerge(c);
                        setMergeQuery(c.name);
                      }}
                    >
                      <Pill tone="brick">{c.name}</Pill>
                    </button>
                  ))}
                </div>
              )}

              {selectedMerge && (
                <div className="flex items-center gap-2">
                  <Pill tone="brick">{selectedMerge.name}</Pill>
                  <button
                    onClick={() => { setSelectedMerge(null); setMergeQuery(""); }}
                    className="text-ink-muted hover:text-ink"
                    aria-label="Clear selection"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              )}

              <PaperButton
                tone="dark"
                disabled={!selectedMerge || merging}
                onClick={handleMerge}
              >
                {merging ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <GitMerge className="size-3.5" />
                )}
                {merging ? "Merging…" : "Merge (keep current)"}
              </PaperButton>
            </div>
          </DrawerBlock>

        </div>
      </ScrollArea>
    </div>
  );
}
