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

const MASTERY_COLOR: Record<string, string> = {
  Mastered: "#22c55e",
  Learning: "#fbbf24",
  Weak: "#ef4444",
  "Needs Revision": "#fb923c",
  Unknown: "",
};

const MASTERY_BG_SELECTED: Record<string, string> = {
  Mastered: "bg-green-500/10",
  Learning: "bg-amber-400/10",
  Weak: "bg-red-500/10",
  "Needs Revision": "bg-orange-400/10",
  Unknown: "bg-violet-soft/30",
};

export const ConceptNode = memo(function ConceptNode({
  data,
  selected,
}: NodeProps & { data: ConceptData }) {
  const s = sizeMap[data.size];
  const masteryColor = MASTERY_COLOR[data.masteryStatus] ?? "";
  const masteryBgSel = MASTERY_BG_SELECTED[data.masteryStatus] ?? MASTERY_BG_SELECTED.Unknown;

  const artifacts = data.artifactCounts ?? { flashcards: 0, whiteboards: 0, revisions: 0, packages: 0 };
  const hasBadges = artifacts.flashcards > 0 || artifacts.whiteboards > 0 || artifacts.revisions > 0 || artifacts.packages > 0;

  const borderStyle: React.CSSProperties = masteryColor
    ? { borderColor: masteryColor, boxShadow: `0 0 0 1px ${masteryColor}33, 0 1px 3px ${masteryColor}22` }
    : {};

  return (
    <div
      style={borderStyle}
      className={cn(
        "relative cursor-pointer rounded-xl border bg-card text-center transition-all duration-150",
        s.wrapper,
        selected
          ? cn(masteryBgSel, "shadow-md")
          : "shadow-sm hover:border-foreground/25 hover:shadow-md",
      )}
    >
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

      {hasBadges && (
        <div className="mt-1.5 flex items-center justify-center gap-1">
          {artifacts.flashcards > 0 && (
            <span className="inline-block size-1.5 rounded-full bg-violet-500" title="Flashcards" />
          )}
          {artifacts.whiteboards > 0 && (
            <span className="inline-block size-1.5 rounded-full bg-blue-400" title="Whiteboards" />
          )}
          {artifacts.revisions > 0 && (
            <span className="inline-block size-1.5 rounded-full bg-green-500" title="Revisions" />
          )}
          {artifacts.packages > 0 && (
            <span className="inline-block size-1.5 rounded-full bg-amber-400" title="Learning Package" />
          )}
        </div>
      )}
    </div>
  );
});
