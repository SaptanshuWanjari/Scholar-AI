import { useEffect, useRef, useState } from "react";
import {
  Upload,
  FileText,
  FileType,
  FileCode,
  File,
  CheckCircle2,
  Loader2,
  XCircle,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Page } from "../components/Page";
import { ContextualTip } from "../guidance/components/ContextualTip";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { api } from "../lib/api";
import type { Course, DocStatus, DocType, DocumentItem } from "../lib/types";

const CONCURRENCY = 3;

interface UploadItem {
  id: string;
  file: File;
  status: "queued" | "uploading" | "processing" | "completed" | "failed";
  error?: string;
}

const typeIcon: Record<DocType, typeof FileText> = {
  pdf: FileText,
  docx: FileType,
  markdown: FileCode,
  text: File,
};

const statusMeta: Record<DocStatus, { label: string; icon: typeof CheckCircle2; cls: string }> = {
  indexed: { label: "Indexed", icon: CheckCircle2, cls: "border-success/40 bg-success-soft text-success" },
  processing: { label: "Processing", icon: Loader2, cls: "border-warning/40 bg-warning-soft text-warning" },
  failed: { label: "Failed", icon: XCircle, cls: "border-danger/40 bg-danger-soft text-danger" },
};

const uploadMeta: Record<string, { icon: typeof Loader2; cls: string }> = {
  queued: { icon: Loader2, cls: "text-muted-foreground" },
  uploading: { icon: Loader2, cls: "text-primary" },
  processing: { icon: Loader2, cls: "text-warning" },
  completed: { icon: CheckCircle2, cls: "text-success" },
  failed: { icon: XCircle, cls: "text-danger" },
};

export function Documents() {
  const [query, setQuery] = useState("");
  const [course, setCourse] = useState("all");
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);

  const refresh = () => {
    api.listDocuments().then(setDocuments).catch(() => {});
    api.listCourses().then(setCourses).catch(() => {});
  };

  useEffect(refresh, []);

  const filtered = documents.filter(
    (d) =>
      d.title.toLowerCase().includes(query.toLowerCase()) &&
      (course === "all" || d.course === course || (course === "unassigned" && !d.course)),
  );

  const onDelete = async (id: string, title: string) => {
    try {
      await api.deleteDocument(id);
      setDocuments((docs) => docs.filter((d) => d.id !== id));
      toast.success("Deleted", { description: title });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Delete failed";
      toast.error("Delete failed", { description: msg });
    }
  };

  const onUpdateCourse = async (id: string, newCourse: string) => {
    try {
      const updated = await api.updateDocument(id, newCourse);
      setDocuments((docs) => docs.map((d) => (d.id === id ? updated : d)));
      toast.success("Document moved", { description: `Moved to ${newCourse}` });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Move failed";
      toast.error("Move failed", { description: msg });
    }
  };

  const enqueue = async (files: FileList | File[]) => {
    const target = course !== "all" && course !== "unassigned" ? course : undefined;
    const items: UploadItem[] = Array.from(files).map((f) => ({
      id: `up-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      file: f,
      status: "queued",
    }));
    setUploads((prev) => [...prev, ...items]);

    let completed = 0;
    let failed = 0;

    const processOne = async (item: UploadItem) => {
      setUploads((prev) => prev.map((u) => (u.id === item.id ? { ...u, status: "uploading" } : u)));
      try {
        const doc = await api.uploadDocument(item.file, target);
        setUploads((prev) =>
          prev.map((u) => (u.id === item.id ? { ...u, status: "processing" } : u)),
        );
        if (doc.jobId) {
          const job = await api.pollJobUntilDone(doc.jobId);
          if (job.status === "failed") throw new Error(job.error ?? "Indexing failed");
        }
        setUploads((prev) =>
          prev.map((u) => (u.id === item.id ? { ...u, status: "completed" } : u)),
        );
        completed++;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Upload failed";
        setUploads((prev) =>
          prev.map((u) => (u.id === item.id ? { ...u, status: "failed", error: msg } : u)),
        );
        failed++;
      }
    };

    const running = new Set<Promise<void>>();
    for (const item of items) {
      const p = processOne(item).finally(() => running.delete(p));
      running.add(p);
      if (running.size >= CONCURRENCY) {
        await Promise.race(running);
      }
    }
    await Promise.allSettled(running);

    if (completed > 0) {
      toast.success(`${completed} document${completed > 1 ? "s" : ""} indexed`, {
        description: failed > 0 ? `${failed} failed` : undefined,
      });
    }
    refresh();
  };

  const busy = uploads.some((u) => u.status === "queued" || u.status === "uploading" || u.status === "processing");
  const done = uploads.filter((u) => u.status === "completed").length;
  const total = uploads.length;

  return (
    <Page className="space-y-5">
      <input
        ref={fileInput}
        type="file"
        multiple
        accept=".pdf,.md,.markdown,.txt"
        className="hidden"
        onChange={(e) => {
          const files = e.target.files;
          if (files && files.length > 0) {
            void enqueue(files);
          }
          if (fileInput.current) fileInput.current.value = "";
        }}
      />

      {/* Upload zone */}
      <motion.div
        data-tour="documents-upload"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-dashed border-border bg-card p-8 text-center transition-colors hover:border-primary/50"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const files = e.dataTransfer.files;
          if (files && files.length > 0) void enqueue(files);
        }}
      >
        {uploads.length === 0 ? (
          <>
            <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-violet-soft text-primary">
              <Upload className="size-6" />
            </div>
            <h3 className="mt-4">Drop files to upload</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              PDF, Markdown or plain text
              {course !== "all" ? ` · into ${course}` : " · into first course"}
            </p>
            <Button
              className="mt-4 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => fileInput.current?.click()}
            >
              <Upload className="size-4" />
              Browse files
            </Button>
          </>
        ) : (
          <div className="space-y-3 text-left">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium">
                  {busy ? "Uploading…" : `${done}/${total} files`}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {done}/{total}
                </span>
              </div>
              {!busy && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setUploads([])}
                  className="h-7 gap-1 text-xs text-muted-foreground"
                >
                  <X className="size-3" />
                  Clear
                </Button>
              )}
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${(done / Math.max(total, 1)) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="max-h-40 space-y-1 overflow-y-auto">
              {uploads.map((item) => {
                const m = uploadMeta[item.status];
                const Icon = m.icon;
                return (
                  <div key={item.id} className="flex items-center gap-2 text-sm">
                    <Icon className={`size-3.5 shrink-0 ${item.status === "queued" || item.status === "uploading" || item.status === "processing" ? "animate-spin" : ""} ${m.cls}`} />
                    <span className="min-w-0 flex-1 truncate">{item.file.name}</span>
                    {item.status === "failed" && (
                      <span className="truncate text-xs text-danger">{item.error}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>

      <ContextualTip id="documents-formats">
        Drag &amp; drop straight onto the box above, or upload PDFs, Markdown and
        plain text. Everything you add becomes searchable across the whole app.
      </ContextualTip>

      {/* Toolbar */}
      <div data-tour="documents-toolbar" className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-56">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documents…"
            className="bg-input-background pl-9"
          />
        </div>
        <Select value={course} onValueChange={setCourse}>
          <SelectTrigger className="w-52 bg-input-background">
            <SelectValue placeholder="All courses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All courses</SelectItem>
            <SelectItem value="unassigned">Unassigned</SelectItem>
            {courses.map((c) => (
              <SelectItem key={c.id} value={c.name}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">{filtered.length} documents</span>
      </div>

      {/* Table */}
      <div data-tour="documents-list" className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="grid grid-cols-[1fr_140px_90px_70px_120px_40px] gap-4 border-b border-border bg-muted/40 px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <span>Name</span>
          <span>Course</span>
          <span>Size</span>
          <span>Pages</span>
          <span>Status</span>
          <span />
        </div>
        {filtered.length === 0 && (
          <div className="px-5 py-10 text-center text-sm text-muted-foreground">
            No documents yet. Upload a PDF, Markdown or text file to get started.
          </div>
        )}
        {filtered.map((d, i) => {
          const Icon = typeIcon[d.type] ?? File;
          const status = statusMeta[d.status] ?? statusMeta.indexed;
          const StatusIcon = status.icon;
          return (
            <motion.div
              key={d.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="grid grid-cols-[1fr_140px_90px_70px_120px_40px] items-center gap-4 border-b border-border px-5 py-3 last:border-0 hover:bg-accent/30"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm">{d.title}</div>
                  <div className="text-xs uppercase text-muted-foreground">{d.type}</div>
                </div>
              </div>
              <div className="flex min-w-0 items-center pr-2">
                <Select
                  value={d.course}
                  onValueChange={(val) => {
                    if (val !== d.course) void onUpdateCourse(d.id, val);
                  }}
                >
                  <SelectTrigger className="h-8 w-full border-transparent bg-transparent px-2 text-sm text-muted-foreground hover:bg-muted focus:ring-0">
                    <div className="truncate text-left">{d.course}</div>
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((c) => (
                      <SelectItem key={c.id} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <span className="text-sm text-muted-foreground">
                {d.sizeKb > 1024 ? `${(d.sizeKb / 1024).toFixed(1)} MB` : `${d.sizeKb} KB`}
              </span>
              <span className="text-sm text-muted-foreground">{d.pages}</span>
              <Badge variant="outline" className={`w-fit gap-1.5 ${status.cls}`}>
                <StatusIcon className={`size-3 ${d.status === "processing" ? "animate-spin" : ""}`} />
                {status.label}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  void onDelete(d.id, d.title);
                }}
                className="size-8 text-muted-foreground hover:text-danger"
              >
                <Trash2 className="size-4" />
              </Button>
            </motion.div>
          );
        })}
      </div>
    </Page>
  );
}
