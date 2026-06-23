import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { ConceptData } from "../lib/graph-data";
import { cn } from "./ui/utils";

const handleStyle: React.CSSProperties = {
  opacity: 0,
  width: 8,
  height: 8,
  pointerEvents: "none",
};

const positions = [Position.Top, Position.Right, Position.Bottom, Position.Left];

const sizeMap = {
  large: {
    wrapper: "min-w-[136px] px-4 py-3",
    label: "text-[15px] font-semibold leading-snug",
    meta: "text-[10px]",
  },
  medium: {
    wrapper: "min-w-[108px] px-3.5 py-2.5",
    label: "text-[13px] font-medium leading-snug",
    meta: "text-[10px]",
  },
  small: {
    wrapper: "min-w-[88px] px-3 py-2",
    label: "text-[12px] font-medium leading-snug",
    meta: "text-[10px]",
  },
};

export const ConceptNode = memo(function ConceptNode({
  data,
  selected,
}: NodeProps & { data: ConceptData }) {
  const s = sizeMap[data.size];
  return (
    <div
      className={cn(
        "relative cursor-pointer rounded-xl border bg-card text-center transition-all duration-150",
        s.wrapper,
        selected
          ? "border-violet bg-violet-soft/30 shadow-md shadow-violet/10"
          : "border-border shadow-sm hover:border-foreground/25 hover:shadow-md",
      )}
    >
      {/* Handles on all sides for flexible edge routing */}
      {positions.map((pos) => (
        <span key={pos}>
          <Handle type="target" position={pos} style={handleStyle} />
          <Handle type="source" position={pos} style={handleStyle} />
        </span>
      ))}

      <div className={cn("text-foreground", s.label, selected && "text-violet")}>
        {data.label}
      </div>
      <div className={cn("mt-0.5 text-muted-foreground", s.meta)}>
        {data.refCount} refs · {data.sourceCount} src
      </div>
    </div>
  );
});
