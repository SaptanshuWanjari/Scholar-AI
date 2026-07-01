// @ts-nocheck
/**
 * AiAnswerBlock — Saved AI answer card.
 *
 * Visual pattern from existing BlockInner: violet border,
 * sparkles header, confidence + sources badge, question italic,
 * answer rendered as markdown.
 */

import { Sparkles, Gauge } from "lucide-react";
import { Badge } from "../../ui/badge";
import { MarkdownRenderer } from "../../MarkdownRenderer";
import type { V2Block } from "../../../lib/notebook-v2.types";

interface AiAnswerBlockProps {
  block: V2Block<"ai-answer">;
  pageId: string;
}

export function AiAnswerBlock({ block }: AiAnswerBlockProps) {
  const { question, answer, confidence, sources } = block.content;

  return (
    <div className="overflow-hidden rounded-xl border border-violet/25 bg-violet-soft/40">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-violet/15 px-5 py-3.5">
        <span className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-violet">
          <Sparkles className="size-4" /> Saved AI Answer
        </span>
        <Badge variant="outline" className="gap-1.5 border-violet/20 text-xs text-pencil/60">
          <Gauge className="size-3.5" />
          {(confidence * 100).toFixed(0)}% · {sources} sources
        </Badge>
      </div>

      {/* Body */}
      <div className="px-5 pb-4 pt-4">
        <div className="mb-3 font-reading text-lg font-medium italic text-ink">
          {question}
        </div>
        <MarkdownRenderer content={answer} className="text-base leading-relaxed" />
      </div>
    </div>
  );
}
