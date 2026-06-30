import React from "react";
import { cn } from "@/paper-ui/utils";
import { PaperIconCircle } from "@/paper-ui/core";
import { SketchDivider } from "../decorations/SketchDivider";

export interface PluginRowProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  /** Version chip, "Built-in" badge, or any inline meta. */
  meta?: React.ReactNode;
  /** Toggle switch or any right-side control. */
  control?: React.ReactNode;
  /** Settings panel rendered below when truthy. */
  expanded?: React.ReactNode;
  className?: string;
}

export function PluginRow({ icon, title, description, meta, control, expanded, className }: PluginRowProps) {
  return (
    <div className={cn("py-4", className)}>
      <div className="flex items-center justify-between gap-6">
        <div className="flex min-w-0 items-center gap-3">
          <PaperIconCircle tone="ink" size={40}>
            {icon}
          </PaperIconCircle>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-kalam text-[15px] font-bold text-ink">{title}</p>
              {meta && <span className="shrink-0">{meta}</span>}
            </div>
            {description && (
              <p className="font-kalam text-[13px] text-ink-muted">{description}</p>
            )}
          </div>
        </div>
        {control && <div className="shrink-0">{control}</div>}
      </div>

      {expanded && (
        <>
          <SketchDivider variant="dashed" className="mt-3 opacity-60" />
          <div className="mt-3">{expanded}</div>
        </>
      )}
    </div>
  );
}
