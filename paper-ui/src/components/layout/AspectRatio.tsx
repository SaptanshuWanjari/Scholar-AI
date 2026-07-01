import React from "react";
import { cn } from "@paper-ui/utils";

export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: number;
}

export const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ className, children, ratio = 16 / 9, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("relative w-full overflow-hidden", className)}
      style={{ paddingBottom: `${(1 / ratio) * 100}%`, ...style }}
      {...props}
    >
      <div className="absolute inset-0">
        {children}
      </div>
    </div>
  ),
);
AspectRatio.displayName = "AspectRatio";
