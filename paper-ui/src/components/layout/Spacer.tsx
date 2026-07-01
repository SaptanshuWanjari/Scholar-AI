import React from "react";
import { cn } from "@paper-ui/utils";
import { Box, type BoxProps } from "./Box";

export const Spacer = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ className, ...props }, ref) => (
    <Box ref={ref} className={cn("flex-1", className)} {...props} />
  ),
);
Spacer.displayName = "Spacer";
