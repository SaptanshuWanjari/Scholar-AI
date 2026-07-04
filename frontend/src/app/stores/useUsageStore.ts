import { create } from "zustand";
import { usageApi, UsageSummary, UsageRecord, BudgetConfig } from "../lib/api/usage";

interface UsageState {
  summary: UsageSummary | null;
  records: UsageRecord[];
  budget: BudgetConfig | null;
  totalRecords: number;
  page: number;
  loading: boolean;

  fetchSummary: () => Promise<void>;
  fetchRecords: (page?: number, provider?: string) => Promise<void>;
  fetchBudget: () => Promise<void>;
  updateBudget: (monthly_usd: number, warn_at_pct: number) => Promise<void>;
}

export const useUsageStore = create<UsageState>((set) => ({
  summary: null,
  records: [],
  budget: null,
  totalRecords: 0,
  page: 1,
  loading: false,

  fetchSummary: async () => {
    try {
      const summary = await usageApi.summary();
      set({ summary });
    } catch {
      // non-fatal
    }
  },

  fetchRecords: async (page = 1, provider?: string) => {
    set({ loading: true });
    try {
      const data = await usageApi.records(page, 50, provider);
      set({ records: data.records, totalRecords: data.total, page, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchBudget: async () => {
    try {
      const budget = await usageApi.budget();
      set({ budget });
    } catch {
      // non-fatal
    }
  },

  updateBudget: async (monthly_usd, warn_at_pct) => {
    const budget = await usageApi.updateBudget(monthly_usd, warn_at_pct);
    set({ budget });
  },
}));
