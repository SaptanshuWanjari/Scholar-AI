import React from "react";
import { cn } from "@/paper-ui/utils";
import { SketchBorder, PaperPanel, usePaperTheme } from "@/paper-ui/core";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const t = usePaperTheme();
  return (
    <PaperPanel className={cn(className)}>
      <div className="flex flex-col items-center py-12 px-6 text-center">
        {icon && (
          <div
            className="relative flex items-center justify-center"
            style={{ width: 72, height: 72 }}
          >
            <SketchBorder
              fill={t.panel}
              stroke={t.strokeSm}
              strokeWidth={1.3}
              radius={40}
              shadow={0}
            />
            <div className="relative z-[1]">{icon}</div>
          </div>
        )}

        <h3 className={cn("font-architect text-[1.13rem] text-ink", icon ? "mt-5" : "")}>
          {title}
        </h3>

        {description && (
          <p className="font-kalam text-[0.93rem] text-ink-muted mt-2 max-w-[500px]">
            {description}
          </p>
        )}

        {action && <div className="mt-5">{action}</div>}
      </div>
    </PaperPanel>
  );
}
