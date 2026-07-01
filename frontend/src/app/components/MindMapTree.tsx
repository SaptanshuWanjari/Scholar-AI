import { cn } from "@/paper-ui/utils";
import { SketchSurface } from "@/paper-ui/core";

interface TreeNode {
  id: string;
  label: string;
  depth: number;
  children: TreeNode[];
}

export function parseMindmapText(text: string): TreeNode[] {
  const roots: TreeNode[] = [];
  const stack: TreeNode[] = [];
  let counter = 0;

  const lines = text.replace(/\r\n/g, "\n").split("\n");
  for (const raw of lines) {
    if (!raw.trim()) continue;

    const match = raw.match(/^([\s│|]*)(?:[├└+`]?[-─]{2,}\s*)?(.*)$/u);
    const indentRaw = match ? match[1] : "";
    let label = (match ? match[2] : raw).trim();
    label = label.replace(/^[├└│|+`\-─\s]+/u, "").trim();
    if (!label) continue;

    const indentWidth = indentRaw.replace(/\t/g, "    ").length;
    const depth = Math.floor(indentWidth / 4);

    const node: TreeNode = { id: `n${counter++}`, label, depth, children: [] };

    while (stack.length && stack[stack.length - 1].depth >= depth) {
      stack.pop();
    }
    if (stack.length === 0) {
      roots.push(node);
    } else {
      stack[stack.length - 1].children.push(node);
    }
    stack.push(node);
  }

  return roots;
}

export function countNodes(nodes: TreeNode[]): number {
  return nodes.reduce((acc, n) => acc + 1 + countNodes(n.children), 0);
}

function TreeBranch({ node }: { node: TreeNode }) {
  const getStyleForDepth = (depth: number) => {
    switch (depth) {
      case 0:
        return {
          bg: "#fce4e4", // pinkish brick-soft
          fg: "#a3544a",
          font: "font-caveat text-[17px] font-bold"
        };
      case 1:
        return {
          bg: "#ddeeff", // blue/sky-soft
          fg: "#4a6f91",
          font: "font-kalam text-[14px]"
        };
      case 2:
        return {
          bg: "#dcf0d8", // green/sage-soft
          fg: "#3f7a4e",
          font: "font-kalam text-[13px]"
        };
      case 3:
        return {
          bg: "#fef3a3", // yellow/ochre-soft
          fg: "#b07a2e",
          font: "font-architect text-[12px]"
        };
      default:
        return {
          bg: "#fdfcfa", // plain paper
          fg: "#3a3733",
          font: "font-architect text-[12px]"
        };
    }
  };

  const style = getStyleForDepth(node.depth);

  return (
    <li className="relative my-1">
      <span
        className={cn(
          "relative inline-flex items-center px-3 py-1.5 leading-tight transition-transform hover:scale-[1.02]",
          style.font
        )}
        style={{ color: style.fg }}
      >
        <SketchSurface
          fill={style.bg}
          stroke={style.fg}
          strokeWidth={1.2}
          roughness={0.9}
          radius={5}
        />
        <span className="relative z-10">{node.label}</span>
      </span>
      {node.children.length > 0 && (
        <ul className="ml-5 mt-2 flex flex-col gap-2 pl-4 relative">
          <svg className="absolute top-0 bottom-2 left-0 w-2 h-full -ml-[1px]" preserveAspectRatio="none" aria-hidden>
            <path d="M1,0 Q3,20 0,40 T1,1000" fill="none" stroke="#a39e93" strokeWidth="1.2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>
          {node.children.map((child) => (
            <TreeBranch key={child.id} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
}

/** Render an indented-text mind map as a nested tree. */
export function MindMapTree({ text }: { text: string }) {
  const tree = parseMindmapText(text);
  return (
    <ul className="flex flex-col gap-1.5">
      {tree.map((root) => (
        <TreeBranch key={root.id} node={root} />
      ))}
    </ul>
  );
}
