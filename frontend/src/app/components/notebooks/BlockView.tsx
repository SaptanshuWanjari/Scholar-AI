import {
  GripVertical,
  ChevronRight,
  ChevronDown,
  Wand2,
  Trash2,
  Merge,
  FolderOutput,
} from "lucide-react";
import { cn } from "../ui/utils";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import type { NotebookBlock } from "../../lib/notebook-data";
import type { NotebookMeta } from "../../lib/api";
import { BlockEditor } from "./BlockEditor";
import { BlockInner } from "./BlockInner";
import { EDITABLE_TYPES, blockLabel } from "./utils";

export function BlockView({
  block,
  index,
  collapsed,
  onToggleCollapse,
  editing,
  dragging,
  dropTarget,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onMerge,
  onUngroup,
  onDeleteNote,
  onUpdateNote,
  onDragStart,
  onDragEnter,
  onDragEnd,
  availableNotebooks,
  onMoveToNotebook,
}: {
  block: NotebookBlock;
  index: number;
  collapsed: boolean;
  onToggleCollapse: () => void;
  editing: boolean;
  dragging: boolean;
  dropTarget: boolean;
  onEdit: () => void;
  onSave: (patch: Partial<NotebookBlock>) => void;
  onCancel: () => void;
  onDelete: () => void;
  onMerge?: () => void;
  onUngroup?: (noteIndex: number) => void;
  onDeleteNote?: (noteIndex: number) => void;
  onUpdateNote?: (noteIndex: number, newRaw: string) => void;
  onDragStart: () => void;
  onDragEnter: () => void;
  onDragEnd: () => void;
  availableNotebooks?: NotebookMeta[];
  onMoveToNotebook?: (notebookId: string) => void;
}) {
  const editable = EDITABLE_TYPES.has(block.type);
  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={onDragEnter}
      className={cn(
        "group/block relative -mx-3 rounded-lg px-3 py-1 transition-colors hover:bg-accent/20",
        dragging && "opacity-40",
        dropTarget &&
          "before:absolute before:-top-1 before:left-3 before:right-3 before:h-0.5 before:rounded-full before:bg-violet",
      )}
    >
      {!editing && (
        <div className="absolute -left-3 top-2 flex items-center opacity-0 transition-opacity group-hover/block:opacity-100">
          <span
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            className="cursor-grab active:cursor-grabbing"
            title="Drag to reorder"
          >
            <GripVertical className="size-4 text-muted-foreground" />
          </span>
        </div>
      )}

      {!editing && (
        <div className="absolute -top-1 right-1 z-10 flex items-center gap-0.5 opacity-0 transition-opacity group-hover/block:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            className="size-6 bg-card/80 backdrop-blur"
            onClick={onToggleCollapse}
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? (
              <ChevronRight className="size-3.5 text-muted-foreground" />
            ) : (
              <ChevronDown className="size-3.5 text-muted-foreground" />
            )}
          </Button>
          {onMerge && (
            <Button
              variant="ghost"
              size="icon"
              className="size-6 bg-card/80 backdrop-blur hover:text-primary"
              onClick={onMerge}
              title="Group with note above"
            >
              <Merge className="size-3.5 text-muted-foreground hover:text-primary" />
            </Button>
          )}
          {editable && (
            <Button
              variant="ghost"
              size="icon"
              className="size-6 bg-card/80 backdrop-blur"
              onClick={onEdit}
              title="Edit"
            >
              <Wand2 className="size-3.5 text-muted-foreground" />
            </Button>
          )}
          {availableNotebooks && availableNotebooks.length > 0 && onMoveToNotebook && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6 bg-card/80 backdrop-blur hover:text-primary"
                  title="Move to notebook"
                >
                  <FolderOutput className="size-3.5 text-muted-foreground hover:text-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                {availableNotebooks.map((nb) => (
                  <DropdownMenuItem
                    key={nb.id}
                    onClick={() => onMoveToNotebook(nb.id)}
                  >
                    {nb.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="size-6 bg-card/80 backdrop-blur hover:text-destructive"
            onClick={onDelete}
            title="Delete"
          >
            <Trash2 className="size-3.5 text-muted-foreground hover:text-destructive" />
          </Button>
        </div>
      )}

      {editing ? (
        <BlockEditor block={block} onSave={onSave} onCancel={onCancel} />
      ) : collapsed ? (
        <button
          onClick={onToggleCollapse}
          className="flex w-full items-center gap-2 py-1.5 text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
          title="Expand block"
        >
          <ChevronRight className="size-4 shrink-0" />
          <span className="truncate font-medium">{blockLabel(block)}</span>
          <span className="ml-auto shrink-0 text-[10px] uppercase tracking-wide opacity-50">
            {block.type}
          </span>
        </button>
      ) : (
        <BlockInner block={block} onUngroup={onUngroup} onDeleteNote={onDeleteNote} onUpdateNote={onUpdateNote} />
      )}
    </div>
  );
}
