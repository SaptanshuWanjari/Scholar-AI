import React from "react";
import { PaperCard, PaperPanel, MarkerHighlight } from "@paper-ui/core";
import { cn } from "@paper-ui/utils";

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "paper" | "dashed" | "notebook";
}

export const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  function Panel({ children, className, variant = "paper", ...props }, ref) {
    const isNotebook = variant === "notebook";
    const containerClass = cn("p-4", className);

    if (isNotebook) {
      return (
        <PaperCard
          ref={ref}
          className={containerClass}
          surface="#fffdf9"
          shadow="none"
          texture={false}
          style={{
            backgroundImage:
              "repeating-linear-gradient(transparent,transparent 27px,rgba(156,148,132,0.13) 27px,rgba(156,148,132,0.13) 28px)",
          }}
          {...(props as React.HTMLAttributes<HTMLDivElement>)}
        >
          {children}
        </PaperCard>
      );
    }

    const dashedClass = variant === "dashed" ? "border-2 border-dashed border-[#9c9484]/40 rounded-md" : "";

    return (
      <PaperPanel
        ref={ref}
        className={cn(containerClass, dashedClass)}
        border={variant === "dashed" ? null : undefined}
        {...(props as React.HTMLAttributes<HTMLDivElement>)}
      >
        {children}
      </PaperPanel>
    );
  },
);

export interface PanelHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const PanelHeader = React.forwardRef<HTMLDivElement, PanelHeaderProps>(
  function PanelHeader({ children, className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between pb-3 mb-3 border-b-2 border-dashed border-ink/15",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

export interface PanelTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  marker?: boolean;
}

export const PanelTitle = React.forwardRef<
  HTMLHeadingElement,
  PanelTitleProps
>(function PanelTitle({ children, className, marker = false, ...props }, ref) {
  const el = (
    <h3
      ref={ref}
      className={cn("font-caveat text-[22px] font-bold text-ink", className)}
      {...props}
    >
      {children}
    </h3>
  );

  if (marker) return <MarkerHighlight>{el}</MarkerHighlight>;
  return el;
});

export interface PanelContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const PanelContent = React.forwardRef<
  HTMLDivElement,
  PanelContentProps
>(function PanelContent({ children, className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn("py-3 overflow-y-auto", className)}
      {...props}
    >
      {children}
    </div>
  );
});

export interface PanelFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const PanelFooter = React.forwardRef<HTMLDivElement, PanelFooterProps>(
  function PanelFooter({ children, className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "flex gap-2 items-center pt-3 mt-3 border-t border-dashed border-ink/10",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

export interface PanelToolbarProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const PanelToolbar = React.forwardRef<
  HTMLDivElement,
  PanelToolbarProps
>(function PanelToolbar({ children, className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        "flex gap-2 items-center px-2 py-1.5 border-b border-ink/10 bg-ink/[0.02]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});

export interface PanelActionsProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const PanelActions = React.forwardRef<
  HTMLDivElement,
  PanelActionsProps
>(function PanelActions({ children, className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn("flex gap-2 pt-2 justify-end", className)}
      {...props}
    >
      {children}
    </div>
  );
});

Panel.Header = PanelHeader;
Panel.Title = PanelTitle;
Panel.Content = PanelContent;
Panel.Footer = PanelFooter;
Panel.Toolbar = PanelToolbar;
Panel.Actions = PanelActions;
