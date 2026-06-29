import type { Node, Edge } from "@xyflow/react";
import { MarkerType } from "@xyflow/react";
import type { ConceptData } from "../../lib/graph-data";
import type { KGGraph } from "../../lib/api";
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide, forceX, forceY } from "d3-force";

export const CLUSTER_SOURCE: Record<string, string> = {
  rag: "Documents",
  agent: "Answers",
  infra: "Notes",
  eval: "Quizzes",
};

const semanticEdgeBase = {
  type: "smoothstep" as const,
  style: { stroke: "#c8c2b5", strokeWidth: 1.5 },
  labelStyle: { fontSize: 9, fill: "#79736a", fontFamily: "Inter, sans-serif" },
  labelBgStyle: { fill: "#f6f5f1", fillOpacity: 0.9 },
  labelBgPadding: [3, 2] as [number, number],
  labelBgBorderRadius: 3,
};

const prereqEdgeBase = {
  type: "smoothstep" as const,
  style: { stroke: "#a78bfa", strokeWidth: 1.5, strokeDasharray: "5 3" },
  markerEnd: { type: MarkerType.ArrowClosed, color: "#a78bfa" },
  labelStyle: { fontSize: 9, fill: "#7c3aed", fontFamily: "Inter, sans-serif" },
  labelBgStyle: { fill: "#f5f3ff", fillOpacity: 0.9 },
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
        cluster: n.cluster,
        masteryStatus: n.masteryStatus ?? "Unknown",
        masteryScore: n.masteryScore ?? 0,
        importance: n.importance ?? 0.5,
        artifactCounts: n.artifactCounts ?? { flashcards: 0, whiteboards: 0, revisions: 0, packages: 0 },
      } as ConceptData,
      x: CENTER.x + (Math.random() - 0.5) * 100,
      y: CENTER.y + (Math.random() - 0.5) * 100,
      radius: n.size === "large" ? 60 : n.size === "medium" ? 45 : 30,
    };
  });

  const simLinks = graph.edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.label,
    edgeType: e.edgeType ?? "semantic",
  }));

  const simulation = forceSimulation(simNodes)
    .force(
      "link",
      forceLink(simLinks)
        .id((d: any) => d.id)
        .distance(240)
    )
    .force("charge", forceManyBody().strength(-1500))
    .force("collide", forceCollide().radius((d: any) => d.radius + 45).iterations(2))
    .force("center", forceCenter(CENTER.x, CENTER.y))
    .force("x", forceX(CENTER.x).strength(0.04))
    .force("y", forceY(CENTER.y).strength(0.04))
    .stop();

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

  const edges: Edge[] = simLinks.map((e: any) => {
    const isPrereq = e.edgeType === "prerequisite";
    return {
      id: e.id,
      source: e.source.id,
      target: e.target.id,
      label: e.label,
      ...(isPrereq ? prereqEdgeBase : semanticEdgeBase),
    };
  });

  return { nodes, edges };
}
