import React from "react";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { PaperBadge } from "./PaperBadge";
import type { IconTone } from "@/paper-ui/core";

export type DocStatus = "indexed" | "processing" | "failed";

const TONES: Record<DocStatus, IconTone> = {
  indexed: "sage",
  processing: "ochre",
  failed: "brick",
};

const LABELS: Record<DocStatus, string> = {
  indexed: "Indexed",
  processing: "Processing",
  failed: "Failed",
};

const ICONS = {
  indexed: CheckCircle2,
  processing: Loader2,
  failed: AlertCircle,
} as const;

export interface StatusBadgeProps {
  status: DocStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const Icon = ICONS[status];
  return (
    <PaperBadge tone={TONES[status]} className={className}>
      <Icon
        size={10}
        strokeWidth={2}
        className={status === "processing" ? "animate-spin" : undefined}
      />
      {LABELS[status]}
    </PaperBadge>
  );
}
