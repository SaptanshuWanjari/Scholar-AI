import { type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "./ui/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent: string;
  delta?: number;
  hint?: string;
}

export function MetricCard({ label, value, icon: Icon, accent, delta, hint }: MetricCardProps) {
  const positive = (delta ?? 0) >= 0;
  return (
    <motion.div
      whileHover={{ y: -1 }}
      className="group relative overflow-hidden rounded-lg border border-border bg-card p-5 transition-colors hover:border-foreground/20"
    >
      <div className="flex items-center justify-between">
        <div
          className="flex size-9 items-center justify-center rounded-md"
          style={{ backgroundColor: `${accent}14`, color: accent }}
        >
          <Icon className="size-[18px]" />
        </div>
        {delta !== undefined && (
          <span
            className={cn(
              "flex items-center gap-0.5 text-xs font-medium",
              positive ? "text-success" : "text-danger",
            )}
          >
            {positive ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      <div className="mt-4 font-display text-[2rem] leading-none tracking-tight">{value}</div>
      <div className="mt-2 text-sm text-muted-foreground">{label}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground/70">{hint}</div>}
    </motion.div>
  );
}
