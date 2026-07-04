import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { PaperSelect, PaperInput } from "@paper-ui/components/inputs";
import { useRoutingStore } from "../../stores/useRoutingStore";
import { useProvidersStore } from "../../stores/useProvidersStore";
import type { SelectOption } from "@paper-ui/components/inputs";

const FEATURE_TASKS: { task: string; label: string; desc: string }[] = [
  { task: "quick_qa",      label: "Ask AI",         desc: "Quick Q&A in chat and document mode" },
  { task: "study_notes",   label: "Study Notes",     desc: "Notebook and note generation" },
  { task: "flashcards",    label: "Flashcards",      desc: "Flashcard generation from documents" },
  { task: "quiz",          label: "Quiz",            desc: "Quiz generation and evaluation" },
  { task: "deep_analysis", label: "Deep Analysis",   desc: "Teach Me and in-depth explanations" },
  { task: "mermaid",       label: "Diagrams",        desc: "Mermaid diagram generation" },
  { task: "mindmap",       label: "Mind Maps",       desc: "Mind map generation" },
  { task: "differences",   label: "Compare",         desc: "Difference / comparison tables" },
  { task: "learning_path", label: "Learning Path",   desc: "Personalized study sequences" },
  { task: "data_qa",       label: "Data Q&A",        desc: "Structured data extraction" },
];

const MODEL_PLACEHOLDER: Record<string, string> = {
  ollama: "e.g. qwen3:8b",
  gemini: "e.g. gemini-2.5-flash",
  groq: "e.g. llama-3.3-70b-versatile",
  openrouter: "e.g. anthropic/claude-3-5-haiku",
};

// Saves on blur or Enter; empty string → null (use provider default)
function ModelInput({
  value,
  providerId,
  onSave,
  className,
}: {
  value: string | null;
  providerId: string;
  onSave: (v: string | null) => void;
  className?: string;
}) {
  const [local, setLocal] = useState(value ?? "");

  useEffect(() => {
    setLocal(value ?? "");
  }, [value]);

  const save = () => onSave(local.trim() || null);

  return (
    <PaperInput
      value={local}
      placeholder={MODEL_PLACEHOLDER[providerId] ?? "Provider default"}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={save}
      onKeyDown={(e) => {
        if (e.key === "Enter") save();
      }}
      className={className}
    />
  );
}

export function ModelDefaultsTab() {
  const { config, loading, fetchConfig, setTaskOverride } = useRoutingStore();
  const { providers, fetchProviders } = useProvidersStore();

  useEffect(() => {
    fetchConfig();
    fetchProviders();
  }, [fetchConfig, fetchProviders]);

  if (loading || !config) {
    return (
      <div className="flex items-center justify-center py-8 text-ink-muted">
        <Loader2 size={18} className="animate-spin mr-2" />
        Loading defaults…
      </div>
    );
  }

  const connectedProviders = providers.filter((p) => p.connected || p.is_local);

  const providerOptions: SelectOption[] = connectedProviders.map((p) => ({
    value: p.provider_id,
    label: p.name,
  }));

  return (
    <div className="py-2">
      <p className="font-kalam text-[13px] text-ink-muted mb-3">
        Set the provider and model for each feature. These are used when routing mode is "manual".
        Leave model blank to use the provider's default.
      </p>
      <div className="overflow-x-auto rounded-md border border-[#e8e3d8]">
        <div className="min-w-[520px]">
          {FEATURE_TASKS.map(({ task, label, desc }, i) => {
            const override = config.per_task[task] ?? { provider: "ollama", model: null };
            const isLast = i === FEATURE_TASKS.length - 1;
            return (
              <div
                key={task}
                className={`flex items-center gap-2 px-3 py-3 ${!isLast ? "border-b border-[#e8e3d8]" : ""}`}
              >
                <div className="w-32 shrink-0 min-w-0">
                  <div className="font-architect text-[14px] text-ink">{label}</div>
                  <div className="font-kalam text-[11px] text-ink-muted truncate">{desc}</div>
                </div>
                <PaperSelect
                  value={override.provider}
                  onChange={(v) => setTaskOverride(task, { provider: v, model: null })}
                  options={providerOptions}
                  className="w-36 shrink-0"
                />
                <ModelInput
                  value={override.model}
                  providerId={override.provider}
                  onSave={(v) => setTaskOverride(task, { provider: override.provider, model: v })}
                  className="flex-1 min-w-0"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
