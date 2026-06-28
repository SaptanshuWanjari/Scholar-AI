import {
  PanelLeftClose,
  Plus,
  Search,
  Hash,
  FolderClosed,
  Clock,
  FileText,
  Check,
  X,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import { cn } from "../ui/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import type { NotebookMeta, Collection } from "../../lib/api";
import { iconFor } from "./utils";

function Section({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: typeof Hash;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-border px-2 py-3">
      <div className="flex items-center gap-1.5 px-2.5 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="size-3" /> {label}
      </div>
      {children}
    </div>
  );
}

export function Sidebar({
  list,
  loadingList,
  activeId,
  collapsed,
  renamingId,
  renameValue,
  collections,
  tags,
  recentNotes,
  onSelectNotebook,
  onStartRename,
  onRenameValueChange,
  onSaveRename,
  onCancelRename,
  onDeleteNotebook,
  onCreateNotebook,
  onToggleCollapse,
}: {
  list: NotebookMeta[];
  loadingList: boolean;
  activeId: string | null;
  collapsed: boolean;
  renamingId: string | null;
  renameValue: string;
  collections: Collection[];
  tags: string[];
  recentNotes: { id: string; title: string; notebook: string }[];
  onSelectNotebook: (id: string) => void;
  onStartRename: (id: string, name: string) => void;
  onRenameValueChange: (value: string) => void;
  onSaveRename: (id: string) => void;
  onCancelRename: () => void;
  onDeleteNotebook: (id: string) => void;
  onCreateNotebook: () => void;
  onToggleCollapse: () => void;
}) {
  return (
    <aside
      className={cn(
        "hidden shrink-0 flex-col overflow-y-auto border-r border-border bg-card/40 transition-all duration-300 lg:flex",
        collapsed ? "w-0 border-r-0" : "w-[280px]",
      )}
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Notebooks
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={onToggleCollapse}
          >
            <PanelLeftClose className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={onCreateNotebook}
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </div>
      <div className="border-b border-border p-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search notes…"
            className="h-8 bg-input-background pl-8 text-xs"
          />
        </div>
      </div>

      <div className="space-y-1 p-2">
        {loadingList ? (
          <div className="flex items-center gap-2 px-2.5 py-3 text-xs text-muted-foreground">
            <Loader2 className="size-3.5 animate-spin" /> Loading notebooks…
          </div>
        ) : list.length === 0 ? (
          <button
            onClick={onCreateNotebook}
            className="flex w-full items-center gap-2 rounded-lg border border-dashed border-border px-2.5 py-3 text-left text-xs text-muted-foreground hover:border-violet/50 hover:text-violet"
          >
            <Plus className="size-3.5" /> Create your first notebook
          </button>
        ) : (
          list.map((n) => {
            const Icon = iconFor(n.id);
            if (renamingId === n.id) {
              return (
                <div
                  key={n.id}
                  className="flex items-center gap-1.5 px-1.5 py-1"
                >
                  <Input
                    autoFocus
                    value={renameValue}
                    onChange={(e) => onRenameValueChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") onSaveRename(n.id);
                      if (e.key === "Escape") onCancelRename();
                    }}
                    className="h-7 text-sm"
                  />
                  <button
                    onClick={() => onSaveRename(n.id)}
                    className="flex size-7 shrink-0 items-center justify-center rounded-md text-success hover:bg-accent"
                    aria-label="Save name"
                  >
                    <Check className="size-3.5" />
                  </button>
                  <button
                    onClick={onCancelRename}
                    className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-accent"
                    aria-label="Cancel rename"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              );
            }
            return (
              <div
                key={n.id}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-lg px-2.5 py-2 transition-colors",
                  activeId === n.id ? "bg-accent" : "hover:bg-accent/50",
                )}
              >
                <button
                  onClick={() => onSelectNotebook(n.id)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-background/50">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">
                      {n.name}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {n.notes} notes · {n.lastEdited}
                    </div>
                  </div>
                </button>
                <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => onStartRename(n.id, n.name)}
                    className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-background/60 hover:text-foreground"
                    aria-label="Rename notebook"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteNotebook(n.id)}
                    className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-danger-soft hover:text-danger"
                    aria-label="Delete notebook"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
                <span
                  className="size-1.5 shrink-0 rounded-full group-hover:hidden"
                  style={{ backgroundColor: n.color }}
                />
              </div>
            );
          })
        )}
      </div>

      <Section label="Collections" icon={FolderClosed}>
        {collections.length === 0 ? (
          <div className="px-2.5 py-1.5 text-xs text-muted-foreground">
            No collections
          </div>
        ) : (
          collections.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-md px-2.5 py-1.5 text-sm text-foreground/80 hover:bg-accent/50"
            >
              <span className="truncate">{c.name}</span>
              <span className="text-xs text-muted-foreground">{c.count}</span>
            </div>
          ))
        )}
      </Section>

      <Section label="Tags" icon={Hash}>
        {tags.length === 0 ? (
          <div className="px-2.5 py-1.5 text-xs text-muted-foreground">
            No tags
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5 px-2">
            {tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-border bg-card px-2 py-0.5 text-[11px] text-muted-foreground"
              >
                #{t}
              </span>
            ))}
          </div>
        )}
      </Section>

      <Section label="Recent" icon={Clock}>
        {recentNotes.length === 0 ? (
          <div className="px-2.5 py-1.5 text-xs text-muted-foreground">
            No recent notes
          </div>
        ) : (
          recentNotes.map((r) => (
            <div
              key={r.id}
              className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-foreground/80 hover:bg-accent/50"
            >
              <FileText className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="truncate">{r.title}</span>
            </div>
          ))
        )}
      </Section>
    </aside>
  );
}
