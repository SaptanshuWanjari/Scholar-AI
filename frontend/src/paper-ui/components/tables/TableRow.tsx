import React from "react";
import { cn } from "@/paper-ui/utils";
import { TableContext } from "./PaperTable";

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
  index?: number;
  children: React.ReactNode;
}

export function TableRow({ selected, index, children, className, ...props }: TableRowProps) {
  const { striped } = React.useContext(TableContext);

  const isOddStripe = striped && index !== undefined && index % 2 !== 0;

  return (
    <tr
      className={cn(
        "transition-colors hover:bg-black/[0.025]",
        selected && "bg-[#f0ede4]",
        !selected && isOddStripe && "bg-black/[0.015]",
        className,
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

export interface PaperTdProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children?: React.ReactNode;
}

export function PaperTd({ children, className, ...props }: PaperTdProps) {
  return (
    <td
      className={cn(
        "px-4 py-3 font-kalam text-[14px] text-ink border-b border-[#e8e3d8]",
        className,
      )}
      {...props}
    >
      {children}
    </td>
  );
}
