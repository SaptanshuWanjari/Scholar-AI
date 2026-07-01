import React, { useState, useEffect, useRef, useMemo } from "react";
import { Search } from "lucide-react";
import { cn } from "@/paper-ui/utils";
import { SketchBorder } from "@/paper-ui/core";

export interface CommandEntry {
  key: string;
  label: string;
  description?: string;
  /** Keyboard shortcut labels, e.g. ["⌘", "K"]. */
  shortcut?: string[];
  icon?: React.ReactNode;
  action: () => void;
}

export interface CommandBarProps {
  open: boolean;
  onClose: () => void;
  commands: CommandEntry[];
  placeholder?: string;
  className?: string;
}

/**
 * Full-screen command palette. Opens over the page when triggered (typically
 * Cmd+K). Rough-bordered panel, keyboard-navigable, filters commands by query.
 *
 * Rendered inside AppShell so paper-scrollbar / paper-root styles resolve.
 * Close with Escape or by clicking the backdrop.
 */
export function CommandBar({
  open,
  onClose,
  commands,
  placeholder = "Type a command or search…",
  className,
}: CommandBarProps) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Reset state and focus on open
  useEffect(() => {
    if (open) {
      setQuery("");
      setCursor(0);
      // Small delay so the element is mounted before focus
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        (c.description ?? "").toLowerCase().includes(q),
    );
  }, [query, commands]);

  // Arrow-key cursor + Enter to execute
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === "Enter") {
      const cmd = filtered[cursor];
      if (cmd) { cmd.action(); onClose(); }
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[13vh]"
      style={{ backgroundColor: "rgba(30,25,18,0.25)", backdropFilter: "blur(1px)" }}
      onClick={onClose}
    >
      <div
        className={cn("relative w-full max-w-[520px] mx-4", className)}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Rough-bordered panel */}
        <SketchBorder
          fill="#fffdf9"
          stroke="#3a3733"
          strokeWidth={1.8}
          roughness={1.0}
          radius={8}
          shadow={4}
          shadowColor="rgba(0,0,0,0.2)"
          bleed={10}
        />

        <div className="relative z-[1]">
          {/* Search row */}
          <div
            className="flex items-center gap-3 px-4 py-3"
            style={{ borderBottom: "1.5px solid rgba(0,0,0,0.06)" }}
          >
            <Search size={16} className="shrink-0 text-ink-muted" aria-hidden />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => { setQuery(e.target.value); setCursor(0); }}
              onKeyDown={onKeyDown}
              placeholder={placeholder}
              className="flex-1 border-none bg-transparent font-architect text-[15px] text-ink placeholder:font-architect placeholder:text-ink-muted/55 focus:outline-none"
              aria-label="Command search"
            />
            <kbd className="font-architect text-[11px] text-ink-muted/50">esc</kbd>
          </div>

          {/* Results */}
          <div
            ref={listRef}
            className="paper-scrollbar max-h-[320px] overflow-y-auto py-1.5"
          >
            {filtered.length === 0 ? (
              <p className="px-4 py-8 text-center font-kalam text-sm text-ink-muted/60">
                No commands found
              </p>
            ) : (
              filtered.map((cmd, i) => (
                <button
                  key={cmd.key}
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors",
                    i === cursor ? "bg-black/[0.045]" : "hover:bg-black/[0.028]",
                  )}
                  onMouseEnter={() => setCursor(i)}
                  onClick={() => { cmd.action(); onClose(); }}
                >
                  {cmd.icon && (
                    <span className="shrink-0 text-ink-muted/80">{cmd.icon}</span>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="font-architect text-[14px] text-ink">{cmd.label}</div>
                    {cmd.description && (
                      <div className="font-kalam text-[12px] text-ink-muted/75">
                        {cmd.description}
                      </div>
                    )}
                  </div>
                  {cmd.shortcut && (
                    <div className="flex shrink-0 items-center gap-0.5">
                      {cmd.shortcut.map((k, j) => (
                        <kbd
                          key={j}
                          className="inline-flex h-5 min-w-[20px] items-center justify-center rounded px-1 font-architect text-[10px] text-ink-muted/60"
                          style={{ border: "1px solid rgba(0,0,0,0.12)", background: "rgba(0,0,0,0.035)" }}
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
