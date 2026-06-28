import { Button } from "../../components/ui/button";
import { Loader2, Network, Sparkles } from "lucide-react";

export function GraphEmpty({ onBuild, building }: { onBuild: () => void; building: boolean }) {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-background px-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground">
        <Network className="size-7" />
      </div>
      <h3 className="mt-5 text-lg font-semibold">No knowledge graph yet</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        Build your knowledge graph to discover how concepts across your indexed documents
        connect. This runs the LLM over your documents and may take a while.
      </p>
      <Button className="mt-6 gap-2" onClick={onBuild} disabled={building}>
        {building ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
        {building ? "Building knowledge graph…" : "Build knowledge graph"}
      </Button>
      {building && (
        <p className="mt-3 text-xs text-muted-foreground">
          Extracting concepts and relationships — this can take a minute or two.
        </p>
      )}
    </div>
  );
}
