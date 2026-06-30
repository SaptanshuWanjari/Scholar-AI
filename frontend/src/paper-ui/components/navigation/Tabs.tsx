import React from "react";
import { cn } from "@/paper-ui/utils";

export interface TabItem {
  key: string;
  label: React.ReactNode;
  /** Optional count badge shown after the label. */
  count?: number;
}

export interface TabsProps {
  items: TabItem[];
  active: string;
  onChange: (key: string) => void;
  /** Color of the marker underline on the active tab. Default warm yellow. */
  markerColor?: string;
  className?: string;
}

/**
 * Tab strip with a hand-drawn marker sweep on the active tab. Mirrors the
 * SidebarItem active style, but runs horizontally along the bottom edge.
 *
 * Usage: place above the content panel it controls.
 */
export function Tabs({ items, active, onChange, markerColor = "#f6e27a", className }: TabsProps) {
  return (
    <div
      role="tablist"
      className={cn("flex items-end gap-6", className)}
      style={{ borderBottom: "1.5px solid rgba(0,0,0,0.07)" }}
    >
      {items.map((item) => {
        const isActive = item.key === active;
        return (
          <button
            key={item.key}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onChange(item.key)}
            className={cn(
              "relative flex items-center gap-1.5 pb-2.5 font-architect text-[14px] transition-colors",
              isActive ? "text-ink" : "text-ink-muted hover:text-ink",
            )}
          >
            {/* Animated marker underline — sweeps in from the left on activation. */}
            {isActive && (
              <svg
                className="pointer-events-none absolute bottom-0 left-0 h-[6px] w-full overflow-visible"
                viewBox="0 0 100 6"
                preserveAspectRatio="none"
                style={{ transformOrigin: "left center", animation: "paper-marker-sweep 0.35s ease-out both" }}
                aria-hidden
              >
                <path
                  d="M2,4 Q25,2 50,3.5 T98,3"
                  fill="none"
                  stroke={markerColor}
                  strokeWidth={5}
                  strokeLinecap="round"
                  opacity={0.85}
                />
              </svg>
            )}
            <span className="relative z-[1]">{item.label}</span>
            {item.count != null && (
              <span className="relative z-[1] font-architect text-[11px] text-ink-muted/65">
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
