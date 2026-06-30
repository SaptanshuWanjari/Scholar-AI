import React from "react";
import { cn } from "@/paper-ui/utils";
import { PaperCard } from "@/paper-ui/core";
import { PaperIconCircle } from "@/paper-ui/core";
import type { IconTone } from "@/paper-ui/core";

export interface LearningStepCardProps {
  step: number;
  title: string;
  description?: string;
  status?: "done" | "active" | "pending";
  estimatedTime?: string;
  actions?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const STATUS_TONE: Record<"done" | "active" | "pending", IconTone> = {
  done: "sage",
  active: "lavender",
  pending: "ink",
};

export function LearningStepCard({
  step,
  title,
  description,
  status = "pending",
  estimatedTime,
  actions,
  onClick,
  className,
}: LearningStepCardProps) {
  return (
    <PaperCard
      shadow="sm"
      lift={status === "active"}
      className={cn(
        "px-4 py-3",
        onClick && "cursor-pointer",
        className,
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <PaperIconCircle tone={STATUS_TONE[status]} size={36}>
          <span className="font-caveat font-bold text-lg leading-none">{step}</span>
        </PaperIconCircle>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p
              className={cn(
                "font-kalam font-bold text-[15px] leading-snug",
                status === "done" && "line-through text-ink-muted",
                status === "active" && "text-ink font-bold",
                status === "pending" && "text-ink",
              )}
            >
              {title}
            </p>
            {estimatedTime && (
              <span className="font-architect text-xs text-ink-muted shrink-0">
                {estimatedTime}
              </span>
            )}
          </div>

          {description && (
            <p className="font-kalam text-sm text-ink-muted mt-0.5">{description}</p>
          )}

          {actions && (
            <div className="flex gap-2 mt-3">{actions}</div>
          )}
        </div>
      </div>
    </PaperCard>
  );
}
