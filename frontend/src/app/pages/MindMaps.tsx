import { useEffect, useMemo, useState } from "react";
import { Network, Sparkles, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { api, type GeneratedMindmap } from "../lib/api";
import type { Course } from "../lib/types";
import { toast } from "sonner";

const ALL_COURSES = "__all__";

interface TreeNode {
  id: string;
  label: string;
  depth: number;
  children: TreeNode[];
}

/**
 * Parse the backend's indented plain-text mind map into a tree.
 *
 * The backend returns a tree drawn with box characters (├──, └──, │) and/or
 * leading whitespace, e.g.
 *
 *   Neural Networks
 *   ├── Architecture
 *   │   ├── Layers
 *   │   └── Activations
 *   └── Training
 *       └── Backpropagation
 *
 * We compute depth from the leading indentation (counting the box-drawing
 * prefix), strip the connector glyphs, and nest by depth. This is tolerant of
 * pure-whitespace indentation as well.
 */
function parseMindmapText(text: string): TreeNode[] {
  const roots: TreeNode[] = [];
  // Stack of the last node seen at each depth so children attach to parents.
  const stack: TreeNode[] = [];
  let counter = 0;

  const lines = text.replace(/\r\n/g, "\n").split("\n");
  for (const raw of lines) {
    if (!raw.trim()) continue;

    // Measure indentation: everything up to the first "content" character.
    // Box-drawing prefixes look like "│   ├── " or "    └── " — each level is
    // roughly 4 columns wide. Strip connectors to get the label.
    const match = raw.match(/^([\s│|]*)(?:[├└+`]?[-─]{2,}\s*)?(.*)$/u);
    const indentRaw = match ? match[1] : "";
    let label = (match ? match[2] : raw).trim();
    // Defensive: strip any leftover leading connector glyphs.
    label = label.replace(/^[├└│|+`\-─\s]+/u, "").trim();
    if (!label) continue;

    // Width of the indentation in "columns". Tabs count as 4.
    const indentWidth = indentRaw.replace(/\t/g, "    ").length;
    const depth = Math.floor(indentWidth / 4);

    const node: TreeNode = { id: `n${counter++}`, label, depth, children: [] };

    // Pop the stack back to the parent depth.
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

function countNodes(nodes: TreeNode[]): number {
  return nodes.reduce((acc, n) => acc + 1 + countNodes(n.children), 0);
}

function TreeBranch({ node, isLast }: { node: TreeNode; isLast: boolean }) {
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
          {node.children.map((child, i) => (
            <TreeBranch key={child.id} node={child} isLast={i === node.children.length - 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function MindMaps() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [course, setCourse] = useState<string>(ALL_COURSES);
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [mindmap, setMindmap] = useState<GeneratedMindmap | null>(null);

  useEffect(() => {
    let active = true;
    api
      .listCourses()
      .then((cs) => {
        if (active) setCourses(cs);
      })
      .catch(() => {
        if (active) toast.error("Failed to load courses");
      });
    return () => {
      active = false;
    };
  }, []);

  const tree = useMemo(
    () => (mindmap?.text ? parseMindmapText(mindmap.text) : []),
    [mindmap],
  );
  const nodeCount = useMemo(() => countNodes(tree), [tree]);

  async function handleGenerate() {
    const trimmed = topic.trim();
    if (!trimmed) {
      toast.error("Enter a topic to generate a mind map");
      return;
    }
    setLoading(true);
    try {
      const result = await api.generateMindmap(
        trimmed,
        course === ALL_COURSES ? null : course,
      );
      if (!result.grounded || !result.text?.trim()) {
        toast.error("No grounded mind map could be generated for this topic");
        setMindmap(null);
        return;
      }
      setMindmap(result);
      toast.success("Mind map generated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to generate mind map");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center justify-between border-b border-border px-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Network className="size-4 text-primary" />
            <span className="text-sm font-medium">
              {mindmap?.title ?? "Knowledge Tree"}
            </span>
          </div>
          {mindmap && (
            <Badge variant="outline" className="border-cyan/40 bg-cyan-soft text-cyan">
              {nodeCount} {nodeCount === 1 ? "node" : "nodes"}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading) handleGenerate();
            }}
            placeholder="Topic to map…"
            className="w-56 bg-input-background"
            disabled={loading}
          />
          <Select value={course} onValueChange={setCourse} disabled={loading}>
            <SelectTrigger className="w-48 bg-input-background">
              <SelectValue placeholder="All courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_COURSES}>All courses</SelectItem>
              {courses.map((c) => (
                <SelectItem key={c.id} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" onClick={handleGenerate} disabled={loading} className="gap-1.5">
            {loading ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Sparkles className="size-3.5" />
            )}
            Generate
          </Button>
        </div>
      </div>

      <div className="relative min-h-0 flex-1">
        {loading ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="size-6 animate-spin" />
            <p className="text-sm">Generating mind map…</p>
          </div>
        ) : tree.length > 0 ? (
          <ScrollArea className="h-full">
            <div className="p-6">
              {mindmap?.course && (
                <p className="mb-4 text-xs uppercase tracking-wide text-muted-foreground">
                  {mindmap.course}
                </p>
              )}
              <ul className="flex flex-col gap-1.5">
                {tree.map((root) => (
                  <TreeBranch key={root.id} node={root} isLast />
                ))}
              </ul>
            </div>
          </ScrollArea>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center text-muted-foreground">
            <Network className="size-8 opacity-40" />
            <div>
              <p className="text-sm font-medium text-foreground">No mind map yet</p>
              <p className="mt-1 text-sm">
                Enter a topic and select a course, then press Generate to build a
                knowledge tree.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
