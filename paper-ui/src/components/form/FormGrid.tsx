import React from "react";
import { cn } from "@paper-ui/utils";

export interface FormGridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: number;
}

export const FormGrid = React.forwardRef<HTMLDivElement, FormGridProps>(
  function FormGrid({ children, className, cols = 2, ...props }, ref) {
    const colClass = cols === 1
      ? "sm:grid-cols-1"
      : cols === 2
        ? "sm:grid-cols-1 md:grid-cols-2"
        : cols === 3
          ? "sm:grid-cols-1 md:grid-cols-3"
          : cols === 4
            ? "sm:grid-cols-1 md:grid-cols-4"
            : `sm:grid-cols-1 md:grid-cols-${cols}`;

    return (
      <div ref={ref} className={cn("grid gap-4", colClass, className)} {...props}>
        {children}
      </div>
    );
  }
);
