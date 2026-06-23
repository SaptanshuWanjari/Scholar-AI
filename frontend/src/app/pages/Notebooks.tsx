import { useRef, useState } from "react";
import {
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Plus,
  Search,
  Hash,
  FolderClosed,
  Clock,
  Sparkles,
  FileText,
  ScrollText,
  Wand2,
  Layers,
  ListChecks,
  Workflow,
  Quote,
  Gauge,
  GripVertical,
  Lightbulb,
  Info,
  TriangleAlert,
  Check,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../components/ui/dropdown-menu";
import { cn } from "../components/ui/utils";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { MarkdownRenderer } from "../components/MarkdownRenderer";
import { DiagramViewer } from "../components/DiagramViewer";
import { SelectionToolbar } from "../components/SelectionToolbar";
import {
  notebooks,
  collections,
  tags,
  recentNotes,
  activeNotebookPage,
  inspector,
  type NotebookBlock,
} from "../lib/notebook-data";

const calloutMeta = {
  note: { icon: Info, cls: "border-border bg-muted/50 text-foreground", iconCls: "text-muted-foreground" },
  insight: { icon: Lightbulb, cls: "border-violet/30 bg-violet-soft text-foreground", iconCls: "text-violet" },
  warning: { icon: TriangleAlert, cls: "border-warning/30 bg-warning-soft text-foreground", iconCls: "text-warning" },
};

export function Notebooks() {
  const [activeId, setActiveId] = useState("nb1");
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [blocks, setBlocks] = useState<NotebookBlock[]>(activeNotebookPage.blocks);
  const contentRef = useRef<HTMLDivElement>(null);

  const actions = [
    { label: "Explain", icon: Wand2, onSelect: () => toast.success("Generating explanation…") },
    { label: "Summarize", icon: ScrollText, onSelect: () => toast.success("Summarizing selection…") },
    { label: "Flashcards", icon: Layers, onSelect: () => toast.success("Creating flashcards…") },
    { label: "Quiz", icon: ListChecks, onSelect: () => toast.success("Generating quiz…") },
    { label: "Diagram", icon: Workflow, onSelect: () => toast.success("Generating diagram…") },
    { label: "Cite", icon: Quote, onSelect: () => toast.success("Citation saved") },
  ];

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left — Notebooks */}
      <aside className={cn(
        "hidden shrink-0 flex-col overflow-y-auto border-r border-border bg-card/40 transition-all duration-300 lg:flex",
        leftCollapsed ? "w-0 border-r-0" : "w-[280px]"
      )}>
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Notebooks</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="size-7" onClick={() => setLeftCollapsed(true)}>
              <PanelLeftClose className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" className="size-7" onClick={() => toast.success("New notebook")}>
              <Plus className="size-4" />
            </Button>
          </div>
        </div>
        <div className="border-b border-border p-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search notes…" className="h-8 bg-input-background pl-8 text-xs" />
          </div>
        </div>

        <div className="space-y-1 p-2">
          {notebooks.map((n) => (
            <button
              key={n.id}
              onClick={() => setActiveId(n.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors",
                activeId === n.id ? "bg-accent" : "hover:bg-accent/50",
              )}
            >
              <div className="flex h-6 w-6 items-center justify-center rounded bg-background/50">
                <n.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{n.name}</div>
                <div className="text-[11px] text-muted-foreground">
                  {n.notes} notes · {n.lastEdited}
                </div>
              </div>
              <span className="size-1.5 rounded-full" style={{ backgroundColor: n.color }} />
            </button>
          ))}
        </div>

        <Section label="Collections" icon={FolderClosed}>
          {collections.map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-md px-2.5 py-1.5 text-sm text-foreground/80 hover:bg-accent/50">
              <span className="truncate">{c.name}</span>
              <span className="text-xs text-muted-foreground">{c.count}</span>
            </div>
          ))}
        </Section>

        <Section label="Tags" icon={Hash}>
          <div className="flex flex-wrap gap-1.5 px-2">
            {tags.map((t) => (
              <span key={t} className="rounded-full border border-border bg-card px-2 py-0.5 text-[11px] text-muted-foreground">
                #{t}
              </span>
            ))}
          </div>
        </Section>

        <Section label="Recent" icon={Clock}>
          {recentNotes.map((r) => (
            <div key={r.id} className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-foreground/80 hover:bg-accent/50">
              <FileText className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="truncate">{r.title}</span>
            </div>
          ))}
        </Section>
      </aside>

      {/* Center — Content */}
      <main className="relative min-w-0 flex-1 overflow-y-auto">
        <SelectionToolbar containerRef={contentRef} actions={actions} />
        
        {/* Sidebar Toggles */}
        <div className="pointer-events-none absolute left-0 top-4 z-10 flex w-full justify-between px-4">
          <div className="pointer-events-auto">
            {leftCollapsed && (
              <Button 
                variant="outline" 
                size="icon" 
                className="size-8 rounded-full bg-card/80 backdrop-blur shadow-sm"
                onClick={() => setLeftCollapsed(false)}
              >
                <PanelLeftOpen className="size-4" />
              </Button>
            )}
          </div>
          <div className="pointer-events-auto">
            {rightCollapsed && (
              <Button 
                variant="outline" 
                size="icon" 
                className="size-8 rounded-full bg-card/80 backdrop-blur shadow-sm"
                onClick={() => setRightCollapsed(false)}
              >
                <PanelRightOpen className="size-4" />
              </Button>
            )}
          </div>
        </div>

        <div ref={contentRef} className="mx-auto max-w-[900px] px-10 py-12">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {notebooks.find((n) => n.id === activeNotebookPage.notebookId)?.name} · {activeNotebookPage.updated}
          </div>
          <h1 className="mt-3 text-[2.75rem] leading-[1.1]">{activeNotebookPage.title}</h1>
          <p className="mt-3 font-reading text-lg italic text-muted-foreground">
            {activeNotebookPage.subtitle}
          </p>

          <div className="mt-8 space-y-5">
            {blocks.map((block, i) => (
              <BlockView key={i} block={block} />
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add("border-violet", "bg-violet-soft/50", "text-violet");
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove("border-violet", "bg-violet-soft/50", "text-violet");
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove("border-violet", "bg-violet-soft/50", "text-violet");
                    try {
                      const data = e.dataTransfer.getData("application/json");
                      if (data) {
                        setBlocks([...blocks, JSON.parse(data)]);
                        return;
                      }
                    } catch (err) {}
                    
                    setBlocks([...blocks, {
                      type: "ai-answer",
                      question: "Dropped AI Concept",
                      answer: "This block was generated via drag-and-drop. In a full implementation, you would drag a real AI response here.",
                      confidence: 0.95,
                      sources: 2
                    }]);
                  }}
                  className="group flex w-full items-center gap-2 rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-violet/50 hover:text-violet"
                >
                  <Plus className="size-4" /> Add block — or drag in an AI answer, diagram or deck
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[300px]">
                <DropdownMenuItem onClick={() => setBlocks([...blocks, { type: "text", text: "New text block. Edit me!" }])}>
                  <FileText className="mr-2 size-4 text-muted-foreground" /> Text
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setBlocks([...blocks, { type: "heading", level: 2, text: "New Heading" }])}>
                  <Hash className="mr-2 size-4 text-muted-foreground" /> Heading
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setBlocks([...blocks, { type: "callout", tone: "note", text: "New note callout." }])}>
                  <Info className="mr-2 size-4 text-muted-foreground" /> Callout
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setBlocks([...blocks, { type: "code", lang: "python", code: "print('Hello world')" }])}>
                  <Workflow className="mr-2 size-4 text-muted-foreground" /> Code
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </main>

      {/* Right — Inspector */}
      <aside className={cn(
        "hidden shrink-0 flex-col overflow-y-auto border-l border-border bg-card/40 transition-all duration-300 xl:flex",
        rightCollapsed ? "w-0 border-l-0" : "w-[300px]"
      )}>
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <Button variant="ghost" size="icon" className="size-7" onClick={() => setRightCollapsed(true)}>
            <PanelRightClose className="size-4" />
          </Button>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Inspector</span>
          <div className="size-7" /> {/* spacer */}
        </div>
        <div className="space-y-5 p-4">
          <InspectorBlock title="Notebook Details">
            <MetaRow k="Notebook" v={inspector.details.notebook} />
            <MetaRow k="Type" v={inspector.details.type} />
            <MetaRow k="Created" v={inspector.details.created} />
          </InspectorBlock>

          <div className="grid grid-cols-2 gap-2">
            <Stat label="Words" value={inspector.wordCount} />
            <Stat label="Reading" value={inspector.readingTime} />
          </div>

          <InspectorBlock title="Linked Sources">
            {inspector.linkedSources.map((s) => (
              <div key={s} className="flex items-start gap-2 py-1 text-sm text-foreground/80">
                <FileText className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                <span className="leading-snug">{s}</span>
              </div>
            ))}
          </InspectorBlock>

          <InspectorBlock title="Generated Assets">
            <div className="grid grid-cols-2 gap-2">
              {inspector.generatedAssets.map((a) => (
                <div key={a.label} className="rounded-lg border border-border bg-card px-3 py-2">
                  <div className="font-display text-xl leading-none">{a.count}</div>
                  <div className="mt-1 text-[11px] text-muted-foreground">{a.label}</div>
                </div>
              ))}
            </div>
          </InspectorBlock>

          <InspectorBlock title="Related Topics">
            <div className="flex flex-wrap gap-1.5">
              {inspector.relatedTopics.map((t) => (
                <span key={t} className="rounded-full border border-border bg-card px-2 py-0.5 text-[11px] text-foreground/70">
                  {t}
                </span>
              ))}
            </div>
          </InspectorBlock>

          <InspectorBlock title="Revision Status">
            <Badge variant="outline" className="gap-1.5 border-warning/40 bg-warning-soft text-warning">
              <Gauge className="size-3" /> {inspector.revisionStatus}
            </Badge>
          </InspectorBlock>
        </div>
      </aside>
    </div>
  );
}

function BlockView({ block }: { block: NotebookBlock }) {
  return (
    <div className="group/block relative -mx-3 rounded-lg px-3 py-1 transition-colors hover:bg-accent/20">
      <span className="absolute -left-3 top-2.5 cursor-grab opacity-0 transition-opacity group-hover/block:opacity-100">
        <GripVertical className="size-4 text-muted-foreground" />
      </span>
      <BlockInner block={block} />
    </div>
  );
}

function BlockInner({ block }: { block: NotebookBlock }) {
  switch (block.type) {
    case "heading":
      return block.level === 1 ? (
        <h1 className="mt-4 text-3xl">{block.text}</h1>
      ) : (
        <h2 className="mt-4">{block.text}</h2>
      );
    case "text":
      return <MarkdownRenderer content={block.text} />;
    case "callout": {
      const m = calloutMeta[block.tone];
      return (
        <div className={cn("flex gap-3 rounded-xl border p-4", m.cls)}>
          <m.icon className={cn("mt-0.5 size-5 shrink-0", m.iconCls)} />
          <div className="font-reading leading-relaxed">{block.text}</div>
        </div>
      );
    }
    case "code":
      return (
        <pre className="overflow-x-auto rounded-lg border border-border bg-secondary p-4">
          <code className="font-mono text-[13px] leading-relaxed text-foreground/90">{block.code}</code>
        </pre>
      );
    case "table":
      return (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-muted/60">
              <tr>
                {block.headers.map((h) => (
                  <th key={h} className="border-b border-border px-4 py-2.5 text-left font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className="border-b border-border/60 px-4 py-2.5 text-foreground/80">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "ai-answer":
      return (
        <div className="overflow-hidden rounded-xl border border-violet/25 bg-violet-soft/40">
          <div className="flex items-center justify-between border-b border-violet/15 px-4 py-2.5">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet">
              <Sparkles className="size-3.5" /> Saved AI Answer
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Gauge className="size-3" /> {(block.confidence * 100).toFixed(0)}% · {block.sources} sources
            </span>
          </div>
          <div className="px-4 pb-3 pt-3">
            <div className="mb-2 font-reading text-base font-medium italic text-foreground">{block.question}</div>
            <MarkdownRenderer content={block.answer} />
          </div>
        </div>
      );
    case "mermaid":
      return (
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Workflow className="size-3.5" /> Diagram
          </div>
          <DiagramViewer code={block.code} />
        </div>
      );
    case "flashdeck":
      return (
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-medium">
              <Layers className="size-4 text-violet" /> {block.name}
            </span>
            <Badge variant="outline" className="text-xs text-muted-foreground">{block.count} cards</Badge>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {block.cards.map((c, i) => (
              <div key={i} className="rounded-lg border border-border bg-background/50 p-3">
                <div className="font-reading text-sm leading-snug">{c.front}</div>
                <div className="mt-2 border-t border-border pt-2 text-xs text-muted-foreground">{c.back}</div>
              </div>
            ))}
          </div>
        </div>
      );
    case "quiz-results": {
      const pct = Math.round((block.score / block.total) * 100);
      return (
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
          <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-xl bg-success-soft text-success">
            <span className="font-display text-xl leading-none">{pct}%</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ListChecks className="size-4 text-success" /> {block.title}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Scored {block.score} of {block.total} · embedded quiz result
            </div>
          </div>
          <Check className="size-5 text-success" />
        </div>
      );
    }
    default:
      return null;
  }
}

function Section({ label, icon: Icon, children }: { label: string; icon: typeof Hash; children: React.ReactNode }) {
  return (
    <div className="border-t border-border px-2 py-3">
      <div className="flex items-center gap-1.5 px-2.5 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="size-3" /> {label}
      </div>
      {children}
    </div>
  );
}

function InspectorBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
      {children}
    </div>
  );
}

function MetaRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between py-0.5 text-sm">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2.5">
      <div className="font-display text-2xl leading-none">{value}</div>
      <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
