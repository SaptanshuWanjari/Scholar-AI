import { Cpu, Boxes, Filter, Palette, Keyboard } from "lucide-react";
import { Page } from "../components/Page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Label } from "../components/ui/label";
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
import { cn } from "../components/ui/utils";

function Row({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
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

  return (
    <Page className="max-w-4xl">
      <Tabs defaultValue="models">
        <TabsList className="mb-6 bg-card">
          <TabsTrigger value="models" className="gap-1.5"><Cpu className="size-4" /> Models</TabsTrigger>
          <TabsTrigger value="embeddings" className="gap-1.5"><Boxes className="size-4" /> Embeddings</TabsTrigger>
          <TabsTrigger value="retrieval" className="gap-1.5"><Filter className="size-4" /> Retrieval</TabsTrigger>
          <TabsTrigger value="appearance" className="gap-1.5"><Palette className="size-4" /> Appearance</TabsTrigger>
          <TabsTrigger value="shortcuts" className="gap-1.5"><Keyboard className="size-4" /> Shortcuts</TabsTrigger>
        </TabsList>

        <TabsContent value="models">
          <div className="rounded-2xl border border-border bg-card px-5">
            <Row title="General Purpose Fast Model" desc="Optimized for speed and quick summaries">
              <Select value={s.fastModel} onValueChange={(v) => s.set("fastModel", v)}>
                <SelectTrigger className="w-56 bg-input-background"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="llama3.1:8b">Llama 3.1 8B</SelectItem>
                  <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                  <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                  <SelectItem value="mistral:7b">Mistral 7B</SelectItem>
                </SelectContent>
              </Select>
            </Row>
            <Row title="Deep Reasoning Model" desc="Optimized for complex synthesis and large tasks">
              <Select value={s.reasoningModel} onValueChange={(v) => s.set("reasoningModel", v)}>
                <SelectTrigger className="w-56 bg-input-background"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="llama3.1:70b">Llama 3.1 70B</SelectItem>
                  <SelectItem value="o1-preview">OpenAI o1-preview</SelectItem>
                  <SelectItem value="claude-3-5-sonnet">Claude 3.5 Sonnet</SelectItem>
                  <SelectItem value="qwen2.5:72b">Qwen 2.5 72B</SelectItem>
                </SelectContent>
              </Select>
            </Row>
            <Row title="Temperature" desc={`Creativity of responses · ${s.temperature.toFixed(2)}`}>
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
              <Switch checked={s.streaming} onCheckedChange={(v) => s.set("streaming", v)} />
            </Row>
          </div>
        </TabsContent>

        <TabsContent value="embeddings">
          <div className="rounded-2xl border border-border bg-card px-5">
            <Row title="Embedding model" desc="Used to vectorize your documents">
              <Select value={s.embeddingModel} onValueChange={(v) => s.set("embeddingModel", v)}>
                <SelectTrigger className="w-56 bg-input-background"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="nomic-embed-text">nomic-embed-text</SelectItem>
                  <SelectItem value="mxbai-embed-large">mxbai-embed-large</SelectItem>
                  <SelectItem value="all-minilm">all-MiniLM-L6-v2</SelectItem>
                </SelectContent>
              </Select>
            </Row>
            <Row title="Vector store" desc="Qdrant collection">
              <span className="rounded-md bg-muted px-3 py-1.5 font-mono text-xs text-muted-foreground">scholarai_docs</span>
            </Row>
            <Row title="Chunk size" desc="Tokens per indexed chunk">
              <span className="rounded-md bg-muted px-3 py-1.5 font-mono text-xs text-muted-foreground">512</span>
            </Row>
          </div>
        </TabsContent>

        <TabsContent value="retrieval">
          <div className="rounded-2xl border border-border bg-card px-5">
            <Row title="Top-K results" desc={`Documents retrieved per query · ${s.topK}`}>
              <Slider className="w-56" value={[s.topK]} onValueChange={(v) => s.set("topK", v[0])} min={1} max={10} step={1} />
            </Row>
            <Row title="Similarity threshold" desc={`Minimum cosine similarity · ${s.similarityThreshold.toFixed(2)}`}>
              <Slider
                className="w-56"
                value={[s.similarityThreshold]}
                onValueChange={(v) => s.set("similarityThreshold", v[0])}
                min={0.5}
                max={0.95}
                step={0.01}
              />
            </Row>
            <Row title="Inline citations" desc="Show [n] markers within answers">
              <Switch checked={s.citationsInline} onCheckedChange={(v) => s.set("citationsInline", v)} />
            </Row>
          </div>
        </TabsContent>

        <TabsContent value="appearance">
          <div className="rounded-2xl border border-border bg-card px-5">
            <Row title="Accent color" desc="Primary highlight across the app">
              <div className="flex gap-2">
                {([
                  { id: "violet", color: "#8b5cf6" },
                  { id: "cyan", color: "#06b6d4" },
                  { id: "green", color: "#22c55e" },
                ] as const).map((a) => (
                  <button
                    key={a.id}
                    onClick={() => s.set("accent", a.id)}
                    className={cn(
                      "size-7 rounded-full ring-offset-2 ring-offset-card transition-all",
                      s.accent === a.id && "ring-2 ring-foreground",
                    )}
                    style={{ backgroundColor: a.color }}
                  />
                ))}
              </div>
            </Row>
            <Row title="Density" desc="Spacing of lists and tables">
              <Select value={s.density} onValueChange={(v) => s.set("density", v as "comfortable" | "compact")}>
                <SelectTrigger className="w-44 bg-input-background"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="comfortable">Comfortable</SelectItem>
                  <SelectItem value="compact">Compact</SelectItem>
                </SelectContent>
              </Select>
            </Row>
            <Row title="Theme" desc="ScholarAI is optimized for dark mode">
              <span className="rounded-md bg-muted px-3 py-1.5 text-xs text-muted-foreground">Dark</span>
            </Row>
          </div>
        </TabsContent>

        <TabsContent value="shortcuts">
          <div className="rounded-2xl border border-border bg-card px-5">
            <Row title="Command menu" desc="Open the global search palette">
              <kbd className="rounded border border-border bg-muted px-2 py-1 font-mono text-xs">⌘ K</kbd>
            </Row>
            {navItems.map((n) => (
              <Row key={n.to} title={n.label} desc={`Jump to ${n.label}`}>
                <kbd className="rounded border border-border bg-muted px-2 py-1 font-mono text-xs">{n.shortcut}</kbd>
              </Row>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Page>
  );
}
