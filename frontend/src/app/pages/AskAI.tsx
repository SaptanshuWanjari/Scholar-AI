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
  MoreVertical,
  Check,
} from "lucide-react";
import { motion } from "motion/react";
import { useChatStore } from "../stores/useChatStore";
import { useSettingsStore } from "../stores/useSettingsStore";
import { SourcePanel } from "../components/SourcePanel";
import { AnswerViewer } from "../components/AnswerViewer";
import { Menu } from "@paper-ui/components/menus";
import {
  PaperButton,
  GhostButton,
  IconButton,
  ToggleButton,
} from "@paper-ui/components/buttons";
import { PaperBadge } from "@paper-ui/components/badges";
import { PaperDrawer } from "@paper-ui/components/dialogs";
import { PaperSelect } from "@paper-ui/components/inputs";
import { ScrollArea } from "@paper-ui/components/layout";
import { PaperSheetBorder } from "@paper-ui/core";
import {
  SectionLabel,
  PaperH1,
  PaperIconCircle,
  PaperCard,
} from "@paper-ui/core";
import { SketchDivider } from "@paper-ui/components/decorations";
import { api } from "../lib/api";
import type { Course, DocumentItem } from "../lib/types";

export function AskAI() {
  const {
    messages,
    isStreaming,
    ask,
    reset,
    course,
    setCourse,
    document,
    setDocument,
    sessions,
    activeSessionId,
    loadSessions,
    loadSession,
    deleteSession,
    socratic,
    setSocratic,
    highlightsOnly,
    setHighlightsOnly,
  } = useChatStore();
  const streaming = useSettingsStore((s) => s.streaming);
  const ragMode = useSettingsStore((s) => s.ragMode);
  const setSettingsField = useSettingsStore((s) => s.set);
  const [input, setInput] = useState("");
  const [activeSource, setActiveSource] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [sessionsPanelOpen, setSessionsPanelOpen] = useState(true);
  const [sourcesPanelOpen, setSourcesPanelOpen] = useState(false);
  const [hoveredSessionId, setHoveredSessionId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [input]);

  useEffect(() => {
    api
      .listCourses()
      .then(setCourses)
      .catch(() => setCourses([]));
    api
      .listDocuments()
      .then(setDocuments)
      .catch(() => setDocuments([]));
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

  const courseOptions = useMemo(
    () => [
      { value: "all", label: "All courses" },
      ...courses.map((c) => ({ value: c.name, label: c.name })),
    ],
    [courses],
  );

  const documentOptions = useMemo(
    () => [
      { value: "all", label: "All documents" },
      ...documents
        .filter((d) => (course ? d.course === course : true))
        .map((d) => ({ value: d.id, label: d.title })),
    ],
    [documents, course],
  );

  const lastAssistant = [...messages]
    .reverse()
    .find((m) => m.role === "assistant");
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
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
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
        className={`hidden lg:flex flex-col overflow-hidden transition-all duration-200 ${sessionsPanelOpen ? "w-[250px]" : "w-0"
          }`}
      >
        <div className="relative flex min-h-0 flex-1 flex-col">
          <PaperSheetBorder
            fill="#fdfcf8"
            stroke="#c0b9ae"
            strokeWidth={1.2}
            shadow={0}
          />
          <div className="relative z-[1] flex flex-1 flex-col">
            {/* Header */}
            <div className="flex h-12 shrink-0 items-center justify-between pl-4 pr-5">
              <SectionLabel>History</SectionLabel>
              <GhostButton
                size="sm"
                className="h-7 gap-1 px-2"
                onClick={() => {
                  reset();
                }}
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
                      className={`group flex cursor-pointer items-start gap-2 rounded-lg px-3 py-2.5 transition-colors ${s.id === activeSessionId
                          ? "bg-black/5 text-ink"
                          : "text-ink-muted hover:bg-black/[0.03] hover:text-ink"
                        }`}
                      onClick={() => loadSession(s.id)}
                      onMouseEnter={() => setHoveredSessionId(s.id)}
                      onMouseLeave={() => setHoveredSessionId(null)}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-architect text-[13px]">
                          {s.title}
                        </div>
                        <div className="mt-0.5 font-kalam text-[11px] text-ink-muted/70">
                          {s.messageCount} msg · {relativeTime(s.updatedAt)}
                        </div>
                      </div>
                      {hoveredSessionId === s.id && (
                        <button
                          className="shrink-0 text-ink-muted/60 hover:text-danger transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            void deleteSession(s.id);
                          }}
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
      <div className="relative flex min-w-0 flex-1 flex-col">
        {/* Absolute collapse buttons */}
        <IconButton
          label="Toggle history"
          className="absolute left-3 top-2 z-20  "
          onClick={() => setSessionsPanelOpen((v) => !v)}
          title={sessionsPanelOpen ? "Hide history" : "Show history"}
        >
          <MessageSquare className="size-4" />
        </IconButton>
        <IconButton
          label="Toggle sources"
          className="absolute right-3 top-2 z-20 inline-flex bg-background/80 backdrop-blur-md"
          onClick={() => setSourcesPanelOpen((v) => !v)}
          title={sourcesPanelOpen ? "Hide sources" : "Show sources"}
        >
          <PanelRight className="size-4" />
        </IconButton>

        {/* Top bar */}
        <div className="flex items-center border-b border-border pl-12 pr-4 lg:pr-12 py-2 min-h-[48px] gap-3 shrink-0 z-10 bg-background overflow-x-auto no-scrollbar relative">
          {/* Left: Filters + Toggles in the same line */}
          <div className="flex items-center gap-2 min-w-max">
            <PaperSelect
              value={course ?? "all"}
              onChange={(v) => setCourse(v === "all" ? null : v)}
              options={courseOptions}
              placeholder="All courses"
              className="w-40 shrink-0"
              wrapperClassName="shrink-0"
            />
            <PaperSelect
              value={document ?? "all"}
              onChange={(v) => setDocument(v === "all" ? null : v)}
              options={documentOptions}
              placeholder="All documents"
              className="w-56 shrink-0"
              wrapperClassName="shrink-0"
            />

          </div>

          <div className="flex-1 min-w-2" />

          {/* Right: Confidence + Overflow Menu */}
          <div className="flex items-center gap-1.5 shrink-0 sticky right-0 bg-background pl-2 ">
            {confidence !== undefined && !isStreaming && (
              <PaperBadge tone="sage" className="gap-1 px-2 py-0.5">
                <Gauge className="size-3" />
                <span>
                  {(confidence * 100).toFixed(0)}%{" "}
                  <span className="hidden md:inline">confidence</span>
                </span>
              </PaperBadge>
            )}

            <Menu.Root>
              <Menu.Trigger className="!p-1.5 !rounded-md !h-8 !w-8 justify-center hover:bg-black/5 text-ink-muted hover:text-ink">
                <MoreVertical className="size-4.5" />
              </Menu.Trigger>
              <Menu.Content>
                <button
                  type="button"
                  onClick={() => setSettingsField("ragMode", ragMode === "strict" ? "fallback" : "strict")}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left font-architect text-[14px] transition-colors select-none outline-none rounded-sm text-ink hover:bg-black/[0.04]"
                >
                  <ShieldCheck className="size-4 text-ink-muted shrink-0" />
                  <span className="flex-1 min-w-0">Strict RAG</span>
                  {ragMode === "strict" && <Check className="size-4 text-ink shrink-0" />}
                </button>
                {document && document !== "all" && (
                  <button
                    type="button"
                    onClick={() => setHighlightsOnly(!highlightsOnly)}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-left font-architect text-[14px] transition-colors select-none outline-none rounded-sm text-ink hover:bg-black/[0.04]"
                  >
                    <BookOpen className="size-4 text-ink-muted shrink-0" />
                    <span className="flex-1 min-w-0">Highlights Only</span>
                    {!!highlightsOnly && <Check className="size-4 text-ink shrink-0" />}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSocratic(!socratic)}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left font-architect text-[14px] transition-colors select-none outline-none rounded-sm text-ink hover:bg-black/[0.04]"
                >
                  <GraduationCap className="size-4 text-ink-muted shrink-0" />
                  <span className="flex-1 min-w-0">Socratic</span>
                  {!!socratic && <Check className="size-4 text-ink shrink-0" />}
                </button>
                
                {messages.length > 0 && (
                  <>
                    <Menu.Separator />
                    <Menu.Item danger onSelect={reset} icon={<Trash2 className="size-4" />}>
                      Clear Chat
                    </Menu.Item>
                  </>
                )}
              </Menu.Content>
            </Menu.Root>
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
                  <AnswerViewer
                    key={m.id}
                    message={m}
                    onCitationClick={jumpToSource}
                  />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Sticky input */}
        <div className="border-t border-border bg-background/80 px-1 py-2 backdrop-blur-xl">
          <div className="mx-auto max-w-5xl">
            <PaperCard data-tour="ask-input" shadow="sm" className="p-2">
              <div className="flex items-end gap-2">
                <textarea
                  ref={textareaRef}
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
              </div>
            </PaperCard>
            <div className="mt-2 flex items-center justify-between px-1 font-kalam text-xs text-ink-muted">
              <span className="flex items-center gap-1.5">
                <Sparkles className="size-3 text-primary" />
                Grounded in {courses.length} courses ·{" "}
                {streaming ? "Streaming on" : "Streaming off"}
              </span>
              <span>
                <kbd className="rounded border border-border bg-muted px-1 font-mono">
                  Enter
                </kbd>{" "}
                to send ·{" "}
                <kbd className="rounded border border-border bg-muted px-1 font-mono">
                  Shift+Enter
                </kbd>{" "}
                newline
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: Sources panel ── */}
      <PaperDrawer
        open={sourcesPanelOpen}
        onClose={() => setSourcesPanelOpen(false)}
        side="right"
        width={380}
      >
        <div data-tour="ask-sources" className="flex min-h-0 flex-1 flex-col  h-full">
          <SourcePanel
            sources={sources}
            activeId={activeSource}
            onSelect={setActiveSource}
          />
        </div>
      </PaperDrawer>
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

function EmptyAsk({
  onPick,
  suggestions,
}: {
  onPick: (q: string) => void;
  suggestions: string[];
}) {
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
        Get source-grounded answers with citations, drawn directly from your
        documents, notes and lectures.askai
      </p>

      <div className="mt-8 grid w-full max-w-xl gap-2 sm:grid-cols-2">
        {suggestions.map((s, i) => {
          const colors = ["#f5f3ff", "#f0f9ff", "#fffbeb", "#f0fdf4"];
          const surface = colors[i % colors.length];
          return (
            <motion.div
              key={s}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              className="h-full"
            >
              <button onClick={() => onPick(s)} className="w-full text-left h-full">
                <PaperCard lift shadow="sm" surface={surface} className="p-3.5 cursor-pointer h-full">
                  <p className="font-architect text-sm text-ink">{s}</p>
                </PaperCard>
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
