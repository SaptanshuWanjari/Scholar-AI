import { cn } from "@/paper-ui/utils";

export interface NotebookEdgeProps {
  className?: string;
  position?: "left" | "top";
  holes?: number;
}

export function NotebookEdge({ className, position = "left", holes = 12 }: NotebookEdgeProps) {
  return (
    <div 
      className={cn(
        "absolute pointer-events-none overflow-hidden",
        position === "left" && "top-0 bottom-0 -left-3 w-6 flex flex-col justify-evenly",
        position === "top" && "left-0 right-0 -top-3 h-6 flex flex-row justify-evenly",
        className
      )}
      aria-hidden
    >
      {Array.from({ length: holes }).map((_, i) => (
        <div 
          key={i} 
          className={cn(
            "rounded-full bg-[#fdfcfa] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.4)] border border-black/10",
            position === "left" && "w-3 h-3 -ml-1.5",
            position === "top" && "w-3 h-3 -mt-1.5"
          )}
        />
      ))}
    </div>
  );
}
