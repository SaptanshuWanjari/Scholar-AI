import React from "react";
import { cn } from "@/paper-ui/utils";
import { SketchBorder } from "@/paper-ui/core";

interface TableContextValue {
  striped: boolean;
}

export const TableContext = React.createContext<TableContextValue>({ striped: false });

export interface PaperTableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  striped?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function PaperTable({ striped = false, className, children, ...props }: PaperTableProps) {
  return (
    <TableContext.Provider value={{ striped }}>
      <div className={cn("relative", className)}>
        <SketchBorder fill="#fffdf9" stroke="#3a3733" strokeWidth={1.5} radius={8} shadow={3} roughness={1.1} bleed={6} />
        <div className="relative z-[1] overflow-visible">
          <table className="w-full border-collapse" {...props}>
            {children}
          </table>
        </div>
      </div>
    </TableContext.Provider>
  );
}
