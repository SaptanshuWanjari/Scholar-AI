import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  GraduationCap,
  BookOpen,
  NotebookPen,
  Layers,
  ListChecks,
  Network,
  Workflow,
  Columns2,
  FileText,
  Sparkles,
  Loader2,
  AlertTriangle,
  Save,
  Plus,
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  FolderOpen,
  ChevronLeft,
  PauseCircle,
  PenLine,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "@/app/lib/toast";
import { MarkdownRenderer } from "../components/MarkdownRenderer";
import { FlashcardCard } from "../components/FlashcardCard";
import { DiagramViewer } from "../components/DiagramViewer";
import { SourcePanel } from "../components/SourcePanel";
import { MindMapTree, countNodes, parseMindmapText } from "../components/MindMapTree";
import { ConsistencyReport } from "../components/ConsistencyReport";
import QualityBadge from "../components/QualityBadge";
import { cn } from "../components/ui/utils";
import {
  PaperButton,
  GhostButton,
  ChipButton,
  IconButton,
} from "@paper-ui/components/buttons";
import { PaperInput, PaperSelect, PaperCheckbox, PaperSwitch } from "@paper-ui/components/inputs";
import { PaperBadge } from "@paper-ui/components/badges";
import { ScrollArea, SplitLayout } from "@paper-ui/components/layout";
import {
  PaperCard,
  PaperPanel,
  PaperH1,
  PaperH3,
  PaperH5,
  PaperIconCircle,
} from "@paper-ui/core";
import { PrerequisiteCard, ConceptNode } from "@paper-ui/components/teaching";
import { StarDoodle, StarDoodleFilled } from "@paper-ui/components/doodles";
import { EmptyState } from "@paper-ui/components/feedback";
import { PaperModal } from "@paper-ui/components/dialogs";
import { api, type PackageMeta, type FlashcardSet, type GeneratedQuiz, type GeneratedDiagram, type GeneratedMindmap, type GeneratedRevision, type ReadinessMissing } from "../lib/api";
import type { GeneratedDifference, Flashcard, QuizQuestion } from "../lib/types";
import {
  useTeachStore,
  ARTIFACT_KEYS,
  type ArtifactKey,
  type Depth,
  type ViewKey,
  type SlotStatus,
} from "../stores/useTeachStore";

function StarRating({ stars }: { stars: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => {
        if (i < stars) {
          return <StarDoodleFilled key={i} size={11} color="#c9954f" />;
        }
        return <StarDoodle key={i} size={11} color="#e5ded2" strokeWidth={2} />;
      })}
    </span>
  );
}

const EXAMPLES = ["CAP Theorem", "RAG", "Deadlocks", "Service Discovery", "OS Scheduling", "LangGraph"];

const DEPTHS: { id: Depth; label: string }[] = [
  { id: "quick", label: "Quick Overview" },
  { id: "standard", label: "Standard" },
  { id: "deep", label: "Deep Dive" },
];

const ARTIFACT_LABELS: Record<ArtifactKey, string> = {
  notes: "Notes",
  flashcards: "Flashcards",
  quiz: "Quiz",
  mindmap: "Mind Map",
  diagram: "Diagram",
  difference: "Difference Tables",
};

const NAV: { id: ViewKey; label: string; icon: typeof BookOpen }[] = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "notes", label: "Notes", icon: NotebookPen },
  { id: "flashcards", label: "Flashcards", icon: Layers },
  { id: "quiz", label: "Quiz", icon: ListChecks },
  { id: "mindmap", label: "Mind Map", icon: Network },
  { id: "diagram", label: "Diagram", icon: Workflow },
  { id: "difference", label: "Difference Tables", icon: Columns2 },
  { id: "sources", label: "Sources", icon: FileText },
  { id: "consistency", label: "Consistency", icon: ShieldCheck },
];

// ---------------------------------------------------------------------------
// Input phase
// ---------------------------------------------------------------------------

function InputPhase() {
  const {
    topic, depth, course, document, courses, documents, selected,
    recommendations, recommendationsLoading,
    setField, setCourse, setDocument, toggleArtifact,
    fetchRecommendations, applyRecommendations, selectAll, clearSelection,
    startGenerate, loadPackage, fetchCoursesAndDocs,
  } = useTeachStore();
  const [packages, setPackages] = useState<PackageMeta[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>(EXAMPLES);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  // Dependency readiness gate — surfaced before generating if prerequisites
  // for the chosen topic aren't mastered yet.
  const [gate, setGate] = useState<ReadinessMissing[] | null>(null);
  const [checking, setChecking] = useState(false);
  const [showHint, setShowHint] = useState(() => !localStorage.getItem("teach_hitl_hint_dismissed"));

  // Check prerequisite mastery before generating. If unmet, open the gate
  // modal; otherwise generate immediately. Failures fall through to generate.
  const handleGenerate = async () => {
    if (!topic.trim()) return startGenerate();
    setChecking(true);
    try {
      const r = await api.checkReadiness(topic.trim(), course === "none" ? null : course);
      if (!r.ready && r.missing.length) {
        setGate(r.missing);
        return;
      }
    } catch {
      /* readiness is best-effort — never block generation on it */
    } finally {
      setChecking(false);
    }
    startGenerate();
  };

  const generateAnyway = () => {
    setGate(null);
    startGenerate();
  };

  const studyPrerequisiteFirst = () => {
    const first = gate?.[0];
    setGate(null);
    if (first) {
      setField("topic", first.name);
      startGenerate();
    }
  };

  useEffect(() => {
    let cancelled = false;
    fetchCoursesAndDocs();
    api.listPackages().then((p) => { if (!cancelled) setPackages(p); }).catch(() => { });
    api.onboardingAnalysis().then((a) => {
      if (!cancelled) {
        const generated = [...(a.topics || []), ...(a.concepts || [])];
        if (generated.length > 0) {
          const unique = Array.from(new Set(generated)).slice(0, 6);
          setSuggestions(unique);
        }
      }
    }).catch(() => { });

    // Auto-load a package passed via ?package=<id> (e.g. from Courses page)
    const autoId = searchParams.get("package");
    if (autoId && !cancelled) {
      void loadPackage(autoId).then(() => {
        if (!cancelled) setSearchParams({}, { replace: true });
      });
    }

    return () => {
      cancelled = true;
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTopicChange = (value: string) => {
    setField("topic", value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length >= 3) {
      debounceRef.current = setTimeout(() => {
        void fetchRecommendations(value.trim());
      }, 800);
    }
  };

  const removePackage = async (id: string) => {
    try {
      await api.deletePackage(id);
      setPackages((prev) => prev.filter((p) => p.id !== id));
      toast.success("Package deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const courseOptions = useMemo(() => [
    { value: "none", label: "All courses" },
    ...courses.map((c) => ({ value: c.name, label: c.name })),
  ], [courses]);

  const documentOptions = useMemo(() => [
    { value: "all", label: "All documents" },
    ...(course === "none" ? documents : documents.filter(d => d.course === course))
      .map((d) => ({ value: d.id, label: d.title })),
  ], [documents, course]);
  const allSelected = ARTIFACT_KEYS.every((key) => selected[key]);
  const handleSwitchChange = (checked: boolean) => {
    if (checked) {
      selectAll();
    } else {
      clearSelection();
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="flex flex-col items-center text-center">
          <PaperIconCircle tone="lavender" size={50}>
            <GraduationCap className="size-6" />
          </PaperIconCircle>
          <PaperH1 className="mt-4 text-4xl">Teach Me</PaperH1>
          <p className="mt-1 text-[18px] font-architect text-ink-muted">
            Enter a topic and get a complete learning workspace — notes, flashcards, quiz,
            mind map, diagram and more, all in one place.
          </p>
        </div>

        <PaperCard className="mt-8 p-5 z-10">
          <PaperInput
            data-tour="teach-input"
            value={topic}
            onChange={(e) => handleTopicChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") void handleGenerate(); }}
            placeholder="What would you like to learn?"
            className="h-11 bg-input-background text-base"
            autoFocus
          />

          <div className="mt-3 flex flex-wrap gap-1.5">
            {suggestions.map((ex) => (
              <ChipButton
                key={ex}
                onClick={() => setField("topic", ex)}
              >
                {ex}
              </ChipButton>
            ))}
          </div>

          {/* Context Pickers */}
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <PaperH5 className="mb-2 text-ink-muted">Course</PaperH5>
              <PaperSelect
                value={course}
                onChange={(v) => setCourse(v)}
                options={courseOptions}
                placeholder="All courses"
              />
            </div>

            <div className="flex-1">
              <PaperH5 className="mb-2 text-ink-muted">Document</PaperH5>
              <PaperSelect
                value={document ?? "all"}
                onChange={(v) => setDocument(v === "all" ? null : v)}
                options={documentOptions}
                placeholder="All documents"
              />
            </div>
          </div>

          {/* Depth */}
          <div className="mt-5">
            <PaperH5 className="mb-2 text-ink-muted">Depth</PaperH5>
            <div className="flex gap-2">
              {DEPTHS.map((d) => (
                <PaperButton
                  key={d.id}
                  tone={depth === d.id ? "dark" : "paper"}
                  onClick={() => setField("depth", d.id)}
                  className="flex-1 justify-center"
                >
                  {d.label}
                </PaperButton>
              ))}
            </div>
          </div>

          {/* Artifacts */}
          <div className="mt-5" data-tour="teach-artifacts">
            <div className="mb-2 flex items-center justify-between">
              <PaperH5 className="text-ink-muted">
                Artifacts
                {recommendationsLoading && (
                  <Loader2 className="ml-1.5 inline size-3 animate-spin text-ink-muted" />
                )}
              </PaperH5>
              <div className="flex items-center gap-3">
                {recommendations && (
                  <button
                    onClick={applyRecommendations}
                    className="font-kalam rounded px-2 py-0.5 text-sm text-primary transition-colors hover:bg-violet-soft/60"
                  >
                    Use Recommended
                  </button>
                )}
                <PaperSwitch
                  checked={allSelected}
                  onChange={handleSwitchChange}
                  label="All"
                  className="scale-90"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {ARTIFACT_KEYS.map((key) => {
                const rec = recommendations?.[key];
                return (
                  <PaperCard
                    key={key}
                    shadow="none"
                    surface={selected[key] ? "var(--color-violet-soft)" : "#fffdf9"}
                    onClick={() => toggleArtifact(key)}
                    className={cn(
                      "flex flex-col gap-1 px-3 py-2 text-left text-sm cursor-pointer transition-all",
                      selected[key] ? "border-primary/50" : "border-border hover:border-ink-muted/40",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <PaperCheckbox
                        checked={selected[key]}
                        onChange={() => {}}
                        label={ARTIFACT_LABELS[key]}
                        className="pointer-events-none"
                      />
                    </div>
                    {rec && (
                      <div className="flex flex-col gap-0.5 pl-[27px]">
                        <StarRating stars={rec.stars} />
                        <span className="line-clamp-2 text-[10px] leading-tight text-ink-muted/80">{rec.reason}</span>
                      </div>
                    )}
                  </PaperCard>
                );
              })}
            </div>
          </div>

          {showHint && (
            <PaperPanel className="mt-6 p-4 text-sm relative">
              <IconButton
                label="Dismiss hint"
                className="absolute right-2 top-2 size-6"
                onClick={() => {
                  localStorage.setItem("teach_hitl_hint_dismissed", "1");
                  setShowHint(false);
                }}
              >
                <X className="size-3.5" />
              </IconButton>
              <div className="flex items-start gap-3 pr-6 font-kalam">
                <PaperIconCircle tone="lavender" size={28}>
                  <Sparkles className="size-3.5" />
                </PaperIconCircle>
                <div className="leading-relaxed text-ink">
                  <span className="font-bold text-[15px] block mb-1">How Teach Me works:</span>
                  <strong>Phase 1</strong> — AI generates a draft based on your materials. Review and refine it.<br />
                  <strong>Phase 2</strong> — Approve to generate flashcards, quiz, diagram, and mind map from your approved notes.
                </div>
              </div>
            </PaperPanel>
          )}

          <PaperButton
            data-tour="teach-generate"
            onClick={handleGenerate}
            disabled={checking}
            tone="dark"
            size={"md"}
            className="mt-6 w-full gap-2  text-lg"
          >
            {checking ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {checking ? "Checking prerequisites…" : "Generate learning package"}
          </PaperButton>
        </PaperCard>

        {/* Dependency readiness gate */}
        <PaperModal
          open={!!gate}
          onClose={() => setGate(null)}
          title="Prerequisites Needed"
          footer={
            <>
              <PaperButton tone="paper" onClick={generateAnyway}>Generate anyway</PaperButton>
              <PaperButton tone="dark" onClick={studyPrerequisiteFirst} className="gap-1.5">
                <GraduationCap className="size-4" /> Study {gate?.[0]?.name ?? "prerequisite"} first
              </PaperButton>
            </>
          }
        >
          <p className="mb-4">
            Studying these prerequisites first will make <span className="font-bold">{topic}</span> easier to understand.
          </p>
          <PrerequisiteCard
            items={(gate ?? []).map((m) => ({
              title: m.name,
              mastery: m.masteryStatus === "mastered" ? "mastered" : m.masteryStatus === "learning" ? "learning" : m.masteryStatus === "weak" ? "weak" : "unknown",
              done: m.masteryStatus === "mastered",
            }))}
          />
        </PaperModal>

        {/* Library */}
        {packages.length > 0 && (
          <div className="mt-10">
            <PaperH3 className="mb-3">Your learning packages</PaperH3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {packages.map((p) => (
                <ConceptNode
                  key={p.id}
                  title={p.title}
                  description={`${p.depth} · ${p.artifactCount} ${p.artifactCount === 1 ? "artifact" : "artifacts"}`}
                  onClick={() => loadPackage(p.id)}
                  actions={
                    <IconButton
                      label="Delete package"
                      className="hover:text-danger text-ink-muted shrink-0 size-7"
                      onClick={(e) => { e.stopPropagation(); void removePackage(p.id); }}
                    >
                      <Trash2 className="size-3.5" />
                    </IconButton>
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

// ---------------------------------------------------------------------------
// Workspace views
// ---------------------------------------------------------------------------

function ViewState({ icon: Icon, message }: { icon: typeof Sparkles; message: string }) {
      return (
        <EmptyState 
          icon={<Icon className="size-6 text-ink-muted/60" />} 
          title={message}
          className="mt-12"
        />
      );
    }

function Spinner({ message }: { message: string }) {
      return (
        <div className="flex flex-col items-center pt-24 text-muted-foreground">
          <Loader2 className="size-6 animate-spin text-primary" />
          <p className="mt-3 text-sm">{message}</p>
        </div>
      );
    }

function QuizReview({ questions }: { questions: QuizQuestion[] }) {
      const [revealed, setRevealed] = useState<Record<string, boolean>>({});
      if (!questions.length) {
        return <ViewState icon={ListChecks} message="No quiz questions were generated for this topic." />;
      }
      return (
        <div className="space-y-4">
          {questions.map((q, i) => {
            const show = revealed[q.id];
            return (
              <PaperCard key={q.id} className="p-5">
                <div className="flex items-start gap-3">
                  <PaperIconCircle tone="lavender" size={24} className="mt-0.5 shrink-0">
                    <span className="text-xs font-bold">{i + 1}</span>
                  </PaperIconCircle>
                  <p className="text-[15px] font-medium leading-relaxed text-ink">{q.prompt}</p>
                </div>
                {q.options && q.options.length > 0 && (
                  <ul className="mt-4 space-y-2 pl-[36px]">
                    {q.options.map((opt, oi) => {
                      const isAnswer = show && opt.trim() === q.answer.trim();
                      return (
                        <li
                          key={oi}
                          className={cn(
                            "flex items-center gap-3 rounded-xl border px-4 py-2.5 text-[15px] font-architect",
                            isAnswer
                              ? "border-success/30 bg-success-soft text-success-dark font-medium shadow-sm"
                              : "border-black/10 text-ink hover:bg-black/[0.02]",
                            !show && "hover:border-black/20 transition-colors cursor-pointer"
                          )}
                        >
                          {isAnswer && <CheckCircle2 className="size-4 shrink-0" />}
                          {opt}
                        </li>
                      );
                    })}
                  </ul>
                )}
                <div className="mt-4 pl-[36px]">
                  {show ? (
                    q.explanation && (
                      <PaperPanel className="p-4 text-sm mt-2 bg-sage-soft">
                        <p className="text-ink/80 leading-relaxed">{q.explanation}</p>
                      </PaperPanel>
                    )
                  ) : (
                    <PaperButton tone="paper" size="sm" onClick={() => setRevealed((r) => ({ ...r, [q.id]: true }))}>
                      Show answer
                    </PaperButton>
                  )}
                </div>
              </PaperCard>
            );
          })}
        </div>
      );
    }

function ArtifactBody({ view }: { view: ArtifactKey }) {
      const slot = useTeachStore((s) => s.artifacts[view]);
      const selected = useTeachStore((s) => s.selected[view]);
      const retryArtifact = useTeachStore((s) => s.retryArtifact);
      const sessionId = useTeachStore((s) => s.sessionId);
      const [savedToLibrary, setSavedToLibrary] = useState(false);

      if (!selected) {
        return <ViewState icon={XCircle} message={`${ARTIFACT_LABELS[view]} was not included in this package.`} />;
      }
      if (slot.status === "queued") return <Spinner message="Queued — waiting for earlier artifacts…" />;
      if (slot.status === "loading") return <Spinner message={`Generating ${ARTIFACT_LABELS[view].toLowerCase()}…`} />;
      if (slot.status === "error") {
        return (
          <div className="flex flex-col items-center gap-3 pt-24 text-center text-muted-foreground">
            <AlertTriangle className="size-7 text-danger/70" />
            <p className="max-w-sm text-sm">{slot.error}</p>
            <PaperButton tone="paper" size="sm" onClick={() => void retryArtifact(view)}>Retry</PaperButton>
          </div>
        );
      }
      if (!slot.data) return <Spinner message="Loading…" />;

      const quality = (slot.data as any).quality;

      const content = (() => {
        switch (view) {
          case "notes":
            return <MarkdownRenderer content={(slot.data as GeneratedRevision).markdown} />;
          case "difference":
            return <MarkdownRenderer content={(slot.data as GeneratedDifference).content} />;
          case "flashcards": {
            const fset = slot.data as FlashcardSet;
            const cards = fset.cards as Flashcard[];
            if (!cards.length) return <ViewState icon={Layers} message="No flashcards were generated." />;
            return (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {cards.map((c) => <FlashcardCard key={c.id} card={c} />)}
                </div>
                <div className="flex justify-end">
                  <PaperButton
                    size="sm"
                    tone="paper"
                    disabled={savedToLibrary}
                    onClick={async () => {
                      try {
                        await api.saveDeck(
                          fset.deck || "Teach Me Deck",
                          fset.course ?? null,
                          cards,
                          undefined,
                          fset.quality,
                          sessionId ? `teach/${sessionId}` : undefined,
                        );
                        setSavedToLibrary(true);
                        toast.success("Deck saved to library");
                      } catch {
                        toast.error("Failed to save deck");
                      }
                    }}
                  >
                    {savedToLibrary
                      ? <><CheckCircle2 className="mr-1.5 size-3.5" />Added to Decks</>
                      : <><Plus className="mr-1.5 size-3.5" />Add to Decks</>}
                  </PaperButton>
                </div>
              </div>
            );
          }
          case "quiz": {
            const q = slot.data as GeneratedQuiz;
            return (
              <div className="space-y-4">
                <QuizReview questions={q.questions} />
                <div className="flex justify-end">
                  <PaperButton
                    size="sm"
                    tone="paper"
                    disabled={savedToLibrary}
                    onClick={async () => {
                      try {
                        await api.saveQuiz({
                          title: q.title,
                          course: q.course ?? null,
                          difficulty: q.difficulty,
                          questions: q.questions,
                          quality: q.quality,
                          source: sessionId ? `teach/${sessionId}` : undefined,
                        });
                        setSavedToLibrary(true);
                        toast.success("Quiz saved to library");
                      } catch {
                        toast.error("Failed to save quiz");
                      }
                    }}
                  >
                    {savedToLibrary
                      ? <><CheckCircle2 className="mr-1.5 size-3.5" />Quiz Saved</>
                      : <><Plus className="mr-1.5 size-3.5" />Save Quiz</>}
                  </PaperButton>
                </div>
              </div>
            );
          }
          case "diagram":
            return <DiagramViewer code={(slot.data as GeneratedDiagram).mermaid} flush />;
          case "mindmap": {
            const text = (slot.data as GeneratedMindmap).text;
            if (!text?.trim()) return <ViewState icon={Network} message="No mind map was generated." />;
            const count = countNodes(parseMindmapText(text));
            return (
              <div>
                <PaperBadge tone="sky" className="mb-4">
                  {count} {count === 1 ? "node" : "nodes"}
                </PaperBadge>
                <MindMapTree text={text} />
              </div>
            );
          }
        }
      })();

      return (
        <div className="space-y-4">
          {quality && (
            <div className="flex justify-end">
              <QualityBadge score={quality} />
            </div>
          )}
          {content}
        </div>
      );
    }

function StatusIcon({ status, paused }: { status: SlotStatus; paused?: boolean }) {
      switch (status) {
        case "loading":
          return <Loader2 className="size-3.5 shrink-0 animate-spin text-primary" />;
        case "done":
          return <CheckCircle2 className="size-3.5 shrink-0 text-success" />;
        case "error":
          return <AlertTriangle className="size-3.5 shrink-0 text-danger" />;
        case "queued":
          return paused
            ? <PauseCircle className="size-3.5 shrink-0 text-amber-500/70" />
            : <Clock className="size-3.5 shrink-0 text-ink-muted/50" />;
        default:
          return null;
      }
    }

function ConsistencyView() {
      const report = useTeachStore((s) => s.consistency);
      const status = useTeachStore((s) => s.consistencyStatus);
      const generating = useTeachStore((s) => s.generating);
      const runConsistency = useTeachStore((s) => s.runConsistency);

      return (
        <div className="space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <PaperH3>Cross-artifact consistency</PaperH3>
              <p className="mt-1 max-w-xl text-sm text-ink-muted">
                Check that every artifact covers the same concepts as the source material.
                Detects missing, weak and under-represented concepts. Analysis only — nothing
                is regenerated.
              </p>
            </div>
            <PaperButton
              size="sm"
              tone={report ? "paper" : "dark"}
              className="shrink-0 gap-2"
              disabled={generating || status === "loading"}
              onClick={() => void runConsistency()}
            >
              {status === "loading" ? <Loader2 className="size-3.5 animate-spin" /> : <ShieldCheck className="size-3.5" />}
              {report ? "Re-analyze" : "Analyze"}
            </PaperButton>
          </div>

          {status === "loading" ? (
            <Spinner message="Extracting concepts and comparing artifacts…" />
          ) : status === "error" ? (
            <ViewState icon={AlertTriangle} message="Failed to analyze consistency. Try again." />
          ) : report ? (
            <ConsistencyReport report={report} />
          ) : (
            <ViewState icon={ShieldCheck} message="Run an analysis to see concept coverage across your artifacts." />
          )}
        </div>
      );
    }

function WorkspacePhase() {
      const {
        topic, activeView, overview, overviewStatus, sources, packageId, pkgCourse, saving,
        artifacts, selected, generating, currentTask, consistencyStatus, openView, savePackage, reset,
        isPaused, approvedNotes, setApprovedNotes, approveAndResume,
      } = useTeachStore();
      const navigate = useNavigate();

      const grounded = overview?.grounded;

      // Status per nav item: overview/artifacts have real status; Sources rides on
      // the overview (its chunks come back with the overview).
      const statusFor = (view: ViewKey): SlotStatus => {
        if (view === "overview" || view === "sources") return overviewStatus;
        if (view === "consistency") return consistencyStatus;
        return artifacts[view as ArtifactKey].status;
      };

      // Progress across the whole package: overview + each selected artifact.
      const total = 1 + ARTIFACT_KEYS.filter((k) => selected[k]).length;
      const done =
        (overviewStatus === "done" ? 1 : 0) +
        ARTIFACT_KEYS.filter((k) => selected[k] && artifacts[k].status === "done").length;
      const currentLabel = currentTask ? NAV.find((n) => n.id === currentTask)?.label : null;

      return (
        <div className="flex h-full">
          {/* Nav rail */}
          <div className="flex w-64 shrink-0 flex-col border-r border-black/10 bg-surface">
            <div className="flex items-center gap-2.5 border-b border-black/10 px-5 py-4">
              <GraduationCap className="size-[18px] text-primary" />
              <span className="truncate font-architect text-[16px] font-semibold text-ink">{topic}</span>
            </div>

            {/* Live progress strip */}
            <div className="border-b border-black/10 px-5 py-3">
              <div className="flex items-center justify-between text-xs font-kalam">
                <span className="font-medium text-ink-muted">
                  {generating ? (
                    <span className="flex items-center gap-1.5 text-ink">
                      <Loader2 className="size-3 animate-spin text-primary" />
                      Generating {currentLabel ?? "…"}
                    </span>
                  ) : isPaused ? (
                    <span className="flex items-center gap-1.5 text-amber-600">
                      <PauseCircle className="size-3" />
                      Awaiting your review
                    </span>
                  ) : done >= total ? (
                    "All artifacts ready"
                  ) : (
                    "Ready"
                  )}
                </span>
                <span className="font-mono text-ink-muted">{done}/{total}</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/5">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  animate={{ width: `${total ? (done / total) * 100 : 0}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>

            <div className="min-h-0 flex-1">
              <ScrollArea className="h-full">
              <nav className="space-y-1 p-3">
                {NAV.map((item) => {
                  const st = statusFor(item.id);
                  const isArtifact = (ARTIFACT_KEYS as string[]).includes(item.id);
                  const notIncluded = isArtifact && !selected[item.id as ArtifactKey];
                  return (
                    <button
                      key={item.id}
                      onClick={() => openView(item.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[14.5px] font-kalam transition-colors",
                        activeView === item.id ? "bg-violet-soft text-ink font-semibold shadow-sm" : "text-ink-muted hover:bg-black/5 hover:text-ink",
                        notIncluded && "opacity-40",
                      )}
                    >
                      <item.icon className="size-[15px] shrink-0" />
                      <span className="flex-1 truncate">{item.label}</span>
                      <StatusIcon status={st} paused={isPaused && st === "queued"} />
                    </button>
                  );
                })}
              </nav>
              </ScrollArea>
            </div>
            <div className="space-y-2 border-t border-black/10 p-3 bg-surface">
              <PaperButton onClick={savePackage} disabled={saving || !overview} className="w-full gap-2" size="sm" tone="dark">
                {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
                {packageId ? "Saved" : "Save Learning Package"}
              </PaperButton>
              <GhostButton onClick={reset} className="w-full gap-2" size="sm">
                <Plus className="size-3.5" /> New topic
              </GhostButton>
              {pkgCourse && (
                <GhostButton
                  size="sm"
                  border={null}
                  className="w-full gap-2 justify-center text-ink-muted hover:text-ink"
                  onClick={() => navigate(`/courses?name=${encodeURIComponent(pkgCourse)}`)}
                >
                  <FolderOpen className="size-3.5" />
                  <ChevronLeft className="size-3 -mr-1" />
                  <span className="truncate">{pkgCourse}</span>
                </GhostButton>
              )}
            </div>
          </div>

          {/* Main panel */}
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="flex h-12 shrink-0 items-center gap-3 border-b border-black/10 bg-surface/80 px-6 backdrop-blur-xl">
              <span className="font-architect text-[17px] font-medium text-ink">{NAV.find((n) => n.id === activeView)?.label}</span>
              {isPaused && activeView === "notes" && (
                <PaperBadge tone="ochre" className="gap-1 text-[10px]">
                  <PenLine className="size-2.5" /> Draft — editable
                </PaperBadge>
              )}
              {grounded !== undefined && activeView !== "notes" && (
                <PaperBadge tone={grounded ? "sage" : "ochre"} className="text-[10px]">
                  {grounded ? "From your documents" : "General knowledge"}
                </PaperBadge>
              )}
            </div>

            {activeView === "sources" ? (
              <div className="min-h-0 flex-1">
                <SourcePanel sources={sources} />
              </div>
            ) : activeView === "diagram" ? (
              <div className="min-h-0 flex-1 relative">
                <motion.div
                  key={activeView}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute inset-0"
                >
                  <ArtifactBody view={activeView as ArtifactKey} />
                </motion.div>
              </div>
            ) : activeView === "notes" && isPaused ? (
              /* HITL draft editor: student reviews and edits before artifact generation */
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="border-b border-amber-200/60 bg-amber-50/50 px-6 py-2.5 dark:border-amber-800/30 dark:bg-amber-900/10">
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    Review and edit the AI-generated notes below, then click <strong>Approve &amp; Generate Study Tools</strong> to create your flashcards, quiz, and more based on this content.
                  </p>
                </div>
                <div className="min-h-0 flex-1 p-6">
                  <SplitLayout
                    left={
                      <textarea
                        className="h-full w-full resize-none rounded-lg border border-border bg-background p-4 font-mono text-sm leading-relaxed text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                        value={approvedNotes}
                        onChange={(e) => setApprovedNotes(e.target.value)}
                        placeholder="Your draft notes will appear here…"
                        spellCheck={false}
                      />
                    }
                    right={
                      <div className="min-h-full rounded-lg border border-border bg-background/50 p-6">
                        <MarkdownRenderer content={approvedNotes || "Your preview will appear here..."} />
                      </div>
                    }
                  />
                </div>
                <div className="flex shrink-0 items-center justify-between gap-4 border-t border-border bg-background/90 px-6 py-3 backdrop-blur-sm">
                  <p className="text-sm text-muted-foreground">
                    <PauseCircle className="mr-1 inline size-3.5 text-amber-500" />
                    Flashcards, Quiz, Mind Map and Diagram are <strong>paused</strong> until you approve.
                  </p>
                  <PaperButton
                    onClick={() => void approveAndResume()}
                    disabled={generating || !approvedNotes.trim()}
                    tone="dark"
                    className="gap-2"
                  >
                    {generating ? <Loader2 className="size-3.5 animate-spin" /> : <CheckCircle2 className="size-3.5" />}
                    Approve &amp; Generate Study Tools
                  </PaperButton>
                </div>
              </div>
            ) : (
              <div className="min-h-0 flex-1">
                <ScrollArea className="h-full">
                <motion.div
                  key={activeView}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mx-auto max-w-3xl px-8 py-8"
                >
                  {activeView === "overview" ? (
                    overviewStatus === "loading" ? (
                      <Spinner message="Generating draft notes…" />
                    ) : overviewStatus === "error" ? (
                      <ViewState icon={AlertTriangle} message="Failed to generate the overview." />
                    ) : overview ? (
                      <MarkdownRenderer content={overview.markdown} />
                    ) : (
                      <ViewState icon={Sparkles} message="Generating overview…" />
                    )
                  ) : activeView === "consistency" ? (
                    <ConsistencyView />
                  ) : (
                    <ArtifactBody view={activeView as ArtifactKey} />
                  )}
                </motion.div>
                </ScrollArea>
              </div>
            )}
          </div>
        </div>
      );
    }

export function Teach() {
    const phase = useTeachStore((s) => s.phase);
    return phase === "input" ? <InputPhase /> : <WorkspacePhase />;
  }
