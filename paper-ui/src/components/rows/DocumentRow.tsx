import { FileText } from "lucide-react";
import { cn } from "@paper-ui/utils";
import { StarDoodle, StarDoodleFilled } from "../doodles";

export interface DocumentRowProps {
  title: string;
  meta: string;
  date: string;
  /** Tailwind text-color class for the file glyph. */
  iconClass?: string;
  starred?: boolean;
  onToggleStar?: () => void;
}

/** A notebook-list document row with a hand-drawn star. */
export function DocumentRow({ title, meta, date, iconClass = "text-ink-muted", starred, onToggleStar }: DocumentRowProps) {
  return (
    <div className="group/doc flex items-center justify-between rounded-md px-4 py-3 transition-colors hover:bg-black/[0.025]">
      <div className="flex min-w-0 items-center gap-4">
        <FileText size={22} strokeWidth={1.6} className={cn("shrink-0", iconClass)} />
        <div className="min-w-0 leading-tight">
          <p className="truncate font-kalam text-[16px] font-bold tracking-wide text-ink">{title}</p>
          <p className="font-kalam text-[13px] text-ink-muted">{meta}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-6">
        <span className="font-architect text-[13px] tracking-wide text-ink-muted">{date}</span>
        <button
          onClick={onToggleStar}
          aria-label={starred ? "Unstar" : "Star"}
          className="text-ink-muted/70 transition-colors hover:text-ochre"
        >
          {starred ? <StarDoodleFilled size={20} /> : <StarDoodle size={20} />}
        </button>
      </div>
    </div>
  );
}
