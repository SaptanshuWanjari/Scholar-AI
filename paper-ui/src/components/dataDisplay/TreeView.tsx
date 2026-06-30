import React, { useState } from "react";
import { cn } from "@paper-ui/utils";
import { ChevronRight, ChevronDown, Folder, File } from "lucide-react";
import { SketchSurface } from "@paper-ui/core";

export type TreeViewVariant = "outline" | "hand-drawn";

export interface TreeViewProps {
  children: React.ReactNode;
  variant?: TreeViewVariant;
  className?: string;
}

const TreeViewContext = React.createContext<{ variant: TreeViewVariant }>({ variant: "hand-drawn" });

export function TreeView({ children, variant = "hand-drawn", className }: TreeViewProps) {
  const content = (
    <div className={cn("flex flex-col", className)}>
      <TreeViewContext.Provider value={{ variant }}>
        {children}
      </TreeViewContext.Provider>
    </div>
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

export interface TreeItemProps {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
}

export function TreeItem({ id, label, icon, children, defaultExpanded = false, className }: TreeItemProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const { variant } = React.useContext(TreeViewContext);
  const isFolder = !!children;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFolder) {
      setExpanded((prev) => !prev);
    }
  };

  return (
    <div className={cn("flex flex-col relative", className)}>
      <div 
        className={cn(
          "flex items-center gap-2 py-1 px-2 rounded-sm cursor-pointer select-none group",
          "hover:bg-paper-surface/50 transition-colors"
        )}
        onClick={handleToggle}
      >
        <div className="w-4 h-4 flex items-center justify-center text-ink-muted group-hover:text-ink">
          {isFolder ? (
            expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
          ) : (
            <span className="w-1 h-1 rounded-full bg-ink-muted/30" />
          )}
        </div>
        
        <div className="text-ink-muted/80 group-hover:text-ink transition-colors">
          {icon ? icon : isFolder ? (expanded ? <Folder size={16} className="text-ink/60" fill="currentColor" fillOpacity={0.2} /> : <Folder size={16} />) : <File size={16} />}
        </div>
        
        <span className="font-kalam text-ink">
          {label}
        </span>
      </div>

      {isFolder && expanded && (
        <div className="flex flex-col relative ml-4 pl-4 border-l">
          {variant === "outline" && (
            <div className="absolute top-0 bottom-0 left-0 border-l border-dotted border-ink-muted/50 -ml-[1px]" />
          )}
          {variant === "hand-drawn" && (
            <svg className="absolute top-0 bottom-0 left-0 w-2 h-full -ml-[1px]" preserveAspectRatio="none">
              <path d="M1,0 Q2,20 0,40 T1,1000" fill="none" stroke="var(--color-pencil)" strokeWidth="1" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            </svg>
          )}
          <div className="py-1">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
