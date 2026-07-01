import { useEffect, useState } from "react";
import {
  FileText,
  FileType,
  FileCode,
  File,
  CheckCircle2,
  Loader2,
  XCircle,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Page } from "../components/Page";
import { UploadZone } from "../components/UploadZone";
import { ContextualTip } from "../guidance/components/ContextualTip";
import { IconButton } from "@paper-ui/components/buttons";
import { SketchSearch, PaperSelect } from "@paper-ui/components/inputs";
import { PaperTable, TableHeader, TableRow, TableCell, EmptyTable } from "@paper-ui/components/tables";
import { api } from "../lib/api";
import type { Course, DocStatus, DocType, DocumentItem } from "../lib/types";

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

export function Documents() {
  const [query, setQuery] = useState("");
  const [course, setCourse] = useState("all");
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

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

  const handleUploadFile = async (file: File) => {
    const target = course !== "all" && course !== "unassigned" ? course : undefined;
    const doc = await api.uploadDocument(file, target);
    if (doc.jobId) {
      const job = await api.pollJobUntilDone(doc.jobId);
      if (job.status === "failed") throw new Error(job.error ?? "Indexing failed");
    }
  };

  const onBatchComplete = (result: { completed: number; failed: number }) => {
    if (result.completed > 0) {
      toast.success(`${result.completed} document${result.completed > 1 ? "s" : ""} indexed`, {
        description: result.failed > 0 ? `${result.failed} failed` : undefined,
      });
    }
    refresh();
  };

  return (
    <Page className="space-y-5">
      <UploadZone
        onUploadFile={handleUploadFile}
        onBatchComplete={onBatchComplete}
        description={`PDF, Markdown or plain text${course !== "all" ? ` · into ${course}` : " · into first course"}`}
      />

      <ContextualTip id="documents-formats">
        Drag &amp; drop straight onto the box above, or upload PDFs, Markdown and
        plain text. Everything you add becomes searchable across the whole app.
      </ContextualTip>

      {/* Toolbar */}
      <div data-tour="documents-toolbar" className="flex flex-wrap items-center gap-3">
        <SketchSearch
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search documents…"
          className="flex-1 min-w-56"
          width="100%"
        />
        <PaperSelect
          value={course}
          onChange={setCourse}
          options={[
            { value: "all", label: "All courses" },
            { value: "unassigned", label: "Unassigned" },
            ...courses.map((c) => ({ value: c.name, label: c.name })),
          ]}
          placeholder="All courses"
          className="w-52"
        />
        <span className="font-architect text-sm text-ink-muted">{filtered.length} documents</span>
      </div>

      {/* Table */}
      <div data-tour="documents-list">
        <PaperTable>
          <TableHeader>
            <tr>
              <th className="font-architect text-[13px] text-ink-muted uppercase tracking-wide px-4 py-3 text-left">Name</th>
              <th className="font-architect text-[13px] text-ink-muted uppercase tracking-wide px-4 py-3 text-left">Course</th>
              <th className="font-architect text-[13px] text-ink-muted uppercase tracking-wide px-4 py-3 text-left">Size</th>
              <th className="font-architect text-[13px] text-ink-muted uppercase tracking-wide px-4 py-3 text-left w-20">Pages</th>
              <th className="font-architect text-[13px] text-ink-muted uppercase tracking-wide px-4 py-3 text-left w-28">Status</th>
              <th className="w-12" />
            </tr>
          </TableHeader>
          {filtered.length === 0 ? (
            <EmptyTable colSpan={6} message="No documents yet." hint="Upload a PDF, Markdown or text file to get started." />
          ) : (
            <tbody>
              {filtered.map((d, i) => {
                const Icon = typeIcon[d.type] ?? File;
                const status = statusMeta[d.status] ?? statusMeta.indexed;
                const StatusIcon = status.icon;
                return (
                  <TableRow key={d.id} index={i}>
                    <TableCell>
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-black/[0.04] text-ink-muted">
                          <Icon className="size-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="truncate font-kalam text-[15px] font-bold text-ink">{d.title}</div>
                          <div className="font-architect text-xs uppercase text-ink-muted">{d.type}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell muted className="max-w-32">
                      <span className="truncate">{d.course || "—"}</span>
                    </TableCell>
                    <TableCell muted>{d.sizeKb > 1024 ? `${(d.sizeKb / 1024).toFixed(1)} MB` : `${d.sizeKb} KB`}</TableCell>
                    <TableCell muted>{d.pages}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1.5 font-architect text-[13px] ${status.cls}`}>
                        <StatusIcon className={`size-3 ${d.status === "processing" ? "animate-spin" : ""}`} />
                        {status.label}
                      </span>
                    </TableCell>
                    <TableCell>
                      <IconButton label={`Delete ${d.title}`} onClick={() => void onDelete(d.id, d.title)}>
                        <Trash2 className="size-4" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </tbody>
          )}
        </PaperTable>
      </div>
    </Page>
  );
}
