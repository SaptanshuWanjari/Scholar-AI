import React, { useEffect, useState } from "react";
import { Loader2, DollarSign, Zap, Hash, TrendingUp } from "lucide-react";
import { PaperButton } from "@paper-ui/components/buttons";
import { PaperInput } from "@paper-ui/components/inputs";
import { PaperSlider } from "@paper-ui/components/inputs";
import { PaperBadge } from "@paper-ui/components/badges";
import { PaperCard } from "@paper-ui/core";
import { useUsageStore } from "../../stores/useUsageStore";

// Valid PaperButton tones: "dark" | "paper" | "green" | "red"
// Valid PaperBadge tones:  "sage" | "ochre" | "sky" | "lavender" | "brick" | "ink"

function CostCard({
  label,
  amount,
  icon: Icon,
}: {
  label: string;
  amount: number;
  icon: React.ElementType;
}) {
  return (
    <PaperCard className="p-3 flex-1 min-w-0">
      <div className="flex items-center gap-2 text-ink-muted mb-1">
        <Icon size={14} />
        <span className="text-xs font-architect truncate">{label}</span>
      </div>
      <div className="font-architect text-[20px] sm:text-[22px] text-ink">
        ${amount.toFixed(amount < 0.01 ? 4 : 2)}
      </div>
    </PaperCard>
  );
}

function BudgetBar({ current, limit }: { current: number; limit: number }) {
  if (!limit) return null;
  const pct = Math.min((current / limit) * 100, 100);
  const color =
    pct >= 90 ? "bg-red-400" : pct >= 70 ? "bg-amber-400" : "bg-emerald-400";
  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs font-kalam text-ink-muted mb-1">
        <span>${current.toFixed(4)} spent</span>
        <span>${limit.toFixed(2)} limit</span>
      </div>
      <div className="h-2 rounded-full bg-ink/10 overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// PaperBadge tones: sage=green, ochre=amber, sky=blue, ink=grey, brick=red
const PROVIDER_BADGE: Record<
  string,
  { tone: "sage" | "ochre" | "sky" | "lavender" | "brick" | "ink"; label: string }
> = {
  ollama:     { tone: "sage",     label: "Ollama" },
  gemini:     { tone: "sky",      label: "Gemini" },
  groq:       { tone: "ochre",    label: "Groq" },
  openrouter: { tone: "lavender", label: "OpenRouter" },
};

function ProviderBadge({ providerId }: { providerId: string }) {
  const meta = PROVIDER_BADGE[providerId] ?? { tone: "ink" as const, label: providerId };
  return <PaperBadge tone={meta.tone}>{meta.label}</PaperBadge>;
}

export function ModelUsageTab() {
  const {
    summary,
    records,
    budget,
    totalRecords,
    loading,
    fetchSummary,
    fetchRecords,
    fetchBudget,
    updateBudget,
  } = useUsageStore();

  const [budgetInput, setBudgetInput] = useState<string>("");
  const [warnPct, setWarnPct] = useState<number>(80);
  const [page, setPage] = useState(1);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSummary();
    fetchRecords(1);
    fetchBudget();
  }, [fetchSummary, fetchRecords, fetchBudget]);

  useEffect(() => {
    if (budget) {
      setBudgetInput(String(budget.monthly_usd));
      setWarnPct(budget.warn_at_pct);
    }
  }, [budget]);

  const handleSaveBudget = async () => {
    setSaving(true);
    await updateBudget(parseFloat(budgetInput) || 0, warnPct);
    setSaving(false);
  };

  const totalPages = Math.ceil(totalRecords / 50);

  return (
    <div className="flex flex-col gap-4 py-2">
      {/* Cost summary cards — wrap on small screens */}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        <CostCard label="Today" amount={summary?.today_usd ?? 0} icon={DollarSign} />
        <CostCard label="This Week" amount={summary?.week_usd ?? 0} icon={TrendingUp} />
        <CostCard label="This Month" amount={summary?.month_usd ?? 0} icon={Zap} />
      </div>

      {/* Stats row */}
      <div className="flex flex-wrap gap-3 sm:gap-4 text-sm font-kalam text-ink-muted">
        <span className="flex items-center gap-1">
          <Hash size={13} />
          {(summary?.total_requests ?? 0).toLocaleString()} requests
        </span>
        <span className="flex items-center gap-1">
          <Zap size={13} />
          {(summary?.total_tokens ?? 0).toLocaleString()} tokens
        </span>
        {summary && summary.total_requests > 0 && (
          <span>
            ${((summary.month_usd ?? 0) / Math.max(summary.total_requests, 1)).toFixed(4)} avg/request
          </span>
        )}
      </div>

      {/* Budget section */}
      <PaperCard className="p-4">
        <div className="font-architect text-[15px] text-ink mb-3">Monthly Budget</div>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
          <div className="flex-1 min-w-0">
            <label className="text-xs font-architect text-ink-muted mb-1 block">
              Limit (USD)
            </label>
            <PaperInput
              type="number"
              min={0}
              step={0.5}
              placeholder="0 = no limit"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
            />
          </div>
          <div className="flex-1 min-w-0">
            <label className="text-xs font-architect text-ink-muted mb-1 block">
              Warn at {warnPct}%
            </label>
            <PaperSlider
              value={warnPct}
              onChange={setWarnPct}
              min={50}
              max={100}
              step={5}
            />
          </div>
          <PaperButton
            tone="dark"
            size="sm"
            onClick={handleSaveBudget}
            disabled={saving}
            className="flex items-center gap-1.5 self-start sm:self-auto shrink-0"
          >
            {saving && <Loader2 size={13} className="animate-spin" />}
            Save
          </PaperButton>
        </div>
        {budget && budget.monthly_usd > 0 && (
          <BudgetBar current={budget.current_month_usd} limit={budget.monthly_usd} />
        )}
      </PaperCard>

      {/* Usage log — scrollable table */}
      <div>
        <div className="font-architect text-[13px] text-ink-muted mb-2">Usage Log</div>
        {loading ? (
          <div className="flex justify-center py-6 text-ink-muted">
            <Loader2 size={18} className="animate-spin" />
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-8 text-sm font-kalam text-ink-muted">
            No usage records yet. Cloud model calls are recorded after each request.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-md border border-[#e8e3d8]">
              <table className="w-full text-sm min-w-[480px]">
                <thead>
                  <tr className="bg-ink/[0.02] border-b border-[#e8e3d8]">
                    <th className="text-left px-3 py-2 font-architect text-xs text-ink-muted">Provider</th>
                    <th className="text-left px-3 py-2 font-architect text-xs text-ink-muted">Task</th>
                    <th className="text-left px-3 py-2 font-architect text-xs text-ink-muted hidden sm:table-cell">Model</th>
                    <th className="text-right px-3 py-2 font-architect text-xs text-ink-muted">Tokens</th>
                    <th className="text-right px-3 py-2 font-architect text-xs text-ink-muted">Cost</th>
                    <th className="text-right px-3 py-2 font-architect text-xs text-ink-muted hidden sm:table-cell">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r, i) => (
                    <tr
                      key={r.id}
                      className={i < records.length - 1 ? "border-b border-[#e8e3d8]" : ""}
                    >
                      <td className="px-3 py-2">
                        <ProviderBadge providerId={r.provider_id} />
                      </td>
                      <td className="px-3 py-2 font-kalam text-ink text-xs">{r.task}</td>
                      <td className="px-3 py-2 font-mono text-ink-muted text-xs hidden sm:table-cell">
                        {r.model}
                      </td>
                      <td className="px-3 py-2 text-right font-mono text-xs text-ink">
                        {(r.input_tokens + r.output_tokens).toLocaleString()}
                      </td>
                      <td className="px-3 py-2 text-right font-mono text-xs text-ink">
                        ${r.cost_usd.toFixed(4)}
                      </td>
                      <td className="px-3 py-2 text-right font-kalam text-xs text-ink-muted hidden sm:table-cell">
                        {new Date(r.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs font-kalam text-ink-muted">
                  Page {page} of {totalPages} · {totalRecords} records
                </span>
                <div className="flex gap-2">
                  <PaperButton
                    tone="paper"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => {
                      setPage(page - 1);
                      fetchRecords(page - 1);
                    }}
                  >
                    Prev
                  </PaperButton>
                  <PaperButton
                    tone="paper"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => {
                      setPage(page + 1);
                      fetchRecords(page + 1);
                    }}
                  >
                    Next
                  </PaperButton>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
