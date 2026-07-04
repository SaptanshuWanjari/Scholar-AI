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
import { toast } from "@/app/lib/toast";
import { Page } from "../components/Page";
import { UploadZone } from "../components/UploadZone";
import { IconButton } from "@paper-ui/components/buttons";
import {
  SketchSearch,
  PaperSelect,
  PaperInput,
} from "@paper-ui/components/inputs";
import {
  PaperTable,
  TableHeader,
  TableRow,
  TableCell,
  EmptyTable,
} from "@paper-ui/components/tables";
import { InsightBox } from "@paper-ui/components/stats/InsightBox";
import { PaperBadge } from "@paper-ui/components/badges";
import { api } from "../lib/api";
import type { Course, DocStatus, DocType, DocumentItem } from "../lib/types";

const typeIcon: Record<DocType, typeof FileText> = {
  pdf: FileText,
  docx: FileType,
  markdown: FileCode,
  text: File,
};

const statusMeta: Record<
  DocStatus,
  { label: string; icon: typeof CheckCircle2; tone: "sage" | "ochre" | "brick" }
> = {
  indexed: { label: "Indexed", icon: CheckCircle2, tone: "sage" },
  processing: { label: "Processing", icon: Loader2, tone: "ochre" },
  failed: { label: "Failed", icon: XCircle, tone: "brick" },
};

export function Documents() {
  const [query, setQuery] = useState("");
  const [course, setCourse] = useState("all");
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  const refresh = () => {
    api
      .listDocuments()
      .then(setDocuments)
      .catch(() => { });
    api
      .listCourses()
      .then(setCourses)
      .catch(() => { });
  };

  useEffect(refresh, []);

  const filtered = documents.filter(
    (d) =>
      d.title.toLowerCase().includes(query.toLowerCase()) &&
      (course === "all" ||
        d.course === course ||
        (course === "unassigned" && !d.course)),
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
    const target =
      course !== "all" && course !== "unassigned" ? course : undefined;
    const doc = await api.uploadDocument(file, target);
    if (doc.jobId) {
      const job = await api.pollJobUntilDone(doc.jobId);
      if (job.status === "failed")
        throw new Error(job.error ?? "Indexing failed");
    }
  };

  const onBatchComplete = (result: { completed: number; failed: number }) => {
    if (result.completed > 0) {
      toast.success(
        `${result.completed} document${result.completed > 1 ? "s" : ""} indexed`,
        {
          description:
            result.failed > 0 ? `${result.failed} failed` : undefined,
        },
      );
    }
    refresh();
  };

  const onCourseChange = async (docId: string, newCourse: string) => {
    try {
      const targetCourse = newCourse === "unassigned" ? "" : newCourse;
      await api.updateDocument(docId, targetCourse);
      setDocuments((docs) =>
        docs.map((d) => (d.id === docId ? { ...d, course: targetCourse } : d)),
      );
      toast.success("Document updated", {
        description: `Moved to ${newCourse === "unassigned" ? "Unassigned" : newCourse}`,
      });
    } catch (err) {
      toast.error("Update failed", {
        description:
          err instanceof Error ? err.message : "Failed to move document",
      });
    }
  };

  return (
    <Page className="space-y-5">
      <UploadZone
        onUploadFile={handleUploadFile}
        onBatchComplete={onBatchComplete}
        description={`PDF, Markdown or plain text${course !== "all" ? ` · into ${course}` : " · into first course"}`}
      />

      <InsightBox variant="tip">
        Drag &amp; drop straight onto the box above, or upload PDFs, Markdown
        and plain text. Everything you add becomes searchable across the whole
        app.
      </InsightBox>

      {/* Toolbar */}
      <div
        data-tour="documents-toolbar"
        className="grid grid-cols-4 items-center gap-3"
      >
        <div className="col-span-2 w-full">
          <PaperInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documents…"
            width="100%"
            className="w-full"
          />
        </div>

        <div className="w-full">
          <PaperSelect
            value={course}
            onChange={setCourse}
            options={[
              { value: "all", label: "All courses" },
              { value: "unassigned", label: "Unassigned" },
              ...courses.map((c) => ({ value: c.name, label: c.name })),
            ]}
            placeholder="All courses"
            className="w-full"
          />
        </div>

        <div className="flex justify-end">
          <span className="font-architect text-sm text-ink-muted whitespace-nowrap">
            {filtered.length} documents
          </span>
        </div>
      </div>
      {/* Table */}
      <div data-tour="documents-list">
        <PaperTable>
          <TableHeader>
            <tr>
              <th className="font-architect text-[13px] text-ink-muted uppercase tracking-wide px-4 py-3 text-left">
                Name
              </th>
              <th className="font-architect text-[13px] text-ink-muted uppercase tracking-wide px-4 py-3 text-left">
                Course
              </th>
              <th className="font-architect text-[13px] text-ink-muted uppercase tracking-wide px-4 py-3 text-left">
                Size
              </th>
              <th className="font-architect text-[13px] text-ink-muted uppercase tracking-wide px-4 py-3 text-left w-20">
                Pages
              </th>
              <th className="font-architect text-[13px] text-ink-muted uppercase tracking-wide px-4 py-3 text-left w-28">
                Status
              </th>
              <th className="w-12" />
            </tr>
          </TableHeader>
          {filtered.length === 0 ? (
            <EmptyTable
              colSpan={6}
              message="No documents yet."
              hint="Upload a PDF, Markdown or text file to get started."
            />
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
                          <div className="truncate font-kalam text-[15px] font-bold text-ink">
                            {d.title}
                          </div>
                          <div className="font-architect text-xs uppercase text-ink-muted">
                            {d.type}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-44 py-1">
                      <PaperSelect
                        value={d.course || "unassigned"}
                        onChange={(val) => void onCourseChange(d.id, val)}
                        options={[
                          { value: "unassigned", label: "Unassigned" },
                          ...courses.map((c) => ({
                            value: c.name,
                            label: c.name,
                          })),
                        ]}
                        className="h-8 py-1 px-2 text-xs font-architect"
                        wrapperClassName="w-36"
                        placeholder="Assign course..."
                      />
                    </TableCell>
                    <TableCell muted>
                      {d.sizeKb > 1024
                        ? `${(d.sizeKb / 1024).toFixed(1)} MB`
                        : `${d.sizeKb} KB`}
                    </TableCell>
                    <TableCell muted>{d.pages}</TableCell>
                    <TableCell>
                      <PaperBadge
                        tone={status.tone}
                        className="gap-1 px-2 py-0.5 text-sm font-architect font-medium"
                      >
                        <StatusIcon
                          className={`size-3 ${d.status === "processing" ? "animate-spin" : ""}`}
                        />
                        {status.label}
                      </PaperBadge>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        label={`Delete ${d.title}`}
                        onClick={() => void onDelete(d.id, d.title)}
                          className='bg-red-500/50 hover:bg-red-400 text-black rounded-lg hover:text-white'
                      >
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
