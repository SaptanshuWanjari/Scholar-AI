import { useEffect, useState } from "react";
import { BookMarked, Check, Plus, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { api } from "../lib/api";
import type { PromptItem } from "../lib/types";
import { toast } from "sonner";
import { cn } from "../components/ui/utils";

const STYLE_BADGE: Record<string, string> = {
  Concise: "bg-cyan-soft text-cyan",
  Comprehensive: "bg-violet-soft text-violet",
  Socratic: "bg-warning-soft text-warning",
  "": "bg-muted text-muted-foreground",
};

export function PromptLibrary() {
  const [categories, setCategories] = useState<{ key: string; label: string; description: string }[]>([]);
  const [prompts, setPrompts] = useState<PromptItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [selected, setSelected] = useState<PromptItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", style: "", body: "" });

  useEffect(() => {
    api.listPromptCategories().then((cs) => {
      setCategories(cs);
      if (cs.length) setActiveCategory(cs[0].key);
    });
  }, []);

  useEffect(() => {
    if (!activeCategory) return;
    api.listPrompts(activeCategory).then((ps) => {
      setPrompts(ps);
      setSelected(ps.find((p) => p.active) ?? ps[0] ?? null);
    });
  }, [activeCategory]);

  async function activate(p: PromptItem) {
    await api.activatePrompt(p.id);
    setPrompts((prev) => prev.map((x) => ({ ...x, active: x.id === p.id })));
    setSelected({ ...p, active: true });
    toast.success(`"${p.name}" activated`);
  }

  async function remove(p: PromptItem) {
    await api.deletePrompt(p.id);
    const next = prompts.filter((x) => x.id !== p.id);
    setPrompts(next);
    if (selected?.id === p.id) setSelected(next[0] ?? null);
    toast.success("Prompt deleted");
  }

  async function save() {
    if (!form.name.trim() || !form.body.trim()) return;
    const created = await api.createPrompt({ category: activeCategory, ...form });
    setPrompts((prev) => [...prev, created]);
    setSelected(created);
    setCreating(false);
    setForm({ name: "", style: "", body: "" });
    toast.success("Prompt created");
  }

  const visible = prompts.filter((p) => p.category === activeCategory);
  const cat = categories.find((c) => c.key === activeCategory);

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── Left: category tabs + prompt list ───────────────────────── */}
      <div className="flex w-64 shrink-0 flex-col border-r border-border bg-sidebar">
        <div className="border-b border-border px-4 py-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <BookMarked className="size-4 text-violet" />
            Prompt Library
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">Customise AI generation</p>
        </div>

        {/* category list */}
        <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setActiveCategory(c.key)}
              className={cn(
                "w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
                activeCategory === c.key
                  ? "bg-sidebar-accent text-foreground font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
              )}
            >
              {c.label}
            </button>
          ))}
        </nav>
      </div>

      {/* ── Middle: prompt list ──────────────────────────────────────── */}
      <div className="flex w-72 shrink-0 flex-col border-r border-border bg-card/50">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-sm font-medium text-foreground">{cat?.label}</span>
          <button
            onClick={() => { setCreating(true); setSelected(null); }}
            className="flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="size-3" /> New
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
          {visible.map((p) => (
            <motion.button
              key={p.id}
              layout
              onClick={() => { setSelected(p); setCreating(false); }}
              className={cn(
                "group w-full rounded-lg px-3 py-2.5 text-left transition-colors",
                selected?.id === p.id
                  ? "bg-sidebar-accent"
                  : "hover:bg-sidebar-accent/50"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 truncate text-sm font-medium text-foreground">
                    {p.active && <Check className="size-3 shrink-0 text-success" />}
                    <span className="truncate">{p.name}</span>
                  </div>
                  {p.style && (
                    <span className={cn("mt-0.5 inline-block rounded px-1.5 py-0.5 text-[10px] font-medium", STYLE_BADGE[p.style] ?? STYLE_BADGE[""])}>
                      {p.style}
                    </span>
                  )}
                </div>
                {!p.built_in && selected?.id === p.id && (
                  <button
                    onClick={(e) => { e.stopPropagation(); remove(p); }}
                    className="shrink-0 rounded p-0.5 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Right: editor / viewer ───────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          {creating ? (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex h-full flex-col p-6 gap-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-foreground">New Prompt — {cat?.label}</h2>
                <button onClick={() => setCreating(false)} className="rounded p-1 hover:bg-muted">
                  <X className="size-4 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="My custom prompt"
                    className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Style tag (optional)</label>
                  <input
                    value={form.style}
                    onChange={(e) => setForm((f) => ({ ...f, style: e.target.value }))}
                    placeholder="e.g. Concise"
                    className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">System prompt</label>
                  <textarea
                    value={form.body}
                    onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                    rows={14}
                    placeholder="You are a..."
                    className="mt-1 w-full resize-none rounded-md border border-border bg-input px-3 py-2 font-mono text-sm leading-relaxed outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={save}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Save
                </button>
                <button
                  onClick={() => setCreating(false)}
                  className="rounded-md border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          ) : selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex h-full flex-col p-6 gap-4 overflow-hidden"
            >
              <div className="flex items-start justify-between gap-4 shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold text-foreground">{selected.name}</h2>
                    {selected.style && (
                      <span className={cn("rounded px-2 py-0.5 text-[11px] font-medium", STYLE_BADGE[selected.style] ?? STYLE_BADGE[""])}>
                        {selected.style}
                      </span>
                    )}
                    {selected.built_in && (
                      <span className="rounded bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">Built-in</span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{cat?.description}</p>
                </div>
                {!selected.active && (
                  <button
                    onClick={() => activate(selected)}
                    className="shrink-0 flex items-center gap-1.5 rounded-md bg-violet px-3 py-1.5 text-xs font-medium text-white hover:bg-violet/90"
                  >
                    <Check className="size-3" /> Activate
                  </button>
                )}
                {selected.active && (
                  <span className="flex items-center gap-1.5 rounded-md bg-success-soft px-3 py-1.5 text-xs font-medium text-success">
                    <Check className="size-3" /> Active
                  </span>
                )}
              </div>

              <pre className="flex-1 overflow-y-auto rounded-lg border border-border bg-muted/40 p-4 font-mono text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                {selected.body}
              </pre>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              className="flex flex-1 items-center justify-center text-muted-foreground text-sm"
            >
              Select a prompt to preview
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
