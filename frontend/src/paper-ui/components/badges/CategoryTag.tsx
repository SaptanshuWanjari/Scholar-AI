import React from "react";
import { Tag } from "lucide-react";
import { PaperBadge } from "./PaperBadge";
import type { IconTone } from "@/paper-ui/core";

export interface CategoryTagProps {
  category: string;
  tone?: IconTone;
  className?: string;
}

export function CategoryTag({ category, tone = "sky", className }: CategoryTagProps) {
  return (
    <PaperBadge tone={tone} className={className}>
      <Tag size={10} strokeWidth={2} />
      {category}
    </PaperBadge>
  );
}
