import React from "react";
import { cn } from "@paper-ui/utils";
import { Box, type BoxProps } from "./Box";

export interface FlexProps extends BoxProps {
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  direction?: "row" | "row-reverse" | "column" | "column-reverse";
  wrap?: "nowrap" | "wrap" | "wrap-reverse";
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
}

const alignMap = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

const justifyMap = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

const directionMap = {
  row: "flex-row",
  "row-reverse": "flex-row-reverse",
  column: "flex-col",
  "column-reverse": "flex-col-reverse",
};

const wrapMap = {
  nowrap: "flex-nowrap",
  wrap: "flex-wrap",
  "wrap-reverse": "flex-wrap-reverse",
};

const gapMap = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  ({ className, align, justify, direction, wrap, gap, ...props }, ref) => {
    return (
      <Box
        ref={ref}
        className={cn(
          "flex",
          align && alignMap[align],
          justify && justifyMap[justify],
          direction && directionMap[direction],
          wrap && wrapMap[wrap],
          gap && gapMap[gap],
          className
        )}
        {...props}
      />
    );
  }
);
Flex.displayName = "Flex";
