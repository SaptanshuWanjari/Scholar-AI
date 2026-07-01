import { useState } from "react";
import { motion } from "motion/react";
import { RotateCw, BookPlus, Trash2 } from "lucide-react";
import type { Flashcard } from "../lib/types";
import { PaperBadge } from "@/paper-ui/components/badges";
import { SketchBorder } from "@/paper-ui/core";
import { AddToNotebookMenu } from "./AddToNotebookMenu";

const easeMeta: Record<Flashcard["ease"], "sky" | "ochre" | "sage"> = {
  new: "sky",
  loading: "ochre", // fallback if ease has learning/loading/etc.
  learning: "ochre",
  mastered: "sage",
} as any;

export function FlashcardCard({
  card,
  onDelete,
  course,
}: {
  card: Flashcard;
  onDelete?: (card: Flashcard) => void;
  course?: string | null;
}) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      onClick={() => setFlipped((f) => !f)}
      className="group relative h-44 w-full cursor-pointer text-left [perspective:1000px]"
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        className="relative size-full [transform-style:preserve-3d]"
      >
        {/* Front */}
        <div
          className="absolute inset-0 flex flex-col p-4 [backface-visibility:hidden] [transform:rotateY(0deg)]"
          style={{ zIndex: flipped ? 0 : 1, filter: "drop-shadow(1px 3px 6px rgba(0,0,0,0.12))" }}
        >
          <SketchBorder fill="#fffdf9" stroke="#9c9484" strokeWidth={1.5} roughness={1.0} shadow={0} />
          
          <div className="relative z-[1] flex items-center justify-between">
            <PaperBadge
              tone="ink"
              className="text-[10px] uppercase tracking-wider"
            >
              {card.type}
            </PaperBadge>
            <div className="flex items-center gap-1">
              <PaperBadge
                tone={easeMeta[card.ease] ?? "sky"}
                className="text-[10px]"
              >
                {card.ease}
              </PaperBadge>
              
              {/* Card actions inside card, so they flip with it */}
              <div className="flex items-center gap-0.5 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {course !== undefined && (
                  <AddToNotebookMenu
                    artifactType="flashcard"
                    content={{ front: card.front, back: card.back }}
                    sourceId={card.id}
                    course={course}
                    trigger={
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex h-6 w-6 items-center justify-center rounded text-ink-muted hover:bg-black/5 hover:text-ink transition-colors"
                      >
                        <BookPlus className="size-3.5" />
                      </button>
                    }
                  />
                )}
                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(card);
                    }}
                    title="Delete card"
                    className="inline-flex h-6 w-6 items-center justify-center rounded text-ink-muted hover:bg-red-100 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <p className="relative z-[1] mt-4 flex-1 font-architect text-base leading-snug text-ink">
            {card.front}
          </p>
          
          <div className="relative z-[1] mt-2 flex items-center justify-between font-kalam text-[11px] text-ink-muted">
            <span>{card.deck}</span>
            <span className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <RotateCw className="size-3" /> Flip
            </span>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 flex flex-col p-4 [backface-visibility:hidden] [transform:rotateY(180deg)]"
          style={{ zIndex: flipped ? 1 : 0, filter: "drop-shadow(1px 3px 6px rgba(0,0,0,0.12))" }}
        >
          <SketchBorder fill="#fdfcfa" stroke="#6f63a3" strokeWidth={1.5} roughness={1.0} shadow={0} />
          
          <div className="relative z-[1] flex items-center justify-between mb-3">
            <div className="font-architect text-[10px] uppercase tracking-widest text-[#6f63a3]">
              Definition
            </div>
            <div className="font-kalam text-[10px] text-ink-muted italic">
              Due {card.due}
            </div>
          </div>
          
          <p className="relative z-[1] flex-1 font-architect text-base leading-snug text-ink">
            {card.back}
          </p>
        </div>
      </motion.div>
    </button>
  );
}


