import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Cpu, Filter, Keyboard, User, ShieldCheck, Database, TriangleAlert, Trash2, LifeBuoy, RotateCcw, BookOpen, Compass, Puzzle, Terminal, Paintbrush, Save } from "lucide-react";
import { Page } from "../components/Page";
import { useGuidanceStore } from "../guidance/useGuidanceStore";
import { PaperSelect } from "@paper-ui/components/inputs";
import type { SelectOption } from "@paper-ui/components/inputs";
import { PaperSwitch } from "@paper-ui/components/inputs";
import { PaperSlider } from "@paper-ui/components/inputs";
import { PaperInput } from "@paper-ui/components/inputs";
import { PaperButton } from "@paper-ui/components/buttons";
import { PaperModal } from "@paper-ui/components/dialogs";
import { PaperCard } from "@paper-ui/core";
import { useSettingsStore } from "../stores/useSettingsStore";
import { useLogStore } from "../stores/useLogStore";
import { navItems } from "../lib/nav";
import { api, type ModelsList } from "../lib/api";
import { KNOWN_PLUGINS } from "../plugins/registry";
import { usePluginStore } from "../plugins/usePluginStore";
import { SidebarItem } from "@paper-ui/components/navigation";
import { Divider } from "@paper-ui/components/utility";
import { PluginRow } from "@paper-ui/components/rows";
import { useTheme } from "next-themes";
import { useAppearanceStore } from "../stores/useAppearanceStore";

function toOptions(models: string[], current: string): SelectOption[] {
  const list = models.includes(current) ? models : [current, ...models];
  return list.filter(Boolean).map((m) => ({ value: m, label: m }));
}

function Row({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-[#e8e3d8] py-4 last:border-0">
      <div className="min-w-0">
        <div className="font-architect text-[14px] text-ink">{title}</div>
        {desc && <div className="font-kalam text-[12px] text-ink-muted/75">{desc}</div>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

const TABS = [
  { key: "profile", icon: User, label: "Profile" },
  { key: "appearance", icon: Paintbrush, label: "Appearance" },
  { key: "models", icon: Cpu, label: "Models" },
  { key: "retrieval", icon: Filter, label: "Retrieval" },
  { key: "shortcuts", icon: Keyboard, label: "Shortcuts" },
  { key: "guidance", icon: LifeBuoy, label: "Help & Guidance" },
  { key: "plugins", icon: Puzzle, label: "Plugins" },
  { key: "logs", icon: Terminal, label: "Logs" },
  { key: "data", icon: Database, label: "Data" },
] as const;

export function SettingsPage() {
  const s = useSettingsStore();
  const { theme, setTheme } = useTheme();
  const appearance = useAppearanceStore();
  const logs = useLogStore((state) => state.logs);
  const clearLogs = useLogStore((state) => state.clearLogs);
  const navigate = useNavigate();
  const pluginEnabled = usePluginStore((st) => st.enabled);
  const togglePlugin = usePluginStore((st) => st.toggle);
  const toursEnabled = useGuidanceStore((g) => g.prefs.toursEnabled);
  const tipsEnabled = useGuidanceStore((g) => g.prefs.tipsEnabled);
  const setGuidancePref = useGuidanceStore((g) => g.setPref);
  const resetGuidance = useGuidanceStore((g) => g.resetAll);
  const [activeTab, setActiveTab] = useState("models");
  const [models, setModels] = useState<ModelsList>({
    fastModels: [],
    reasoningModels: [],
    embeddingModels: [],
    visionModels: [],
  });

  const [nukeModalOpen, setNukeModalOpen] = useState(false);
  const [nukeStep, setNukeStep] = useState<1 | 2>(1);
  const [isNuking, setIsNuking] = useState(false);

  const [backingUp, setBackingUp] = useState(false);
  const [backups, setBackups] = useState<Array<{ path: string; stamp: string; size_mb: number }>>([]);
  const [backupMsg, setBackupMsg] = useState("");

  const handleBackup = async () => {
    setBackingUp(true);
    setBackupMsg("");
    try {
      const res = await api.createBackup();
      setBackupMsg(`Backup created: ${res.backup.stamp} (${res.backup.size_mb} MB)`);
      setBackups(await api.listBackups());
    } catch (e: any) {
      setBackupMsg(`Backup failed: ${e.message}`);
    }
    setBackingUp(false);
  };

  useEffect(() => {
    api.listBackups().then(setBackups).catch(() => {});
  }, []);

  const handleNuke = async () => {
    setIsNuking(true);
    try {
      await fetch("/api/settings/nuke", { 
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: "DELETE_ALL_DATA" })
      });
    } catch (e) {
      console.error(e);
    }
    resetGuidance();
    localStorage.clear();
    sessionStorage.clear();
    try {
      const dbs = await window.indexedDB.databases();
      for (const db of dbs) {
        if (db.name) window.indexedDB.deleteDatabase(db.name);
      }
    } catch (e) {
      console.error(e);
    }
    window.location.href = "/onboarding";
  };

  useEffect(() => {
    s.hydrate();
    api
      .listModels()
      .then(setModels)
      .catch(() => { });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Page className="max-w-5xl">
      <PaperCard className="w-full" shadow="md">
        <div className="flex flex-col md:flex-row">
        {/* Vertical tab sidebar */}
        <div className="w-full md:w-64 shrink-0 p-4" style={{ background: "rgba(0,0,0,0.02)" }}>
          <div className="flex flex-col h-auto w-full gap-1.5">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <SidebarItem
                  key={tab.key}
                  icon={tab.icon}
                  label={tab.label}
                  active={isActive}
                  onClick={() => setActiveTab(tab.key)}
                />
              );
            })}
          </div>
        </div>

        <Divider orientation="vertical" className="hidden md:block" />
        <Divider orientation="horizontal" className="block md:hidden" />

        {/* Tab content */}
        <div className="flex-1 w-full min-w-0 p-6 md:p-8 space-y-8">
          {activeTab === "appearance" && (
            <div>
              <Row title="Theme" desc="Application color theme">
                <PaperSelect
                  value={theme || "system"}
                  onChange={(v) => setTheme(v)}
                  options={[
                    { value: "light", label: "Light" },
                    { value: "dark", label: "Dark" },
                    { value: "system", label: "System" },
                  ]}
                  className="w-56"
                />
              </Row>
              <Row title="Font Size" desc={`Base font size: ${appearance.fontSize}px`}>
                <PaperSlider
                  className="w-56"
                  value={appearance.fontSize}
                  onChange={(v) => appearance.set("fontSize", v)}
                  min={12}
                  max={24}
                  step={1}
                />
              </Row>
              <Row title="Reading Font" desc="Font used for documents and long text">
                <PaperSelect
                  value={appearance.readingFont}
                  onChange={(v: any) => appearance.set("readingFont", v)}
                  options={[
                    { value: "sans", label: "Sans Serif" },
                    { value: "serif", label: "Serif" },
                    { value: "mono", label: "Monospace" },
                    { value: "book", label: "Book (IBM Plex Serif)" },
                  ]}
                  className="w-56"
                />
              </Row>
              <Row title="High Contrast" desc="Increase border visibility and text contrast">
                <PaperSwitch
                  checked={appearance.highContrast}
                  onChange={(v) => appearance.set("highContrast", v)}
                />
              </Row>
              <Row title="Reduce Animations" desc="Disable UI transitions and animations">
                <PaperSwitch
                  checked={appearance.reduceAnimations}
                  onChange={(v) => appearance.set("reduceAnimations", v)}
                />
              </Row>
              <Row title="Reduce Transparency" desc="Disable blurs and translucent backgrounds">
                <PaperSwitch
                  checked={appearance.reduceTransparency}
                  onChange={(v) => appearance.set("reduceTransparency", v)}
                />
              </Row>
              <Row title="Custom Accent Color" desc="Hex color code (e.g. #4f4d7a)">
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    value={appearance.accentColor} 
                    onChange={(e) => appearance.set("accentColor", e.target.value)} 
                    className="h-8 w-8 cursor-pointer rounded border border-border bg-transparent p-0"
                  />
                  <PaperInput
                    className="w-44"
                    value={appearance.accentColor}
                    onChange={(e) => appearance.set("accentColor", e.target.value)}
                  />
                </div>
              </Row>
            </div>
          )}

          {activeTab === "models" && (
            <div>
              <Row
                title="AI Mode"
                desc={
                  s.ragMode === "strict"
                    ? "Strict RAG — only answers from ingested documents"
                    : "AI Fallback — LLM fills gaps when documents lack context"
                }
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck
                    className={`size-5 ${s.ragMode === "strict" ? "text-amber-500" : "text-muted-foreground"}`}
                  />
                  <span
                    className={`text-sm font-medium ${s.ragMode === "strict" ? "text-amber-600" : "text-muted-foreground"}`}
                  >
                    {s.ragMode === "strict" ? "Strict RAG" : "AI Fallback"}
                  </span>
                  <PaperSwitch
                    checked={s.ragMode === "strict"}
                    onChange={(v) =>
                      s.set("ragMode", v ? "strict" : "fallback")
                    }
                  />
                </div>
              </Row>
              <Row
                title="General Purpose Fast Model"
                desc="Optimized for speed and quick summaries"
              >
                <PaperSelect
                  value={s.fastModel}
                  onChange={(v) => s.set("fastModel", v)}
                  options={toOptions(models.fastModels, s.fastModel)}
                  className="w-56"
                />
              </Row>
              <Row
                title="Deep Reasoning Model"
                desc="Optimized for complex synthesis and large tasks"
              >
                <PaperSelect
                  value={s.reasoningModel}
                  onChange={(v) => s.set("reasoningModel", v)}
                  options={toOptions(models.reasoningModels, s.reasoningModel)}
                  className="w-56"
                />
              </Row>
              <Row
                title="Temperature"
                desc={`Creativity of responses · ${s.temperature.toFixed(2)}`}
              >
                <PaperSlider
                  className="w-56"
                  value={s.temperature}
                  onChange={(v) => s.set("temperature", v)}
                  min={0}
                  max={1}
                  step={0.05}
                />
              </Row>
              <Row title="Stream responses" desc="Render tokens as they generate">
                <PaperSwitch
                  checked={s.streaming}
                  onChange={(v) => s.set("streaming", v)}
                />
              </Row>
              <Row title="Prompt Enhancer" desc="Automatically refine and improve your prompts">
                <PaperSwitch
                  checked={s.usePromptEnhancer}
                  onChange={(v) => s.set("usePromptEnhancer", v)}
                />
              </Row>
            </div>
          )}

          {activeTab === "models" && (
            <>
              <div>
                <h3 className="pt-4 font-architect text-[13px] text-ink-muted">
                  Embedding &amp; Vision
                </h3>
                <Row
                  title="Embedding model"
                  desc="Used to vectorize your documents"
                >
                  <PaperSelect
                    value={s.embeddingModel}
                    onChange={(v) => s.set("embeddingModel", v)}
                    options={toOptions(models.embeddingModels, s.embeddingModel)}
                    className="w-56"
                  />
                </Row>
                <Row
                  title="Vision / OCR model"
                  desc="Describes images & diagrams and recovers low-confidence OCR"
                >
                  <PaperSelect
                    value={s.visionModel}
                    onChange={(v) => s.set("visionModel", v)}
                    options={toOptions(models.visionModels, s.visionModel)}
                    className="w-56"
                  />
                </Row>
                <Row title="Vector store" desc="Local LanceDB storage">
                  <span className="rounded-md px-3 py-1.5 font-mono text-xs text-ink-muted" style={{ background: "rgba(0,0,0,0.04)" }}>
                    lancedb
                  </span>
                </Row>
                <Row title="Chunk size" desc="Tokens per indexed chunk">
                  <span className="rounded-md px-3 py-1.5 font-mono text-xs text-ink-muted" style={{ background: "rgba(0,0,0,0.04)" }}>
                    800
                  </span>
                </Row>
              </div>
              <div>
                <h3 className="pt-4 font-architect text-[13px] text-ink-muted">
                  Ingestion
                </h3>
                <Row
                  title="Concurrent workers"
                  desc={`Files ingested in parallel · ${s.maxConcurrent}`}
                >
                  <div className="flex flex-col items-end gap-1.5">
                    <PaperSlider
                      className="w-56"
                      value={s.maxConcurrent}
                      onChange={(v) => s.set("maxConcurrent", v)}
                      min={1}
                      max={8}
                      step={1}
                    />
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`rounded px-1.5 py-0.5 font-medium ${
                        s.maxConcurrent <= 2
                          ? "bg-success-soft text-success"
                          : s.maxConcurrent <= 4
                            ? "bg-warning-soft text-warning"
                            : s.maxConcurrent <= 6
                              ? "bg-amber-500/10 text-amber-600"
                              : "bg-danger-soft text-danger"
                      }`}>
                        {s.maxConcurrent <= 2
                          ? "Light"
                          : s.maxConcurrent <= 4
                            ? "Moderate"
                            : s.maxConcurrent <= 6
                              ? "Heavy"
                              : "Very Heavy"}
                      </span>
                      <span className="text-muted-foreground">
                        {s.maxConcurrent <= 2
                          ? "Minimal CPU/RAM impact"
                          : s.maxConcurrent <= 4
                            ? "Balanced for most systems"
                            : s.maxConcurrent <= 6
                              ? "Uses significant resources"
                              : "May slow other tasks"}
                      </span>
                    </div>
                  </div>
                </Row>
              </div>
            </>
          )}

          {activeTab === "retrieval" && (
            <div>
              <Row
                title="Top-K results"
                desc={`Documents retrieved per query · ${s.topK}`}
              >
                <PaperSlider
                  className="w-56"
                  value={s.topK}
                  onChange={(v) => s.set("topK", v)}
                  min={1}
                  max={10}
                  step={1}
                />
              </Row>
              <Row
                title="Similarity threshold"
                desc={`Minimum cosine similarity · ${s.similarityThreshold.toFixed(2)}`}
              >
                <PaperSlider
                  className="w-56"
                  value={s.similarityThreshold}
                  onChange={(v) => s.set("similarityThreshold", v)}
                  min={0.5}
                  max={0.95}
                  step={0.01}
                />
              </Row>
              <Row
                title="Strict RAG Mode"
                desc={
                  s.ragMode === "strict"
                    ? "Only answers from ingested documents — no AI knowledge"
                    : "AI fills gaps when documents lack context"
                }
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck
                    className={`size-4 ${s.ragMode === "strict" ? "text-amber-500" : "text-muted-foreground"}`}
                  />
                  <PaperSwitch
                    checked={s.ragMode === "strict"}
                    onChange={(v) =>
                      s.set("ragMode", v ? "strict" : "fallback")
                    }
                  />
                </div>
              </Row>
              <Row
                title="Inline citations"
                desc="Show [n] markers within answers"
              >
                <PaperSwitch
                  checked={s.citationsInline}
                  onChange={(v) => s.set("citationsInline", v)}
                />
              </Row>
            </div>
          )}

          {activeTab === "shortcuts" && (
            <div>
              <Row title="Command menu" desc="Open the global search palette">
                <kbd className="inline-flex h-6 min-w-[24px] items-center justify-center rounded px-1.5 font-architect text-[11px] text-ink-muted/60" style={{ border: "1px solid rgba(0,0,0,0.12)", background: "rgba(0,0,0,0.035)" }}>
                  ⌘ K
                </kbd>
              </Row>
              {navItems.map((n) => (
                <Row key={n.to} title={n.label} desc={`Jump to ${n.label}`}>
                  <kbd className="inline-flex h-6 min-w-[24px] items-center justify-center rounded px-1.5 font-architect text-[11px] text-ink-muted/60" style={{ border: "1px solid rgba(0,0,0,0.12)", background: "rgba(0,0,0,0.035)" }}>
                    {n.shortcut}
                  </kbd>
                </Row>
              ))}
            </div>
          )}

          {activeTab === "guidance" && (
            <div>
              <Row
                title="Interactive tours"
                desc="Show a guided walkthrough the first time you visit a page"
              >
                <PaperSwitch
                  checked={toursEnabled}
                  onChange={(v) => setGuidancePref("toursEnabled", v)}
                />
              </Row>
              <Row
                title="Contextual tips"
                desc="Show small, dismissible tips during normal use"
              >
                <PaperSwitch
                  checked={tipsEnabled}
                  onChange={(v) => setGuidancePref("tipsEnabled", v)}
                />
              </Row>
              <Row
                title="Reset all walkthroughs"
                desc="Clear seen tours and dismissed tips so guidance appears again"
              >
                <PaperButton className="gap-2" onClick={resetGuidance}>
                  <RotateCcw className="size-4" /> Reset
                </PaperButton>
              </Row>
              <Row
                title="Replay onboarding"
                desc="Go through the initial setup walkthrough again"
              >
                <PaperButton
                  className="gap-2"
                  onClick={() => navigate("/onboarding")}
                >
                  <Compass className="size-4" /> Replay
                </PaperButton>
              </Row>
              <Row
                title="Open the Guide"
                desc="Read the full ScholarAI documentation"
              >
                <PaperButton
                  className="gap-2"
                  onClick={() => navigate("/guide")}
                >
                  <BookOpen className="size-4" /> Open Guide
                </PaperButton>
              </Row>
            </div>
          )}

          {activeTab === "profile" && (
            <div>
              <Row title="Name" desc="What should we call you?">
                <PaperInput
                  className="w-56"
                  value={s.name || ""}
                  onChange={(e) => s.set("name", e.target.value)}
                  placeholder="e.g. Student"
                />
              </Row>
              <Row title="Industry" desc="Your professional industry">
                <PaperInput
                  className="w-56"
                  value={s.industry}
                  onChange={(e) => s.set("industry", e.target.value)}
                  placeholder="e.g. Technology"
                />
              </Row>
              <Row title="Role" desc="Your primary role or title">
                <PaperInput
                  className="w-56"
                  value={s.role}
                  onChange={(e) => s.set("role", e.target.value)}
                  placeholder="e.g. Software Engineer"
                />
              </Row>
              <Row title="Goals" desc="Your learning or professional goals">
                <PaperInput
                  className="w-56"
                  value={s.goals}
                  onChange={(e) => s.set("goals", e.target.value)}
                  placeholder="e.g. Learn AI"
                />
              </Row>
              <Row title="Interests" desc="Topics you are interested in">
                <PaperInput
                  className="w-56"
                  value={s.interests}
                  onChange={(e) => s.set("interests", e.target.value)}
                  placeholder="e.g. Machine Learning"
                />
              </Row>
              <Row title="Learning Preferences" desc="How you prefer to learn">
                <PaperInput
                  className="w-56"
                  value={s.learningPreferences}
                  onChange={(e) => s.set("learningPreferences", e.target.value)}
                  placeholder="e.g. Visual, Hands-on"
                />
              </Row>
            </div>
          )}

          {activeTab === "plugins" && (
            <div>
              {KNOWN_PLUGINS.length === 0 ? (
                <div className="py-10 text-center font-kalam text-sm text-ink-muted/75">
                  No plugins available.
                </div>
              ) : (
                KNOWN_PLUGINS.map((plugin, i) => {
                  const enabled = pluginEnabled[plugin.id] ?? false;
                  return (
                    <React.Fragment key={plugin.id}>
                      <PluginRow
                        icon={<plugin.icon className="size-5" />}
                        title={plugin.name}
                        description={plugin.description}
                        meta={
                          <>
                            {plugin.builtIn && (
                              <span className="rounded bg-violet/10 px-1.5 py-0.5 text-[10px] font-medium text-violet mr-2">
                                Built-in
                              </span>
                            )}
                            <span className="text-[10px] text-muted-foreground font-mono">
                              v{plugin.version}
                            </span>
                          </>
                        }
                        control={
                          <PaperSwitch
                            checked={enabled}
                            onChange={() => togglePlugin(plugin.id)}
                          />
                        }
                        expanded={
                          plugin.settingsTab && enabled ? (
                            <div>
                              <div className="mb-3 flex items-center gap-2 font-architect text-[10px] font-semibold uppercase tracking-widest text-ink-muted/60">
                                <plugin.settingsTab.icon className="size-3.5" />
                                {plugin.settingsTab.label}
                              </div>
                              {plugin.settingsTab.content}
                            </div>
                          ) : undefined
                        }
                      />
                      {i < KNOWN_PLUGINS.length - 1 && <Divider variant="dashed" />}
                    </React.Fragment>
                  );
                })
              )}
            </div>
          )}

          {activeTab === "logs" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-architect text-[14px] text-ink">System Logs</h3>
                <PaperButton size="sm" onClick={() => clearLogs()}>
                  Clear Logs
                </PaperButton>
              </div>
              <div className="space-y-3">
                {logs.length === 0 ? (
                  <div className="font-kalam text-sm text-ink-muted/75">No high-importance logs found.</div>
                ) : (
                  logs.map((log) => (
                    <div key={log.id} className="rounded-lg border border-border bg-muted/50 p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${log.level === 'critical' ? 'bg-danger text-danger-foreground' : 'bg-amber-500/20 text-amber-500'}`}>
                          {log.level.toUpperCase()}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm font-medium">{log.message}</div>
                      {log.details && (
                        <pre className="mt-2 text-xs text-muted-foreground bg-background p-2 rounded overflow-x-auto whitespace-pre-wrap font-mono">
                          {log.details}
                        </pre>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "data" && (
            <>
              <div>
                <Row
                  title="Backup LanceDB"
                  desc="Save a snapshot of the vector database. Nightly backups run automatically; last 3 are kept."
                >
                  <PaperButton
                    className="gap-2"
                    onClick={handleBackup}
                    disabled={backingUp}
                  >
                    <Save className="size-4" />
                    {backingUp ? "Backing up..." : "Backup Now"}
                  </PaperButton>
                </Row>
                {backupMsg && (
                  <div className="pb-4 font-kalam text-xs text-ink-muted/75">{backupMsg}</div>
                )}
                {backups.length > 0 && (
                  <div className="pb-4 space-y-1">
                    <div className="font-architect text-xs text-ink-muted">Recent backups</div>
                    {backups.map((b) => (
                      <div key={b.stamp} className="font-kalam text-xs text-ink-muted/75 flex justify-between">
                        <span>{b.stamp}</span>
                        <span>{b.size_mb} MB</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <Row
                  title="Danger Zone"
                  desc="Permanently delete all workspaces, documents, local cache, and settings."
                >
                  <PaperButton
                    className="gap-2"
                    onClick={() => {
                      setNukeStep(1);
                      setNukeModalOpen(true);
                    }}
                  >
                    <Trash2 className="size-4" />
                    Nuke Data
                  </PaperButton>
                </Row>
              </div>
            </>
          )}
        </div>
        </div>
      </PaperCard>

      <PaperModal
        open={nukeModalOpen}
        onClose={() => !isNuking && setNukeModalOpen(false)}
        title="Are you absolutely sure?"
        footer={
          <>
            <PaperButton onClick={() => setNukeModalOpen(false)} disabled={isNuking}>
              Cancel
            </PaperButton>
            {nukeStep === 1 ? (
              <PaperButton tone="dark" onClick={() => setNukeStep(2)}>
                Yes, delete everything
              </PaperButton>
            ) : (
              <PaperButton tone="dark" onClick={handleNuke} disabled={isNuking}>
                {isNuking ? "Nuking..." : "Confirm Nuke"}
              </PaperButton>
            )}
          </>
        }
        width={520}
      >
        <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-danger-soft text-danger">
          <TriangleAlert className="size-5" />
        </div>
        <p className="font-kalam text-[14px] text-ink mt-2">This action cannot be undone. This will permanently delete:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 font-kalam text-[13px] text-ink-muted/80">
          <li>All your imported documents and notes</li>
          <li>The local vector database</li>
          <li>Your browser cache and IndexedDB</li>
          <li>All application settings</li>
        </ul>
      </PaperModal>
    </Page>
  );
}
