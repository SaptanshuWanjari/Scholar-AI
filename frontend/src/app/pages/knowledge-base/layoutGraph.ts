import type { Node, Edge } from "@xyflow/react";
import type { ConceptData } from "../../lib/graph-data";
import type { KGGraph } from "../../lib/api";

export const CLUSTER_SOURCE: Record<string, string> = {
  rag: "Documents",
  agent: "Answers",
  infra: "Notes",
  eval: "Quizzes",
};

const edgeBase = {
  type: "smoothstep" as const,
  style: { stroke: "#c8c2b5", strokeWidth: 1.5 },
  labelStyle: { fontSize: 9, fill: "#79736a", fontFamily: "Inter, sans-serif" },
  labelBgStyle: { fill: "#f6f5f1", fillOpacity: 0.9 },
  labelBgPadding: [3, 2] as [number, number],
  labelBgBorderRadius: 3,
};

const SIZE_WEIGHT: Record<ConceptData["size"], number> = {
  large: 3,
  medium: 2,
  small: 1,
};

export function layoutGraph(graph: KGGraph): {
  nodes: Node<ConceptData>[];
  edges: Edge[];
} {
  const ordered = [...graph.nodes].sort((a, b) => {
    const w = SIZE_WEIGHT[b.size] - SIZE_WEIGHT[a.size];
    if (w !== 0) return w;
    return b.refCount - a.refCount;
  });

  const CENTER = { x: 560, y: 360 };
  const RING_GAP = 230;

  const nodes: Node<ConceptData>[] = ordered.map((n, i) => {
    const data: ConceptData = {
      label: n.label,
      description: n.description,
      size: n.size,
      refCount: n.refCount,
      sourceCount: n.sourceCount,
      cluster: n.cluster as ConceptData["cluster"],
    };

    if (i === 0) {
      return { id: n.id, type: "concept", position: { ...CENTER }, data };
    }

    let idx = i - 1;
    let ring = 1;
    while (idx >= 6 * ring) {
      idx -= 6 * ring;
      ring += 1;
    }
    const slots = 6 * ring;
    const angle = (idx / slots) * 2 * Math.PI + (ring % 2 ? 0 : Math.PI / slots);
    const radius = ring * RING_GAP;

    return {
      id: n.id,
      type: "concept",
      position: {
        x: CENTER.x + radius * Math.cos(angle),
        y: CENTER.y + radius * Math.sin(angle),
      },
      data,
    };
  });

  const edges: Edge[] = graph.edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.label,
    ...edgeBase,
  }));

  return { nodes, edges };
}
