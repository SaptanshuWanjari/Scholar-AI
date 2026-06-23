import { useState } from "react";
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
  MoreVertical,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Page } from "../components/Page";
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
import { documents, courses } from "../lib/mock-data";
import type { DocStatus, DocType } from "../lib/types";

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

  const filtered = documents.filter(
    (d) =>
      d.title.toLowerCase().includes(query.toLowerCase()) &&
      (course === "all" || d.course === course),
  );

  return (
    <Page className="space-y-5">
      {/* Upload zone */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-dashed border-border bg-card p-8 text-center transition-colors hover:border-primary/50"
        onClick={() => toast.success("Upload started", { description: "Your file is being indexed." })}
      >
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-violet-soft text-primary">
          <Upload className="size-6" />
        </div>
        <h3 className="mt-4">Drop files to upload</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          PDF, DOCX, Markdown or plain text · up to 50 MB
        </p>
        <Button className="mt-4 gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Upload className="size-4" /> Browse files
        </Button>
      </motion.div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
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
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="grid grid-cols-[1fr_140px_90px_70px_120px_40px] gap-4 border-b border-border bg-muted/40 px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <span>Name</span>
          <span>Course</span>
          <span>Size</span>
          <span>Pages</span>
          <span>Status</span>
          <span />
        </div>
        {filtered.map((d, i) => {
          const Icon = typeIcon[d.type];
          const status = statusMeta[d.status];
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
              <span className="truncate text-sm text-muted-foreground">{d.course}</span>
              <span className="text-sm text-muted-foreground">
                {d.sizeKb > 1024 ? `${(d.sizeKb / 1024).toFixed(1)} MB` : `${d.sizeKb} KB`}
              </span>
              <span className="text-sm text-muted-foreground">{d.pages}</span>
              <Badge variant="outline" className={`w-fit gap-1.5 ${status.cls}`}>
                <StatusIcon className={`size-3 ${d.status === "processing" ? "animate-spin" : ""}`} />
                {status.label}
              </Badge>
              <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); toast.success("Options opened"); }} className="size-8 text-muted-foreground">
                <MoreVertical className="size-4" />
              </Button>
            </motion.div>
          );
        })}
      </div>
    </Page>
  );
}
