import React from "react";
import { cn } from "@paper-ui/utils";
import { PaperCard, type PaperCardProps } from "@paper-ui/core";
import { PaperTexture } from "./PaperTexture";

export interface PaperProps extends PaperCardProps {
  withTexture?: boolean;
}

export const Paper = React.forwardRef<HTMLDivElement, PaperProps>(function Paper(
  { children, className, withTexture = true, texture, ...props },
  ref
) {
  return (
    <PaperCard
      ref={ref}
      className={cn("relative", className)}
      texture={false} // Disable core's CSS class in favor of our SVG texture
      {...props}
    >
      {(withTexture || texture) && <PaperTexture opacity={0.6} />}
      {children}
    </PaperCard>
  );
});
