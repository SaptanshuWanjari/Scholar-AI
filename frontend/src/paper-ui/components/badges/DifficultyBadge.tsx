import React from "react";
import { PaperBadge } from "./PaperBadge";
import type { IconTone } from "@/paper-ui/core";

export type Difficulty = "Easy" | "Medium" | "Hard";

const TONES: Record<Difficulty, IconTone> = {
  Easy: "sage",
  Medium: "ochre",
  Hard: "brick",
};

export interface DifficultyBadgeProps {
  difficulty: Difficulty;
  /** Show a filled dot indicator matching the tone color. */
  showIcon?: boolean;
  className?: string;
}

export function DifficultyBadge({ difficulty, showIcon = false, className }: DifficultyBadgeProps) {
  return (
    <PaperBadge tone={TONES[difficulty]} className={className}>
      {showIcon && (
        <span
          aria-hidden
          style={{
            display: "inline-block",
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: "currentColor",
            flexShrink: 0,
          }}
        />
      )}
      {difficulty}
    </PaperBadge>
  );
}
