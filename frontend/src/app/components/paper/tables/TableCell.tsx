import React from "react";
import { cn } from "../../ui/utils";

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  align?: "left" | "center" | "right";
  muted?: boolean;
  truncate?: boolean;
  children?: React.ReactNode;
}

export function TableCell({ align = "left", muted, truncate, children, className, ...props }: TableCellProps) {
  return (
    <td
      className={cn(
        "px-4 py-3 font-kalam text-[14px] border-b border-[#e8e3d8]",
        align === "left" && "text-left",
        align === "center" && "text-center",
        align === "right" && "text-right",
        muted ? "text-ink-muted" : "text-ink",
        truncate && "max-w-0 overflow-hidden text-ellipsis whitespace-nowrap",
        className,
      )}
      {...props}
    >
      {children}
    </td>
  );
}
