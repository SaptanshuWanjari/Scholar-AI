import { useState, useRef, useEffect } from "react";
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
import { cn } from "@/paper-ui/utils";
import { PaperInput } from "@/paper-ui/components/inputs";
import { IconButton } from "@/paper-ui/components/buttons";
import {
  Sidebar as PaperSidebar,
  SidebarGroup,
  SidebarHeader,
  SidebarDivider,
} from "@/paper-ui/components/navigation";
import type { NotebookMeta, Collection } from "../../lib/api";
import { iconFor } from "./utils";

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
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        e.stopPropagation();
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
    };
    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () =>
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, []);

  const filteredList = list.filter((n) =>
    (n.name || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (collapsed) {
    return (
      <aside className="hidden shrink-0 w-0 border-r-0 overflow-hidden transition-all duration-300 lg:flex" />
    );
  }

  return (
    <PaperSidebar className="hidden w-[280px] lg:flex">
      <div className="flex items-center justify-between border-b border-ink-muted/15 px-5 py-4">
        <SidebarHeader title="Notes" />

        <div className="flex items-center gap-1">
          <IconButton label="Collapse sidebar" onClick={onToggleCollapse}>
            <PanelLeftClose className="size-4" />
          </IconButton>

          <IconButton label="Create notebook" onClick={onCreateNotebook}>
            <Plus className="size-4" />
          </IconButton>
        </div>
      </div>

      <div className="px-3 py-2 border-b border-ink-muted/10">
        <PaperInput
          ref={searchInputRef}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search notes…"
          icon={<Search className="size-3.5" />}
          wrapperClassName="[&_input]:h-8 [&_input]:text-xs [&_input]:font-architect"
        />
      </div>

      <div className="px-2 py-1">
        {loadingList ? (
          <div className="flex items-center gap-2 px-2.5 py-3 font-architect text-xs text-ink-muted">
            <Loader2 className="size-3.5 animate-spin" /> Loading notebooks…
          </div>
        ) : list.length === 0 ? (
          <button
            onClick={onCreateNotebook}
            className="flex w-full items-center gap-2 rounded-md border border-dashed border-ink-muted/30 px-2.5 py-3 text-left font-architect text-xs text-ink-muted hover:border-violet/50 hover:text-violet"
          >
            <Plus className="size-3.5" /> Create your first notebook
          </button>
        ) : filteredList.length === 0 ? (
          <div className="flex items-center gap-2 px-2.5 py-3 font-architect text-xs text-ink-muted">
            No notebooks match your search.
          </div>
        ) : (
          filteredList.map((n) => {
            const Icon = iconFor(n.id);
            if (renamingId === n.id) {
              return (
                <div
                  key={n.id}
                  className="flex items-center gap-1.5 px-1.5 py-1"
                >
                  <PaperInput
                    autoFocus
                    value={renameValue}
                    onChange={(e) => onRenameValueChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") onSaveRename(n.id);
                      if (e.key === "Escape") onCancelRename();
                    }}
                    wrapperClassName="[&_input]:h-7 [&_input]:text-sm [&_input]:font-architect flex-1"
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
                    className="flex size-7 shrink-0 items-center justify-center rounded-md text-ink-muted hover:bg-accent"
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
                  "group flex w-full items-center gap-3 rounded-md px-2.5 py-2 transition-colors",
                  activeId === n.id
                    ? "bg-black/[0.035]"
                    : "hover:bg-black/[0.02]",
                )}
              >
                <button
                  onClick={() => onSelectNotebook(n.id)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-ink/5">
                    <Icon className="h-4 w-4 text-ink-muted" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-architect text-[15px] text-ink">
                      {n.name}
                    </div>
                    <div className="font-kalam text-[11px] text-ink-muted">
                      {n.notes} notes · {n.lastEdited}
                    </div>
                  </div>
                </button>
                <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => onStartRename(n.id, n.name)}
                    className="flex size-7 items-center justify-center rounded-md text-ink-muted hover:bg-ink/5 hover:text-ink"
                    aria-label="Rename notebook"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteNotebook(n.id)}
                    className="flex size-7 items-center justify-center rounded-md text-ink-muted hover:bg-red-50 hover:text-brick"
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

      <SidebarDivider />

      <SidebarGroup label="Collections">
        {collections.length === 0 ? (
          <div className="px-4 py-1.5 font-kalam text-xs text-ink-muted">
            No collections
          </div>
        ) : (
          collections.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between px-4 py-1.5 font-architect text-[15px] text-ink/80 hover:bg-black/[0.025]"
            >
              <span className="truncate">{c.name}</span>
              <span className="font-kalam text-xs text-ink-muted">
                {c.count}
              </span>
            </div>
          ))
        )}
      </SidebarGroup>

      <SidebarDivider />

      <SidebarGroup label="Tags">
        {tags.length === 0 ? (
          <div className="px-4 py-1.5 font-kalam text-xs text-ink-muted">
            No tags
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5 px-3">
            {tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-ink-muted/20 bg-ink/3 px-2 py-0.5 font-architect text-[11px] text-ink-muted"
              >
                #{t}
              </span>
            ))}
          </div>
        )}
      </SidebarGroup>

      <SidebarDivider />

      <SidebarGroup label="Recent">
        {recentNotes.length === 0 ? (
          <div className="px-4 py-1.5 font-kalam text-xs text-ink-muted">
            No recent notes
          </div>
        ) : (
          recentNotes.map((r) => (
            <div
              key={r.id}
              className="flex items-center gap-2 px-4 py-1.5 font-architect text-[15px] text-ink/80 hover:bg-black/[0.025]"
            >
              <FileText className="size-3.5 shrink-0 text-ink-muted" />
              <span className="truncate">{r.title}</span>
            </div>
          ))
        )}
      </SidebarGroup>
    </PaperSidebar>
  );
}
