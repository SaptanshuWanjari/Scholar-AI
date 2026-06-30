import React from "react";
import { cn } from "@/paper-ui/utils";
import { Box, type BoxProps } from "./Box";

import { PaperShadow } from "../paper/PaperShadow";
import { PaperTexture } from "../paper/PaperTexture";

export type SurfaceProps = BoxProps;

export const Surface = React.forwardRef<HTMLDivElement, SurfaceProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative inline-block w-full">
        <PaperShadow />
        <Box
          ref={ref}
          className={cn("bg-[#fdfbf7] text-ink relative rounded-sm z-10 shadow-sm border border-black/5 dark:border-white/10", className)}
          {...props}
        >
          <PaperTexture opacity={0.4} />
          {children}
        </Box>
      </div>
    );
  }
);
Surface.displayName = "Surface";
