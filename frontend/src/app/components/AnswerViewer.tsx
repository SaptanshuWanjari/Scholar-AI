import { useState } from "react";
import { Check, Copy, Sparkles, User } from "lucide-react";
import { motion } from "motion/react";
import type { ChatMessage } from "../lib/types";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { Button } from "./ui/button";

interface AnswerViewerProps {
  message: ChatMessage;
  onCitationClick?: (index: number) => void;
}

export function AnswerViewer({ message, onCitationClick }: AnswerViewerProps) {
  const [copied, setCopied] = useState(false);

  if (message.role === "user") {
    return (
      <div className="flex justify-end gap-3 py-2">
        <div className="max-w-[80%] rounded-2xl rounded-tr-sm border border-border bg-secondary px-4 py-2.5 text-sm">
          {message.content}
        </div>
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-card">
          <User className="size-4 text-muted-foreground" />
        </div>
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
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Sparkles className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        {message.content ? (
          <MarkdownRenderer
            content={message.content}
            onCitationClick={onCitationClick}
          />
        ) : (
          <div className="flex items-center gap-2 py-2 text-sm text-muted-foreground">
            <span className="flex gap-1">
              <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
              <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
              <span className="size-1.5 animate-bounce rounded-full bg-primary" />
            </span>
            Searching your knowledge base…
          </div>
        )}
        {message.streaming && message.content && (
          <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-primary align-middle" />
        )}
        {!message.streaming && message.content && (
          <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
            <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs" onClick={copy}>
              {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
              {copied ? "Copied" : "Copy answer"}
            </Button>
            <span className="text-xs text-muted-foreground">
              {message.sources?.length ?? 0} sources cited
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
