import { Clock } from "lucide-react";
import { PaperIconCircle } from "../foundation/PaperIconCircle";

export interface SessionRowProps {
  text: string;
  subtext?: string;
  duration: string;
  ago: string;
}

/** A minimal recent-session line with a clock and handwritten timestamp. */
export function SessionRow({ text, subtext = "—", duration, ago }: SessionRowProps) {
  return (
    <div className="flex items-start gap-3 py-1">
      <PaperIconCircle tone="sage" size={30} className="mt-0.5">
        <Clock size={15} />
      </PaperIconCircle>
      <div className="min-w-0 flex-1 leading-tight">
        <p className="truncate font-kalam text-[15px] font-bold text-ink" title={text}>
          {text}
        </p>
        <p className="font-kalam text-xs text-ink-muted">{subtext}</p>
      </div>
      <div className="shrink-0 text-right leading-tight">
        <p className="font-architect text-[13px] text-ink">{duration}</p>
        <p className="font-architect text-[11px] text-ink-muted">{ago}</p>
      </div>
    </div>
  );
}
