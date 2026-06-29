import React from "react";
import { cn } from "../../ui/utils";
import { SketchBorder } from "../foundation/SketchBorder";
import { PaperPanel } from "../foundation/Paper";

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
  return (
    <PaperPanel className={cn(className)}>
      <div className="flex flex-col items-center py-12 px-6 text-center">
        {icon && (
          <div
            className="relative flex items-center justify-center"
            style={{ width: 72, height: 72 }}
          >
            <SketchBorder
              fill="#f0ede4"
              stroke="#b4ad9e"
              strokeWidth={1.3}
              radius={40}
              shadow={0}
            />
            <div className="relative z-[1]">{icon}</div>
          </div>
        )}

        <h3 className={cn("font-architect text-[17px] text-ink", icon ? "mt-5" : "")}>
          {title}
        </h3>

        {description && (
          <p className="font-kalam text-[14px] text-ink-muted mt-2 max-w-[300px]">
            {description}
          </p>
        )}

        {action && <div className="mt-5">{action}</div>}
      </div>
    </PaperPanel>
  );
}
