import React from "react";
import { cn } from "@/paper-ui/utils";

export type WorkspaceProps = React.HTMLAttributes<HTMLDivElement>;

export const Workspace = React.forwardRef<HTMLDivElement, WorkspaceProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex h-screen w-full overflow-hidden bg-paper", className)}
        {...props}
      />
    );
  }
);
Workspace.displayName = "Workspace";
