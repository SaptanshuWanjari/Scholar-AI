import { Loader2 } from "lucide-react";

export function GraphLoading() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 bg-background text-muted-foreground">
      <Loader2 className="size-6 animate-spin text-violet" />
      <span className="text-sm">Loading knowledge graph…</span>
    </div>
  );
}
