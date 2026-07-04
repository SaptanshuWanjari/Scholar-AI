import { create } from "zustand";
import { routingApi, RoutingConfig, PerTaskOverride } from "../lib/api/routing";

interface RoutingState {
  config: RoutingConfig | null;
  loading: boolean;
  saving: boolean;

  fetchConfig: () => Promise<void>;
  setMode: (mode: "manual" | "auto") => Promise<void>;
  setTaskOverride: (task: string, override: PerTaskOverride) => Promise<void>;
  setFallbackChain: (chain: string[]) => Promise<void>;
  setBudget: (monthly_usd: number, warn_at_pct: number) => Promise<void>;
  setEmbeddingProvider: (provider: string, model: string | null) => Promise<void>;
}

const _DEFAULT_CONFIG: RoutingConfig = {
  mode: "manual",
  per_task: {},
  fallback_chain: ["ollama"],
  budget: { monthly_usd: 0, warn_at_pct: 80 },
  embedding_provider: "ollama",
  embedding_model: null,
};

export const useRoutingStore = create<RoutingState>((set, get) => ({
  config: null,
  loading: false,
  saving: false,

  fetchConfig: async () => {
    set({ loading: true });
    try {
      const config = await routingApi.get();
      set({ config, loading: false });
    } catch {
      set({ config: _DEFAULT_CONFIG, loading: false });
    }
  },

  setMode: async (mode) => {
    const config = get().config ?? _DEFAULT_CONFIG;
    const updated = await routingApi.update({ ...config, mode });
    set({ config: updated });
  },

  setTaskOverride: async (task, override) => {
    const config = get().config ?? _DEFAULT_CONFIG;
    const updated = await routingApi.update({
      ...config,
      per_task: { ...config.per_task, [task]: override },
    });
    set({ config: updated });
  },

  setFallbackChain: async (chain) => {
    const config = get().config ?? _DEFAULT_CONFIG;
    const updated = await routingApi.update({ ...config, fallback_chain: chain });
    set({ config: updated });
  },

  setBudget: async (monthly_usd, warn_at_pct) => {
    const config = get().config ?? _DEFAULT_CONFIG;
    const updated = await routingApi.update({
      ...config,
      budget: { monthly_usd, warn_at_pct },
    });
    set({ config: updated });
  },

  setEmbeddingProvider: async (provider, model) => {
    const config = get().config ?? _DEFAULT_CONFIG;
    const updated = await routingApi.update({
      ...config,
      embedding_provider: provider,
      embedding_model: model,
    });
    set({ config: updated });
  },
}));
