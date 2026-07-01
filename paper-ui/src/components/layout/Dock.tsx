import React from "react";
import { cn } from "@paper-ui/utils";

export interface DockProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: number;
}

export const Dock = React.forwardRef<HTMLDivElement, DockProps>(
  ({ className, children, gap = 16, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-end justify-center", className)}
      style={{ gap, ...style }}
      {...props}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child) ? (
          <div className="transition-transform duration-200 hover:scale-125 hover:-translate-y-1">
            {child}
          </div>
        ) : (
          child
        ),
      )}
    </div>
  ),
);
Dock.displayName = "Dock";
