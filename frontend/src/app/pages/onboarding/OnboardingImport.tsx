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
  Settings2,
  ChevronDown,
  Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PaperButton, GhostButton } from "@paper-ui/components/buttons";
import { PaperBadge, Pill } from "@paper-ui/components/badges";
import { PaperCard, PaperPanel, PaperH2, PaperH3, PaperH5, PaperIconCircle } from "@paper-ui/core";
import { PaperSelect, PaperRadio } from "@paper-ui/components/inputs";
import { LoadingPaper } from "@paper-ui/components/feedback";
import { ArrowDoodle } from "@paper-ui/components/doodles";
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

type StatusCfg = { label: string; tone: "sage" | "ochre" | "brick" | "ink"; icon: typeof CheckCircle2 };
const statusConfig: Record<ImportFileStatus, StatusCfg> = {
  queued:     { label: "Queued",     tone: "ink",   icon: File },
  processing: { label: "Processing", tone: "ochre", icon: Loader2 },
  completed:  { label: "Completed",  tone: "sage",  icon: CheckCircle2 },
  failed:     { label: "Failed",     tone: "brick", icon: XCircle },
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
    localStorage.setItem("scholar_onboarding_done", "1");
    navigate("/");
    await startImport();
  };

  // Build model options arrays for PaperSelect
  const toOptions = (items: string[] | undefined) =>
    [{ value: "auto", label: "Auto" }, ...(items ?? []).map((m) => ({ value: m, label: m }))];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f5f0e8] px-6 py-16">
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
        <div className="text-center mb-8">
          <PaperH2>Import your documents</PaperH2>
          <p className="mt-2 font-kalam text-[14px] text-ink-muted">
            Drop files below or browse your machine. Supports PDFs, DOCX, Markdown and plain text.
          </p>
        </div>

        {/* Dropzone */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <PaperCard
            shadow="md"
            className="cursor-pointer p-12 text-center transition-all hover:scale-[1.005]"
            onClick={() => fileInput.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
          >
            <div className="flex flex-col items-center">
              <PaperIconCircle tone="lavender" size={56}>
                <Upload size={24} />
              </PaperIconCircle>
              <p className="mt-4 font-architect text-[15px] text-ink">Drop files here</p>
              <p className="mt-1 font-kalam text-[13px] text-ink-muted">or</p>
              <div className="mt-3" onClick={(e) => { e.stopPropagation(); fileInput.current?.click(); }}>
                <PaperButton tone="paper" size="sm">Browse Files</PaperButton>
              </div>

              {/* Supported content chips */}
              <div className="mt-6 flex flex-wrap justify-center gap-1.5">
                {supportedTypes.map((t) => (
                  <PaperBadge key={t} tone="ink">{t}</PaperBadge>
                ))}
              </div>
            </div>
          </PaperCard>
        </motion.div>

        {/* Queue */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden"
            >
              <PaperCard shadow="sm">
                {/* Header */}
                <div className="grid grid-cols-[1fr_80px_80px_100px_24px] gap-3 border-b border-[#e8e3d8] bg-black/5 px-4 py-2.5">
                  {["File", "Type", "Size", "Status", ""].map((h) => (
                    <span key={h} className="font-architect text-[11px] uppercase tracking-wide text-ink-muted">
                      {h}
                    </span>
                  ))}
                </div>

                <AnimatePresence>
                  {files.map((item) => {
                    const Icon = fileIcon(item.file.name);
                    const { label, tone, icon: StatusIcon } = statusConfig[item.status];
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        className="grid grid-cols-[1fr_80px_80px_100px_24px] items-center gap-3 border-b border-[#e8e3d8] px-4 py-3 last:border-0"
                      >
                        <div className="flex min-w-0 items-center gap-2.5">
                          <PaperIconCircle tone="ink" size={32}>
                            <Icon size={14} />
                          </PaperIconCircle>
                          <span className="font-kalam text-[13px] text-ink truncate">{item.file.name}</span>
                        </div>
                        <span className="font-architect text-[11px] text-ink-muted">{fileTypeLabel(item.file.name)}</span>
                        <span className="font-architect text-[11px] text-ink-muted">{formatSize(item.file.size)}</span>
                        <Pill tone={tone}>
                          <StatusIcon
                            size={10}
                            className={item.status === "processing" ? "animate-spin" : ""}
                          />
                          {label}
                        </Pill>
                        {item.status === "queued" && (
                          <button
                            onClick={() => removeFile(item.id)}
                            className="flex size-5 items-center justify-center text-ink-muted hover:text-ink"
                          >
                            <X size={13} />
                          </button>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </PaperCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Setup Mode */}
        <div className="mt-8 border-t border-[#d4cfc2] pt-6">
          <PaperH3 className="mb-4">Workspace Setup</PaperH3>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Guided */}
            <div
              className={`flex-1 cursor-pointer ${setupMode === "guided" ? "ring-2 ring-[#262320] ring-offset-2 rounded-lg" : ""}`}
              onClick={() => setSetupMode("guided")}
            >
              <PaperCard shadow={setupMode === "guided" ? "md" : "sm"} className="p-4">
                <div className="flex items-start gap-3">
                  <PaperRadio
                    value="guided"
                    selectedValue={setupMode}
                    onChange={(v) => setSetupMode(v as "guided" | "explore")}
                    name="setupMode"
                  />
                  <div>
                    <p className="font-architect text-[14px] text-ink flex items-center gap-2">
                      Guided Learning
                      <PaperBadge tone="lavender">Recommended</PaperBadge>
                    </p>
                    <p className="font-kalam text-[12px] text-ink-muted mt-1">
                      Organize library, Detect subjects, Build roadmap. Let AI do the heavy lifting.
                    </p>
                  </div>
                </div>
              </PaperCard>
            </div>

            {/* Explore */}
            <div
              className={`flex-1 cursor-pointer ${setupMode === "explore" ? "ring-2 ring-[#262320] ring-offset-2 rounded-lg" : ""}`}
              onClick={() => setSetupMode("explore")}
            >
              <PaperCard shadow={setupMode === "explore" ? "md" : "sm"} className="p-4">
                <div className="flex items-start gap-3">
                  <PaperRadio
                    value="explore"
                    selectedValue={setupMode}
                    onChange={(v) => setSetupMode(v as "guided" | "explore")}
                    name="setupMode"
                  />
                  <div>
                    <p className="font-architect text-[14px] text-ink">Explore Freely</p>
                    <p className="font-kalam text-[12px] text-ink-muted mt-1">
                      Import only. Manually organize your knowledge base later.
                    </p>
                  </div>
                </div>
              </PaperCard>
            </div>
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="mt-6">
          <PaperPanel className="overflow-hidden">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex w-full items-center justify-between p-4"
            >
              <span className="font-architect text-[14px] text-ink flex items-center gap-2">
                <Settings2 size={15} className="text-ink-muted" />
                Advanced AI Settings
              </span>
              <ChevronDown
                size={15}
                className={`text-ink-muted transition-transform ${showSettings ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="overflow-hidden border-t border-[#e8e3d8]"
                >
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <PaperSelect
                      label="Reasoning Model"
                      value={s.reasoningModel}
                      onChange={(v) => s.set("reasoningModel", v)}
                      options={toOptions(models?.reasoningModels)}
                    />
                    <PaperSelect
                      label="Vision Model"
                      value={s.visionModel}
                      onChange={(v) => s.set("visionModel", v)}
                      options={toOptions(models?.visionModels)}
                    />
                    <PaperSelect
                      label="Embedding Model"
                      value={s.embeddingModel}
                      onChange={(v) => s.set("embeddingModel", v)}
                      options={toOptions(models?.embeddingModels)}
                    />
                    <PaperSelect
                      label="OCR Engine"
                      value="auto"
                      onChange={() => {}}
                      options={[{ value: "auto", label: "Auto" }]}
                    />

                    <div className="col-span-1 sm:col-span-2 flex items-center justify-between mt-2 pt-4 border-t border-[#e8e3d8]/50">
                      <div className="flex flex-wrap items-center gap-2">
                        {health && (
                          <>
                            {[
                              { key: "reasoning", label: "Reasoning" },
                              { key: "vision",    label: "Vision" },
                              { key: "embedding", label: "Embedding" },
                              { key: "ocr",       label: "OCR" },
                            ].map(({ key, label }) => {
                              const val = health[key as keyof typeof health];
                              return (
                                <PaperBadge key={key} tone={val === "Ready" ? "sage" : "ochre"}>
                                  {label} {val === "Ready" ? "✓" : "⚠"}
                                </PaperBadge>
                              );
                            })}
                          </>
                        )}
                      </div>
                      <PaperButton tone="paper" size="sm" onClick={verifySetup} disabled={verifying}>
                        {verifying ? <Loader2 size={13} className="animate-spin" /> : <Activity size={13} />}
                        Verify Setup
                      </PaperButton>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </PaperPanel>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-end border-t border-[#d4cfc2] pt-6">
          <PaperButton
            disabled={!canStart}
            tone="dark"
            size="lg"
            onClick={handleStart}
          >
            Start Setup
            <ArrowDoodle size={18} color="#fbf8f2" />
          </PaperButton>
        </div>
      </motion.div>
    </div>
  );
}
