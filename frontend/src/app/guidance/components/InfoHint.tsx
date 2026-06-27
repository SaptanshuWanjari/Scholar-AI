import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../../components/ui/tooltip";

/**
 * Layer 3 — inline help. A small "?" icon that reveals a concise explanation on
 * hover/focus. Drop it next to any unfamiliar control:
 *   <Label>Top-K <InfoHint text="How many chunks to retrieve per query." /></Label>
 */
export function InfoHint({
  text,
  label = "More information",
  className,
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={label}
          className={
            "inline-flex size-4 items-center justify-center rounded-full text-muted-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 " +
            (className ?? "")
          }
        >
          <HelpCircle className="size-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs text-balance">{text}</TooltipContent>
    </Tooltip>
  );
}
