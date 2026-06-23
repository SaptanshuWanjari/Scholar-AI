import { useEffect, useState } from "react";
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
import { suggestedRevision, weakTopics } from "../lib/mock-data";
import { api } from "../lib/api";
import type { Course } from "../lib/types";
import { cn } from "../components/ui/utils";

type RevisionFormat = "notes" | "concepts" | "formulas" | "summary";

const formats: { id: RevisionFormat; label: string; icon: typeof NotebookPen }[] = [
  { id: "notes", label: "Exam Notes", icon: NotebookPen },
  { id: "concepts", label: "Key Concepts", icon: ListTree },
  { id: "formulas", label: "Formula Sheet", icon: Sigma },
  { id: "summary", label: "Summary Sheet", icon: FileText },
];

/** Heuristic: detect a backend "this topic isn't in your documents" message. */
function looksNotCovered(markdown: string): boolean {
  const text = markdown.trim().toLowerCase();
  if (!text) return true;
  return (
    text.includes("not covered") ||
    text.includes("no relevant") ||
    text.includes("couldn't find") ||
    text.includes("could not find") ||
    text.includes("no information") ||
    text.includes("not found in")
  );
}

export function Revision() {
  const [format, setFormat] = useState<RevisionFormat>("notes");
  const [topic, setTopic] = useState("");
  const [course, setCourse] = useState<string>("none");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [ungrounded, setUngrounded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api
      .listCourses()
      .then((cs) => {
        if (!cancelled) setCourses(cs);
      })
      .catch(() => {
        /* leave course selector with just "No course" */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const generate = async () => {
    const t = topic.trim();
    const selectedCourse = course === "none" ? null : course;
    if (!t && !selectedCourse) {
      toast.error("Enter a topic or pick a course to generate a study sheet");
      return;
    }
    setLoading(true);
    setOutput(null);
    setTitle(null);
    setUngrounded(false);
    try {
      const result = await api.generateRevision({
        topic: t || undefined,
        course: selectedCourse,
        format,
      });
      const notCovered = !result.grounded || looksNotCovered(result.markdown);
      setOutput(result.markdown);
      setTitle(result.title);
      setUngrounded(notCovered);
      if (notCovered) {
        toast.warning("This topic may not be covered by your uploaded documents");
      } else {
        toast.success("Study sheet generated");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to generate study sheet");
    } finally {
      setLoading(false);
    }
  };

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
            onClick={generate}
            disabled={loading}
            className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {loading ? "Generating…" : "Generate"}
          </Button>
        </div>

        {/* Quick picks — mock data, prefill the topic input */}
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

          <div>
            <div className="mb-2 flex items-center gap-2">
              <TrendingDown className="size-3.5 text-muted-foreground" />
              <Label>Weak topics</Label>
            </div>
            <div className="space-y-2">
              {weakTopics.map((w) => (
                <button
                  key={w.id}
                  onClick={() => pickTopic(w.topic)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-card p-3 text-left transition-colors hover:border-ring/40"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{w.topic}</div>
                    <div className="truncate text-xs text-muted-foreground">{w.course}</div>
                  </div>
                  <span className="shrink-0 text-xs font-medium text-muted-foreground">
                    {w.mastery}%
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="min-w-0 flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 flex h-12 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-xl">
          <span className="text-sm font-medium">{title ?? "Preview"}</span>
          {output && (
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.success("Exported")}>
              <Download className="size-3.5" /> Export
            </Button>
          )}
        </div>
        <div className="mx-auto max-w-3xl px-8 py-8">
          {loading ? (
            <div className="flex flex-col items-center pt-24 text-muted-foreground">
              <Loader2 className="size-6 animate-spin text-primary" />
              <p className="mt-3 text-sm">Synthesizing your study sheet…</p>
            </div>
          ) : output ? (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              {ungrounded && (
                <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                  <span>
                    This topic may not be covered by your uploaded documents — the result below
                    may be incomplete or based on general knowledge.
                  </span>
                </div>
              )}
              <MarkdownRenderer content={output} />
            </motion.div>
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
