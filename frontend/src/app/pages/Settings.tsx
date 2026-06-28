import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Cpu, Filter, Keyboard, User, ShieldCheck, Database, TriangleAlert, Trash2, LifeBuoy, RotateCcw, BookOpen, Compass, Puzzle, Terminal } from "lucide-react";
import { Page } from "../components/Page";
import { useGuidanceStore } from "../guidance/useGuidanceStore";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Slider } from "../components/ui/slider";
import { Switch } from "../components/ui/switch";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useSettingsStore } from "../stores/useSettingsStore";
import { useLogStore } from "../stores/useLogStore";
import { navItems } from "../lib/nav";
import { api, type ModelsList } from "../lib/api";
import { KNOWN_PLUGINS } from "../plugins/registry";
import { usePluginStore } from "../plugins/usePluginStore";

function ModelOptions({
  models,
  current,
}: {
  models: string[];
  current: string;
}) {
  const list = models.includes(current) ? models : [current, ...models];
  return (
    <>
      {list.filter(Boolean).map((m) => (
        <SelectItem key={m} value={m}>
          {m}
        </SelectItem>
      ))}
    </>
  );
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
    <div className="flex items-center justify-between gap-6 border-b border-border py-4 last:border-0">
      <div className="min-w-0">
        <div className="text-sm font-medium">{title}</div>
        {desc && <div className="text-xs text-muted-foreground">{desc}</div>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export function SettingsPage() {
  const s = useSettingsStore();
  const logs = useLogStore((state) => state.logs);
  const clearLogs = useLogStore((state) => state.clearLogs);
  const navigate = useNavigate();
  const pluginEnabled = usePluginStore((st) => st.enabled);
  const togglePlugin = usePluginStore((st) => st.toggle);
  const toursEnabled = useGuidanceStore((g) => g.prefs.toursEnabled);
  const tipsEnabled = useGuidanceStore((g) => g.prefs.tipsEnabled);
  const setGuidancePref = useGuidanceStore((g) => g.setPref);
  const resetGuidance = useGuidanceStore((g) => g.resetAll);
  const [models, setModels] = useState<ModelsList>({
    fastModels: [],
    reasoningModels: [],
    embeddingModels: [],
    visionModels: [],
  });

  const [nukeModalOpen, setNukeModalOpen] = useState(false);
  const [nukeStep, setNukeStep] = useState<1 | 2>(1);
  const [isNuking, setIsNuking] = useState(false);

  const handleNuke = async () => {
    setIsNuking(true);
    try {
      await fetch("/api/settings/nuke", { method: "DELETE" });
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
    <Page className="max-w-4xl">
      <Tabs defaultValue="models">
        <TabsList className="mb-6 bg-card">
          <TabsTrigger value="profile" className="gap-1.5">
            <User className="size-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="models" className="gap-1.5">
            <Cpu className="size-4" /> Models
          </TabsTrigger>
          <TabsTrigger value="retrieval" className="gap-1.5">
            <Filter className="size-4" /> Retrieval
          </TabsTrigger>
          <TabsTrigger value="shortcuts" className="gap-1.5">
            <Keyboard className="size-4" /> Shortcuts
          </TabsTrigger>
          <TabsTrigger value="guidance" className="gap-1.5">
            <LifeBuoy className="size-4" /> Help &amp; Guidance
          </TabsTrigger>
          <TabsTrigger value="plugins" className="gap-1.5">
            <Puzzle className="size-4" /> Plugins
          </TabsTrigger>
          <TabsTrigger value="logs" className="gap-1.5">
            <Terminal className="size-4" /> Logs
          </TabsTrigger>
          <TabsTrigger value="data" className="gap-1.5">
            <Database className="size-4" /> Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="models">
          <div className="rounded-2xl border border-border bg-card px-5">
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
                <Switch
                  checked={s.ragMode === "strict"}
                  onCheckedChange={(v) =>
                    s.set("ragMode", v ? "strict" : "fallback")
                  }
                />
              </div>
            </Row>
            <Row
              title="General Purpose Fast Model"
              desc="Optimized for speed and quick summaries"
            >
              <Select
                value={s.fastModel}
                onValueChange={(v) => s.set("fastModel", v)}
              >
                <SelectTrigger className="w-56 bg-input-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <ModelOptions
                    models={models.fastModels}
                    current={s.fastModel}
                  />
                </SelectContent>
              </Select>
            </Row>
            <Row
              title="Deep Reasoning Model"
              desc="Optimized for complex synthesis and large tasks"
            >
              <Select
                value={s.reasoningModel}
                onValueChange={(v) => s.set("reasoningModel", v)}
              >
                <SelectTrigger className="w-56 bg-input-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <ModelOptions
                    models={models.reasoningModels}
                    current={s.reasoningModel}
                  />
                </SelectContent>
              </Select>
            </Row>
            <Row
              title="Temperature"
              desc={`Creativity of responses · ${s.temperature.toFixed(2)}`}
            >
              <Slider
                className="w-56"
                value={[s.temperature]}
                onValueChange={(v) => s.set("temperature", v[0])}
                min={0}
                max={1}
                step={0.05}
              />
            </Row>
            <Row title="Stream responses" desc="Render tokens as they generate">
              <Switch
                checked={s.streaming}
                onCheckedChange={(v) => s.set("streaming", v)}
              />
            </Row>
            <Row title="Prompt Enhancer" desc="Automatically refine and improve your prompts">
              <Switch
                checked={s.usePromptEnhancer}
                onCheckedChange={(v) => s.set("usePromptEnhancer", v)}
              />
            </Row>
          </div>
          <div className="mt-6 rounded-2xl border border-border bg-card px-5">
            <h3 className="pt-4 text-sm font-semibold text-muted-foreground">
              Embedding &amp; Vision
            </h3>
            <Row
              title="Embedding model"
              desc="Used to vectorize your documents"
            >
              <Select
                value={s.embeddingModel}
                onValueChange={(v) => s.set("embeddingModel", v)}
              >
                <SelectTrigger className="w-56 bg-input-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <ModelOptions
                    models={models.embeddingModels}
                    current={s.embeddingModel}
                  />
                </SelectContent>
              </Select>
            </Row>
            <Row
              title="Vision / OCR model"
              desc="Describes images & diagrams and recovers low-confidence OCR"
            >
              <Select
                value={s.visionModel}
                onValueChange={(v) => s.set("visionModel", v)}
              >
                <SelectTrigger className="w-56 bg-input-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <ModelOptions
                    models={models.visionModels}
                    current={s.visionModel}
                  />
                </SelectContent>
              </Select>
            </Row>
            <Row title="Vector store" desc="Local LanceDB storage">
              <span className="rounded-md bg-muted px-3 py-1.5 font-mono text-xs text-muted-foreground">
                lancedb
              </span>
            </Row>
            <Row title="Chunk size" desc="Tokens per indexed chunk">
              <span className="rounded-md bg-muted px-3 py-1.5 font-mono text-xs text-muted-foreground">
                800
              </span>
            </Row>
          </div>
        </TabsContent>

        <TabsContent value="retrieval">
          <div className="rounded-2xl border border-border bg-card px-5">
            <Row
              title="Top-K results"
              desc={`Documents retrieved per query · ${s.topK}`}
            >
              <Slider
                className="w-56"
                value={[s.topK]}
                onValueChange={(v) => s.set("topK", v[0])}
                min={1}
                max={10}
                step={1}
              />
            </Row>
            <Row
              title="Similarity threshold"
              desc={`Minimum cosine similarity · ${s.similarityThreshold.toFixed(2)}`}
            >
              <Slider
                className="w-56"
                value={[s.similarityThreshold]}
                onValueChange={(v) => s.set("similarityThreshold", v[0])}
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
                <Switch
                  checked={s.ragMode === "strict"}
                  onCheckedChange={(v) =>
                    s.set("ragMode", v ? "strict" : "fallback")
                  }
                />
              </div>
            </Row>
            <Row
              title="Inline citations"
              desc="Show [n] markers within answers"
            >
              <Switch
                checked={s.citationsInline}
                onCheckedChange={(v) => s.set("citationsInline", v)}
              />
            </Row>
          </div>
        </TabsContent>

        <TabsContent value="shortcuts">
          <div className="rounded-2xl border border-border bg-card px-5">
            <Row title="Command menu" desc="Open the global search palette">
              <kbd className="rounded border border-border bg-muted px-2 py-1 font-mono text-xs">
                ⌘ K
              </kbd>
            </Row>
            {navItems.map((n) => (
              <Row key={n.to} title={n.label} desc={`Jump to ${n.label}`}>
                <kbd className="rounded border border-border bg-muted px-2 py-1 font-mono text-xs">
                  {n.shortcut}
                </kbd>
              </Row>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="guidance">
          <div className="rounded-2xl border border-border bg-card px-5">
            <Row
              title="Interactive tours"
              desc="Show a guided walkthrough the first time you visit a page"
            >
              <Switch
                checked={toursEnabled}
                onCheckedChange={(v) => setGuidancePref("toursEnabled", v)}
              />
            </Row>
            <Row
              title="Contextual tips"
              desc="Show small, dismissible tips during normal use"
            >
              <Switch
                checked={tipsEnabled}
                onCheckedChange={(v) => setGuidancePref("tipsEnabled", v)}
              />
            </Row>
            <Row
              title="Reset all walkthroughs"
              desc="Clear seen tours and dismissed tips so guidance appears again"
            >
              <Button variant="outline" className="gap-2" onClick={resetGuidance}>
                <RotateCcw className="size-4" /> Reset
              </Button>
            </Row>
            <Row
              title="Replay onboarding"
              desc="Go through the initial setup walkthrough again"
            >
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => navigate("/onboarding")}
              >
                <Compass className="size-4" /> Replay
              </Button>
            </Row>
            <Row
              title="Open the Guide"
              desc="Read the full ScholarAI documentation"
            >
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => navigate("/guide")}
              >
                <BookOpen className="size-4" /> Open Guide
              </Button>
            </Row>
          </div>
        </TabsContent>

        <TabsContent value="profile">
          <div className="rounded-2xl border border-border bg-card px-5">
            <Row title="Industry" desc="Your professional industry">
              <Input
                className="w-56 bg-input-background"
                value={s.industry}
                onChange={(e) => s.set("industry", e.target.value)}
                placeholder="e.g. Technology"
              />
            </Row>
            <Row title="Role" desc="Your primary role or title">
              <Input
                className="w-56 bg-input-background"
                value={s.role}
                onChange={(e) => s.set("role", e.target.value)}
                placeholder="e.g. Software Engineer"
              />
            </Row>
            <Row title="Goals" desc="Your learning or professional goals">
              <Input
                className="w-56 bg-input-background"
                value={s.goals}
                onChange={(e) => s.set("goals", e.target.value)}
                placeholder="e.g. Learn AI"
              />
            </Row>
            <Row title="Interests" desc="Topics you are interested in">
              <Input
                className="w-56 bg-input-background"
                value={s.interests}
                onChange={(e) => s.set("interests", e.target.value)}
                placeholder="e.g. Machine Learning"
              />
            </Row>
            <Row title="Learning Preferences" desc="How you prefer to learn">
              <Input
                className="w-56 bg-input-background"
                value={s.learningPreferences}
                onChange={(e) => s.set("learningPreferences", e.target.value)}
                placeholder="e.g. Visual, Hands-on"
              />
            </Row>
          </div>
        </TabsContent>

        <TabsContent value="plugins">
          <div className="rounded-2xl border border-border bg-card px-5">
            {KNOWN_PLUGINS.length === 0 ? (
              <div className="py-10 text-center text-sm text-muted-foreground">
                No plugins available.
              </div>
            ) : (
              KNOWN_PLUGINS.map((plugin) => (
                <div
                  key={plugin.id}
                  className="flex items-center justify-between gap-6 border-b border-border py-4 last:border-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                      <plugin.icon className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        {plugin.name}
                        {plugin.builtIn && (
                          <span className="rounded bg-violet/10 px-1.5 py-0.5 text-[10px] font-medium text-violet">
                            Built-in
                          </span>
                        )}
                        <span className="text-[10px] text-muted-foreground font-mono">
                          v{plugin.version}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {plugin.description}
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={pluginEnabled[plugin.id] ?? false}
                    onCheckedChange={() => togglePlugin(plugin.id)}
                  />
                </div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="logs">
          <div className="rounded-2xl border border-border bg-card px-5 py-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium">System Logs</h3>
              <Button variant="outline" size="sm" onClick={() => clearLogs()}>
                Clear Logs
              </Button>
            </div>
            <div className="space-y-3">
              {logs.length === 0 ? (
                <div className="text-sm text-muted-foreground">No high-importance logs found.</div>
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
        </TabsContent>

        <TabsContent value="data">
          <div className="rounded-2xl border border-border bg-card px-5">
            <Row
              title="Danger Zone"
              desc="Permanently delete all workspaces, documents, local cache, and settings."
            >
              <Button
                variant="destructive"
                className="gap-2"
                onClick={() => {
                  setNukeStep(1);
                  setNukeModalOpen(true);
                }}
              >
                <Trash2 className="size-4" />
                Nuke Data
              </Button>
            </Row>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={nukeModalOpen} onOpenChange={setNukeModalOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-danger-soft text-danger">
              <TriangleAlert className="size-5" />
            </div>
            <DialogTitle className="text-xl text-danger">Are you absolutely sure?</DialogTitle>
            <DialogDescription className="text-foreground mt-2">
              This action cannot be undone. This will permanently delete:
              <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground text-sm">
                <li>All your imported documents and notes</li>
                <li>The local vector database</li>
                <li>Your browser cache and IndexedDB</li>
                <li>All application settings</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="mt-6 sm:justify-between">
            <Button variant="outline" onClick={() => setNukeModalOpen(false)} disabled={isNuking}>
              Cancel
            </Button>
            {nukeStep === 1 ? (
              <Button variant="destructive" onClick={() => setNukeStep(2)}>
                Yes, delete everything
              </Button>
            ) : (
              <Button variant="destructive" onClick={handleNuke} disabled={isNuking} className="gap-2">
                {isNuking ? "Nuking..." : "Confirm Nuke"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Page>
  );
}
