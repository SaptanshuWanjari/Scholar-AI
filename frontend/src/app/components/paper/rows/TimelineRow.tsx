import { cn } from "../../ui/utils";

export interface TimelineRowProps {
  label: string;
  sublabel?: string;
  status?: "done" | "active" | "pending";
  /** Hide the connector line below the dot (use on the last item). */
  isLast?: boolean;
  className?: string;
}

const DOT: Record<"done" | "active" | "pending", { bg: string; border: string }> = {
  done:    { bg: "#3f7a4e", border: "#3f7a4e" },
  active:  { bg: "#3a3733", border: "#3a3733" },
  pending: { bg: "transparent", border: "#9b9590" },
};

export function TimelineRow({ label, sublabel, status = "pending", isLast = false, className }: TimelineRowProps) {
  const dot = DOT[status];
  return (
    <div className={cn("flex gap-3", className)}>
      {/* Dot + vertical connector */}
      <div className="flex flex-col items-center">
        <span
          className="mt-0.5 shrink-0 rounded-full border"
          style={{ width: 10, height: 10, backgroundColor: dot.bg, borderColor: dot.border }}
        />
        {!isLast && (
          <div className="mt-1 flex-1 border-l border-dashed border-[#cfc8b8]" style={{ minHeight: 20 }} />
        )}
      </div>

      {/* Content */}
      <div className={cn("min-w-0 pb-3 leading-tight", isLast && "pb-0")}>
        <p
          className={cn(
            "font-kalam text-[14px]",
            status === "done" && "text-ink-muted line-through",
            status === "active" && "font-bold text-ink",
            status === "pending" && "text-ink-muted",
          )}
        >
          {label}
        </p>
        {sublabel && <p className="font-architect text-xs text-ink-muted">{sublabel}</p>}
      </div>
    </div>
  );
}
