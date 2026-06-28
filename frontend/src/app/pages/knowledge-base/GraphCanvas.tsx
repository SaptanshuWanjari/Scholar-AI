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
  activeCollection,
  onNodeClick,
  onNodeDoubleClick,
  onPaneClick,
}: {
  nodes: Node<ConceptData>[];
  edges: Edge[];
  selectedId: string | null;
  searchQuery: string;
  activeFilters: string[];
  activeCollection: string | null;
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

        const visible = searchMatch && collectionMatch && sourceMatch;

        return {
          ...n,
          selected: n.id === selectedId,
          style: { opacity: visible ? 1 : 0.12, transition: "opacity 0.2s" },
        };
      }),
    [sourceNodes, selectedId, q, activeFilters, activeCollection],
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
      fitViewOptions={{ padding: 0.22 }}
      proOptions={{ hideAttribution: true }}
      minZoom={0.3}
      maxZoom={3}
      className="bg-background"
      defaultEdgeOptions={{
        type: "smoothstep",
        style: { stroke: "#c8c2b5", strokeWidth: 1.5 },
      }}
    >
      <Background variant={BackgroundVariant.Dots} gap={28} size={1} color="#ddd8cc" />
      <Controls
        showInteractive={false}
        className="!border-border !bg-card [&_button]:!border-border [&_button]:!bg-card [&_button]:!fill-foreground [&_button:hover]:!bg-accent"
      />
    </ReactFlow>
  );
}
