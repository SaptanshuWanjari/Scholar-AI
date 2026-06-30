import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/paper-ui/utils";
import { PaperCard } from "@/paper-ui/core";
import { SectionLabel } from "@/paper-ui/core";
import { PaperIconCircle, type IconTone } from "@/paper-ui/core";

export interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: number;
  trendLabel?: string;
  description?: string;
  icon?: React.ReactNode;
  tone?: IconTone;
  className?: string;
}

/**
 * Single large metric: icon circle, big display number, trend indicator.
 * Compact by design — grid them 2-up or 3-up for stat panels.
 */
export function MetricCard({
  label,
  value,
  unit,
  trend,
  trendLabel,
  description,
  icon,
  tone = "ink",
  className,
}: MetricCardProps) {
  const trendDir =
    trend === undefined ? null : trend > 0 ? "up" : trend < 0 ? "down" : "flat";

  const trendColor =
    trendDir === "up"
      ? "#3f7a4e"
      : trendDir === "down"
        ? "#9f3a36"
        : "#79736a";

  const TrendIcon =
    trendDir === "up" ? TrendingUp : trendDir === "down" ? TrendingDown : Minus;

  return (
    <PaperCard className={cn("px-5 py-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <SectionLabel>{label}</SectionLabel>
          <div className="mt-1.5 flex items-end gap-1.5 leading-none">
            <span className="font-caveat text-[44px] font-bold text-ink">{value}</span>
            {unit && (
              <span className="mb-1.5 font-architect text-[16px] text-ink-muted">{unit}</span>
            )}
          </div>
        </div>
        {icon && (
          <PaperIconCircle tone={tone} size={40}>
            {icon}
          </PaperIconCircle>
        )}
      </div>

      {(trend !== undefined || description) && (
        <div className="mt-3 flex items-center gap-1.5">
          {trend !== undefined && TrendIcon && (
            <span className="inline-flex items-center gap-1 font-architect text-[12px]" style={{ color: trendColor }}>
              <TrendIcon size={13} strokeWidth={2} />
              {trend > 0 ? "+" : ""}
              {trend}%
            </span>
          )}
          {trendLabel && (
            <span className="font-kalam text-[12px] text-ink-muted/70">{trendLabel}</span>
          )}
          {description && !trendLabel && (
            <span className="font-kalam text-[12px] text-ink-muted/70">{description}</span>
          )}
        </div>
      )}
    </PaperCard>
  );
}
