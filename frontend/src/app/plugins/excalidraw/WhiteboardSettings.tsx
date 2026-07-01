import { Clock, Pencil, Hand } from "lucide-react";
import { cn } from "../../components/ui/utils";
import { useWhiteboardPrefs, type AutosaveMode } from "./useWhiteboardPrefs";
import { PaperCard } from "@paper-ui/core";

const OPTIONS: { value: AutosaveMode; label: string; desc: string; icon: typeof Clock }[] = [
  { value: "timed",     label: "Time-based",    desc: "Save automatically every few seconds", icon: Clock  },
  { value: "each-edit", label: "After each edit",desc: "Save shortly after every change",      icon: Pencil },
  { value: "manual",    label: "Manual",         desc: "Only save when you click Save",         icon: Hand   },
];

export function WhiteboardSettings() {
  const mode    = useWhiteboardPrefs((s) => s.autosaveMode);
  const setMode = useWhiteboardPrefs((s) => s.setAutosaveMode);

  return (
    <div className="space-y-3 px-1 py-2">
      <div className="font-architect text-xs font-semibold uppercase tracking-widest text-ink-muted/60">
        Autosave
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {OPTIONS.map((opt) => {
          const active = mode === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setMode(opt.value)}
              className="text-left"
            >
              <PaperCard
                className={cn(
                  "flex flex-col gap-1.5 p-3 transition-colors",
                  active ? "ring-1 ring-violet/30" : "paper-hover-sweep",
                )}
                surface={active ? "#f3f1fb" : "#fffdf9"}
              >
                <span className="flex items-center gap-2 font-kalam text-[14px] font-bold text-ink">
                  <opt.icon className={cn("size-4 shrink-0", active ? "text-violet" : "text-ink-muted")} />
                  {opt.label}
                </span>
                <span className="font-kalam text-xs text-ink-muted">{opt.desc}</span>
              </PaperCard>
            </button>
          );
        })}
      </div>
    </div>
  );
}
