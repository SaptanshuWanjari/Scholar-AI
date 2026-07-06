import type { ReactNode } from "react";
import { Lightbulb, X } from "lucide-react";
import { PaperPanel } from "@/paper-ui/core";
import { useGuidanceStore } from "../useGuidanceStore";

export function ContextualTip({
  id,
  title = "Tip",
  children,
  className,
}: {
  id: string;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  const tipsEnabled = useGuidanceStore((s) => s.prefs.tipsEnabled);
  const dismissed = useGuidanceStore((s) => Boolean(s.tipsDismissed[id]));
  const dismissTip = useGuidanceStore((s) => s.dismissTip);

  if (!tipsEnabled || dismissed) return null;

  return (
    <PaperPanel
      role="note"
      className={"flex items-start gap-3 px-4 py-3 text-sm " + (className ?? "")}
    >
      <Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" />
      <div className="min-w-0 flex-1">
        <span className="font-medium text-foreground">{title}: </span>
        <span className="text-muted-foreground">{children}</span>
      </div>
      <button
        type="button"
        aria-label="Dismiss tip"
        onClick={() => dismissTip(id)}
        className="shrink-0 rounded-md p-0.5 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
      >
        <X className="size-4" />
      </button>
    </PaperPanel>
  );
}
