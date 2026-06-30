import React from "react";
import { cn } from "@paper-ui/utils";
import { SketchSurface } from "@paper-ui/core";
import { StickyNote } from "../decorations";

export type DescriptionListVariant = "notebook" | "minimal" | "sticky-note";

export interface DescriptionListProps {
  children: React.ReactNode;
  variant?: DescriptionListVariant;
  className?: string;
}

const DescriptionListContext = React.createContext<{ variant: DescriptionListVariant }>({ variant: "minimal" });

export function DescriptionList({ children, variant = "minimal", className }: DescriptionListProps) {
  const content = (
    <dl className={cn(
      "grid grid-cols-1 sm:grid-cols-3 gap-x-4",
      variant === "notebook" ? "gap-y-0" : "gap-y-4",
      className
    )}>
      {children}
    </dl>
  );

  if (variant === "sticky-note") {
    return (
      <StickyNote color="yellow" className="shadow-paper-md" rotate={-1} style={{ width: "auto", height: "auto", minWidth: "250px" }}>
        <div className="p-8 w-full">
          <DescriptionListContext.Provider value={{ variant }}>
            {content}
          </DescriptionListContext.Provider>
        </div>
      </StickyNote>
    );
  }

  if (variant === "notebook") {
    return (
      <div className="bg-paper-surface border border-ink-muted/20 p-6 rounded-md shadow-paper-sm">
        <DescriptionListContext.Provider value={{ variant }}>
          {content}
        </DescriptionListContext.Provider>
      </div>
    );
  }

  return (
    <DescriptionListContext.Provider value={{ variant }}>
      <div className={cn("p-4", className)}>
        {content}
      </div>
    </DescriptionListContext.Provider>
  );
}

export interface DescriptionListItemProps {
  label: React.ReactNode;
  value: React.ReactNode;
  className?: string;
}

export function DescriptionListItem({ label, value, className }: DescriptionListItemProps) {
  const { variant } = React.useContext(DescriptionListContext);

  if (variant === "notebook") {
    return (
      <>
        <dt className={cn("font-caveat font-bold text-lg text-ink sm:col-span-1 border-b border-margin py-2 flex items-end", className)}>
          {label}
        </dt>
        <dd className={cn("font-architect text-base text-ink-muted sm:col-span-2 border-b border-margin py-2", className)}>
          {value}
        </dd>
      </>
    );
  }

  if (variant === "sticky-note") {
    return (
      <>
        <dt className={cn("font-kalam font-bold text-ink/90 sm:col-span-1", className)}>
          {label}
        </dt>
        <dd className={cn("font-kalam text-ink sm:col-span-2 mb-2 sm:mb-0", className)}>
          {value}
        </dd>
      </>
    );
  }

  // minimal
  return (
    <>
      <dt className={cn("font-caveat font-bold text-xl text-ink sm:col-span-1", className)}>
        {label}
      </dt>
      <dd className={cn("font-architect text-base text-ink-muted/80 sm:col-span-2 mb-4 sm:mb-0", className)}>
        {value}
      </dd>
    </>
  );
}
