import { Lightbulb, HelpCircle, Sigma, AlertTriangle, StickyNote } from "lucide-react";
import { Pill } from "@paper-ui/components/badges";

const CATS: { icon: typeof Lightbulb; label: string; tone: "ochre" | "lavender" | "sage" | "brick" | "ink" }[] = [
  { icon: Lightbulb,     label: "Insight",   tone: "ochre"    },
  { icon: HelpCircle,   label: "Question",  tone: "lavender" },
  { icon: Sigma,        label: "Formula",   tone: "sage"     },
  { icon: AlertTriangle,label: "Confusing", tone: "brick"    },
  { icon: StickyNote,   label: "General",   tone: "ink"      },
];

export function ReadingAnnotationsSettings() {
  return (
    <div className="space-y-3">
      <p className="font-kalam text-sm text-ink-muted">
        Adds a Workspace pane to Reading mode for categorized sticky notes and
        region annotations. Sticky notes work on their own; freehand drawing
        requires the Excalidraw plugin to also be enabled.
      </p>
      <div className="font-architect text-xs font-semibold uppercase tracking-widest text-ink-muted/60">
        Note categories
      </div>
      <div className="flex flex-wrap gap-2">
        {CATS.map((c) => (
          <Pill key={c.label} tone={c.tone} icon={<c.icon className="size-3.5" />}>
            {c.label}
          </Pill>
        ))}
      </div>
    </div>
  );
}
