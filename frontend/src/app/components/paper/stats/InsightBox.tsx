import React from "react";
import { cn } from "../../ui/utils";
import { PaperCard } from "../foundation/Paper";
import type { SketchBorderProps } from "../foundation/SketchBorder";
import { LightbulbDoodle, CheckmarkDoodle, SparkleDoodle } from "../doodles";

export type InsightVariant = "tip" | "warning" | "success" | "info";

export interface InsightBoxProps {
  variant?: InsightVariant;
  icon?: React.ReactNode;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

interface VariantConfig {
  fill: string;
  stroke: string;
  defaultIcon: React.ReactNode;
}

const VARIANT_CONFIG: Record<InsightVariant, VariantConfig> = {
  tip: {
    fill: "#f4e7d2",
    stroke: "#b07a2e",
    defaultIcon: <LightbulbDoodle size={20} color="#b07a2e" />,
  },
  warning: {
    fill: "#fef3c7",
    stroke: "#92400e",
    defaultIcon: <span className="text-base leading-none" aria-label="warning">⚠</span>,
  },
  success: {
    fill: "#e7efe4",
    stroke: "rgba(63,122,78,0.5)",
    defaultIcon: <CheckmarkDoodle size={20} color="#3f7a4e" />,
  },
  info: {
    fill: "#e9e9f5",
    stroke: "rgba(111,99,163,0.5)",
    defaultIcon: <SparkleDoodle size={20} color="#6f63a3" />,
  },
};

export function InsightBox({
  variant = "tip",
  icon,
  title,
  children,
  className,
}: InsightBoxProps) {
  const cfg = VARIANT_CONFIG[variant];

  const border: Partial<SketchBorderProps> = {
    fill: cfg.fill,
    fillStyle: "hachure",
    hachureGap: 14,
    fillWeight: 1.5,
    stroke: cfg.stroke,
    strokeWidth: 1.4,
    roughness: 1.1,
  };

  const resolvedIcon = icon ?? cfg.defaultIcon;

  return (
    <PaperCard border={border} shadow="none" className={cn("p-4", className)}>
      <div className="flex flex-row gap-3 items-start">
        <span className="shrink-0 mt-0.5 w-6 flex items-center justify-center">
          {resolvedIcon}
        </span>
        <div className="flex flex-col gap-1 min-w-0">
          {title && (
            <span className="font-kalam font-bold text-sm leading-snug">{title}</span>
          )}
          <div className="font-kalam text-sm leading-snug">{children}</div>
        </div>
      </div>
    </PaperCard>
  );
}
