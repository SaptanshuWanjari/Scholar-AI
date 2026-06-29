import React from "react";
import { cn } from "../../ui/utils";
import { PaperCard } from "../foundation/Paper";
import { PaperIconCircle, type IconTone } from "../foundation/PaperIconCircle";
import { PaperBadge } from "../badges/PaperBadge";
import { ArrowDoodle } from "../doodles";

export interface ActionCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  tone?: IconTone;
  badge?: string;
  badgeTone?: IconTone;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * Fully-clickable action tile — icon circle, title, optional description and
 * badge. Lifts on hover; dims when disabled. Use in action grids / quick-start
 * panels.
 */
export function ActionCard({
  title,
  description,
  icon,
  tone = "sky",
  badge,
  badgeTone = "ink",
  disabled = false,
  onClick,
  className,
}: ActionCardProps) {
  return (
    <PaperCard
      lift
      className={cn(
        "group flex cursor-pointer flex-col gap-3 px-5 py-5",
        disabled && "pointer-events-none opacity-50",
        className,
      )}
      onClick={disabled ? undefined : onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && onClick && !disabled) onClick();
      }}
    >
      <div className="flex items-start justify-between gap-2">
        {icon && (
          <PaperIconCircle tone={tone} size={42}>
            {icon}
          </PaperIconCircle>
        )}
        {badge && (
          <PaperBadge tone={badgeTone}>{badge}</PaperBadge>
        )}
      </div>

      <div className="flex-1">
        <h3 className="font-caveat text-[22px] font-bold leading-tight text-ink">{title}</h3>
        {description && (
          <p className="mt-1 font-kalam text-[13px] leading-relaxed text-ink-muted/80">
            {description}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <ArrowDoodle
          size={16}
          className="text-ink-muted/40 transition-all group-hover:translate-x-0.5 group-hover:text-ink-muted/70"
        />
      </div>
    </PaperCard>
  );
}
