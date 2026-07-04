import React, { useEffect } from "react";
import { CheckCircle, XCircle, Loader2, Wifi, WifiOff, TestTube2, AlertTriangle } from "lucide-react";
import { PaperButton, GhostButton } from "@paper-ui/components/buttons";
import { PaperInput } from "@paper-ui/components/inputs";
import { PaperBadge } from "@paper-ui/components/badges";
import { PaperCard } from "@paper-ui/core";
import { useProvidersStore } from "../../stores/useProvidersStore";
import type { ProviderStatus, TestResponse } from "../../lib/api/providers";

const PROVIDER_LABELS: Record<string, string> = {
  ollama: "Ollama (Local)",
  gemini: "Google Gemini",
  groq: "Groq",
  openrouter: "OpenRouter",
  openai_compat: "OpenAI-Compatible API",
};

const PROVIDER_DESCRIPTIONS: Record<string, string> = {
  ollama: "Local models running on your machine. Always available, fully private.",
  gemini: "Google's Gemini models — excellent for vision, reasoning, and long-context tasks.",
  groq: "Ultra-fast inference for open-source models (Llama, Mixtral).",
  openrouter: "Unified API for 100+ cloud models from Anthropic, Google, Meta, and more.",
  openai_compat: "Any server that speaks the OpenAI REST spec: LM Studio, vLLM, Together AI, Fireworks, Anyscale, and more.",
};

// ── Badge tones: "sage" | "ochre" | "sky" | "lavender" | "brick" | "ink"
// ── Button tones: "dark" | "paper" | "green" | "red"

function StatusBadge({ connected, isLocal }: { connected: boolean; isLocal: boolean }) {
  if (isLocal) return <PaperBadge tone="sage">● Local</PaperBadge>;
  return connected
    ? <PaperBadge tone="sage">Connected</PaperBadge>
    : <PaperBadge tone="ink">Not Connected</PaperBadge>;
}

function HealthDot({ status }: { status?: "online" | "slow" | "offline" }) {
  if (!status) return null;
  const color = status === "online" ? "text-emerald-500" : status === "slow" ? "text-amber-500" : "text-red-400";
  return <span className={`text-xs font-architect ${color}`}>{status}</span>;
}

function CapabilityBadges({ capabilities }: { capabilities: string[] }) {
  const LABELS: Record<string, string> = {
    chat: "Chat", streaming: "Stream", vision: "Vision",
    embeddings: "Embed", json: "JSON", tools: "Tools", reasoning: "Reasoning",
  };
  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {capabilities.map((cap) => (
        <PaperBadge key={cap} tone="sky" className="text-xs">
          {LABELS[cap] ?? cap}
        </PaperBadge>
      ))}
    </div>
  );
}

function TestResultBanner({ result }: { result: TestResponse }) {
  if (result.success) {
    const streamingStatus = result.streaming ? "✓" : "✗";
    return (
      <div className="mt-2 rounded-md bg-emerald-50 border border-emerald-200 px-3 py-2 text-sm text-emerald-700 flex items-center gap-2">
        <CheckCircle size={14} className="shrink-0" />
        <span>{result.latency_ms}ms · {result.model_count} models · streaming {streamingStatus}</span>
      </div>
    );
  }
  return (
    <div className="mt-2 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700 flex items-center gap-2">
      <XCircle size={14} className="shrink-0" />
      <span>{result.error ?? "Test failed"}</span>
    </div>
  );
}

function OllamaOfflineBanner() {
  return (
    <div className="mt-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2.5 flex items-start gap-2 text-sm text-amber-800">
      <AlertTriangle size={15} className="shrink-0 mt-0.5" />
      <div>
        <span className="font-architect">Ollama is not running.</span>{" "}
        <span className="font-kalam">
          Start it with <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-xs">ollama serve</code> in a terminal, then refresh.
        </span>
      </div>
    </div>
  );
}

function OllamaCard({
  provider,
  health,
}: {
  provider: ProviderStatus;
  health?: { status: string; latency_ms: number };
}) {
  const { fetchModels, models, testProvider, testResults, fetchHealth } = useProvidersStore();
  const testResult = testResults["ollama"];
  const ollamaModels = models["ollama"] ?? [];
  const isOffline = health?.status === "offline";

  useEffect(() => {
    fetchModels("ollama");
    fetchHealth("ollama");
  }, [fetchModels, fetchHealth]);

  return (
    <PaperCard className="p-4">
      {/* Header row — stacks on small screens */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-architect text-[16px] text-ink">{PROVIDER_LABELS.ollama}</span>
            <StatusBadge connected={!isOffline} isLocal={true} />
            {health && <HealthDot status={health.status as "online" | "slow" | "offline"} />}
          </div>
          <p className="font-kalam text-[13px] text-ink-muted mt-0.5">{PROVIDER_DESCRIPTIONS.ollama}</p>
        </div>
        <PaperButton
          tone="paper"
          size="sm"
          onClick={() => testProvider("ollama")}
          className="flex items-center gap-1.5 self-start shrink-0"
        >
          <TestTube2 size={13} />
          Test
        </PaperButton>
      </div>

      <CapabilityBadges capabilities={provider.capabilities} />

      {isOffline && <OllamaOfflineBanner />}

      {!isOffline && ollamaModels.length === 0 && (
        <div className="mt-2 rounded-md border border-[#e8e3d8] bg-ink/[0.02] px-3 py-2 text-sm font-kalam text-ink-muted">
          No models loaded yet. Pull one with{" "}
          <code className="rounded bg-ink/5 px-1 py-0.5 font-mono text-xs">ollama pull qwen3:8b</code>.
        </div>
      )}

      {!isOffline && ollamaModels.length > 0 && (
        <div className="mt-3">
          <div className="text-xs font-architect text-ink-muted mb-1">
            Running models ({ollamaModels.length})
          </div>
          <div className="flex flex-wrap gap-1">
            {ollamaModels.map((m) => (
              <span
                key={m.id}
                className="rounded px-2 py-0.5 text-xs font-mono bg-ink/5 text-ink"
              >
                {m.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {testResult && <TestResultBanner result={testResult} />}
    </PaperCard>
  );
}

function CloudProviderCard({ provider }: { provider: ProviderStatus }) {
  const { connect, disconnect, connectingId, fetchModels, models, testProvider, testResults, health, fetchHealth } =
    useProvidersStore();
  const [apiKey, setApiKey] = React.useState("");
  const [showKey, setShowKey] = React.useState(false);
  const isConnecting = connectingId === provider.provider_id;
  const providerModels = models[provider.provider_id] ?? [];
  const testResult = testResults[provider.provider_id];
  const providerHealth = health[provider.provider_id];

  useEffect(() => {
    if (provider.connected) {
      fetchModels(provider.provider_id);
      fetchHealth(provider.provider_id);
    }
  }, [provider.connected, provider.provider_id, fetchModels, fetchHealth]);

  const handleConnect = async () => {
    if (!apiKey.trim()) return;
    await connect(provider.provider_id, apiKey.trim());
    setApiKey("");
  };

  return (
    <PaperCard className="p-4">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-architect text-[16px] text-ink">
              {PROVIDER_LABELS[provider.provider_id] ?? provider.name}
            </span>
            <StatusBadge connected={provider.connected} isLocal={false} />
            {provider.connected && providerHealth && (
              <HealthDot status={providerHealth.status as "online" | "slow" | "offline"} />
            )}
          </div>
          <p className="font-kalam text-[13px] text-ink-muted mt-0.5">
            {PROVIDER_DESCRIPTIONS[provider.provider_id] ?? provider.description}
          </p>
        </div>

        {provider.connected && (
          <div className="flex gap-2 shrink-0 self-start">
            <PaperButton
              tone="paper"
              size="sm"
              onClick={() => testProvider(provider.provider_id)}
              className="flex items-center gap-1.5"
            >
              <TestTube2 size={13} />
              Test
            </PaperButton>
            <PaperButton
              tone="red"
              size="sm"
              onClick={() => disconnect(provider.provider_id)}
              className="flex items-center gap-1.5"
            >
              <WifiOff size={13} />
              Disconnect
            </PaperButton>
          </div>
        )}
      </div>

      <CapabilityBadges capabilities={provider.capabilities} />

      {/* API key input — shown when not connected */}
      {!provider.connected && (
        <div className="mt-3 flex flex-col sm:flex-row gap-2 sm:items-end">
          <div className="flex-1">
            <PaperInput
              type={showKey ? "text" : "password"}
              placeholder="Paste API key…"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleConnect()}
              trailingIcon={
                <GhostButton
                  size="sm"
                  border={null}
                  onClick={() => setShowKey(!showKey)}
                  className="!min-h-0 !py-0 !px-1 text-xs font-kalam text-ink-muted hover:text-ink"
                >
                  {showKey ? "Hide" : "Show"}
                </GhostButton>
              }
            />
          </div>
          <PaperButton
            tone="dark"
            size="sm"
            disabled={!apiKey.trim() || isConnecting}
            onClick={handleConnect}
            className="flex items-center gap-1.5 self-start sm:self-auto"
          >
            {isConnecting ? <Loader2 size={13} className="animate-spin" /> : <Wifi size={13} />}
            Connect
          </PaperButton>
        </div>
      )}

      {/* Connected: show available models */}
      {provider.connected && providerModels.length > 0 && (
        <div className="mt-3">
          <div className="text-xs font-architect text-ink-muted mb-1">
            Available models ({providerModels.length})
          </div>
          <div className="flex flex-wrap gap-1">
            {providerModels.slice(0, 8).map((m) => (
              <span
                key={m.id}
                className="rounded px-2 py-0.5 text-xs font-mono bg-ink/5 text-ink"
              >
                {m.is_recommended ? "★ " : ""}
                {m.label}
              </span>
            ))}
            {providerModels.length > 8 && (
              <span className="text-xs text-ink-muted self-center">
                +{providerModels.length - 8} more
              </span>
            )}
          </div>
        </div>
      )}

      {testResult && <TestResultBanner result={testResult} />}
    </PaperCard>
  );
}

function OpenAICompatCard({ provider }: { provider: ProviderStatus }) {
  const { connect, disconnect, connectingId, fetchModels, models, testProvider, testResults, health, fetchHealth } =
    useProvidersStore();
  const [apiKey, setApiKey] = React.useState("");
  const [baseUrl, setBaseUrl] = React.useState(provider.base_url ?? "http://localhost:1234/v1");
  const [showKey, setShowKey] = React.useState(false);
  const isConnecting = connectingId === provider.provider_id;
  const providerModels = models[provider.provider_id] ?? [];
  const testResult = testResults[provider.provider_id];
  const providerHealth = health[provider.provider_id];

  React.useEffect(() => {
    if (provider.connected) {
      fetchModels(provider.provider_id);
      fetchHealth(provider.provider_id);
    }
  }, [provider.connected, provider.provider_id, fetchModels, fetchHealth]);

  const handleConnect = async () => {
    if (!baseUrl.trim()) return;
    await connect(provider.provider_id, apiKey.trim() || "none", baseUrl.trim());
    setApiKey("");
  };

  return (
    <PaperCard className="p-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-architect text-[16px] text-ink">
              {PROVIDER_LABELS[provider.provider_id]}
            </span>
            <StatusBadge connected={provider.connected} isLocal={false} />
            {provider.connected && providerHealth && (
              <HealthDot status={providerHealth.status as "online" | "slow" | "offline"} />
            )}
          </div>
          <p className="font-kalam text-[13px] text-ink-muted mt-0.5">
            {PROVIDER_DESCRIPTIONS[provider.provider_id]}
          </p>
        </div>

        {provider.connected && (
          <div className="flex gap-2 shrink-0 self-start">
            <PaperButton
              tone="paper"
              size="sm"
              onClick={() => testProvider(provider.provider_id)}
              className="flex items-center gap-1.5"
            >
              <TestTube2 size={13} />
              Test
            </PaperButton>
            <PaperButton
              tone="red"
              size="sm"
              onClick={() => disconnect(provider.provider_id)}
              className="flex items-center gap-1.5"
            >
              <WifiOff size={13} />
              Disconnect
            </PaperButton>
          </div>
        )}
      </div>

      <CapabilityBadges capabilities={provider.capabilities} />

      {!provider.connected && (
        <div className="mt-3 flex flex-col gap-2">
          <div>
            <label className="text-xs font-architect text-ink-muted mb-1 block">Base URL</label>
            <PaperInput
              type="url"
              placeholder="http://localhost:1234/v1"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
            <div className="flex-1">
              <label className="text-xs font-architect text-ink-muted mb-1 block">
                API Key <span className="font-kalam text-ink-muted">(leave blank if not required)</span>
              </label>
              <PaperInput
                type={showKey ? "text" : "password"}
                placeholder="Optional — leave blank for local servers"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleConnect()}
                trailingIcon={
                  <GhostButton
                    size="sm"
                    border={null}
                    onClick={() => setShowKey(!showKey)}
                    className="!min-h-0 !py-0 !px-1 text-xs font-kalam text-ink-muted hover:text-ink"
                  >
                    {showKey ? "Hide" : "Show"}
                  </GhostButton>
                }
              />
            </div>
            <PaperButton
              tone="dark"
              size="sm"
              disabled={!baseUrl.trim() || isConnecting}
              onClick={handleConnect}
              className="flex items-center gap-1.5 self-start sm:self-auto"
            >
              {isConnecting ? <Loader2 size={13} className="animate-spin" /> : <Wifi size={13} />}
              Connect
            </PaperButton>
          </div>
        </div>
      )}

      {provider.connected && (
        <div className="mt-2 rounded-md border border-[#e8e3d8] bg-ink/[0.02] px-3 py-2 text-sm font-kalam text-ink-muted">
          Endpoint: <code className="font-mono text-xs text-ink">{provider.base_url}</code>
        </div>
      )}

      {provider.connected && providerModels.length > 0 && (
        <div className="mt-3">
          <div className="text-xs font-architect text-ink-muted mb-1">
            Available models ({providerModels.length})
          </div>
          <div className="flex flex-wrap gap-1">
            {providerModels.slice(0, 8).map((m) => (
              <span key={m.id} className="rounded px-2 py-0.5 text-xs font-mono bg-ink/5 text-ink">
                {m.label}
              </span>
            ))}
            {providerModels.length > 8 && (
              <span className="text-xs text-ink-muted self-center">+{providerModels.length - 8} more</span>
            )}
          </div>
        </div>
      )}

      {testResult && <TestResultBanner result={testResult} />}
    </PaperCard>
  );
}

export function ModelProvidersTab() {
  const { providers, loading, fetchProviders, fetchHealth, health } = useProvidersStore();

  useEffect(() => {
    fetchProviders();
    // Poll health every 60 s for connected providers
    const timer = setInterval(() => {
      providers.filter((p) => p.connected || p.is_local).forEach((p) => fetchHealth(p.provider_id));
    }, 60_000);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchProviders, providers.length]);

  if (loading && providers.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-ink-muted">
        <Loader2 size={20} className="animate-spin mr-2" />
        Loading providers…
      </div>
    );
  }

  const ollama = providers.find((p) => p.provider_id === "ollama");
  const cloud = providers.filter((p) => p.provider_id !== "ollama");

  return (
    <div className="flex flex-col gap-3 py-2">
      {ollama && <OllamaCard provider={ollama} health={health["ollama"]} />}
      {cloud.map((p) =>
        p.provider_id === "openai_compat" ? (
          <OpenAICompatCard key={p.provider_id} provider={p} />
        ) : (
          <CloudProviderCard key={p.provider_id} provider={p} />
        )
      )}
    </div>
  );
}
