import type { ReactNode } from "react";
import { Lightbulb, X } from "lucide-react";
import { useGuidanceStore } from "../useGuidanceStore";

/**
 * Layer 2 — contextual tip. A small, dismissible inline banner that surfaces a
 * hidden feature, shortcut, or best practice without interrupting the user.
 * Once dismissed (or if tips are disabled in preferences) it stays hidden.
 *
 *   <ContextualTip id="documents-drag" title="Tip">
 *     You can drag &amp; drop multiple PDFs at once.
 *   </ContextualTip>
 *
 * `id` must be stable and unique — it is the persistence key.
 */
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
    <div
      role="note"
      className={
        "flex items-start gap-3 rounded-xl border border-border bg-accent/40 px-4 py-3 text-sm " +
        (className ?? "")
      }
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
        className="shrink-0 rounded-md p-0.5 text-muted-foreground transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
