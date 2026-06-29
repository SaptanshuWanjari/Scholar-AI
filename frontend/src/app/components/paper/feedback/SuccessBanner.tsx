import React from "react";
import { CheckCircle2, X } from "lucide-react";
import { cn } from "../../ui/utils";
import { SketchBorder } from "../foundation/SketchBorder";

export interface SuccessBannerProps {
  title?: string;
  message?: string;
  onDismiss?: () => void;
  action?: React.ReactNode;
  className?: string;
}

export function SuccessBanner({ title, message, onDismiss, action, className }: SuccessBannerProps) {
  return (
    <div className={cn("relative flex items-start gap-3 px-4 py-3.5", className)}>
      <SketchBorder fill="#edf5ea" stroke="#3f7a4e" strokeWidth={1.5} radius={8} shadow={2} bleed={6} />
      <div className="relative z-[1] flex w-full flex-row gap-3">
        <CheckCircle2 size={16} color="#3f7a4e" className="mt-0.5 shrink-0" />
        <div className="flex-1">
          {title && <p className="font-architect text-[14px] text-[#3f7a4e]">{title}</p>}
          {message && <p className="font-kalam text-[13px] text-ink-muted mt-0.5">{message}</p>}
          {action}
        </div>
        {onDismiss && (
          <button onClick={onDismiss} className="ml-auto shrink-0 text-ink-muted hover:text-ink transition-colors">
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
