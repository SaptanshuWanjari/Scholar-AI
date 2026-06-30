import React from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/paper-ui/utils";
import { PaperCard } from "@/paper-ui/core";
import { PaperButton } from "../buttons/Buttons";

export interface ErrorCardProps {
  title?: string;
  message?: string;
  details?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorCard({
  title = "Something went wrong",
  message,
  details,
  onRetry,
  className,
}: ErrorCardProps) {
  return (
    <PaperCard
      surface="#fdf0ef"
      border={{ stroke: "#9f3a36", strokeWidth: 1.6 }}
      shadow="sm"
      className={cn(className)}
    >
      <div className="px-4 py-4">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} color="#9f3a36" />
          <span className="font-architect text-[15px] text-[#9f3a36]">{title}</span>
        </div>
        {message && (
          <p className="font-kalam text-[13px] text-ink mt-1">{message}</p>
        )}
        {details && (
          <details>
            <summary className="font-kalam text-[12px] text-ink-muted cursor-pointer mt-2">
              Show details
            </summary>
            <pre className="font-mono text-[11px] bg-black/5 rounded p-2 mt-2 text-ink-muted whitespace-pre-wrap break-all">
              {details}
            </pre>
          </details>
        )}
        {onRetry && (
          <div className="flex justify-end mt-3">
            <PaperButton tone="paper" size="sm" onClick={onRetry}>
              Try again
            </PaperButton>
          </div>
        )}
      </div>
    </PaperCard>
  );
}
