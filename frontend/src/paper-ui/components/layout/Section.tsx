import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/paper-ui/utils";

import { PaperTexture } from "../paper/PaperTexture";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, children, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "section";
    return (
      <Comp ref={ref} className={cn("py-12 md:py-16 lg:py-20 bg-paper border-y border-black/10 relative overflow-hidden", className)} {...props}>
        <PaperTexture opacity={0.3} />
        <div className="relative z-10">
          {children}
        </div>
      </Comp>
    );
  }
);
Section.displayName = "Section";
