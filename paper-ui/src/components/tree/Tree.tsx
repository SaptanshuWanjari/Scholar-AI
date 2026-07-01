import React, { createContext, useContext, useState, useMemo } from "react";
import { ChevronRight, ChevronDown, Search } from "lucide-react";
import { cn } from "@paper-ui/utils";
import { SketchSurface } from "@paper-ui/core";

export type TreeVariant = "hand-drawn" | "outline";

interface TreeContextValue {
  variant: TreeVariant;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const TreeContext = createContext<TreeContextValue | null>(null);

function useTree() {
  const ctx = useContext(TreeContext);
  if (!ctx) throw new Error("Tree sub-components need <Tree> parent");
  return ctx;
}

function matchesLabel(label: string, query: string): boolean {
  if (!query) return true;
  return label.toLowerCase().includes(query.toLowerCase());
}

function hasVisibleDescendant(query: string, children: React.ReactNode): boolean {
  if (!query) return false;
  const q = query.toLowerCase();
  return React.Children.toArray(children).some((child) => {
    if (!React.isValidElement(child)) return false;
    const t = child.type as any;
    const label = String((child.props as any)?.label ?? "").toLowerCase();
    if (t?.displayName === "TreeLeaf" || t === LeafInner) return label.includes(q);
    if (t?.displayName === "TreeBranch" || t === BranchInner) {
      return label.includes(q) || hasVisibleDescendant(query, (child.props as any)?.children);
    }
    return false;
  });
}

/* ------------------------------------------------------------------ */
/*  TreeNode (internal base)                                           */
/* ------------------------------------------------------------------ */

interface TreeNodeProps {
  id: string;
  label: string;
  icon?: React.ReactNode;
  className?: string;
  startSlot?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
}

function TreeNode({ id: _id, label, icon, className, startSlot, onClick }: TreeNodeProps) {
  const { variant: _variant } = useTree();
  return (
    <div
      className={cn(
        "flex items-center gap-2 py-1 px-2 rounded-sm cursor-pointer select-none group",
        "hover:bg-paper-surface/50 transition-colors",
        className
      )}
      onClick={onClick}
    >
      <div className="w-4 h-4 flex items-center justify-center text-ink-muted group-hover:text-ink shrink-0">
        {startSlot}
      </div>
      {icon && (
        <div className="text-ink-muted/80 group-hover:text-ink transition-colors shrink-0">
          {icon}
        </div>
      )}
      <span className="font-kalam text-ink truncate">{label}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tree.ExpandButton                                                  */
/* ------------------------------------------------------------------ */

export interface TreeExpandButtonProps {
  expanded: boolean;
  onToggle: () => void;
}

function ExpandButtonInner({ expanded, onToggle }: TreeExpandButtonProps) {
  return (
    <button
      type="button"
      className="flex items-center justify-center"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      aria-label={expanded ? "Collapse" : "Expand"}
    >
      {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Tree.Branch                                                        */
/* ------------------------------------------------------------------ */

export interface TreeBranchProps {
  id: string;
  label: string;
  icon?: React.ReactNode;
  defaultExpanded?: boolean;
  children?: React.ReactNode;
  className?: string;
}

function BranchInner({ id, label, icon, defaultExpanded = false, children, className }: TreeBranchProps) {
  const { variant, searchQuery } = useTree();
  const [localExpanded, setLocalExpanded] = useState(defaultExpanded);

  const matchOwn = matchesLabel(label, searchQuery);
  const visibleKids = hasVisibleDescendant(searchQuery, children);
  const isVisible = matchOwn || visibleKids;
  const expanded = searchQuery ? matchOwn || visibleKids : localExpanded;

  if (!isVisible) return null;

  return (
    <div className={cn("flex flex-col relative", className)}>
      <TreeNode
        id={id}
        label={label}
        icon={icon}
        onClick={() => { if (!searchQuery) setLocalExpanded((p) => !p); }}
        startSlot={<ExpandButtonInner expanded={expanded} onToggle={() => { if (!searchQuery) setLocalExpanded((p) => !p); }} />}
      />

      {expanded && children && (
        <div className="flex flex-col relative ml-4 pl-4 border-l border-transparent">
          {variant === "hand-drawn" && (
            <svg
              className="absolute top-0 bottom-0 left-0 w-2 h-full -ml-[1px]"
              preserveAspectRatio="none"
            >
              <path
                d="M1,0 Q2,20 0,40 T1,1000"
                fill="none"
                stroke="var(--color-pencil)"
                strokeWidth="1"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          )}
          {variant === "outline" && (
            <div className="absolute top-0 bottom-0 left-0 border-l border-dotted border-ink-muted/50 -ml-[1px]" />
          )}
          <div className="py-1">{children}</div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tree.Leaf                                                          */
/* ------------------------------------------------------------------ */

export interface TreeLeafProps {
  id: string;
  label: string;
  icon?: React.ReactNode;
  className?: string;
}

function LeafInner({ id, label, icon, className }: TreeLeafProps) {
  const { searchQuery } = useTree();
  if (!matchesLabel(label, searchQuery)) return null;

  return (
    <div className={className}>
      <TreeNode
        id={id}
        label={label}
        icon={icon}
        startSlot={<span className="w-1 h-1 rounded-full bg-ink-muted/30" />}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tree.Search                                                        */
/* ------------------------------------------------------------------ */

export interface TreeSearchProps {
  placeholder?: string;
  className?: string;
}

function SearchInner({ placeholder = "Find files...", className }: TreeSearchProps) {
  const { setSearchQuery } = useTree();

  return (
    <div className={cn("flex items-center gap-2 px-2 py-1.5 mb-1", className)}>
      <Search size={14} className="shrink-0 text-ink-muted" />
      <input
        type="text"
        placeholder={placeholder}
        className="flex-1 border-none bg-transparent font-architect text-[13px] text-ink placeholder:font-architect placeholder:text-ink-muted/55 focus:outline-none"
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tree (parent)                                                      */
/* ------------------------------------------------------------------ */

export interface TreeProps {
  children?: React.ReactNode;
  variant?: TreeVariant;
  className?: string;
}

function TreeInner({ children, variant = "hand-drawn", className }: TreeProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const ctxValue = useMemo<TreeContextValue>(
    () => ({ variant, searchQuery, setSearchQuery }),
    [variant, searchQuery]
  );

  const content = (
    <TreeContext.Provider value={ctxValue}>
      <div className={cn("flex flex-col", className)}>{children}</div>
    </TreeContext.Provider>
  );

  if (variant === "outline") {
    return (
      <div className={cn("relative p-4", className)}>
        <SketchSurface />
        <div className="relative z-10">{content}</div>
      </div>
    );
  }

  return content;
}

/* ------------------------------------------------------------------ */
/*  Display names & compound export                                    */
/* ------------------------------------------------------------------ */

ExpandButtonInner.displayName = "TreeExpandButton";
BranchInner.displayName = "TreeBranch";
LeafInner.displayName = "TreeLeaf";
SearchInner.displayName = "TreeSearch";
TreeInner.displayName = "Tree";

export const Tree = Object.assign(TreeInner, {
  Branch: BranchInner,
  Leaf: LeafInner,
  ExpandButton: ExpandButtonInner,
  Search: SearchInner,
});

export { useTree };
