import React from "react";
import { cn } from "@paper-ui/utils";
import { PaperIconCircle } from "@paper-ui/core";

export type TimelineVariant = "sketch" | "dotted" | "notebook";

export interface TimelineProps {
  children: React.ReactNode;
  variant?: TimelineVariant;
  className?: string;
}

const TimelineContext = React.createContext<{ variant: TimelineVariant }>({ variant: "sketch" });

export function Timeline({ children, variant = "sketch", className }: TimelineProps) {
  return (
    <TimelineContext.Provider value={{ variant }}>
      <div className={cn("relative", className)}>
        {/* Render vertical line based on variant */}
        {variant === "sketch" && (
          <div className="absolute top-0 bottom-0 left-[27px] w-[2px]">
            <svg
              className="h-full w-full overflow-visible"
              viewBox="0 0 2 100"
              preserveAspectRatio="none"
              aria-hidden
            >
              <path
                d="M1,0 Q2,25 0,50 T1,100"
                fill="none"
                stroke="var(--color-pencil)"
                strokeWidth="2"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
        )}
        
        {variant === "dotted" && (
          <div className="absolute top-0 bottom-0 left-[27px] w-[2px] border-l-2 border-dotted border-ink-muted/40" />
        )}
        
        {variant === "notebook" && (
          <div className="absolute top-0 bottom-0 left-[27px] w-[2px] border-l-2 border-margin" />
        )}

        <div className="flex flex-col gap-6">
          {children}
        </div>
      </div>
    </TimelineContext.Provider>
  );
}

export interface TimelineItemProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  time?: string;
  className?: string;
}

export function TimelineItem({ icon, title, description, time, className }: TimelineItemProps) {
  const { variant } = React.useContext(TimelineContext);
  
  return (
    <div className={cn("relative flex gap-6 sm:gap-8 items-start z-10", className)}>
      <div className="flex-shrink-0 relative">
        <div className="w-14 h-14 flex items-center justify-center bg-paper-surface">
          {icon ? (
            <PaperIconCircle tone="ink" size={40}>
              {icon}
            </PaperIconCircle>
          ) : (
            <div className={cn(
              "w-4 h-4 rounded-full",
              variant === "sketch" && "border-2 border-pencil bg-paper-surface",
              variant === "dotted" && "bg-ink-muted",
              variant === "notebook" && "border-2 border-margin bg-paper-surface"
            )} />
          )}
        </div>
      </div>
      
      <div className="flex flex-col pt-1.5 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
          <h4 className="font-caveat text-xl font-bold text-ink">{title}</h4>
          {time && (
            <span className="font-kalam text-sm text-ink-muted/70">{time}</span>
          )}
        </div>
        {description && (
          <p className="font-architect text-base text-ink mt-1">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
