import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle2,
  WifiOff,
  Cloud,
  Sparkles,
  Zap,
  Globe,
  Cpu,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { PaperButton, GhostButton } from "@paper-ui/components/buttons";
import { PaperInput } from "@paper-ui/components/inputs";
import { PaperCard, PaperH2, PaperH3, PaperIconCircle } from "@paper-ui/core";
import { PaperBadge } from "@paper-ui/components/badges";
import { LoadingPaper } from "@paper-ui/components/feedback";
import { api, type HealthStatus } from "../../lib/api";
import { usePluginStore } from "../../plugins/usePluginStore";
import { useProvidersStore } from "../../stores/useProvidersStore";

type FormState = { apiKey: string; baseUrl: string; showKey: boolean };

const CLOUD_PROVIDERS = [
  {
    id: "gemini",
    name: "Google Gemini",
    desc: "Vision, reasoning, long context. Best for deep analysis.",
    Icon: Sparkles,
  },
  {
    id: "groq",
    name: "Groq",
    desc: "Extremely fast inference. Best for quick Q&A and flashcards.",
    Icon: Zap,
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    desc: "Access 100+ models from a single API key.",
    Icon: Globe,
  },
  {
    id: "openai_compat",
    name: "OpenAI-Compatible",
    desc: "LM Studio, vLLM, Together AI, Fireworks, and more.",
    Icon: Cpu,
  },
] as const;

export function OnboardingProviderPage() {
  const navigate = useNavigate();

  const { install, isEnabled, getInstallState } = usePluginStore();
  const { providers, connect, disconnect, fetchProviders, models, connectingId } =
    useProvidersStore();

  const [ollamaHealth, setOllamaHealth] = useState<HealthStatus | null>(null);
  const [healthLoading, setHealthLoading] = useState(true);
  const [formState, setFormState] = useState<Record<string, FormState>>({});
  const [connectErrors, setConnectErrors] = useState<Record<string, string>>(
    {},
  );

  const pluginInstalled = isEnabled("cloud-model-providers");
  const installState = getInstallState("cloud-model-providers");

  useEffect(() => {
    api
      .health()
      .then(setOllamaHealth)
      .catch(() => setOllamaHealth(null))
      .finally(() => setHealthLoading(false));
  }, []);

  useEffect(() => {
    if (pluginInstalled) {
      fetchProviders();
    }
  }, [pluginInstalled, fetchProviders]);

  const getForm = (id: string): FormState =>
    formState[id] ?? {
      apiKey: "",
      baseUrl: "http://localhost:1234/v1",
      showKey: false,
    };

  const updateForm = (id: string, patch: Partial<FormState>) =>
    setFormState((s) => ({ ...s, [id]: { ...getForm(id), ...patch } }));

  const handleInstall = async () => {
    await install("cloud-model-providers");
  };

  const handleConnect = async (providerId: string) => {
    const form = getForm(providerId);
    const apiKey = form.apiKey.trim();
    const baseUrl = form.baseUrl.trim() || "http://localhost:1234/v1";

    setConnectErrors((e) => {
      const n = { ...e };
      delete n[providerId];
      return n;
    });

    try {
      await connect(
        providerId,
        apiKey || "none",
        providerId === "openai_compat" ? baseUrl : undefined,
      );
      updateForm(providerId, { apiKey: "" });
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Connection failed. Check your API key.";
      setConnectErrors((e) => ({ ...e, [providerId]: msg }));
    }
  };

  const cloudProvider = (id: string) =>
    providers.find((p) => p.provider_id === id);
  const connectedCloud = providers.filter((p) => !p.is_local && p.connected);

  const primaryLabel =
    connectedCloud.length > 0
      ? `Continue with ${connectedCloud.length} provider${connectedCloud.length > 1 ? "s" : ""} →`
      : ollamaHealth?.ollama_reachable
        ? "Continue with Ollama →"
        : "Continue anyway →";

  const primaryTone: "dark" | "paper" =
    !ollamaHealth?.ollama_reachable && connectedCloud.length === 0
      ? "paper"
      : "dark";

  return (
    <div className="min-h-screen bg-[#f5f0e8] py-16 px-6">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <PaperH2>Choose your AI</PaperH2>
          <p className="mt-2 font-kalam text-sm text-ink-muted">
            Ollama runs locally by default. Optionally connect cloud providers
            for more powerful models.
          </p>
        </motion.div>

        {/* Ollama status card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <PaperCard shadow="sm" className="p-4">
            {healthLoading ? (
              <div className="flex items-center gap-3">
                <LoadingPaper variant="dots" size="sm" />
                <span className="font-kalam text-[13px] text-ink-muted">
                  Checking Ollama…
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <PaperIconCircle
                  tone={ollamaHealth?.ollama_reachable ? "sage" : "ochre"}
                  size={36}
                >
                  {ollamaHealth?.ollama_reachable ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <WifiOff size={16} />
                  )}
                </PaperIconCircle>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-architect text-ink">
                      Ollama (Local)
                    </span>
                    <PaperBadge
                      tone={ollamaHealth?.ollama_reachable ? "sage" : "ochre"}
                    >
                      {ollamaHealth?.ollama_reachable ? "● Running" : "Offline"}
                    </PaperBadge>
                  </div>
                  <p className="font-kalam text-[14px] text-ink-muted mt-0.5">
                    {ollamaHealth?.ollama_reachable
                      ? "Connected on localhost:11434 — private and offline-first"
                      : "Connect a cloud provider below, or start Ollama and come back"}
                  </p>
                </div>
              </div>
            )}
          </PaperCard>
        </motion.div>

        {/* Cloud providers section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {!pluginInstalled ? (
              <motion.div
                key="value-prop"
                exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}
              >
                <PaperCard
                  shadow="md"
                  className="p-6 flex flex-col items-center text-center gap-4"
                >
                  <PaperIconCircle tone="sky" size={48}>
                    <Cloud size={22} />
                  </PaperIconCircle>
                  <div>
                    <PaperH3>Unlock Cloud Models</PaperH3>
                    <p className="mt-2 font-kalam text-[14px] text-ink-muted max-w-sm">
                      Connect Gemini, Groq, or OpenRouter for more powerful
                      models. Your API keys are encrypted and stored locally —
                      never sent to ScholarAI.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <PaperBadge tone="lavender">Gemini Flash</PaperBadge>
                    <PaperBadge tone="sky">Llama 3.3 via Groq</PaperBadge>
                    <PaperBadge tone="sage">OpenRouter</PaperBadge>
                  </div>
                  <PaperButton
                    tone="dark"
                    onClick={handleInstall}
                    disabled={installState === "installing"}
                  >
                    {installState === "installing" ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Installing…
                      </>
                    ) : (
                      "Enable Cloud Providers"
                    )}
                  </PaperButton>
                </PaperCard>
              </motion.div>
            ) : (
              <motion.div
                key="providers"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-3"
              >
                <p className="font-kalam text-sm text-ink-muted">
                  Optional — connect one or more providers. You can skip this
                  and configure later in Settings.
                </p>
                {CLOUD_PROVIDERS.map(({ id, name, desc, Icon }, i) => {
                  const provider = cloudProvider(id);
                  const connected = provider?.connected ?? false;
                  const isConnecting = connectingId === id;
                  const form = getForm(id);
                  const modelCount = models[id]?.length ?? 0;
                  const error = connectErrors[id];

                  return (
                    <motion.div
                      key={id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.07 }}
                    >
                      <PaperCard shadow="sm" className="p-4 overflow-hidden">
                        <AnimatePresence mode="wait">
                          {connected ? (
                            <motion.div
                              key="connected"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="flex items-center gap-3 flex-wrap"
                            >
                              <PaperIconCircle
                                tone={modelCount > 0 ? "sage" : "ochre"}
                                size={32}
                              >
                                <CheckCircle2 size={20} />
                              </PaperIconCircle>
                              <span className="font-architect text-[15px] text-ink flex-1 min-w-0">
                                {name}
                              </span>
                              {modelCount > 0 ? (
                                <>
                                  <PaperBadge tone="sage">Connected</PaperBadge>
                                  <PaperBadge tone="sky">{modelCount} models</PaperBadge>
                                </>
                              ) : (
                                <PaperBadge tone="ochre">No models found</PaperBadge>
                              )}
                              <GhostButton size="sm" onClick={() => disconnect(id)}>
                                Disconnect
                              </GhostButton>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="form"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="flex flex-col gap-3"
                            >
                              {/* Provider header */}
                              <div className="flex items-center gap-3">
                                <PaperIconCircle tone="sky" size={36}>
                                  <Icon size={16} />
                                </PaperIconCircle>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-architect text-ink">
                                      {name}
                                    </span>
                                    <PaperBadge tone="sky">Cloud</PaperBadge>
                                  </div>
                                  <p className="font-kalam text-[15px] text-ink-muted">
                                    {desc}
                                  </p>
                                </div>
                              </div>

                              {/* Base URL input (openai_compat only) */}
                              {id === "openai_compat" && (
                                <PaperInput
                                  value={form.baseUrl}
                                  placeholder="http://localhost:1234/v1"
                                  onChange={(e) =>
                                    updateForm(id, { baseUrl: e.target.value })
                                  }
                                  disabled={isConnecting}
                                />
                              )}

                              {/* API key input + connect */}
                              <div className="flex gap-2 items-center">
                                <div className="flex-1 min-w-0">
                                  <PaperInput
                                    type={form.showKey ? "text" : "password"}
                                    value={form.apiKey}
                                    placeholder={
                                      id === "openai_compat"
                                        ? "API key (optional — leave blank for local servers)"
                                        : "API key"
                                    }
                                    onChange={(e) =>
                                      updateForm(id, { apiKey: e.target.value })
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") handleConnect(id);
                                    }}
                                    disabled={isConnecting}
                                    trailingIcon={
                                      <button
                                        type="button"
                                        onClick={() =>
                                          updateForm(id, {
                                            showKey: !form.showKey,
                                          })
                                        }
                                        aria-label="Toggle key visibility"
                                        className="focus:outline-none text-ink-muted hover:text-ink transition-colors flex items-center justify-center"
                                      >
                                        {form.showKey ? (
                                          <EyeOff size={16} />
                                        ) : (
                                          <Eye size={16} />
                                        )}
                                      </button>
                                    }
                                  />
                                </div>
                                <PaperButton
                                  tone="dark"
                                  onClick={() => handleConnect(id)}
                                  disabled={
                                    isConnecting ||
                                    (id !== "openai_compat" &&
                                      !form.apiKey.trim())
                                  }
                                >
                                  {isConnecting ? (
                                    <Loader2
                                      size={14}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    "Connect"
                                  )}
                                </PaperButton>
                              </div>

                              {error && (
                                <p className="font-kalam text-[12px] text-red-700">
                                  {error}
                                </p>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </PaperCard>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="border-t border-[#d4cfc2] pt-6 flex justify-between items-center"
        >
          <GhostButton size="sm" onClick={() => navigate("/onboarding/import")}>
            Skip for now →
          </GhostButton>
          <PaperButton
            tone={primaryTone}
            onClick={() => navigate("/onboarding/import")}
          >
            {primaryLabel}
          </PaperButton>
        </motion.div>
      </div>
    </div>
  );
}
