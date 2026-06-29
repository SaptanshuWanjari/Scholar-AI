import React from "react";
import { BookOpen } from "lucide-react";
import { PaperBadge } from "./PaperBadge";
import type { IconTone } from "../foundation/PaperIconCircle";

export interface CourseTagProps {
  course: string;
  tone?: IconTone;
  className?: string;
}

export function CourseTag({ course, tone = "ochre", className }: CourseTagProps) {
  return (
    <PaperBadge tone={tone} className={className}>
      <BookOpen size={10} strokeWidth={2} />
      {course}
    </PaperBadge>
  );
}
