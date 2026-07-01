/**
 * BlockContainer — Universal draggable wrapper for all V2 blocks.
 *
 * Shows drag handle on hover, action dropdown, sticky notes,
 * and a blue drop-target indicator during drag.
 * Uses native HTML5 drag — no react-dnd dependency.
 */

import { useState, type ReactNode } from "react";
import {
  GripVertical,
  Trash2,
  Copy,
  StickyNote as StickyNoteIcon,
  ChevronDown,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import { cn } from "../../ui/utils";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { useNotebookV2Store } from "../../../stores/useNotebookV2Store";
import { StickyNote } from "../StickyNote";
import type { V2Block } from "../../../lib/notebook-v2.types";

interface BlockContainerProps {
  block: V2Block;
  pageId: string;
  index: number;
  children: ReactNode;
}

export function BlockContainer({ block, pageId, index, children }: BlockContainerProps) {
  const { deleteBlock, duplicateBlock, toggleCollapse, addStickyNote, moveBlock } =
    useNotebookV2Store();
  const [dragOver, setDragOver] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", String(index));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const fromIndex = Number(e.dataTransfer.getData("text/plain"));
    if (!Number.isNaN(fromIndex) && fromIndex !== index) {
      moveBlock(pageId, fromIndex, index);
    }
  };

  const isCollapsed = block.metadata.isCollapsed;
  const stickyNotes = block.metadata.stickyNotes;

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragEnd={() => setDragOver(false)}
      className={cn(
        "group/block relative flex gap-2 rounded-lg transition-colors",
        dragOver && "ring-2 ring-sky/50",
      )}
    >
      {/* Drop target indicator — blue line */}
      {dragOver && (
        <div className="absolute -top-px left-0 right-0 h-0.5 rounded-full bg-sky" />
      )}

      {/* Drag handle — visible on hover */}
      <div className="flex shrink-0 flex-col items-center pt-1 opacity-0 transition-opacity group-hover/block:opacity-100">
        <button
          type="button"
          className="cursor-grab rounded p-0.5 text-pencil/40 hover:bg-tape hover:text-pencil active:cursor-grabbing"
          aria-label="Drag to reorder"
        >
          <GripVertical className="size-4" />
        </button>
      </div>

      {/* Block body */}
      <div className="min-w-0 flex-1">
        {!isCollapsed && children}
        {isCollapsed && (
          <div className="rounded-lg border border-dashed border-tape bg-paper/50 px-3 py-2 text-xs text-pencil/50 italic">
            Collapsed block
          </div>
        )}

        {/* Sticky notes */}
        {stickyNotes.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {stickyNotes.map((note) => (
              <StickyNote key={note.id} note={note} blockId={block.id} pageId={pageId} />
            ))}
          </div>
        )}
      </div>

      {/* Action menu */}
      <div className="shrink-0 pt-1 opacity-0 transition-opacity group-hover/block:opacity-100">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-7">
              <MoreVertical className="size-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => toggleCollapse(pageId, block.id)}>
              {isCollapsed ? (
                <ChevronRight className="mr-2 size-4" />
              ) : (
                <ChevronDown className="mr-2 size-4" />
              )}
              {isCollapsed ? "Expand" : "Collapse"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => duplicateBlock(pageId, block.id)}>
              <Copy className="mr-2 size-4" /> Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => addStickyNote(pageId, block.id, "New note")}
            >
              <StickyNoteIcon className="mr-2 size-4" /> Add Sticky Note
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-brick"
              onClick={() => deleteBlock(pageId, block.id)}
            >
              <Trash2 className="mr-2 size-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
