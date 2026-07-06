import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Settings2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import { useSettingsStore } from "../stores/useSettingsStore";
import { PaperSheetBorder } from "@paper-ui/core";
import { PaperSwitch } from "@paper-ui/components/inputs";
import { PaperRadioGroup } from "@paper-ui/components/inputs";
import { cn } from "@/paper-ui/utils";

const RETRIEVAL_OPTIONS = [
  { label: "Fast", topK: 3 },
  { label: "Balanced", topK: 5 },
  { label: "Deep", topK: 10 },
] as const;

const CREATIVITY_OPTIONS = [
  { label: "Precise", temp: 0.1 },
  { label: "Balanced", temp: 0.4 },
  { label: "Creative", temp: 0.8 },
] as const;

function resolveRetrievalLabel(topK: number): string {
  if (topK <= 3) return "Fast";
  if (topK <= 5) return "Balanced";
  return "Deep";
}

function resolveCreativityLabel(temp: number): string {
  if (temp <= 0.15) return "Precise";
  if (temp <= 0.55) return "Balanced";
  return "Creative";
}

export function QuickSettingsPanel() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const ragMode = useSettingsStore((s) => s.ragMode);
  const usePromptEnhancer = useSettingsStore((s) => s.usePromptEnhancer);
  const topK = useSettingsStore((s) => s.topK);
  const temperature = useSettingsStore((s) => s.temperature);
  const set = useSettingsStore((s) => s.set);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const retrievalLabel = resolveRetrievalLabel(topK);
  const creativityLabel = resolveCreativityLabel(temperature);

  return createPortal(
    <div
      ref={containerRef}
      className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex items-center"
    >
      {/* Panel */}
      <div
        className={cn(
          "relative transition-all duration-200 ease-out origin-right",
          open
            ? "opacity-100 translate-x-0 pointer-events-auto"
            : "opacity-0 translate-x-3 pointer-events-none"
        )}
        style={{ width: 256 }}
      >
        <PaperSheetBorder
          fill="#fffdf9"
          stroke="#c0b9ae"
          strokeWidth={1.2}
          shadow={8}
        />
        <div className="relative z-[1] px-4 py-4 space-y-4">
          {/* Knowledge Source */}
          <div>
            <p className="font-architect text-[10px] uppercase tracking-widest text-ink-muted mb-2.5">
              Knowledge Source
            </p>
            <PaperRadioGroup
              value={ragMode}
              onChange={(v) => set("ragMode", v as "strict" | "fallback")}
              options={[
                { value: "strict", label: "Strict Document Only" },
                { value: "fallback", label: "Document + General Knowledge" },
              ]}
            />
          </div>

          {/* Prompt Enhancer */}
          <div className="flex items-center justify-between">
            <p className="font-architect text-[10px] uppercase tracking-widest text-ink-muted">
              Prompt Enhancer
            </p>
            <PaperSwitch
              checked={usePromptEnhancer}
              onChange={(v) => set("usePromptEnhancer", v)}
            />
          </div>

          {/* Retrieval Depth */}
          <div>
            <p className="font-architect text-[10px] uppercase tracking-widest text-ink-muted mb-2">
              Retrieval Depth
            </p>
            <div className="grid grid-cols-3 gap-1">
              {RETRIEVAL_OPTIONS.map(({ label, topK: k }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => set("topK", k)}
                  className={cn(
                    "py-1.5 font-architect text-[12px] rounded transition-colors",
                    retrievalLabel === label
                      ? "bg-ink text-[#fffdf9]"
                      : "bg-black/[0.04] text-ink-muted hover:bg-black/[0.07] hover:text-ink"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Creativity */}
          <div>
            <p className="font-architect text-[10px] uppercase tracking-widest text-ink-muted mb-2">
              Creativity
            </p>
            <div className="grid grid-cols-3 gap-1">
              {CREATIVITY_OPTIONS.map(({ label, temp }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => set("temperature", temp)}
                  className={cn(
                    "py-1.5 font-architect text-[12px] rounded transition-colors",
                    creativityLabel === label
                      ? "bg-ink text-[#fffdf9]"
                      : "bg-black/[0.04] text-ink-muted hover:bg-black/[0.07] hover:text-ink"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <button
            type="button"
            onClick={() => {
              navigate("/settings");
              setOpen(false);
            }}
            className="flex items-center gap-1.5 font-kalam text-[13px] text-ink-muted hover:text-ink transition-colors"
          >
            <Settings2 className="size-3.5" />
            View all settings
            <ArrowRight className="size-3" />
          </button>
        </div>
      </div>

      {/* Trigger tab */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Quick settings"
        aria-expanded={open}
        className={cn(
          "relative flex items-center justify-center w-5 h-14 rounded-l-md transition-colors flex-shrink-0",
          open
            ? "bg-ink text-[#fffdf9]"
            : "bg-background border border-r-0 border-border text-ink-muted hover:text-ink hover:bg-black/[0.04]"
        )}
      >
        <Settings2 className="size-3.5" />
      </button>
    </div>,
    document.body
  );
}
