import { PaperButton, GhostButton } from "@paper-ui/components/buttons";
import { PaperIconCircle } from "@paper-ui/core";
import { Compass, Network } from "lucide-react";
import { toast } from "@/app/lib/toast";

export function EmptyInspector() {
  return (
    <div className="flex flex-col items-center px-6 pt-20 text-center">
      <PaperIconCircle tone="lavender" size={48}>
        <Network className="size-6" />
      </PaperIconCircle>
      <h3 className="mt-4 font-architect text-base text-ink">Explore your knowledge base</h3>
      <p className="mt-2 font-kalam text-sm leading-relaxed text-ink-muted">
        Click any concept in the graph to inspect its sources, references, and generated assets.
      </p>
      <div className="mt-6">
        <GhostButton size="sm" onClick={() => toast.info("Browsing all concepts…")}>
          <Compass className="size-4" /> Browse Concepts
        </GhostButton>
      </div>
      <div className="mt-8 w-full px-4 py-4" style={{ background: "#f4f1ea", borderRadius: 6 }}>
        <div className="font-architect text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
          How it works
        </div>
        <p className="mt-2 font-kalam text-xs leading-relaxed text-ink/80">
          ScholarAI automatically discovers relationships between concepts across your documents, notes,
          flashcards, quizzes and AI answers — building your personal knowledge graph.
        </p>
      </div>
    </div>
  );
}
