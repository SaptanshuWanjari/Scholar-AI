import { request } from "./client";

export interface PerTaskOverride {
  provider: string;
  model: string | null;
}

export interface BudgetConfig {
  monthly_usd: number;
  warn_at_pct: number;
}

export interface RoutingConfig {
  mode: "manual" | "auto";
  per_task: Record<string, PerTaskOverride>;
  fallback_chain: string[];
  budget: BudgetConfig;
  embedding_provider: string;
  embedding_model: string | null;
}

export const routingApi = {
  get(): Promise<RoutingConfig> {
    return request<RoutingConfig>("/api/routing");
  },

  update(config: RoutingConfig): Promise<RoutingConfig> {
    return request<RoutingConfig>("/api/routing", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
  },
};
