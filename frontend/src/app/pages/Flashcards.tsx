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
} from "lucide-react";
import { GenerationSteps } from "../components/GenerationSteps";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Page, SectionTitle } from "../components/Page";
import QualityBadge from "../components/QualityBadge";
import { AddToNotebookMenu } from "../components/AddToNotebookMenu";
import { FlashcardCard } from "../components/FlashcardCard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
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
      <div data-tour="flashcards-generate" className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="size-4 text-violet" /> Generate flashcards
        </div>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
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
            className="flex-1"
            disabled={generating}
          />
          <Select
            value={course ?? "all"}
            onValueChange={(v) => setField("course", v === "all" ? null : v)}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All courses</SelectItem>
              {courses.map((c) => (
                <SelectItem key={c.id} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={document ?? "all"}
            onValueChange={(v) => setField("document", v === "all" ? null : v)}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All documents" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All documents</SelectItem>
              {documents.filter(d => course ? d.course === course : true).map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={() => void runGenerate()}
            disabled={!topic.trim() || generating}
            className="gap-1.5"
          >
            {generating ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Generating…
              </>
            ) : (
              <>
                <Sparkles className="size-4" /> Generate
              </>
            )}
          </Button>
        </div>
        <GenerationSteps
          steps={["Searching your library", "Extracting key concepts", "Writing cards", "Formatting deck"]}
          loading={generating}
          className="mt-3"
        />
      </div>

      {/* Decks */}
      <div data-tour="flashcards-decks">
        <div className="flex items-center justify-between">
          <SectionTitle title="Decks" />

        </div>
        {loadingDecks ? (
          <div className="flex items-center gap-2 rounded-xl border border-dashed border-border bg-card/40 px-4 py-8 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Loading decks…
          </div>
        ) : decks.length === 0 ? (
          <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-card/40 px-6 py-10 text-center">
            <div className="flex size-10 items-center justify-center rounded-xl border border-border bg-card text-violet">
              <GraduationCap className="size-5" />
            </div>
            <h3 className="mt-4 text-sm font-semibold">No saved decks yet</h3>
            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
              Generate your first deck. Start with a topic from your documents.
            </p>
            <Button 
              className="mt-4 gap-2" 
              size="sm" 
              onClick={() => window.document.getElementById("flashcards-topic-input")?.focus()}
            >
              <Sparkles className="size-4" /> Generate Deck
            </Button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {decks.map((d) => (
              <motion.div
                key={d.id}
                whileHover={{ y: -2 }}
                onClick={() => void openDeck(d)}
                className={cn(
                  "group relative cursor-pointer rounded-xl border bg-card p-4 transition-colors",
                  activeDeck === d.name ? "border-violet/60 ring-1 ring-violet/30" : "border-border hover:border-border",
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex size-9 items-center justify-center rounded-lg" style={{ backgroundColor: `${d.color}22`, color: d.color }}>
                    <GraduationCap className="size-4" />
                  </div>
                  <span className="text-xs text-muted-foreground">{d.cards} cards</span>
                </div>
                <div className="mt-3 line-clamp-2 break-words text-sm font-medium" title={d.name}>{d.name}</div>
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs text-muted-foreground">{d.course}</div>
                  {d.quality && <QualityBadge score={d.quality} />}
                </div>
                <Progress value={d.cards ? (d.mastered / d.cards) * 100 : 0} className="mt-3 h-1.5" />
                <div className="mt-1.5 text-xs text-muted-foreground">{d.mastered} mastered</div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    void deleteDeck(d);
                  }}
                  aria-label={`Delete ${d.name}`}
                  className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-danger-soft hover:text-danger group-hover:opacity-100"
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
          <h3 className="text-sm font-semibold">Cards</h3>
          {activeDeck && (
            <Badge variant="outline" className="text-[10px] font-medium">
              {activeDeck}
            </Badge>
          )}
          {/* Quality of the freshly generated, unsaved set. */}
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
              label="Add deck"
            />
          )}
          {canSave && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => void saveDeck()}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Saving…
                </>
              ) : (
                <>
                  <Save className="size-4" /> Save as deck
                </>
              )}
            </Button>
          )}
          <div data-tour="flashcards-views" className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
            {([
              { id: "grid", icon: LayoutGrid, label: "Grid" },
              { id: "list", icon: List, label: "List" },
              { id: "study", icon: RotateCw, label: "Study" },
            ] as const).map((v) => (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                disabled={!hasCards}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors",
                  view === v.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                  !hasCards && "cursor-not-allowed opacity-50",
                )}
              >
                <v.icon className="size-4" /> {v.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loadingCards ? (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card/40 px-6 py-14 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading cards…
        </div>
      ) : !hasCards ? (
        <EmptyCards ungrounded={ungrounded} />
      ) : (
        <>
          {view === "grid" && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((c) => (
                <div key={c.id} className="group/card relative">
                  <FlashcardCard card={c} />
                  <div className="absolute right-2 top-2 z-10 flex items-center gap-1 opacity-0 transition-opacity group-hover/card:opacity-100">
                    <AddToNotebookMenu
                      artifactType="flashcard"
                      content={{ front: c.front, back: c.back }}
                      sourceId={c.id}
                      course={course === "none" ? null : course}
                      variant="ghost"
                      label=""
                      className="size-7 bg-card/80 p-0 backdrop-blur"
                    />
                    <button
                      onClick={() => void deleteCard(c)}
                      aria-label="Delete card"
                      className="flex size-7 items-center justify-center rounded-md bg-card/80 text-muted-foreground backdrop-blur transition-colors hover:bg-danger-soft hover:text-danger"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {view === "list" && (
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              {cards.map((c, i) => (
                <div
                  key={c.id}
                  className={cn("group/row flex items-center gap-4 px-4 py-3 hover:bg-accent/30", i !== 0 && "border-t border-border")}
                >
                  <Badge variant="outline" className="text-[10px] uppercase">{c.type}</Badge>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm">{c.front}</div>
                    <div className="truncate text-xs text-muted-foreground">{c.back}</div>
                  </div>
                  <span className="text-xs text-muted-foreground">{c.deck}</span>
                  <span className="text-xs text-muted-foreground">{c.due}</span>
                  <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover/row:opacity-100">
                    <AddToNotebookMenu
                      artifactType="flashcard"
                      content={{ front: c.front, back: c.back }}
                      sourceId={c.id}
                      course={course === "none" ? null : course}
                      variant="ghost"
                      label=""
                      className="size-7 p-0"
                    />
                    <button
                      onClick={() => void deleteCard(c)}
                      aria-label="Delete card"
                      className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-danger-soft hover:text-danger"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
    <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-card/40 px-6 py-14 text-center">
      <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-card text-violet">
        <Sparkles className="size-6" />
      </div>
      <h3 className="mt-5 text-sm font-semibold">
        {ungrounded ? "No grounded flashcards" : "No flashcards yet"}
      </h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {ungrounded
          ? NO_GROUNDED_MESSAGE
          : "Enter a topic above and generate a set of source-grounded flashcards, or pick a saved deck to start studying."}
      </p>
    </div>
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
        <Progress value={progress} className="h-1.5 flex-1" />
        <span className="text-xs font-medium tabular-nums text-muted-foreground">
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
            {/* Front */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-10 text-center [backface-visibility:hidden] [transform:rotateY(0deg)] shadow-sm"
              style={{ zIndex: flipped ? 0 : 1 }}
            >
              <Badge variant="outline" className="mb-8 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Question · {card.deck}
              </Badge>
              <p className="font-serif text-2xl leading-tight text-foreground">{card.front}</p>
              <div className="mt-8 flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider opacity-60">
                <RotateCw className="size-3" /> Tap to reveal
              </div>
            </div>

            {/* Back */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-violet/30 bg-[#fdfcfa] p-10 text-center [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-sm"
              style={{ zIndex: flipped ? 1 : 0 }}
            >
              <Badge variant="outline" className="mb-8 text-[10px] font-semibold uppercase tracking-widest text-violet">
                Answer · {card.deck}
              </Badge>
              <p className="font-serif text-2xl leading-tight text-foreground">{card.back}</p>
              <div className="mt-8 flex items-center gap-2 text-xs font-medium text-violet/60 uppercase tracking-wider">
                <RotateCw className="size-3" /> Tap to see question
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      <div className="mt-8 flex items-center justify-between">
        <Button variant="outline" size="icon" className="size-11 rounded-full border-border/60" onClick={prev}>
          <ChevronLeft className="size-5" />
        </Button>
        <div className={cn("flex items-center gap-2 transition-all duration-300", flipped ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none")}>
          <Button variant="outline" className="h-11 gap-2 rounded-full border-danger/40 px-5 font-medium text-danger hover:bg-danger-soft" onClick={() => grade(1)}>
            <X className="size-4" /> Again
          </Button>
          <Button variant="outline" className="h-11 gap-2 rounded-full border-amber-500/40 px-5 font-medium text-amber-500 hover:bg-amber-500/10" onClick={() => grade(3)}>
            Hard
          </Button>
          <Button variant="outline" className="h-11 gap-2 rounded-full border-success/40 px-5 font-medium text-success hover:bg-success-soft" onClick={() => grade(4)}>
            Good
          </Button>
          <Button variant="outline" className="h-11 gap-2 rounded-full border-blue-500/40 px-5 font-medium text-blue-500 hover:bg-blue-500/10" onClick={() => grade(5)}>
            <Check className="size-4" /> Easy
          </Button>
        </div>
        <Button variant="outline" size="icon" className="size-11 rounded-full border-border/60" onClick={next}>
          <ChevronRight className="size-5" />
        </Button>
      </div>

      {!persisted && (
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Save this set as a deck to record your reviews.
        </p>
      )}
    </div>
  );
}
