import { create } from "zustand";
import { providersApi, ProviderStatus, ProviderModel, HealthResponse, TestResponse } from "../lib/api/providers";

interface ProvidersState {
  providers: ProviderStatus[];
  models: Record<string, ProviderModel[]>;
  health: Record<string, HealthResponse>;
  testResults: Record<string, TestResponse>;
  loading: boolean;
  connectingId: string | null;

  fetchProviders: () => Promise<void>;
  fetchModels: (providerId: string) => Promise<void>;
  fetchHealth: (providerId: string) => Promise<void>;
  connect: (providerId: string, apiKey: string) => Promise<void>;
  disconnect: (providerId: string) => Promise<void>;
  testProvider: (providerId: string) => Promise<void>;
}

export const useProvidersStore = create<ProvidersState>((set, get) => ({
  providers: [],
  models: {},
  health: {},
  testResults: {},
  loading: false,
  connectingId: null,

  fetchProviders: async () => {
    set({ loading: true });
    try {
      const providers = await providersApi.list();
      set({ providers, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchModels: async (providerId) => {
    try {
      const models = await providersApi.listModels(providerId);
      set((state) => ({ models: { ...state.models, [providerId]: models } }));
    } catch {
      // non-fatal
    }
  },

  fetchHealth: async (providerId) => {
    try {
      const h = await providersApi.health(providerId);
      set((state) => ({ health: { ...state.health, [providerId]: h } }));
    } catch {
      // non-fatal
    }
  },

  connect: async (providerId, apiKey) => {
    set({ connectingId: providerId });
    try {
      await providersApi.connect(providerId, apiKey);
      await get().fetchProviders();
      await get().fetchModels(providerId);
    } finally {
      set({ connectingId: null });
    }
  },

  disconnect: async (providerId) => {
    await providersApi.disconnect(providerId);
    set((state) => ({
      providers: state.providers.map((p) =>
        p.provider_id === providerId ? { ...p, connected: false, enabled: false } : p
      ),
      models: { ...state.models, [providerId]: [] },
    }));
  },

  testProvider: async (providerId) => {
    const result = await providersApi.test(providerId);
    set((state) => ({ testResults: { ...state.testResults, [providerId]: result } }));
  },
}));
