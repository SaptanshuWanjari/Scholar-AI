import { useEffect, useRef, useState, useMemo } from "react";
import { ArrowUp, Gauge, Paperclip, Sparkles, Trash2, BookOpen, MessageSquare, Plus, GraduationCap, ShieldCheck, PanelRight } from "lucide-react";
import { motion } from "motion/react";
import { useChatStore } from "../stores/useChatStore";
import { useSettingsStore } from "../stores/useSettingsStore";
import { SourcePanel } from "../components/SourcePanel";
import { AnswerViewer } from "../components/AnswerViewer";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { api } from "../lib/api";
import type { Course, DocumentItem } from "../lib/types";

export function AskAI() {
  const { messages, isStreaming, ask, reset, course, setCourse, document, setDocument, sessions, activeSessionId, loadSessions, loadSession, deleteSession, socratic, setSocratic } = useChatStore();
  const streaming = useSettingsStore((s) => s.streaming);
  const ragMode = useSettingsStore((s) => s.ragMode);
  const setSettingsField = useSettingsStore((s) => s.set);
  const [input, setInput] = useState("");
  const [activeSource, setActiveSource] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [sessionsPanelOpen, setSessionsPanelOpen] = useState(true);
  const [sourcesPanelOpen, setSourcesPanelOpen] = useState(true);
  const [hoveredSessionId, setHoveredSessionId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.listCourses().then(setCourses).catch(() => setCourses([]));
    api.listDocuments().then(setDocuments).catch(() => setDocuments([]));
    loadSessions();
  }, []);

  const suggestions = useMemo(() => {
    const generic = [
      "Summarize the key concepts across my courses",
      "What are the most important formulas to remember?",
    ];
    if (!documents.length) return generic;

    const dynamic = documents
      .slice(0, 2)
      .map((doc) => `Explain the main topics in ${doc.title}`);

    return [...dynamic, ...generic].slice(0, 4);
  }, [documents]);

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
    ask(value, { stream: streaming, ragMode }).then(() => loadSessions());
    setInput("");
  };

  const jumpToSource = (index: number) => {
    const target = sources[index - 1];
    if (target) {
      setActiveSource(target.id);
      window.document
        .getElementById(`source-${index}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="flex h-full">
      {/* Sessions panel — collapsible, lg+ only */}
      <div
        className={`hidden lg:flex flex-col border-r border-border bg-sidebar overflow-hidden transition-all duration-200 ${
          sessionsPanelOpen ? "w-[220px]" : "w-0"
        }`}
      >
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-border px-3">
          <span className="text-xs font-medium text-muted-foreground">History</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 text-xs"
            onClick={() => { reset(); }}
          >
            <Plus className="size-3.5" /> New
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto py-1">
          {sessions.length === 0 ? (
            <p className="px-3 py-4 text-center text-xs text-muted-foreground">No sessions yet</p>
          ) : (
            sessions.map((s) => (
              <div
                key={s.id}
                className={`group relative mx-1 flex cursor-pointer items-start gap-2 rounded-md px-3 py-2 text-sm ${
                  s.id === activeSessionId
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "hover:bg-sidebar-accent/50"
                }`}
                onClick={() => loadSession(s.id)}
                onMouseEnter={() => setHoveredSessionId(s.id)}
                onMouseLeave={() => setHoveredSessionId(null)}
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-medium">{s.title}</div>
                  <div className="text-[10px] text-muted-foreground">
                    {s.messageCount} msg · {relativeTime(s.updatedAt)}
                  </div>
                </div>
                {hoveredSessionId === s.id && (
                  <button
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={(e) => { e.stopPropagation(); void deleteSession(s.id); }}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>


      {/* Answer — flex-1 */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Answer header */}
        <div className="flex h-12 items-center justify-between border-b border-border px-6">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => setSessionsPanelOpen((v) => !v)}
              title={sessionsPanelOpen ? "Hide history" : "Show history"}
            >
              <MessageSquare className="size-4" />
            </Button>
            <BookOpen className="size-4 text-muted-foreground" />
            Answer
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={course ?? "all"}
              onValueChange={(v) => setCourse(v === "all" ? null : v)}
            >
              <SelectTrigger className="h-8 w-44 bg-input-background text-xs">
                <SelectValue placeholder="All courses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All courses</SelectItem>
                {courses.map((c) => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={document ?? "all"}
              onValueChange={(v) => setDocument(v === "all" ? null : v)}
            >
              <SelectTrigger className="h-8 w-44 bg-input-background text-xs">
                <SelectValue placeholder="All documents" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All documents</SelectItem>
                {documents.filter(d => course ? d.course === course : true).map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {confidence !== undefined && !isStreaming && (
              <Badge
                variant="outline"
                className="gap-1.5 border-success/40 bg-success-soft text-success"
              >
                <Gauge className="size-3.5" />
                {(confidence * 100).toFixed(0)}% confidence
              </Badge>
            )}
            {/* RAG Mode toggle — always visible in header */}
            <button
              type="button"
              onClick={() => setSettingsField("ragMode", ragMode === "strict" ? "fallback" : "strict")}
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                ragMode === "strict"
                  ? "border-amber-500/50 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                  : "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20"
              }`}
              title={ragMode === "strict" ? "Strict RAG — click to switch to AI Fallback" : "AI Fallback — click to switch to Strict RAG"}
            >
              <ShieldCheck className="size-3" />
              {ragMode === "strict" ? "Strict RAG" : "AI Fallback"}
            </button>
            {/* Socratic Mode toggle */}
            <button
              type="button"
              onClick={() => setSocratic(!socratic)}
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                socratic
                  ? "border-violet-500/50 bg-violet-500/10 text-violet-600 hover:bg-violet-500/20"
                  : "border-border text-muted-foreground hover:border-border hover:text-foreground"
              }`}
              title={socratic ? "Socratic Mode ON — AI guides, does not answer" : "Enable Socratic Mode"}
            >
              <GraduationCap className="size-3" />
              Socratic
            </button>
            {messages.length > 0 && (
              <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs" onClick={reset}>
                <Trash2 className="size-3.5" /> Clear
              </Button>
            )}
            {/* Sources panel toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="size-8 hidden lg:inline-flex"
              onClick={() => setSourcesPanelOpen((v) => !v)}
              title={sourcesPanelOpen ? "Hide sources" : "Show sources"}
            >
              <PanelRight className="size-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-6 py-6">
            {messages.length === 0 ? (
              <EmptyAsk onPick={submit} suggestions={suggestions} />
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

      {/* Sources — collapsible right panel, lg+ only */}
      <div
        className={`hidden lg:flex flex-col border-l border-border bg-sidebar overflow-hidden transition-all duration-200 ${
          sourcesPanelOpen ? "w-[25%] min-w-[260px] max-w-[360px]" : "w-0"
        }`}
      >
        <SourcePanel sources={sources} activeId={activeSource} onSelect={setActiveSource} />
      </div>
    </div>
  );
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function EmptyAsk({ onPick, suggestions }: { onPick: (q: string) => void; suggestions: string[] }) {
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
