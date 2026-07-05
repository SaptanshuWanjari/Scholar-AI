import React, { useEffect, useState } from "react";
import { Loader2, ChevronUp, ChevronDown } from "lucide-react";
import { GhostButton } from "@paper-ui/components/buttons";
import { PaperSelect, PaperInput } from "@paper-ui/components/inputs";
import { PaperSwitch } from "@paper-ui/components/inputs";
import { useRoutingStore } from "../../stores/useRoutingStore";
import { useProvidersStore } from "../../stores/useProvidersStore";
import type { SelectOption } from "@paper-ui/components/inputs";

const TASK_LABELS: Record<string, string> = {
  quick_qa: "Ask AI",
  flashcards: "Flashcards",
  quiz: "Quiz",
  mermaid: "Mermaid Diagram",
  mindmap: "Mind Map",
  study_notes: "Study Notes",
  deep_analysis: "Deep Analysis",
  differences: "Compare / Differences",
  learning_path: "Learning Path",
  data_qa: "Data Q&A",
  plantuml: "PlantUML Diagram",
};

const ALL_TASKS = Object.keys(TASK_LABELS);

// Provider-specific model ID hints shown as placeholder text
const MODEL_PLACEHOLDER: Record<string, string> = {
  ollama: "e.g. qwen3:8b",
  gemini: "e.g. gemini-2.5-flash",
  groq: "e.g. llama-3.3-70b-versatile",
  openrouter: "e.g. anthropic/claude-3-5-haiku",
  openai_compat: "e.g. llama-3.1-8b-instruct",
};

// Controlled text input that saves on blur or Enter; empty string → null (provider default)
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

export function ModelRoutingTab() {
  const { config, loading, fetchConfig, setMode, setTaskOverride, setFallbackChain, setEmbeddingProvider } =
    useRoutingStore();
  const { providers, fetchProviders } = useProvidersStore();

  useEffect(() => {
    fetchConfig();
    fetchProviders();
  }, [fetchConfig, fetchProviders]);

  if (loading || !config) {
    return (
      <div className="flex items-center justify-center py-12 text-ink-muted">
        <Loader2 size={20} className="animate-spin mr-2" />
        Loading routing config…
      </div>
    );
  }

  const connectedProviders = providers.filter((p) => p.connected || p.is_local);
  const providerOptions: SelectOption[] = connectedProviders.map((p) => ({
    value: p.provider_id,
    label: p.name,
  }));

  function moveFallback(idx: number, dir: -1 | 1) {
    const chain = [...config!.fallback_chain];
    const target = idx + dir;
    if (target < 0 || target >= chain.length) return;
    [chain[idx], chain[target]] = [chain[target], chain[idx]];
    setFallbackChain(chain);
  }

  return (
    <div className="flex flex-col gap-4 py-2">
      {/* Mode toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#e8e3d8] pb-4">
        <div>
          <div className="font-architect text-sm text-ink">Routing mode</div>
          <div className="font-kalam text-[13px] text-ink-muted">
            {config.mode === "auto"
              ? "Auto — routes by capability (vision → Gemini, fast → Groq, etc.)"
              : "Manual — you control which provider handles each task"}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm font-architect text-ink-muted">Auto</span>
          <PaperSwitch
            checked={config.mode === "manual"}
            onChange={(v) => setMode(v ? "manual" : "auto")}
          />
          <span className="text-sm font-architect text-ink">Manual</span>
        </div>
      </div>

      {/* Per-task overrides (manual mode) */}
      {config.mode === "manual" && (
        <div>
          <div className="font-architect text-sm text-ink-muted mb-2">Per-task routing</div>
          <div className="overflow-x-auto rounded-md border border-[#e8e3d8]">
            <div className="min-w-[520px]">
              {ALL_TASKS.map((task, i) => {
                const override = config.per_task[task] ?? { provider: "ollama", model: null };
                const isLast = i === ALL_TASKS.length - 1;
                return (
                  <div
                    key={task}
                    className={`flex items-center gap-2 px-3 py-2.5 ${!isLast ? "border-b border-[#e8e3d8]" : ""}`}
                  >
                    <span className="w-36 shrink-0 font-architect text-[14px] text-ink">
                      {TASK_LABELS[task]}
                    </span>
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
          <p className="mt-1.5 text-xs font-kalam text-ink-muted">
            Leave model blank to use the provider's default. Press Enter or click away to save.
          </p>
        </div>
      )}

      {/* Auto mode info */}
      {config.mode === "auto" && (
        <div className="rounded-md border border-[#e8e3d8] p-3 bg-ink/[0.02]">
          <div className="font-architect text-[13px] text-ink-muted mb-2">Capability rules (read-only)</div>
          <div className="space-y-1 text-sm font-kalam text-ink">
            <div>• Vision tasks → first connected provider with vision capability</div>
            <div>• Reasoning tasks → first provider with reasoning (Gemini preferred)</div>
            <div>• Embeddings → configured embedding provider (Settings → Embedding)</div>
            <div>• Everything else → first connected chat provider</div>
          </div>
        </div>
      )}

      {/* Fallback chain */}
      <div>
        <div className="font-architect text-sm text-ink-muted mb-2">Fallback chain</div>
        <div className="space-y-1">
          {config.fallback_chain.map((pid, idx) => {
            const p = providers.find((x) => x.provider_id === pid);
            return (
              <div key={pid} className="flex items-center gap-2 rounded border border-[#e8e3d8] px-3 py-2">
                <span className="text-xs font-mono text-ink-muted w-5">{idx + 1}.</span>
                <span className="flex-1 font-architect text-[14px] text-ink">{p?.name ?? pid}</span>
                <GhostButton
                  size="sm"
                  disabled={idx === 0}
                  onClick={() => moveFallback(idx, -1)}
                  aria-label="Move up"
                >
                  <ChevronUp size={13} />
                </GhostButton>
                <GhostButton
                  size="sm"
                  disabled={idx === config.fallback_chain.length - 1}
                  onClick={() => moveFallback(idx, 1)}
                  aria-label="Move down"
                >
                  <ChevronDown size={13} />
                </GhostButton>
              </div>
            );
          })}
        </div>
        <p className="mt-1.5 text-xs font-kalam text-ink-muted">
          If the primary provider fails or hits its budget, the next in the chain is tried.
        </p>
      </div>

      {/* Embedding provider */}
      <div className="border-t border-[#e8e3d8] pt-4">
        <div className="font-architect text-sm text-ink mb-0.5">Embedding provider</div>
        <div className="font-kalam text-[13px] text-ink-muted mb-3">
          Used for document ingestion and semantic search. Changing this requires re-ingesting your documents.
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="text-xs font-architect text-ink-muted mb-1 block">Provider</label>
            <PaperSelect
              value={config.embedding_provider ?? "ollama"}
              onChange={(v) => setEmbeddingProvider(v, null)}
              options={[
                { value: "ollama", label: "Ollama (Local)" },
                ...providers
                  .filter((p) => p.connected && p.capabilities.includes("embeddings"))
                  .map((p) => ({ value: p.provider_id, label: p.name })),
              ]}
            />
          </div>
          <div className="flex-1">
            <label className="text-xs font-architect text-ink-muted mb-1 block">Model ID</label>
            <ModelInput
              value={config.embedding_model}
              providerId={config.embedding_provider ?? "ollama"}
              onSave={(v) => setEmbeddingProvider(config.embedding_provider ?? "ollama", v)}
            />
          </div>
        </div>
        {config.embedding_provider !== "ollama" && (
          <p className="mt-2 text-xs font-kalam text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1.5">
            Cloud embeddings incur per-token costs on every document ingestion and search query.
            Re-ingest all documents after switching providers to rebuild the vector index.
          </p>
        )}
      </div>
    </div>
  );
}
