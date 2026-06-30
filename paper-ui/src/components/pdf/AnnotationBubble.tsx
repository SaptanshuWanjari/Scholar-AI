import React from "react";
import { cn } from "@paper-ui/utils";
import { SketchBorder } from "@paper-ui/core";

export interface AnnotationBubbleProps {
  tail?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  color?: string;
  maxWidth?: number;
  className?: string;
  children: React.ReactNode;
}

const TAIL_SIZE = 10;

export function AnnotationBubble({
  tail = "bottom-left",
  color = "#fffdf9",
  maxWidth = 240,
  className,
  children,
}: AnnotationBubbleProps) {
  const isBottom = tail.startsWith("bottom");
  const isLeft = tail.endsWith("left");

  const tailSvg = (
    <svg
      width={TAIL_SIZE * 2}
      height={TAIL_SIZE}
      viewBox={`0 0 ${TAIL_SIZE * 2} ${TAIL_SIZE}`}
      className="absolute"
      style={{
        [isBottom ? "top" : "bottom"]: "100%",
        [isLeft ? "left" : "right"]: 14,
        transform: isBottom ? "none" : "scaleY(-1)",
      }}
      aria-hidden
    >
      <polygon
        points={
          isLeft
            ? `0,${TAIL_SIZE} ${TAIL_SIZE * 2},0 ${TAIL_SIZE * 2},${TAIL_SIZE}`
            : `${TAIL_SIZE * 2},${TAIL_SIZE} 0,0 0,${TAIL_SIZE}`
        }
        fill="#262320"
      />
      <polygon
        points={
          isLeft
            ? `2,${TAIL_SIZE - 1} ${TAIL_SIZE * 2},2 ${TAIL_SIZE * 2},${TAIL_SIZE - 1}`
            : `${TAIL_SIZE * 2 - 2},${TAIL_SIZE - 1} 0,2 0,${TAIL_SIZE - 1}`
        }
        fill={color}
      />
    </svg>
  );

  return (
    <div
      className={cn("relative inline-block", className)}
      style={{ maxWidth }}
    >
      {!isBottom && tailSvg}
      <div className="relative px-3 py-2">
        <SketchBorder fill={color} stroke="#262320" strokeWidth={1.4} radius={7} shadow={2} bleed={6} />
        <div className="relative z-[1] font-kalam text-[13px] text-ink leading-snug">{children}</div>
      </div>
      {isBottom && tailSvg}
    </div>
  );
}
