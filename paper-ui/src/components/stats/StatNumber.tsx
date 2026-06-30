import { cn } from "@paper-ui/utils";
import type { IconTone } from "@paper-ui/core";

const TONE_FG: Record<IconTone, string> = {
  sage:     "#3f7a4e",
  ochre:    "#b07a2e",
  sky:      "#4a6f91",
  lavender: "#6f63a3",
  brick:    "#a3544a",
  ink:      "#3a3733",
};

export interface StatNumberProps {
  value: string | number;
  label: string;
  sublabel?: string;
  trend?: "up" | "down" | "flat";
  trendLabel?: string;
  tone?: IconTone;
  className?: string;
}

function TrendIndicator({ trend }: { trend: "up" | "down" | "flat" }) {
  if (trend === "up") {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0">
        <path d="M3 12 L8 4 L13 12" stroke="#3f7a4e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (trend === "down") {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0">
        <path d="M3 4 L8 12 L13 4" stroke="#a3544a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0">
      <path d="M3 8 L13 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-ink-muted" />
    </svg>
  );
}

export function StatNumber({
  value,
  label,
  sublabel,
  trend,
  trendLabel,
  tone = "ink",
  className,
}: StatNumberProps) {
  const fg = TONE_FG[tone];

  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <div className="flex items-baseline gap-1.5">
        <span
          className="font-caveat leading-none"
          style={{ fontSize: 56, color: fg }}
        >
          {value}
        </span>
        {trend && (
          <span className="flex items-center gap-0.5 pb-1">
            <TrendIndicator trend={trend} />
            {trendLabel && (
              <span className="font-architect text-xs text-ink-muted">{trendLabel}</span>
            )}
          </span>
        )}
      </div>
      <span className="font-kalam text-sm text-ink-muted">{label}</span>
      {sublabel && (
        <span className="font-architect text-xs text-muted-foreground">{sublabel}</span>
      )}
    </div>
  );
}
