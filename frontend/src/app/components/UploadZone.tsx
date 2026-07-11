import { useRef, useState } from "react";
import { Upload, Loader2, CheckCircle2, XCircle, X } from "lucide-react";
import { motion } from "motion/react";
import { PaperCard, PaperIconCircle } from "@paper-ui/core";
import { PaperButton, GhostButton } from "@paper-ui/components/buttons";

interface UploadItem {
  id: string;
  file: File;
  status: "queued" | "uploading" | "processing" | "completed" | "failed";
  error?: string;
}

interface UploadZoneProps {
  onUploadFile: (file: File) => Promise<void>;
  onBatchComplete?: (result: { completed: number; failed: number }) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  label?: string;
  description?: string;
  concurrency?: number;
}

const uploadMeta: Record<string, { icon: typeof Loader2; cls: string }> = {
  queued: { icon: Loader2, cls: "text-muted-foreground" },
  uploading: { icon: Loader2, cls: "text-primary" },
  processing: { icon: Loader2, cls: "text-warning" },
  completed: { icon: CheckCircle2, cls: "text-success" },
  failed: { icon: XCircle, cls: "text-danger" },
};

export function UploadZone({
  onUploadFile,
  onBatchComplete,
  accept = ".pdf,.md,.markdown,.txt",
  multiple = true,
  disabled = false,
  label = "Drop files to upload",
  description = "PDF, Markdown or plain text",
  concurrency = 3,
}: UploadZoneProps) {
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);

  const enqueue = async (files: FileList | File[]) => {
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
        await onUploadFile(item.file);
        setUploads((prev) => prev.map((u) => (u.id === item.id ? { ...u, status: "completed" } : u)));
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
      if (running.size >= concurrency) {
        await Promise.race(running);
      }
    }
    await Promise.allSettled(running);

    if (onBatchComplete) onBatchComplete({ completed, failed });
  };

  const busy = uploads.some(
    (u) => u.status === "queued" || u.status === "uploading" || u.status === "processing",
  );
  const done = uploads.filter((u) => u.status === "completed").length;
  const total = uploads.length;

  return (
    <>
      <input
        ref={fileInput}
        type="file"
        multiple={multiple}
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const files = e.target.files;
          if (files && files.length > 0) {
            void enqueue(files);
          }
          if (fileInput.current) fileInput.current.value = "";
        }}
      />

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <PaperCard
          className="p-8 text-center cursor-pointer"
          onDragOver={(e: React.DragEvent) => e.preventDefault()}
          onDrop={(e: React.DragEvent) => {
            e.preventDefault();
            if (disabled) return;
            const files = e.dataTransfer.files;
            if (files && files.length > 0) {
              void enqueue(multiple ? files : [files[0]]);
            }
          }}
        >
          {uploads.length === 0 ? (
            <>
              <PaperIconCircle className="p-5 mx-auto flex size-12 items-center justify-center rounded-xl bg-violet-soft text-primary">
                <Upload className="size-6" />
              </PaperIconCircle>
              <h3 className="mt-4 font-caveat text-[26px] text-ink">{label}</h3>
              <p className="mt-1 font-kalam text-sm text-ink-muted">{description}</p>
              <PaperButton
                tone="dark"
                className="mt-4 gap-2"
                onClick={() => fileInput.current?.click()}
                disabled={disabled}
              >
                <Upload className="size-4" />
                Browse files
              </PaperButton>
            </>
          ) : (
            <div className="space-y-3 text-left">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-architect text-sm text-ink">
                    {busy ? "Uploading…" : `${done}/${total} files`}
                  </h3>
                  <span className="font-kalam text-xs text-ink-muted">
                    {done}/{total}
                  </span>
                </div>
                {!busy && (
                  <GhostButton size="sm" onClick={() => setUploads([])} className="h-7 gap-1 text-xs">
                    <X className="size-3" />
                    Clear
                  </GhostButton>
                )}
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/[0.06]">
                <motion.div
                  className="h-full rounded-full bg-ink"
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
                    <div key={item.id} className="flex items-center gap-2">
                      <Icon
                        className={`size-3.5 shrink-0 ${
                          item.status === "queued" ||
                          item.status === "uploading" ||
                          item.status === "processing"
                            ? "animate-spin"
                            : ""
                        } ${m.cls}`}
                      />
                      <span className="min-w-0 flex-1 truncate font-kalam text-[14px] text-ink">
                        {item.file.name}
                      </span>
                      {item.status === "failed" && (
                        <span className="truncate font-kalam text-xs text-danger">{item.error}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PaperCard>
      </motion.div>
    </>
  );
}
