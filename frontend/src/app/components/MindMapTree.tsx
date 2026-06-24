// Renders an indented-text mind map (as produced by the "mindmap" route) into
// a nested tree. Extracted from the Mind Maps page so the Teach Me workspace
// can reuse the exact same rendering.

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
  const accent =
    node.depth === 0
      ? "border-foreground bg-foreground text-background font-semibold"
      : node.depth === 1
        ? "border-cyan/40 bg-cyan-soft text-cyan"
        : "border-border bg-card text-foreground";

  return (
    <li className="relative">
      <span
        className={`inline-flex items-center rounded-md border px-2.5 py-1 text-[13px] leading-tight ${accent}`}
      >
        {node.label}
      </span>
      {node.children.length > 0 && (
        <ul className="ml-5 mt-1.5 flex flex-col gap-1.5 border-l border-border pl-4">
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
