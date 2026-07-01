import React from "react";
import { cn } from "@paper-ui/utils";

export interface TableToolbarProps {
  children: React.ReactNode;
  className?: string;
}

export function TableToolbar({ children, className }: TableToolbarProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 px-4 py-2.5 border-b border-[#e8e3d8] bg-paper-surface/20",
        className,
      )}
    >
      {children}
    </div>
  );
}
