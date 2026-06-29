import { Lightbulb, HelpCircle, Sigma, AlertTriangle, StickyNote } from "lucide-react";

const CATS = [
  { icon: Lightbulb, label: "Insight", color: "text-amber-500" },
  { icon: HelpCircle, label: "Question", color: "text-violet-500" },
  { icon: Sigma, label: "Formula", color: "text-emerald-500" },
  { icon: AlertTriangle, label: "Confusing", color: "text-red-500" },
  { icon: StickyNote, label: "General", color: "text-slate-400" },
];

export function ReadingAnnotationsSettings() {
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Adds a Workspace pane to Reading mode for categorized sticky notes and
        region annotations. Sticky notes work on their own; freehand drawing
        requires the Excalidraw plugin to also be enabled.
      </p>
      <div className="text-xs font-medium text-foreground">Note categories</div>
      <div className="flex flex-wrap gap-2">
        {CATS.map((c) => (
          <span
            key={c.label}
            className="flex items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1 text-xs"
          >
            <c.icon className={`size-3.5 ${c.color}`} /> {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}
