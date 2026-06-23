import { useRef } from "react";
import { useNavigate } from "react-router";
import {
  Upload,
  FileText,
  FileType,
  FileCode,
  File,
  CheckCircle2,
  Loader2,
  XCircle,
  X,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { useOnboarding, type ImportFileStatus } from "../../context/OnboardingContext";

const ACCEPTED = ".pdf,.docx,.md,.markdown,.txt,.text";

function fileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return FileText;
  if (ext === "docx") return FileType;
  if (ext === "md" || ext === "markdown") return FileCode;
  return File;
}

function fileTypeLabel(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  const map: Record<string, string> = { pdf: "PDF", docx: "DOCX", md: "Markdown", markdown: "Markdown", txt: "Text", text: "Text" };
  return map[ext ?? ""] ?? ext?.toUpperCase() ?? "File";
}

function formatSize(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

const statusConfig: Record<ImportFileStatus, { label: string; cls: string; icon: typeof CheckCircle2 }> = {
  queued: { label: "Queued", cls: "border-border text-muted-foreground", icon: File },
  processing: { label: "Processing", cls: "border-warning/40 bg-warning-soft text-warning", icon: Loader2 },
  completed: { label: "Completed", cls: "border-success/40 bg-success-soft text-success", icon: CheckCircle2 },
  failed: { label: "Failed", cls: "border-danger/40 bg-danger-soft text-danger", icon: XCircle },
};

const supportedTypes = ["Books", "Lecture Notes", "Research Papers", "Documentation", "Markdown Notes", "Text Files", "PDFs"];

export function OnboardingImport() {
  const navigate = useNavigate();
  const fileInput = useRef<HTMLInputElement>(null);
  const { files, addFiles, removeFile, startImport } = useOnboarding();

  const importing = files.some((f) => f.status === "processing");
  const canStart = files.length > 0 && !importing && files.some((f) => f.status === "queued");

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    addFiles(Array.from(e.dataTransfer.files));
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    if (picked.length) addFiles(picked);
    e.target.value = "";
  };

  const handleStart = async () => {
    navigate("/onboarding/analyzing");
    await startImport();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-16">
      <input
        ref={fileInput}
        type="file"
        multiple
        accept={ACCEPTED}
        className="hidden"
        onChange={onFileChange}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl"
      >
        <h2 className="text-center text-2xl font-semibold tracking-tight">Import your documents</h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Drop files below or browse your machine. Supports PDFs, DOCX, Markdown and plain text.
        </p>

        {/* Dropzone */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8 cursor-pointer rounded-2xl border-2 border-dashed border-border bg-card p-12 text-center transition-colors hover:border-primary/50"
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          onClick={() => fileInput.current?.click()}
        >
          <div className="mx-auto flex size-14 items-center justify-center rounded-xl bg-violet-soft text-primary">
            <Upload className="size-7" />
          </div>
          <p className="mt-4 text-base font-medium text-foreground">Drop files here</p>
          <p className="mt-1 text-sm text-muted-foreground">or</p>
          <Button
            variant="outline"
            className="mt-3 gap-2"
            onClick={(e) => { e.stopPropagation(); fileInput.current?.click(); }}
          >
            Browse Files
          </Button>

          {/* Supported content chips */}
          <div className="mt-6 flex flex-wrap justify-center gap-1.5">
            {supportedTypes.map((t) => (
              <span
                key={t}
                className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-[11px] text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Queue */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden rounded-2xl border border-border bg-card"
            >
              {/* Header */}
              <div className="grid grid-cols-[1fr_80px_80px_100px_24px] gap-3 border-b border-border bg-muted/40 px-4 py-2.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                <span>File</span>
                <span>Type</span>
                <span>Size</span>
                <span>Status</span>
                <span />
              </div>

              <AnimatePresence>
                {files.map((item) => {
                  const Icon = fileIcon(item.file.name);
                  const { label, cls, icon: StatusIcon } = statusConfig[item.status];
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      className="grid grid-cols-[1fr_80px_80px_100px_24px] items-center gap-3 border-b border-border px-4 py-3 last:border-0"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                          <Icon className="size-4" />
                        </div>
                        <span className="truncate text-sm">{item.file.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{fileTypeLabel(item.file.name)}</span>
                      <span className="text-xs text-muted-foreground">{formatSize(item.file.size)}</span>
                      <Badge variant="outline" className={`w-fit gap-1 text-[11px] ${cls}`}>
                        <StatusIcon
                          className={`size-3 ${item.status === "processing" ? "animate-spin" : ""}`}
                        />
                        {label}
                      </Badge>
                      {item.status === "queued" && (
                        <button
                          onClick={() => removeFile(item.id)}
                          className="flex size-5 items-center justify-center rounded text-muted-foreground hover:text-foreground"
                        >
                          <X className="size-3.5" />
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="mt-6 flex justify-end">
          <Button
            disabled={!canStart}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleStart}
          >
            Start Import
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
