import type { Node, Edge } from "@xyflow/react";
import type { ConceptData } from "../../lib/graph-data";
import type { KGGraph } from "../../lib/api";
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide, forceX, forceY } from "d3-force";

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
  const CENTER = { x: 560, y: 360 };

  const simNodes = graph.nodes.map((n) => {
    return {
      id: n.id,
      data: {
        label: n.label,
        description: n.description,
        size: n.size,
        refCount: n.refCount,
        sourceCount: n.sourceCount,
        cluster: n.cluster as ConceptData["cluster"],
      } as ConceptData,
      x: CENTER.x + (Math.random() - 0.5) * 100,
      y: CENTER.y + (Math.random() - 0.5) * 100,
      radius: n.size === "large" ? 60 : n.size === "medium" ? 45 : 30, // for collision
    };
  });

  const simLinks = graph.edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.label,
  }));

  const simulation = forceSimulation(simNodes)
    .force(
      "link",
      forceLink(simLinks)
        .id((d: any) => d.id)
        .distance(150)
    )
    .force("charge", forceManyBody().strength(-800))
    .force("collide", forceCollide().radius((d: any) => d.radius + 20).iterations(2))
    .force("center", forceCenter(CENTER.x, CENTER.y))
    .force("x", forceX(CENTER.x).strength(0.05))
    .force("y", forceY(CENTER.y).strength(0.05))
    .stop();

  // Run simulation synchronously
  const ticks = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay()));
  for (let i = 0; i < ticks; ++i) {
    simulation.tick();
  }

  const nodes: Node<ConceptData>[] = simNodes.map((n) => ({
    id: n.id,
    type: "concept",
    position: { x: n.x, y: n.y },
    data: n.data,
  }));

  const edges: Edge[] = simLinks.map((e: any) => ({
    id: e.id,
    source: e.source.id,
    target: e.target.id,
    label: e.label,
    ...edgeBase,
  }));

  return { nodes, edges };
}
