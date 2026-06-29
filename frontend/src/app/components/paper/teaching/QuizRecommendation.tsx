import React from "react";
import { cn } from "../../ui/utils";
import { PaperCard } from "../foundation/Paper";
import { PaperIconCircle } from "../foundation/PaperIconCircle";
import { CompassDoodle } from "../doodles";
import { SketchButton } from "../buttons/Buttons";

export interface QuizRecommendationProps {
  title: string;
  questionCount?: number;
  difficulty?: string;
  badge?: React.ReactNode;
  reason?: string;
  onStart?: () => void;
  className?: string;
}

export function QuizRecommendation({
  title,
  questionCount,
  difficulty,
  badge,
  reason,
  onStart,
  className,
}: QuizRecommendationProps) {
  const meta = [
    questionCount !== undefined ? `${questionCount} questions` : null,
    difficulty ?? null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <PaperCard shadow="sm" className={cn("px-4 py-3", className)}>
      <div className="flex items-start gap-4">
        <PaperIconCircle tone="lavender" size={40}>
          <CompassDoodle size={20} color="#6f63a3" />
        </PaperIconCircle>

        <div className="flex-1 min-w-0">
          <p className="font-kalam font-bold text-[15px] text-ink leading-snug">{title}</p>

          {(meta || badge) && (
            <div className="flex items-center gap-2 mt-0.5">
              {meta && (
                <span className="font-architect text-xs text-ink-muted">{meta}</span>
              )}
              {badge}
            </div>
          )}

          {reason && (
            <p className="font-kalam text-sm text-ink-muted/80 italic mt-1">{reason}</p>
          )}

          <div className="flex justify-end mt-3">
            <SketchButton size="sm" onClick={onStart}>
              Start Quiz
            </SketchButton>
          </div>
        </div>
      </div>
    </PaperCard>
  );
}
