import React from "react";
import { cn } from "@/paper-ui/utils";
import { Flex, type FlexProps } from "./Flex";

export interface StackProps extends Omit<FlexProps, "direction"> {
  spacing?: FlexProps["gap"];
}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ className, spacing, gap, ...props }, ref) => {
    return (
      <Flex
        ref={ref}
        direction="column"
        gap={spacing || gap || "md"}
        className={className}
        {...props}
      />
    );
  }
);
Stack.displayName = "Stack";
