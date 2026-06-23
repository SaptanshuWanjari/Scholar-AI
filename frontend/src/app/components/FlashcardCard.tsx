import { useState } from "react";
import { motion } from "motion/react";
import { RotateCw } from "lucide-react";
import type { Flashcard } from "../lib/types";
import { Badge } from "./ui/badge";
import { cn } from "./ui/utils";

const easeMeta: Record<Flashcard["ease"], string> = {
  new: "border-cyan/40 bg-cyan-soft text-cyan",
  learning: "border-warning/40 bg-warning-soft text-warning",
  mastered: "border-success/40 bg-success-soft text-success",
};

export function FlashcardCard({ card }: { card: Flashcard }) {
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
          damping: 20 
        }}
        className="relative size-full [transform-style:preserve-3d]"
      >
        {/* Front */}
        <div 
          className="absolute inset-0 flex flex-col rounded-xl border border-border bg-card p-4 [backface-visibility:hidden] [transform:rotateY(0deg)]"
          style={{ zIndex: flipped ? 0 : 1 }}
        >
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-[10px] font-medium uppercase tracking-wider">
              {card.type}
            </Badge>
            <Badge variant="outline" className={cn("text-[10px] font-medium", easeMeta[card.ease])}>
              {card.ease}
            </Badge>
          </div>
          <p className="mt-4 flex-1 font-serif text-base leading-snug text-foreground/90">{card.front}</p>
          <div className="mt-2 flex items-center justify-between text-[11px] font-medium text-muted-foreground uppercase tracking-tight">
            <span>{card.deck}</span>
            <span className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <RotateCw className="size-3" /> Flip
            </span>
          </div>
        </div>

        {/* Back */}
        <div 
          className="absolute inset-0 flex flex-col rounded-xl border border-violet/30 bg-[#fdfcfa] p-4 [backface-visibility:hidden] [transform:rotateY(180deg)]"
          style={{ zIndex: flipped ? 1 : 0 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-violet">Definition</div>
            <div className="text-[10px] font-medium text-muted-foreground italic">Due {card.due}</div>
          </div>
          <p className="flex-1 font-serif text-base leading-snug text-foreground">{card.back}</p>
          <div className="mt-2 text-[10px] font-medium text-violet/60 uppercase tracking-wider">ScholarAI Study Card</div>
        </div>
      </motion.div>
    </button>
  );
}
