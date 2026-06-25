import { useEffect, useState } from "react";
import { Cpu, Boxes, Filter, Keyboard, User, ShieldCheck, Database, TriangleAlert, Trash2 } from "lucide-react";
import { Page } from "../components/Page";
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
import { navItems } from "../lib/nav";
import { api, type ModelsList } from "../lib/api";

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
    window.location.reload();
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
          <TabsTrigger value="embeddings" className="gap-1.5">
            <Boxes className="size-4" /> Embeddings
          </TabsTrigger>
          <TabsTrigger value="retrieval" className="gap-1.5">
            <Filter className="size-4" /> Retrieval
          </TabsTrigger>
          <TabsTrigger value="shortcuts" className="gap-1.5">
            <Keyboard className="size-4" /> Shortcuts
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
          </div>
        </TabsContent>

        <TabsContent value="embeddings">
          <div className="rounded-2xl border border-border bg-card px-5">
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
