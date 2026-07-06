import React from "react";
import { cn } from "@paper-ui/utils";

const hachureBg: React.CSSProperties = {
  backgroundColor: "#e8e3d8",
  backgroundImage:
    "repeating-linear-gradient(45deg, rgba(0,0,0,0.07) 0 1px, transparent 1px 6px)",
};

export interface ShimmerRootProps {
  animated?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const ShimmerRoot = React.forwardRef<HTMLDivElement, ShimmerRootProps>(
  ({ animated = true, className, children }, ref) => {
    return (
      <div
        ref={ref}
        aria-busy="true"
        className={cn(
          "relative overflow-hidden",
          animated && "shimmer-animate",
          className
        )}
      >
        {children}
        {animated && (
          <style>{`
            .shimmer-animate::after {
              content: "";
              position: absolute;
              inset: 0;
              background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%);
              animation: shimmer-sweep 1.8s ease-in-out infinite;
              pointer-events: none;
            }
            @keyframes shimmer-sweep {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
          `}</style>
        )}
      </div>
    );
  }
);
ShimmerRoot.displayName = "Shimmer.Root";

export interface ShimmerLineProps {
  width?: string;
  className?: string;
}

function ShimmerLine({ width = "100%", className }: ShimmerLineProps) {
  return (
    <div
      className={cn("h-3 rounded-sm mb-2", className)}
      style={{ ...hachureBg, width }}
    />
  );
}
ShimmerLine.displayName = "Shimmer.Line";

export interface ShimmerBlockProps {
  width?: string | number;
  height?: string | number;
  className?: string;
}

function ShimmerBlock({ width = "100%", height = 80, className }: ShimmerBlockProps) {
  return (
    <div
      className={cn("rounded-sm", className)}
      style={{ ...hachureBg, width, height }}
    />
  );
}
ShimmerBlock.displayName = "Shimmer.Block";

export interface ShimmerCircleProps {
  size?: number;
  className?: string;
}

function ShimmerCircle({ size = 40, className }: ShimmerCircleProps) {
  return (
    <div
      className={cn("rounded-full shrink-0", className)}
      style={{ ...hachureBg, width: size, height: size }}
    />
  );
}
ShimmerCircle.displayName = "Shimmer.Circle";

export interface ShimmerCardProps {
  width?: string | number;
  className?: string;
}

function ShimmerCard({ width = 240, className }: ShimmerCardProps) {
  return (
    <div
      className={cn("overflow-hidden rounded-sm", className)}
      style={{
        width,
        backgroundColor: "#e8e3d8",
      }}
    >
      <div className="w-full" style={{ ...hachureBg, height: "40%" }} />
      <div className="p-3">
        {[100, 100, 60].map((w, i) => (
          <div
            key={i}
            className={cn("h-3 rounded-sm", i < 2 ? "mb-2" : "")}
            style={{ ...hachureBg, width: `${w}%` }}
          />
        ))}
      </div>
    </div>
  );
}
ShimmerCard.displayName = "Shimmer.Card";

export const Shimmer = Object.assign(ShimmerRoot, {
  Line: ShimmerLine,
  Block: ShimmerBlock,
  Circle: ShimmerCircle,
  Card: ShimmerCard,
});
