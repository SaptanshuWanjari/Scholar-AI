// @ts-nocheck
import { CheckCircle2, Trophy } from "lucide-react";
import { cn } from "../../ui/utils";
import type { V2Block } from "../../../lib/notebook-v2.types";

export function QuizResultsBlock({ block }: { block: V2Block<"quiz-results">; pageId: string }) {
  const { title, score, total } = block.content;
  
  const percentage = Math.round((score / total) * 100) || 0;
  
  let resultColor = "text-sage";
  let resultBg = "bg-sage/10";
  let resultBorder = "border-sage/20";
  
  if (percentage < 50) {
    resultColor = "text-brick";
    resultBg = "bg-brick/10";
    resultBorder = "border-brick/20";
  } else if (percentage < 80) {
    resultColor = "text-ochre";
    resultBg = "bg-ochre/10";
    resultBorder = "border-ochre/20";
  }

  return (
    <div className={cn("group/qr flex w-full flex-col overflow-hidden rounded-xl border border-tape bg-paper shadow-sm", resultBorder)}>
      <div className={cn("flex items-center gap-4 border-b px-5 py-4", resultBg, resultBorder)}>
        <div className={cn("flex size-12 shrink-0 items-center justify-center rounded-full bg-white/60", resultColor)}>
          {percentage >= 80 ? <Trophy className="size-6" /> : <CheckCircle2 className="size-6" />}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/40">Quiz Results</p>
          <h3 className="truncate text-lg font-bold text-ink">{title || "Practice Quiz"}</h3>
        </div>
        <div className="flex flex-col items-end">
          <span className={cn("text-2xl font-bold", resultColor)}>{percentage}%</span>
          <span className="text-xs font-medium text-ink/50">{score} out of {total} correct</span>
        </div>
      </div>
      <div className="bg-white/40 px-5 py-3 text-sm text-ink/70">
        <p>This quiz has been saved to your learning history. You can retake it anytime from the Quiz section.</p>
      </div>
    </div>
  );
}
