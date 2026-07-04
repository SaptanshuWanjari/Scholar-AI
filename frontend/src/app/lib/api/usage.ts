import { request } from "./client";

export interface UsageSummary {
  today_usd: number;
  week_usd: number;
  month_usd: number;
  total_requests: number;
  total_tokens: number;
}

export interface UsageRecord {
  id: number;
  provider_id: string;
  task: string;
  model: string;
  input_tokens: number;
  output_tokens: number;
  cost_usd: number;
  created_at: string;
}

export interface UsageRecordsPage {
  records: UsageRecord[];
  total: number;
  page: number;
  limit: number;
}

export interface BudgetConfig {
  monthly_usd: number;
  warn_at_pct: number;
  current_month_usd: number;
}

export const usageApi = {
  summary(): Promise<UsageSummary> {
    return request<UsageSummary>("/api/usage/summary");
  },

  records(page = 1, limit = 50, provider?: string): Promise<UsageRecordsPage> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (provider) params.set("provider", provider);
    return request<UsageRecordsPage>(`/api/usage/records?${params}`);
  },

  budget(): Promise<BudgetConfig> {
    return request<BudgetConfig>("/api/usage/budget");
  },

  updateBudget(monthly_usd: number, warn_at_pct: number): Promise<BudgetConfig> {
    return request<BudgetConfig>("/api/usage/budget", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ monthly_usd, warn_at_pct }),
    });
  },
};
