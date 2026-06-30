import React from "react";
import { cn } from "@paper-ui/utils";

export interface EmptyTableProps {
  colSpan?: number;
  message?: string;
  hint?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyTable({
  colSpan,
  message = "No data yet",
  hint,
  icon,
  className,
}: EmptyTableProps) {
  return (
    <tbody>
      <tr>
        <td colSpan={colSpan}>
          <div className={cn("flex flex-col items-center justify-center py-12 gap-3", className)}>
            {icon ?? (
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden>
                <rect x="8" y="6" width="32" height="36" rx="2" stroke="#3a3733" strokeWidth="1.5" />
                <line x1="14" y1="16" x2="34" y2="16" stroke="#b4ad9e" strokeWidth="1.2" />
                <line x1="14" y1="22" x2="34" y2="22" stroke="#b4ad9e" strokeWidth="1.2" />
                <line x1="14" y1="28" x2="28" y2="28" stroke="#b4ad9e" strokeWidth="1.2" />
              </svg>
            )}
            <p className="font-architect text-[15px] text-ink">{message}</p>
            {hint && <p className="font-kalam text-[13px] text-ink-muted">{hint}</p>}
          </div>
        </td>
      </tr>
    </tbody>
  );
}
