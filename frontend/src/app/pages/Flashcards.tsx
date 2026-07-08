import { useEffect, useState } from "react";
import {
  LayoutGrid,
  List,
  GraduationCap,
  RotateCw,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Loader2,
  Save,
  Trash2,
  BookPlus,
} from "lucide-react";
import { GenerationSteps } from "../components/GenerationSteps";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "@/app/lib/toast";
import { Page, SectionTitle } from "../components/Page";
import QualityBadge from "../components/QualityBadge";
import { AddToNotebookMenu } from "../components/AddToNotebookMenu";
import { FlashcardCard } from "../components/FlashcardCard";
import { PaperButton, GhostButton, ChipButton } from "@/paper-ui/components/buttons";
import { PaperInput } from "@/paper-ui/components/inputs";
import { PaperSelect } from "@/paper-ui/components/inputs";
import { PaperBadge } from "@/paper-ui/components/badges";
import { SketchProgress } from "@/paper-ui/components/progress";
import { EmptyState } from "@/paper-ui/components/feedback";
import { PaperPanel, SketchBorder } from "@/paper-ui/core";
import { api } from "../lib/api";
import type { DeckOut } from "../lib/api";
import type { Course, DocumentItem, Flashcard } from "../lib/types";
import { useFlashcardGenStore } from "../stores/useFlashcardGenStore";
import { cn } from "../components/ui/utils";

type View = "grid" | "list" | "study";

const NO_GROUNDED_MESSAGE =
  "No grounded flashcards — try uploading documents or a different topic.";

export function Flashcards() {
  // Generation state lives in the store so freshly generated (unsaved) cards and
  // in-flight generations survive navigation.
  const topic = useFlashcardGenStore((s) => s.topic);
  const course = useFlashcardGenStore((s) => s.course);
  const document = useFlashcardGenStore((s) => s.document);
  const generating = useFlashcardGenStore((s) => s.generating);
  const genCards = useFlashcardGenStore((s) => s.cards);
  const genQuality = useFlashcardGenStore((s) => s.quality);
  const genUngrounded = useFlashcardGenStore((s) => s.ungrounded);
  const generatedDeckName = useFlashcardGenStore((s) => s.generatedDeckName);
  const activeDeck = useFlashcardGenStore((s) => s.activeDeck);
  const setField = useFlashcardGenStore((s) => s.setField);
  const setGenCards = useFlashcardGenStore((s) => s.setCards);
  const generate = useFlashcardGenStore((s) => s.generate);

  // View mode persists in the store so it survives navigation.
  const view = useFlashcardGenStore((s) => s.view);
  const setView = (v: View) => setField("view", v);
  const [courses, setCourses] = useState<Course[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  // Cards loaded from a saved deck (view-only / reviewable) — cheap to refetch,
  // so they stay page-local. The store holds the generated unsaved set instead.
  const [savedCards, setSavedCards] = useState<Flashcard[]>([]);

  const [decks, setDecks] = useState<DeckOut[]>([]);
  const [loadingDecks, setLoadingDecks] = useState(true);
  const [loadingCards, setLoadingCards] = useState(false);
  const [saving, setSaving] = useState(false);

  // When a saved deck is open (activeDeck set) we display its cards; otherwise we
  // display the generated unsaved set from the store.
  const cards = activeDeck ? savedCards : genCards;
  const ungrounded = activeDeck ? false : genUngrounded;
  // Helper to update whichever card set is currently displayed.
  const updateActiveCards = (updater: (cs: Flashcard[]) => Flashcard[]) => {
    if (activeDeck) setSavedCards(updater);
    else setGenCards(updater(genCards));
  };

  const loadDecks = async () => {
    setLoadingDecks(true);
    try {
      setDecks(await api.listDecks());
    } catch {
      setDecks([]);
    } finally {
      setLoadingDecks(false);
    }
  };

  useEffect(() => {
    api.listCourses().then(setCourses).catch(() => setCourses([]));
    api.listDocuments().then(setDocuments).catch(() => setDocuments([]));
    void loadDecks();
    // If a saved deck was open before navigating away, re-fetch its cards on
    // remount (savedCards is local state and would otherwise be empty).
    const openDeckName = useFlashcardGenStore.getState().activeDeck;
    if (openDeckName) {
      setLoadingCards(true);
      api
        .listSavedFlashcards(openDeckName)
        .then(setSavedCards)
        .catch(() => setField("activeDeck", null))
        .finally(() => setLoadingCards(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // After a successful generation, switch to grid view to show the new cards.
  const runGenerate = async () => {
    await generate();
    if (useFlashcardGenStore.getState().cards.length > 0) setView("grid");
  };

  const saveDeck = async () => {
    if (saving || cards.length === 0 || activeDeck) return;
    const name = (generatedDeckName ?? topic.trim() ?? "").trim() || "Untitled deck";
    setSaving(true);
    try {
      const deck = await api.saveDeck(name, course, cards, undefined, genQuality);
      toast.success(`Saved "${deck.name}"`);
      // Mark the generated set as saved and reload from the persisted deck so
      // card ids become DB ids (reviewable).
      setField("generatedDeckName", null);
      await loadDecks();
      await openDeck(deck);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save deck");
    } finally {
      setSaving(false);
    }
  };

  const openDeck = async (deck: DeckOut) => {
    setLoadingCards(true);
    try {
      const loaded = await api.listSavedFlashcards(deck.name);
      setSavedCards(loaded);
      setField("activeDeck", deck.name);
      setField("generatedDeckName", null);
      setField("ungrounded", false);
      setView("grid");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load deck");
    } finally {
      setLoadingCards(false);
    }
  };

  const deleteDeck = async (deck: DeckOut) => {
    try {
      await api.deleteDeck(deck.id);
      toast.success(`Deleted "${deck.name}"`);
      if (activeDeck === deck.name) {
        setSavedCards([]);
        setField("activeDeck", null);
      }
      await loadDecks();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete deck");
    }
  };



  const deleteCard = async (card: Flashcard) => {
    const prev = cards;
    updateActiveCards((cs) => cs.filter((c) => c.id !== card.id));
    try {
      await api.deleteCard(card.id);
      toast.success("Card deleted");
      await loadDecks();
    } catch (err) {
      updateActiveCards(() => prev);
      toast.error(err instanceof Error ? err.message : "Failed to delete card");
    }
  };

  const reviewCard = async (card: Flashcard, quality: number) => {
    // Optimistic update on whichever set is shown.
    updateActiveCards((cs) => cs.map((c) => (c.id === card.id ? { ...c, ease: quality < 3 ? "learning" : "mastered" } : c)));
    if (!activeDeck) return; // Unsaved cards have no DB id to persist against.
    try {
      const updated = await api.reviewCardSm2(card.id, quality);
      setSavedCards((cs) => cs.map((c) => (c.id === card.id ? updated : c)));
      void loadDecks();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save review");
    }
  };

  const hasCards = cards.length > 0;
  const canSave = hasCards && !activeDeck;

  return (
    <Page className="space-y-6">
      {/* Generate flashcards */}
      <PaperPanel data-tour="flashcards-generate" className="p-5 z-10">
        <div className="flex items-center gap-2 font-architect text-lg text-ink">
          <Sparkles className="size-4" /> Generate flashcards
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <PaperInput
            id="flashcards-topic-input"
            value={topic}
            onChange={(e) => setField("topic", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void runGenerate();
              }
            }}
            placeholder="Topic, e.g. eigenvalues, SN1 vs SN2…"
            wrapperClassName="flex-1"
            disabled={generating}
          />
          <PaperSelect
            value={course ?? "all"}
            onChange={(v) => setField("course", v === "all" ? null : v)}
            options={[
              { value: "all", label: "All courses" },
              ...courses.map((c) => ({ value: c.name, label: c.name })),
            ]}
            placeholder="All courses"
            wrapperClassName="sm:w-48"
          />
          <PaperSelect
            value={document ?? "all"}
            onChange={(v) => setField("document", v === "all" ? null : v)}
            options={[
              { value: "all", label: "All documents" },
              ...documents.filter(d => course ? d.course === course : true).map((d) => ({ value: d.id, label: d.title })),
            ]}
            placeholder="All documents"
            wrapperClassName="sm:w-48"
          />
          <PaperButton
            tone="dark"
            onClick={() => void runGenerate()}
            disabled={!topic.trim() || generating}
          >
            {generating ? (
              <><Loader2 className="size-4 animate-spin" /> Generating…</>
            ) : (
              <><Sparkles className="size-4" /> Generate</>
            )}
          </PaperButton>
        </div>
        <GenerationSteps
          steps={["Searching your library", "Extracting key concepts", "Writing cards", "Formatting deck"]}
          loading={generating}
          className="mt-4"
        />
      </PaperPanel>

      {/* Decks */}
      <div data-tour="flashcards-decks">
        <div className="flex items-center justify-between">
                    <h3 className='font-architect text-ink pb-3'>Decks</h3>

        </div>
        {loadingDecks ? (
          <PaperPanel className="flex items-center gap-2 px-4 py-8 font-kalam text-sm text-ink-muted">
            <Loader2 className="size-4 animate-spin" /> Loading decks…
          </PaperPanel>
        ) : decks.length === 0 ? (
          <EmptyState
            icon={<GraduationCap className="size-6 text-ink-muted" />}
            title="No saved decks yet"
            description="Generate your first deck. Start with a topic from your documents."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {decks.map((d) => (
              <motion.div
                key={d.id}
                whileHover={{ y: -3 }}
                onClick={() => void openDeck(d)}
                className="group relative cursor-pointer"
              >
                {/* Hand-drawn paper card */}
                <div
                  className="relative overflow-visible"
                  style={{
                    filter: activeDeck === d.name
                      ? "drop-shadow(2px 6px 10px rgba(0,0,0,0.22))"
                      : "drop-shadow(1px 4px 8px rgba(0,0,0,0.14))",
                  }}
                >
                  <SketchBorder
                    fill="#fffdf9"
                    stroke={activeDeck === d.name ? "#4a6c8c" : "#9c9484"}
                    strokeWidth={activeDeck === d.name ? 2 : 1.6}
                    roughness={1.1}
                    shadow={0}
                  />
                  <div className="relative z-[1] p-4">
                    <div className="flex items-center justify-between">
                      <div
                        className="flex size-9 items-center justify-center"
                        style={{ color: d.color ?? "#7fa37b" }}
                      >
                        <GraduationCap className="size-5" />
                      </div>
                      <span className="font-kalam text-xs text-ink-muted">{d.cards} cards</span>
                    </div>
                    <div className="mt-3 line-clamp-2 break-words font-architect text-[14px] text-ink" title={d.name}>{d.name}</div>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <span className="font-kalam text-xs text-ink-muted">{d.course}</span>
                      {d.quality && <QualityBadge score={d.quality} />}
                    </div>
                    <SketchProgress
                      value={d.cards ? (d.mastered / d.cards) * 100 : 0}
                      height={10}
                      className="mt-3"
                    />
                    <div className="mt-1.5 font-kalam text-xs text-ink-muted">{d.mastered} mastered</div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    void deleteDeck(d);
                  }}
                  aria-label={`Delete ${d.name}`}
                  className="absolute right-1 top-1 z-10 flex size-7 items-center justify-center rounded-md text-ink-muted opacity-0 transition-opacity hover:bg-red-100 hover:text-red-600 group-hover:opacity-100"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* View switcher */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-architect text-ink">Cards</h3>
          {activeDeck && (
            <PaperBadge tone="sky" className="text-[10px]">
              {activeDeck}
            </PaperBadge>
          )}
          {!activeDeck && hasCards && <QualityBadge score={genQuality} />}
        </div>
        <div className="flex items-center gap-2">
          {hasCards && (
            <AddToNotebookMenu
              artifactType="flashdeck"
              content={{
                name: activeDeck ?? "Flashcards",
                cards: cards.map((c) => ({ front: c.front, back: c.back })),
              }}
              sourceId={activeDeck ?? "flashcards"}
              course={course === "none" ? null : course}
              trigger={
                <PaperButton size="sm">
                  <BookPlus className="size-4" /> Add deck
                </PaperButton>
              }
            />
          )}
          {canSave && (
            <GhostButton
              size="sm"
              onClick={() => void saveDeck()}
              disabled={saving}
            >
              {saving ? (
                <><Loader2 className="size-4 animate-spin" /> Saving…</>
              ) : (
                <><Save className="size-4" /> Save as deck</>
              )}
            </GhostButton>
          )}
          <div data-tour="flashcards-views" className="flex items-center gap-1">
            {([
              { id: "grid", icon: LayoutGrid, label: "Grid" },
              { id: "list", icon: List, label: "List" },
              { id: "study", icon: RotateCw, label: "Study" },
            ] as const).map((v) => (
              <ChipButton
                key={v.id}
                selected={view === v.id}
                onClick={() => setView(v.id)}
                disabled={!hasCards}
              >
                <v.icon className="size-3.5" /> {v.label}
              </ChipButton>
            ))}
          </div>
        </div>
      </div>

      {loadingCards ? (
        <PaperPanel className="flex items-center justify-center gap-2 px-6 py-14 font-kalam text-sm text-ink-muted">
          <Loader2 className="size-4 animate-spin" /> Loading cards…
        </PaperPanel>
      ) : !hasCards ? (
        <EmptyCards ungrounded={ungrounded} />
      ) : (
        <>
          {view === "grid" && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((c) => (
                <FlashcardCard
                  key={c.id}
                  card={c}
                  onDelete={deleteCard}
                  course={course === "none" ? null : course}
                />
              ))}
            </div>
          )}

          {view === "list" && (
            <PaperPanel>
              {cards.map((c, i) => (
                <div
                  key={c.id}
                  className={cn("group/row flex items-center gap-4 px-4 py-3 hover:bg-black/[0.03]", i !== 0 && "border-t border-[#e8e2d8]" )}
                >
                  <PaperBadge tone="ink" className="text-[10px] uppercase">{c.type}</PaperBadge>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-architect text-[14px] text-ink">{c.front}</div>
                    <div className="truncate font-kalam text-xs text-ink-muted">{c.back}</div>
                  </div>
                  <span className="font-kalam text-xs text-ink-muted">{c.deck}</span>
                  <span className="font-kalam text-xs text-ink-muted">{c.due}</span>
                  <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover/row:opacity-100">
                    <AddToNotebookMenu
                      artifactType="flashcard"
                      content={{ front: c.front, back: c.back }}
                      sourceId={c.id}
                      course={course === "none" ? null : course}
                      trigger={
                        <button className="flex size-7 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-black/5">
                          <BookPlus className="size-3.5" />
                        </button>
                      }
                    />
                    <button
                      onClick={() => void deleteCard(c)}
                      aria-label="Delete card"
                      className="flex size-7 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-red-100 hover:text-red-600"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </PaperPanel>
          )}

          {view === "study" && (
            <StudyMode cards={cards} onReview={reviewCard} persisted={!!activeDeck} />
          )}
        </>
      )}
    </Page>
  );
}

function EmptyCards({ ungrounded }: { ungrounded: boolean }) {
  return (
    <EmptyState
      icon={<Sparkles className="size-6 text-ink-muted" />}
      title={ungrounded ? "No grounded flashcards" : "No flashcards yet"}
      description={
        ungrounded
          ? NO_GROUNDED_MESSAGE
          : "Enter a topic above and generate a set of source-grounded flashcards, or pick a saved deck to start studying."
      }
    />
  );
}

function StudyMode({
  cards,
  onReview,
  persisted,
}: {
  cards: Flashcard[];
  onReview: (card: Flashcard, quality: number) => void;
  persisted: boolean;
}) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = cards[idx % cards.length];
  const progress = ((idx + 1) / cards.length) * 100;

  const next = () => {
    setFlipped(false);
    setIdx((i) => (i + 1) % cards.length);
  };
  const prev = () => {
    setFlipped(false);
    setIdx((i) => (i - 1 + cards.length) % cards.length);
  };

  const grade = (quality: number) => {
    onReview(card, quality);
    next();
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-4">
        <SketchProgress value={progress} height={12} className="flex-1" />
        <span className="font-kalam text-xs tabular-nums text-ink-muted">
          {idx + 1} of {cards.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <div key={card.id} className="group relative h-80 w-full [perspective:1000px]">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: 1,
              y: 0,
              rotateY: flipped ? 180 : 0
            }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              rotateY: { duration: 0.6, type: "spring", stiffness: 260, damping: 20 },
              opacity: { duration: 0.3 },
              y: { duration: 0.3 }
            }}
            className="relative size-full cursor-pointer [transform-style:preserve-3d]"
            onClick={() => setFlipped(!flipped)}
          >
            {/* Front — hand-drawn paper */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center [backface-visibility:hidden] [transform:rotateY(0deg)]"
              style={{ zIndex: flipped ? 0 : 1, filter: "drop-shadow(2px 6px 12px rgba(0,0,0,0.18))" }}
            >
              <SketchBorder fill="#fffdf9" stroke="#9c9484" strokeWidth={1.8} roughness={1.1} shadow={0} />
              <div className="relative z-[1] flex flex-col items-center">
                <PaperBadge tone="ink" className="mb-8 text-[10px] uppercase tracking-widest">
                  Question · {card.deck}
                </PaperBadge>
                <p className="font-architect text-2xl leading-tight text-ink">{card.front}</p>
                <div className="mt-8 flex items-center gap-2 font-kalam text-xs text-ink-muted/60 uppercase tracking-wider">
                  <RotateCw className="size-3" /> Tap to reveal
                </div>
              </div>
            </div>

            {/* Back — sage-tinted paper */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]"
              style={{ zIndex: flipped ? 1 : 0, filter: "drop-shadow(2px 6px 12px rgba(0,0,0,0.18))" }}
            >
              <SketchBorder fill="#f3f8f0" stroke="#4a7a5c" strokeWidth={1.8} roughness={1.1} shadow={0} />
              <div className="relative z-[1] flex flex-col items-center">
                <PaperBadge tone="sage" className="mb-8 text-[10px] uppercase tracking-widest">
                  Answer · {card.deck}
                </PaperBadge>
                <p className="font-architect text-2xl leading-tight text-ink">{card.back}</p>
                <div className="mt-8 flex items-center gap-2 font-kalam text-xs text-ink-muted/60 uppercase tracking-wider">
                  <RotateCw className="size-3" /> Tap to see question
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      <div className="mt-8 flex items-center justify-between">
        <GhostButton size="sm" onClick={prev} style={{ width: 44, height: 44, borderRadius: "50%", padding: 0 }}>
          <ChevronLeft className="size-5" />
        </GhostButton>
        <div className={cn("flex items-center gap-2 transition-all duration-300", flipped ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none")}>
          <PaperButton size="sm" onClick={() => grade(1)} style={{ color: "#9f3a36" }}>
            <X className="size-4" /> Again
          </PaperButton>
          <PaperButton size="sm" onClick={() => grade(3)} style={{ color: "#8a6800" }}>
            Hard
          </PaperButton>
          <PaperButton size="sm" tone="green" onClick={() => grade(4)}>
            Good
          </PaperButton>
          <PaperButton size="sm" onClick={() => grade(5)} style={{ color: "#3a6a9f" }}>
            <Check className="size-4" /> Easy
          </PaperButton>
        </div>
        <GhostButton size="sm" onClick={next} style={{ width: 44, height: 44, borderRadius: "50%", padding: 0 }}>
          <ChevronRight className="size-5" />
        </GhostButton>
      </div>

      {!persisted && (
        <p className="mt-4 text-center font-kalam text-xs text-ink-muted">
          Save this set as a deck to record your reviews.
        </p>
      )}
    </div>
  );
}
