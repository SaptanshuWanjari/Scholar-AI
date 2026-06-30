import React from "react";
import { cn } from "@/paper-ui/utils";
import { PaperCard } from "@/paper-ui/core";
import { PaperIconCircle } from "@/paper-ui/core";
import type { IconTone } from "@/paper-ui/core";
import {
  BookmarkDoodle,
  PencilDoodle,
  CompassDoodle,
  SparkleDoodle,
} from "../doodles";
import { SketchButton } from "../buttons/Buttons";

export type StudyActivityType = "read" | "review" | "practice" | "watch";

export interface StudyRecommendationProps {
  type: StudyActivityType;
  title: string;
  source?: string;
  estimatedTime?: string;
  reason?: string;
  badge?: React.ReactNode;
  onAction?: () => void;
  actionLabel?: string;
  className?: string;
}

const TYPE_TONE: Record<StudyActivityType, IconTone> = {
  read: "sky",
  review: "ochre",
  practice: "sage",
  watch: "lavender",
};

const TYPE_FG: Record<StudyActivityType, string> = {
  read: "#4a6f91",
  review: "#b07a2e",
  practice: "#3f7a4e",
  watch: "#6f63a3",
};

function ActivityDoodle({ type, color }: { type: StudyActivityType; color: string }) {
  switch (type) {
    case "read":
      return <BookmarkDoodle size={20} color={color} />;
    case "review":
      return <PencilDoodle size={20} color={color} />;
    case "practice":
      return <CompassDoodle size={20} color={color} />;
    case "watch":
      return <SparkleDoodle size={20} color={color} />;
  }
}

export function StudyRecommendation({
  type,
  title,
  source,
  estimatedTime,
  reason,
  badge,
  onAction,
  actionLabel = "Open",
  className,
}: StudyRecommendationProps) {
  const tone = TYPE_TONE[type];
  const fg = TYPE_FG[type];

  return (
    <PaperCard shadow="sm" className={cn("px-4 py-3", className)}>
      <div className="flex items-start gap-4">
        <PaperIconCircle tone={tone} size={40}>
          <ActivityDoodle type={type} color={fg} />
        </PaperIconCircle>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="font-kalam font-bold text-[15px] text-ink leading-snug">{title}</p>
            {estimatedTime && (
              <span className="font-architect text-xs text-ink-muted shrink-0">
                {estimatedTime}
              </span>
            )}
          </div>

          {(source || badge) && (
            <div className="flex items-center gap-2 mt-0.5">
              {source && (
                <span className="font-architect text-xs text-ink-muted">{source}</span>
              )}
              {badge}
            </div>
          )}

          {reason && (
            <p className="font-kalam text-sm text-ink-muted/80 italic mt-1">{reason}</p>
          )}

          <div className="flex justify-end mt-3">
            <SketchButton size="sm" onClick={onAction}>
              {actionLabel}
            </SketchButton>
          </div>
        </div>
      </div>
    </PaperCard>
  );
}
