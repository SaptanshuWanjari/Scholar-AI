import { PaperButton } from "@paper-ui/components/buttons";
import { PaperIconCircle } from "@paper-ui/core";
import { Loader2, Network, Sparkles } from "lucide-react";

export function GraphEmpty({ onBuild, building }: { onBuild: () => void; building: boolean }) {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-[#f9f6f0] px-6 text-center">
      <PaperIconCircle tone="ink" size={56}>
        <Network className="size-7" />
      </PaperIconCircle>
      <h3 className="mt-5 font-architect text-lg text-ink">No knowledge graph yet</h3>
      <p className="mt-2 max-w-md font-kalam text-sm leading-relaxed text-ink-muted">
        Build your knowledge graph to discover how concepts across your indexed documents
        connect. This runs the LLM over your documents and may take a while.
      </p>
      <div className="mt-6">
        <PaperButton tone="dark" onClick={onBuild} disabled={building}>
          {building ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
          {building ? "Building knowledge graph…" : "Build knowledge graph"}
        </PaperButton>
      </div>
      {building && (
        <p className="mt-3 font-kalam text-xs text-ink-muted">
          Extracting concepts and relationships — this can take a minute or two.
        </p>
      )}
    </div>
  );
}
