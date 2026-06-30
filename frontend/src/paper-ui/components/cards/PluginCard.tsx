import React from "react";
import { Puzzle } from "lucide-react";
import { cn } from "@/paper-ui/utils";
import { PaperCard } from "@/paper-ui/core";
import { SectionLabel } from "@/paper-ui/core";
import { PaperIconCircle, type IconTone } from "@/paper-ui/core";
import { PaperBadge } from "../badges/PaperBadge";
import { PaperSwitch } from "../inputs/PaperSwitch";

export interface PluginCardProps {
  name: string;
  description: string;
  version?: string;
  author?: string;
  icon?: React.ReactNode;
  tone?: IconTone;
  enabled?: boolean;
  defaultEnabled?: boolean;
  onToggle?: (enabled: boolean) => void;
  comingSoon?: boolean;
  badge?: string;
  className?: string;
}

/**
 * Plugin or integration tile — icon, name, description, version tag and a
 * toggle switch. Dims and disables the toggle when `comingSoon` is true.
 */
export function PluginCard({
  name,
  description,
  version,
  author,
  icon,
  tone = "lavender",
  enabled,
  defaultEnabled = false,
  onToggle,
  comingSoon = false,
  badge,
  className,
}: PluginCardProps) {
  return (
    <PaperCard
      className={cn(
        "px-5 pb-5 pt-5",
        comingSoon && "opacity-60",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <PaperIconCircle tone={tone} size={42}>
          {icon ?? <Puzzle size={20} strokeWidth={1.6} />}
        </PaperIconCircle>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <SectionLabel>Plugin</SectionLabel>
            {badge && <PaperBadge tone="ochre">{badge}</PaperBadge>}
            {comingSoon && <PaperBadge tone="ink">soon</PaperBadge>}
          </div>
          <h3 className="mt-0.5 font-caveat text-[22px] font-bold text-ink">{name}</h3>
        </div>

        <div className="shrink-0 pt-1">
          <PaperSwitch
            checked={enabled}
            defaultChecked={defaultEnabled}
            onChange={onToggle}
            disabled={comingSoon}
          />
        </div>
      </div>

      <p className="mt-3 font-kalam text-[13px] leading-relaxed text-ink-muted/85">
        {description}
      </p>

      {(version || author) && (
        <div className="mt-3 flex items-center gap-2">
          {version && (
            <PaperBadge tone="ink">v{version}</PaperBadge>
          )}
          {author && (
            <span className="font-kalam text-[12px] text-ink-muted/60">by {author}</span>
          )}
        </div>
      )}
    </PaperCard>
  );
}
