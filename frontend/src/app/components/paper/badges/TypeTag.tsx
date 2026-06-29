import React from "react";
import { PaperBadge } from "./PaperBadge";
import type { IconTone } from "../foundation/PaperIconCircle";

const TYPE_TONES: Record<string, IconTone> = {
  pdf: "brick",
  md: "sage",
  markdown: "sage",
  txt: "ink",
  text: "ink",
  docx: "sky",
  doc: "sky",
};

const TYPE_LABELS: Record<string, string> = {
  pdf: "PDF",
  md: "Markdown",
  markdown: "Markdown",
  txt: "Text",
  text: "Text",
  docx: "Word",
  doc: "Word",
};

export interface TypeTagProps {
  type: string;
  className?: string;
}

export function TypeTag({ type, className }: TypeTagProps) {
  const key = type.toLowerCase();
  const tone: IconTone = TYPE_TONES[key] ?? "ink";
  const label = TYPE_LABELS[key] ?? type.toUpperCase();
  return (
    <PaperBadge tone={tone} className={className}>
      {label}
    </PaperBadge>
  );
}
