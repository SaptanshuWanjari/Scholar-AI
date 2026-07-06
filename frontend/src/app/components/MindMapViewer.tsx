import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  BackgroundVariant,
} from "@xyflow/react";

// Explicitly import styles
import "@xyflow/react/dist/style.css";

const nodeBase = {
  borderRadius: 8,
  border: "1px solid #e4e0d6",
  background: "#fffefb",
  color: "#211f1b",
  fontSize: 13,
  fontWeight: 500,
  padding: "10px 16px",
};

const initialNodes: Node[] = [
  { id: "root", position: { x: 380, y: 20 }, data: { label: "Neural Networks" }, style: { ...nodeBase, background: "#211f1b", border: "1px solid #211f1b", color: "#f6f5f1", fontWeight: 600 } },
  { id: "n1", position: { x: 120, y: 140 }, data: { label: "Architecture" }, style: { ...nodeBase, borderColor: "#4f4d7a" } },
  { id: "n2", position: { x: 380, y: 140 }, data: { label: "Training" }, style: { ...nodeBase, borderColor: "#4f4d7a" } },
  { id: "n3", position: { x: 640, y: 140 }, data: { label: "Regularization" }, style: { ...nodeBase, borderColor: "#4f4d7a" } },
  { id: "n1a", position: { x: 20, y: 260 }, data: { label: "Layers" }, style: nodeBase },
  { id: "n1b", position: { x: 180, y: 260 }, data: { label: "Activations" }, style: nodeBase },
  { id: "n2a", position: { x: 340, y: 260 }, data: { label: "Backpropagation" }, style: { ...nodeBase, borderColor: "#3f7a4e" } },
  { id: "n2b", position: { x: 520, y: 260 }, data: { label: "Optimizers" }, style: nodeBase },
  { id: "n3a", position: { x: 700, y: 260 }, data: { label: "Dropout" }, style: nodeBase },
  { id: "n2a1", position: { x: 300, y: 370 }, data: { label: "Chain Rule" }, style: nodeBase },
  { id: "n2a2", position: { x: 470, y: 370 }, data: { label: "Gradients" }, style: nodeBase },
];

const edgeStyle = { stroke: "#c8c2b5", strokeWidth: 1.5 };

const initialEdges: Edge[] = [
  { id: "e-r-1", source: "root", target: "n1", style: edgeStyle, animated: true },
  { id: "e-r-2", source: "root", target: "n2", style: edgeStyle, animated: true },
  { id: "e-r-3", source: "root", target: "n3", style: edgeStyle, animated: true },
  { id: "e-1-1a", source: "n1", target: "n1a", style: edgeStyle },
  { id: "e-1-1b", source: "n1", target: "n1b", style: edgeStyle },
  { id: "e-2-2a", source: "n2", target: "n2a", style: { stroke: "#4f4d7a", strokeWidth: 1.5 } },
  { id: "e-2-2b", source: "n2", target: "n2b", style: edgeStyle },
  { id: "e-3-3a", source: "n3", target: "n3a", style: edgeStyle },
  { id: "e-2a-1", source: "n2a", target: "n2a1", style: edgeStyle },
  { id: "e-2a-2", source: "n2a", target: "n2a2", style: edgeStyle },
];

export function MindMapViewer() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        proOptions={{ hideAttribution: true }}
        className="bg-background"
        minZoom={0.2}
        maxZoom={4}
        defaultEdgeOptions={{
          style: edgeStyle,
          animated: true,
        }}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#d8d3c7" />
        <Controls className="!border-border !bg-card [&_button]:!border-border [&_button]:!bg-card [&_button]:!fill-foreground [&_button:hover]:!bg-accent" />
        <MiniMap
          pannable
          zoomable
          nodeColor={(n) => (n.style?.background as string) || "#211f1b"}
          maskColor="rgba(246,245,241,0.7)"
          className="!border !border-border !bg-card"
        />
      </ReactFlow>
    </div>
  );
}
