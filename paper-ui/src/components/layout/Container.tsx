import React from "react";
import { cn } from "@paper-ui/utils";
import { Box, type BoxProps } from "./Box";

export interface ContainerProps extends BoxProps {}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, ...props }, ref) => {
    return (
      <Box
        ref={ref}
        className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}
        {...props}
      />
    );
  }
);
Container.displayName = "Container";
