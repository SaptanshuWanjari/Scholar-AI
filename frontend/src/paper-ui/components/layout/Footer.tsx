import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/paper-ui/utils";

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
}

export const Footer = React.forwardRef<HTMLElement, FooterProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "footer";
    return (
      <Comp
        ref={ref}
        className={cn("border-t border-black/5 dark:border-white/10 py-6 md:py-8", className)}
        {...props}
      />
    );
  }
);
Footer.displayName = "Footer";
