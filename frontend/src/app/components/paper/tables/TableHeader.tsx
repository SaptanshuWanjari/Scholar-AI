import React from "react";
import { cn } from "../../ui/utils";

export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export function TableHeader({ children, className, ...props }: TableHeaderProps) {
  return (
    <thead className={cn("border-b-2 border-[#3a3733]", className)} {...props}>
      {children}
    </thead>
  );
}

export interface PaperThProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children?: React.ReactNode;
}

export function PaperTh({ children, className, ...props }: PaperThProps) {
  return (
    <th
      className={cn(
        "font-architect text-[13px] text-ink-muted uppercase tracking-wide px-4 py-3 text-left",
        className,
      )}
      {...props}
    >
      {children}
    </th>
  );
}
