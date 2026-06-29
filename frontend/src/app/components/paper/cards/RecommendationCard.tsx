import React from "react";
import { Sparkles, X } from "lucide-react";
import { cn } from "../../ui/utils";
import { PaperCard, PaperPanel } from "../foundation/Paper";
import { SectionLabel } from "../foundation/SectionHeader";
import { PaperIconCircle, type IconTone } from "../foundation/PaperIconCircle";
import { PaperButton, GhostButton } from "../buttons/Buttons";
import { ArrowDoodle } from "../doodles";

export interface RecommendationCardProps {
  title: string;
  description: string;
  reason?: string;
  actionLabel?: string;
  icon?: React.ReactNode;
  tone?: IconTone;
  onAction?: () => void;
  onDismiss?: () => void;
  className?: string;
}

/** AI-generated recommendation: title, description, reason snippet, action CTA. */
export function RecommendationCard({
  title,
  description,
  reason,
  actionLabel = "Let's go",
  icon,
  tone = "lavender",
  onAction,
  onDismiss,
  className,
}: RecommendationCardProps) {
  return (
    <PaperCard className={cn("px-5 pb-5 pt-5", className)}>
      <div className="flex items-start gap-3">
        <PaperIconCircle tone={tone} size={40}>
          {icon ?? <Sparkles size={18} strokeWidth={1.6} />}
        </PaperIconCircle>

        <div className="min-w-0 flex-1">
          <SectionLabel>Recommended</SectionLabel>
          <h3 className="mt-0.5 font-caveat text-[22px] font-bold text-ink">{title}</h3>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            aria-label="Dismiss"
            className="shrink-0 text-ink-muted/40 transition-colors hover:text-ink-muted"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <p className="mt-3 font-kalam text-[14px] leading-relaxed text-ink-muted/90">
        {description}
      </p>

      {reason && (
        <PaperPanel className="mt-3 px-3 py-2.5">
          <p className="font-kalam text-[12px] italic text-ink-muted/75">
            "{reason}"
          </p>
        </PaperPanel>
      )}

      {onAction && (
        <div className="mt-4 flex justify-end">
          <PaperButton tone="dark" size="sm" onClick={onAction}>
            {actionLabel} <ArrowDoodle size={14} />
          </PaperButton>
        </div>
      )}
    </PaperCard>
  );
}
