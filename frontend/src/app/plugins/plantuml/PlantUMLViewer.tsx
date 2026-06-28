import { useState, useEffect } from "react";
import { AlertTriangle, BookmarkPlus, Check, Code2, Eye, Loader2, Terminal } from "lucide-react";

interface PlantUMLViewerProps {
  code: string;
}

interface Course {
  id: number;
  name: string;
}

function SaveDialog({
  code,
  onClose,
}: {
  code: string;
  onClose: () => void;
}) {
  const [title, setTitle] = useState("PlantUML Diagram");
  const [courseId, setCourseId] = useState<string>("none");
  const [courses, setCourses] = useState<Course[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => r.json())
      .then((data: Course[]) => setCourses(data))
      .catch(() => {});
  }, []);

  async function handleSave() {
    setSaving(true);
    setErr(null);
    try {
      const course = courses.find((c) => String(c.id) === courseId);
      const res = await fetch("/api/plugins/plantuml/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim() || "PlantUML Diagram",
          plantuml_syntax: code,
          course: course?.name ?? null,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaved(true);
      setTimeout(onClose, 1200);
    } catch {
      setErr("Failed to save. Is the server running?");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-xl">
        <h3 className="mb-4 text-sm font-semibold text-foreground">Save to Library</h3>

        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Title</label>
            <input
              className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-violet"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              autoFocus
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Course</label>
            <select
              className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-violet"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
            >
              <option value="none">No course</option>
              {courses.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {err && <p className="text-xs text-destructive">{err}</p>}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || saved}
            className="flex items-center gap-1.5 rounded-lg bg-violet px-3 py-1.5 text-xs font-medium text-white disabled:opacity-60"
          >
            {saved ? (
              <><Check className="size-3.5" /> Saved</>
            ) : saving ? (
              <><Loader2 className="size-3.5 animate-spin" /> Saving…</>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function PlantUMLViewer({ code }: PlantUMLViewerProps) {
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSource, setShowSource] = useState(false);
  const [showSave, setShowSave] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setSvg(null);
    setError(null);

    fetch("/api/plugins/plantuml/render", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plantuml_syntax: code }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) setError(data.error);
        else setSvg(data.svg);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to reach the PlantUML render endpoint.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [code]);

  if (loading) {
    return <div className="my-4 h-48 animate-pulse rounded-lg bg-muted" />;
  }

  if (error) {
    return (
      <div className="my-4 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-500" />
          <div className="space-y-2">
            <p className="font-medium text-amber-600 dark:text-amber-400">
              PlantUML unavailable
            </p>
            <p className="text-sm text-foreground/70">{error}</p>
            <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 font-mono text-xs text-muted-foreground">
              <Terminal className="size-3.5 shrink-0" />
              <span>
                brew install plantuml &nbsp;|&nbsp; sudo apt install plantuml
              </span>
            </div>
          </div>
        </div>
        {showSource && (
          <pre className="mt-3 overflow-x-auto rounded bg-secondary p-3 text-xs text-foreground/80">
            {code}
          </pre>
        )}
        <button
          onClick={() => setShowSource((s) => !s)}
          className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <Code2 className="size-3.5" />
          {showSource ? "Hide source" : "View source"}
        </button>
      </div>
    );
  }

  return (
    <>
      {showSave && <SaveDialog code={code} onClose={() => setShowSave(false)} />}

      <div className="group relative my-4">
        {/* Toolbar — revealed on hover */}
        <div className="absolute right-2 top-2 z-10 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => setShowSave(true)}
            className="flex items-center gap-1.5 rounded border border-border bg-card/90 px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
            title="Save to Library"
          >
            <BookmarkPlus className="size-3.5" />
            Save
          </button>
          <button
            onClick={() => setShowSource((s) => !s)}
            className="flex items-center gap-1.5 rounded border border-border bg-card/90 px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
          >
            {showSource ? <Eye className="size-3.5" /> : <Code2 className="size-3.5" />}
            {showSource ? "Diagram" : "Source"}
          </button>
        </div>

        {showSource ? (
          <pre className="overflow-x-auto rounded-lg border border-border bg-secondary p-4 text-xs leading-relaxed text-foreground/90">
            {code}
          </pre>
        ) : (
          <div
            className="overflow-x-auto rounded-lg border border-border bg-white p-4 dark:bg-secondary [&_svg]:h-auto [&_svg]:max-w-full"
            dangerouslySetInnerHTML={{ __html: svg! }}
          />
        )}
      </div>
    </>
  );
}
