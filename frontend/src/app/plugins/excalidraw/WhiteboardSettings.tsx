import { Clock, Pencil, Hand } from "lucide-react";
import { cn } from "../../components/ui/utils";
import { useWhiteboardPrefs, type AutosaveMode } from "./useWhiteboardPrefs";

const OPTIONS: { value: AutosaveMode; label: string; desc: string; icon: typeof Clock }[] = [
  { value: "timed", label: "Time-based", desc: "Save automatically every few seconds", icon: Clock },
  { value: "each-edit", label: "After each edit", desc: "Save shortly after every change", icon: Pencil },
  { value: "manual", label: "Manual", desc: "Only save when you click Save", icon: Hand },
];

export function WhiteboardSettings() {
  const mode = useWhiteboardPrefs((s) => s.autosaveMode);
  const setMode = useWhiteboardPrefs((s) => s.setAutosaveMode);

  return (
    <div className="space-y-2">
      <div className="text-xs font-medium text-foreground">Autosave</div>
      <div className="grid gap-2 sm:grid-cols-3">
        {OPTIONS.map((opt) => {
          const active = mode === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setMode(opt.value)}
              className={cn(
                "flex flex-col gap-1 rounded-lg border p-3 text-left transition-colors",
                active
                  ? "border-violet bg-violet-soft/40"
                  : "border-border hover:bg-accent/40",
              )}
            >
              <span className="flex items-center gap-2 text-sm font-medium">
                <opt.icon className={cn("size-4", active ? "text-violet" : "text-muted-foreground")} />
                {opt.label}
              </span>
              <span className="text-xs text-muted-foreground">{opt.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
