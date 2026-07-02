import { useEffect, useState } from "react";
import { BookMarked, Check, Plus, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { api } from "../lib/api";
import type { PromptItem } from "../lib/types";
import { toast } from "@/app/lib/toast";
import { cn } from "@/paper-ui/utils";
import { PaperInput, PaperTextarea } from "@/paper-ui/components/inputs";
import { PaperButton, GhostButton, IconButton } from "@/paper-ui/components/buttons";
import { PaperBadge } from "@/paper-ui/components/badges";
import { PaperPanel } from "@/paper-ui/core";
import { Divider } from "@/paper-ui/components/utility";
import { EmptyState } from "@/paper-ui/components/feedback";

const STYLE_TONE: Record<string, string> = {
  Concise: "sky",
  Comprehensive: "lavender",
  Socratic: "ochre",
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
    <div className="flex h-full overflow-hidden font-architect text-ink">
      {/* ── Left: category tabs + prompt list ───────────────────────── */}
      <div className="flex w-64 shrink-0 flex-col bg-[#fffdf9]/30">
        <div className="px-4 py-4">
          <div className="flex items-center gap-2 font-architect text-[16px] text-ink">
            <BookMarked className="size-4 text-ink-muted" />
            Prompt Library
          </div>
          <p className="mt-1 font-kalam text-xs text-ink-muted">Customise AI generation</p>
        </div>

        <Divider variant="straight" className="px-2" />

        {/* category list */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          {categories.map((c) => (
            <GhostButton
              key={c.key}
              size="sm"
              border={null}
              onClick={() => setActiveCategory(c.key)}
              className={cn(
                "w-full justify-start text-left",
                activeCategory === c.key
                  ? "bg-black/[0.06] text-ink font-semibold"
                  : "text-ink-muted hover:bg-black/[0.03] hover:text-ink"
              )}
            >
              {c.label}
            </GhostButton>
          ))}
        </nav>
      </div>

      <Divider orientation="vertical" />

      {/* ── Middle: prompt list ──────────────────────────────────────── */}
      <div className="flex w-72 shrink-0 flex-col bg-[#fffdf9]/45">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="font-architect text-[15px] text-ink">{cat?.label}</span>
          <PaperButton
            size="sm"
            onClick={() => { setCreating(true); setSelected(null); }}
          >
            <Plus className="size-3" /> New
          </PaperButton>
        </div>

        <Divider variant="straight" className="px-2" />

        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1 mt-1">
          {visible.map((p) => (
              <motion.button
                key={p.id}
                layout
                onClick={() => { setSelected(p); setCreating(false); }}
                className={cn(
                  "group w-full rounded-lg px-3 py-2.5 text-left transition-all duration-150 hover:-translate-y-0.5",
                  selected?.id === p.id
                    ? "bg-black/[0.06] font-semibold text-ink"
                    : "text-ink-muted hover:bg-black/[0.03] hover:text-ink"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 truncate font-architect text-[14px]">
                      {p.active && <Check className="size-3.5 shrink-0 text-[#4a7a5c]" />}
                      <span className="truncate">{p.name}</span>
                    </div>
                    {p.style && (
                      <PaperBadge tone={STYLE_TONE[p.style] as any ?? "ink"} className="mt-0.5 text-[10px]">
                        {p.style}
                      </PaperBadge>
                    )}
                  </div>
                  {!p.built_in && selected?.id === p.id && (
                    <IconButton
                      label="Delete prompt"
                      onClick={(e) => { e.stopPropagation(); remove(p); }}
                      className="h-auto w-auto rounded p-0.5 text-ink-muted opacity-0 transition-opacity hover:text-red-600 group-hover:opacity-100"
                    >
                      <Trash2 className="size-3.5" />
                    </IconButton>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

      <Divider orientation="vertical" />

      {/* ── Right: editor / viewer / experiments ────────────────────── */}
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
                <h2 className="font-architect text-[17px] text-ink">New Prompt — {cat?.label}</h2>
                <IconButton label="Close" onClick={() => setCreating(false)}>
                  <X className="size-4" />
                </IconButton>
              </div>

              <Divider variant="straight" />

              <div className="space-y-3">
                <PaperInput
                  label="Name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="My custom prompt"
                />
                <PaperInput
                  label="Style tag (optional)"
                  value={form.style}
                  onChange={(e) => setForm((f) => ({ ...f, style: e.target.value }))}
                  placeholder="e.g. Concise"
                />
                <PaperTextarea
                  label="System prompt"
                  value={form.body}
                  onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                  rows={14}
                  placeholder="You are a..."
                />
              </div>

              <div className="flex gap-2">
                <PaperButton onClick={save}>Save</PaperButton>
                <GhostButton onClick={() => setCreating(false)}>Cancel</GhostButton>
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
                    <h2 className="font-architect text-[17px] text-ink">{selected.name}</h2>
                    {selected.style && (
                      <PaperBadge tone={STYLE_TONE[selected.style] as any ?? "ink"}>
                        {selected.style}
                      </PaperBadge>
                    )}
                    {selected.built_in && (
                      <PaperBadge tone="ink">Built-in</PaperBadge>
                    )}
                  </div>
                  <p className="mt-1 font-kalam text-xs text-ink-muted">{cat?.description}</p>
                </div>
                {!selected.active && (
                  <PaperButton
                    size="sm"
                    onClick={() => activate(selected)}
                    className="shrink-0"
                  >
                    <Check className="size-3" /> Activate
                  </PaperButton>
                )}
                {selected.active && (
                  <PaperBadge tone="sage" className="flex items-center gap-1.5 py-1">
                    <Check className="size-3" /> Active
                  </PaperBadge>
                )}
              </div>

              <Divider variant="straight" />

              <PaperPanel className="flex-1 overflow-y-auto p-5" shadow="sm" texture>
                <pre className="font-architect text-[15px] leading-relaxed text-ink whitespace-pre-wrap">
                  {selected.body}
                </pre>
              </PaperPanel>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              className="flex flex-1 items-center justify-center p-6"
            >
              <EmptyState title="Select a prompt to preview" icon={<BookMarked className="size-6 text-ink-muted" />} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
