import React from "react";
import { cn } from "@paper-ui/utils";

export interface TableFooterProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export function TableFooter({ children, className, ...props }: TableFooterProps) {
  return (
    <tfoot
      className={cn("border-t-2 border-[#3a3733] bg-paper-surface/30", className)}
      {...props}
    >
      {children}
    </tfoot>
  );
}
