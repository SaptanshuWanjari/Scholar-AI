import { useCallback, useEffect, useMemo } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeMouseHandler,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { ConceptNode } from "../../components/ConceptNode";
import type { ConceptData } from "../../lib/graph-data";
import { CLUSTER_SOURCE } from "./layoutGraph";

const nodeTypes = { concept: ConceptNode };

export function GraphCanvas({
  nodes: sourceNodes,
  edges: sourceEdges,
  selectedId,
  searchQuery,
  activeFilters,
  masteryFilters,
  activeCollection,
  degreeOfSeparation,
  distances,
  onNodeClick,
  onNodeDoubleClick,
  onPaneClick,
}: {
  nodes: Node<ConceptData>[];
  edges: Edge[];
  selectedId: string | null;
  searchQuery: string;
  activeFilters: string[];
  masteryFilters: string[];
  activeCollection: string | null;
  degreeOfSeparation: number | "all";
  distances: Record<string, number> | null;
  onNodeClick: (id: string) => void;
  onNodeDoubleClick: (id: string) => void;
  onPaneClick: () => void;
}) {
  const q = searchQuery.toLowerCase().trim();

  const styledNodes = useMemo(
    () =>
      sourceNodes.map((n) => {
        const cluster = n.data.cluster as string;

        const searchMatch = !q || n.data.label.toLowerCase().includes(q);
        const collectionMatch = !activeCollection || `col-${cluster}` === activeCollection;
        const nodeSourceType = CLUSTER_SOURCE[cluster];
        const sourceMatch = !nodeSourceType || activeFilters.includes(nodeSourceType);
        const masteryMatch = masteryFilters.length === 0 || masteryFilters.includes(n.data.masteryStatus);

        let degreeMatch = true;
        if (selectedId && degreeOfSeparation !== "all" && distances) {
          degreeMatch = distances[n.id] !== undefined;
        }

        const visible = searchMatch && collectionMatch && sourceMatch && degreeMatch && masteryMatch;

        return {
          ...n,
          selected: n.id === selectedId,
          style: { opacity: visible ? 1 : 0.12, transition: "opacity 0.2s" },
        };
      }),
    [sourceNodes, selectedId, q, activeFilters, masteryFilters, activeCollection, degreeOfSeparation, distances],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(styledNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(sourceEdges);

  useEffect(() => {
    setNodes(styledNodes);
  }, [styledNodes, setNodes]);
  useEffect(() => {
    setEdges(sourceEdges);
  }, [sourceEdges, setEdges]);

  const handleNodeClick: NodeMouseHandler = useCallback(
    (_, node) => onNodeClick(node.id),
    [onNodeClick],
  );
  const handleDblClick: NodeMouseHandler = useCallback(
    (_, node) => onNodeDoubleClick(node.id),
    [onNodeDoubleClick],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      onNodeClick={handleNodeClick}
      onNodeDoubleClick={handleDblClick}
      onPaneClick={onPaneClick}
      fitView
      fitViewOptions={{ padding: 0.26 }}
      proOptions={{ hideAttribution: true }}
      minZoom={0.3}
      maxZoom={3}
      style={{ background: "#f0ece2" }}
      defaultEdgeOptions={{
        type: "smoothstep",
        animated: false,
        style: {
          stroke: "#9c9484",
          strokeWidth: 1.6,
          strokeDasharray: "5 3",
        },
        labelStyle: {
          fontFamily: "'Architects Daughter', cursive",
          fontSize: 10,
          fill: "#9c9484",
          background: "#f0ece2",
        },
        labelBgStyle: {
          fill: "#f0ece2",
          fillOpacity: 1,
        },
        labelBgPadding: [4, 2] as [number, number],
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#b4ad9e",
          width: 14,
          height: 14,
        },
      }}
    >
      {/* Notebook-style line grid */}
      <Background
        variant={BackgroundVariant.Lines}
        gap={32}
        size={1}
        color="#ddd8cc"
        style={{ opacity: 0.5 }}
      />
      <Controls
        showInteractive={false}
        className="!rounded !border !border-[#d4cfc2] !bg-[#f9f6f0] [&_button]:!border-[#d4cfc2] [&_button]:!bg-[#f9f6f0] [&_button]:!fill-[#3a3733] [&_button:hover]:!bg-[#ede9df]"
      />
    </ReactFlow>
  );
}
