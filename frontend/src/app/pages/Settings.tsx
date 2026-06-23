import { useEffect, useState } from "react";
import { Cpu, Boxes, Filter, Keyboard } from "lucide-react";
import { Page } from "../components/Page";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Slider } from "../components/ui/slider";
import { Switch } from "../components/ui/switch";
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
  });

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
        </TabsList>

        <TabsContent value="models">
          <div className="rounded-2xl border border-border bg-card px-5">
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
      </Tabs>
    </Page>
  );
}
