import { useEffect, useRef, useState } from "react";
import { ArrowUp, Gauge, Paperclip, Sparkles, Trash2, BookOpen } from "lucide-react";
import { motion } from "motion/react";
import { useChatStore } from "../stores/useChatStore";
import { useSettingsStore } from "../stores/useSettingsStore";
import { SourcePanel } from "../components/SourcePanel";
import { AnswerViewer } from "../components/AnswerViewer";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { courses } from "../lib/mock-data";

const suggestions = [
  "Explain backpropagation using my lecture notes",
  "Compare SN1 and SN2 reaction mechanisms",
  "Summarize the IS-LM model with key formulas",
  "What are eigenvalues and why do they matter?",
];

export function AskAI() {
  const { messages, isStreaming, ask, reset } = useChatStore();
  const streaming = useSettingsStore((s) => s.streaming);
  const [input, setInput] = useState("");
  const [activeSource, setActiveSource] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
  const sources = lastAssistant?.sources ?? [];
  const confidence = lastAssistant?.confidence;

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const submit = (q?: string) => {
    const value = (q ?? input).trim();
    if (!value || isStreaming) return;
    ask(value);
    setInput("");
  };

  const jumpToSource = (index: number) => {
    const target = sources[index - 1];
    if (target) {
      setActiveSource(target.id);
      document
        .getElementById(`source-${index}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="flex h-full">
      {/* Sources — 25% */}
      <div className="hidden w-[25%] min-w-[260px] max-w-[360px] lg:block">
        <SourcePanel sources={sources} activeId={activeSource} onSelect={setActiveSource} />
      </div>

      {/* Answer — 75% */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Answer header */}
        <div className="flex h-12 items-center justify-between border-b border-border px-6">
          <div className="flex items-center gap-2 text-sm font-medium">
            <BookOpen className="size-4 text-muted-foreground" />
            Answer
          </div>
          <div className="flex items-center gap-2">
            {confidence !== undefined && !isStreaming && (
              <Badge
                variant="outline"
                className="gap-1.5 border-success/40 bg-success-soft text-success"
              >
                <Gauge className="size-3.5" />
                {(confidence * 100).toFixed(0)}% confidence
              </Badge>
            )}
            {messages.length > 0 && (
              <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs" onClick={reset}>
                <Trash2 className="size-3.5" /> Clear
              </Button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-6 py-6">
            {messages.length === 0 ? (
              <EmptyAsk onPick={submit} />
            ) : (
              <div className="space-y-4">
                {messages.map((m) => (
                  <AnswerViewer key={m.id} message={m} onCitationClick={jumpToSource} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sticky input */}
        <div className="border-t border-border bg-background/80 px-6 py-4 backdrop-blur-xl">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-end gap-2 rounded-2xl border border-border bg-card p-2 transition-colors focus-within:border-ring/60">
              <Button variant="ghost" size="icon" className="size-9 shrink-0 text-muted-foreground">
                <Paperclip className="size-[18px]" />
              </Button>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submit();
                  }
                }}
                rows={1}
                placeholder="Ask anything about your materials…"
                className="max-h-40 min-h-9 flex-1 resize-none bg-transparent py-1.5 text-sm outline-none placeholder:text-muted-foreground"
              />
              <Button
                size="icon"
                disabled={!input.trim() || isStreaming}
                onClick={() => submit()}
                className="size-9 shrink-0 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <ArrowUp className="size-[18px]" />
              </Button>
            </div>
            <div className="mt-2 flex items-center justify-between px-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Sparkles className="size-3 text-primary" />
                Grounded in {courses.length} courses · {streaming ? "Streaming on" : "Streaming off"}
              </span>
              <span>
                <kbd className="rounded border border-border bg-muted px-1 font-mono">Enter</kbd> to send ·{" "}
                <kbd className="rounded border border-border bg-muted px-1 font-mono">Shift+Enter</kbd> newline
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyAsk({ onPick }: { onPick: (q: string) => void }) {
  return (
    <div className="flex flex-col items-center pt-12 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex size-12 items-center justify-center rounded-xl border border-border bg-card text-violet"
      >
        <Sparkles className="size-6" />
      </motion.div>
      <h1 className="mt-5">Ask your knowledge base</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Get source-grounded answers with citations, drawn directly from your documents, notes and lectures.
      </p>
      <div className="mt-8 grid w-full max-w-xl gap-2 sm:grid-cols-2">
        {suggestions.map((s, i) => (
          <motion.button
            key={s}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.06 }}
            onClick={() => onPick(s)}
            className="rounded-xl border border-border bg-card p-3 text-left text-sm text-foreground/90 transition-colors hover:border-primary/50 hover:bg-violet-soft/40"
          >
            {s}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
