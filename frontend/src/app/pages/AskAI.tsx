import { useEffect, useRef, useState, useMemo } from "react";
import {
  ArrowUp,
  Gauge,
  Sparkles,
  Trash2,
  BookOpen,
  MessageSquare,
  Plus,
  GraduationCap,
  ShieldCheck,
  PanelRight,
} from "lucide-react";
import { motion } from "motion/react";
import { useChatStore } from "../stores/useChatStore";
import { useSettingsStore } from "../stores/useSettingsStore";
import { SourcePanel } from "../components/SourcePanel";
import { AnswerViewer } from "../components/AnswerViewer";
import { PaperButton, GhostButton, IconButton, ToggleButton } from "@paper-ui/components/buttons";
import { PaperBadge } from "@paper-ui/components/badges";
import { PaperSelect } from "@paper-ui/components/inputs";
import { ScrollArea } from "@paper-ui/components/layout";
import { PaperSheetBorder } from "@paper-ui/core";
import { SectionLabel, PaperH1, PaperIconCircle, PaperCard } from "@paper-ui/core";
import { SketchDivider } from "@paper-ui/components/decorations";
import { api } from "../lib/api";
import type { Course, DocumentItem } from "../lib/types";

export function AskAI() {
  const {
    messages, isStreaming, ask, reset, course, setCourse, document, setDocument,
    sessions, activeSessionId, loadSessions, loadSession, deleteSession,
    socratic, setSocratic, highlightsOnly, setHighlightsOnly,
  } = useChatStore();
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
    const dynamic = documents.slice(0, 2).map((doc) => `Explain the main topics in ${doc.title}`);
    return [...dynamic, ...generic].slice(0, 4);
  }, [documents]);

  const courseOptions = useMemo(() => [
    { value: "all", label: "All courses" },
    ...courses.map((c) => ({ value: c.name, label: c.name })),
  ], [courses]);

  const documentOptions = useMemo(() => [
    { value: "all", label: "All documents" },
    ...documents
      .filter((d) => (course ? d.course === course : true))
      .map((d) => ({ value: d.id, label: d.title })),
  ], [documents, course]);

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
      {/* ── Left: Sessions panel ── */}
      <div
        className={`hidden lg:flex flex-col overflow-hidden transition-all duration-200 ${
          sessionsPanelOpen ? "w-[220px]" : "w-0"
        }`}
      >
        <div className="relative flex min-h-0 flex-1 flex-col">
          <PaperSheetBorder fill="#fdfcf8" stroke="#c0b9ae" strokeWidth={1.2} shadow={0} />
          <div className="relative z-[1] flex flex-1 flex-col">
            {/* Header */}
            <div className="flex h-12 shrink-0 items-center justify-between px-4">
              <SectionLabel>History</SectionLabel>
              <GhostButton
                size="sm"
                className="h-7 gap-1 px-2"
                onClick={() => { reset(); }}
              >
                <Plus className="size-3.5" /> New
              </GhostButton>
            </div>

            <SketchDivider variant="dashed" className="mx-3 opacity-40" />

            <ScrollArea className="flex-1 mt-1">
              {sessions.length === 0 ? (
                <p className="font-kalam px-4 py-8 text-center text-sm text-ink-muted">
                  No sessions yet
                </p>
              ) : (
                <div className="space-y-0.5 px-2 pb-3 pt-1">
                  {sessions.map((s) => (
                    <div
                      key={s.id}
                      className={`group flex cursor-pointer items-start gap-2 rounded-lg px-3 py-2.5 transition-colors ${
                        s.id === activeSessionId
                          ? "bg-black/5 text-ink"
                          : "text-ink-muted hover:bg-black/[0.03] hover:text-ink"
                      }`}
                      onClick={() => loadSession(s.id)}
                      onMouseEnter={() => setHoveredSessionId(s.id)}
                      onMouseLeave={() => setHoveredSessionId(null)}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-architect text-[13px]">{s.title}</div>
                        <div className="mt-0.5 font-kalam text-[11px] text-ink-muted/70">
                          {s.messageCount} msg · {relativeTime(s.updatedAt)}
                        </div>
                      </div>
                      {hoveredSessionId === s.id && (
                        <button
                          className="shrink-0 text-ink-muted/60 hover:text-danger transition-colors"
                          onClick={(e) => { e.stopPropagation(); void deleteSession(s.id); }}
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* ── Center: Chat area ── */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border px-4 py-2 sm:py-0 sm:h-12 gap-2">
          {/* Left: nav toggles + filters */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <IconButton
              label="Toggle history"
              className="shrink-0"
              onClick={() => setSessionsPanelOpen((v) => !v)}
              title={sessionsPanelOpen ? "Hide history" : "Show history"}
            >
              <MessageSquare className="size-4" />
            </IconButton>

            <div className="flex items-center gap-2 flex-1 sm:flex-none">
              <PaperSelect
                value={course ?? "all"}
                onChange={(v) => setCourse(v === "all" ? null : v)}
                options={courseOptions}
                placeholder="All courses"
                className="flex-1 sm:w-36 md:w-44 min-w-[90px]"
                wrapperClassName="flex-1 sm:flex-none"
              />
              <PaperSelect
                value={document ?? "all"}
                onChange={(v) => setDocument(v === "all" ? null : v)}
                options={documentOptions}
                placeholder="All documents"
                className="flex-1 sm:w-36 md:w-44 min-w-[90px]"
                wrapperClassName="flex-1 sm:flex-none"
              />
            </div>
          </div>

          {/* Right: toggles + actions */}
          <div className="flex items-center justify-between sm:justify-end gap-1.5 sm:gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 sm:gap-2">
              {confidence !== undefined && !isStreaming && (
                <PaperBadge tone="sage" className="gap-1 px-2 py-0.5">
                  <Gauge className="size-3" />
                  <span>
                    {(confidence * 100).toFixed(0)}%{" "}
                    <span className="hidden md:inline">confidence</span>
                  </span>
                </PaperBadge>
              )}

              {/* RAG Mode toggle */}
              <ToggleButton
                size="sm"
                pressed={ragMode === "strict"}
                onPressedChange={(v) =>
                  setSettingsField("ragMode", v ? "strict" : "fallback")
                }
                title={
                  ragMode === "strict"
                    ? "Strict RAG — click to switch to AI Fallback"
                    : "AI Fallback — click to switch to Strict RAG"
                }
                className="gap-1 text-[11px]"
              >
                <ShieldCheck className="size-3" />
                <span>{ragMode === "strict" ? "Strict" : "Fallback"}</span>
              </ToggleButton>

              {/* Highlights Only toggle */}
              {document && document !== "all" && (
                <ToggleButton
                  size="sm"
                  pressed={!!highlightsOnly}
                  onPressedChange={(v) => setHighlightsOnly(v)}
                  title={
                    highlightsOnly
                      ? "Highlights Only ON — answers derived exclusively from your highlights"
                      : "Enable Highlights Only"
                  }
                  className="gap-1 text-[11px]"
                >
                  <BookOpen className="size-3" />
                  <span>Highlights</span>
                </ToggleButton>
              )}

              {/* Socratic Mode toggle */}
              <ToggleButton
                size="sm"
                pressed={!!socratic}
                onPressedChange={(v) => setSocratic(v)}
                title={
                  socratic
                    ? "Socratic Mode ON — AI guides, does not answer"
                    : "Enable Socratic Mode"
                }
                className="gap-1 text-[11px]"
              >
                <GraduationCap className="size-3" />
                <span>Socratic</span>
              </ToggleButton>
            </div>

            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <GhostButton size="sm" className="h-8 px-2.5 gap-1.5" onClick={reset}>
                  <Trash2 className="size-3.5" />
                  <span className="hidden xs:inline">Clear</span>
                </GhostButton>
              )}
              <IconButton
                label="Toggle sources"
                className="hidden lg:inline-flex"
                onClick={() => setSourcesPanelOpen((v) => !v)}
                title={sourcesPanelOpen ? "Hide sources" : "Show sources"}
              >
                <PanelRight className="size-4" />
              </IconButton>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea ref={scrollRef} className="min-h-0 flex-1">
          <div className="mx-auto max-w-5xl px-6 py-6">
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
        </ScrollArea>

        {/* Sticky input */}
        <div className="border-t border-border bg-background/80 px-6 py-4 backdrop-blur-xl">
          <div className="mx-auto max-w-5xl">
            <PaperCard
              data-tour="ask-input"
              shadow="sm"
              className="flex items-end gap-2 p-2"
            >
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
                className="max-h-40 min-h-9 flex-1 resize-none bg-transparent py-1.5 font-architect text-sm text-ink outline-none placeholder:text-ink-muted/60"
              />
              <PaperButton
                data-tour="ask-send"
                tone="dark"
                size="sm"
                disabled={!input.trim() || isStreaming}
                onClick={() => submit()}
                className="shrink-0"
              >
                <ArrowUp className="size-[18px]" />
              </PaperButton>
            </PaperCard>
            <div className="mt-2 flex items-center justify-between px-1 font-kalam text-xs text-ink-muted">
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

      {/* ── Right: Sources panel ── */}
      <div
        className={`hidden lg:flex flex-col overflow-hidden transition-all duration-200 ${
          sourcesPanelOpen ? "w-[25%] min-w-[260px] max-w-[360px]" : "w-0"
        }`}
      >
        <div className="relative flex min-h-0 flex-1 flex-col">
          <PaperSheetBorder fill="#fdfcf8" stroke="#c0b9ae" strokeWidth={1.2} shadow={0} />
          <div
            data-tour="ask-sources"
            className="relative z-[1] flex min-h-0 flex-1 flex-col px-1 py-1"
          >
            <SourcePanel sources={sources} activeId={activeSource} onSelect={setActiveSource} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
      >
        <PaperIconCircle tone="lavender" size={56}>
          <Sparkles className="size-6" />
        </PaperIconCircle>
      </motion.div>

      <PaperH1 className="mt-5 text-4xl">Ask your knowledge base</PaperH1>
      <p className="mt-2 max-w-md font-kalam text-[15px] text-ink-muted">
        Get source-grounded answers with citations, drawn directly from your documents, notes and lectures.
      </p>

      <div className="mt-8 grid w-full max-w-xl gap-2 sm:grid-cols-2">
        {suggestions.map((s, i) => (
          <motion.div
            key={s}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.06 }}
          >
            <button
              onClick={() => onPick(s)}
              className="w-full text-left"
            >
              <PaperCard
                lift
                shadow="sm"
                className="p-3.5 cursor-pointer"
              >
                <p className="font-architect text-sm text-ink">{s}</p>
              </PaperCard>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
