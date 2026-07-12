import { useEffect, useRef } from "react";
import {
  Columns2,
  Copy,
  Download,
  Loader2,
  Sparkles,
  Trash2,
  Code,
  Eye,
} from "lucide-react";
import { toast } from "@/app/lib/toast";
import { MarkdownRenderer } from "../components/MarkdownRenderer";
import { Page } from "../components/Page";
import QualityBadge from "../components/QualityBadge";
import { AddToNotebookMenu } from "../components/AddToNotebookMenu";
import { useDifferencesStore } from "../stores/useDifferencesStore";
import { cn } from "../components/ui/utils";
import { useSearchParams } from "react-router";
import { PaperButton, GhostButton, ChipButton } from "@/paper-ui/components/buttons";
import { PaperInput, PaperSelect } from "@/paper-ui/components/inputs";
import { PaperBadge } from "@/paper-ui/components/badges";
import { EmptyState } from "@/paper-ui/components/feedback";
import { PaperCard, PaperPanel, SectionHeader, PaperH1, PaperIconCircle } from "@/paper-ui/core";
import { ArtifactRow } from "@/paper-ui/components/rows";


const SUGGESTION_COLORS = [
  { softBg: "var(--color-sky-soft)", deepBg: "var(--color-sky)", fg: "#4a6f91", selectedFg: "#fffdf9" },
  { softBg: "var(--color-sage-soft)", deepBg: "var(--color-sage)", fg: "#3f7a4e", selectedFg: "#fffdf9" },
  { softBg: "var(--color-lavender-soft)", deepBg: "var(--color-lavender)", fg: "#6f63a3", selectedFg: "#fffdf9" },
  { softBg: "var(--color-ochre-soft)", deepBg: "var(--color-ochre)", fg: "#b07a2e", selectedFg: "#fffdf9" },
  { softBg: "var(--color-brick-soft)", deepBg: "var(--color-brick)", fg: "#a3544a", selectedFg: "#fffdf9" },
];

export function Differences() {
  const topic = useDifferencesStore((s) => s.topic);
  const course = useDifferencesStore((s) => s.course);
  const docId = useDifferencesStore((s) => s.document);
  const loading = useDifferencesStore((s) => s.loading);
  const output = useDifferencesStore((s) => s.output);
  const showRaw = useDifferencesStore((s) => s.showRaw);
  const suggestions = useDifferencesStore((s) => s.suggestions);
  const saved = useDifferencesStore((s) => s.saved);
  const courses = useDifferencesStore((s) => s.courses);
  const documents = useDifferencesStore((s) => s.documents);
  const setTopic = useDifferencesStore((s) => s.setTopic);
  const setCourse = useDifferencesStore((s) => s.setCourse);
  const setDocument = useDifferencesStore((s) => s.setDocument);
  const setShowRaw = useDifferencesStore((s) => s.setShowRaw);
  const generate = useDifferencesStore((s) => s.generate);
  const fetchSuggestions = useDifferencesStore((s) => s.fetchSuggestions);
  const fetchSaved = useDifferencesStore((s) => s.fetchSaved);
  const fetchCoursesAndDocs = useDifferencesStore((s) => s.fetchCoursesAndDocs);
  const saveTable = useDifferencesStore((s) => s.saveTable);
  const deleteTable = useDifferencesStore((s) => s.deleteTable);
  const loadSaved = useDifferencesStore((s) => s.loadSaved);

  const [searchParams] = useSearchParams();
  const paramA = searchParams.get("a");
  const paramB = searchParams.get("b");
  const hasGeneratedRef = useRef(false);

  useEffect(() => {
    if (paramA && paramB) {
      const combined = `${paramA} vs ${paramB}`;
      if (topic !== combined) {
        setTopic(combined);
      }
      if (!output && !loading && !hasGeneratedRef.current) {
        hasGeneratedRef.current = true;
        setTimeout(() => {
          generate();
        }, 100);
      }
    }
  }, [paramA, paramB, setTopic, generate, output, loading, topic]);

  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchSuggestions();
    fetchSaved();
    fetchCoursesAndDocs();
  }, [fetchSuggestions, fetchSaved, fetchCoursesAndDocs]);

  const prevOutput = useRef(output);
  useEffect(() => {
    if (output && output !== prevOutput.current) {
      setTimeout(() => viewerRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }
    prevOutput.current = output;
  }, [output]);

  function copyMarkdown() {
    if (!output) return;
    navigator.clipboard.writeText(output.content);
    toast.success("Copied to clipboard");
  }

  function exportMarkdown() {
    if (!output) return;
    const blob = new Blob([output.content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${output.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.md`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Exported as Markdown");
  }

  const visibleDocs = course === "none"
    ? documents
    : documents.filter((d) => d.course === course);

  const isEmpty = !output && saved.length === 0 && !loading;

  return (
    <Page>
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <PaperIconCircle tone="brick" size={44}>
          <Columns2 className="size-5" />
        </PaperIconCircle>
        <div>
          <PaperH1 className="!text-2xl">Difference Tables</PaperH1>
          <p className="font-kalam text-sm text-ink-muted">
            Compare concepts, architectures, algorithms and systems.
          </p>
        </div>
      </div>

      {/* Search + generate */}
      <div className="flex items-end gap-2 mb-3">
        <PaperInput
          id="differences-topic-input"
          placeholder="Compare concepts… e.g. Process vs Thread"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && generate()}
          wrapperClassName="flex-1"
        />
        <PaperButton onClick={generate} disabled={loading || !topic.trim()} tone="dark">
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Sparkles className="size-4" />
          )}
          {loading ? "Generating…" : "Generate Table"}
        </PaperButton>
      </div>

      {/* Course + document pickers */}
      <div className="flex gap-3 mb-6">
        <PaperSelect
          value={course}
          onChange={setCourse}
          options={[
            { value: "none", label: "All courses" },
            ...courses.map((c) => ({ value: c.name, label: c.name })),
          ]}
          wrapperClassName="w-48"
        />

        <PaperSelect
          value={docId ?? "all"}
          onChange={(v) => setDocument(v === "all" ? null : v)}
          options={[
            { value: "all", label: "All documents" },
            ...visibleDocs.map((d) => ({ value: d.id, label: d.title })),
          ]}
          wrapperClassName="w-56"
        />
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {suggestions.map((s, i) => {
            const color = SUGGESTION_COLORS[i % SUGGESTION_COLORS.length];
            return (
              <ChipButton
                key={s}
                selected={topic === s}
                onClick={() => setTopic(s)}
                border={{ fill: topic === s ? color.deepBg : color.softBg }}
                style={{ color: topic === s ? color.selectedFg : color.fg }}
                className="px-4 py-1.5 h-auto text-[14px] leading-relaxed border-none"
              >
                {s}
              </ChipButton>
            );
          })}
        </div>
      )}

      {/* Viewer */}
      {output && (
        <div ref={viewerRef} className="mb-8">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex min-w-0 flex-1 items-start gap-2">
              <h2 className="font-caveat text-[24px] font-bold text-ink line-clamp-2 break-words" title={output.title}>
                {output.title}
              </h2>
              <QualityBadge score={output.quality} />
            </div>
            <div className="flex items-center gap-1.5">
              <GhostButton
                size="sm"
                onClick={() => setShowRaw(!showRaw)}
              >
                {showRaw ? <Eye className="size-3.5" /> : <Code className="size-3.5" />}
                {showRaw ? "Rendered" : "Raw"}
              </GhostButton>
              <GhostButton size="sm" onClick={copyMarkdown}>
                <Copy className="size-3.5" /> Copy
              </GhostButton>
              <GhostButton size="sm" onClick={exportMarkdown}>
                <Download className="size-3.5" /> Export
              </GhostButton>
              <PaperButton size="sm" tone="dark" onClick={saveTable}>
                Save
              </PaperButton>
              <AddToNotebookMenu
                artifactType="difference"
                content={{ title: output.title, content: output.content }}
                sourceId={output.title}
                course={course === "none" ? null : course}
              />
            </div>
          </div>
          <PaperCard
            className={cn(
              "relative overflow-visible p-5 pt-8 font-architect text-ink",
              showRaw && "font-mono text-xs",
            )}
          >
            {showRaw ? (
              <pre className="whitespace-pre-wrap text-ink">{output.content}</pre>
            ) : (
              <MarkdownRenderer content={output.content} />
            )}
          </PaperCard>
          {!output.grounded && (
            <p className="mt-2 font-kalam text-xs text-ink-muted">
              Based on general knowledge — upload documents for grounded comparisons.
            </p>
          )}
        </div>
      )}

      {/* Empty state */}
      {isEmpty && (
        <EmptyState
          icon={<Columns2 className="size-8 text-ink-muted" />}
          title="No difference tables yet"
          description="Generate one to compare concepts. Try an example below:"
        />
      )}

      {/* Saved tables */}
      {saved.length > 0 && (
        <div className="mt-8">
          <SectionHeader title="Saved Comparisons" />
          <div className="space-y-1">
            {saved.map((item) => (
              <ArtifactRow
                key={item.id}
                icon={<Columns2 className="size-4 text-ink-muted" />}
                tone="lavender"
                title={item.title}
                badge={item.course ? <PaperBadge tone="lavender">{item.course}</PaperBadge> : null}
                date={new Date(item.createdAt).toLocaleDateString()}
                onClick={() => loadSaved(item)}
                isSelected={output?.title === item.title}
                actions={
                  <GhostButton
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTable(item.id);
                    }}
                    className="h-8 w-8 p-0 border-none text-ink-muted hover:text-danger"
                  >
                    <Trash2 className="size-4" />
                  </GhostButton>
                }
              />
            ))}
          </div>
        </div>
      )}
    </Page>
  );
}
