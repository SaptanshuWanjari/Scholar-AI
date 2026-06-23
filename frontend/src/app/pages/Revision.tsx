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
  TrendingDown,
  Clock,
  Bookmark,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Label } from "../components/ui/label";
import { MarkdownRenderer } from "../components/MarkdownRenderer";
import { api } from "../lib/api";
import { useRevisionStore, type RevisionFormat } from "../stores/useRevisionStore";
import type { Course, DocumentItem } from "../lib/types";
import { cn } from "../components/ui/utils";

const formats: { id: RevisionFormat; label: string; icon: typeof NotebookPen }[] = [
  { id: "notes", label: "Exam Notes", icon: NotebookPen },
  { id: "concepts", label: "Key Concepts", icon: ListTree },
  { id: "formulas", label: "Formula Sheet", icon: Sigma },
  { id: "summary", label: "Summary Sheet", icon: FileText },
];

export function Revision() {
  // Generation state lives in a global store so an in-flight generation keeps
  // running and its result is preserved when navigating away and back.
  const {
    format,
    topic,
    course,
    loading,
    output,
    title,
    ungrounded,
    savedRevisions,
    setField,
    generate,
    stop,
    saveRevision,
    loadRevision,
  } = useRevisionStore();
  const setFormat = (f: RevisionFormat) => setField("format", f);
  const setTopic = (v: string) => setField("topic", v);
  const setCourse = (v: string) => setField("course", v);

  const [courses, setCourses] = useState<Course[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    api
      .listCourses()
      .then((cs) => {
        if (!cancelled) setCourses(cs);
      })
      .catch(() => {});
    api
      .listDocuments()
      .then((docs) => {
        if (!cancelled) setDocuments(docs);
      })
      .catch(() => {});
    return () => { cancelled = true; };
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

  return (
    <div className="flex h-full">
      {/* Generator */}
      <div className="w-96 shrink-0 overflow-y-auto border-r border-border bg-card/40 p-5">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          <h3>Generator</h3>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Turn your materials into exam-ready study resources.
        </p>

        <div className="mt-6 space-y-5">
          <div>
            <Label className="mb-2 block">Format</Label>
            <div className="grid grid-cols-2 gap-2">
              {formats.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFormat(f.id)}
                  className={cn(
                    "flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition-colors",
                    format === f.id
                      ? "border-primary bg-violet-soft"
                      : "border-border bg-card hover:border-ring/40",
                  )}
                >
                  <f.icon className={cn("size-4", format === f.id ? "text-primary" : "text-muted-foreground")} />
                  <span className="text-sm">{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Topic</Label>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) generate();
              }}
              placeholder="e.g. Backpropagation (optional)"
              className="bg-input-background"
            />
          </div>

          <div>
            <Label className="mb-2 block">Course</Label>
            <Select value={course} onValueChange={setCourse}>
              <SelectTrigger className="bg-input-background">
                <SelectValue placeholder="No course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No course</SelectItem>
                {courses.map((c) => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Provide at least a topic or a course.
            </p>
          </div>

          <Button
            onClick={loading ? stop : generate}
            className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {loading ? "Stop" : "Generate"}
          </Button>
        </div>

        {/* Quick picks */}
        {suggestedRevision.length > 0 && (
          <div className="mt-8 space-y-5">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Clock className="size-3.5 text-muted-foreground" />
                <Label>Suggested revision</Label>
              </div>
              <div className="space-y-2">
                {suggestedRevision.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => pickTopic(r.topic)}
                    className="flex w-full flex-col items-start gap-0.5 rounded-xl border border-border bg-card p-3 text-left transition-colors hover:border-ring/40"
                  >
                    <span className="text-sm font-medium">{r.topic}</span>
                    <span className="text-xs text-muted-foreground">{r.reason}</span>
                    <span className="text-xs text-muted-foreground/70">{r.course}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Saved revisions */}
        {savedRevisions.length > 0 && (
          <div className="mt-8 space-y-5">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Bookmark className="size-3.5 text-muted-foreground" />
                <Label>Saved revisions</Label>
              </div>
              <div className="space-y-2">
                {savedRevisions.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => loadRevision(r.id)}
                    className="flex w-full flex-col items-start gap-0.5 rounded-xl border border-border bg-card p-3 text-left transition-colors hover:border-ring/40"
                  >
                    <span className="text-sm font-medium truncate w-full">{r.title}</span>
                    <span className="text-xs text-muted-foreground">{new Date(r.timestamp).toLocaleDateString()}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preview */}
      <div className="min-w-0 flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 flex h-12 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-xl">
          <span className="text-sm font-medium">{title ?? "Preview"}</span>
          {output && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1.5" onClick={saveRevision}>
                <Bookmark className="size-3.5" /> Save
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => {
                if (!output) return;
                const blob = new Blob([output], { type: "text/markdown" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${(title || "revision").replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                toast.success("Exported as markdown");
              }}>
                <Download className="size-3.5" /> Export
              </Button>
            </div>
          )}
        </div>
        <div className="mx-auto max-w-3xl px-8 py-8">
          {output ? (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              {!loading && ungrounded && (
                <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                  <span>
                    This topic may not be covered by your uploaded documents — the result below
                    may be incomplete or based on general knowledge.
                  </span>
                </div>
              )}
              <MarkdownRenderer content={output} />
              {loading && (
                <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-primary" />
              )}
            </motion.div>
          ) : loading ? (
            <div className="flex flex-col items-center pt-24 text-muted-foreground">
              <Loader2 className="size-6 animate-spin text-primary" />
              <p className="mt-3 text-sm">Retrieving sources…</p>
            </div>
          ) : (
            <div className="flex flex-col items-center pt-24 text-center text-muted-foreground">
              <Sparkles className="size-6 text-primary/60" />
              <p className="mt-3 text-sm">
                Choose a format, enter a topic or course, then generate a study sheet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
