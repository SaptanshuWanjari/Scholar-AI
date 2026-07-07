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
  openai_compat: "e.g. llama-3.1-8b-instruct",
};

// Model dropdown selector wrapper
function ModelSelectInput({
  value,
  providerId,
  onSave,
  className,
  models,
}: {
  value: string | null;
  providerId: string;
  onSave: (v: string | null) => void;
  className?: string;
  models: Record<string, any[]>;
}) {
  const providerModels = models[providerId] ?? [];
  const options = [
    { value: "", label: "Provider default" },
    ...providerModels.map((m) => ({
      value: m.id,
      label: m.label,
      icon: m.is_recommended ? <span className="text-amber-500 text-xs shrink-0">★</span> : undefined,
    })),
  ];

  return (
    <PaperSelect
      value={value ?? ""}
      onChange={(v) => onSave(v || null)}
      options={options}
      placeholder="Select model…"
      searchable={true}
      className={className}
    />
  );
}

export function ModelDefaultsTab() {
  const { config, loading, fetchConfig, setTaskOverride } = useRoutingStore();
  const { providers, fetchProviders, fetchModels, models } = useProvidersStore();

  useEffect(() => {
    fetchConfig();
    fetchProviders().then(() => {
      const state = useProvidersStore.getState();
      state.providers
        .filter((p) => p.connected || p.is_local)
        .forEach((p) => state.fetchModels(p.provider_id));
    });
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
                <ModelSelectInput
                  value={override.model}
                  providerId={override.provider}
                  onSave={(v) => setTaskOverride(task, { provider: override.provider, model: v })}
                  className="flex-1 min-w-0"
                  models={models}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
