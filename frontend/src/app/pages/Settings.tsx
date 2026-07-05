import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Cpu, Filter, Keyboard, User, ShieldCheck, Database, TriangleAlert, Trash2, LifeBuoy, RotateCcw, BookOpen, Compass, Puzzle, Terminal, Paintbrush, Save, Cloud, Route, Sliders, BarChart2 } from "lucide-react";
import { CLOUD_PROVIDERS_ENABLED } from "../lib/featureFlags";
import { ModelProvidersTab } from "./settings/ModelProvidersTab";
import { ModelRoutingTab } from "./settings/ModelRoutingTab";
import { ModelDefaultsTab } from "./settings/ModelDefaultsTab";
import { ModelUsageTab } from "./settings/ModelUsageTab";
import { Page } from "../components/Page";
import { useGuidanceStore } from "../guidance/useGuidanceStore";
import { PaperSelect } from "@paper-ui/components/inputs";
import type { SelectOption } from "@paper-ui/components/inputs";
import { PaperSwitch } from "@paper-ui/components/inputs";
import { PaperSlider } from "@paper-ui/components/inputs";
import { PaperInput } from "@paper-ui/components/inputs";
import { PaperButton, ChipButton } from "@paper-ui/components/buttons";
import { PaperModal } from "@paper-ui/components/dialogs";
import { PaperCard } from "@paper-ui/core";
import { useSettingsStore } from "../stores/useSettingsStore";
import { navItems } from "../lib/nav";
import { api, type ModelsList } from "../lib/api";
import { KNOWN_PLUGINS } from "../plugins/registry";
import { usePluginStore } from "../plugins/usePluginStore";
import { SidebarItem } from "@paper-ui/components/navigation";
import { Divider } from "@paper-ui/components/utility";
import { PluginRow } from "@paper-ui/components/rows";
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
        <div className="font-architect text-[17px] text-ink">{title}</div>
        {desc && <div className="font-kalam text-[14px] text-ink-muted/75">{desc}</div>}
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
  { key: "data", icon: Database, label: "Data" },
] as const;

export function SettingsPage() {
  const s = useSettingsStore();
  const appearance = useAppearanceStore();
  const navigate = useNavigate();
  const { install, uninstall, enable, disable, isInstalled, isEnabled, getInstallState, restartRequired, dismissRestart } = usePluginStore();
  const toursEnabled = useGuidanceStore((g) => g.prefs.toursEnabled);
  const tipsEnabled = useGuidanceStore((g) => g.prefs.tipsEnabled);
  const setGuidancePref = useGuidanceStore((g) => g.setPref);
  const resetGuidance = useGuidanceStore((g) => g.resetAll);
  const [activeTab, setActiveTab] = useState("models");
  const [modelsSubTab, setModelsSubTab] = useState<"providers" | "routing" | "defaults" | "usage">("providers");
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
            </div>
          )}

          {activeTab === "models" && CLOUD_PROVIDERS_ENABLED && isEnabled("cloud-model-providers") && (
            <div className="border-b border-[#e8e3d8] mb-2">
              <div className="flex flex-wrap gap-1 p-2">
                {([
                  { key: "providers", label: "Providers", icon: Cloud },
                  { key: "routing",   label: "Routing",   icon: Route },
                  { key: "defaults",  label: "Defaults",  icon: Sliders },
                  { key: "usage",     label: "Usage",     icon: BarChart2 },
                ] as const).map((sub) => (
                  <ChipButton
                    key={sub.key}
                    selected={modelsSubTab === sub.key}
                    onClick={() => setModelsSubTab(sub.key)}
                    className="flex items-center gap-1.5 text-sm"
                  >
                    <sub.icon size={14} />
                    {sub.label}
                  </ChipButton>
                ))}
              </div>
            </div>
          )}

          {activeTab === "models" && CLOUD_PROVIDERS_ENABLED && isEnabled("cloud-model-providers") && modelsSubTab === "providers" && (
            <ModelProvidersTab />
          )}
          {activeTab === "models" && CLOUD_PROVIDERS_ENABLED && isEnabled("cloud-model-providers") && modelsSubTab === "routing" && (
            <ModelRoutingTab />
          )}
          {activeTab === "models" && CLOUD_PROVIDERS_ENABLED && isEnabled("cloud-model-providers") && modelsSubTab === "usage" && (
            <ModelUsageTab />
          )}

          {activeTab === "models" && (!CLOUD_PROVIDERS_ENABLED || !isEnabled("cloud-model-providers") || modelsSubTab === "defaults") && (
            <div className=''>
              {CLOUD_PROVIDERS_ENABLED && isEnabled("cloud-model-providers") && <ModelDefaultsTab />}
              <Row
                title="AI Mode"
                desc={
                  s.ragMode === "strict"
                    ? "Strict RAG — only answers from ingested documents"
                    : "AI Fallback — LLM fills gaps when documents lack context"
                }
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-medium font-architect ${s.ragMode === "strict" ? "text-amber-600" : "text-muted-foreground"}`}
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
              <Row title="Prompt Enhancer"  desc="Automatically refine and improve your prompts">
                <PaperSwitch
                  checked={s.usePromptEnhancer}
                  onChange={(v) => s.set("usePromptEnhancer", v)}
                />
              </Row>
            </div>
          )}

          {activeTab === "models" && (!isEnabled("cloud-model-providers") || modelsSubTab === "defaults") && (
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
              {restartRequired && (
                <div className="mb-4 flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm dark:border-amber-800 dark:bg-amber-950">
                  <span className="font-kalam text-amber-800 dark:text-amber-200">
                    Plugin changes applied. Refresh the page to activate.
                  </span>
                  <button
                    onClick={dismissRestart}
                    className="ml-4 shrink-0 font-kalam text-xs text-amber-600 underline dark:text-amber-400"
                  >
                    Dismiss
                  </button>
                </div>
              )}
              {KNOWN_PLUGINS.length === 0 ? (
                <div className="py-10 text-center font-kalam text-sm text-ink-muted/75">
                  No plugins available.
                </div>
              ) : (
                KNOWN_PLUGINS.map((plugin, i) => {
                  const installed = isInstalled(plugin.id);
                  const enabled = isEnabled(plugin.id);
                  const state = getInstallState(plugin.id);
                  const busy = state === "installing" || state === "uninstalling";

                  return (
                    <React.Fragment key={plugin.id}>
                      <PluginRow
                        icon={<plugin.icon className="size-5" />}
                        title={plugin.name}
                        description={plugin.description}
                        meta={
                          <span className="font-mono text-[10px] text-muted-foreground">
                            v{plugin.version}
                          </span>
                        }
                        installAction={
                          busy ? (
                            <span className="font-kalam text-xs text-ink-muted">
                              {state === "installing" ? "Installing…" : "Uninstalling…"}
                            </span>
                          ) : installed ? (
                            <button
                              onClick={() => uninstall(plugin.id)}
                              className="font-kalam text-xs text-red-500 underline hover:text-red-600"
                            >
                              Uninstall
                            </button>
                          ) : (
                            <button
                              onClick={() => install(plugin.id)}
                              className="rounded bg-violet/10 px-2 py-1 font-kalam text-xs font-medium text-violet hover:bg-violet/20"
                            >
                              Install
                            </button>
                          )
                        }
                        control={
                          <PaperSwitch
                            checked={enabled}
                            onChange={() => (enabled ? disable(plugin.id) : enable(plugin.id))}
                            disabled={!installed || busy}
                          />
                        }
                        expanded={
                          plugin.settingsTab && installed && enabled ? (
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
        <ul className="list-disc list-inside mt-2 space-y-1 font-kalam text-[17px] tracking-wide text-ink-muted/80">
          <li>All your imported documents and notes</li>
          <li>The local vector database</li>
          <li>Your browser cache and IndexedDB</li>
          <li>All application settings</li>
        </ul>
      </PaperModal>
    </Page>
  );
}
