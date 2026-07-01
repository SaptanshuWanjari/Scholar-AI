import { useEffect, useState, useMemo } from "react";
import {
  Sparkles,
  NotebookPen,
  FileText,
  Sigma,
  ListTree,
  Download,
  Loader2,
  AlertTriangle,
  Clock,
  Bookmark,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

// paper-ui components
import { PaperButton, GhostButton, IconButton, ToggleButton } from "@paper-ui/components/buttons";
import { PaperInput, PaperSelect, PaperLabel } from "@paper-ui/components/inputs";
import { TopBar } from "@paper-ui/components/navigation";
import { Divider } from "@paper-ui/components/utility";
import { DataEmptyState } from "@paper-ui/components/dataDisplay";
import { PaperCard, PaperH3, PaperSheetCard, SectionLabel } from "@paper-ui/core";

import { MarkdownRenderer } from "../components/MarkdownRenderer";
import QualityBadge from "../components/QualityBadge";
import { AddToNotebookMenu } from "../components/AddToNotebookMenu";
import { api } from "../lib/api";
import {
  useRevisionStore,
  type RevisionFormat,
} from "../stores/useRevisionStore";
import type { Course, DocumentItem } from "../lib/types";
import { cn } from "../components/ui/utils";

const formats: {
  id: RevisionFormat;
  label: string;
  icon: typeof NotebookPen;
}[] = [
    { id: "notes", label: "Exam Notes", icon: NotebookPen },
    { id: "concepts", label: "Key Concepts", icon: ListTree },
    { id: "formulas", label: "Formula Explorer", icon: Sigma },
    { id: "summary", label: "Summary Sheet", icon: FileText },
  ];

export function Revision() {
  const {
    format,
    topic,
    course,
    loading,
    output,
    title,
    ungrounded,
    quality,
    savedRevisions,
    setField,
    generate,
    stop,
    loadRevision,
    fetchRevisions,
    deleteRevision,
  } = useRevisionStore();
  const setFormat = (f: RevisionFormat) => setField("format", f);
  const setTopic = (v: string) => setField("topic", v);
  const setCourse = (v: string) => setField("course", v);
  const docId = useRevisionStore((s) => s.document);
  const setDocument = (v: string | null) => setField("document", v);

  const [courses, setCourses] = useState<Course[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  useEffect(() => {
    fetchRevisions();
  }, []);

  useEffect(() => {
    let cancelled = false;
    api
      .listCourses()
      .then((cs) => {
        if (!cancelled) setCourses(cs);
      })
      .catch(() => { });
    api
      .listDocuments()
      .then((docs) => {
        if (!cancelled) setDocuments(docs);
      })
      .catch(() => { });
    return () => {
      cancelled = true;
    };
  }, []);

  const suggestedRevision = useMemo(() => {
    if (!documents.length) return [];

    return documents.slice(0, 3).map((doc, i) => ({
      id: `sr-d${i}`,
      topic: doc.title.replace(/\.[^/.]+$/, ""),
      reason: i === 0 ? "Due for review today" : "Upcoming exam",
      course: doc.course,
    }));
  }, [documents]);

  const pickTopic = (value: string) => {
    setTopic(value);
    toast.success(`Topic set to "${value}"`);
  };

  const courseOptions = useMemo(() => {
    return [
      { value: "none", label: "No course" },
      ...courses.map((c) => ({ value: c.name, label: c.name })),
    ];
  }, [courses]);

  const docOptions = useMemo(() => {
    const filteredDocs = documents.filter((d) =>
      course !== "none" ? d.course === course : true
    );
    return [
      { value: "all", label: "All documents" },
      ...filteredDocs.map((d) => ({ value: d.id, label: d.title })),
    ];
  }, [documents, course]);

  return (
    <div className="flex h-full bg-paper/50">
      {/* Generator */}
      <div className="w-96 shrink-0 overflow-y-auto bg-paper-card/40 p-5 paper-scrollbar flex flex-col gap-6">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-[#a3771f]" />
            <PaperH3>Generator</PaperH3>
          </div>
          <p className="mt-1 text-sm font-architect text-ink-muted">
            Turn your materials into exam-ready study resources.
          </p>
        </div>

        <div className="space-y-5">
          <div data-tour="revision-format">
            <SectionLabel className="mb-2 block text-xs">Format</SectionLabel>
            <div className="grid grid-cols-2 gap-2">
              {formats.map((f) => (
                <ToggleButton
                  key={f.id}
                  pressed={format === f.id}
                  onPressedChange={() => setFormat(f.id)}
                  className="flex flex-col items-start gap-1 h-auto py-4 px-4 text-left w-full"
                >
                  <div className="flex flex-col items-start gap-1.5 w-full">
                    <f.icon className="size-4 shrink-0" />
                    <span className="text-sm font-architect leading-tight font-semibold mt-1">{f.label}</span>
                  </div>
                </ToggleButton>
              ))}
            </div>
          </div>

          <div data-tour="revision-source">
            <PaperInput
              id="revision-topic-input"
              label="Topic"
              value={topic}
              className='text-lg'
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) generate();
              }}
              placeholder="e.g. Backpropagation (optional)"
            />
          </div>

          <div className="flex flex-col gap-2">
            <PaperSelect
              label="Course"
              value={course}
              onChange={setCourse}
              options={courseOptions}
              placeholder="No course"
            />
            <PaperSelect
              value={docId ?? "all"}
              onChange={(v) => setDocument(v === "all" ? null : v)}
              options={docOptions}
              placeholder="All documents"
            />
            <p className="text-xs text-ink-muted/70 font-architect">
              Provide at least a topic or a course.
            </p>
          </div>

          <PaperButton
            data-tour="revision-generate"
            onClick={loading ? stop : generate}
            tone={loading ? "paper" : "dark"}
            size="lg"
            className="w-full gap-2"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            {loading ? "Stop" : "Generate"}
          </PaperButton>
        </div>

        {/* Quick picks */}
        {suggestedRevision.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="size-3.5 text-ink-muted" />
              <SectionLabel className="text-xs">Suggested revision</SectionLabel>
            </div>
            <div className="space-y-2">
              {suggestedRevision.map((r) => (
                <PaperCard
                  key={r.id}
                  shadow="sm"
                  lift
                  className="w-full border border-transparent"
                >
                  <button
                    onClick={() => pickTopic(r.topic)}
                    className="w-full text-left p-4 flex flex-col items-start gap-1 focus:outline-none"
                  >
                    <span className="text-lg font-semibold text-ink font-architect">{r.topic}</span>
                    <span className="text-sm text-ink-muted font-architect">{r.reason}</span>
                    <span className="text-[18px] text-ink-muted/70 font-architect">{r.course}</span>
                  </button>
                </PaperCard>
              ))}
            </div>
          </div>
        )}

        {/* Saved revisions */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Bookmark className="size-3.5 text-ink-muted" />
            <SectionLabel className="text-xs">Saved revisions</SectionLabel>
          </div>
          {savedRevisions.length === 0 ? (
            <DataEmptyState
              variant="dashed"
              title="No saved revisions yet"
              description="Generate a revision schedule to start reviewing."
              action={
                <GhostButton
                  size="sm"
                  onClick={() => window.document.getElementById("revision-topic-input")?.focus()}
                >
                  Generate Revision Schedule
                </GhostButton>
              }
            />
          ) : (
            <div className="space-y-3">
              {savedRevisions.map((r) => (
                <PaperCard
                  key={r.id}
                  shadow="sm"
                  lift
                  className="group relative flex w-full flex-col items-start gap-1 p-4 text-left border border-transparent"
                >
                  <button
                    onClick={() => loadRevision(r.id)}
                    className="w-full text-left focus:outline-none"
                  >
                    <span className="text-sm font-semibold truncate w-full pr-8 block text-ink">
                      {r.title}
                    </span>
                    <span className="text-xs text-ink-muted line-clamp-2 mt-1">
                      {r.content.replace(/[#*]/g, "").trim()}
                    </span>
                    <span className="text-[10px] text-ink-muted/60 mt-1 block font-architect">
                      {new Date(r.timestamp).toLocaleDateString()}
                    </span>
                  </button>
                  <IconButton
                    label="Delete revision"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteRevision(r.id);
                    }}
                    className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 hover:text-danger"
                  >
                    <Trash2 className="size-4" />
                  </IconButton>
                </PaperCard>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <Divider orientation="vertical" className="h-full" />

      {/* Preview */}
      <div className="min-w-0 flex-1 overflow-y-auto paper-scrollbar">
        <div data-tour="revision-preview">
          <TopBar
            className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl"
            start={
              <div className="flex items-center gap-2">
                <span className="line-clamp-1 font-architect text-sm font-semibold" title={title ?? "Preview"}>
                  {title ?? "Preview"}
                </span>
                {!loading && <QualityBadge score={quality} />}
              </div>
            }
          >
            {output && (
              <div className="flex gap-2">
                <GhostButton
                  size="sm"
                  className="gap-1.5"
                  onClick={() => {
                    if (!output) return;
                    const blob = new Blob([output], { type: "text/markdown" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${(title || "revision").replace(/[^a-z0-9]/gi, "_").toLowerCase()}.md`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    toast.success("Exported as markdown");
                  }}
                >
                  <Download className="size-3.5" /> Export
                </GhostButton>
                <AddToNotebookMenu
                  artifactType="revision"
                  content={{ title: title ?? "Revision Notes", content: output }}
                  sourceId={title ?? "revision"}
                  course={course === "none" ? null : course}
                />
              </div>
            )}
          </TopBar>
        </div>

        <div className="mx-auto max-w-3xl px-8 py-8">
          {output ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full"
            >
              {!loading && ungrounded && (
                <PaperCard
                  surface="#fffbeb"
                  shadow="none"
                  border={{ stroke: "#a3771f", strokeWidth: 1.5 }}
                  className="mb-5 flex items-start gap-2.5 px-4 py-3 text-sm text-[#a3771f]"
                >
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                  <span>
                    This topic may not be covered by your uploaded documents —
                    the result below may be incomplete or based on general
                    knowledge.
                  </span>
                </PaperCard>
              )}
              <PaperSheetCard title={title ?? "Revision Notes"}>
                <div className="prose prose-neutral dark:prose-invert max-w-none text-ink font-kalam">
                  <MarkdownRenderer content={output} />
                </div>
                {loading && (
                  <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-ink" />
                )}
              </PaperSheetCard>
            </motion.div>
          ) : loading ? (
            <div className="flex flex-col items-center pt-24 text-ink-muted">
              <Loader2 className="size-8 animate-spin text-ink" />
              <p className="mt-3 font-architect text-base tracking-wide">Retrieving sources…</p>
            </div>
          ) : (
            <div className="pt-24 max-w-lg mx-auto">
              <DataEmptyState
                variant="sketch"
                title="Generate Study Sheet"
                description="Choose a format, enter a topic or course, then generate a study sheet."
                icon={<Sparkles className="size-8 text-[#a3771f]/60" />}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

