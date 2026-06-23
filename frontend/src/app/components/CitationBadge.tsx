import { cn } from "./ui/utils";

interface CitationBadgeProps {
  index: number;
  onClick?: (index: number) => void;
  className?: string;
}

export function CitationBadge({ index, onClick, className }: CitationBadgeProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(index)}
      className={cn(
        "mx-0.5 inline-flex h-[18px] min-w-[18px] translate-y-[-1px] items-center justify-center rounded border border-violet/40 bg-violet-soft px-1 align-baseline font-mono text-[10px] font-medium text-violet transition-colors hover:bg-violet hover:text-white",
        className,
      )}
      aria-label={`Jump to source ${index}`}
    >
      {index}
    </button>
  );
}
