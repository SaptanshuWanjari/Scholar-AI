import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Progress } from "./ui/progress";
import { Textarea } from "./ui/textarea";
import { Toggle } from "./ui/toggle";
import { Check, Sparkles, Loader2 } from "lucide-react";
import { usePromptEnhancerStore } from "../stores/usePromptEnhancerStore";

const LABEL_CONFIG = {
  poor:      { color: "text-red-500",   bar: "bg-red-500",   bg: "bg-red-50 dark:bg-red-950"   },
  fair:      { color: "text-amber-500", bar: "bg-amber-500", bg: "bg-amber-50 dark:bg-amber-950" },
  good:      { color: "text-blue-500",  bar: "bg-blue-500",  bg: "bg-blue-50 dark:bg-blue-950"  },
  excellent: { color: "text-green-500", bar: "bg-green-500", bg: "bg-green-50 dark:bg-green-950" },
} as const;

const DEPTH_OPTIONS = ["Quick", "Standard", "Deep Dive"] as const;
const FOCUS_OPTIONS = ["Conceptual", "Exam", "Interview", "Research"] as const;
const ARTIFACT_OPTIONS = ["Notes", "Quiz", "Flashcards", "Mind Map", "Diagrams"] as const;

type DepthOpt = (typeof DEPTH_OPTIONS)[number];
type FocusOpt = (typeof FOCUS_OPTIONS)[number];
type ArtifactOpt = (typeof ARTIFACT_OPTIONS)[number];

export function PromptCoachModal() {
  const open = usePromptEnhancerStore((s) => s.open);
  const analyzing = usePromptEnhancerStore((s) => s.analyzing);
  const score = usePromptEnhancerStore((s) => s.score);
  const label = usePromptEnhancerStore((s) => s.label);
  const improvements = usePromptEnhancerStore((s) => s.improvements);
  const editedSuggestion = usePromptEnhancerStore((s) => s.editedSuggestion);
  const setEditedSuggestion = usePromptEnhancerStore((s) => s.setEditedSuggestion);
  const resolve = usePromptEnhancerStore((s) => s.resolve);
  const close = usePromptEnhancerStore((s) => s.close);

  const [depth, setDepth] = useState<DepthOpt | null>(null);
  const [focus, setFocus] = useState<FocusOpt | null>(null);
  const [artifacts, setArtifacts] = useState<ArtifactOpt[]>([]);

  const cfg = label ? LABEL_CONFIG[label] : LABEL_CONFIG.fair;
  const capLabel = label ? label.charAt(0).toUpperCase() + label.slice(1) : "";

  function buildEnrichedPrompt() {
    let p = editedSuggestion.trim();
    const extras: string[] = [];
    if (depth) extras.push(`Learning depth: ${depth}.`);
    if (focus) extras.push(`Focus: ${focus}.`);
    if (artifacts.length > 0) extras.push(`Generate: ${artifacts.join(", ")}.`);
    return extras.length > 0 ? `${p}\n\n${extras.join(" ")}` : p;
  }

  function toggleArtifact(a: ArtifactOpt) {
    setArtifacts((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
    );
  }

  function handleUseSuggested() {
    resolve({ action: "use_suggested", prompt: buildEnrichedPrompt() });
  }

  function handleEdit() {
    resolve({ action: "edit", prompt: buildEnrichedPrompt() });
  }

  function handleGenerateAnyway() {
    resolve({ action: "generate_anyway" });
  }

  return (
    <>
      {analyzing && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-medium text-white shadow-lg animate-in fade-in slide-in-from-bottom-4">
          <Loader2 className="size-4 animate-spin" />
          Analyzing prompt...
        </div>
      )}
      <Dialog open={open} onOpenChange={(o) => !o && close()}>
        <DialogContent className="max-w-lg gap-0 p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <Sparkles className="size-4 text-black" />
            Prompt Coach
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 space-y-4 max-h-[60vh] overflow-y-auto pb-2">
          {/* Quality score */}
          <div className={`rounded-lg p-3 ${cfg.bg}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Prompt Quality</span>
              <span className={`text-sm font-semibold ${cfg.color}`}>
                {score ?? "—"} / 100 &nbsp;·&nbsp; {capLabel}
              </span>
            </div>
            <Progress
              value={score ?? 0}
              className="h-1.5 bg-muted"
            />
          </div>

          {/* Explanation */}
          <p className="text-sm text-muted-foreground">
            Your prompt is very broad. ScholarAI can generate better content if
            it understands what you&apos;re trying to learn.
          </p>

          {/* Suggested prompt textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Suggested prompt
            </label>
            <Textarea
              value={editedSuggestion}
              onChange={(e) => setEditedSuggestion(e.target.value)}
              className="min-h-[96px] text-sm resize-none"
            />
          </div>

          {/* Improvements */}
          {improvements.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Why it&apos;s better
              </p>
              <ul className="space-y-1">
                {improvements.map((imp) => (
                  <li key={imp} className="flex items-start gap-2 text-sm">
                    <Check className="size-3.5 mt-0.5 shrink-0 text-green-500" />
                    {imp}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Advanced accordion */}
          <Accordion type="single" collapsible>
            <AccordionItem value="advanced" className="border-0">
              <AccordionTrigger className="text-xs font-medium text-muted-foreground uppercase tracking-wide py-2 hover:no-underline">
                Advanced
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-1">
                <div className="space-y-1.5">
                  <p className="text-xs text-muted-foreground">Learning depth</p>
                  <div className="flex flex-wrap gap-1.5">
                    {DEPTH_OPTIONS.map((d) => (
                      <Toggle
                        key={d}
                        size="sm"
                        pressed={depth === d}
                        onPressedChange={() => setDepth(depth === d ? null : d)}
                        className="text-xs h-7 px-2.5"
                      >
                        {d}
                      </Toggle>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs text-muted-foreground">Output focus</p>
                  <div className="flex flex-wrap gap-1.5">
                    {FOCUS_OPTIONS.map((f) => (
                      <Toggle
                        key={f}
                        size="sm"
                        pressed={focus === f}
                        onPressedChange={() => setFocus(focus === f ? null : f)}
                        className="text-xs h-7 px-2.5"
                      >
                        {f}
                      </Toggle>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs text-muted-foreground">Artifact preferences</p>
                  <div className="flex flex-wrap gap-1.5">
                    {ARTIFACT_OPTIONS.map((a) => (
                      <Toggle
                        key={a}
                        size="sm"
                        pressed={artifacts.includes(a)}
                        onPressedChange={() => toggleArtifact(a)}
                        className="text-xs h-7 px-2.5"
                      >
                        {a}
                      </Toggle>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <DialogFooter className="px-6 py-4 border-t flex flex-col sm:flex-row items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground w-full sm:w-auto order-last sm:order-first"
            onClick={handleEdit}
          >
            Edit Myself
          </Button>
          <div className="flex gap-2 w-full sm:w-auto sm:ml-auto">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none"
              onClick={handleGenerateAnyway}
            >
              Generate Anyway
            </Button>
            <Button
              size="sm"
              className="flex-1 sm:flex-none bg-violet-600 hover:bg-violet-700"
              onClick={handleUseSuggested}
            >
              Use Suggested Prompt
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
