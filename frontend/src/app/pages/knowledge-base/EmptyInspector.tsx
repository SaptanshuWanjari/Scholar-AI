import { Button } from "../../components/ui/button";
import { Compass, Network } from "lucide-react";
import { toast } from "sonner";

export function EmptyInspector() {
  return (
    <div className="flex flex-col items-center px-6 pt-20 text-center">
      <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground">
        <Network className="size-6" />
      </div>
      <h3 className="mt-4 text-base font-semibold">Explore your knowledge base</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Click any concept in the graph to inspect its sources, references, and generated assets.
      </p>
      <Button
        variant="outline"
        className="mt-6 gap-2"
        onClick={() => toast.info("Browsing all concepts…")}
      >
        <Compass className="size-4" /> Browse Concepts
      </Button>
      <div className="mt-8 w-full rounded-xl border border-border bg-card p-4 text-left">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">How it works</div>
        <p className="mt-2 text-xs leading-relaxed text-foreground/80">
          ScholarAI automatically discovers relationships between concepts across your documents, notes, flashcards, quizzes and AI answers — building your personal knowledge graph.
        </p>
      </div>
    </div>
  );
}
