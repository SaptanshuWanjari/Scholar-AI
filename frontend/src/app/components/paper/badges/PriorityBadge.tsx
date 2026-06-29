import React from "react";
import { ArrowDown, Minus, ArrowUp, Flame } from "lucide-react";
import { PaperBadge } from "./PaperBadge";
import type { IconTone } from "../foundation/PaperIconCircle";

export type Priority = "low" | "medium" | "high" | "critical";

const TONES: Record<Priority, IconTone> = {
  low: "ink",
  medium: "ochre",
  high: "brick",
  critical: "lavender",
};

const LABELS: Record<Priority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

const ICONS = {
  low: ArrowDown,
  medium: Minus,
  high: ArrowUp,
  critical: Flame,
} as const;

export interface PriorityBadgeProps {
  priority: Priority;
  showIcon?: boolean;
  className?: string;
}

export function PriorityBadge({ priority, showIcon = true, className }: PriorityBadgeProps) {
  const Icon = ICONS[priority];
  return (
    <PaperBadge tone={TONES[priority]} className={className}>
      {showIcon && <Icon size={10} strokeWidth={2} />}
      {LABELS[priority]}
    </PaperBadge>
  );
}
