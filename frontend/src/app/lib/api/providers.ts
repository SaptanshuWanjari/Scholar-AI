import { request } from "./client";

export interface ProviderStatus {
  provider_id: string;
  name: string;
  description: string;
  is_local: boolean;
  connected: boolean;
  enabled: boolean;
  default_model: string | null;
  capabilities: string[];
  base_url: string | null;
}

export interface ProviderModel {
  id: string;
  label: string;
  context_length: number;
  capabilities: string[];
  input_cost_per_mtok: number;
  output_cost_per_mtok: number;
  is_recommended: boolean;
  tags: string[];
}

export interface HealthResponse {
  status: "online" | "slow" | "offline";
  latency_ms: number;
}

export interface TestResponse {
  success: boolean;
  latency_ms: number;
  model_count: number;
  streaming: boolean;
  error?: string;
}

export const providersApi = {
  list(): Promise<ProviderStatus[]> {
    return request<ProviderStatus[]>("/api/providers");
  },

  connect(providerId: string, apiKey: string, baseUrl?: string): Promise<{ connected: boolean; model_count: number }> {
    return request(`/api/providers/${providerId}/connect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: apiKey, base_url: baseUrl ?? null }),
    });
  },

  disconnect(providerId: string): Promise<{ disconnected: boolean }> {
    return request(`/api/providers/${providerId}/disconnect`, { method: "DELETE" });
  },

  listModels(providerId: string): Promise<ProviderModel[]> {
    return request<ProviderModel[]>(`/api/providers/${providerId}/models`);
  },

  test(providerId: string): Promise<TestResponse> {
    return request<TestResponse>(`/api/providers/${providerId}/test`, { method: "POST" });
  },

  health(providerId: string): Promise<HealthResponse> {
    return request<HealthResponse>(`/api/providers/${providerId}/health`);
  },
};
