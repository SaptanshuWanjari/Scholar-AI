import React from "react";
import { cn } from "@paper-ui/utils";
import { PaperPanel } from "@paper-ui/core";
import { Tape } from "@paper-ui/components/decorations";

interface NavFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function NavFooter({ children, className, ...props }: NavFooterProps) {
  return (
    <PaperPanel surface="transparent" className={cn("border-t border-dashed border-ink/10 px-4 py-3", className)}>
      <Tape corner="top-left" width={60} rotate={-5} />
      <div className="relative z-[1]" {...props}>
        {children}
      </div>
    </PaperPanel>
  );
}

NavFooter.displayName = "NavFooter";
