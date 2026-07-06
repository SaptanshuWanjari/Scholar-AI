import { HelpCircle } from "lucide-react";
import { PaperTooltip } from "@/paper-ui/components/dialogs";

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
    <PaperTooltip content={text} placement="top">
      <button
        type="button"
        aria-label={label}
        className={
          "inline-flex size-4 items-center justify-center rounded-full text-muted-foreground/70 transition-colors hover:text-foreground " +
          (className ?? "")
        }
      >
        <HelpCircle className="size-3.5" />
      </button>
    </PaperTooltip>
  );
}
