import { useState } from "react";
import { Check, Copy, Sparkles, User } from "lucide-react";
import { motion } from "motion/react";
import type { ChatMessage } from "../lib/types";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { PaperIconCircle } from "@paper-ui/core";
import { Spinner, Shimmer } from "@paper-ui/components/loading";
import { GhostButton } from "@paper-ui/components/buttons";
import { cn } from "@paper-ui/utils";

interface AnswerViewerProps {
  message: ChatMessage;
  onCitationClick?: (index: number) => void;
}

export function AnswerViewer({ message, onCitationClick }: AnswerViewerProps) {
  const [copied, setCopied] = useState(false);
  const isError = message.content.startsWith("[Errno") || message.content.includes("Connection refused") || message.content.toLowerCase().includes("failed to fetch");

  if (message.role === "user") {
    return (
      <div className="flex justify-end gap-3 py-2">
        <div className="max-w-[80%] rounded-2xl rounded-tr-sm border border-border bg-[#fdfcf8] px-4 py-2.5 font-kalam text-[14px] text-ink shadow-sm">
          {message.content}
        </div>
        <PaperIconCircle tone="ink" size={32} className="shrink-0">
          <User className="size-4 text-ink-muted" />
        </PaperIconCircle>
      </div>
    );
  }

  const copy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 py-2"
    >
      <PaperIconCircle tone="lavender" size={32} className="shrink-0">
        <Sparkles className="size-4" />
      </PaperIconCircle>
      <div className="min-w-0 flex-1">
        {message.content ? (
          isError ? (
            <div className="flex items-center gap-2 font-kalam text-[#9f3a36] text-[15px] italic">
              <span>⚠️</span>
              <span>{message.content}</span>
            </div>
          ) : (
            <MarkdownRenderer
              content={message.content}
              onCitationClick={onCitationClick}
            />
          )
        ) : (
          <div className="flex flex-col gap-3 py-1">
            <div className="flex items-center gap-2 font-kalam text-[14px] text-ink-muted">
              <Spinner variant="scribble" size="sm" color="ink" className="inline-flex" />
              Searching your knowledge base…
            </div>
            <Shimmer className="space-y-2 max-w-xl">
              <Shimmer.Line width="90%" />
              <Shimmer.Line width="65%" />
            </Shimmer>
          </div>
        )}
        {message.streaming && message.content && (
          <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-primary align-middle" />
        )}
        {!message.streaming && message.content && (
          <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
            <GhostButton size="sm" className="h-8 gap-1.5 text-xs font-architect" onClick={copy}>
              {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
              {copied ? "Copied" : "Copy answer"}
            </GhostButton>
            <span className="text-xs font-architect text-ink-muted">
              {message.sources?.length ?? 0} sources cited
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
