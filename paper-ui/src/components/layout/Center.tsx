import React from "react";
import { cn } from "@paper-ui/utils";
import { Box, type BoxProps } from "./Box";

export const Center = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ className, ...props }, ref) => (
    <Box ref={ref} className={cn("flex items-center justify-center", className)} {...props} />
  ),
);
Center.displayName = "Center";
