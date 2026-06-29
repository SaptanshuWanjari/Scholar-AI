import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, XCircle, AlertTriangle, X } from "lucide-react";
import { cn } from "../../ui/utils";
import { SketchBorder } from "../foundation/SketchBorder";

export type ToastVariant = "default" | "success" | "error" | "warning";

export interface PaperToastProps {
  visible: boolean;
  message: string;
  description?: string;
  variant?: ToastVariant;
  icon?: React.ReactNode;
  onDismiss?: () => void;
  /** Auto-dismiss timeout in ms (0 = no auto-dismiss) */
  timeout?: number;
  className?: string;
}

const variantConfig: Record<
  ToastVariant,
  { fill: string; stroke: string; icon: React.ReactNode | null }
> = {
  default: { fill: "#fffdf9", stroke: "#3a3733", icon: null },
  success: {
    fill: "#edf5ea",
    stroke: "#3f7a4e",
    icon: <CheckCircle2 size={16} color="#3f7a4e" />,
  },
  error: {
    fill: "#fdf0ef",
    stroke: "#9f3a36",
    icon: <XCircle size={16} color="#9f3a36" />,
  },
  warning: {
    fill: "#fefce8",
    stroke: "#8a6d00",
    icon: <AlertTriangle size={16} color="#8a6d00" />,
  },
};

export function PaperToast({
  visible,
  message,
  description,
  variant = "default",
  icon,
  onDismiss,
  timeout = 0,
  className,
}: PaperToastProps) {
  useEffect(() => {
    if (!visible || timeout <= 0) return;
    const timer = setTimeout(() => onDismiss?.(), timeout);
    return () => clearTimeout(timer);
  }, [visible, timeout, onDismiss]);

  if (!visible) return null;

  const config = variantConfig[variant];
  const resolvedIcon = icon ?? config.icon;

  const content = (
    <div className="fixed bottom-6 right-6 z-[70]">
      <div
        className={cn(
          "relative flex items-start gap-3 px-4 py-3.5 min-w-[280px] max-w-[380px]",
          className
        )}
      >
        <SketchBorder
          fill={config.fill}
          stroke={config.stroke}
          strokeWidth={1.5}
          radius={7}
          shadow={4}
          bleed={6}
        />
        {resolvedIcon && (
          <div className="relative z-[1] mt-[1px] shrink-0">{resolvedIcon}</div>
        )}
        <div className="relative z-[1] flex-1 pr-5">
          <p className="font-architect text-[14px] text-[#262320] leading-snug">
            {message}
          </p>
          {description && (
            <p className="font-kalam text-[12px] text-ink-muted mt-0.5 leading-snug">
              {description}
            </p>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="absolute top-2.5 right-2.5 z-[1] text-ink-muted hover:text-[#262320] transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
