import { useState } from "react";
import {
  LayoutGrid,
  List,
  GraduationCap,
  RotateCw,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Page, SectionTitle } from "../components/Page";
import { FlashcardCard } from "../components/FlashcardCard";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { decks, flashcards } from "../lib/mock-data";
import { cn } from "../components/ui/utils";

type View = "grid" | "list" | "study";

export function Flashcards() {
  const [view, setView] = useState<View>("grid");

  return (
    <Page className="space-y-6">
      {/* Decks */}
      <div>
        <SectionTitle title="Decks" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {decks.map((d) => (
            <motion.div
              key={d.id}
              whileHover={{ y: -2 }}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex size-9 items-center justify-center rounded-lg" style={{ backgroundColor: `${d.color}22`, color: d.color }}>
                  <GraduationCap className="size-4" />
                </div>
                <span className="text-xs text-muted-foreground">{d.cards} cards</span>
              </div>
              <div className="mt-3 text-sm font-medium">{d.name}</div>
              <div className="text-xs text-muted-foreground">{d.course}</div>
              <Progress value={(d.mastered / d.cards) * 100} className="mt-3 h-1.5" />
              <div className="mt-1.5 text-xs text-muted-foreground">{d.mastered} mastered</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* View switcher */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Cards</h3>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
          {([
            { id: "grid", icon: LayoutGrid, label: "Grid" },
            { id: "list", icon: List, label: "List" },
            { id: "study", icon: RotateCw, label: "Study" },
          ] as const).map((v) => (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors",
                view === v.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <v.icon className="size-4" /> {v.label}
            </button>
          ))}
        </div>
      </div>

      {view === "grid" && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {flashcards.map((c) => (
            <FlashcardCard key={c.id} card={c} />
          ))}
        </div>
      )}

      {view === "list" && (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          {flashcards.map((c, i) => (
            <div
              key={c.id}
              className={cn("flex items-center gap-4 px-4 py-3 hover:bg-accent/30", i !== 0 && "border-t border-border")}
            >
              <Badge variant="outline" className="text-[10px] uppercase">{c.type}</Badge>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm">{c.front}</div>
                <div className="truncate text-xs text-muted-foreground">{c.back}</div>
              </div>
              <span className="text-xs text-muted-foreground">{c.deck}</span>
              <span className="text-xs text-muted-foreground">{c.due}</span>
            </div>
          ))}
        </div>
      )}

      {view === "study" && <StudyMode />}
    </Page>
  );
}

function StudyMode() {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = flashcards[idx];
  const progress = ((idx + 1) / flashcards.length) * 100;

  const next = () => {
    setFlipped(false);
    setIdx((i) => (i + 1) % flashcards.length);
  };
  const prev = () => {
    setFlipped(false);
    setIdx((i) => (i - 1 + flashcards.length) % flashcards.length);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-4">
        <Progress value={progress} className="h-1.5 flex-1" />
        <span className="text-xs font-medium tabular-nums text-muted-foreground">
          {idx + 1} of {flashcards.length}
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
        <div className="flex gap-4">
          <Button variant="outline" className="h-11 gap-2 rounded-full border-danger/40 px-6 font-medium text-danger hover:bg-danger-soft" onClick={next}>
            <X className="size-4" /> Hard
          </Button>
          <Button variant="outline" className="h-11 gap-2 rounded-full border-success/40 px-6 font-medium text-success hover:bg-success-soft" onClick={next}>
            <Check className="size-4" /> Easy
          </Button>
        </div>
        <Button variant="outline" size="icon" className="size-11 rounded-full border-border/60" onClick={next}>
          <ChevronRight className="size-5" />
        </Button>
      </div>
    </div>
  );
}
