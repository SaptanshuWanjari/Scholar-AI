import React from "react";
import { cn } from "@paper-ui/utils";
import { SketchBorder } from "@paper-ui/core";

export interface SelectionAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

export interface SelectionToolbarProps {
  actions: SelectionAction[];
  className?: string;
  floating?: boolean;
}

export function SelectionToolbar({
  actions,
  className,
  floating = true,
}: SelectionToolbarProps) {
  return (
    <div
      className={cn(
        floating && "absolute z-50",
        className,
      )}
    >
      <div className="relative inline-flex items-center gap-0.5 px-1.5 py-1">
        <SketchBorder
          fill="#fffdf9"
          stroke="#262320"
          strokeWidth={1.3}
          radius={14}
          shadow={2}
          roughness={1.0}
          bleed={5}
        />
        {actions.map((action, i) => (
          <button
            key={i}
            aria-label={action.label}
            title={action.label}
            onClick={action.onClick}
            className={cn(
              "relative z-[1] inline-flex h-6 w-6 items-center justify-center rounded-full text-ink",
              "transition-colors hover:bg-black/8 active:bg-black/12",
            )}
          >
            {action.icon}
          </button>
        ))}
      </div>
      {/* downward caret */}
      <div className="flex justify-center" aria-hidden>
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderTop: "5px solid #262320",
          }}
        />
      </div>
    </div>
  );
}
