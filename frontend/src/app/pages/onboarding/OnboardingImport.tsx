import { useRef, useState, useEffect } from "react";
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
  Settings2,
  ChevronDown,
  Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { useOnboarding, type ImportFileStatus } from "../../context/OnboardingContext";
import { api, type ModelsList } from "../../lib/api";
import { useSettingsStore } from "../../stores/useSettingsStore";

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
  const [setupMode, setSetupMode] = useState<"guided" | "explore">("guided");
  const [showSettings, setShowSettings] = useState(false);
  const [health, setHealth] = useState<{ reasoning: string, vision: string, embedding: string, ocr: string } | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [models, setModels] = useState<ModelsList | null>(null);
  const s = useSettingsStore();

  useEffect(() => {
    s.hydrate();
    api.listModels().then(setModels).catch(console.error);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const verifySetup = async () => {
    setVerifying(true);
    try {
      const res = await api.checkSystemHealth();
      setHealth(res);
    } catch (e) {
      console.error(e);
    } finally {
      setVerifying(false);
    }
  };

  const handleStart = async () => {
    if (setupMode === "guided") {
      navigate("/onboarding/analyzing");
      await startImport();
    } else {
      localStorage.setItem("scholar_onboarding_done", "1");
      navigate("/");
      await startImport();
    }
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

        {/* Setup Mode */}
        <div className="mt-8 border-t border-border pt-6">
          <h3 className="mb-4 text-base font-semibold">Workspace Setup</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <label className={`flex-1 flex cursor-pointer gap-3 rounded-xl border p-4 transition-colors ${setupMode === "guided" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
              <input
                type="radio"
                name="setupMode"
                value="guided"
                checked={setupMode === "guided"}
                onChange={() => setSetupMode("guided")}
                className="mt-1"
              />
              <div>
                <div className="font-medium text-foreground flex items-center gap-2">
                  Guided Learning <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-[10px] px-1.5 py-0">Recommended</Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Organize library, Detect subjects, Build roadmap. Let AI do the heavy lifting.
                </div>
              </div>
            </label>
            <label className={`flex-1 flex cursor-pointer gap-3 rounded-xl border p-4 transition-colors ${setupMode === "explore" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
              <input
                type="radio"
                name="setupMode"
                value="explore"
                checked={setupMode === "explore"}
                onChange={() => setSetupMode("explore")}
                className="mt-1"
              />
              <div>
                <div className="font-medium text-foreground">Explore Freely</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Import only. Manually organize your knowledge base later.
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="mt-6 border border-border rounded-xl bg-card overflow-hidden">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex w-full items-center justify-between p-4 text-sm font-medium text-foreground hover:bg-muted/40 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Settings2 className="size-4 text-muted-foreground" />
              Advanced AI Settings
            </div>
            <ChevronDown className={`size-4 text-muted-foreground transition-transform ${showSettings ? "rotate-180" : ""}`} />
          </button>
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                className="overflow-hidden border-t border-border"
              >
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/20">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Reasoning Model</label>
                    <select 
                      className="w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm"
                      value={s.reasoningModel}
                      onChange={(e) => s.set("reasoningModel", e.target.value)}
                    >
                      <option value="auto">Auto</option>
                      {models?.reasoningModels.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Vision Model</label>
                    <select 
                      className="w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm"
                      value={s.visionModel}
                      onChange={(e) => s.set("visionModel", e.target.value)}
                    >
                      <option value="auto">Auto</option>
                      {models?.visionModels.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Embedding Model</label>
                    <select 
                      className="w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm"
                      value={s.embeddingModel}
                      onChange={(e) => s.set("embeddingModel", e.target.value)}
                    >
                      <option value="auto">Auto</option>
                      {models?.embeddingModels.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">OCR Engine</label>
                    <select className="w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm">
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                  <div className="col-span-1 sm:col-span-2 flex items-center justify-between mt-2 pt-4 border-t border-border/50">
                    <div className="flex flex-wrap items-center gap-2">
                      {health && (
                        <>
                          <Badge variant="outline" className={`text-xs gap-1 ${health.reasoning === "Ready" ? "text-success border-success/30" : "text-warning border-warning/30"}`}>
                            Reasoning {health.reasoning === "Ready" ? "✓" : "⚠"}
                          </Badge>
                          <Badge variant="outline" className={`text-xs gap-1 ${health.vision === "Ready" ? "text-success border-success/30" : "text-warning border-warning/30"}`}>
                            Vision {health.vision === "Ready" ? "✓" : "⚠"}
                          </Badge>
                          <Badge variant="outline" className={`text-xs gap-1 ${health.embedding === "Ready" ? "text-success border-success/30" : "text-warning border-warning/30"}`}>
                            Embedding {health.embedding === "Ready" ? "✓" : "⚠"}
                          </Badge>
                          <Badge variant="outline" className={`text-xs gap-1 ${health.ocr === "Ready" ? "text-success border-success/30" : "text-warning border-warning/30"}`}>
                            OCR {health.ocr === "Ready" ? "✓" : "⚠"}
                          </Badge>
                        </>
                      )}
                    </div>
                    <Button variant="outline" size="sm" onClick={verifySetup} disabled={verifying} className="gap-2 shrink-0">
                      {verifying ? <Loader2 className="size-3.5 animate-spin" /> : <Activity className="size-3.5" />}
                      Verify Setup
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-end border-t border-border pt-6">
          <Button
            disabled={!canStart}
            size="lg"
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 min-w-40"
            onClick={handleStart}
          >
            Start Setup
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
