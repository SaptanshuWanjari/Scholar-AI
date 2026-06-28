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
import { MarkdownRenderer } from "../components/MarkdownRenderer";
import { Page, SectionTitle } from "../components/Page";
import QualityBadge from "../components/QualityBadge";
import { AddToNotebookMenu } from "../components/AddToNotebookMenu";
import { useDifferencesStore } from "../stores/useDifferencesStore";
import { cn } from "../components/ui/utils";

export function Differences() {
  const topic = useDifferencesStore((s) => s.topic);
  const course = useDifferencesStore((s) => s.course);
  const document = useDifferencesStore((s) => s.document);
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
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Columns2 className="size-5 text-violet" />
          <h1 className="text-2xl font-semibold tracking-tight">Difference Tables</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Compare concepts, architectures, algorithms and systems.
        </p>
      </div>

      {/* Search + generate */}
      <div className="flex gap-2 mb-3">
        <Input
          placeholder="Compare concepts… e.g. Process vs Thread"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && generate()}
          className="flex-1"
        />
        <Button onClick={generate} disabled={loading || !topic.trim()}>
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Sparkles className="size-4" />
          )}
          {loading ? "Generating…" : "Generate Table"}
        </Button>
      </div>

      {/* Course + document pickers */}
      <div className="flex gap-2 mb-6">
        <Select value={course} onValueChange={setCourse}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All courses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">All courses</SelectItem>
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
          <SelectTrigger className="w-56">
            <SelectValue placeholder="All documents" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All documents</SelectItem>
            {visibleDocs.map((d) => (
              <SelectItem key={d.id} value={d.id}>
                {d.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => setTopic(s)}
              className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Viewer */}
      {output && (
        <div ref={viewerRef} className="mb-8">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-medium text-foreground">{output.title}</h2>
              <QualityBadge score={output.quality} />
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRaw(!showRaw)}
                className="gap-1.5"
              >
                {showRaw ? <Eye className="size-3.5" /> : <Code className="size-3.5" />}
                {showRaw ? "Rendered" : "Raw"}
              </Button>
              <Button variant="ghost" size="sm" onClick={copyMarkdown} className="gap-1.5">
                <Copy className="size-3.5" /> Copy
              </Button>
              <Button variant="ghost" size="sm" onClick={exportMarkdown} className="gap-1.5">
                <Download className="size-3.5" /> Export
              </Button>
              <Button size="sm" onClick={saveTable} className="gap-1.5">
                Save
              </Button>
              <AddToNotebookMenu
                artifactType="difference"
                content={{ title: output.title, content: output.content }}
                sourceId={output.title}
                course={course === "none" ? null : course}
              />
            </div>
          </div>
          <div
            className={cn(
              "rounded-lg border border-border bg-card p-4",
              showRaw && "font-mono text-xs",
            )}
          >
            {showRaw ? (
              <pre className="whitespace-pre-wrap text-foreground">{output.content}</pre>
            ) : (
              <MarkdownRenderer content={output.content} />
            )}
          </div>
          {!output.grounded && (
            <p className="mt-2 text-xs text-muted-foreground">
              Based on general knowledge — upload documents for grounded comparisons.
            </p>
          )}
        </div>
      )}

      {/* Empty state */}
      {isEmpty && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Columns2 className="size-10 text-muted-foreground/40 mb-3" />
          <p className="font-medium text-muted-foreground mb-1">Generate your first comparison.</p>
          <p className="text-sm text-muted-foreground/70">
            Compare two concepts to create an exam-ready revision table.
          </p>
          <div className="flex gap-2 mt-4 flex-wrap justify-center">
            {["Process vs Thread", "REST vs gRPC", "Monolith vs Microservices"].map((ex) => (
              <button
                key={ex}
                onClick={() => setTopic(ex)}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Saved tables */}
      {saved.length > 0 && (
        <div>
          <SectionTitle title="Saved Comparisons" />
          <div className="space-y-2">
            {saved.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 transition-colors",
                  output?.title === item.title
                    ? "border-violet/40 bg-violet/5"
                    : "hover:bg-muted/50",
                )}
              >
                <button className="flex-1 text-left" onClick={() => loadSaved(item)}>
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(item.createdAt).toLocaleDateString()}
                    {item.course && ` · ${item.course}`}
                  </p>
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTable(item.id)}
                  className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </Page>
  );
}
