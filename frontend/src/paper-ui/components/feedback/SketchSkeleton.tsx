import React from "react";
import { cn } from "@/paper-ui/utils";

export interface SketchSkeletonProps {
  variant?: "text" | "rect" | "circle" | "card";
  width?: number | string;
  height?: number | string;
  /** For "text": number of lines */
  lines?: number;
  className?: string;
}

const hachureBg: React.CSSProperties = {
  backgroundColor: "#e8e3d8",
  backgroundImage:
    "repeating-linear-gradient(45deg, rgba(0,0,0,0.07) 0 1px, transparent 1px 6px)",
};

function TextSkeleton({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("animate-pulse", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn("h-3 rounded-sm", i < lines - 1 ? "mb-2" : "")}
          style={{
            ...hachureBg,
            width: i === lines - 1 ? "60%" : "100%",
          }}
        />
      ))}
    </div>
  );
}

function CardSkeleton({
  width,
  height,
  className,
}: {
  width?: number | string;
  height?: number | string;
  className?: string;
}) {
  return (
    <div
      className={cn("animate-pulse overflow-hidden rounded-sm", className)}
      style={{
        width: width ?? 240,
        height: height ?? 300,
        backgroundColor: "#e8e3d8",
      }}
    >
      <div
        className="w-full"
        style={{ ...hachureBg, height: "40%" }}
      />
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

export function SketchSkeleton({
  variant = "rect",
  width,
  height,
  lines = 3,
  className,
}: SketchSkeletonProps) {
  const sizeStyle: React.CSSProperties = {
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
  };

  if (variant === "text") {
    return <TextSkeleton lines={lines} className={className} />;
  }

  if (variant === "card") {
    return <CardSkeleton width={width} height={height} className={className} />;
  }

  return (
    <div
      className={cn(
        "animate-pulse rounded-sm",
        variant === "circle" && "rounded-full",
        className,
      )}
      style={{ ...hachureBg, ...sizeStyle }}
    />
  );
}
