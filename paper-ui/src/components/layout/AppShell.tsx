import React from "react";
import { cn } from "@paper-ui/utils";

export interface AppShellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Fill the viewport and hide overflow (needed for sidebar layouts). Default true. */
  fullscreen?: boolean;
  /** Apply the layered paper-texture background. Default true. */
  bg?: boolean;
}

/**
 * Outermost paper-aesthetic wrapper. Sets the `.paper-root` scope so all
 * descendant paper-* classes (paper-bg, paper-texture, paper-scrollbar…)
 * resolve correctly. Every other layout uses this internally.
 */
export function AppShell({ children, className, fullscreen = true, bg = true, ...props }: AppShellProps) {
  return (
    <div
      className={cn(
        "paper-root font-kalam text-ink selection:bg-[#f6e27a]/60",
        bg && "paper-bg",
        fullscreen && "h-screen overflow-hidden",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
