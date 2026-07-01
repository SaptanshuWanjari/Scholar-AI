import { memo, useEffect, useRef, useState } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import rough from "roughjs/bin/rough";
import type { ConceptData } from "../lib/graph-data";

const handleStyle: React.CSSProperties = {
  opacity: 0,
  width: 8,
  height: 8,
  pointerEvents: "none",
};

const positions = [Position.Top, Position.Right, Position.Bottom, Position.Left];

// Per-size config
const sizeMap = {
  large: { pad: "px-4 py-3", minW: 140, label: "text-[14px] font-bold", meta: "text-[10px]" },
  medium: { pad: "px-3.5 py-2.5", minW: 112, label: "text-[13px] font-semibold", meta: "text-[10px]" },
  small: { pad: "px-3 py-2", minW: 90, label: "text-[12px] font-medium", meta: "text-[10px]" },
};

const MASTERY_STROKE: Record<string, string> = {
  Mastered: "#3f7a4e",
  Learning: "#b07a2e",
  Weak: "#a3544a",
  "Needs Revision": "#b35a1a",
  Unknown: "#9c9484",
};

const MASTERY_FILL_SELECTED: Record<string, string> = {
  Mastered: "#e7efe4",
  Learning: "#f4e7d2",
  Weak: "#f1ddda",
  "Needs Revision": "#fce8d0",
  Unknown: "#f0eefa",
};

const MASTERY_DOT: Record<string, string> = {
  Mastered: "#22c55e",
  Learning: "#f59e0b",
  Weak: "#ef4444",
  "Needs Revision": "#f97316",
  Unknown: "#9c9484",
};

let _seed = 800;

// Inline rough.js node background
function PaperNodeBg({
  selected,
  masteryStatus,
}: {
  selected: boolean;
  masteryStatus: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const seedRef = useRef(_seed++);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const parent = hostRef.current?.parentElement;
    if (!parent) return;
    const ro = new ResizeObserver(([entry]) => {
      const box = entry.borderBoxSize?.[0];
      setSize({
        w: Math.round(box ? box.inlineSize : entry.contentRect.width),
        h: Math.round(box ? box.blockSize : entry.contentRect.height),
      });
    });
    ro.observe(parent);
    const r = parent.getBoundingClientRect();
    setSize({ w: Math.round(r.width), h: Math.round(r.height) });
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    const { w, h } = size;
    if (!svg || w < 2 || h < 2) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const rc = rough.svg(svg);
    const bleed = 6;
    const radius = 8;
    const x = bleed, y = bleed;
    const iw = w, ih = h;
    const r = Math.min(radius, iw / 2, ih / 2);

    const fill = selected
      ? MASTERY_FILL_SELECTED[masteryStatus] ?? MASTERY_FILL_SELECTED.Unknown
      : "#fffdf9";
    const stroke = MASTERY_STROKE[masteryStatus] ?? MASTERY_STROKE.Unknown;
    const strokeWidth = selected ? 2.0 : 1.4;
    const shadow = selected ? 4 : 2;

    const d =
      `M${x + r},${y} L${x + iw - r},${y} Q${x + iw},${y} ${x + iw},${y + r} ` +
      `L${x + iw},${y + ih - r} Q${x + iw},${y + ih} ${x + iw - r},${y + ih} ` +
      `L${x + r},${y + ih} Q${x},${y + ih} ${x},${y + ih - r} ` +
      `L${x},${y + r} Q${x},${y} ${x + r},${y} Z`;

    const node = rc.path(d, {
      fill,
      fillStyle: "solid",
      stroke,
      strokeWidth,
      roughness: 1.1,
      bowing: 0.6,
      seed: seedRef.current,
    });

    if (shadow) {
      node.setAttribute(
        "filter",
        `drop-shadow(${shadow}px ${shadow}px 0 rgba(0,0,0,0.13))`,
      );
    }
    svg.appendChild(node);
  }, [size, selected, masteryStatus]);

  const bleed = 6;
  const W = size.w + bleed * 2;
  const H = size.h + bleed * 2;

  return (
    <div
      ref={hostRef}
      className="pointer-events-none absolute"
      style={{ inset: -bleed }}
      aria-hidden
    >
      <svg
        ref={svgRef}
        width={W || 0}
        height={H || 0}
        viewBox={`0 0 ${W} ${H}`}
        className="absolute left-0 top-0 overflow-visible"
      />
    </div>
  );
}

export const ConceptNode = memo(function ConceptNode({
  data,
  selected,
}: NodeProps & { data: ConceptData }) {
  const s = sizeMap[data.size];
  const masteryColor = MASTERY_DOT[data.masteryStatus] ?? MASTERY_DOT.Unknown;
  const artifacts = data.artifactCounts ?? { flashcards: 0, whiteboards: 0, revisions: 0, packages: 0 };
  const hasBadges =
    artifacts.flashcards > 0 ||
    artifacts.whiteboards > 0 ||
    artifacts.revisions > 0 ||
    artifacts.packages > 0;

  return (
    <div
      className="relative cursor-pointer text-center"
      style={{ minWidth: s.minW }}
    >
      {/* Paper background drawn by rough.js */}
      <PaperNodeBg selected={!!selected} masteryStatus={data.masteryStatus} />

      {/* Invisible handles */}
      {positions.map((pos) => (
        <span key={pos}>
          <Handle type="target" position={pos} style={handleStyle} />
          <Handle type="source" position={pos} style={handleStyle} />
        </span>
      ))}

      {/* Content */}
      <div className={`relative z-[1] ${s.pad}`}>
        {/* Mastery dot */}
        <div className="mb-1 flex items-center justify-center gap-1">
          <span
            className="inline-block size-1.5 rounded-full"
            style={{ backgroundColor: masteryColor }}
          />
        </div>

        <div
          className={`font-architect leading-snug text-ink ${s.label} ${selected ? "text-[#4a3a8a]" : ""}`}
        >
          {data.label}
        </div>
        <div className="mt-0.5 font-kalam text-[10px] text-ink-muted">
          {data.refCount} refs · {data.sourceCount} src
        </div>

        {hasBadges && (
          <div className="mt-1.5 flex items-center justify-center gap-1">
            {artifacts.flashcards > 0 && (
              <span className="inline-block size-1.5 rounded-full bg-[#6f63a3]" title="Flashcards" />
            )}
            {artifacts.whiteboards > 0 && (
              <span className="inline-block size-1.5 rounded-full bg-[#4a6f91]" title="Whiteboards" />
            )}
            {artifacts.revisions > 0 && (
              <span className="inline-block size-1.5 rounded-full bg-[#3f7a4e]" title="Revisions" />
            )}
            {artifacts.packages > 0 && (
              <span className="inline-block size-1.5 rounded-full bg-[#b07a2e]" title="Learning Package" />
            )}
          </div>
        )}
      </div>
    </div>
  );
});
