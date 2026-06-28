import { Pencil, Trash2 } from "lucide-react";
import type { Course } from "../../lib/types";
import { cn } from "../../components/ui/utils";

interface CourseRowProps {
  course: Course;
  isSelected: boolean;
  onSelect: () => void;
  onRename: () => void;
  onDelete: () => void;
}

export function CourseRow({ course, isSelected, onSelect, onRename, onDelete }: CourseRowProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "group w-full text-left px-3 py-3 rounded-xl transition-colors flex items-center gap-3",
        isSelected
          ? "bg-sidebar-accent text-foreground"
          : "hover:bg-sidebar-accent/60 text-sidebar-foreground",
      )}
    >
      {isSelected && (
        <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-violet" />
      )}
      <div
        className="size-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold"
        style={{ backgroundColor: `${course.color}20`, color: course.color }}
      >
        {course.code.split(" ")[0].slice(0, 2)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium leading-snug">{course.name}</div>
        <div className="flex gap-2 text-[11px] text-muted-foreground mt-0.5">
          <span>{course.documents} docs</span>
          <span className="opacity-40">·</span>
          <span>{course.flashcards} cards</span>
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(); onRename(); }}
          className="size-6 flex items-center justify-center rounded-md hover:bg-accent text-muted-foreground"
        >
          <Pencil className="size-3" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="size-6 flex items-center justify-center rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="size-3" />
        </button>
      </div>
    </button>
  );
}
