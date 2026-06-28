import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { ScrollArea } from "../../components/ui/scroll-area";
import {
  SheetHeader,
  SheetTitle,
} from "../../components/ui/sheet";
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
          <DrawerBlock title="Definition">
            <p className="font-reading text-[16px] leading-relaxed text-foreground/90">{concept.definition}</p>
          </DrawerBlock>

          <DrawerBlock title="AI Summary">
            <div className="rounded-xl border border-violet/25 bg-violet-soft/40 p-4">
              <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-violet">
                <Sparkles className="size-3" /> ScholarAI
              </div>
              <p className="font-reading text-[15px] leading-relaxed text-foreground/90">{concept.aiSummary}</p>
            </div>
          </DrawerBlock>

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

          <DrawerBlock title="Related Concepts">
            <div className="flex flex-wrap gap-2">
              {concept.relatedConcepts.map((c) => (
                <span key={c} className="cursor-pointer rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground/80 hover:border-violet/40 hover:text-violet">
                  {c}
                </span>
              ))}
            </div>
          </DrawerBlock>

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

          <DrawerBlock title="Merge Concept">
            <p className="mb-3 text-xs text-muted-foreground">
              Merge another concept into this one. The other concept is deleted and its connections are transferred here.
            </p>
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={mergeQuery}
                  onChange={(e) => {
                    setMergeQuery(e.target.value);
                    if (selectedMerge) setSelectedMerge(null);
                  }}
                  onFocus={ensureConceptsLoaded}
                  placeholder="Search concept to merge in…"
                  className="h-8 bg-input-background pl-8 text-xs"
                />
              </div>

              {mergeCandidates.length > 0 && !selectedMerge && (
                <div className="flex flex-wrap gap-1.5">
                  {mergeCandidates.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedMerge(c);
                        setMergeQuery(c.name);
                      }}
                      className="rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground/80 transition-colors hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              )}

              {selectedMerge && (
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-destructive/40 bg-destructive/10 px-3 py-1 text-xs text-destructive">
                    {selectedMerge.name}
                  </span>
                  <button
                    onClick={() => { setSelectedMerge(null); setMergeQuery(""); }}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Clear selection"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              )}

              <Button
                size="sm"
                variant="destructive"
                disabled={!selectedMerge || merging}
                onClick={handleMerge}
                className="gap-1.5"
              >
                {merging ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <GitMerge className="size-3.5" />
                )}
                {merging ? "Merging…" : "Merge (keep current)"}
              </Button>
            </div>
          </DrawerBlock>
        </div>
      </ScrollArea>
    </div>
  );
}
